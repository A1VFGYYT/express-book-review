const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password)
    return res.status(404).json({ message: "Error logging in" });
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 3600 }
    );

    req.session.authorization = { accessToken, username };
    req.session.username = username;
    return res.status(200).send("User successfully logged in");
  } else
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.username;
  const review = req.query.review;
  const isbn = req.params.isbn;
  console.log(username, review, isbn);

  if (isbn in books) {
    let obj = books[isbn];
    let rev = obj["reviews"];

    if (Object.keys(rev).length === 0) rev[username] = review;
    else {
      if (username in rev) {
        let changer = rev[username];
        changer += " " + review;
        rev[username] = changer;
      } else rev[username] = review;
    }
    return res.send("Review added");
  } else return res.send("Book not available");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  if (isbn in books) {
    let obj = books[isbn];
    let rev = obj["reviews"];

    if (Object.keys(rev).length === 0) res.send("No reviews to delete");
    else {
      if (username in rev) {
        delete rev[username];
      } else res.send("no reviews to delete");
    }
    return res.send("Review added");
  } else return res.send("Book not available");
});

module.exports.authenticated = regd_users;
module.exports.users = users;
