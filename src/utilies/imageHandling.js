export const uploadToCloudinary = async (files) => {
  const results = await Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "news-images" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url); // Only save URL
          }
        );
        stream.end(file.buffer);
      });
    })
  );

  return results; // array of image URLs
};