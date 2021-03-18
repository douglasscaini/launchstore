const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "67e2a408e5c2b8",
    pass: "389b3f62a93121",
  },
});
