const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const potatoLogger = require("./middlewares/winston");

const path = require("node:path");

const user = require("./routes/auth/user.routes");
const category = require("./routes/category/category.routes");
const order = require("./routes/order/order.routes");
const product = require("./routes/product/product.routes");
const cart = require("./routes/cart/cart.routes");

const SERVER_PORT = process.env.APP_PORT || 3000;
const CLIPORT = process.env.CLI_PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));

// Product routes
app.use(product);
// cart routes
app.use(cart);
// user routes
app.use(user);
app.use(order);
app.use(category);

//Setting up the Environment
const http = `http://getdrunk.ml`;

app.listen(SERVER_PORT, () => {
  potatoLogger.info(
    `Server has just started at ${http} ` +
      `>> Backend running at ${SERVER_PORT} ` +
      `>> Frontend running at ${CLIPORT}`
  );
});

module.exports = app;
