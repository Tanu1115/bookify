const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'dmfrefnul',
    api_key: '885223265451536',
    api_secret: 'nOXmbVmGqXCNfy8WOpg1EY_DLsM'
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: () =>({
        folder:'Bookify_Covers',
        allowed_formats:['jpg','png','jpeg']
    })
});
module.exports = {cloudinary,storage};