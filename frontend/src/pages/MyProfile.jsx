import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const MyProfile = () => {
  const { user, updateUser } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    image: assets.profile_pic,
    name: "John Doe",
    email: "",
    phone: "",
    address: "",
    gender: "",
    birthday: "",
  });

  useEffect(() => {
    const storedUser =
      user ||
      (typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("echosoulCurrentUser") || "null")
        : null);

    if (storedUser) {
      setProfile((prev) => ({
        ...prev,
        image: storedUser.image || assets.profile_pic,
        name: storedUser.name || prev.name,
        email: storedUser.email || prev.email,
        phone: storedUser.phone || prev.phone,
        address: storedUser.address || prev.address,
        gender: storedUser.gender || prev.gender,
        birthday: storedUser.birthday || prev.birthday,
      }));
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...profile,
    };

    if (updateUser) {
      updateUser(updatedUser);
    }

    setIsEditing(false);
    alert("Profile information saved!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-4xl border border-white/10 bg-slate-900/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.65)] backdrop-blur-xl">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="relative h-28 w-28 overflow-hidden rounded-3xl border border-white/10 bg-slate-800 shadow-lg">
                  <img
                    src={profile.image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                  {isEditing && (
                    <label className="absolute bottom-1 right-1 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white shadow-lg cursor-pointer transition hover:bg-sky-400">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">
                    Your Profile
                  </p>
                  <h1 className="text-4xl font-semibold text-white">
                    {profile.name}
                  </h1>
                  <p className="mt-2 text-sm text-slate-400">
                    Manage your personal details and account information.
                  </p>
                </div>
              </div>
              <div className="flex justify-start sm:justify-end">
                <button
                  onClick={isEditing ? handleSave : handleEdit}
                  className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  {isEditing ? "Save Information" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20">
              <h2 className="text-lg font-semibold tracking-wide text-white">
                Contact Information
              </h2>
              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      readOnly
                      disabled
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-300 outline-none cursor-not-allowed"
                    />
                  ) : (
                    <p className="mt-2 text-white">{profile.email}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-400">Phone</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    />
                  ) : (
                    <p className="mt-2 text-white">{profile.phone}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-400">Address</p>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      rows="3"
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    />
                  ) : (
                    <p className="mt-2 text-white">
                      {profile.address || "Not specified"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20">
              <h2 className="text-lg font-semibold tracking-wide text-white">
                Basic Information
              </h2>
              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-sm text-slate-400">Gender</p>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="mt-2 text-white">
                      {profile.gender || "Not specified"}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-400">Birthday</p>
                  {isEditing ? (
                    <input
                      type="date"
                      name="birthday"
                      value={profile.birthday}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    />
                  ) : (
                    <p className="mt-2 text-white">
                      {profile.birthday || "Not specified"}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-400">Member Since</p>
                  <p className="mt-2 text-white">April 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
