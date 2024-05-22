const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors({origin: ['http://localhost:5173', 'https://painting-and-drawing-ae0df.web.app', 'https://painting-and-drawing-ae0df.firebaseapp.com']}))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qm4wct2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const itemsCollection = client.db('paintingDrawing').collection('items');

    app.get('/items', async (req, res) => {

      const items = req.body;

      const cursore = itemsCollection.find(items);
      const result = await cursore.toArray();
      res.send(result)
    })

    

    app.get('/items/:id', async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) }
      const result = await itemsCollection.findOne(quary);

      res.send(result)
    })

    
    app.get('/my-items', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { email: req.query?.email }
      }

      const cursor = itemsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
    });

    app.patch('/my-items/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) };
      const item = req.body
      // const options = { upsert: true };
      const updateDoc = {
        $set: {
          imgurl: item.imgurl,
          subCatagoryName: item.subCatagoryName,
          descriptions: item.descriptions,
          price: item.price,
          rating: item.rating,
          customization: item.customization,
          processingtime: item.processingtime,
          options: item.options,
          username: item.username
        }
      }
      
      const result = await itemsCollection.updateOne(filter, updateDoc);
      res.send(result)
    })

    app.delete('/my-items/:id', async (req, res) => {
      const id = req.params.id
      const quary = { _id: new ObjectId(id) }
      const result = await itemsCollection.deleteOne(quary);
      res.send(result)
    })

    app.post('/items', async (req, res) => {
      const items = req.body;
      const result = await itemsCollection.insertOne(items);
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Painting and Drawing resver is runnig')
})
app.listen(port, () => {
  console.log(`painting and drawing running on port ${port}`)
})