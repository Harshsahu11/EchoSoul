import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const RelatedServices = ({ currentServiceId, category }) => {
  const navigate = useNavigate();
  const { Person } = useContext(AppContext);

  const relatedServices = useMemo(() => {
    if (!category) {
      return [];
    }

    return Person.filter(
      (item) => item.category === category && item._id !== currentServiceId
    );
  }, [Person, category, currentServiceId]);

  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  if (relatedServices.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-300/80">
            More In {category}
          </p>
          <h3 className="mt-2 text-2xl font-semibold">
            Similar Services You Can Book
          </h3>
        </div>

        <button
          type="button"
          onClick={() => navigate("/services")}
          className="rounded-md border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-blue-400 hover:text-white"
        >
          View All Services
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {relatedServices.map((item) => (
          <button
            type="button"
            key={item._id}
            onClick={() => navigate(`/appointment/${item._id}`)}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition-all duration-300 hover:-translate-y-2 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div className="overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="space-y-3 p-5">
              <div>
                <p className="text-sm text-blue-300">{item.category}</p>
                <h4 className="mt-1 text-xl font-semibold group-hover:text-blue-300">
                  {item.title}
                </h4>
              </div>

              <p className="line-clamp-2 text-sm text-gray-400">
                {item.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{item.duration}</span>
                <span className="font-medium text-blue-400">
                  {formatINR(item.price)}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default RelatedServices;
