const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const auth = require("../middleware/auth");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");

// Get all cars with pagination and filtering
router.get("/all", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = { availability : false } ;

    // Add filters if provided
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.brand) {
      query.brand = req.query.brand;
    }
    if (req.query.minPrice) {
      query.price = { ...query.price, $gte: parseInt(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      query.price = { ...query.price, $lte: parseInt(req.query.maxPrice) };
    }

    const cars = await Car.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Car.countDocuments(query);

    res.json({
      cars,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCars: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get popular cars (based on bookings and ratings)
router.get("/popular", async (req, res) => {
  try {
    const popularCars = await Car.find({ availability : false })
      .sort({
        bookings: -1, // Sort by number of bookings
        rating: -1, // Then by rating
      })
      .limit(8); // Get top 8 popular cars

    res.json(popularCars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recommended cars (based on ratings and bookings)
router.get("/recommended", async (req, res) => {
  try {
    const recommendedCars = await Car.find({ availability : false })
      .sort({
        rating: -1,
        bookings: -1,
      })
      .limit(8);

    res.json(recommendedCars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get cars by category
router.get("/category/:category", async (req, res) => {
  try {
    const cars = await Car.find({ category: req.params.category });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/dashboard", auth, async (req, res) => {
  try {
    const cars = await Car.find({});

    const filteredCarsById = cars.filter(
      (item) => item.userId.toString() === req.user._id.toString()
    );

    res.status(200).json(filteredCarsById);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single car
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a car (admin only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  let uploadArray = [];

  try {
    for (const image in req.body.images) {
      const result = await cloudinary.uploader.upload(req.body.images[image]);
      uploadArray.push(result.secure_url);
    }

    req.body.images = uploadArray;

    const newCar = await Car(req.body);
    const savedCar = await newCar.save();
    res.status(201).json({ savedCar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a car (admin only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/avgRating/:id", async (req, res) => {
  try {
    const { id: carId } = req.params;
    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    const totalRatings = car.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const avgRating =
      car.reviews.length > 0
        ? (totalRatings / car.reviews.length).toFixed(2)
        : "No ratings";

    const ratingInfo = {
      carId: car._id,
      name: car.name,
      avgRating,
      totalReviews: car.reviews.length,
    };

    res.status(200).json(ratingInfo);
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate average rating" });
  }
});

router.post("/ratings/:id", auth, async (req, res) => {
  try {
    const { ratings, comment } = req.body;
    const { id: carId } = req.params;

    if (!ratings || !comment) {
      return res.status(400).json({ message: "Fill in all the details" });
    }

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const user = await User.findById(req.user._id);
    // Add the review to the car's reviews array
    car.reviews.push({
      userId: req.user._id,
      user: user.username,
      rating: ratings,
      comment: comment,
      profilePicture: user.profilePicture,
    });

    await car.save();

    res.status(200).json({
      reviews: {
        user: user.username,
        rating: ratings,
        comment: comment,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a car (admin only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
