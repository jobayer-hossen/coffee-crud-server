const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000 ;


//  middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASS}@cluster0.hxrsyqo.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffee')

    app.get('/coffee', async(req,res)=>{
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/coffee/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    app.post('/coffee' , async(req,res)=>{
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    })

    app.put('/coffee/:id' , async(req, res)=>{
      const id  = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const option = { upsert: true };
      const updatedCoffee = req.body;
      const coffee ={
        $set : {
          name:updatedCoffee.name ,
           quantity:updatedCoffee.quantity ,
            supplier:updatedCoffee.supplier ,
             test:updatedCoffee.test,
              category:updatedCoffee.category ,
               details:updatedCoffee.details ,
                photo:updatedCoffee.photo
        }
      }

      const result = await coffeeCollection.updateOne(filter,coffee,option);
      res.send(result);

    })

    app.delete('/coffee/:id' , async(req,res)=>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query);
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




app.get('/',(req,res)=>{
    res.send('coffee maker server running')
});

app.listen(port ,()=>{
    console.log(`Coffee Making server is running port : ${port}`)
});