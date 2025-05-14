const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Sedan', 'SUV', 'Hatchback', 'Sports', 'Luxury', 'Electric']
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    features: [{
        type: String
    }],
    specifications: {
        engine: String,
        transmission: String,
        fuelType: String,
        mileage: String,
        seats: String,
        color: String
    },
    availability: {
        type: Boolean,
        default: false
    },
    location: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        user: {
            type: String,
            ref: 'User'
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: String,
        date: {
            type: Date,
            default: Date.now
        },
        profilePicture : {
            type : String
        }
    }],
    bookings: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Car = mongoose.model('Car', CarSchema);

module.exports = Car; 