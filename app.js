const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const app = express();

const MONGO_URI = 'mongodb+srv://fb-clone:12345@cluster0.u2uu1.mongodb.net/fb?retryWrites=true&w=majority';

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/auth-routes');

app.use(authRoutes);

mongoose.connect(
  MONGO_URI, 
  {useNewUrlParser: true, useUnifiedTopology: true}
)
.then(result => {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
})
.catch(err => {
  console.log(err);
})

