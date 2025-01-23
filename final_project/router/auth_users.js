const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    
    for (let user in users) {
        if (users[user].username === username) return false;    
    }
    return true;
}

const authenticatedUser = (username,password)=>{
    for (let user in users) {
        if (users[user].username === username && user.password === password) return false;
    }
    return true;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(users)

    if (!username || !password) {
        return res.status(404).json({messgae: "Error logging in"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60});

        req.session.authorization = {
            accessToken, username
        }

        return res.status(200).send("User successfully logged in");
    }
    return res.status(208).json({message: "Invalid login"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review
    books[isbn].reviews[req.session.authorization.username] = review;
    console.log(books)
    res.status(200).send("Review added!")
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    delete books[isbn].reviews[req.session.authorization.username]
    res.status(200).send("Review removed!")
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
