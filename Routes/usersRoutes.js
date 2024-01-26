const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

router.post("/new", async (req, res) => {
  try {
    const emailExists = await User.findOne({ email: req.body.email });
    const phoneExists = await User.findOne({ phone: req.body.phone });

    if (emailExists) {
      throw new Error("This email is already in use");
    } else if (phoneExists) {
      throw new Error("This Phone Number Has Already Been Used");
    } else {
      const hash = bcrypt.hashSync(req.body.password, 10);
      req.body.password = hash;

      const newUser = new User(req.body);
      await newUser.save();
      res.send({
        success: true,
        message: "User created successfully",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const valemail = await User.findOne({ email: req.body.email });
    if (!valemail) {
      throw new Error("user does not exist");
    }
    if (valemail.status === "blocked") {
      throw new Error("Your Account Has Been Disabled");
    }
    const valpassword = bcrypt.compareSync(
      req.body.password,
      valemail.password
    );
    if (!valpassword) {
      throw new Error("invalid credentials");
    }

    const token = jwt.sign({ userId: valemail._id }, "pjs", {
      expiresIn: "24h",
    });

    res.send({
      success: true,
      message: "login successful",
      data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/current-user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      success: true,
      message: "user fetched ",
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "error.message",
    });
  }
});

router.get("/current-user-id/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send({
      success: true,
      message: "success",
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.put("/update-user/:id", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "Account Updated Successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-listing-seller/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send({
      success: true,
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      mesage: error.message,
    });
  }
});

router.get("/get-users-all", auth, async (req, res) => {
  try {
    const users = await User.find();
    res.send({
      success: true,
      data: users,
    });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

router.put("/update-user-status/:id", auth, async (req, res) => {
  const { status } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "user update success",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;
