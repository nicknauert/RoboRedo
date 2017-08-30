const chalk = require('chalk');
const mongoose = require('mongoose');
const Robot = require('./models/Robot.js')
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/robo-redo')


function getAllRobots(){
  return Robot.find()
}

function getRobotByUsername(name){
  return Robot.findOne({ username: name})
}

function getUnemployed(){
  return Robot.find({job:null})
}
function getEmployed(){
  return Robot.find({ job: { $ne: null }})
}

function getBotsBySkill(skill){
  return Robot.find({ skills: skill})
}

function getBotsByCountry(country){
  return Robot.find({ 'address.country': country })
}

function getRobotById(roboId){
  return Robot.findOne({id:roboId})
}

function deleteRobot(roboId){
  return Robot.findOne({ id: roboId }).remove();
  console.log("Hey I deleted that guy.");
}

function createUser(newUser){
  const robo = new Robot(newUser);
  robo.save( function(err){
    console.log(err);
  })
  console.log(chalk.green('New User Created'));
  return Promise.resolve('success')
}

function logout(x){
  x.destroy();
}

module.exports = {
  getAllRobots,
  getRobotById,
  getUnemployed,
  getEmployed,
  getBotsBySkill,
  getBotsByCountry,
  getRobotByUsername,
  deleteRobot,
  logout,
  createUser
}

//mongoimport --db robo-redo --collection robots --drop --file ~/data.json
// db.collection('inventory').find({})
