const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productInfo = new Schema({
    title: String,
    description: String
});

const product = mongoose.model("product", productInfo);

module.exports = product;