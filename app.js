import express from 'express';
import cors from 'cors';
import db from './db/db.js';

const app = express();

app.use(cors());
app.use(express.json());

db.any("DROP TABLE IF EXISTS orders;")
.then(() => {
db.any("DROP TABLE IF EXISTS users;")
.then(() => {
db.any("DROP TABLE IF EXISTS books;")
.then(() => {
db.any(`CREATE TABLE books(
"isbn" varchar NOT NULL UNIQUE PRIMARY KEY,
"title" varchar,
"author" varchar,
"checked_out" bool
);`)
.then(() => {
db.any(`CREATE TABLE users(
"user_id" SERIAL NOT NULL UNIQUE PRIMARY KEY,
"username" varchar,
"password" varchar,
"is_staff" bool
);`)
.then(() => {
db.any(`CREATE TABLE orders(
"order_id" SERIAL NOT NULL UNIQUE PRIMARY KEY,
"isbn" varchar REFERENCES books("isbn") ON UPDATE CASCADE ON DELETE CASCADE,
"user_id" int REFERENCES users("user_id") ON UPDATE CASCADE ON DELETE CASCADE,
"date_checked_out" timestamp,
"due_date" timestamp,
"return_date" timestamp
);`)
.then(() => {
db.any(`INSERT INTO books("isbn", "title", "author", "checked_out") VALUES ('780590353427','Harry Potter and the Sorcerers Stone', 'JK Rowling', false)`)
.then(()=>{
db.any(`INSERT INTO books("isbn", "title", "author", "checked_out") VALUES ('9780966621334', 'Eragon', 'Christopher Polonie', false)`)
.then(()=>{
db.any(`INSERT INTO books("isbn", "title", "author", "checked_out") VALUES ('9780140385724','The Outsiders', 'SE Hinton', true)`)
.then(()=>{
db.any(`INSERT INTO users("username", "password", "is_staff") VALUES ('Cody', '5f761acdc3b790a7bc2e24e9e55e44e17c3534f89585b6fc769f88ac8e55ac76', false)`)
.then(()=>{
db.any(`INSERT INTO users("username", "password", "is_staff") VALUES ('Greg', '0d2c690e7dd5f94780383e9dfa1f4def044319104ad16ab15e45eeb2a8dfc81b', true)`)
.then(()=>{
db.any(`INSERT INTO users("username", "password", "is_staff") VALUES ('Mark', '6201eb4dccc956cc4fa3a78dca0c2888177ec52efd48f125df214f046eb43138', false)`)
.then(() => {
db.any(`INSERT INTO orders("isbn", "user_id", "date_checked_out", "due_date", "return_date") VALUES (9780140385724, 1, NOW() - INTERVAL '5 days', NOW() + INTERVAL '9 days', NOW() - INTERVAL '4 days')`)
.then(()=>{
db.any(`INSERT INTO orders("isbn", "user_id", "date_checked_out", "due_date") VALUES (780590353427, 2, NOW(), NOW() + INTERVAL '14 days')`)
.then(()=>{
db.any(`INSERT INTO orders("isbn", "user_id", "date_checked_out", "due_date", "return_date") VALUES (9780140385724, 3, NOW() - INTERVAL '2 days', NOW() + INTERVAL '12 days', NOW() - INTERVAL '1 day')`)
.then(()=>{
db.any(`INSERT INTO orders("isbn", "user_id", "date_checked_out", "due_date") VALUES (9780140385724, 2, NOW(), NOW() + INTERVAL '14 days')`)
})})})})})})})})})})})})})})})


app.get('/api/books', (req,res)=>{
    db.any("SELECT * FROM books;")
        .then(data=>{
            res.send(data)
        })
})

app.get('/api/books/:bookId', (req,res)=>{
    let isbn = req.params.bookId;
    console.log(isbn);
    db.any(`SELECT books."isbn","title","author","checked_out","order_id","user_id","date_checked_out","due_date","return_date" FROM books FULL JOIN orders ON books.isbn = orders.isbn WHERE books."isbn"='${isbn}' ORDER BY "order_id" DESC LIMIT 1;`)
        .then((data)=> {
            res.json(data);
        })
})

app.get('/api/books/filter/:bookId', (req,res)=>{
    let isbn = req.params.bookId;
    db.any(`SELECT * FROM books WHERE "isbn" LIKE '%${isbn}%';`)
        .then((data) => {
            res.send(data)
        })
})

app.put('/api/books/:bookId/checkout/:userId', (req,res)=>{
    // console.log(req.params)
    db.any(`UPDATE books SET "checked_out" = true FROM users WHERE books."isbn" = '${req.params.bookId}' AND users."user_id" = ${req.params.userId};UPDATE orders SET "date_checked_out" = NOW(), "due_date" = NOW() + INTERVAL '14 days' WHERE "user_id" = ${req.params.userId};`)
        .then(()=>{
            // console.log(data)
            db.any(`SELECT books."isbn","title","author","checked_out","order_id","user_id","date_checked_out","due_date","return_date" FROM books FULL JOIN orders ON books.isbn = orders.isbn WHERE books."isbn"='${isbn}' ORDER BY "order_id" DESC LIMIT 1;`)
                .then((theData)=> {
                    res.status(200).send(theData);
                })
            // res.status(200).json(data);
        })
        .catch(err=>res.status(400).json({
                message: err
            })
        );
})


app.put("/api/books/:bookId/return", (req,res) => {
    let isbn = req.params.bookId;
    db.any(`UPDATE orders SET "return_date"=NOW() WHERE "isbn"='${isbn}';`)
        .then(() => {
            db.any(`SELECT books."isbn","title","author","checked_out","order_id","user_id","date_checked_out","due_date","return_date" FROM books FULL JOIN orders ON books.isbn = orders.isbn WHERE books."isbn"='${isbn}' ORDER BY "order_id" DESC LIMIT 1;`)
                .then(data => {
                    res.send(data);
                })
        })
        .catch(() => {
            res.json("failure")
        })
})


export default app;