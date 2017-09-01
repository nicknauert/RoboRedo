const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

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
  address: {
    street_num: String,
    street_name: String,
    city: String,
    state_or_province: String,
    postal_code: String,
    country: String
  }
})

RobotSchema.pre('save', function(next) {
  const user = this
  if (!user.isModified('password')) {
    next()
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash
      user.updated_at = new Date().toISOString()
      next()
    })
  })
})

RobotSchema.methods.comparePassword = function(pwd, dbPass, done) {
  bcrypt.compare(pwd, dbPass, (err, isMatch) => {
    done(err, isMatch)
  })
}

RobotSchema.statics.findByEmail = function(email, cb) {
  return this.find({
    email: email
  })
}



const Robot = mongoose.model('Robot', RobotSchema)

module.exports = Robot
