const express = require('express');
const app = express();
const mustache = require('mustache-Express');
const dal = require('./dal')
const chalk = require('chalk')


app.engine('mustache', mustache())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')

app.use(express.static('public'));


app.get('/', (req, res) => {
  dal.getAllRobots().then(function(robots){
    res.render('index', { bots: robots })
  })
})


app.get('/robots/:id', (req, res) => {
  dal.getRobotById(req.params.id).then( (bot) => {
    res.render('roboEntry', {bot: bot})
  })
})

app.get('/skills/:skill', (req, res) => {
  dal.getBotsBySkill(req.params.skill).then( (robots) => {
    res.render('index', { bots: robots })
  })
})

app.get('/country/:country', (req, res) => {
  dal.getBotsByCountry(req.params.country).then( (robots) => {
    res.render('index', { bots: robots })
  })
})

app.get('/unemployed', (req, res) => {
  dal.getUnemployed().then( (robots) => {
    res.render('index', { bots: robots })
  })
})

app.get('/employed', (req, res) => {
  dal.getEmployed().then( (robots) => {
    res.render('index', { bots: robots })
  })
})

app.listen(3000, () => {
  console.log('Application running on 3000.')
})
