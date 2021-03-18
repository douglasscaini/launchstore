const User = require("../models/User");
const { compare } = require("bcryptjs");

async function login(request, response, next) {
  const { email, password } = request.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return response.render("session/login", {
      user: request.body,
      error: "Usuário não cadastrado!",
    });
  }

  const passed = await compare(password, user.password);

  if (!passed)
    return response.render("session/login", {
      user: request.body,
      error: "Senha incorreta!",
    });

  request.user = user;

  next();
}

module.exports = {
  login,
};
