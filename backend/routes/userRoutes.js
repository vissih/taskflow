const express = require("express");

const User = require("../models/User");

const router = express.Router();


// GET ALL USERS
router.get("/", async (req, res) => {

  try {

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;