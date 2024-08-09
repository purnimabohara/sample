const Users = require("../model/userModel");
const cloudinary = require("cloudinary");
const { sendEmail } = require("../middleware/sendMail");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const generateToken = require("../middleware/auth");
const crypto = require("crypto");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "purnimabohara6@gmail.com",
    pass: "ongp taxt ionv ztnw",
  },
});

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};
const sendVerifyMail = async (firstName, email, user_id) => {
  try {
    const mailOptions = {
      from: "purnimabohara6@gmail.com",
      to: email,
      subject: "Verification Mail",
      html: `<p>Hi, ${firstName},</p>
             <p>Please click <a href="http://localhost:5000/api/user/verify/${user_id}">here</a> to verify your email.</p>`,
    };

    // Use async/await for sending email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email successfully sent:", info.response);

  } catch (error) {
    console.error("Error sending verification email:", error.message);
    // Optionally, rethrow the error if you want to handle it elsewhere
    throw error;
  }
};

// const sendVerifyMail = async (firstName, email, user_id) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       requireTLS: true,
//       auth: {
//         user: "purnimabohara6@gmail.com",
//         pass: "ongp taxt ionv ztnw",
//       },
//     });
//     const mailOptions = {
//       from: "purnimabohara6@gmail.com",
//       to: email,
//       subject: "For Verification mail",
//       html: `<p>Hi, ${firstName} ,Please click here to <a href= "http://localhost:5000/api/user/verify/${user_id}"> Verify </a> your mail.</p>`,
//     };
//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email has been successfully sent:-", info.response);
//       }
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// const createUser = async (req, res) => {
//   // step 1 : Check if data is coming or not
//   console.log(req.body);

//   // step 2 : Destructure the data
//   const { firstName, lastName, email,contactNumber,address, password } = req.body;

//   // step 3 : validate the incomming data
//   if (!firstName || !lastName || !email || !contactNumber || !address || !password) {
//     return res.json({
//       success: false,
//       message: "Please enter all fields.",
//     });
//   }

//   // step 4 : try catch block
//   try {
//     // step 5 : Check existing user
//     const existingUser = await Users.findOne({ email: email });
//     if (existingUser) {
//       return res.json({
//         success: false,
//         message: "User already exists.",
//       });
//     }

//     const spassword = await securePassword(req.body.password);

//     // step 6 : create new user
//     const newUser = new Users({
//       // fieldname : incomming data name
//       firstName: firstName,
//       lastName: lastName,
//       email: email,
//       contactNumber:contactNumber,
//       address:address,
//       password: spassword,
//     });

//     // step 7 : save user and response
//     const userData = await newUser.save();

//     sendVerifyMail(firstName, email, userData._id);

