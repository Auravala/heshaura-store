import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnnouncementBar } from "../components/layout/AnnouncementBar";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Overline } from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";
import { LOGIN } from "../constants/testIds/auth";

const formatDetail = (detail) => {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg).filter(Boolean).join(" ");
  return "Something went wrong. Please try again.";
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(formatDetail(err?.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream font-sans text-brand-charcoal" data-testid="login-page">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto flex max-w-md flex-col px-6 py-16 lg:py-24">
        <Overline>Account</Overline>
        <h1 className="mt-4 font-serif text-4xl tracking-tight text-brand-charcoal">Welcome back.</h1>
        <p className="mt-3 text-sm text-brand-stone">Sign in to your HESHAURA account.</p>
        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <div>
            <label
              htmlFor="login-email"
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-charcoal"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid={LOGIN.emailInput}
              className="mt-2 w-full border border-brand-sand bg-brand-surface px-4 py-3 text-sm text-brand-charcoal outline-none transition-colors focus:border-brand-orange"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-charcoal"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid={LOGIN.passwordInput}
              className="mt-2 w-full border border-brand-sand bg-brand-surface px-4 py-3 text-sm text-brand-charcoal outline-none transition-colors focus:border-brand-orange"
            />
          </div>
          {error && (
            <p className="text-sm font-medium text-destructive" data-testid="login-error">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            data-testid={LOGIN.submitButton}
            className="w-full bg-brand-charcoal py-4 text-sm font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-brand-stone">
          New to HESHAURA?{" "}
          <Link
            to="/register"
            data-testid={LOGIN.registerLink}
            className="font-semibold text-brand-orange underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
