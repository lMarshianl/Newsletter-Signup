var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var https = require("https");
var app = express();

app.use(express.static("Newsletter-Signup/public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname +"/signup.html");
});

app.post("/",function(req, res){
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    var data = {
        members: [{
        email_address: email,
        status: "subscribed",
        merge_field: {
            FNAME: firstName,
            LNAME: lastName
        }
    }
    ]};

    var jsonData = JSON.stringify(data);
    
    var url = 'https://us2.api.mailchimp.com/3.0/lists/9ef4b98a99';

    var options = {
        method: "POST",
        auth:  "logan1:21a3db63d8e31aa5c85c0087bd298e8d-us2"
    };

    var request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

   

});

app.post('/failure', function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server up and running");
});