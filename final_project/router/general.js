const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try{
        const getBooks = () => {
            return new Promise((resolve,reject) => {
                resolve(books);
            });
        };
        const bookList = await getBooks();
        res.status(200).send(JSON.stringify(bookList, null, 4));
    }
    catch (error){
        res.status(500).json({ message: "Error retrieving books" });
    }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
    res.status(200).send(JSON.stringify(book, null, 4));
  }else{
    res.status(400).send("Book not found!");
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorName = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author === authorName); 
  if (filteredBooks.length > 0) {
    res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  }
  else{
    res.status(400).send("Author not found!");
  }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleName = req.params.title;
  const filteredTitle = Object.values(books).filter(book => book.title === titleName); 
  if (filteredTitle.length > 0) {
    res.status(200).send(JSON.stringify(filteredTitle, null, 4));
  }
  else{
    res.status(400).send("Title not found!");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
