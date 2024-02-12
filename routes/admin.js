var express = require("express");
var router = express.Router();
var { body, validationResult } = require("express-validator");

const Article = require("../models/article"); 
const Category = require('../models/category');

router.get("/", async (req, res) => {
  const user = req.session.user;
  if(!user || user.isAdmin === false){
    res.redirect('/login');
  }
  const categories = await Category.find();
  const articles = await Article.find({}).populate('category').sort('-published');
  const locals = {
    user: user,
    categories: categories,
    articles : articles
  }
  res.render('admin', locals);
});

router.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find();
    var locals = {
      articles: articles,
    };
    res.render("admin", locals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post(
  "/article/add_article",
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ messages: errors.array() });
    }

    try {
      const { title, author, cover, category, content, images, published } = req.body;
      const article = new Article({ cover, title, author, content, images, category, published });
      await article.save();
      res.status(201).json(article);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error });
    }
  }
);

router.patch("/article/:id", async (req, res) => {
  try {
    console.log(req.body);
    const { title, author, cover, category, content, images, published } = req.body;
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { title, author, content, cover, category, images, published },
      { new: true }
    );
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(updatedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/article/:id", async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (!deletedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post('/add_category', async (req, res) =>{
  try{
    const { name } = req.body;
    console.log(name);
  
    const category = new Category({
      name : name,
    });
  
    await category.save();
    res.status(200).json({message: "Category added successfully", category : category});

  }catch(error){
    res.status(400).json({message : 'Something went wrong', error: error});
  }
});

module.exports = router;
