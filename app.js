const express = require('express')
const { getDb, connectToDb } = require('./db')
const { ObjectId } = require('mongodb')

// init app & middleware
const app = express()
app.use(express.json())

app.set('view engine', 'ejs')

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

app.get('/', (req, res) => {
  db.collection('alter-bills').find().toArray()
  .then((data) => {
    res.render('home', {data})
  })

})

// routes
app.get('/bills', (req, res) => {
  db.collection('alter-bills').find().toArray()
  .then((results) => {
    res.status(500).json(results)
  })
})

app.get('/bills/:id', (req, res) => {

  if (ObjectId.isValid(req.params.id)) {

    db.collection('alter-bills')
      .findOne({_id: new ObjectId(req.params.id)})
      .then(doc => {
        res.render('single', {doc})
        //res.status(200).json(doc)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not fetch the document'})
      })
      
  } else {
    res.status(500).json({error: 'Could not fetch the document'})
  }

})

app.post('/bills', (req, res) => {
  const bill = req.body

  db.collection('alter-bills')
    .insertOne(bill)
    .then(result => {
      res.status(201).json(result)
    })
    .catch(err => {
      res.status(500).json({err: 'Could not create new document'})
    })
})

app.delete('/bills/:id', (req, res) => {
  if (ObjectId.isValid(req.params.id)) {

    db.collection('alter-bills')
      .deleteOne({_id: new ObjectId(req.params.id)})
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not delete the document'})
      })
      
  } else {
    res.status(500).json({error: 'Could not fetch the document'})
  }
})

app.patch('/books/:id', (req, res) => {
  const updates = req.body

  if (ObjectId.isValid(req.params.id)) {

    db.collection('books')
      .updateOne({ _id: new ObjectId(req.params.id) }, {$set: updates})
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not update document'})
      })

  } else {
    res.status(500).json({error: 'Could not update document'})
  }
})

app.get('/profile', (req, res)=>{
  res.render('profile', {name : "ahmed"})
})