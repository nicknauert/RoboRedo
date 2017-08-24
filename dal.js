const chalk = require('chalk');
const mongoose = require('mongoose');
const Robot = require('./models/Robot.js')
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/robo-redo')


function getAllRobots(){
  return Robot.find()
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
  return Robot.find({ 'address.country': country})
}

function getRobotById(roboId){
  return Robot.findOne({id:roboId})
}

module.exports = {
  getAllRobots,
  getRobotById,
  getUnemployed,
  getEmployed,
  getBotsBySkill,
  getBotsByCountry
}

//mongoimport --db robo-redo --collection robots --drop --file ~/data.json
// db.collection('inventory').find({})
