const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local')
const Robot = require('./models/Robot.js')
const chalk = require('chalk')

passport.serializeUser((user, done) => {
  console.log(chalk.green("Serialized User: " + user));
  done(null, user._id)
})

passport.deserializeUser((id, done) => {
  Robot.findById(id, (err, user) => {
    done(err, user)
  })
})


////////LocalStrategy

passport.use(new LocalStrategy( (username, password, done) => {
  Robot.findOne({ username: username.toLowerCase() }, {password: password}, (err, user) => {
    console.log("user: " + user);
    if (!user) {
      console.log("No User");
      return done(null, false)
    }
    console.log("user.password: " + user.password);
    user.comparePassword(password, user.password, (err, isMatch) => {

      if (err) {
        console.log(err);
        return done(err)
      }
      if (isMatch) {
        console.log("Is Authed");
        return done(null, user)
      }
      return done(null, false)
    })
  })
}))



const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.session.Auth = true
    return next()
  }
  return next()
}

  module.exports = { isAuthenticated }