//     res.status(200).json({
//       success: true,
//       message: "User created successfully.Please check your email to verify.",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json("Server Error");
//   }
// };
const createUser = async (req, res) => {
  const { firstName, lastName, email, contactNumber, address, password } = req.body;

  // Validate incoming data
  if (!firstName || !lastName || !email || !contactNumber || !address || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  // Password complexity regex
  const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

  // Validate password complexity
  if (password.length < 8 || password.length > 12) {
    return res.status(400).json({
      success: false,
      message: "Password must be between 8 to 12 characters long.",
    });
  } else if (!complexityRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must include uppercase, lowercase, number, and special character.",
    });
  }

  // Continue with user creation
  try {
    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const spassword = await securePassword(password);

    const newUser = new Users({
      firstName,
      lastName,
      email,
      contactNumber,
      address,
      password: spassword,
    });

    const userData = await newUser.save();

    sendVerifyMail(firstName, email, userData._id);

    res.status(200).json({
      success: true,
      message: "User created successfully. Please check your email to verify.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
};


const verifyMail = async (req, res) => {
  try {
    console.log("Verify Mail Request Params:", req.params); // Check the request parameters
    const updateInfo = await Users.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: { is_verified: 1 },
      }
    );
    console.log("Update Info:", updateInfo); // Check the update info
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Verify Mail Error:", error); // Check the error message
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const loginUser = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  try {
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exist.",
      });
    }

    // Check if account is locked
    if (user.isLocked && user.lockUntil > Date.now()) {
      const lockTimeLeft = Math.round((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({
        success: false,
        message: `Account is temporarily locked. Try again in ${lockTimeLeft} minutes.`,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Increment login attempts and check if the account should be locked
      const attemptsLeft = 3 - user.failedLoginAttempts - 1; // Subtracting 1 since we're about to increment it
      await user.incrementLoginAttempts();

      if (user.failedLoginAttempts + 1 >= 3 && !user.isLocked) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock account for 15 minutes
        user.failedLoginAttempts = 0; // Reset attempts

        // Send an email notifying the user about the lock
        const mailOptions = {
          from: "purnimabohara6@gmail.com",
          to: user.email,
          subject: "Account Locked Due to Multiple Failed Login Attempts",
          html: `<p>Hi ${user.firstName},</p>
                 <p>Your account has been locked for 15 minutes due to multiple failed login attempts. If this wasn't you, please reset your password immediately.</p>`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });

        await user.save();
        return res.status(423).json({
          success: false,
          message: "Too many failed login attempts. Your account has been locked for 15 minutes.",
        });
      } else {
        await user.save();
        return res.status(400).json({
          success: false,
          message: `Invalid credentials. You have ${attemptsLeft} attempt(s) left.`,
        });
      }
    }

    // Check if the password has expired
    const passwordExpiryDays = 90; // Example: password expires in 90 days
    const passwordAge = Date.now() - new Date(user.passwordChangedAt).getTime();
    const passwordExpired = passwordAge > passwordExpiryDays * 24 * 60 * 60 * 1000;

    if (passwordExpired) {
      return res.status(403).json({
        success: false,
        message: "Your password has expired. Please reset your password to continue.",
      });
    }

    // If login is successful, reset loginAttempts and lock status
    if (user.isLocked || user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token: token,
      userData: user,
      message: "User logged in successfully.",
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// const loginUser = async (req, res) => {
//   console.log(req.body);
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Please enter all fields.",
//     });
//   }

//   try {
//     const user = await Users.findOne({ email: email });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User doesn't exist.",
//       });
//     }

//     // Check if account is locked
//     if (user.isLocked && user.lockUntil > Date.now()) {
//       const lockTimeLeft = Math.round((user.lockUntil - Date.now()) / 1000 / 60);
//       return res.status(423).json({
//         success: false,
//         message: `Account is temporarily locked. Try again in ${lockTimeLeft} minutes.`,
//       });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       // Increment login attempts and check if the account should be locked
//       const attemptsLeft = 3 - user.failedLoginAttempts - 1; // Subtracting 1 since we're about to increment it
//       await user.incrementLoginAttempts();

//       if (user.failedLoginAttempts + 1 >= 3 && !user.isLocked) {
//         user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock account for 15 minutes
//         user.failedLoginAttempts = 0; // Reset attempts

//         // Send an email notifying the user about the lock
//         const mailOptions = {
//           from: "purnimabohara6@gmail.com",
//           to: user.email,
//           subject: "Account Locked Due to Multiple Failed Login Attempts",
//           html: `<p>Hi ${user.firstName},</p>
//                  <p>Your account has been locked for 15 minutes due to multiple failed login attempts. If this wasn't you, please reset your password immediately.</p>`,
//         };
//         transporter.sendMail(mailOptions, function (error, info) {
//           if (error) {
//             console.error('Error sending email:', error);
//           } else {
//             console.log('Email sent:', info.response);
//           }
//         });

//         await user.save();
//         return res.status(423).json({
//           success: false,
//           message: "Too many failed login attempts. Your account has been locked for 15 minutes.",
//         });
//       } else {
//         await user.save();
//         return res.status(400).json({
//           success: false,
//           message: `Invalid credentials. You have ${attemptsLeft} attempt(s) left.`,
//         });
//       }
//     }

//     // If login is successful, reset loginAttempts and lock status
//     if (user.isLocked || user.failedLoginAttempts > 0) {
//       user.failedLoginAttempts = 0;
//       user.lockUntil = undefined;
//       await user.save();
//     }

//     const token = generateToken(user._id);

//     res.status(200).json({
//       success: true,
//       token: token,
//       userData: user,
//       message: "User logged in successfully.",
//       isAdmin: user.isAdmin,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Server error. Please try again later.",
//     });
//   }
// };



const forgotPassword = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found.",
      });
    }
    if (user.is_verified === 0) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first.",
      });
    }

    const resetPasswordToken = user.getResetPasswordToken();
    await user.save();

    const frontendBaseUrl =
      process.env.FRONTEND_BASE_URL || "http://localhost:3000";
    const resetUrl = `${frontendBaseUrl}/password/reset/${resetPasswordToken}`;
    const message = `Reset Your Password by clicking on the link below: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset Password",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email}`,
      });
    } catch (error) {
      console.error("Error sending email:", error.message);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    // Generate hashed token from the one in the request params
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Find the user with the reset token that is still valid
    const user = await Users.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or has expired",
      });
    }

    const { password } = req.body;

    // Password complexity regex
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

    // Validate password complexity
    if (password.length < 8 || password.length > 12) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 to 12 characters long.",
      });
    } else if (!complexityRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must include uppercase, lowercase, number, and special character.",
      });
    }

    // Check if the new password matches any password in the history
    for (let entry of user.passwordHistory) {
      const isReusedPassword = await bcrypt.compare(password, entry.password);
      if (isReusedPassword) {
        return res.status(400).json({
          success: false,
          message: "New password cannot be the same as any of the recent passwords.",
        });
      }
    }

    // Update the current password and store it in history
    await user.updatePassword(password);

    // Clear the reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


