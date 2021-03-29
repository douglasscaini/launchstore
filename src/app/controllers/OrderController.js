const User = require("../models/User");
const Order = require("../models/Order");

const LoadProductsService = require("../services/LoadProductsService");

const Cart = require("../../lib/cart");
const mailer = require("../../lib/mailer");
const { formatPrice, date } = require("../../lib/utils");

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
      let orders = await Order.findAll({ where: { buyer_id: request.session.userId } });

      const getOrdersPriomise = orders.map(async (order) => {
        order.product = await LoadProductsService.load("product", {
          where: { id: order.product_id },
        });

        order.buyer = await User.findOne({
          where: { id: order.buyer_id },
        });

        order.seller = await User.findOne({
          where: { id: order.seller_id },
        });

        order.formattedPrice = formatPrice(order.price);
        order.formattedTotal = formatPrice(order.total);

        const statuses = {
          open: "Aberto",
          sold: "Vendido",
          canceled: "Cancelado",
        };

        order.formattedStatus = statuses[order.status];

        const updatedAt = date(order.updated_at);
        order.formattedUpdatedAt = `${order.formattedStatus} em ${updatedAt.day}/${updatedAt.month}/${updatedAt.year} às ${updatedAt.hour}h${updatedAt.minutes}m`;

        return order;
      });

      orders = await Promise.all(getOrdersPriomise);

      return response.render("orders/index", { orders });
    } catch (error) {
      console.log(error);
    }
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
};
