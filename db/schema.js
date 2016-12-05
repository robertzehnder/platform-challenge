var mongoose = require("mongoose")
mongoose.connect('mongodb://localhost/socialtables')

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("Database Connected");
})

var Schema = mongoose.Schema

// var EventSchema = new Schema({
//     name: String,
//     start: Date,
//     end: Date
// })

var UserSchema = new Schema({
  name: String,
  password: String,
  admin: Boolean
});

var EventSchema = new Schema({
  data: {
    name: String,
    start: Date,
    end: Date
  }
})

var EventSchemaModel = mongoose.model("EventSchemaModel", EventSchema)
var UserSchemaModel = mongoose.model("UserSchemaModel", UserSchema)

module.exports = {
  'secret': 'ilovescotchyscotch',
  EventSchemaModel,
  UserSchemaModel
}
