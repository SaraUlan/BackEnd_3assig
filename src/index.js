const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const MongoDBStore = require("connect-mongodb-session")(session);
const apiRouter = require('../routes/api');
const router = require('../routes/routes');
const adminRouter = require('../routes/admin');
const bodyParser = require('body-parser');


const app = express();

const uri =
  "mongodb+srv://saraulantur:e7XvdGr61adFReaX@cluster0.fw6gtsm.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const store = new MongoDBStore({
  uri: uri,
  collection: "sessions",
});

app.use(
  session({
    secret: "1245",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', router);
app.use('/api/', apiRouter);
app.use('/admin/', adminRouter);



const port = 3000;
app.listen(port, () => {
  console.log(`Server running on Port: ${port}`);
});
