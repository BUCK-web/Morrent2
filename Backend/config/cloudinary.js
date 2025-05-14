const {v2 : cloudinary } = require("cloudinary")
const {config} = require("dotenv")

config()

cloudinary.config({
    cloud_name: process.env.Cloudinary_Cloud_Name,
    api_key: process.env.Cloudinary_API_KEY,
    api_secret: process.env.Cloudinary_API_SECRET,
    secure: true
})



module.exports =  cloudinary;