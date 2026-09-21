import { useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

export default function Login({
  onLogin,
  onRegister,
  loading,
  error,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    onLogin({
      email: email.trim(),
      password,
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <div className="brand-logo">CM</div>

          <div>
            <h2>CampusMart</h2>
            <span>Campus marketplace</span>
          </div>
        </div>

        <div className="auth-heading">
          <h1>Welcome back</h1>

          <p>
            Sign in to your CampusMart account
            and continue where you left off.
          </p>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>

            <div className="input-box">
              <FiMail />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="input-box">
              <FiLock />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="small-spinner" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="switch-auth">
          <span>
            Don't have a CampusMart account?
          </span>

          <button onClick={onRegister}>
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}