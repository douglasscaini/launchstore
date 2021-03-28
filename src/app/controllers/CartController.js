const Cart = require("../../lib/cart");

const LoadProductService = require("../services/LoadProductsService");

module.exports = {
  index(request, response) {
    try {
      let { cart } = request.session;

      cart = Cart.init(cart);

      return response.render("cart/index", { cart });
    } catch (error) {
      console.error(error);
    }
  },

  async addOne(request, response) {
    try {
      const { id } = request.params;

      const product = await LoadProductService.load("product", { where: { id } });

      let { cart } = request.session;

      cart = Cart.init(cart).addOne(product);

      request.session.cart = cart;

      return response.redirect("/cart");
    } catch (error) {
      console.error(error);
    }
  },

  removeOne(request, response) {
    try {
      let { id } = request.params;

      let { cart } = request.session;

      if (!cart) {
        return response.redirect("/cart");
      }

      cart = Cart.init(cart).removeOne(id);

      request.session.cart = cart;

      return response.redirect("/cart");
    } catch (error) {
      console.error(error);
    }
  },

  delete(request, response) {
    try {
      let { id } = request.params;

      let { cart } = request.session;

      if (!cart) {
        return;
      }

      request.session.cart = Cart.init(cart).delete(id);

      return response.redirect("/cart");
    } catch (error) {
      console.error(error);
    }
  },
};
