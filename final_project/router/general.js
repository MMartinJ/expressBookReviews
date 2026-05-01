const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "username & password are required" });
  }

  const existingUser = users.find(u => u.username === username);

  if (existingUser) {
    return res.status(400).json({ message: "username already exists" });
  }

  users.push({ username, password });
  res.status(200).json({ message: "user registered" });
});


public_users.get('/', function (req, res) {
    axios.get("http://localhost:5000/") 
        .then(response => {
            return res.status(200).json(response.data);
        })
        .catch(err => {
            return res.status(500).json({ message: "error fetching books", error: err.message });
        });
});


public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
       
        const response = await axios.get(`http://localhost:5000/books/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Book was not found", error: error.message });
    }
});

  
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
       
        const response = await axios.get(`http://localhost:5000/books`);
        
        const matchingBooks = Object.values(response.data).filter(
            (book) => book.author.toLowerCase() === author.toLowerCase()
        );

        if (matchingBooks.length > 0) {
            return res.status(200).json(matchingBooks);
        } else {
            return res.status(404).json({ message: "no books found by this author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "error fetching books", error: error.message });
    }
});


public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const response = await axios.get(`http://localhost:5000/books`);
        
        const matchingBooks = Object.values(response.data).filter(
            (book) => book.title.toLowerCase() === title.toLowerCase()
        );

        if (matchingBooks.length > 0) {
            return res.status(200).json(matchingBooks);
        } else {
            return res.status(404).json({ message: "no books found by this title" });
        }
    } catch (error) {
        return res.status(500).json({ message: "error fetching books", error: error.message });
    }
});


public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).json({ message: "no reviews matched by this ISBN" });
  }
});


module.exports.general = public_users;
