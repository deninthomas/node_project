const express = require("express");
const path = require("path");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const collection = require("./models/signupModel");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
connectDb();

const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/employees", require("./routes/employees"));
app.use(errorHandler);

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "12345",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1 * 60 * 60 * 1000,
    },
  })
);

//------------------ejs-----------------------------------------------
app.set("view engine", ejs);
app.use("/assets", express.static(path.resolve(__dirname, "assets")));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

app.get("/home", isAuthenticated, (req, res) => {
  res.render("index.ejs");
});

app.get("/view-employee/:id", (req, res) => {
  res.render("viewEmployee.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

// Middleware to check if a user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// ------------Register User------------------
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password,
  };
  console.log("User Data: ", data);
  // Check if the user already exists
  const existingUser = await collection.findOne({ name: data.name });
  if (existingUser) {
    res.send("User already exists, try another username");
  } else {
    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword; // Replace the password with the hashed password
    const userdata = await collection.insertMany(data);
    console.log(userdata);
    // session after successful signup
    req.session.user = userdata;
    res.redirect("/login");
  }
});

// ----------------------Login User----------------------
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.name });
    console.log(check);
    if (!check) {
      res.send("User not found");
    } else {
      // Compare the hashed password from the db with the plain text
      const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        check.password
      );
      if (isPasswordMatch) {
        // Set the user session upon successful login
        req.session.user = check;
        res.redirect("/home");
      } else {
        res.send("Wrong password");
      }
    }
  } catch (error) {
    res.send("Error while logging in");
  }
});
// Hosting-----------------------------------------
app.listen(port, () => {
  console.log(`Server Running in the port:http://localhost:${port}/login`);
});
