const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: String,

    image: {
       url: String,
       filename: String
    },

    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    category: {
        type: String,
        enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Camping", "Amazing Nature", "Farms", "Arctic", "Boats", "Domes"],
    }
});

const Listing = new mongoose.model("Listing", listingSchema);
module.exports = Listing;

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await review.deleteMany({_id: { $in: listing.reviews} });
    }
});