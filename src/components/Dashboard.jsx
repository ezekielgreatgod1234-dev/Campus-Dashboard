import { useState, useEffect } from "react";
import {
  FiLogOut,
  FiPlus,
  FiImage,
  FiShoppingBag,
  FiUser,
  FiTrash2,
  FiUpload,
  FiHome,
  FiDollarSign,
  FiPackage,
  FiTrendingUp,
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiCamera,
  FiEdit2,
  FiCheckCircle,
  FiSave,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Your login saves the JWT under the key "campusmart_token"
const getToken = () => localStorage.getItem("campusmart_token");

const authFetch = (path, options = {}) =>
  fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${getToken()}`,
    },
  });

const api = async (path, options = {}) => {
  const res = await authFetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong");
    err.status = res.status;
    throw err;
  }
  return data;
};

/* ------------------------------------------------------------------ */
/* Preview image: no right-click menu, no dragging. This is a deterrent */
/* only - the real protection is that the server only ever sends a     */
/* low-res watermarked preview. The full-res original needs payment.   */
/* ------------------------------------------------------------------ */
function ProtectedImage({ src, alt }) {
  return (
    <div
      className="relative w-full h-full select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute inset-0" />
    </div>
  );
}

function ArtCard({ art, badge, showSeller, children }) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition">
      <div className="aspect-[4/5] bg-gray-100 relative">
        <ProtectedImage src={art.image} alt={art.title} />
        {badge && (
          <span className="absolute top-2 left-2 bg-sky-600 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-sm text-gray-900 truncate">
          {art.title}
        </h4>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
          {art.description}
        </p>
        {showSeller && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            by {art.seller}
          </p>
        )}
        <p className="font-bold text-sky-600 text-sm mt-2">
          ₦{art.price.toLocaleString()}
        </p>
        <div className="flex gap-2 mt-3">{children}</div>
      </div>
    </div>
  );
}

export default function Dashboard({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Artwork form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Data from the backend
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sales] = useState([]); // payments / sales come later

  // Profile editable state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: user.fullName || user.name || "",
    email: user.email || "",
    country: user.country || "Nigeria",
  });

  const firstName = profileData.fullName?.split(" ")[0] || "there";

  /* ----------------------------- Loading ----------------------------- */
  const loadAll = async () => {
    try {
      const mine = await api("/artworks/mine");
      setArtworks(mine.artworks);
    } catch (err) {
      console.log(err);
      if (err.status === 401) onLogout(); // token expired / invalid
    } finally {
      setLoading(false);
    }
  };

  // Runs on every page load / refresh so everything you added is still there
  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----------------------------- Search ------------------------------ */
  const matchesSearch = (art) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      art.title.toLowerCase().includes(query) ||
      art.description.toLowerCase().includes(query)
    );
  };

  const filteredArtworks = artworks.filter(matchesSearch);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim().length > 0) {
      setActiveTab("artworks");
    }
  };

  /* ----------------------------- Images ------------------------------ */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Only JPG, PNG or WEBP images are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be 10MB or less");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  /* ---------------------------- Artworks ----------------------------- */
  const handleAddArtwork = async (e) => {
    e.preventDefault();
    if (!title || !description || !price || !imageFile) {
      alert("Please fill all fields and upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", imageFile);

    try {
      setSubmitting(true);
      const data = await api("/artworks", { method: "POST", body: formData });

      setArtworks((prev) => [data.artwork, ...prev]);
      setTitle("");
      setDescription("");
      setPrice("");
      setImageFile(null);
      setImagePreview(null);
      setActiveTab("artworks");
      setSearchQuery("");
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this artwork? This cannot be undone.")) return;
    try {
      await api(`/artworks/${id}`, { method: "DELETE" });
      setArtworks((prev) => prev.filter((art) => art.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
  };

  /* ------------------------------ Stats ------------------------------ */
  const totalEarnings = artworks.reduce((sum, art) => sum + art.price, 0);
  const activeArtworks = artworks.length;
  const totalSales = sales.length;
  const salesRevenue = sales.reduce((sum, sale) => sum + sale.price, 0);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome },
    { id: "sell", label: "Sell Artwork", icon: FiPlus },
    { id: "artworks", label: "My Artworks", icon: FiPackage },
    { id: "profile", label: "Profile", icon: FiUser },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ================= SIDEBAR - DESKTOP ================= */}
      <aside className="hidden lg:flex flex-col w-64 bg-sky-600 text-white fixed h-full z-30">
        <div className="p-6 border-b border-sky-500">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
              AV
            </div>
            <div>
              <h1 className="font-bold text-lg">ArtVault</h1>
              <p className="text-xs text-sky-100">Artist Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSearchQuery("");
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? "bg-white text-sky-700 shadow"
                  : "text-sky-100 hover:bg-sky-500"
              }`}
            >
              <item.icon size={19} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sky-500">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-200 hover:bg-red-500/20 transition"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= MOBILE SIDEBAR ================= */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-sky-600 text-white z-50 transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-sky-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              AV
            </div>
            <div>
              <h1 className="font-bold">ArtVault</h1>
              <p className="text-xs text-sky-100">Artist Dashboard</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSearchQuery("");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium ${
                activeTab === item.id
                  ? "bg-white text-sky-700"
                  : "text-sky-100 hover:bg-sky-500"
              }`}
            >
              <item.icon size={19} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sky-500">
          <button
            onClick={() => {
              setSidebarOpen(false);
              setShowLogoutModal(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-200 hover:bg-red-500/20 transition"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 lg:ml-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <FiMenu size={22} />
              </button>

              {/* Search Bar */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5 w-64 sm:w-80">
                <FiSearch className="text-gray-400 flex-shrink-0" size={18} />
                <input
                  type="text"
                  placeholder="Search artworks..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2.5 rounded-xl hover:bg-gray-100">
                <FiBell size={20} className="text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 rounded-full bg-sky-100 overflow-hidden flex items-center justify-center">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sky-700 font-semibold">
                      {firstName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">
                    {profileData.fullName}
                  </p>
                  <p className="text-xs text-gray-500">Artist</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 space-y-6">
          {/* ================= DASHBOARD TAB ================= */}
          {activeTab === "dashboard" && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome back, {firstName} 👋
                </h2>
                <p className="text-gray-500 mt-1">
                  Here's an overview of your art business.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Artworks</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {activeArtworks}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                      <FiPackage size={22} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Portfolio Value</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        ₦{totalEarnings.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <FiDollarSign size={22} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Sales</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {totalSales}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FiShoppingBag size={22} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Revenue</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        ₦{salesRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                      <FiTrendingUp size={22} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions + Sales */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab("sell")}
                      className="w-full flex items-center gap-3 bg-sky-600 hover:bg-sky-700 text-white font-medium px-5 py-3 rounded-xl transition"
                    >
                      <FiPlus size={18} /> Sell New Artwork
                    </button>
                    <button
                      onClick={() => setActiveTab("artworks")}
                      className="w-full flex items-center gap-3 bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium px-5 py-3 rounded-xl transition"
                    >
                      <FiPackage size={18} /> View My Artworks
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Sales I've Made
                    </h3>
                    <span className="text-xs font-medium bg-sky-50 text-sky-700 px-3 py-1 rounded-full">
                      {totalSales} sales
                    </span>
                  </div>

                  {sales.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-14 h-14 mx-auto bg-sky-50 rounded-full flex items-center justify-center text-sky-500 mb-3">
                        <FiShoppingBag size={24} />
                      </div>
                      <p className="text-gray-600 font-medium">No sales yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Your successful sales will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sales.map((sale) => (
                        <div
                          key={sale.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                        >
                          <div>
                            <p className="font-medium text-sm">{sale.title}</p>
                            <p className="text-xs text-gray-500">
                              Sold to {sale.buyer}
                            </p>
                          </div>
                          <p className="font-semibold text-sky-600">
                            ₦{sale.price.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ================= SELL ARTWORK TAB ================= */}
          {activeTab === "sell" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiPlus className="text-sky-600" /> Sell Your Artwork
              </h2>

              <form onSubmit={handleAddArtwork}>
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artwork Image
                    </label>
                    <label className="relative block w-full aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-sky-500 bg-gray-50 hover:bg-sky-50 cursor-pointer overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                          <FiUpload size={36} className="mb-2" />
                          <p className="text-sm font-medium">Click to upload</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </label>
                    <p className="text-xs text-gray-400 mt-2">
                      Buyers only see a watermarked preview. Your full-quality
                      file stays private until they pay.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Artwork Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Sunset Over Lagos"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Price (₦)
                      </label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 25000"
                        min="100"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell buyers about your artwork..."
                        rows={4}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl"
                    >
                      <FiPlus size={18} />
                      {submitting ? "Uploading..." : "Post Artwork"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ================= MY ARTWORKS TAB ================= */}
          {activeTab === "artworks" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FiPackage className="text-sky-600" />
                  {searchQuery
                    ? `Search results (${filteredArtworks.length})`
                    : `My Artworks (${artworks.length})`}
                </h2>
                <button
                  onClick={() => setActiveTab("sell")}
                  className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl"
                >
                  <FiPlus size={16} /> Add New
                </button>
              </div>

              {loading ? (
                <p className="text-center text-gray-400 py-16">Loading...</p>
              ) : filteredArtworks.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto bg-sky-50 rounded-full flex items-center justify-center text-sky-500 mb-4">
                    <FiImage size={28} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">
                    {searchQuery ? "No artworks found" : "No artworks yet"}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {searchQuery
                      ? `No results for "${searchQuery}"`
                      : "Start by uploading your first artwork."}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => setActiveTab("sell")}
                      className="mt-5 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-medium px-5 py-2.5 rounded-xl"
                    >
                      <FiPlus size={18} /> Sell Artwork
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredArtworks.map((art) => (
                    <ArtCard key={art.id} art={art} badge={art.status}>
                      <button
                        onClick={() => handleDelete(art.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 text-xs font-semibold py-2 rounded-lg"
                      >
                        <FiTrash2 size={13} /> Delete
                      </button>
                    </ArtCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= PROFILE TAB ================= */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Cover Banner */}
                <div className="h-36 bg-gradient-to-r from-sky-500 to-sky-400"></div>

                <div className="px-6 pb-6 relative">
                  {/* Avatar */}
                  <div className="absolute -top-12 left-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl border-4 border-white bg-sky-100 overflow-hidden shadow-md">
                        {profilePic ? (
                          <img
                            src={profilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-sky-600">
                            {firstName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-sky-600 hover:bg-sky-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow">
                        <FiCamera size={14} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePicChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Name + Button */}
                  <div className="pt-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {profileData.fullName}
                      </h2>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {profileData.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full">
                          <FiCheckCircle size={12} /> Verified Artist
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        isEditingProfile
                          ? handleSaveProfile()
                          : setIsEditingProfile(true)
                      }
                      className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl self-start sm:self-auto"
                    >
                      {isEditingProfile ? (
                        <>
                          <FiSave size={16} /> Save Changes
                        </>
                      ) : (
                        <>
                          <FiEdit2 size={16} /> Edit Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-5">
                  Personal Information
                </h3>

                {isEditingProfile ? (
                  <div className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={profileData.country}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            country: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-50">
                      <span className="text-gray-500 text-sm">Full Name</span>
                      <span className="font-medium">{profileData.fullName}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-50">
                      <span className="text-gray-500 text-sm">Email</span>
                      <span className="font-medium">{profileData.email}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-50">
                      <span className="text-gray-500 text-sm">Country</span>
                      <span className="font-medium">{profileData.country}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-gray-500 text-sm">Role</span>
                      <span className="font-medium text-sky-600">
                        Artist / Seller
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= LOGOUT CONFIRMATION MODAL ================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center mb-4">
                <FiLogOut size={26} className="text-sky-600" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Logout Confirmation
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to logout from ArtVault?
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutModal(false);
                    onLogout();
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium transition"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}