const express = require('express');
const axios = require('axios'); 
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!users.find((user) => user.username === username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});


public_users.get('/', async function (req, res) {
    try {
        
        const response = await axios.get('http://localhost:5000/books'); 
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({message: "Error fetching books"});
    }
});


public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/books/${isbn}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(err => {
            res.status(404).json({message: "Book not found"});
        });
});
  

public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get('http://localhost:5000/books');
        const booksArray = Object.values(response.data);
        const filtered = booksArray.filter(b => b.author === author);
        res.status(200).json(filtered);
    } catch (error) {
        res.status(500).json({message: "Error"});
    }
});


public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get('http://localhost:5000/books');
        const filtered = Object.values(response.data).filter(b => b.title === title);
        res.status(200).json(filtered);
    } catch (error) {
        res.status(500).json({message: "Error"});
    }
});


public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({message: "Not found"});
    }
});

module.exports.general = public_users;
