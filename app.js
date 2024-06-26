const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
// const { doubleCsrf } = require("csrf-csrf");

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://prakhargaba:Prakhar1@cluster0.oiz6t6r.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// const csrfMiddleware = surf();
// app.use(csrfMiddleware);

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static("/images", path.join(__dirname, "images")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my Secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// app.use(csrfMiddleware);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// app.use("/500", errorController.get500);
app.use(errorController.get404);

// app.use((error, req, res, next) => {
//   // res.status(error.httpStatusCode).render(...);
//   // res.redirect("/500");
//   res.status(500).render("500", {
//     pageTitle: "Error",
//     path: "/500",
//     isAuthenticated: req.session.isLoggedIn,
//   });
// });

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    return User.findOne(); // Find a user
  })
  .then(() => {
    app.listen(3001); // Start the server
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));
  