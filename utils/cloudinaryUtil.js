const cloudinary = require("../config/cloudinary");
exports.cloudinaryUpload = (
  buffer,
  resource_type = "auto",
  folder = "EduFund"
) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type, folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      })
      .end(buffer);
  });

exports.cloudinaryDelete = async (public_id) =>
  await cloudinary.uploader.destroy(public_id);
