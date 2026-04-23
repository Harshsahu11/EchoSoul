import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const CONTACT_STORAGE_KEY = "echosoulContactRequests";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  topic: "",
  preferredContact: "Email",
  message: "",
};

const contactMethods = [
  {
    title: "Email",
    value: "echosoul.connect@gmail.com",
    href: "mailto:echosoul.connect@gmail.com",
    description: "Best for detailed questions, support requests, and follow-ups.",
  },
  {
    title: "Phone",
    value: "+91 XXXXX XXXXX",
    href: null,
    description: "Reach out if you want help choosing the right session format.",
  },
  {
    title: "Location",
    value: "India",
    href: null,
    description: "Online-friendly guidance with a calm, flexible experience.",
  },
];

const supportReasons = [
  {
    title: "Session Guidance",
    description:
      "Not sure which service fits your situation? We can point you to the right starting place.",
  },
  {
    title: "Booking Support",
    description:
      "If you are facing trouble with appointments or timing, we can help you sort it quickly.",
  },
  {
    title: "Safe First Step",
    description:
      "You do not need to have the perfect words. A simple message is enough to begin.",
  },
];

const Contact = () => {
  const navigate = useNavigate();
  const { Person } = useContext(AppContext);

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const categories = useMemo(
    () => [...new Set(Person.map((item) => item.category))],
    [Person],
  );

  const featuredServices = useMemo(() => Person.slice(0, 4), [Person]);

  const stats = useMemo(
    () => [
      {
        label: "Support Areas",
        value: `${categories.length}+`,
      },
      {
        label: "Session Options",
        value: `${Person.length}+`,
      },
      {
        label: "Typical Session",
        value: "20-30 min",
      },
    ],
    [Person.length, categories.length],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (submitted) {
      setSubmitted(false);
    }
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const request = {
      id: `contact-${Date.now()}`,
      ...form,
      submittedAt: new Date().toISOString(),
    };

    window.setTimeout(() => {
      try {
        const existingRequests = JSON.parse(
          window.localStorage.getItem(CONTACT_STORAGE_KEY) ?? "[]",
        );

        const safeRequests = Array.isArray(existingRequests)
          ? existingRequests
          : [];

        window.localStorage.setItem(
          CONTACT_STORAGE_KEY,
          JSON.stringify([...safeRequests, request]),
        );
      } catch {
        window.localStorage.setItem(
          CONTACT_STORAGE_KEY,
          JSON.stringify([request]),
        );
      }

      setLoading(false);
      setSubmitted(true);
      setForm(INITIAL_FORM);
    }, 900);
  };

  return (
    <div className="px-6 pt-24 pb-14 text-white md:px-16 md:pt-28">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_35%)]" />

        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-blue-300">
              Contact EchoSoul
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
              Reach out for support, clarity, and a{" "}
              <span className="text-blue-400">gentle next step</span>.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Whether you want to ask a question, understand which session
              fits best, or simply begin a conversation, this page is built to
              make that first reach-out feel easy and calm.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/services")}
                className="rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
              >
                Explore Services
              </button>

              <a
                href="mailto:echosoul.connect@gmail.com"
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-blue-400 hover:text-white"
              >
                Send An Email
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"
                >
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-blue-400">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-blue-500/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-3">
              <img
                src={assets.contact_image}
                alt="Contact EchoSoul"
                className="h-[520px] w-full rounded-[1.4rem] object-cover"
              />

              <div className="absolute right-6 bottom-6 left-6 rounded-2xl border border-white/10 bg-slate-950/85 p-5 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.28em] text-blue-300">
                  A Warm First Conversation
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  You do not need to have everything figured out first.
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Start with what feels true right now. We can help you turn
                  confusion into a clearer next step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {contactMethods.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-blue-300">
              {item.title}
            </p>

            {item.href ? (
              <a
                href={item.href}
                className="mt-3 block text-xl font-semibold text-white transition hover:text-blue-300"
              >
                {item.value}
              </a>
            ) : (
              <p className="mt-3 text-xl font-semibold text-white">
                {item.value}
              </p>
            )}

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {item.description}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-7">
          <p className="text-sm uppercase tracking-[0.28em] text-blue-300">
            Send A Message
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Tell us what kind of support you are looking for
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Share as much or as little as you want. This form is here to make
            it easier to begin.
          </p>

          {submitted && (
            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              Your message has been noted successfully. We are ready for the
              next step whenever you are.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
              />

              <select
                name="preferredContact"
                value={form.preferredContact}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
              >
                <option>Email</option>
                <option>Phone</option>
                <option>WhatsApp</option>
              </select>
            </div>

            <input
              type="text"
              name="topic"
              placeholder="Topic or concern"
              value={form.topic}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
            />

            <textarea
              name="message"
              rows="6"
              placeholder="Write your message here"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-slate-400">
                Prefer booking directly instead? You can head straight to the
                services page and reserve a session.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
            <p className="text-sm uppercase tracking-[0.28em] text-blue-300">
              Reasons To Reach Out
            </p>

            <div className="mt-5 space-y-4">
              {supportReasons.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-slate-950/45 p-5"
                >
                  <h3 className="text-xl font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-7">
            <p className="text-sm uppercase tracking-[0.28em] text-blue-300">
              Common Areas Of Support
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Featured Sessions
              </p>

              <div className="mt-4 space-y-3">
                {featuredServices.map((service) => (
                  <button
                    type="button"
                    key={service._id}
                    onClick={() => navigate(`/appointment/${service._id}`)}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-blue-400 hover:bg-blue-500/10"
                  >
                    <div>
                      <p className="text-base font-medium text-white">
                        {service.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {service.category} | {service.duration}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-blue-300">
                      Book
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