// const resetPassword = async (req, res) => {
//   try {
//     // Generate hashed token from the one in the request params
//     const resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(req.params.token)
//       .digest("hex");

//     // Find the user with the reset token that is still valid
//     const user = await Users.findOne({
//       resetPasswordToken,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Token is invalid or has expired",
//       });
//     }

//     const { password } = req.body;

//     // Password complexity regex
//     const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

//     // Validate password complexity
//     if (password.length < 8 || password.length > 12) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be between 8 to 12 characters long.",
//       });
//     } else if (!complexityRegex.test(password)) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must include uppercase, lowercase, number, and special character.",
//       });
//     }

//     // Check if the new password matches any password in the history
//     for (let entry of user.passwordHistory) {
//       const isReusedPassword = await bcrypt.compare(password, entry.password);
//       if (isReusedPassword) {
//         return res.status(400).json({
//           success: false,
//           message: "New password cannot be the same as any of the recent passwords.",
//         });
//       }
//     }

//     // Hash the new password and save it to the user
//     const newPassword = await securePassword(password);

//     // Update password history
//     user.passwordHistory.push({ password: user.password, changedAt: new Date() });

//     // Keep only the last 5 passwords in history (or any other number you prefer)
//     if (user.passwordHistory.length > 5) {
//       user.passwordHistory.shift();
//     }

//     // Update the current password
//     user.password = newPassword;

//     // Clear the reset token and expiration
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Password updated successfully.",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error.",
//     });
//   }
// };


