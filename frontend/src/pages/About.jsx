import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const About = () => {
  const navigate = useNavigate();
  const { Person } = useContext(AppContext);

  const categories = useMemo(
    () => [...new Set(Person.map((item) => item.category))],
    [Person],
  );

  const highlights = [
    {
      label: "Guided Sessions",
      value: `${Person.length}+`,
      detail: "Personalized support plans for everyday emotional challenges.",
    },
    {
      label: "Focus Areas",
      value: `${categories.length}`,
      detail: "Mental health, relationships, career growth, and well-being.",
    },
    {
      label: "Average Session",
      value: "30 mins",
      detail:
        "Thoughtful one-to-one time designed for calm, practical progress.",
    },
  ];

  const pillars = [
    {
      title: "Compassion First",
      description:
        "Every conversation begins with empathy, safety, and space to speak honestly.",
    },
    {
      title: "Practical Guidance",
      description:
        "Sessions focus on clear next steps you can actually use in daily life.",
    },
    {
      title: "Steady Growth",
      description:
        "The goal is not quick fixes, but consistent inner clarity and emotional resilience.",
    },
  ];

  const reasonsToChoose = [
    {
      title: "Human And Personal",
      description:
        "EchoSoul keeps support warm and personal, so every session feels like genuine guidance instead of a generic consultation.",
    },
    {
      title: "Focused On Everyday Struggles",
      description:
        "From overthinking and relationship stress to career confusion, the sessions are built around real-life concerns people face every day.",
    },
    {
      title: "Clarity With Action",
      description:
        "The goal is not only to listen, but to help you leave each session with better understanding and practical next steps.",
    },
    {
      title: "Safe And Non-Judgmental Space",
      description:
        "EchoSoul is designed to feel calm, respectful, and emotionally safe for anyone who needs support without pressure.",
    },
  ];

  return (
    <div className="px-6 pt-24 pb-14 text-white md:px-16 md:pt-28">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.16),_transparent_35%)]" />

        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-blue-300">
              About EchoSoul
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
              A calm, supportive space where{" "}
              <span className="text-blue-400">Echo Soul</span> helps people move
              through emotional overwhelm with clarity.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              EchoSoul was created to make emotional guidance feel warm,
              approachable, and deeply human. From relationship struggles and
              overthinking to career confusion and life transitions, the focus
              is on helping people feel heard and gently guided toward a
              healthier next step.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/services")}
                className="rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
              >
                Explore Services
              </button>

              <button
                type="button"
                onClick={() => navigate("/contact")}
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-blue-400 hover:text-white"
              >
                Contact EchoSoul
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-blue-500/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-3">
              <img
                src={assets.about_image}
                alt="EchoSoul"
                className="h-[520px] w-full rounded-[1.4rem] object-cover object-top"
              />

              <div className="absolute right-8 bottom-8 left-8 rounded-2xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.25em] text-blue-300">
                  Founder And Guide
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Priya Ranga</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Dedicated to emotional well-being, personal growth, and
                  meaningful one-to-one support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              {item.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-blue-400">
              {item.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {item.detail}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-7">
          <p className="text-sm uppercase tracking-[0.28em] text-blue-300">
            Our Story
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Why EchoSoul Exists</h2>
          <p className="mt-5 text-sm leading-7 text-slate-300">
            Many people know they are struggling, but do not know where to begin
            or how to ask for help without feeling judged. EchoSoul exists to
            make that first step lighter. The intention is simple: listen
            deeply, understand the real issue behind the surface stress, and
            offer a practical path forward.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Whether someone is carrying sadness, conflict, fear, or confusion,
            each session is designed to bring calm structure to what feels heavy
            inside. The work is rooted in trust, reflection, and sustainable
            progress.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
          <p className="text-sm uppercase tracking-[0.28em] text-blue-300">
            What We Stand For
          </p>
          <div className="mt-5 space-y-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-white/10 bg-slate-950/45 p-5"
              >
                <h3 className="text-xl font-medium">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-7 lg:col-span-2">
          <p className="text-sm uppercase tracking-[0.28em] text-blue-300">
            Why Choose EchoSoul
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            What Makes EchoSoul Different
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            EchoSoul is built for people who want guidance that feels
            thoughtful, approachable, and relevant to real life. The experience
            is centered on trust, clarity, and consistent emotional support
            rather than rushed advice.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
            {reasonsToChoose.map((reason) => (
              <div
                key={reason.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <h3 className="text-xl font-medium text-white">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
          <p className="text-sm uppercase tracking-[0.28em] text-blue-300">
            Support Areas
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Areas EchoSoul Commonly Helps With
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {Person.map((item) => (
              <span
                key={item._id}
                className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-200"
              >
                {item.title}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-7">
          <p className="text-sm uppercase tracking-[0.28em] text-blue-300">
            Connect
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Ready To Begin A Conversation?
          </h2>

          <div className="mt-6 space-y-5 text-sm text-slate-300">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Email
              </p>
              <p className="mt-1 text-base text-white">
                echosoul.connect@gmail.com
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Phone
              </p>
              <p className="mt-1 text-base text-white">+91 XXXXX XXXXX</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Location
              </p>
              <p className="mt-1 text-base text-white">India</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/services")}
            className="mt-8 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Book A Session
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
