const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require("mongoose");
const Article = require("./models/productInfo");

mongoose
  .connect(
    "mongodb+srv://NodeDb:NodeJsProject1799@cluster0.lhc2t7c.mongodb.net/?appName=Cluster0",
  )
  .then(() => {
    console.log("Db has been connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.render("app");
});

app.post("/products", async (req, res) => {
  const newArticle = new Article();

  const artTitle = req.body.title;
  const artDescription = req.body.decript;

  newArticle.title = artTitle;
  newArticle.description = artDescription;
  await newArticle.save();
  res.json(newArticle);
});

app.get("/products", async (req, res) => {
  const products = await Article.find();
  res.json(products);
});

app.get("/products/:productsId", async (req, res) => {
  const id = req.params.productsId;
  try {
    const products = await Article.findById(id);
    res.json(products);
    return;
  } catch (error) {
    console.log("error while reading", id);
    return res.json(error);
  }
});

app.delete("/products/:productsId", async (req, res) => {
  const id = req.params.productsId;
  try {
    const products = await Article.findByIdAndDelete(id);
    res.json(products);
    console.log("data has been deleted successfully");
    return;
  } catch (error) {
    console.log("error while reading", id);
    return res.json(error);
  }
});

app.put("/products/:productsId", async (req, res) => {
  const id = req.params.productsId;
  try {
    const products = await Article.findByIdAndUpdate(
      id,
      { title: req.body.title, description: req.body.decript },
      { new: true },
    );
    res.json(products);
    console.log(error);
  } catch (error) {
    console.log("error while updateing", id);
    return res.json(error);
  }
});

module.exports = app;