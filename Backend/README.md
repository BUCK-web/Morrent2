# RentCars.com Backend API Documentation

This document provides a comprehensive overview of all available API endpoints in the RentCars.com backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most routes require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Car Routes

### Get All Cars
- **URL**: `/cars/all`
- **Method**: `GET`
- **Description**: Get all cars with pagination and filtering
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 12)
  - `category` (optional): Filter by category
  - `brand` (optional): Filter by brand
  - `minPrice` (optional): Minimum price
  - `maxPrice` (optional): Maximum price
- **Response**:
```json
{
    "cars": [...],
    "currentPage": 1,
    "totalPages": 5,
    "totalCars": 50
}
```

### Get Popular Cars
- **URL**: `/cars/popular`
- **Method**: `GET`
- **Description**: Get top 8 popular cars based on bookings and ratings
- **Response**:
```json
[
    {
        "id": "...",
        "name": "Car Name",
        "brand": "Brand",
        "model": "Model",
        "price": 100,
        "rating": 4.5,
        "bookings": 50,
        ...
    }
]
```

### Get Recommended Cars
- **URL**: `/cars/recommended`
- **Method**: `GET`
- **Description**: Get personalized car recommendations based on user preferences
- **Authentication**: Required
- **Response**: Array of recommended cars

### Get Cars by Category
- **URL**: `/cars/category/:category`
- **Method**: `GET`
- **Description**: Get all cars in a specific category
- **URL Parameters**:
  - `category`: Category name (Sedan, SUV, Hatchback, etc.)
- **Response**: Array of cars in the specified category

### Get Single Car
- **URL**: `/cars/:id`
- **Method**: `GET`
- **Description**: Get details of a specific car
- **URL Parameters**:
  - `id`: Car ID
- **Response**: Car object

### Create New Car (Admin Only)
- **URL**: `/cars`
- **Method**: `POST`
- **Description**: Create a new car listing
- **Authentication**: Required (Admin only)
- **Request Body**:
```json
{
    "name": "Car Name",
    "brand": "Brand",
    "model": "Model",
    "year": 2023,
    "category": "SUV",
    "price": 100,
    "description": "Car description",
    "images": ["image1.jpg", "image2.jpg"],
    "features": ["Feature 1", "Feature 2"],
    "specifications": {
        "engine": "2.0L",
        "transmission": "Automatic",
        "fuelType": "Petrol",
        "mileage": "15 kmpl",
        "seats": 5,
        "color": "Red"
    },
    "location": "New York"
}
```

### Update Car (Admin Only)
- **URL**: `/cars/:id`
- **Method**: `PUT`
- **Description**: Update an existing car listing
- **Authentication**: Required (Admin only)
- **URL Parameters**:
  - `id`: Car ID
- **Request Body**: Same as create car, but all fields are optional

### Delete Car (Admin Only)
- **URL**: `/cars/:id`
- **Method**: `DELETE`
- **Description**: Delete a car listing
- **Authentication**: Required (Admin only)
- **URL Parameters**:
  - `id`: Car ID
- **Response**:
```json
{
    "message": "Car deleted"
}
```

## Authentication Routes

### Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Description**: Register a new user
- **Request Body**:
```json
{
    "username": "username",
    "email": "email@example.com",
    "password": "password"
}
```

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Login user and get JWT token
- **Request Body**:
```json
{
    "email": "email@example.com",
    "password": "password"
}
```

### Get Current User
- **URL**: `/auth/me`
- **Method**: `GET`
- **Description**: Get current user's profile
- **Authentication**: Required
- **Response**: User object

### Update Profile
- **URL**: `/auth/profile`
- **Method**: `PUT`
- **Description**: Update user profile including profile picture
- **Authentication**: Required
- **Request Body**: FormData with the following fields:
  - `username` (optional)
  - `bio` (optional)
  - `phone` (optional)
  - `address` (optional)
  - `profilePicture` (optional): Image file

## Error Responses

All endpoints may return the following error responses:

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

Example error response:
```json
{
    "message": "Error message here"
}
```

## Data Models

### Car Model
```javascript
{
    name: String,
    brand: String,
    model: String,
    year: Number,
    category: String,
    price: Number,
    description: String,
    images: [String],
    features: [String],
    specifications: {
        engine: String,
        transmission: String,
        fuelType: String,
        mileage: String,
        seats: Number,
        color: String
    },
    availability: Boolean,
    location: String,
    rating: Number,
    reviews: [{
        user: ObjectId,
        rating: Number,
        comment: String,
        date: Date
    }],
    bookings: Number,
    createdAt: Date
}
```

### User Model
```javascript
{
    username: String,
    email: String,
    password: String,
    profilePicture: String,
    bio: String,
    phone: String,
    address: String,
    preferences: {
        categories: [String],
        brands: [String]
    },
    role: String,
    createdAt: Date
}
``` 