const express = require('express');
const app = express();
const mustache = require('mustache-Express');
const dal = require('./dal')
const chalk = require('chalk')
const bodyParser = require('body-parser');
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')(session)
const { isAuthenticated } = require('./passport.js')

app.engine('mustache', mustache())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')


////////////// MIDDLEWARE //////////////

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://localhost:27017/sesh',
    autoreconnect: true,
    clear_interval: 3600
  })
}))

app.use(passport.initialize())
app.use(passport.session())

////////// ROUTES /////////////////

app.get('/', dal.loggedIn, (req, res) => {
  dal.getAllRobots().then(function(robots) {
    console.log('>>>>>Rendering home page');
    res.render('index', { bots: robots });
  })
})

app.get('/login', (req, res) => {
  res.render('login');
})

app.post('/login', (req, res, next) => {
  console.log("Login route");
    passport.authenticate('local', (err, robot, info) => {
      console.log("App.js >" + robot);
      if (err) {
        console.log(err);
        return next(err)
      }
      if (!robot) {
        console.log("No Robot");
        return res.redirect('/login')
      }
      req.logIn(robot, (err, obj) => {
        if (err) {
          console.log(err);
          return next(err)
        }
        res.redirect('/')
      })
    })(req, res, next)
  })


app.get('/logout', dal.loggedIn, (req, res) => {
  req.logout()
  res.redirect('/login')
})

app.get('/robots/:id', dal.loggedIn, (req, res) => {
  console.log(req.user);
  if(req.params.id == req.user._id){
    dal.getRobotById(req.params.id).then((bot) => {
      res.render('selfEntry', { bot: bot })
    })
  } else {
    dal.getRobotById(req.params.id).then((bot) => {
      res.render('roboEntry', { bot: bot })
    })
  }
})

app.get('/skills/:skill', dal.loggedIn, (req, res) => {
  dal.getBotsBySkill(req.params.skill).then((robots) => {
    res.render('index', {
      bots: robots
    })
  })
})

app.get('/country/:country', dal.loggedIn, (req, res) => {
  dal.getBotsByCountry(req.params.country).then((robots) => {
    res.render('index', {
      bots: robots
    })
  })
})

app.get('/unemployed', dal.loggedIn, (req, res) => {
  dal.getUnemployed().then((robots) => {
    res.render('index', {
      bots: robots
    })
  })
})

app.get('/employed', dal.loggedIn, (req, res) => {
  dal.getEmployed().then((robots) => {
    res.render('index', {
      bots: robots
    })
  })
})

app.get('/delete/:id', dal.loggedIn, (req, res) => {
  res.render('delete', {
    id: req.params.id
  });

})

app.post('/delete/:id', dal.loggedIn, (req, res) => {
  dal.deleteRobot(req.params.id).then(function() {
    res.redirect('/')
  })
})

app.get('/edit/:id', dal.loggedIn, (req, res) => {
  if(req.params.id == req.user._id){
    dal.getRobotById(req.params.id).then(function(bot) {
      res.render('edit', { bot })
    })
  } else {
    res.redirect('/robots/:' + req.params.id)
  }
})


app.post('/edit/:id', dal.loggedIn, (req, res) => {
  const id = req.params.id;
  const newRobot = req.body;
  dal.editRobot(id, newRobot).then(function(robot){
    res.redirect('/')
  })
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
