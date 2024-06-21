const express = require("express");
const path = require("path");
const cors = require("cors");
const router = express.Router();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const compression = require("compression");

const app = express();
const port = 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("started");
  res.send("started");
});

app.post("/send-email", (req, res) => {
  const { name, company, email, message } = req.body || {};

  if (!(name && company && message && email && email.includes("@"))) {
    return res.send("invalid data");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  transporter
    .verify()
    .then(() => {
      transporter
        .sendMail({
          from: `"${name}" <smtp.danielwust@gmail.com>`, // sender address
          to: "contato@danielwust.com, smtp.danielwust@gmail.com", // list of receivers
          subject: `${name} <${email}> ${
            company ? `from ${company}` : ""
          } submitted a contact form`, // Subject line
          text: `${message}`, // plain text body
        })
        .then((info) => {
          console.log({ info });
          res.json({ message: "success" });
        })
        .catch((e) => {
          console.error(e);
          res.status(500).send(e);
        });
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send(e);
    });
});

// listen to app on port 8080
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
