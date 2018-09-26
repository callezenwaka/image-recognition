const fs = require('fs');
const cors = require('cors');
const express = require('express');
const Kairos = require('kairos-api');
const JSONStream = require('JSONStream');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const multipart = require('connect-multiparty');

//const route = require('./routes/route');
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Multiparty middleware
const multipartMiddleware = multipart();

//app.use('/route', route);

// API Configurations for KAIROS
// let kairos_client = new Kairos('', '');


app.post('/upload', multipartMiddleware, function(req, res) {
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
      console.log('Image Attributes : \n' + result.body);
      return res.json({'status' : true });
  }).catch(function(err) {
      console.log(err);
      return res.json({'status' : false});
  });
});

app.post('/verify', multipartMiddleware, function(req, res) {
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

app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  app.listen(process.env.PORT || 3000)
  console.log('Server started on port: ',process.env.PORT || 3000)

  module.exports = app;