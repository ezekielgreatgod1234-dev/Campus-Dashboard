import { useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiChevronDown,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";

const countries = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "United States", "United Kingdom",
  "Canada", "Germany", "France", "India", "China", "Brazil", "Australia",
  // ... you can keep the full list if needed
];

export default function Register({ onRegister, onLogin, loading, error }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    gender: "",
    country: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      return onRegister({ error: "Password must contain at least 6 characters." });
    }
    if (form.password !== form.confirmPassword) {
      return onRegister({ error: "Passwords do not match." });
    }
    onRegister({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      gender: form.gender,
      country: form.country,
      dateOfBirth: form.dateOfBirth,
      password: form.password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={onLogin}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-sky-600 mb-6"
        >
          <FiArrowLeft size={16} /> Back to login
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-sky-600 text-white font-bold text-lg flex items-center justify-center">
            AV
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">ArtVault</h2>
            <p className="text-sm text-gray-500">Sell & Discover Art</p>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Join ArtVault and start selling your art</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <div className="relative">
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
              <div className="relative">
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                  required
                >
                  <option value="">Select</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of birth</label>
            <div className="relative">
              <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 mt-2"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <button onClick={onLogin} className="text-sky-600 font-semibold hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}