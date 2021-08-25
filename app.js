import express from 'express';
import cors from 'cors';
import db from './db/db.js';

const app = express();

app.use(cors());
app.use(express.json());

db.any("DROP TABLE IF EXISTS order;")
.then(() => {
db.any("DROP TABLE IF EXISTS users;")
.then(() => {
db.any("DROP TABLE IF EXISTS books;")
.then(() => {
db.any(`CREATE TABLE books(
"isbn" NOT NULL UNIQUE PRIMARY KEY,
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
db.any(`CREATE TABLE order(
"isbn" int REFERENCES books.isbn ON UPDATE CASCADE ON DELETE CASCADE,
"user_id" int REFERENCES users.user_id ON UPDATE CASCADE ON DELETE CASCADE,
"date_checked_out" timestamp,
"return_date" timestamp
;`)
.then(() => {
db.any(`INSERT INTO books("isbn", "title", "author", "checked_out") VALUES (780590353427,'Harry Potter and the Sorcerer\'s Stone', 'JK Rowling', false)`)
.then(()=>{
db.any(`INSERT INTO books("isbn", "title", "author", "checked_out") VALUES (9780966621334, 'Eragon', 'Christopher Polonie', false)`)
.then(()=>{
db.any(`INSERT INTO books("isbn", "title", "author", "checked_out") VALUES (9780140385724,'The Outsiders', 'SE Hinton', true)`)
.then(()=>{
db.any(`INSERT INTO users("username", "password", "is_staff") VALUES ('Cody', '5f761acdc3b790a7bc2e24e9e55e44e17c3534f89585b6fc769f88ac8e55ac76', false)`)
.then(()=>{
db.any(`INSERT INTO users("username", "password", "is_staff") VALUES ('Greg', '0d2c690e7dd5f94780383e9dfa1f4def044319104ad16ab15e45eeb2a8dfc81b', true)`)
.then(()=>{
db.any(`INSERT INTO users("username", "password", "is_staff") VALUES ('Mark', '6201eb4dccc956cc4fa3a78dca0c2888177ec52efd48f125df214f046eb43138', false)`)
.then(() => {
db.any(`INSERT INTO order("isbn", "user_id", "date_checked_out") VALUES (9780140385724, 1, 'SE Hinton', true)`)
.then(()=>{
db.any(`INSERT INTO order("isbn", "user_id", "author", "checked_out") VALUES (780590353427, 2, 'SE Hinton', true)`)
.then(()=>{
db.any(`INSERT INTO order("isbn", "user_id", "date_checked_out", "due_date") VALUES (9780966621334, 3, NOW(), NOW() + INTERVAL "14 days")`)
})})})})})})})})})})})})})})




app.get('/', (req,res)=>{
    db.any("SELECT * FROM users;")
        .then(() => {
            res.send(data);
        })
})

export default app;