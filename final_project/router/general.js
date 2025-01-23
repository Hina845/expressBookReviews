const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username && !password) return res.status(404).json({message: "Unable to register user!"})
    if (isValid(username)) {
        users.push({
            "username": username,
            "password": password
        });
        return res.status(200).json({message: "Successfully registered!"})
    } else {
        return res.status(404).json({message: "User already exists!"})
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // res.send(JSON.stringify(books, null, 4))
    let myPromise = new Promise((resolve, reject) => {
        resolve(JSON.stringify(books, null, 4));
    })

    myPromise.then((response) => {
        res.send(response)
    })    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // if (req.params.isbn in books) {
    //     res.send(books[req.params.isbn]);
    // } else {
    //     return res.status(500).json({message: "Failed: ISBN not exist."});
    // }
    let myPromise = new Promise((resolve, reject) => {
        if (req.params.isbn in books) {
            resolve(books[req.params.isbn]);
        } else {
            return res.status(500).json({message: "Failed: ISBN not exist."});
        }
    })

    myPromise.then(response => {
        res.send(response);
    })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // const author = req.params.author;

    // let filtered_books = {};

    // for (let isbn in books) {
    //     if (books[isbn].author === author) {
    //         filtered_books[isbn] = books[isbn];            
    //     }
    // }

    // res.send(JSON.stringify(filtered_books, null, 4))
    let myPromise = new Promise((resolve, reject) => {
        const author = req.params.author;
        let filtered_books = {};
        for (let isbn in books) {
            if (books[isbn].author === author) {
                filtered_books[isbn] = books[isbn];            
            }
        }
        resolve(JSON.stringify(filtered_books, null, 4));
    })

    myPromise.then(response => {
        res.send(response);
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // const title = req.params.title;

    // let filtered_books = {};

    // for (let isbn in books) {
    //     if (books[isbn].title === title) {
    //         filtered_books[isbn] = books[isbn];            
    //     }
    // }

    // res.send(JSON.stringify(filtered_books, null, 4))

    let myPromise = new Promise((resolve, reject) => {
        title = req.params.title;
        let filtered_books = {};

        for (let isbn in books) {
            if (books[isbn].title === title) {
                filtered_books[isbn] = books[isbn];            
            }
        }
        resolve(JSON.stringify(filtered_books, null, 4));
    })

    myPromise.then((response) => {
        res.send(response)
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    res.send(JSON.stringify(books[req.params.isbn].reviews, null, 4))
});

module.exports.general = public_users;
