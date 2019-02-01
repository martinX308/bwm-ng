const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/dev');
aws.config.update({
  secretAccessKey:config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  region:'eu-central-1'
})

const s3 = new aws.S3();
const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null,true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG are allowed!'),false);
  }
};

const upload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'bwm-dev-ng',
    acl:'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: 'Testing_Metadata'});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

module.exports = upload;