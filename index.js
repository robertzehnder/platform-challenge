var Schema = require("./db/schema.js");
var express = require('express');
var mongoose = require("mongoose")
var express = require("express")
var bodyParser = require("body-parser");
var pkg = require("./package.json")
var app = express();

var evt = Schema.EventSchemaModel

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


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



module.exports = app;
