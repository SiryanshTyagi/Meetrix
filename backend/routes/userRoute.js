import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// register new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  let user = await User.findOne({ username });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  let salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  let token = jwt.sign(
    { id: newUser._id, username: newUser.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.status(201).json({ message: "User registered successfully", token });
});

// login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and Password are required" });
  }
  let user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const ismatched = await bcrypt.compare(password, user.password);

  if (!ismatched) {
    return res.status(400).json({ message: "Invalid password" });
  }

  let token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.status(200).json({ message: "Login successful", token });
});

export default router;
