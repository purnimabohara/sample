const Rating = require("../model/ratingModel");
const Item = require("../model/itemModel");

const updateProductAverageRating = async (itemID) => {
    try {
        const ratings = await Rating.find({ itemID });
        const totalRatings = ratings.length;
        const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

        await Item.findByIdAndUpdate(itemID, {
            averageRating,
            ratingCount: totalRatings
        });
    } catch (error) {
        console.error('Error updating average rating:', error);
    }
};

const upsertRating = async (req, res) => {
    const { itemID, userID, rating } = req.body;
    console.log("Received data:", { itemID, userID, rating });

    try {
        if (!itemID || !userID || !rating) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required details: itemID, userID, rating"
            });
        }

        let existingRating = await Rating.findOne({ userID, itemID });

        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
        } else {
            const newRating = new Rating({
                userID,
                itemID,
                rating
            });
            await newRating.save();
        }

        await updateProductAverageRating(itemID);

        return res.status(201).json({
            success: true,
            message: "Rating saved successfully",
            data: {
                userID,
                itemID,
                rating
            }
        });
    } catch (error) {
        console.error('Error saving rating:', error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
const fetchUserRatings = async (req, res) => {
    const { userID } = req.params; // Assuming userID is passed as a parameter

    try {
        const userRatings = await Rating.find({ userID });

        return res.status(200).json({
            success: true,
            message: "User ratings fetched successfully",
            data: userRatings
        });
    } catch (error) {
        console.error('Error fetching user ratings:', error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    upsertRating,
    updateProductAverageRating,
    fetchUserRatings
};
