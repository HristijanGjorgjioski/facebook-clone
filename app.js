const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const flash = require('connect-flash');

const User = require('./models/users');

const app = express();

const MONGO_URI = 'mongodb+srv://fb-clone:12345@cluster0.u2uu1.mongodb.net/fb?retryWrites=true&w=majority';

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: 'sessions'
});
const csrfProtection = csrf({ cookie: true });

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrfProtection);

app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/auth-routes');

app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: false,
  store: store
}))

app.use(flash());

app.use((req, res, next) => {
  let token = req.csrfToken();
  // res.locals.isAuth = req.session.isLoggedIn;
  res.cookie('XSRF-TOKEN', token);
  res.locals.csrfToken = token;
  next();
});

app.use((req, res, next) => {
  if(!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    })
})

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

