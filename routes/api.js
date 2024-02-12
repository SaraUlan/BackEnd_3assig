var express = require("express");
var router = express.Router();
import('node-fetch').then(fetchModule => {
  const fetch = fetchModule.default;
});


var { body, validationResult } = require("express-validator");

const User = require("../models/user");
const Article = require("../models/article");
const Weather = require("../models/weather");

// Login api endpoint
router.post('/login', async (req, res) => {
  const user = req.session.user;

  if (user) {
    return res.redirect('/');
  }

  const { username, password } = req.body;

  const existingUser = await User.findOne({ username, password });

  if (!existingUser) {
    return res.status(404).json({ message: 'Username or password is incorrect' }); // Return the error response
  }

  req.session.user = {
    _id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    isAdmin : existingUser.isAdmin
  };

  return res.redirect('/');
});


router.post('/signup', async (req, res) => {
  const user = req.session.user;

  if (user) {
    return res.redirect('/login'); 
  }

  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.status(400).json({ message: 'Username or email already exists' });
  }

  const newUser = new User({
    username: username,
    email: email,
    password: password
  });

  await newUser.save();

  res.status(200).json({ message: 'You have successfully registered' });

});

router.post('/logout', async (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect('/');
  }

  req.session.destroy();

  return res.redirect('/');

})

// All articles api endpoint
router.post('/articles/', async (req, res) => {
  const user = req.session.user;

  if (!user) {
    res.redirect('/login');
  }
});

// Article by id api endpoint
router.post('/articles/:id', async (req, res) => {
  const user = req.session.user;

  if (!user) {
    res.redirect('/login');
  }
});

// All categories api endpoint
router.post('/articles/categories/', async (req, res) => {
  const user = req.session.user;

  if (!user) {
    res.redirect('/login');
  }
});

// Article by category api endpoint
router.post('/articles/:category', async (req, res) => {
  const user = req.session.user;

  if (!user) {
    res.redirect('/login');
  }
});


router.get('/forecast', async (req, res) => {
  const user = req.session.user;

  if (!user) {
      return res.redirect('/login');
  }

  const { city } = req.query;
  console.log(city)

  try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=72fab1f4bd503167d914a95cdf7e4d31`;
      const response = await fetch(url);
      const weatherData = await response.json();

      console.log(weatherData);
      const weather = new Weather({
          city: weatherData.name,
          country: weatherData.sys.country,
          temperature: weatherData.main.temp,
          feelsLike: weatherData.main.feels_like,
          humidity: weatherData.main.humidity,
          windSpeed: weatherData.wind.speed,
          condition: weatherData.weather[0].main,
          weatherDescription: weatherData.weather[0].description,
          sunrise: new Date(weatherData.sys.sunrise),
          sunset: new Date(weatherData.sys.sunset),
          user: user._id
      });

      await weather.save();

      res.json(weatherData);
  } catch (err) {
      console.error('Error fetching weather:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/forecast/history', async (req, res) => {
  const user = req.session.user;

    if (!user) {
        res.redirect('/login');
        return;
    }

    try {
        const history = await Weather.find({ user: user._id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


module.exports = router;
