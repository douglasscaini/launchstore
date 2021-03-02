const Category = require("../models/Category");
const Product = require("../models/Product");

const { formatPrice } = require("../../lib/utils");

module.exports = {
  create(request, response) {
    Category.all()
      .then(function (results) {
        const categories = results.rows;

        return response.render("products/create.njk", { categories });
      })
      .catch(function (err) {
        throw new Error(err);
      });
  },

  async edit(request, response) {
    let results = await Product.find(request.params.id);
    const product = results.rows[0];

    if (!product) {
      return res.send("Product not found!");
    }

    product.old_price = formatPrice(product.old_price);
    product.price = formatPrice(product.price);

    results = await Category.all();
    const categories = results.rows;

    return response.render("products/edit.njk", { product, categories });
  },

  async put(request, response) {
    const keys = Object.keys(request.body);

    for (key of keys) {
      if (request.body[key] == "") {
        return response.send("Please, fill all fields!");
      }
    }

    request.body.price = request.body.price.replace(/\D/g, "");

    if (request.body.old_price != request.body.price) {
      const oldProduct = await Product.find(request.body.id);

      request.body.old_price = oldProduct.rows[0].price;
    }

    await Product.update(request.body);

    return response.redirect(`products/${request.body.id}/edit`);
  },

  async post(request, response) {
    const keys = Object.keys(request.body);

    for (key of keys) {
      if (request.body[key] == "") {
        return response.send("Please, fill all fields!");
      }
    }

    let results = await Product.create(request.body);
    const productId = results.rows[0].id;

    return response.redirect(`products/${productId}`);
  },

  async delete(request, response) {
    await Product.delete(request.body.id);

    return response.redirect("/products/create");
  },
};
