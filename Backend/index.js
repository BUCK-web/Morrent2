const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const carRoutes = require('./routes/carRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const path = require("path")

const _dirname = path.resolve()
dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true , parameterLimit : 100000, limit : "500mb" }));
app.use(cookieParser());

// Routes
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use(express.static(path.join(_dirname , "/Frontend/dist")))
app.get("*all",(req,res)=>{
  res.sendFile(path.resolve(_dirname , "Frontend", "dist", "index.html"))
})



// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {  
  console.log(`Server is running on port http://localhost:${PORT}`);
}); 