const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Car = require("../models/Car");
const auth = require("../middleware/auth");
const stripe = require("stripe")(process.env.Stripe_Secret_key);

// Create a new booking
router.post("/", auth, async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;

    // Check if car exists and is available
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    if (!car.available) {
      return res.status(400).json({ message: "Car is not available" });
    }

    // Calculate total price
    const days = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = days * car.price;

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      car: carId,
      startDate,
      endDate,
      totalPrice,
    });

    // Update car availability
    car.available = false;
    await car.save();

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/create-checkout-session", auth, async (req, res) => {
  try {
    const { id, startDate, endDate, totalPrice } = req.body;

    // 1. Validate and fetch the car
    const car = await Car.findById(id);

    if (!car) return res.status(404).json({ error: "Car not found" });

    // 2. Create booking in DB with status 'pending'
    const newBooking = await Booking.create({
      user: req.user._id, // comes from auth middleware
      car: car._id,
      startDate,
      endDate,
      totalPrice,
      status: "pending",
      paymentStatus: "paid",
    });

    // 3. (Optional) Set a flag on the car model if needed
    car.availability = true;
    car.bookings += 1;
    await car.save();

    // 4. Create Stripe session
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${car.name} (${car.year})`,
            description: `Brand: ${car.brand}, Location: ${car.location}`,
            images: car.images?.length ? [car.images[0]] : [],
          },
          unit_amount: parseInt(totalPrice) * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      metadata: {
        bookingId: newBooking._id.toString(),
      },
      success_url:
        "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's bookings
router.get("/user-booking", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const getUserBooking = await Booking.find({ user: userId })
      .populate("car", "name image price")
      .sort("-createdAt");
    res.json(getUserBooking);
  } catch (error) {
    res.json(error);
  }
});

// Get a single booking
router.get("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.find({ car: req.params.id });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is authorized
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(booking);
  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
});

// Update booking status (admin only)
router.put("/:id/status", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = req.body.status;
    if (req.body.status === "cancelled") {
      const car = await Car.findById(booking.car);
      car.available = true;
      await car.save();
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update payment status
router.put("/:id/payment", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is authorized
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.paymentStatus = req.body.paymentStatus;
    if (req.body.paymentStatus === "paid") {
      booking.status = "confirmed";
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
