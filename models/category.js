const mongoose = require("mongoose");

const categoryScheme = new mongoose.Schema({
  name : {type : String, required : true},
});

const Category = mongoose.model("Category", categoryScheme, "category");

module.exports = Category; 
