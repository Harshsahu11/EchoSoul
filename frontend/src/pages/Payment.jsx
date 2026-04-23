import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const APPOINTMENTS_STORAGE_KEY = "confirmedAppointments";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById("razorpay-script");
    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    const allAppointments = stored ? JSON.parse(stored) : [];
    const selected = allAppointments.find((item) => item.id === appointmentId);

    if (!selected) {
      setMessage("Appointment not found. Please return to My Appointments.");
      setLoading(false);
      return;
    }

    setAppointment(selected);
    setLoading(false);
  }, [appointmentId]);

  const updateLocalPaymentStatus = (status) => {
    const stored = window.localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    const allAppointments = stored ? JSON.parse(stored) : [];
    const updated = allAppointments.map((item) =>
      item.id === appointmentId ? { ...item, paymentStatus: status } : item,
    );
    window.localStorage.setItem(
      APPOINTMENTS_STORAGE_KEY,
      JSON.stringify(updated),
    );
  };

  const handlePayNow = async () => {
    if (!appointment) {
      return;
    }

    const authToken = window.localStorage.getItem("token");
    if (!authToken) {
      navigate("/login");
      return;
    }

    setMessage("Creating payment order...");

    try {
      const orderResponse = await fetch(
        "http://localhost:3000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: authToken,
          },
          body: JSON.stringify({ appointmentId }),
        },
      );

      const orderData = await orderResponse.json();
      if (!orderData.success) {
        setMessage(orderData.message || "Unable to create payment order.");
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setMessage("Unable to load Razorpay checkout. Please try again.");
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "EchoSoul",
        description:
          appointment.serviceTitle ||
          appointment.serviceName ||
          "Appointment Payment",
        order_id: orderData.order.id,
        handler: async function (response) {
          setMessage("Verifying payment...");
          const verifyResponse = await fetch(
            "http://localhost:3000/api/payment/verify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token: authToken,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId,
              }),
            },
          );

          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            updateLocalPaymentStatus("paid");
            setMessage("Payment successful! Redirecting to My Appointments...");
            setTimeout(() => {
              navigate("/my-appointments");
            }, 1200);
          } else {
            setMessage(verifyData.message || "Payment verification failed.");
          }
        },
        prefill: {
          name: appointment.userName || appointment.userDetails?.name || "",
          email: appointment.userEmail || appointment.userDetails?.email || "",
          contact:
            appointment.userDetails?.phone || appointment.userPhone || "",
        },
        theme: {
          color: "#0ea5e9",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      setMessage("Payment initialization failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-4xl border border-white/10 bg-slate-900/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.65)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">
                Payment Checkout
              </p>
              <h1 className="text-4xl font-semibold text-white">
                Complete Payment
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Pay securely for your appointment booking.
              </p>
            </div>
            <button
              onClick={() => navigate("/my-appointments")}
              className="rounded-full border border-white/10 bg-slate-800/90 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
            >
              Back to Appointments
            </button>
          </div>

          {!appointment ? (
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 text-center">
              <p className="text-lg font-medium text-white">
                {message || "Appointment not found."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <div className="rounded-3xl bg-slate-950/70 p-6 border border-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Service
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    {appointment.serviceTitle || appointment.serviceName}
                  </h2>
                  <p className="mt-2 text-slate-400">
                    {appointment.notes ||
                      "Secure payment for your selected session."}
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-950/70 p-6 border border-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Appointment details
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-slate-300">
                    <div>
                      <span className="font-medium text-white">Date:</span>{" "}
                      {appointment.date}
                    </div>
                    <div>
                      <span className="font-medium text-white">Time:</span>{" "}
                      {appointment.time}
                    </div>
                    <div>
                      <span className="font-medium text-white">Patient:</span>{" "}
                      {appointment.userName || appointment.userDetails?.name}
                    </div>
                    <div>
                      <span className="font-medium text-white">Email:</span>{" "}
                      {appointment.userEmail || appointment.userDetails?.email}
                    </div>
                    <div>
                      <span className="font-medium text-white">Status:</span>{" "}
                      {appointment.paymentStatus || "pending"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-950/70 p-6 border border-white/10">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Payment summary
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Amount</span>
                    <span className="text-white text-xl font-semibold">
                      ₹{appointment.paymentAmount || appointment.amount || "0"}
                    </span>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-5 text-sm text-slate-300">
                    <p className="font-medium text-white mb-3">
                      Payment method
                    </p>
                    <p>Razorpay secure checkout</p>
                  </div>
                  <button
                    onClick={handlePayNow}
                    className="w-full rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
                  >
                    Pay Now
                  </button>
                  {message && (
                    <p className="text-sm text-slate-300">{message}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
