const express = require("express");
var multer = require("multer");
var mime = require("mime-types");
const crypto = require("crypto");
var aws = require("aws-sdk");
var multerS3 = require("multer-s3");

const app = express();
const MAX_NUMBERS_OF_FILE_UPOAD_AT_A_TIME = 10;


aws.config.update({
  secretAccessKey: "002mTloca2gNq9G8dNoFT9bpBouL7TxwYEt1WpZ/",
  accessKeyId: "AKIAW4PCWWKZNHNQHOUI",
  region: "ap-south-1",
});

var s3 = new aws.S3();


var storage = multerS3({
  s3: s3,
  bucket: "kuikform",
  key: function (req, file, cb) {
    cb(
      null,
      `${Date.now()}${crypto.randomBytes(16).toString("hex")}${file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)}`
    );
  },
  acl : "public-read",
  contentType :function (req, file, cb){
    cb(null,file.mimetype);
  }
});

var upload = multer({ storage: storage });

app.post("/upload", upload.array("files",MAX_NUMBERS_OF_FILE_UPOAD_AT_A_TIME), function (req, res) {
  var data = {};
  var status = 200;
  var filesList = [];
  var list = req.files;

  if (list == undefined) {
    data["message"] = "upload failed";
    status = 400;
  } else {
  
    req.files.forEach(element => {
      filesList.push(element.location);
    });
    data["message"] = "upload successful";
    data["files"] = filesList;
  }
  res.status(status);
  res.send(data);
});

app.listen(8080);
