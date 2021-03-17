const User = require("../models/User");

async function post(request, response, next) {
  const keys = Object.keys(request.body);

  for (key of keys) {
    if (request.body[key] == "") {
      return response.render("user/register", {
        user: request.body,
        error: "Por favor, preencha todos os campos!",
      });
    }
  }

  let { email, cpf_cnpj, password, passwordRepeat } = request.body;

  cpf_cnpj = cpf_cnpj.replace(/\D/g, "");

  const user = await User.findOne({ where: { email }, or: { cpf_cnpj } });

  if (user) {
    return response.render("user/register", {
      user: request.body,
      error: "Usuário já cadastrado!",
    });
  }

  if (password != passwordRepeat) {
    return response.render("user/register", {
      user: request.body,
      error: "Senhas não conferem!",
    });
  }

  next();
}

module.exports = {
  post,
};
