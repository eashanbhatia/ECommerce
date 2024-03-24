const express = require('express');
const path = require('path');
const app = express();
const PORT = 4444;
const hbs = require('hbs');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose')
require('dotenv').config();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine','hbs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')(
    {
        secret: 'asdasfasfa adad',
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
        //Isse jo sessions honge vo mongo ke server pr jaakr store honge instead of pc
    }
));

const passport = require('passport');
require('./passport/passport');
app.use(passport.initialize());
app.use(passport.session());
app.use('/',require('./routes/user'))   //Routers file is linked here which is further connected to controllers

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to profile.
    res.redirect('/profile');
  });

//We add a middleware which checks if the person accessing is admin or not using the middleware and then only allow it. 
const checkIsAdmin = require('./middleware/isAdmin')
app.use('/admin',checkIsAdmin,require('./routes/admin'))

mongoose.connect(process.env.MONGO_URL).then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running at Port: http://localhost:" + PORT)
    });
})
