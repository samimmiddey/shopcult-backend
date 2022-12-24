const express = require("express");
const app = express();

const port = process.env.PORT || 8080;

// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_API_KEY, {
   apiVersion: "2022-08-01",
});

app.use((_req, res, next) => {
   res.header('Access-Control-Allow-Origin', 'https://shopcult.netlify.app');
   res.header('Access-Control-Allow-Headers', '*');

   next();
});

app.get("/config", (req, res) => {
   res.send({
      publishableKey: process.env.STRIPE_PUBLISHABLE_API_KEY,
   });
});

app.post("/create-payment-intent", async (req, res) => {
   try {
      const paymentIntent = await stripe.paymentIntents.create({
         currency: "INR",
         amount: 1999,
         automatic_payment_methods: { enabled: true },
      });

      // Send publishable key and PaymentIntent details to client
      res.send({
         clientSecret: paymentIntent.client_secret,
      });
   } catch (e) {
      return res.status(400).send({
         error: {
            message: e.message,
         },
      });
   }
});

app.listen(port, () =>
   console.log(`Node server listening at ${port}`)
);