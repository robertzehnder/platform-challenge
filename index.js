var Schema      = require("./db/schema.js");
var express     = require('express');
var mongoose    = require("mongoose")
var express     = require("express")
var bodyParser  = require("body-parser");
var pkg         = require("./package.json")
var jwt         = require("jsonwebtoken")

var app = express();

var evt = Schema.EventSchemaModel
var user = Schema.UserSchemaModel

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('superSecret', Schema.secret); // secret variable

app.listen(9999, function () {
  console.log('Example app listening on port 9999!');
});

//------
//Routes
//------

//pick ES6 or not and make it consistent

app.get('/', function (req, res) {
  version = pkg.version
  homeObject = {
    "title": "Events API",
    "version": version,
    "status": "ok"
  }
  res.json(homeObject);
});

app.get('/events', function (req, res) {
  evt.find({}, (err,events) => {
    res.json(events);
  })
});

app.get('/secrets', function (req, res) {
  res.json({"secrets": ["The Answer is 42."]})
});

app.get('/events/:id', function (req, res) {
  evt.find({_id: req.params.id}, (err,events) => {
    res.json(events);
  })
});

// Used this article as a reference to return mutiple JSON objects in a post
// http://stackoverflow.com/questions/35488386/post-multiple-json-objects-simultaneously-with-express-and-postman

app.post("/events", (req,res) => {
  evt.create(req.body.data).then(function(newEvents){
    var inserted = []
    for (newEvt of newEvents) {
      inserted.push(newEvt._id)
    }
    res.json({inserted});
  })
})

app.put('/events/:id', (req,res) => {
  evt.findOneAndUpdate({_id: req.params.id}, req.body.data, {new: true}).then(function() {
    res.json(req.body.data)
  })
})

app.delete('/events/:id', (req,res) => {
  evt.findOneAndRemove({_id: req.params.id}).then(function() {
    res.json({"deleted": [req.params.id]})
  })
})

// https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
// Used this site to do the web tokens


app.post('/authenticate', function(req, res) {

  // find the user
  user.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {8
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});


// route middleware to verify a token
app.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
});

module.exports = app;
