import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../api';
import { toast } from "react-toastify"; // ✅ Toast import

const stripePromise = loadStripe("pk_test_51QPMWrJqPNUV240JiWLMmVP7St5TrTBUlrY3jPdmSxCFRlFJPorrk4xgBLA4rYmocqEmgMuOmdAQXs0p0eSWzdw700pBnZfokd");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("❌ CardElement is missing");
      toast.error("Payment form is incomplete.");
      return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error("❌ Payment Method Error:", error);
      toast.error(error.message || "Payment method creation failed.");
      setLoading(false);
      return;
    }

    let clientSecret = localStorage.getItem("clientSecret");
    let paymentIntentId = localStorage.getItem("paymentIntentId");

    if (!clientSecret || !paymentIntentId) {
      toast.error("No active payment session found.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("https://stripe-production-ddc5.up.railway.app/payment", {
        paymentMethodId: paymentMethod.id,
        clientSecret,
        paymentIntentId,
      });

      console.log("✅ Payment Confirmation Response:", response.data);
      toast.success("🎉 Payment successful!");
      navigate("/requestsuser");

    } catch (err) {
      console.error("❌ Payment Confirmation Failed:", err.response?.data || err.message);
      toast.error("Payment failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg max-w-md mx-auto">
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="block w-full p-2 border rounded" required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="block w-full p-2 border rounded" required />
      <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="block w-full p-2 border rounded" required />
      <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="block w-full p-2 border rounded" required />
      <CardElement options={{ hidePostalCode: true }} className="p-2 border rounded" />
      <button type="submit" disabled={!stripe || loading} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const PaymentForm = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentForm;
