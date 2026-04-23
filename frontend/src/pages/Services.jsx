import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Services = () => {
  const navigate = useNavigate();
  const { Person } = useContext(AppContext);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);

  // ✅ INR formatter
  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  // Categories
  const categories = ["All", ...new Set(Person.map((item) => item.category))];

  // Filter logic
  useEffect(() => {
    let temp = Person;

    if (selectedCategory !== "All") {
      temp = temp.filter((item) => item.category === selectedCategory);
    }

    if (searchTerm) {
      temp = temp.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(temp);
  }, [Person, selectedCategory, searchTerm]);

  return (
    <div className="px-4 md:px-16 pt-24 md:pt-28 pb-12 text-white">

      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8">
        Browse Expert Consultation
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">

        {/* 🔹 Sidebar */}
        <div className="md:col-span-1 space-y-4 md:space-y-6 h-fit md:sticky md:top-24">

          {/* Search */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Categories */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
            <h3 className="mb-3 text-sm text-gray-400">Categories</h3>

            <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 whitespace-nowrap text-left px-3 py-2 rounded-md text-sm transition md:w-full
                  ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* 🔹 Services Grid */}
        <div className="md:col-span-3">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

            {filteredServices.length > 0 ? (
              filteredServices.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className="cursor-pointer group rounded-xl overflow-hidden bg-white/5 border border-white/10
                  transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
                  hover:shadow-blue-500/20 hover:border-blue-400"
                >

                  {/* Image */}
                  <div className="overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">

                    <h3 className="text-lg font-medium group-hover:text-blue-400">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-400">
                      {item.category}
                    </p>

                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-gray-400">
                        {item.duration}
                      </span>

                      <span className="text-blue-400 font-medium">
                        {formatINR(item.price)}
                      </span>
                    </div>

                  </div>

                </div>
              ))
            ) : (
              <p className="text-gray-400">No services found</p>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Services;