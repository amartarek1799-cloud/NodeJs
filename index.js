const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcrypt");
const user = require("./models/usersInfo");

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

app.get("/articles", async (req, res) => {
  const articles = await Article.find();
  res.render("articles.ejs", {
    allArticles: articles,
  });
});

app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body; // استقبال الـ role اختياريًا

    const findUser = await User.findOne({ email });
    if (findUser) return res.status(400).send("الحساب موجود بالفعل");

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new user({
      email,
      password: hashPassword,
      role: role || "user", // إذا لم يتم تحديد دور، يصبح مستخدم عادي تلقائيًا
    });

    await newUser.save();
    res.status(201).send("تم التسجيل بنجاح");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await user.findOne({ email: email });
    if (!findUser) {
      return res.status(400).send("wrong email or password !");
    }
    const matchPassword = await bcrypt.compare(password, findUser.password);
    if (matchPassword) {
      res.json({
        message: "you logged in successfully",
        role: findUser.role,
        email: findUser.email,
      });
    } else {
      res.status(400).send("wrong email or password !");
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// دالة التحقق من الأدمن المخصص
async function isAdmin(req, res, next) {
  const userEmail = req.headers.email; // الإيميل المرسل من المستخدم

  // ضع إيميلك الشخصي هنا مكان admin@mywebsite.com
  const primaryAdminEmail = "admin@amar.com";

  if (userEmail === primaryAdminEmail) {
    next(); // إذا تطابق الإيميل، اسمح له بالمرور فوراً كأدمن
  } else {
    res
      .status(403)
      .send("غير مسموح! هذا الإجراء مخصص للأدمن الأساسي للموقع فقط.");
  }
}

app.listen(port, () => {
  console.log(`i am listening now to port: ${port}`);
});
