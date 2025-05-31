require("dotenv").config({ path: "../keys.env" });
console.log("🔍 STRIPE_SECRET_KEY from env:", process.env.STRIPE_SECRET_KEY);

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Use your actual Stripe secret key
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.raw({ type: "application/json" })); // Required for Stripe webhooks

// ✅ Function to Calculate Service Price
function calculateServiceAmount(service) {
  switch (service) {
    case "تصليح السيارة":
      return 10000; // $100
    case "تغيير الزيت":
      return 5000; // $50
    case "تعبئة البنزين":
      return 3000; // $30
    default:
      return 0;
  }
}

// ✅ Endpoint to Handle Payment
app.post("/payment", async (req, res) => {
  try {
    console.log("📩 Received Payment Request:", req.body);

    const { paymentMethodId, clientSecret, paymentIntentId } = req.body;

    if (!paymentIntentId || !clientSecret || !paymentMethodId) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("🔵 Confirming existing PaymentIntent:", paymentIntentId);

    // Confirm PaymentIntent using Stripe API
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    console.log("✅ PaymentIntent confirmed:", paymentIntent.id);

    res.json({
      success: true,
      message: "Payment confirmed successfully!",
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("❌ Payment confirmation error:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


// ✅ Stripe Webhook to Handle Payment Success
app.post("/api/payment/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    console.log("🔵 Received Stripe Event:", event.type);

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("✅ Payment succeeded:", paymentIntent.id);
        // Add your logic for successful payments here (e.g., update database)
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.log("❌ Payment failed:", failedPayment.last_payment_error.message);
        // Add your logic for failed payments here (e.g., notify the user)
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }


    res.status(200).send("Webhook received successfully!");
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));