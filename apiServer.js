"use strict";
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// APIs
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bookshop');

var db = mongoose.connection;
db.on('error', console.error.bind(console, '# MongoDB - connection error: '));
// SET UP SESSIONS

app.use(session({
  secret: 'mySecretString',
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({ mongooseConnection: db, ttl: 2 * 24 * 60 * 60 })
}))

// SAVE TO SESSION
app.post('/cart', function(req, res) {
  var cart = req.body;
  req.session.cart = cart;
  req.session.save(function(err) {
    if (err) {
      throw err;
    }
    res.json(req.session.cart);
  })
})

app.get('/cart', function(req, res) {
  if (typeof req.session.cart !== 'undefined') {
    res.json(req.session.cart);
  }
})

// END OF SESSIONS SET UP

var Books = require('./models/books.js');

// POST BOOKS
app.post('/books', function(req, res) {
  var book = req.body;

  Books.create(book, function(err, books) {
    if (err) {
      throw err;
    }
    res.json(books);
  })
});

// GET BOOKS
app.get('/books', function(req, res) {
  Books.find(function(err, books) {
    if (err) {
      throw err;
    }
    res.json(books);
  })
});

// DELETE BOOKS
app.delete('/books/:_id', function(req, res) {
  var query = { _id: req.params._id };

  Books.remove(query, function(err, books) {
    if (err) {
      console.log("# API DELETE BOOK: ", err);
    }
    res.json(books);
  })
});

//UPDATE BOOKS
app.put('/books/:_id', function(req, res) {
  var book = req.body;
  var query = req.params._id;
  // if the field doesn't exist $set will set a new field
  var update = {
    '$set': {
      title: book.title,
      description: book.description,
      image: book.image,
      price: book.price
    }
  };

  // when true, returns the updated document
  var options = { new: true };

  Books.findOneAndUpdate(query, update, options, function(err, books) {
    if (err) {
      throw err;
    }
    res.json(books);
  })
});

// GET BOOKS IMAGES
app.get('/images', function(req, res) {
  const imgFolder = __dirname + '/public/images/';
  // require file system
  const fs = require('fs');
  fs.readdir(imgFolder, function(err, files) {
    if (err) {
      return console.error(err);
    }
    // create an empty array
    const fileArr = [];
    var i = 1;
    // iterate all images in the directory and add to the array
    files.forEach(function(file) {
      fileArr.push({ name: file });
      i++
    })
    // send the json response with the array
    res.json(fileArr);
  })
})
// END OF APIs

app.listen(3001, function(err) {
  if (err) {
    throw err;
  }
  console.log('API Server is listening on http://localhost:3001');
});
