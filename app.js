const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

const app = require("express")();
const stripe = require("stripe")(keySecret);
const PORT = process.env.PORT || 5000;

var express = require("express");

app.set("view engine", "pug");
app.use(require("body-parser").urlencoded({extended: false}));

app.use('/public', express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    console.log(123);
    res.render("index.pug", {keyPublishable});
});

app.post("/charge", (req, res) => {
  console.log(req.body)
  let amount = 500;
  
  var pugVariables = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    address: req.body.address+' à '+req.body.city,
    amount: (amount/100)+'€'
  };

  stripe.customers.create({
     email: req.body.email,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Exercice",
      currency: "eur",
      customer: customer.id
    }))
  .then(charge => res.render("charge.pug", pugVariables));
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));