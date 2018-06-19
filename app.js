var express = require('express');
var app = express();
var path = require('path');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose  = require('mongoose');
var nodemailer = require('nodemailer');


//to serve static files
app.use(express.static(path.join(__dirname, 'public')));

//for register page
app.get('/user-form', function(req, res){
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
  

});


//database connectivity
mongoose.connect('mongodb://localhost:27017/register',function(err,db){
  if(err)
  	throw err;
   console.log("Database created!");
 
});

var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
    name: String,
    email:String,
    phone:String,
    dob: Date
});
var SomeModel = mongoose.model('SomeModel', SomeModelSchema );


// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



//for Data post Request
app.post('/registerUser',function(req,res){
     
        var phone = req.body.phone;
        if(phone.length < 10)
        	res.send('invalid phone number');
       var formObj = {
      "name":req.body.name,
      "email":req.body.email,
      "phone": req.body.phone,
      "dob": req.body.dob
   };  
   var myModel = new SomeModel(formObj);  //new constructor
   console.log(req.body.name);
   console.log(req.body.email);


    myModel.save()
                .then(function () {
                    res.setHeader('Content-Type', 'application/json');
                    sendMail(req.body.email);
                    res.send( "Data stored successfully & Confirmation mail sended");
                }).catch(function (err) {
                	 res.setHeader('Content-Type', 'application/json');
                res.status(400).send("unable to store data");
            });


});

//mailerfunction

function sendMail(email){
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'anubhavg18@gmail.com',
    pass: 'primaryaccount'
  }
});

var mailOptions = {
  from: 'anubhavg18@gmail.com',
  to: email,
  subject: 'Sending Email for Testing ',
  text: 'Welcome!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}



app.set('port', 5000);
app.listen(app.get('port'));
console.log('server start on port 5000');
