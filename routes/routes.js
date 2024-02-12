var express = require("express");
const mongoose = require('mongoose');
var router = express.Router();
var { body, validationResult } = require("express-validator");

const User = require("../models/user");
const Article = require('../models/article');
const Category = require('../models/category');
const Weather = require('../models/weather');

// Main page
router.get("/", async (req, res) => {
  const user = req.session.user;
  console.log(user)
  const categories = await Category.find();
  const articles = await Article.find().sort('-published')
  const locals = {
    user: user,
    categories: categories,
    main_art: articles[0],
    articles: articles.slice(1, 20),
    popular: articles.slice(20, 30),
  }
  res.render("main", locals);
});

// Registration page
router.get("/signup", async (req, res) => {
  const user = req.session.user;

  const categories = await Category.find();
  if (user) {
    res.redirect('/');
  }
  const locals = {
    user: user,
    categories: categories
  }
  res.render("signup", locals);
});

// Login Page
router.get("/login", async (req, res) => {
  const user = req.session.user;
  const categories = await Category.find();
  if (user) {
    res.redirect('/');
  }

  const locals = {
    user: user,
    categories: categories
  }
  res.render("login", locals);
});

// Returns all articles
router.get("/articles", async (req, res) => {
  try {
    const user = req.session.user;
    // const articles = await Article.find();
    const articles = [
      { _id: 1, title: "First", cover: "https://via.placeholder.com/200x200", author: "Sara Ulan", content: "Yes", images: "https://via.placeholder.com/200x200", category: ['yes', 'no'], published: Date.now() },
    ]
    const categories = await Category.find();

    const locals = {
      user: user,
      articles: articles,
      categories: categories
    }
    res.render("articles", locals);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).send("Internal server error");
  }
});

// Returs articles by category
router.get('/articles/:category', async (req, res) => {
  const user = req.session.user;
  const categories = await Category.find();
  const category = req.params.category;
  const articles = await Article.find({ category: category }).populate('category');

  if (!user) {
    res.redirect('/login');
  }

  const locals = {
    user: user,
    articles: articles,
    categories: categories
  }

  res.render('articles', locals);
});

// Returns article by id
router.get('/article/:id', async (req, res) => {
  const user = req.session.user;
  const id = req.params.id;
  const articleId = new mongoose.Types.ObjectId(id);
  let article = await Article.findOne({ _id: articleId });
  if (!article) {
    article = {
      title: 'Not found',
    }
  }
  const categories = await Category.find();
  if (!user) {
    res.redirect('/login');
  }

  const locals = {
    user: user,
    article: article,
    categories: categories
  }

  res.render('article', locals);

});

router.get('/forecast', async (req, res) => {
  const user = req.session.user;

  const categories = await Category.find();

  const forecasts = await Weather.find({user : user._id});
  if (!user) {
    return res.redirect('/login');
  }

  const locals = {
    user: user,
    categories: categories,
    forecasts : forecasts
  }

  res.render('weather', locals);
})


module.exports = router;
