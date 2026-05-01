const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Tarea 6: Registrar un nuevo usuario
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const existingUser = users.find(u => u.username === username);

  if (existingUser) {
    return res.status(404).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  // El texto debe ser EXACTAMENTE el que pide el test en la Pregunta 7
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Tarea 1 & 10: Obtener todos los libros usando Promesas
public_users.get('/', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    // Se devuelve el objeto tal cual, formateado a 4 espacios (como en la Pregunta 2)
    resolve(res.status(200).send(JSON.stringify(books, null, 4)));
  });

  get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// Tarea 2 & 11: Obtener detalles del libro por ISBN usando Promesas
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  const get_book = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(res.status(200).send(JSON.stringify(book, null, 4)));
    } else {
      reject(res.status(404).json({ message: "Book not found" }));
    }
  });

  get_book
    .then(() => console.log("Promise for Task 11 resolved"))
    .catch((err) => console.log(err));
});
  
// Tarea 3 & 12: Obtener libros por Autor usando Promesas
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  const get_books_author = new Promise((resolve, reject) => {
    let outputBooks = [];
    let isbns = Object.keys(books);
    
    isbns.forEach((isbn) => {
      if(books[isbn].author.toLowerCase() === author.toLowerCase()) {
        outputBooks.push({
            "author": books[isbn].author,
            "title": books[isbn].title,
            "reviews": books[isbn].reviews
        });
      }
    });

    if (outputBooks.length > 0) {
      // Devuelve un array con los libros que coinciden (como en la Pregunta 4)
      resolve(res.status(200).send(JSON.stringify(outputBooks, null, 4)));
    } else {
      reject(res.status(404).json({ message: "No books found for this author" }));
    }
  });

  get_books_author
    .then(() => console.log("Promise for Task 12 resolved"))
    .catch((err) => console.log(err));
});

// Tarea 4 & 13: Obtener libros por Título usando Promesas
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  
  const get_books_title = new Promise((resolve, reject) => {
    let outputBooks = [];
    let isbns = Object.keys(books);
    
    isbns.forEach((isbn) => {
      if(books[isbn].title.toLowerCase() === title.toLowerCase()) {
        outputBooks.push({
            "author": books[isbn].author,
            "title": books[isbn].title,
            "reviews": books[isbn].reviews
        });
      }
    });

    if (outputBooks.length > 0) {
      // Devuelve un array con los libros que coinciden (como en la Pregunta 5)
      resolve(res.status(200).send(JSON.stringify(outputBooks, null, 4)));
    } else {
      reject(res.status(404).json({ message: "No books found with this title" }));
    }
  });

  get_books_title
    .then(() => console.log("Promise for Task 13 resolved"))
    .catch((err) => console.log(err));
});

// Tarea 5: Obtener las reviews de un libro
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    // Si no hay reviews, esto devolverá {} que es exactamente lo que pide la Pregunta 6
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "No reviews found for this ISBN" });
  }
});

module.exports.general = public_users;
