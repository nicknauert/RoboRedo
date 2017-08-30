const express = require('express');
const app = express();
const mustache = require('mustache-Express');
const dal = require('./dal')
const chalk = require('chalk')
const bodyParser = require('body-parser');
const session = require('express-session')

app.engine('mustache', mustache())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')


////////////// MIDDLEWARE //////////////

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

app.use(function(req, res, next){
  if(req.session.usr) {
    req.isAuthenticated = true;
  } else {
    req.isAuthenticated = false;
  }
  console.log(req.isAuthenticated, 'session');
  next();
})


////////// ROUTES /////////////////

app.get('/', (req, res) => {
  if(req.isAuthenticated){
    dal.getAllRobots().then(function(robots){
      console.log('>>>>>Rendering home page');
      res.render('index', { bots: robots });
    })
  } else {
    res.redirect('/login')
  }
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/logout', (req, res) => {
  dal.logout(req.session);
  res.redirect('/login')
})

app.post('/login', (req, res) => {
  if (!req.isAuthenticated) {
   dal.getRobotByUsername(req.body.usernameInput).then(function(robot){
     if(robot.password === req.body.passwordInput){
       console.log(chalk.green('>>>>>>Login accepted. Assigning session.usr'));
       req.session.usr = robot.username;
       req.isAuthenticated = true
       res.redirect('/')
     }
    })
  }
})

app.get('/robots/:id', (req, res) => {
  if(req.isAuthenticated){
    dal.getRobotById(req.params.id).then( (bot) => {
      res.render('roboEntry', {bot: bot})
    })
  } else {
    res.redirect('/login')
  }
})

app.get('/skills/:skill', (req, res) => {
  if(req.isAuthenticated){
    dal.getBotsBySkill(req.params.skill).then( (robots) => {
      res.render('index', { bots: robots })
  })
  } else {
    res.redirect('/login')
  }
})

app.get('/country/:country', (req, res) => {
  if(req.isAuthenticated){
    dal.getBotsByCountry(req.params.country).then( (robots) => {
      res.render('index', { bots: robots })
  })
  } else {
    res.redirect('/login')
  }
})

app.get('/unemployed', (req, res) => {
  if(req.isAuthenticated){
    dal.getUnemployed().then( (robots) => {
      res.render('index', { bots: robots })
  })
  } else {
    res.redirect('/login')
  }
})

app.get('/employed', (req, res) => {
  if(req.isAuthenticated){
    dal.getEmployed().then( (robots) => {
      res.render('index', { bots: robots })
  })
  } else {
    res.redirect('/login')
  }
})

app.get('/delete/:id', (req, res) => {
  if(req.isAuthenticated){
    res.render('delete', { id: req.params.id });
  } else {
    res.redirect('/login');
  }
})

app.post('/delete/:id', (req, res) => {
  if(req.isAuthenticated){
    dal.deleteRobot(req.params.id).then(function(){
      res.redirect('/')
    })
  } else {
    res.redirect('/login');
  }
})

app.get('/edit/:id', (req, res) => {
  if(req.isAuthenticated){
    getRobotById(req.params.id).then(function(bot){
      res.render('edit', { bot })
    })
  } else {
    res.redirect('/login');
  }
})

app.get('/newuser', (req, res) => {
  res.render('newuser');
})

app.post('/newuser', ({ body }, res) => {
  dal.createUser(body).then((newb) => {
    res.send(newb);
  })
})

app.listen(3000, () => {
  console.log('Application running on 3000.')
})
