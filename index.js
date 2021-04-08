const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dtkkw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log("connection err", err);
  const productsCollection = client.db("groceryShop").collection("products");
  const ordersCollection = client.db("groceryShop").collection("orders");

  //products
  app.post("/addProducts", (req, res) => {
    const product = req.body;
    productsCollection.insertOne(product).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/products", (req, res) => {
    productsCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/product/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    productsCollection.find({ _id: id }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    productsCollection.deleteOne({ _id: id }).then((documents) => {
      console.log(documents);
      res.send(documents.deletedCount > 0);
    });
  });

  // orders
  app.post("/addOrders", (req, res) => {
    const newOrders = req.body;
    ordersCollection.insertOne(newOrders).then((result) => {
      res.send(result);
    });
    console.log(newOrders);
  });
  app.get("/orders", (req, res) => {
    ordersCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  console.log("DB connected");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
