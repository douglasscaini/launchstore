const { unlinkSync } = require("fs");

const Category = require("../models/Category");
const Product = require("../models/Product");
const File = require("../models/File");

const LoadproductsService = require("../services/LoadProductsService");

module.exports = {
  async create(request, response) {
    try {
      const categories = await Category.findAll();

      return response.render("products/create", { categories });
    } catch (error) {
      console.log(error);
    }
  },

  async post(request, response) {
    try {
      const keys = Object.keys(request.body);

      for (key of keys) {
        if (request.body[key] == "") {
          return response.send("Please, fill all fields!");
        }
      }

      if (request.files.length == 0) {
        return response.send("Please, send ate least one image");
      }

      let { category_id, name, description, old_price, price, quantity, status } = request.body;

      price = price.replace(/\D/g, "");

      const product_id = await Product.create({
        category_id,
        user_id: request.session.userId,
        name,
        description,
        old_price: old_price || price,
        price,
        quantity,
        status: status || 1,
      });

      const filesPromise = request.files.map((file) => {
        File.create({
          name: file.filename,
          path: file.path.replace(/\\/g, "/"),
          product_id,
        });
      });

      await Promise.all(filesPromise);

      return response.redirect(`products/${product_id}/edit`);
    } catch (error) {
      console.log(error);
    }
  },

  async show(request, response) {
    try {
      const product = await LoadproductsService.load("product", {
        where: { id: request.params.id },
      });

      return response.render("products/show", { product });
    } catch (error) {
      console.log(error);
    }
  },

  async edit(request, response) {
    try {
      const product = await LoadproductsService.load("product", {
        where: { id: request.params.id },
      });

      const categories = await Category.findAll();

      return response.render("products/edit", { product, categories });
    } catch (error) {
      console.log(error);
    }
  },

  async put(request, response) {
    try {
      const keys = Object.keys(request.body);

      for (key of keys) {
        if (request.body[key] == "" && key != "removed_files") {
          return response.send("Please, fill all fields!");
        }
      }

      if (request.files.length != 0) {
        const newFilesPromise = request.files.map((file) => {
          File.create({ ...file, product_id: request.body.id });
        });

        await Promise.all(newFilesPromise);
      }

      if (request.body.removed_files) {
        const removedFiles = request.body.removed_files.split(",");
        const lastIndex = removedFiles.length - 1;
        removedFiles.splice(lastIndex, 1);

        const removedFilesPromise = removedFiles.map((id) => {
          File.delete(id);
        });

        await Promise.all(removedFilesPromise);
      }

      request.body.price = request.body.price.replace(/\D/g, "");

      if (request.body.old_price != request.body.price) {
        const oldProduct = await Product.find(request.body.id);

        request.body.old_price = oldProduct.price;
      }

      await Product.update(request.body.id, {
        category_id: request.body.category_id,
        name: request.body.name,
        description: request.body.description,
        old_price: request.body.old_price,
        price: request.body.price,
        quantity: request.body.quantity,
        status: request.body.status,
      });

      return response.redirect(`products/${request.body.id}`);
    } catch (error) {
      console.log(error);
    }
  },

  async delete(request, response) {
    try {
      const files = await Product.files(request.body.id);

      await Product.delete(request.body.id);

      files.map((file) => {
        try {
          unlinkSync(file.path);
        } catch (error) {
          console.error(error);
        }
      });

      return response.redirect("/products/create");
    } catch (error) {
      console.log(error);
    }
  },
};
