import { useId, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ email, password }) {
  const errors = {};

  if (!email.trim()) errors.email = "Email is required.";
  else if (!emailPattern.test(email.trim()))
    errors.email = "Enter a valid email.";

  if (!password) errors.password = "Password is required.";
  else if (password.length < 8)
    errors.password = "Password must be at least 8 characters.";

  return errors;
}

export default function Login() {
  const navigate = useNavigate();
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const errors = useMemo(
    () => validate({ email, password }),
    [email, password],
  );
  const hasErrors = Object.keys(errors).length > 0;
  const showErrors = submittedOnce;
  const isFormValid = email.trim() && password && !hasErrors;

  async function onSubmit(e) {
    e.preventDefault();
    setSubmittedOnce(true);
    setStatus(null);

    if (hasErrors) return;

    setIsSubmitting(true);
    // Mock login: only these credentials are valid
    const MOCK_USER = "reactdev@gmail.com";
    const MOCK_PASS = "12345678";

    try {
      await new Promise((r) => setTimeout(r, 400));

      const isValid =
        email.trim().toLowerCase() === MOCK_USER && password === MOCK_PASS;

      if (!isValid) {
        setStatus({
          type: "error",
          message: "Invalid email or password. Please try again.",
        });
        setIsSubmitting(false);
        return;
      }

      setStatus({
        type: "success",
        message: `Signed in as ${email.trim()}${remember ? " (remembered)" : ""}.`,
      });
      setTimeout(() => {
        navigate("/users");
      }, 800);
    } catch {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="loginShell">
      <div className="loginBackdrop" aria-hidden="true" />

      <main className="loginMain">
        <section className="loginCard" aria-label="Sign in">
          <header className="loginHeader">
            <div className="loginBrand">
              <div className="loginMark" aria-hidden="true">
                G3
              </div>
              <div className="loginBrandText">
                <div className="loginTitle">Welcome back</div>
                <div className="loginSubtitle">Sign in to continue</div>
              </div>
            </div>
          </header>

          <form className="loginForm" onSubmit={onSubmit} noValidate>
            <div className="loginField">
              <label className="loginLabel" htmlFor={emailId}>
                Email
              </label>
              <input
                id={emailId}
                className="loginInput"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={showErrors && !!errors.email ? "true" : "false"}
                aria-describedby={
                  showErrors && errors.email ? `${emailId}-error` : undefined
                }
              />
              {showErrors && errors.email ? (
                <div
                  className="loginError"
                  id={`${emailId}-error`}
                  role="alert"
                >
                  {errors.email}
                </div>
              ) : null}
            </div>

            <div className="loginField">
              <label className="loginLabelRow" htmlFor={passwordId}>
                <span>Password</span>
                <button
                  type="button"
                  className="loginLinkButton"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </label>
              <input
                id={passwordId}
                className="loginInput"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={
                  showErrors && !!errors.password ? "true" : "false"
                }
                aria-describedby={
                  showErrors && errors.password
                    ? `${passwordId}-error`
                    : undefined
                }
              />
              {showErrors && errors.password ? (
                <div
                  className="loginError"
                  id={`${passwordId}-error`}
                  role="alert"
                >
                  {errors.password}
                </div>
              ) : null}
            </div>

            <div className="loginRow">
              <label className="loginCheckbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <a
                className="loginLink"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>

            <button
              className="loginPrimary"
              type="submit"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>

            {status ? (
              <div
                className={`loginStatus loginStatus--${status.type}`}
                role="status"
              >
                {status.message}
              </div>
            ) : null}
          </form>
        </section>
      </main>
    </div>
  );
}
