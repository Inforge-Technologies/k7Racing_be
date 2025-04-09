'use strict';
const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./router");
const path = require("path");
const dbcon = require("./src/config/dbconfig");
const http = require("http");
const fs = require("fs");
require("dotenv").config();

app.use(cors(corsOptions));

var corsOptions = {
  origin: "*",
};
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, XMLHttpRequest, Content-Type, Accept, x-access-token"
  );
  next();
});
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = 8000;
app.listen(PORT, () => console.log(`Now browse to localhost:${PORT}/api`));
let indexRoutes = require("./src/routers/Whatsapp/whatsapp.js");
app.use("/", indexRoutes);
app.use("/api", router);


app.use(
  "/resources/assets/categoryImage",
  express.static(path.join(__dirname, "/resources/assets/categoryImage"))
);
app.use(
  "/resources/assets/userProducts",
  express.static(path.join(__dirname, "/resources/assets/userProducts"))
);

app.use(
  "/resources/assets/photoImage",
  express.static(path.join(__dirname, "/resources/assets/photoImage"))
);

app.use(
  "/resources/assets/subcategoryImage",
  express.static(path.join(__dirname, "/resources/assets/subcategoryImage"))
);
app.use(
  "/resources/assets/productImage",
  express.static(path.join(__dirname, "/resources/assets/productImage"))
);

module.exports = app;
