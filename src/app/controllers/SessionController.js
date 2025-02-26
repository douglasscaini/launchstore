const { hash } = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/User");

const mailer = require("../../lib/mailer");

module.exports = {
  loginForm(request, response) {
    try {
      return response.render("session/login");
    } catch (error) {
      console.log(error);
    }
  },

  login(request, response) {
    try {
      request.session.userId = request.user.id;

      return response.redirect("/users");
    } catch (error) {
      console.log(error);
    }
  },

  logout(request, response) {
    try {
      request.session.destroy();

      return response.redirect("/");
    } catch (error) {
      console.log(error);
    }
  },

  forgotForm(request, response) {
    try {
      return response.render("session/forgot-password");
    } catch (error) {
      console.log(error);
    }
  },

  async forgot(request, response) {
    try {
      const user = request.user;

      const token = crypto.randomBytes(20).toString("hex");

      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      await User.update(user.id, { reset_token: token, reset_token_expires: now });

      await mailer.sendMail({
        to: user.email,
        from: "no-reply@launchstore.com.br",
        subject: "Recuperação de senha - Launchstore",
        html: `
              <h2>Perdeu a chave?</h2>
              <p>Não se preocupe, clique no link abaixo para recuperar sua senha!</p>
              <p>
                <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
                  Clique aqui para recuperar sua senha!
                </a>
              </p>
        `,
      });

      return response.render("session/forgot-password", {
        success: "Verfique seu email para resetar sua senha!",
      });
    } catch (error) {
      console.error(error);

      return response.render("session/forgot-password", {
        error: "Erro inesperado, tente novamente!",
      });
    }
  },

  resetForm(request, response) {
    try {
      return response.render("session/password-reset", { token: request.query.token });
    } catch (error) {
      console.log(error);
    }
  },

  async reset(request, response) {
    const user = request.user;
    const { password, token } = request.body;

    try {
      const newPassword = await hash(password, 8);

      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: "",
      });

      return response.render("session/login", {
        user: request.body,
        success: "Senha alterada com sucesso! Agora, faça seu login!",
      });
    } catch (error) {
      console.error(error);

      return response.render("session/password-reset", {
        user: request.body,
        token,
        error: "Erro inesperado, tente novamente!",
      });
    }
  },
};
