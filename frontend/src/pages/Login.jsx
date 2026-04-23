import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const USERS_STORAGE_KEY = "echosoulUsers";
const TOKEN_STORAGE_KEY = "token";

const LOGIN_FORM = {
  email: "",
  password: "",
};

const SIGNUP_FORM = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const readUsers = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedUsers = JSON.parse(
      window.localStorage.getItem(USERS_STORAGE_KEY) ?? "[]",
    );

    return Array.isArray(storedUsers) ? storedUsers : [];
  } catch {
    return [];
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(LOGIN_FORM);
  const [signupForm, setSignupForm] = useState(SIGNUP_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const { login, token } = useContext(AppContext);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (token) {
      navigate("/my-profile");
    }
  }, [token, navigate]);

  useEffect(() => {
    const requestedMode = searchParams.get("mode");
    setMode(requestedMode === "signup" ? "signup" : "login");
    setLoading(false);
    setMessage({ type: "", text: "" });
  }, [searchParams]);

  const heading = useMemo(
    () =>
      mode === "login"
        ? {
            title: "Login",
            description: "Enter your account details to continue.",
            button: "Login",
          }
        : {
            title: "Create Account",
            description: "Fill in your details to create a new account.",
            button: "Create Account",
          },
    [mode],
  );

  const resetFeedback = () => {
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    resetFeedback();
    setLoginForm((current) => ({ ...current, [name]: value }));
  };

  const handleSignupChange = (event) => {
    const { name, value } = event.target;
    resetFeedback();
    setSignupForm((current) => ({ ...current, [name]: value }));
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    window.setTimeout(() => {
      const users = readUsers();
      const matchedUser = users.find(
        (user) =>
          user.email.toLowerCase() === loginForm.email.toLowerCase() &&
          user.password === loginForm.password,
      );

      if (!matchedUser) {
        setLoading(false);
        setMessage({
          type: "error",
          text: "Invalid email or password.",
        });
        return;
      }

      window.localStorage.setItem(TOKEN_STORAGE_KEY, "123");
      window.localStorage.setItem(
        "echosoulCurrentUser",
        JSON.stringify(matchedUser),
      );

      login(matchedUser);

      setLoading(false);
      setLoginForm(LOGIN_FORM);
      navigate("/my-profile");
    }, 500);
  };

  const handleSignupSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    window.setTimeout(() => {
      const trimmedName = signupForm.name.trim();
      const trimmedEmail = signupForm.email.trim().toLowerCase();
      const trimmedPhone = signupForm.phone.trim();

      if (signupForm.password.length < 6) {
        setLoading(false);
        setMessage({
          type: "error",
          text: "Password must be at least 6 characters long.",
        });
        return;
      }

      if (signupForm.password !== signupForm.confirmPassword) {
        setLoading(false);
        setMessage({
          type: "error",
          text: "Passwords do not match.",
        });
        return;
      }

      const users = readUsers();
      const userExists = users.some((user) => user.email === trimmedEmail);

      if (userExists) {
        setLoading(false);
        setMessage({
          type: "error",
          text: "An account with this email already exists.",
        });
        return;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        password: signupForm.password,
        createdAt: new Date().toISOString(),
      };

      window.localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify([...users, newUser]),
      );
      window.localStorage.setItem(TOKEN_STORAGE_KEY, "123");
      window.localStorage.setItem(
        "echosoulCurrentUser",
        JSON.stringify(newUser),
      );

      setLoading(false);
      setSignupForm(SIGNUP_FORM);
      navigate("/my-profile");
    }, 500);
  };

  return (
    <div className="flex min-h-[calc(100vh-180px)] items-center justify-center px-6 pt-24 pb-14 md:px-16 md:pt-28">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 text-white backdrop-blur-md md:p-8">
        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setLoading(false);
                setMessage({ type: "", text: "" });
              }}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                mode === "login"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setLoading(false);
                setMessage({ type: "", text: "" });
              }}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                mode === "signup"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h1 className="text-3xl font-semibold">{heading.title}</h1>
          <p className="mt-2 text-sm text-slate-400">{heading.description}</p>
        </div>

        {message.text && (
          <div
            className={`mt-6 rounded-2xl border p-4 text-sm ${
              message.type === "success"
                ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                : "border-red-400/20 bg-red-500/10 text-red-100"
            }`}
          >
            {message.text}
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={loginForm.email}
              onChange={handleLoginChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={handleLoginChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Logging in..." : heading.button}
            </button>

            <p className="text-center text-sm text-slate-400">
              New here?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setMessage({ type: "", text: "" });
                }}
                className="font-medium text-blue-300 transition hover:text-blue-200"
              >
                Create Account
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={signupForm.name}
              onChange={handleSignupChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={signupForm.phone}
              onChange={handleSignupChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={signupForm.email}
              onChange={handleSignupChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={signupForm.password}
              onChange={handleSignupChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={signupForm.confirmPassword}
              onChange={handleSignupChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating..." : heading.button}
            </button>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setMessage({ type: "", text: "" });
                }}
                className="font-medium text-blue-300 transition hover:text-blue-200"
              >
                Login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
