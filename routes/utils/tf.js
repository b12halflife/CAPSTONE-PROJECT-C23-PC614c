require("@tensorflow/tfjs-backend-cpu");
require("@tensorflow/tfjs-core");
const tflite = require("tfjs-tflite-node");
const tf = require("@tensorflow/tfjs-node");

var trash_class = [
  { name: "Cardboard", est_trash_point: 300 },
  { name: "Glass", est_trash_point: 500 },
  { name: "Metal", est_trash_point: 1000 },
  { name: "Paper", est_trash_point: 100 },
  { name: "Plastic", est_trash_point: 200 },
  { name: "Trash", est_trash_point: 150 },
];

async function loadModel(buffer) {
  const model = await tflite.loadTFLiteModel(
    "https://github.com/b12halflife/CAPSTONE-PROJECT-C23-PC614c/raw/ML/model.tflite"
  );
  const tensor = tf.tidy(() => {
    const decode = tf.node.decodeImage(buffer, 3);
    const expand = tf.expandDims(decode, 0);
    return expand;
  });
  const output = model.predict(tensor);
  const value = await output.dataSync();
  let array = Array.prototype.slice.call(value);
  let index = array.indexOf(1);
  let trashData = [trash_class[index]];
  // console.log(array, trashData);
  return trashData;
}

module.exports.loadModel = loadModel;
