import express from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";
import { ObjectId } from "mongodb";
import cors from 'cors';


const app = express();

// async js
// fetch() - .json()

// Middleware for parsing JSON request bodies
app.use(express.json());
app.use(cors())

const PORT = process.env.PORT || 3000;

// Connection URL
const url = process.env.MONGO_URL;

const client = new MongoClient(url);

async function ConnectDB() {
  try {
    await client.connect();
    console.log("✔✔ Connected to the database ✔✔");
    return client;
  } catch (error) {
    if (error instanceof MongoServerError) {
      console.log(`Error worth logging: ${error}`); // special case for some reason
    }
    throw error; // still want to crash
  }
}

await ConnectDB();

// Database Name and collection setup
const dbName = "TodoDemoCrashCourse";
const db = client.db(dbName);
const collection = db.collection("todos");

// home get method
app.get("/", function (req, res) {
  res.status(200).send("Hello World");
});

app.post("/todo", async (req, res) => {
  const { title } = req.body;

  try {
    const insertResult = await collection.insertOne({ title, completed:false });
    res.status(201).send(insertResult);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/todos", async (req, res) => {
  try {
    console.log("todos fetching started")
    const findResult = await collection.find({}).toArray();
    res.status(200).send(findResult);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// url parameters

app.get('/todo/:id', async (req,res)=>{

    const {id} = req.params;
    try {

        const findResult = await collection.findOne({_id:new ObjectId(id)});
        res.status(200).send(findResult);
        
    } catch (error) {

        console.log(error);
        res.status(500).send(error)
        
    }

})

app.put("/todo/:id", async (req,res) => {
    try {
        const id = req.params;
        const {title, completed} = req.body;

        const updateResult = await collection.updateOne({ _id: new ObjectId(id) }, { $set: {title, completed} });
        res.status(200).send(updateResult)

        
    } catch (error) {

        console.log(error);
        res.status(500).send(error)
        
    }
});

app.delete("/todo/:id", async (req, res) => {
    try {

        const id = req.params;
        const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).send(deleteResult)

        
    } catch (error) {

        console.log(error);
        res.status(500).send(error)
        
    }
});

//callback function to our app for feedback
app.listen(PORT, () => {
  console.log("Server running on port 3000 🎉🎉🎉");
});
