const express = require('express')
const { getDb, connectToDb } = require('./db')

// init app & middleware
const app = express()

// db connection
let db

connectToDb((err) => {
  if(!err){
    app.listen('3000', () => {
      console.log('app listening on port 3000')
    })
    db = getDb()
  }
})

// routes
app.get('/bills', (req, res) => {
  db.collection('alter-bills').find().toArray()
  .then((results) => {
    res.status(500).json(results)
  })
})