import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnnouncementBar } from "../components/layout/AnnouncementBar";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Overline } from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";
import { REGISTER } from "../constants/testIds/auth";

const formatDetail = (detail) => {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg).filter(Boolean).join(" ");
  return "Something went wrong. Please try again.";
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(formatDetail(err?.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "mt-2 w-full border border-brand-sand bg-brand-surface px-4 py-3 text-sm text-brand-charcoal outline-none transition-colors focus:border-brand-orange";
  const labelClass = "text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-charcoal";

  return (
    <div className="min-h-screen bg-brand-cream font-sans text-brand-charcoal" data-testid="register-page">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto flex max-w-md flex-col px-6 py-16 lg:py-24">
        <Overline>Account</Overline>
        <h1 className="mt-4 font-serif text-4xl tracking-tight text-brand-charcoal">Join HESHAURA.</h1>
        <p className="mt-3 text-sm text-brand-stone">Create your account to get started.</p>
        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <div>
            <label htmlFor="register-name" className={labelClass}>
              Name
            </label>
            <input
              id="register-name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid={REGISTER.nameInput}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="register-email" className={labelClass}>
              Email
            </label>
            <input
              id="register-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid={REGISTER.emailInput}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="register-password" className={labelClass}>
              Password
            </label>
            <input
              id="register-password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid={REGISTER.passwordInput}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="register-password-confirm" className={labelClass}>
              Confirm Password
            </label>
            <input
              id="register-password-confirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              data-testid={REGISTER.passwordConfirmInput}
              className={inputClass}
            />
          </div>
          {error && (
            <p className="text-sm font-medium text-destructive" data-testid="register-error">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            data-testid={REGISTER.submitButton}
            className="w-full bg-brand-charcoal py-4 text-sm font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange disabled:opacity-50"
          >
            {busy ? "Creating account…" : "Create Account"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-brand-stone">
          Already have an account?{" "}
          <Link
            to="/login"
            data-testid={REGISTER.loginLink}
            className="font-semibold text-brand-orange underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
