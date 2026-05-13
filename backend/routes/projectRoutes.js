const express = require("express");

const Project = require("../models/Project.js");

const router = express.Router();


// ── GET ALL PROJECTS ─────────────────────
router.get("/", async (req, res) => {
  try {

    const projects = await Project.find()
      .populate("members", "name email avatar role")
      .sort({ createdAt: -1 });

    res.json(projects);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });
  }
});

// ── UPDATE PROJECT ─────────────────────
router.put("/:id", async (req, res) => {
  try {

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(project);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });
  }
});

// ── CREATE PROJECT ─────────────────────
router.post("/", async (req, res) => {
  try {

    const project = await Project.create(req.body);

    res.status(201).json(project);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// ── DELETE PROJECT ─────────────────────
router.delete("/:id", async (req, res) => {
  try {

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      message: "Project deleted"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;