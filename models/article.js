const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  cover: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  content : {type : String, required : true},
  images: [{ type: String }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  published: { type: Date },
});

const Article = mongoose.model("Article", articleSchema, "articles");

module.exports = Article; 
