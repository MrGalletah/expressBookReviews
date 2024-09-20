const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  return users.some((user) => user.username === username)
}

const authenticatedUser = (username, password) => { //returns boolean
  return users.some((user) => user.username === username && user.password === password)
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const {username, password} = req.body

  if(!isValid(username)) return res.status(401).json({message: "Invalid Username, you have to register first!"})

  if(!authenticatedUser(username, password)) return res.status(401).json({message: "Invalid Password"})

  const token = jwt.sign({username, password}, "secretKey", {expiresIn: "10h"} )

  req.session.token = token

  return res.json({message: "Loged successfully", token})
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username
  const book = books[isbn]

  if(!book) res.status(400).json({message :"Book not found"})

  book.reviews[username] = review
  return res.status(200).json({ message: "Review added successfully",review , book });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
const isbn = req.params.isbn;
const book = books[isbn]
const username = req.user.username

if(!book) res.status(400).json({message :"Book not found"})

  if(!(username in book.reviews)){
    return res.status(400).json({message: "You dont have any review yet!"})
  }

  delete book.reviews[username]
  return res.status(200).json({message: "Review deleted successfully", book})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
