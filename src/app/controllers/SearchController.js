const Product = require("../models/Product");

const LoadProductsService = require("../services/LoadProductsService");

module.exports = {
  async index(request, response) {
    try {
      let { filter, category } = request.query;

      if (!filter || filter.toLowerCase() == "todos os produtos") filter = null;

      let products = await Product.search({ filter, category });

      const productsPromise = products.map(LoadProductsService.format);

      products = await Promise.all(productsPromise);

      const search = {
        term: request.query.filter || "Todos os produtos",
        total: products.length,
      };

      const categories = products
        .map((product) => ({
          id: product.category_id,
          name: product.category_name,
        }))
        .reduce((categoriesFiltered, category) => {
          const found = categoriesFiltered.some((cat) => cat.id == category.id);

          if (!found) {
            categoriesFiltered.push(category);
          }

          return categoriesFiltered;
        }, []);

      return response.render("search/index", { products, categories, search });
    } catch (err) {
      console.error(err);
    }
  },
};
