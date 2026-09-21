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
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export default function Register({
  onRegister,
  onLogin,
  loading,
  error,
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    gender: "",
    country: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      return onRegister({
        error:
          "Password must contain at least 6 characters.",
      });
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      return onRegister({
        error: "Passwords do not match.",
      });
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
    <div className="auth-page register-page">
      <div className="auth-card register-card">
        <button
          className="back-button"
          type="button"
          onClick={onLogin}
        >
          <FiArrowLeft />
          Back to login
        </button>

        <div className="brand">
          <div className="brand-logo">CM</div>

          <div>
            <h2>CampusMart</h2>
            <span>Campus marketplace</span>
          </div>
        </div>

        <div className="auth-heading">
          <h1>Create your account</h1>

          <p>
            Create your CampusMart account
            and join your campus marketplace.
          </p>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* FULL NAME */}

          <div className="form-group">
            <label>Full name</label>

            <div className="input-box">
              <FiUser />

              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* EMAIL */}

          <div className="form-group">
            <label>Email address</label>

            <div className="input-box">
              <FiMail />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* GENDER */}

          <div className="form-group">
            <label>Gender</label>

            <div className="input-box select-box">
              <FiUser />

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Prefer not to say">
                  Prefer not to say
                </option>
              </select>

              <FiChevronDown className="select-icon" />
            </div>
          </div>

          {/* COUNTRY */}

          <div className="form-group">
            <label>Country</label>

            <div className="input-box select-box">
              <FiGlobe />

              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select your country
                </option>

                {countries.map((country) => (
                  <option
                    key={country}
                    value={country}
                  >
                    {country}
                  </option>
                ))}
              </select>

              <FiChevronDown className="select-icon" />
            </div>
          </div>

          {/* DATE */}

          <div className="form-group">
            <label>Date of birth</label>

            <div className="input-box">
              <FiCalendar />

              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* PASSWORD */}

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
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={6}
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

          {/* CONFIRM PASSWORD */}

          <div className="form-group">
            <label>Confirm password</label>

            <div className="input-box">
              <FiLock />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={6}
                required
              />

              <button
                type="button"
                className="password-button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>
            </div>
          </div>

          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="small-spinner" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="switch-auth">
          <span>
            Already have an account?
          </span>

          <button onClick={onLogin}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}