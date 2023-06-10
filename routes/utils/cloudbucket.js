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
  let url = "https://evident-bedrock-381211.et.r.appspot.com";
  await qr.toFile(
    `/tmp/${generateqrId}.png`,
    `${url}/qrcode/approve/${generateqrId}`,
    { width: 500, height: 500 },
    (err) => {
      if (err) throw err;
    }
  );
  await bucket.upload(`/tmp/${generateqrId}.png`);
  await fs.unlink(`/tmp/${generateqrId}.png`, (err) => {
    if (err) throw err;
  });
};

module.exports.uploadBucket = uploadBucket;
