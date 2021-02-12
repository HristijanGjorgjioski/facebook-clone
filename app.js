const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/auth-routes');

app.use(authRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
