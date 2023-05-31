const fs = require("fs");
const tf = require("./tf");
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const gcs = new Storage({
  keyFilename: __dirname + "/service-account.json",
  projectId: "evident-bedrock-381211",
});
const resizeImg = require("resize-image-buffer");

const bucket = gcs.bucket("waste_image");

function convertBufferToImage(buffer, outputPath) {
  fs.writeFile(outputPath, buffer, async function (err) {
    if (err) {
      console.error("Error converting buffer to image:", err);
      return;
    }
    console.log("Image converted successfully!");
    // Upload image to cloud bucket
    await bucket.upload(outputPath);
    // Remove again from local storage
    fs.unlinkSync(outputPath);
    // Predict image data
  });
}

let getImage = async function (bufferImg, name) {
  const outputPath = `./public/images/${name}`;
  const resizeBuffer = await resizeImg(bufferImg, {
    width: 256,
    height: 256,
  });
  // Remove // if you need to upload image to Cloud Bucket
  // convertBufferToImage(resizeBuffer, outputPath);
  return await tf.loadModel(resizeBuffer);
};

module.exports.getImage = getImage;
