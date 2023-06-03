import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 1515;


app.use(express.json()); 

const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongodb is connected ");
  return client;
}

const client = await createConnection();




//1. Find all the information about each products
app.get("/products", async function(req, res) {
  const result = await client
    .db("products")
    .collection("items")
    .find({})
    .toArray();
  res.send(result);
});




//2. Find the product price which are between 400 to 800
app.get("/products400-800", async function(req, res) {
  const result = await client
    .db("products")
    .collection("items")
    .find({ "product_price": { $gte: 400, $lte: 800 } }).
    toArray();
  res.send(result);
});



//3. Find the product price which are not between 400 to 600
app.get("/products400-800", async function(req, res) {
  const result = await client
    .db("products")
    .collection("items")
    .find({ $or: [{ "product_price": { $lt: 400 } }, { "product_price": { $gt: 600 } }] })
    .toArray();
  res.send(result);
});




//4. List the four product which are grater than 500 in price
app.get("/products500", async function(req, res) {
  const result = await client
    .db("products")
    .collection("items")
    .find({ "product_price": { $gte: 500 } })
    .toArray();
  res.send(result);
});



//5. Find the product name and product material of each products
app.get("/productsnameandmaterial", async function(req, res) {
  const result = await client
    .db("products")
    .collection("items")
    .find({}, { projection: { product_name: 1, product_material: 1 } })
    .toArray();
  res.send(result);
});




//6. Find the product with a row id of 10
app.get("/products10", async function(req, res) {
  const result = await client
    .db("products")
    .collection("items")
    .find({ "id": "10" })
    .toArray();
  res.send(result);
});




//7. Find only the product name and product material
app.get("/productsnameandmaterial2", async function(req, res) {
  const result = await client
    .db("products")
    .collection("items")
    .find({}, { projection: { product_name: 1, product_material: 1 } })
    .toArray();
  res.send(result);
});




//8. Find all products which contain the value of soft in product material 
app.get("/productssoft", async function(req, res) {
  const result = await client
    .db("products")
    .collection("items")
    .find({ "product_material": /^Soft/ })
    .toArray();
  res.send(result);
});





//9. Find products which contain product color indigo  and product price 492.00
app.get("/productscontain", async function(req, res) {
  const result = await client
    .db("products")
    .collection("items")
    .find({ $and: [{ "product_color": "indigo" }, { "product_price": 492 }] })
    .toArray();
  res.send(result);
});




//10. Delete the products which product price value are same
app.get("/productsdelete", async function(req, res) {
  //Getting the count of the duplicates
  const count = await client
    .db("products")
    .collection("items")
    .aggregate([
      { $group: { _id: "$product_price", count: { $sum: 1 } } },
      { $project: { count: 1 } },
    ])
    .toArray();

  //Getting the duplicate product price values
  const duplicate = count
    .filter((doc) => (doc.count > 1 ? doc : null))
    .map((doc) => doc._id);

  //Filtering out the duplicate from the products
  const products = dbo
    .collection("products")
    .find({ product_price: { $nin: duplicate } })
    .toArray();
  res.send(products);
});


app.post("/products", async function(req, res) {
  const data = req.body;
  const result = await client.db("products").collection("items").insertMany(data);
  res.send(result);
});



app.listen(PORT, () => console.log(`App started in ${PORT}`));
