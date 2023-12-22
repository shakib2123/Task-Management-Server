const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Task-Manger is running here.");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.op9dmu8.mongodb.net/?retryWrites=true&w=majority `;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const taskCollection = client.db("TaskManagement").collection("tasks");

    app.get("/tasks/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = {
          userEmail: email,
        };
        const result = await taskCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.get("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(query);
      res.send(result);
    });

    app.post("/tasks", async (req, res) => {
      try {
        const task = req.body;
        console.log(task);
        const result = await taskCollection.insertOne(task);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.put("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const task = req.body;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedData = {
          $set: {
            title: task.title,
            date: task.date,
            description: task.description,
            priority: task.priority,
            status: task.status,
          },
        };
        const result = await taskCollection.updateOne(
          filter,
          updatedData,
          options
        );
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.delete("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await taskCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

   
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
