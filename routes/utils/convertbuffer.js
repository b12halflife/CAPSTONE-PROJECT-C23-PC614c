const fs = require("fs");
const tf = require("./tf");
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const gcs = new Storage({
  keyFilename: __dirname + "/service-account.json",
  projectId: "evident-bedrock-381211",
});

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
  convertBufferToImage(bufferImg, outputPath);
  return await tf.loadModel(bufferImg);
};

module.exports.getImage = getImage;
