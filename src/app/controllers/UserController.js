const { hash } = require("bcryptjs");
const { unlinkSync } = require("fs");

const User = require("../models/User");
const Product = require("../models/Product");

const LoadProductsService = require("../services/LoadProductsService");

const { formatCep, formatCpfCnpj } = require("../../lib/utils");

module.exports = {
  registerForm(request, response) {
    try {
      return response.render("user/register");
    } catch (error) {
      console.log(error);
    }
  },

  async show(request, response) {
    try {
      const { user } = request;

      user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj);
      user.cep = formatCep(user.cep);

      return response.render("user/index", { user });
    } catch (error) {
      console.log(error);
    }
  },

  async post(request, response) {
    try {
      let { name, email, password, cpf_cnpj, cep, address } = request.body;

      password = await hash(password, 8);

      cpf_cnpj = cpf_cnpj.replace(/\D/g, "");
      cep = cep.replace(/\D/g, "");

      const userId = await User.create({
        name,
        email,
        password,
        cpf_cnpj,
        cep,
        address,
      });

      request.session.userId = userId;

      return response.redirect("/users");
    } catch (error) {
      console.log(error);
    }
  },

  async update(request, response) {
    try {
      const { user } = request;

      let { name, email, cpf_cnpj, cep, address } = request.body;

      cpf_cnpj = cpf_cnpj.replace(/\D/g, "");
      cep = cep.replace(/\D/g, "");

      await User.update(user.id, { name, email, cpf_cnpj, cep, address });

      return response.render("user/index", {
        user: request.body,
        success: "Conta atualizada com sucesso!",
      });
    } catch (error) {
      console.error(error);

      return response.send("user/index", { error: "Algum erro aconteceu!" });
    }
  },

  async delete(request, response) {
    try {
      const products = await Product.findAll({ where: { user_id: request.body.id } });

      const allFilesPromise = products.map((product) => Product.files(product.id));

      let promiseResults = await Promise.all(allFilesPromise);

      await User.delete(request.body.id);

      request.session.destroy();

      promiseResults.map((files) => {
        files.map((file) => {
          try {
            unlinkSync(file.path);
          } catch (error) {
            console.error(error);
          }
        });
      });

      return response.render("session/login", {
        success: "Conta deletada com sucesso!",
      });
    } catch (error) {
      console.error(error);

      return response.send("user/index", {
        user: request.body,
        error: "Erro ao tentar deletar sua conta!",
      });
    }
  },

  async ads(request, response) {
    const products = await LoadProductsService.load("products", {
      where: { user_id: request.session.userId },
    });

    return response.render("user/ads", { products });
  },
};
