const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const pwd = req.body.password;
  if (!username || !pwd) {
    return res.status(400).json({ message: "You must provide a username and password" })

  }


  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" })
  } else {
    users.push({ username: username, password: pwd })
    return res.status(200).json({ message: "User succesfully registered" })
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
   res.status(200).send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn
   res.status(200).send(books[isbn])
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author
  let requestedBooks = {}

  for (const key in books) {
    const book = books[key]
    if (book.author.toLowerCase() === author.toLowerCase()) {
      requestedBooks[key] = book
    }
  }
   res.status(200).send(requestedBooks)
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title
  let requestedBooks = {}

  for (const key in books) {
    const book = books[key]
    if (book.title.toLowerCase() === title.toLowerCase()) {
      requestedBooks[key] = book
    }
  }
   res.status(200).send(requestedBooks)
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn
  return res.status(200).send(books[isbn].reviews)
});

module.exports.general = public_users;
