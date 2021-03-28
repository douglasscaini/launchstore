const express = require("express");
const routes = express.Router();

const HomeController = require("../app/controllers/HomeController");

const users = require("./users");
const products = require("./products");
const cart = require("./cart");

routes.use("/users", users);
routes.use("/products", products);
routes.use("/cart", cart);

routes.get("/", HomeController.index);

routes.get("/users/ads/create", (request, response) => {
  return response.redirect("products/create.njk");
});

routes.get("/accounts", (request, response) => {
  return response.redirect("users/login");
});

module.exports = routes;
