const express = require("express");
const routes = express.Router();
const multer = require("./app/middlewares/multer");

const ProductController = require("./app/controllers/ProductController");

routes.get("/", (request, response) => {
  return response.render("layout.njk");
});

routes.get("/products/create", ProductController.create);
routes.get("/products/:id", ProductController.show);
routes.get("/products/:id/edit", ProductController.edit);
routes.post("/products", multer.array("photos", 6), ProductController.post);
routes.put("/products", multer.array("photos", 6), ProductController.put);
routes.delete("/products", ProductController.delete);

routes.get("/ads/create", (request, response) => {
  return response.redirect("products/create.njk");
});

module.exports = routes;
