const express = require('express');
const bodyParser=require('body-parser')
require('dotenv').config()
//database connection 
require('../src/db/db_connection')

const app = express();
const PORT = process.env.PORT || 5000;



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

///all routes
const books_record=require('../src/routers/books_record')
const student=require('../src/routers/student')
app.use(books_record)
app.use(student)


/////error handling route
app.use((req, res, next) => {
    const error = new Error(`Not found -${req.originalUrl}`)
    res.status(404)
    next(error)
})
app.use((error, req, res, next) => {
    res.send({
        "status":"failed",
        error: error.message
    })
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})