const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const cloudinary = require("../config/cloudinary");
const Car = require("../models/Car");
const Notifications = require("../models/Notifications");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout user
router.post("/logout", (req, res) => {
  res.cookie("token", " ", { maxAge: 0 });
  res.json({ message: "Logged out successfully" });
});

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put("/Updateprofile", auth, async (req, res) => {
  try {
    if (req.body.password) {
      return res.status(401).json({ message: "Password is not allowed" });
    }

    // Check if username is being updated
    if (req.body.username) {
      // Check if username exists for other users
      const existingUser = await User.findOne({
        username: req.body.username,
        _id: { $ne: req.user.id }, // Exclude current user from check
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // Handle profile picture upload
    if (req.body.profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(
        req.body.profilePicture
      );
      req.body.profilePicture = uploadResponse.secure_url;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    }).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Toggle favorite car
router.post("/favorites/:carId", auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; // depending on how `auth` sets it
    const carId = req.params.carId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.favorites.indexOf(carId);

    if (index === -1) {
      user.favorites.push(carId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();

    res.status(200).json({
      message: "Favorites updated successfully",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/favorites", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Await all promises from map
    const favCars = await Promise.all(
      user.favorites.map((carId) => Car.findById(carId))
    );

    res.json({ favorites: user.favorites, Cars: favCars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getNotifications", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all notifications for the user
    let notifications = await Notifications.find({ userId: req.user._id });

    const alreadyHasPhoneMsg = notifications.some(
      (notif) => notif.message === "Phone Number is not available"
    );

    // If no phone number and the message doesn't already exist, add it
    if (!user.phoneNumber && !alreadyHasPhoneMsg) {
      await Notifications.create({
        userId: req.user._id,
        userImage: "./auth.jpeg",
        message: "Phone Number is not available",
      });

      // Fetch updated notifications after inserting
      notifications = await Notifications.find({ userId: req.user._id });
    }

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/sendNotifications", auth, async (req, res) => {
  try {
    const { userId, message, userImage } = req.body;

    await Notifications.create({
      userImage,
      userId,
      message,
    });

    res.status(200).json({ message: "Notification Sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deleteNotification/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    await Notifications.findByIdAndDelete(id);

    res.status(200).json({ message: "Notification Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
