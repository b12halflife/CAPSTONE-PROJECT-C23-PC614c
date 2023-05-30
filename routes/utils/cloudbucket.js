// qrcode
const qr = require("qrcode");
// google cloud bucket
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const gcs = new Storage({
  keyFilename: __dirname + "/service-account.json",
  projectId: "evident-bedrock-381211",
});
// fs
const fs = require("fs");

const bucket = gcs.bucket("codeqr_image");

const uploadBucket = async (generateqrId) => {
  let url = "http://localhost:3000";
  await qr.toFile(
    `${generateqrId}.png`,
    `${url}/qrcode/approve/${generateqrId}`,
    { width: 500, height: 500 },
    (err) => {
      if (err) throw err;
    }
  );
  await bucket.upload(`./${generateqrId}.png`);
  await fs.unlink(`./${generateqrId}.png`, (err) => {
    if (err) throw err;
  });
};

module.exports.uploadBucket = uploadBucket;
