import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

const APPOINTMENTS_STORAGE_KEY = "confirmedAppointments";

const MyAppointments = () => {
  const { user, Person } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  const cancelAppointment = (id) => {
    const stored = window.localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    const allAppointments = stored ? JSON.parse(stored) : [];
    const updated = allAppointments.filter((item) => item.id !== id);
    window.localStorage.setItem(
      APPOINTMENTS_STORAGE_KEY,
      JSON.stringify(updated),
    );
    setAppointments((current) => current.filter((item) => item.id !== id));
  };

  const handlePayment = (appointment) => {
    alert(
      `Proceed to payment for ${appointment.serviceTitle || appointment.serviceName}`,
    );
  };

  useEffect(() => {
    const stored = window.localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    const allAppointments = stored ? JSON.parse(stored) : [];
    const currentUserEmail =
      user?.email ||
      (typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("echosoulCurrentUser") || "null")
            ?.email
        : null);

    const filtered = currentUserEmail
      ? allAppointments.filter((item) => item.userEmail === currentUserEmail)
      : [];

    setAppointments(filtered);
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-white py-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-4xl border border-white/10 bg-slate-900/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.65)] backdrop-blur-xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">
                My Appointments
              </p>
              <h1 className="text-4xl font-semibold text-white">
                Your Booked Sessions
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                All appointments booked using your account are listed here.
              </p>
            </div>
          </div>

          {appointments.length ? (
            <div className="space-y-6">
              {appointments.map((item) => {
                const service = Person.find(
                  (serviceItem) => serviceItem._id === item.serviceId,
                );
                const imageSrc = item.serviceImage || service?.image;
                const title =
                  item.serviceTitle ||
                  item.serviceName ||
                  service?.title ||
                  "Appointment";
                const subtitle =
                  item.coachName ||
                  item.category ||
                  service?.category ||
                  "Service booking";

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20 lg:flex-row lg:items-center"
                  >
                    <div className="min-h-50 w-full overflow-hidden rounded-3xl bg-slate-900/80 lg:w-80 lg:min-h-0">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-slate-900/80 text-slate-400">
                          No image available
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-semibold text-white">
                            {title}
                          </h2>
                          <p className="mt-2 text-sm text-slate-400">
                            {subtitle}
                          </p>
                        </div>
                        <span className="rounded-full bg-sky-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                          {item.status || "Confirmed"}
                        </span>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl bg-slate-900/80 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Date
                          </p>
                          <p className="mt-2 text-base font-medium text-white">
                            {item.date}
                          </p>
                        </div>
                        <div className="rounded-3xl bg-slate-900/80 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Time
                          </p>
                          <p className="mt-2 text-base font-medium text-white">
                            {item.time}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3 text-sm text-slate-300">
                        <div>
                          <span className="font-medium text-slate-100">
                            Booked By:
                          </span>{" "}
                          {item.userName}
                        </div>
                        <div>
                          <span className="font-medium text-slate-100">
                            Email:
                          </span>{" "}
                          {item.userEmail}
                        </div>
                        {item.notes && (
                          <div>
                            <span className="font-medium text-slate-100">
                              Notes:
                            </span>{" "}
                            {item.notes}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => cancelAppointment(item.id)}
                          className="rounded-full border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-300 transition hover:border-red-400 hover:bg-red-500/20"
                        >
                          Cancel Appointment
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePayment(item)}
                          className="rounded-full border border-sky-500/30 bg-sky-500/10 px-5 py-3 text-sm font-medium text-sky-300 transition hover:border-sky-400 hover:bg-sky-500/20"
                        >
                          Make Payment
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 text-center">
              <p className="text-lg font-medium text-white">
                No appointments booked yet.
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Go to services and book a session to see it in your appointments
                list.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
