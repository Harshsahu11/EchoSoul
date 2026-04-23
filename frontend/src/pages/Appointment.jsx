import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import RelatedServices from "../components/RelatedServices";

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

const APPOINTMENTS_STORAGE_KEY = "confirmedAppointments";
const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  notes: "",
};

const formatDateKey = (value) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getSlotDateTime = (dateKey, slot) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  const [timeValue, meridiem] = slot.split(" ");
  const [rawHours, minutes] = timeValue.split(":").map(Number);

  let hours = rawHours % 12;
  if (meridiem === "PM") {
    hours += 12;
  }

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
};

const readConfirmedAppointments = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawAppointments = window.localStorage.getItem(
      APPOINTMENTS_STORAGE_KEY,
    );

    if (!rawAppointments) {
      return [];
    }

    const parsedAppointments = JSON.parse(rawAppointments);

    return Array.isArray(parsedAppointments) ? parsedAppointments : [];
  } catch {
    return [];
  }
};

const Appointment = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { Person } = useContext(AppContext);

  const service = Person.find((item) => item._id === serviceId);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [confirmedAppointments, setConfirmedAppointments] = useState(() =>
    readConfirmedAppointments(),
  );

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    const syncAppointments = () => {
      setConfirmedAppointments(readConfirmedAppointments());
    };

    window.addEventListener("storage", syncAppointments);

    return () => window.removeEventListener("storage", syncAppointments);
  }, []);

  useEffect(() => {
    setDate("");
    setTime("");
    setForm(INITIAL_FORM);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [serviceId]);

  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const dates = useMemo(() => {
    const nextSevenDays = [];
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    for (let index = 0; index < 7; index += 1) {
      const day = new Date(today);
      day.setDate(today.getDate() + index);
      nextSevenDays.push(day);
    }

    return nextSevenDays;
  }, [now]);

  const bookedSlotsByDate = useMemo(() => {
    const slotsByDate = new Map();

    confirmedAppointments
      .filter(
        (appointment) =>
          appointment?.status === "confirmed" &&
          appointment?.serviceId === serviceId,
      )
      .forEach((appointment) => {
        const existingSlots = slotsByDate.get(appointment.date) ?? new Set();
        existingSlots.add(appointment.time);
        slotsByDate.set(appointment.date, existingSlots);
      });

    return slotsByDate;
  }, [confirmedAppointments, serviceId]);

  const futureTimeSlots = useMemo(() => {
    if (!date) {
      return [];
    }

    return TIME_SLOTS.filter((slot) => getSlotDateTime(date, slot) > now);
  }, [date, now]);

  const bookedSlotsForSelectedDate = useMemo(
    () => bookedSlotsByDate.get(date) ?? new Set(),
    [bookedSlotsByDate, date],
  );

  useEffect(() => {
    if (!date) {
      if (time) {
        setTime("");
      }
      return;
    }

    const dateStillVisible = dates.some((day) => formatDateKey(day) === date);

    if (!dateStillVisible) {
      setDate("");
      setTime("");
      return;
    }

    const timeStillAvailable =
      futureTimeSlots.includes(time) && !bookedSlotsForSelectedDate.has(time);

    if (time && !timeStillAvailable) {
      setTime("");
    }
  }, [bookedSlotsForSelectedDate, date, dates, futureTimeSlots, time]);

  if (!service) {
    return <p className="p-10 text-white">Service not found</p>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date || !time) {
      alert("Please select date & time");
      return;
    }

    if (getSlotDateTime(date, time) <= now) {
      alert("Please select a future time slot");
      return;
    }

    if (bookedSlotsForSelectedDate.has(time)) {
      alert("This slot is already booked. Please choose another time.");
      return;
    }

    setLoading(true);

    console.log({
      service,
      serviceId,
      date,
      time,
      bookedAt: now.toISOString(),
      ...form,
    });

    setTimeout(() => {
      const latestAppointments = readConfirmedAppointments();
      const slotAlreadyBooked = latestAppointments.some(
        (appointment) =>
          appointment?.status === "confirmed" &&
          appointment?.serviceId === serviceId &&
          appointment?.date === date &&
          appointment?.time === time,
      );

      if (slotAlreadyBooked) {
        setConfirmedAppointments(latestAppointments);
        setLoading(false);
        setTime("");
        alert("This slot has just been booked. Please select another time.");
        return;
      }

      const confirmedAt = new Date().toISOString();
      const newAppointment = {
        id: `${serviceId}-${date}-${time}-${Date.now()}`,
        serviceId,
        serviceTitle: service.title,
        date,
        time,
        status: "confirmed",
        confirmedAt,
        ...form,
      };
      const updatedAppointments = [...latestAppointments, newAppointment];

      window.localStorage.setItem(
        APPOINTMENTS_STORAGE_KEY,
        JSON.stringify(updatedAppointments),
      );
      setConfirmedAppointments(updatedAppointments);
      setLoading(false);
      alert("Appointment booked successfully");
      navigate("/services");
    }, 1000);
  };

  return (
    <div className="px-6 pt-28 pb-12 text-white md:px-16">
      <button
        onClick={() => navigate("/services")}
        className="mb-6 text-blue-400"
      >
        Back
      </button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <img
            src={service.image}
            alt={service.title}
            className="h-[300px] w-full rounded-xl object-cover"
          />

          <h1 className="mt-4 text-3xl font-semibold">{service.title}</h1>
          <p className="text-gray-400">{service.category}</p>
          <p className="mt-3 text-gray-300">{service.description}</p>

          <div className="mt-4 flex gap-6 text-sm">
            <span className="text-gray-400">{service.duration}</span>
            <span className="font-medium text-blue-400">
              {formatINR(service.price)}
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
        >
          <h2 className="text-xl font-semibold">Book Appointment</h2>

          <input
            type="text"
            placeholder="Your Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-md border border-white/10 bg-transparent px-4 py-2"
          />

          <input
            type="email"
            placeholder="Your Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-md border border-white/10 bg-transparent px-4 py-2"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-md border border-white/10 bg-transparent px-4 py-2"
          />

          <div>
            <p className="mb-2 text-sm text-gray-400">Select Date</p>

            <div className="flex gap-2 overflow-x-auto">
              {dates.map((day, idx) => {
                const value = formatDateKey(day);
                const bookedSlots = bookedSlotsByDate.get(value) ?? new Set();
                const hasOpenSlots = TIME_SLOTS.some(
                  (slot) =>
                    getSlotDateTime(value, slot) > now &&
                    !bookedSlots.has(slot),
                );

                return (
                  <button
                    type="button"
                    key={idx}
                    disabled={!hasOpenSlots}
                    onClick={() => setDate(date === value ? "" : value)}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      date === value
                        ? "border-blue-600 bg-blue-600"
                        : "border-white/10 text-gray-400"
                    } ${!hasOpenSlots ? "cursor-not-allowed opacity-40" : ""}`}
                  >
                    {day.toDateString().slice(0, 10)}
                  </button>
                );
              })}
            </div>

            {!date && (
              <p className="mt-1 text-xs text-gray-500">No date selected</p>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-400">Select Time</p>

            <div className="flex flex-wrap gap-2">
              {futureTimeSlots.map((slot, idx) => {
                const isBooked = bookedSlotsForSelectedDate.has(slot);

                return (
                  <button
                    type="button"
                    key={idx}
                    disabled={isBooked}
                    onClick={() => setTime(time === slot ? "" : slot)}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      isBooked
                        ? "cursor-not-allowed border-red-400/30 bg-red-500/10 text-red-200 opacity-60"
                        : time === slot
                          ? "border-blue-600 bg-blue-600"
                          : "border-white/10 text-gray-400"
                    }`}
                  >
                    {isBooked ? `${slot} - Booked` : slot}
                  </button>
                );
              })}
            </div>

            {!date && (
              <p className="mt-1 text-xs text-gray-500">
                Select a date to see live available time slots
              </p>
            )}

            {date && futureTimeSlots.length === 0 && (
              <p className="mt-1 text-xs text-gray-500">
                No future slots available for this date
              </p>
            )}

            {date &&
              futureTimeSlots.length > 0 &&
              futureTimeSlots.every((slot) =>
                bookedSlotsForSelectedDate.has(slot),
              ) && (
                <p className="mt-1 text-xs text-red-300">
                  All future slots for this date are already booked
                </p>
              )}

            {!time && (
              <p className="mt-1 text-xs text-gray-500">No time selected</p>
            )}
          </div>

          <textarea
            placeholder="Additional Notes"
            rows="3"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full rounded-md border border-white/10 bg-transparent px-4 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-3 transition hover:bg-blue-700"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>

      <RelatedServices
        currentServiceId={serviceId}
        category={service.category}
      />
    </div>
  );
};

export default Appointment;
