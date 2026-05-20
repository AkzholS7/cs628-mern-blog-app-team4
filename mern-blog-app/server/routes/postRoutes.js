const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.post("/", async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

router.get("/add-test", async (req, res) => {
  try {
    const newPost = await Post.create({
      title: "My First Blog",
      content: "This is the first MERN blog post.",
      author: "Akzhol"
    });

    res.json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});