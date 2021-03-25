const LoadProductsService = require("../services/LoadProductsService");

module.exports = {
  async index(request, response) {
    try {
      const allProducts = await LoadProductsService.load("products");
      const products = allProducts.filter((product, index) => (index > 2 ? false : true));

      return response.render("home/index", { products });
    } catch (error) {
      console.error(error);
    }
  },
};
