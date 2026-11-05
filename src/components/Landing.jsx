import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiUpload,
  FiShield,
  FiCreditCard,
  FiDownload,
  FiArrowRight,
  FiLock,
  FiCompass,
  FiCheckCircle,
} from "react-icons/fi";

// Change these if your login / register pages live at different paths
const LOGIN_PATH = "/login";
const REGISTER_PATH = "/register";

// ---------------------------------------------------------------
// HERO IMAGES - the three boxes at the top of the page.
// 1. Put your image files inside the "public/art" folder
//    (create it if it doesn't exist, next to index.html).
// 2. Make sure the file names below match yours exactly
//    (jpg, png and webp all work).
// If a file is missing, a coloured placeholder is shown instead.
// ---------------------------------------------------------------
const HERO_IMAGES = [
  { src: "/art/art-1.png", alt: "Artwork 1" },
  { src: "/art/art-2.jpg", alt: "Artwork 2" },
  { src: "/art/art-3.jpg", alt: "Artwork 3" },
];

// Where each of the three boxes sits (left, right, middle)
const HERO_POSITIONS = [
  "w-44 h-56 sm:w-52 sm:h-64 left-2 sm:left-6 top-4 -rotate-6",
  "w-44 h-56 sm:w-52 sm:h-64 right-2 sm:right-6 top-0 rotate-6",
  "w-44 h-56 sm:w-52 sm:h-64 left-1/2 -translate-x-1/2 top-16 sm:top-20",
];

// Shown only when an image file can't be found
const HERO_FALLBACKS = [
  "from-sky-400 to-indigo-500",
  "from-amber-300 to-rose-400",
  "from-emerald-300 to-sky-500",
];

const steps = [
  {
    icon: FiUpload,
    title: "Post your art",
    text: "Upload your artwork and set your price. Your original file is locked away the moment it's uploaded.",
  },
  {
    icon: FiCompass,
    title: "Buyers browse",
    text: "Everyone sees a watermarked preview in the marketplace, never your full-quality file.",
  },
  {
    icon: FiCreditCard,
    title: "They pay with Paystack",
    text: "We confirm the payment with Paystack before anything gets unlocked.",
  },
  {
    icon: FiDownload,
    title: "One clean download",
    text: "The buyer gets the full-quality file once. To get another copy, they pay again.",
  },
];

const features = [
  {
    icon: FiShield,
    title: "Protected originals",
    text: "Full-quality files are stored privately. Only a small, watermarked preview is ever shown publicly.",
  },
  {
    icon: FiLock,
    title: "One download per payment",
    text: "Every purchase unlocks a single download. After that, the download button switches off until the buyer pays again.",
  },
  {
    icon: FiCreditCard,
    title: "Verified payments",
    text: "Every payment is checked directly with Paystack on our server, not just trusted from the browser.",
  },
  {
    icon: FiCheckCircle,
    title: "Your own dashboard",
    text: "Track your artworks, see your sales and manage everything in one place.",
  },
];

function MockArt({ className, src, alt, fallback }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`absolute rounded-2xl shadow-xl overflow-hidden border-4 border-white bg-gray-100 ${className}`}
    >
      {failed ? (
        <div className={`w-full h-full bg-gradient-to-br ${fallback}`} />
      ) : (
        <img
          src={src}
          alt={alt}
          draggable={false}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover select-none pointer-events-none"
        />
      )}
      {/* Same watermark buyers see on real artworks */}
      <span className="absolute inset-0 flex items-center justify-center text-white/60 font-bold text-xl tracking-wide -rotate-12 select-none pointer-events-none">
        ArtVault
      </span>
    </div>
  );
}

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
              AV
            </div>
            <span className="font-bold text-lg">ArtVault</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="hover:text-sky-600 transition"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-sky-600 transition"
            >
              Features
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to={LOGIN_PATH}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-sky-600 transition"
            >
              Log in
            </Link>
            <Link
              to={REGISTER_PATH}
              className="px-5 py-2.5 text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition"
            >
              Create account
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Features
            </button>
            <div className="flex gap-3 pt-2">
              <Link
                to={LOGIN_PATH}
                className="flex-1 text-center px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700"
              >
                Log in
              </Link>
              <Link
                to={REGISTER_PATH}
                className="flex-1 text-center px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold"
              >
                Create account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold bg-sky-100 text-sky-700 px-3 py-1.5 rounded-full">
              <FiShield size={13} /> Your art stays protected until it's paid for
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Sell your art.{" "}
              <span className="text-sky-600">Keep it safe</span> until you get
              paid.
            </h1>

            <p className="mt-5 text-lg text-gray-600 max-w-xl">
              ArtVault lets artists post their work for sale. Buyers see a
              watermarked preview, pay securely with Paystack, and get the
              full-quality file only after payment.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to={REGISTER_PATH}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-600/20 transition"
              >
                Create free account <FiArrowRight size={18} />
              </Link>
              <Link
                to={LOGIN_PATH}
                className="inline-flex items-center justify-center px-7 py-3.5 border border-gray-300 hover:border-sky-500 hover:text-sky-600 text-gray-700 font-semibold rounded-xl transition"
              >
                Log in
              </Link>
            </div>
          </div>

          {/* Hero visual: edit HERO_IMAGES at the top of this file to change the pictures */}
          <div className="relative h-[340px] sm:h-[420px]">
            {HERO_IMAGES.slice(0, 3).map((image, index) => (
              <MockArt
                key={image.src}
                src={image.src}
                alt={image.alt}
                className={HERO_POSITIONS[index]}
                fallback={HERO_FALLBACKS[index]}
              />
            ))}

            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[85%] max-w-xs bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <FiDownload size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold">Payment confirmed</p>
                <p className="text-xs text-gray-500">
                  Your one-time download is ready
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">How it works</h2>
          <p className="mt-3 text-gray-600">
            From upload to download in four simple steps.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <span className="absolute top-5 right-5 text-4xl font-extrabold text-sky-100">
                {index + 1}
              </span>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <step.icon size={22} />
              </div>
              <h3 className="mt-4 font-semibold text-lg">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold">Built to protect your work</h2>
            <p className="mt-3 text-gray-600">
              Everything a seller needs to share art without giving it away.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
              >
                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <feature.icon size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="rounded-3xl bg-gradient-to-r from-sky-600 to-sky-500 text-white px-6 sm:px-12 py-12 sm:py-14 text-center">
          <h2 className="text-3xl font-bold">Ready to share your art?</h2>
          <p className="mt-3 text-sky-100 max-w-xl mx-auto">
            Create your free account and post your first artwork in minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={REGISTER_PATH}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-sky-700 font-semibold rounded-xl hover:bg-sky-50 transition"
            >
              Create account <FiArrowRight size={18} />
            </Link>
            <Link
              to={LOGIN_PATH}
              className="inline-flex items-center justify-center px-7 py-3.5 border border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
              AV
            </div>
            <span className="font-semibold text-gray-700">ArtVault</span>
          </div>
          <p>© {new Date().getFullYear()} ArtVault. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to={LOGIN_PATH} className="hover:text-sky-600">
              Log in
            </Link>
            <Link to={REGISTER_PATH} className="hover:text-sky-600">
              Create account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}