const express = require('express');
const path = require('path');

const { rateLimiterUsingThirdParty } = require('../middlewares/rateLimiter');

const cors = require('cors');
const users = require('./users');


module.exports = function(app) {
  app.options('*', cors()) // include before other routes
  app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader("Content-Type", "application/json; charset=UTF-8");
    next();
  });

  // Parse URL-encoded bodies (as sent by HTML forms)
  app.use(express.urlencoded({ extended: true }));

  // Parse JSON bodies (as sent by API clients)
  app.use(express.json({ limit: '50mb' }));

  // Set static folder
  app.use(express.static(path.join(__dirname, "../uploads")));

  app.use('/users', users);


}