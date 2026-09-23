const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // إضافة حقل الدور هنا
  role: { type: String, enum: ["user", "admin"], default: "user" } 
});

const user = mongoose.model("User", userSchema);

module.exports = user;
