// qrcode
const qr = require("qrcode");
// google cloud bucket
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const gcs = new Storage({
  keyFilename: "service-account.json",
  projectId: "evident-bedrock-381211",
});
// fs
const fs = require("fs");
// path
const path = require("path");

const bucket = gcs.bucket("codeqr_image");

const uploadBucket = async (generateqrId) => {
  let url = "34.101.117.52";
  await qr.toFile(
    path.join(__dirname, `./${generateqrId}.png`),
    `${url}/qrcode/approve/${generateqrId}`,
    { width: 500, height: 500 },
    (err) => {
      if (err) throw err;
    }
  );
  await bucket.upload(path.join(__dirname, `./${generateqrId}.png`));
  await fs.unlink(path.join(__dirname, `./${generateqrId}.png`), (err) => {
    if (err) throw err;
  });
};

module.exports.uploadBucket = uploadBucket;
