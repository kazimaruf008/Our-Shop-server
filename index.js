const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.hvuik.mongodb.net/${process.env.BD_name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log('connection err', err)
  const eventCollection = client.db("organicdd").collection("product");
  
    app.get('/events', (req, res) => {
        eventCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })

    app.get('/events/:id', (req, res) => {
      const id = ObjectID(req.params.id);
      eventCollection.find(id)
      .toArray((err, items) => {
          res.send(items)
      })
  })

  app.post('/addEvent', (req, res) => {
      const newEvent = req.body;
      console.log('adding new event: ', newEvent)
      eventCollection.insertOne(newEvent)
      .then(result =>{
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 1)
      })
  })

  app.delete('/deleteProduct/:id', (req, res) => {
      const id = ObjectID(req.params.id);
      console.log('delete this', id);
      eventCollection.deleteOne({_id: id})
      .then(documents => res.send(!!documents.value))
  })
});



app.listen(process.env.PORT ||port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})