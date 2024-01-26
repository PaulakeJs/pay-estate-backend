const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    squareft: {
      type: Number,
      required: false,
      default: "n/a",
    },
    garage: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      default: [],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },address:{
      type:String,
      required:true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      default: "active",
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("listings", listingSchema);

module.exports = Listing;
