const mongoose = require('mongoose');

const RobotSchema = new mongoose.Schema({
  id: Number,
  username: String,
  name: String,
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

// RobotSchema.statics.getEmployed = function(job, cb) {
//   return this.find({job: {$ne: {'null'}}})
// }



const Robot = mongoose.model('Robot', RobotSchema)

module.exports = Robot
