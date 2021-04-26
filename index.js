const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('bson');
const uri = 'mongodb+srv://ultraNet:saad1234@cluster0.hsnpf.mongodb.net/netServices?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()

app.use(bodyParser.json())
app.use(cors())

const port = 5000



client.connect(err => {
  const serviceCollection = client.db("netServices").collection("services");
  const reviewCollection = client.db("netServices").collection("review");
  const adminCollection = client.db("netServices").collection("adminEmail");
  const bookingCollection = client.db("netServices").collection("bookings");

  app.post('/addService', (req, res) => {
    const service = req.body;
    serviceCollection.insertOne(service)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

    app.post('/addReview', (req, res) => {
      const review = req.body;
      reviewCollection.insertOne(review)
        .then(result => {
          console.log('inserted count', result.insertedCount)
          res.send(result.insertedCount > 0)
        })
    })

  app.get('/packages', (req, res) => {
    serviceCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.patch('/updateStatus/:id', (req,res) =>{
    console.log(req.body)
    bookingCollection.updateOne({_id: ObjectID(req.params.id)},
    {
      $set: { status: req.body.status}
    })
    .then(result => {
      console.log(result)
    })
  })

  app.get('/deleteOrder/:id', (req, res) => {
    bookingCollection.findOneAndDelete({_id: ObjectID(req.params.id)})
    .then(result => {
      console.log(result)
    })
  })

  app.get('/bookingList', (req, res) => {
    bookingCollection.find({email: req.query.email})
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.get('/bookItem/:id', (req, res) => {
    serviceCollection.find({_id: ObjectID(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })

  app.get('/orderList', (req, res) => {
    bookingCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.get('/testimonials', (req, res) => {
    reviewCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.post('/makeAdmin', (req, res) => {
    const email = req.body;
    adminCollection.insertOne(email)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/bookPackage', (req, res) => {
    const book = req.body;
    bookingCollection.insertOne(book)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({email: email})
      .toArray((err, admin) => {
        res.send(admin.length > 0)
      })
  })


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)