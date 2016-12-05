var Schema = require("./schema.js");
var evt = Schema.EventSchemaModel
var user = Schema.UserSchemaModel

evt.remove({}, err => {
  if(err){
    console.log(err)
  }
});

user.remove({}, err => {
  if(err){
    console.log(err)
  }
});

var rob = new user({
  name: 'rob',
  password: 'wordpass',
  admin: true
});

rob.save()

// Javascript dates - http://www.w3schools.com/jsref/jsref_obj_date.asp
// Create dates to place into new event instances

var start1 = new Date(2016, 12, 01, 17, 00, 00, 00);
var end1 = new Date(2016, 12, 01, 18, 00, 00, 00);

var start2 = new Date(2016, 12, 01, 09, 00, 00, 00);
var end2 = new Date(2016, 12, 01, 17, 00, 00, 00);

var start3 = new Date(2016, 12, 01, 18, 30, 00, 00);
var end3 = new Date(2016, 12, 01, 21, 00, 00, 00);

// Create new event objects

// var event1 = new evt({
//   name: "Social Tables Meetup",
//   start: start1,
//   end: end1
// })
//
// var event2 = new evt({
//   name: "General Assembly Class Day",
//   start: start2,
//   end: end2
// })
//
// var event3 = new evt({
//   name: "1776 Meetups",
//   start: start3,
//   end: end3
// })

var event1 = new evt({
  data: {
    name: "Social Tables Meetup",
    start: start1,
    end: end1
  }
})

var event2 = new evt({
  data: {
    name: "General Assembly Class Day",
    start: start2,
    end: end2
  }
})

var event3 = new evt({
  data: {
    name: "1776 Meetups",
    start: start3,
    end: end3
  }
})


event1.save()
event2.save()
event3.save()
