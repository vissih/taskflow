const express = require("express");

const Task = require("../models/Task");

const router = express.Router();


// ── GET TASKS ───────────────────────────
router.get("/", async (req, res) => {
  try {

    const tasks = await Task.find()
      .populate("assigneeId", "name email avatar")
      .populate("projectId", "name color")
      .sort({ createdAt: -1 });

    res.json(tasks);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// ── CREATE TASK ─────────────────────────
router.post("/", async (req, res) => {
  try {

    const task = await Task.create(req.body);

    res.status(201).json(task);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// ── UPDATE TASK ─────────────────────────
router.put("/:id", async (req, res) => {
  try {

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(task);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// ── DELETE TASK ─────────────────────────
router.delete("/:id", async (req, res) => {
  try {

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task deleted"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;