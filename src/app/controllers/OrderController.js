const User = require("../models/User");
const Order = require("../models/Order");

const LoadProductsService = require("../services/LoadProductsService");
const LoadOrderService = require("../services/LoadOrderService");

const Cart = require("../../lib/cart");
const mailer = require("../../lib/mailer");

const email = (seller, product, buyer) => `
  <h2>Olá ${seller.name}!</h2>
  <p>Você tem um novo pedido de compra do seu produto.</p>
  <p>Produto: ${product.name}</p>
  <p>Preço: ${product.formattedPrice}</p>
  <p><br/><br/></p>
  <h3>Dados do comprador</h3>
  <p>${buyer.name}</p>
  <p>${buyer.email}</p>
  <p>${buyer.address}</p>
  <p>${buyer.cep}</p>
  <p><br/><br/></p>
  <p><strong>Entre em contato com o comprador para finalizar a venda!</strong></p>
  <p><br/><br/></p>
  <p>Atenciosamente, equipe Launchstore!</p>
`;

module.exports = {
  async index(request, response) {
    try {
      const orders = await LoadOrderService.load("orders", {
        where: { buyer_id: request.session.userId },
      });

      return response.render("orders/index", { orders });
    } catch (error) {
      console.log(error);
    }
  },

  async sales(request, response) {
    try {
      const sales = await LoadOrderService.load("orders", {
        where: { seller_id: request.session.userId },
      });

      return response.render("orders/sales", { sales });
    } catch (error) {
      console.log(error);
    }
  },

  async show(request, response) {
    const order = await LoadOrderService.load("order", {
      where: { id: request.params.id },
    });

    return response.render("orders/details", { order });
  },

  async post(request, response) {
    try {
      const cart = Cart.init(request.session.cart);

      const buyer_id = request.session.userId;

      const filteredItems = cart.items.filter((item) => item.product.user_id != buyer_id);

      const createOrdersPromise = filteredItems.map(async (item) => {
        let { product, price: total, quantity } = item;
        const { price, id: product_id, user_id: seller_id } = product;
        const status = "open";

        const order = await Order.create({
          seller_id,
          buyer_id,
          product_id,
          price,
          quantity,
          total,
          status,
        });

        product = await LoadProductsService.load("product", {
          where: {
            id: product_id,
          },
        });

        const seller = await User.findOne({ where: { id: seller_id } });

        const buyer = await User.findOne({ where: { id: buyer_id } });

        await mailer.sendMail({
          to: seller.email,
          from: "no-replay@launchstore.com",
          subject: "Novo Pedido de compra - Launchstore",
          html: email(seller, product, buyer),
        });

        return order;
      });

      await Promise.all(createOrdersPromise);

      delete request.session.cart;
      Cart.init();

      return response.render("orders/success");
    } catch (err) {
      console.error(err);
      return response.render("orders/error");
    }
  },

  async update(request, response) {
    try {
      const { id, action } = request.params;

      const acceptedActions = ["close", "cancel"];

      if (!acceptedActions.includes(action)) {
        return response.send("Can't do this action!");
      }

      const order = await Order.findOne({ where: { id } });

      if (!order) {
        return response.send("Order not found!");
      }

      if (order.status != "open") {
        return response.send("Can't do this action!");
      }

      const statuses = {
        close: "sold",
        cancel: "canceled",
      };

      order.status = statuses[action];

      await Order.update(id, { status: order.status });

      return response.redirect("/orders/sales");
    } catch (error) {
      console.error(error);
    }
  },
};