const updateUserData = async (req, res) => {
  console.log(req.body);

  // Destructure fields from request body
  const { firstName, lastName, email, contactNumber,address} = req.body;

  // Extract user ID from request parameters
  const userId = req.params.id;
  console.log(userId);
  const user = await Users.findById(userId);

  // Validation: Check if required fields are provided
  if (!firstName || !lastName || !email || !address || !contactNumber) {
    return res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  }

  try {
    // Update user profile
    let avatarUrl = null;
    if (req.files && req.files.avatar) {
      const { avatar } = req.files;
      const uploadedAvatar = await cloudinary.uploader.upload(avatar.path, {
        folder: "avatars",
      });
      if (!uploadedAvatar || !uploadedAvatar.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload avatar to Cloudinary",
        });
      }
      avatarUrl = uploadedAvatar.secure_url;
    } else if (typeof req.body.avatar === "string") {
      // If avatar URL is provided in the request body
      avatarUrl = req.body.avatar;
    }
    await Users.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      email,
      contactNumber,
      address,
      avatar: avatarUrl,
    });
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.contactNumber=req.body.contactNumber || user.contactNumber;
    user.address=req.body.address || user.address;

    user.avatar = req.body.avatarUrl || user.avatar;

    await user.save();
    res.json({
      success: true,
      message: "User profile updated successfully",
      user: user, // Return updated user information
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateUser = async (req, res) => {
  console.log(req.body);
 
  const oldEmail = req.body.oldEmail;
  const newEmail = req.body.newEmail;
  const newPassword = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const address = req.body.address;
  const contactNumber = req.body.contactNumber;
  const isAdmin = req.body.isAdmin;
  let avatarUrl = null;
 
  try {
    if (req.files && req.files.avatar) {
      // If avatar file is uploaded
      const { avatar } = req.files;
      const uploadedAvatar = await cloudinary.uploader.upload(avatar.path, { folder: 'avatars' });
      if (!uploadedAvatar || !uploadedAvatar.secure_url) {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload avatar to Cloudinary',
        });
      }
      avatarUrl = uploadedAvatar.secure_url;
    } else if (typeof req.body.avatar === 'string') {
      // If avatar URL is provided in the request body
      avatarUrl = req.body.avatar;
    }
 
    if (!oldEmail) {
      return res.status(400).json({
        success: false,
        message: "Old email missing",
      });
    }
 
    const user = await Users.findOne({ email: oldEmail });
 
    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
 
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }
 
    user.email = newEmail || user.email;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.contactNumber = contactNumber || user.contactNumber;
    user.avatar = avatarUrl || user.avatar;
 
    if (newEmail && newEmail !== oldEmail) {
      const existingUser = await Users.findOne({ email: newEmail });
      if (existingUser && !existingUser._id.equals(user._id)) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
    }
 
    if (isAdmin !== undefined) {
      user.isAdmin = isAdmin;
    }
 
    await user.save();
    console.log("User data updated successfully");
 
    const userData = await Users.findOne({ email: user.email });
 
    return res.json({
      success: true,
      message: "User data updated successfully",
      userData: userData,
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating user data",
    });
  }
};
 

// const changePassword = async (req, res) => {
//   try {
//     const { oldPassword, newPassword } = req.body;
//     const { userId } = req.params;

//     const user = await Users.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Old password is incorrect.",
//       });
//     }

//     // Check if the new password matches any password in the history
//     for (let entry of user.passwordHistory) {
//       const isReusedPassword = await bcrypt.compare(newPassword, entry.password);
//       if (isReusedPassword) {
//         return res.status(400).json({
//           success: false,
//           message: "New password cannot be the same as any of the recent passwords.",
//         });
//       }
//     }

//     // Password complexity regex
//     const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

//     // Validate new password complexity
//     if (newPassword.length < 8 || newPassword.length > 12) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be between 8 to 12 characters long.",
//       });
//     } else if (!complexityRegex.test(newPassword)) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must include uppercase, lowercase, number, and special character.",
//       });
//     }

//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);

//     // Update password history
//     user.passwordHistory.push({ password: user.password, changedAt: new Date() });

//     // Keep only the last 5 passwords in history (or any other number you prefer)
//     if (user.passwordHistory.length > 5) {
//       user.passwordHistory.shift();
//     }

//     // Update the current password
//     user.password = hashedNewPassword;

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Password changed successfully.",
//     });
//   } catch (error) {
//     console.error("Error changing password:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error.",
//     });
//   }
// };
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { userId } = req.params;

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect.",
      });
    }

    // Check if the new password matches any password in the history
    for (let entry of user.passwordHistory) {
      const isReusedPassword = await bcrypt.compare(newPassword, entry.password);
      if (isReusedPassword) {
        return res.status(400).json({
          success: false,
          message: "New password cannot be the same as any of the recent passwords.",
        });
      }
    }

    // Password complexity regex
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

    // Validate new password complexity
    if (newPassword.length < 8 || newPassword.length > 12) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 to 12 characters long.",
      });
    } else if (!complexityRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must include uppercase, lowercase, number, and special character.",
      });
    }

    // Update the current password and store it in history
    await user.updatePassword(newPassword);

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



module.exports = {
  createUser,
  loginUser,
  verifyMail,
  forgotPassword,
  resetPassword,
  updateUserData,
  updateUser,
  changePassword
};
