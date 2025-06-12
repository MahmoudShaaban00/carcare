import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../api';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Stripe public key
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
      toast.error("❌ Payment form is incomplete.");
      setLoading(false);
      return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      toast.error(error.message || "Payment method creation failed.");
      setLoading(false);
      return;
    }

    const clientSecret = localStorage.getItem("clientSecret");
    const paymentIntentId = localStorage.getItem("paymentIntentId");

    if (!clientSecret || !paymentIntentId) {
      toast.error("❌ No active payment session found.");
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post("https://stripe-production-ddc5.up.railway.app/payment", {
        paymentMethodId: paymentMethod.id,
        clientSecret,
        paymentIntentId,
      });

      toast.success("🎉 Payment successful!", {
        position: "top-center",
        theme: "colored",
      });

      setTimeout(() => {
        navigate("/requestsuser");
      }, 2000);

    } catch (err) {
      toast.error("❌ Payment failed. Please try again.");
    }

    setLoading(false);
  };

  // Retrieve and format service-related data from localStorage
  const servicePrice = parseFloat(localStorage.getItem("ServicePrice") || "0").toFixed(2);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md space-y-5 border border-purple-300"
        >
          <h2 className="text-2xl font-bold text-purple-700 text-center">Secure Payment</h2>

          <p className="text-lg text-purple-600 text-center mb-2">
            Total Amount: <span className="font-semibold">${servicePrice}</span>
          </p>

        

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />

          <div className="p-4 border rounded-lg bg-gray-50">
            <CardElement options={{ hidePostalCode: true }} />
          </div>

          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition-all duration-300"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

const PaymentForm = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentForm;
