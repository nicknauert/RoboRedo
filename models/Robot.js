const mongoose = require('mongoose');

const RobotSchema = new mongoose.Schema({
  id: Number,
  username: String,
  name: String,
  password: String,
  job: String,
  avatar: String,
  email: String,
  university: String,
  job: String,
  company: [String],
  skills: Array,
  phone: String,
  address:
   { street_num: String,
     street_name: String,
     city: String,
     state_or_province: String,
     postal_code: String,
     country: String }
})





const Robot = mongoose.model('Robot', RobotSchema)

module.exports = Robot
