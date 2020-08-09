/* DEPENDENCIES */
require('dotenv').config();
require('./stratigies/discord');

const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const Store = require('connect-mongo')(session);

const app = express();
const PORT = process.env.PORT || 3001

mongoose.connect('mongodb+srv://testdash:testdash@cluster0.w4wjw.mongodb.net/dashboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

app.use(
  session({
    secret: "secret",
    cookie: {
      maxAge: 60000 * 60 * 48,
    },
    resave: false,
    saveUninitialized: false,
    store: new Store({ mongooseConnection: mongoose.connection })
  })
);


/* ROUTES */
const auth = require('./routes/auth')
const discord = require('./routes/discord');

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', auth);
app.use('/discord', discord);

app.listen(PORT, () => console.log(`Running on Port ${PORT}`));

// MONGO URI mongodb+srv://testdash:testdash@cluster0.w4wjw.mongodb.net/dashboard