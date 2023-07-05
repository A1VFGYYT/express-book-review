const express = require("express");
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res.status(200).send("User successfully registered");
    } else return res.status(404).json({ message: "User already exists" });
  }
  return res.status(404).json({ message: "Unable to register user" });
});

public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (isbn in books) res.send(books[isbn]);
  else res.send("Book not found");
});

public_users.get("/author/:author", function (req, res) {
  const name = req.params.author;

  let len = Object.keys(books).length;

  for (let i = 1; i < len; i++) {
    let obj = books[i];
    if (obj.author === name) return res.json(obj);
  }
  return res.send("Author not found");
});

public_users.get("/title/:title", function (req, res) {
  const name = req.params.title;

  let len = Object.keys(books).length;

  for (let i = 1; i < len; i++) {
    let obj = books[i];
    if (obj.title === name) return res.json(obj);
  }
  return res.send("Title not found");
});

public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (isbn in books) {
    let obj = books[isbn];
    res.json(obj.reviews);
  } else res.send("Book not found");
});

public_users.get("/promise-books", (req, res) => {
  let get_books = new Promise((resolve, reject) => {
    resolve(res.json(books));
  });

  get_books.then(() => console.log("TASK 10"));
});

public_users.get("/promise-isbn:isbn", (req, res) => {
  let get_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (isbn in books) resolve(res.send(books[isbn]));
    else resolve(res.send("Book not found"));
  });
  get_books.then(() => console.log("TASK 11"));
});

public_users.get("/promise-author/:author", function (req, res) {
  let get_author = new Promise((resolve, reject) => {
    const name = req.params.author;

    let len = Object.keys(books).length;

    for (let i = 1; i < len; i++) {
      let obj = books[i];
      if (obj.author === name) return resolve(res.json(obj));
    }
    return resolve(res.send("Author not found"));
  });
  get_author.then(() => console.log("TASK 12"));
});

public_users.get("/promise-title/:title", function (req, res) {
  let get_title = new Promise((resolve, reject) => {
    const name = req.params.title;

    let len = Object.keys(books).length;

    for (let i = 1; i < len; i++) {
      let obj = books[i];
      if (obj.title === name) resolve(res.json(obj));
    }
    resolve(res.send("Title not found"));
  });
  get_title.then(() => console.log("TASK 13"));
});

module.exports.general = public_users;
