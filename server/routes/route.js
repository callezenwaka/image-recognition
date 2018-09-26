const express = require('express')
const Kairos = require('kairos-api');
const multipart = require('connect-multiparty');
const router = express.Router()

// Multiparty middleware
const multipartMiddleware = multipart();

// API Configurations for KAIROS
// let kairos_client = new Kairos('', '');


router.post('/upload', multipartMiddleware, function(req, res) {
    // get base64 version of image
    // then send that to Kairos for training
    let base64image = fs.readFileSync(req.files.image.path, 'base64');
    var params = {
        image: base64image,
        subject_id: req.body.name,
        gallery_name: 'rekognize',
    };
    console.log('sending to Kairos for training');
    kairos_client.enroll(params).then(function(result) {
        console.log('Image Attributes : \n' + result.body );
        return res.json({'status' : true });
    }).catch(function(err) {
        console.log(err);
        return res.json({'status' : false});
    });
});

router.post('/verify', multipartMiddleware, function(req, res) {
    // get base64 version of image
    // then send that to Kairos for recognition
    let base64image = fs.readFileSync(req.files.image.path, 'base64');
    var params = {
        image: base64image,
        gallery_name: 'rekognize',
    };
    console.log('sending to Kairos for recognition');
    kairos_client.recognize(params).then(function(result) {
        console.log('Server responded with : \n' + result);
        return res.json(result.body);
    }).catch(function(err) { 
        console.log(err);
        return res.json({'status' : false});
    });  
});

module.exports = router;