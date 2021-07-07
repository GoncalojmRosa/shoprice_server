const crypto = require('crypto')
require("dotenv").config();
const { CloudinaryStorage } = require('multer-storage-cloudinary');

var cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: "dnknjm7wh",
    api_key: "636844177185277",
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storageTypes = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpeg','jpg','png'],
    params: async (req, file) => {
        let buf = crypto.randomBytes(16);
        buf = buf.toString('hex');
        let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
        uniqFileName += buf;
        return {
          format: 'jpeg',
          public_id: uniqFileName,
        };
    }
})

module.exports = storageTypes
