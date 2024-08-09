

// const mongoose = require('mongoose');
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const Schema = mongoose.Schema;
// const bcrypt = require('bcrypt');

// const userSchema = new Schema({
//   firstName: {
//     type: String,
//     required: true,
//   }, 
//   lastName: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   contactNumber: {
//     type: Number,
//     required: false,
//   },
//   address: {
//     type: String,
//     required: false,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   isAdmin: {
//     type: Boolean,
//     default: false,
//   },
//   avatar: {
//     type: String,
//   },
//   is_verified: {
//     type: Number,
//     default: 0
//   },
//   booking: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: 'bookings',
//     },
//   ],
//   token: {
//     type: String,
//     default: ''
//   },
//   resetPasswordToken: String,
//   resetPasswordExpire: Date,
//   failedLoginAttempts: {
//     type: Number,
//     default: 0
//   },
//   lockUntil: {
//     type: Date
//   },
//   passwordHistory: [
//     {
//       password: String,
//       changedAt: Date,
//     }
//   ],
// }, { timestamps: true });

// // Virtual field to check if the account is locked
// userSchema.virtual('isLocked').get(function () {
//   return !!(this.lockUntil && this.lockUntil > Date.now());
// });

// // Method to increment login attempts and handle account locking
// userSchema.methods.incrementLoginAttempts = function () {
//   if (this.lockUntil && this.lockUntil < Date.now()) {
//     return this.updateOne({
//       $set: { failedLoginAttempts: 1 },
//       $unset: { lockUntil: 1 },
//     });
//   }
//   const updates = { $inc: { failedLoginAttempts: 1 } };
//   if (this.failedLoginAttempts + 1 >= 3 && !this.isLocked) {
//     updates.$set = { lockUntil: Date.now() + 15 * 60 * 1000 }; // 15 minutes lock
//   }
//   return this.updateOne(updates);
// };

// // Method to compare the provided password with the stored password
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// // Method to generate a reset password token
// userSchema.methods.getResetPasswordToken = function () {
//   // Generate a reset token
//   const resetToken = crypto.randomBytes(20).toString("hex");

//   // Hash the token and set it to resetPasswordToken field
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   // Set the expiration time for the token (10 minutes from now)
//   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

//   return resetToken; // Return the unhashed token
// };

// // Method to check if the new password is reused
// userSchema.methods.isPasswordReused = async function (newPassword) {
//   for (let history of this.passwordHistory) {
//     const isMatch = await bcrypt.compare(newPassword, history.password);
//     if (isMatch) {
//       return true;
//     }
//   }
//   return false;
// };

// // Method to update the password and store it in the history
// userSchema.methods.updatePassword = async function (newPassword) {
//   const hashedNewPassword = await bcrypt.hash(newPassword, 10);

//   // Update the password history
//   this.passwordHistory.push({ password: this.password, changedAt: new Date() });

//   // Keep only the last 5 passwords in history
//   if (this.passwordHistory.length > 5) {
//     this.passwordHistory.shift();
//   }

//   // Update the current password
//   this.password = hashedNewPassword;

//   await this.save();
// };

// const Users = mongoose.model('users', userSchema);

// module.exports = Users;
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  }, 
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: Number,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
  },
  is_verified: {
    type: Number,
    default: 0
  },
  booking: [
    {
      type: Schema.Types.ObjectId,
      ref: 'bookings',
    },
  ],
  token: {
    type: String,
    default: ''
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  passwordHistory: [
    {
      password: String,
      changedAt: Date,
    }
  ],
}, { timestamps: true });

// Virtual field to check if the account is locked
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Method to increment login attempts and handle account locking
userSchema.methods.incrementLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { failedLoginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }
  const updates = { $inc: { failedLoginAttempts: 1 } };
  if (this.failedLoginAttempts + 1 >= 3 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 15 * 60 * 1000 }; // 15 minutes lock
  }
  return this.updateOne(updates);
};

// Method to compare the provided password with the stored password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate a reset password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate a reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the token and set it to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the expiration time for the token (10 minutes from now)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken; // Return the unhashed token
};

// Method to check if the new password is reused
userSchema.methods.isPasswordReused = async function (newPassword) {
  for (let history of this.passwordHistory) {
    const isMatch = await bcrypt.compare(newPassword, history.password);
    if (isMatch) {
      return true;
    }
  }
  return false;
};

// Method to update the password and store it in the history
userSchema.methods.updatePassword = async function (newPassword) {
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // Update the password history
  this.passwordHistory.push({ password: this.password, changedAt: new Date() });

  // Keep only the last 5 passwords in history
  if (this.passwordHistory.length > 5) {
    this.passwordHistory.shift();
  }

  // Update the current password
  this.password = hashedNewPassword;

  // Update the password changed date
  this.passwordChangedAt = new Date();

  await this.save();
};

// Method to check if the password has expired
userSchema.methods.isPasswordExpired = function() {
  const expirationDays = 1; // Change this to the number of days you prefer
  if (!this.passwordChangedAt) return false;
  const passwordAge = Date.now() - this.passwordChangedAt.getTime();
  return passwordAge > expirationDays * 24 * 60 * 60 * 1000;
};

const Users = mongoose.model('users', userSchema);

module.exports = Users;
