const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
 
var db, collection;

const url = "mongodb+srv://thisisanemailaddressbeepboop:KjyDzUwW39aJKj4T@clustera.fw8zb6p.mongodb.net/?retryWrites=true&w=majority"

const dbName = "palindrome";

app.listen(7000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('pals').find().sort({votes:-1}).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {pals: result})
  })
})

app.post('/pals/', (req, res) => {

  const word = req.body.word.toLowerCase()

  if (word && word == word.split('').reverse().join('').toLowerCase()){
    
    //we check to see if the word they enter is already in our db
    db.collection('pals').findOne({word: word}, (err, result) =>{
      if (err) return console.log(err)
      //if it is
      if (result) {
        console.log('we got it')
        res.redirect('/')
      }
      //if it's a new word
      else {
        db.collection('pals').insertOne({word: req.body.word.toLowerCase(), votes: 0}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
      })
      }
    })
  } else {
    console.log("that's not a palindrome")
  }
})

app.put('/vote/up/', (req, res) => {
  db.collection('pals')
  .findOneAndUpdate({word: req.body.word}, {
    $inc: {
      votes: + 1
    }
  }, {
    upsert: false,
    returnOriginal: false
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.put('/vote/down/', (req, res) => {
  db.collection('pals')
  .findOneAndUpdate({word: req.body.word}, {
    $inc: {
      votes: -1
    }
  }, {
    upsert: false,
    returnOriginal: false
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/pals', (req, res) => {
  db.collection('pals').findOneAndDelete({word: req.body.word}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
