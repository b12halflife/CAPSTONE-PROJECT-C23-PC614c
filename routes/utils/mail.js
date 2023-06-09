const nodemailer = require("nodemailer");

const sendMail = (qrcodeData) => {
  if (qrcodeData.status === "approved") {
    return null;
  }
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "rizky75minecraft@gmail.com",
      pass: "eoksgbmwbtllbfzt",
    },
  });

  let mailOptions = {
    from: {
      name: "Smart Trash Authentication Code",
      address: "rizky75minecraft@gmail.com",
    },
    to: "c295dsx0694@bangkit.academy",
    subject: "Authentication Code for Smart Trash!",
    html: `<p>Here's the Authentication Code for QR Code ID <b>${qrcodeData.qrcodeId}</b></p> 
    <h5>Username : <b>${qrcodeData.username} </b>(${qrcodeData.userId}) </h5> 
    <h5>Estimated Points : ${qrcodeData.est_points} </h5> 
    <h1>${qrcodeData.code}</h1>
      `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports.sendMail = sendMail;
