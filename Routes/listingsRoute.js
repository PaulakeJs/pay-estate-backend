const router = require("express").Router();
const Listing = require("../models/listingsModel");
const auth = require("../middlewares/auth");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const nodemailer = require("nodemailer");
//add new product

router.post("/new", auth, async (req, res) => {
  try {
    const newlisting = new Listing(req.body);
    await newlisting.save();
    res.send({
      success: true,
      message: "listing uploaded successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all product
router.get("/get-listing", auth, async (req, res) => {
  try {
    const newuserId = new mongoose.Types.ObjectId(req.body.userId);
    const listing = await Listing.find({ seller: newuserId }).sort({
      createdAt: -1,
    });
    res.send({
      success: true,
      message: "all listing found",
      data: listing,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-listing-by-id/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const newuserId = new mongoose.Types.ObjectId(req.body.userId);
    if (newuserId.equals(listing.seller)) {
      res.send({
        success: true,
        data: listing,
      });
    } else {
      res.send({
        success: false,
        message: "You cant't do that",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/delete-listing/:id", auth, async (req, res) => {
  try {
    const deletelisting = await Listing.findByIdAndDelete(req.params.id);
    if (deletelisting) {
      res.send({
        success: true,
        message: "your listing has been deleted",
      });
    } else {
      throw new Error("Listing Not Found");
    }
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.put("/edit-listing/:id", auth, async (req, res) => {
  try {
    await Listing.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "product updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

router.post(
  "/upload-product-image",
  auth,
  multer({ storage: storage }).single("file"),
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "payestate",
      });
      const listingId = req.body.listingId;
      await Listing.findByIdAndUpdate(listingId, {
        $push: { images: result.secure_url },
      });
      res.send({
        success: true,
        message: "image upload success",
        data: result,
      });
    } catch (error) {
      res.send({
        success: false,
        error,
      });
    }
  }
);
router.get("/get-onelisting-by-id/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("seller");
    res.send({
      success: true,
      message: "Product fetched successfully",
      data: listing,
    });
  } catch (error) {
    console.error(error); // Log the error to the console
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/general/listing", async (req, res) => {
  try {
    const listing = await Listing.find({ status: "active" }).sort({
      createdAt: -1,
    });
    res.send({
      success: true,
      data: listing,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/admin-general/listing", auth, async (req, res) => {
  try {
    const listing = await Listing.find().populate("seller").sort({
      createdAt: -1,
    });
    res.send({
      success: true,
      data: listing,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.put("/admin-update-listing-status/:id", auth, async (req, res) => {
  const { status } = req.body;
  try {
    await Listing.findByIdAndUpdate(req.params.id, { status });
    res.send({
      success: true,
      message: "update success",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/tour", auth, async (req, res) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "payestate3@gmail.com",
        pass: "aqcreedpdggrsfbx",
      },
    });
    const mailOptions = {
      from: "payestate@gmail.com",
      to: req.body.to,
      subject: req.body.subject,
      text: `
      Hello my name is ${req.body.name} am intrested in the ${req.body.subject} thats 
      located at ${req.body.location} , address : ${req.body.address}
      you can contect me on ${req.body.phone} and on ${req.body.email}
      Thanks
      `,
    };
    await transport.sendMail(mailOptions);
    res.send({
      sucess: true,
      message: "Your Request For The Tour Has Been Sent",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/filter-search", auth, async (req, res) => {
  try {
    const search = await Listing.find({
      bedrooms: req.body.beds,
      bathrooms: req.body.baths,
      price: req.body.price,
    });
    res.send({
      success: true,
      data: search,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
router.post("/address-search", auth, async (req, res) => {
  try {
    const search = await Listing.find({ address: req.body.address });
    res.send({
      success: true,
      data: search,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
