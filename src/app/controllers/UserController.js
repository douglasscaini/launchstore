const User = require("../models/User");

module.exports = {
  registerForm(request, response) {
    return response.render("user/register");
  },
  show(request, response) {
    return response.send("ok, cadastrado!");
  },

  async post(request, response) {
    const userId = await User.create(request.body);

    return response.redirect("/users");
  },
};
