import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plane,
  Map,
  DollarSign,
  Package,
  Bell,
  Users,
  Star,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const HEROES = [
  {
    img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1800&q=85",
    caption: "Santorini, Greece",
  },
  {
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1800&q=85",
    caption: "Kyoto, Japan",
  },
  {
    img: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1800&q=85",
    caption: "Bali, Indonesia",
  },
  {
    img: "https://images.unsplash.com/photo-1499856374079-41b8e1b08e6d?w=1800&q=85",
    caption: "Paris, France",
  },
];
const FEATURES = [
  {
    icon: Plane,
    title: "Itinerary Builder",
    desc: "Plan every day with activities, hotels & flights on an intuitive timeline.",
  },
  {
    icon: Map,
    title: "Interactive Maps",
    desc: "Pin all your destinations and visualize your entire journey at a glance.",
  },
  {
    icon: DollarSign,
    title: "Expense Tracker",
    desc: "Track spending by category, monitor your budget in real time.",
  },
  {
    icon: Package,
    title: "Smart Packing Lists",
    desc: "AI-powered packing suggestions tailored to your destination.",
  },
  {
    icon: Bell,
    title: "Travel Reminders",
    desc: "Never miss a flight or check-in with smart travel alerts.",
  },
  {
    icon: Users,
    title: "Trip Sharing",
    desc: "Invite friends and family to collaborate on the same itinerary.",
  },
  {
    icon: Star,
    title: "Reviews & Memories",
    desc: "Rate places you visit and preserve your travel memories.",
  },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [idx, setIdx] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setIdx((i) => (i + 1) % HEROES.length), 6000);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearInterval(iv);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="bg-surface-50">
      {/* ── Hero ── */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center">
        {HEROES.map(({ img }, i) => (
          <div
            key={img}
            className="absolute inset-0 transition-opacity duration-1500"
            style={{ opacity: i === idx ? 1 : 0, transitionDuration: "1500ms" }}
          >
            <img
              src={img}
              alt="hero"
              className="w-full h-full object-cover"
              style={{
                transform: `translateY(${scrollY * 0.4}px) scale(1.12)`,
              }}
            />
            <div className="absolute inset-0 bg-linear-to-b from-dark-900/55 via-dark-900/25 to-dark-950/90" />
          </div>
        ))}

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 text-xs text-white/80 mb-8 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {HEROES[idx].caption}
          </div>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.9] mb-6">
            Travel
            <br />
            <span className="italic text-primary-300">Beautifully.</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Plan every detail of your journey — from itineraries to budgets — in
            one elegant space.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 text-base shadow-warm-lg hover:shadow-warm-lg hover:-translate-y-0.5"
            >
              Start Planning <ArrowRight size={18} />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 text-base"
              >
                Log in
              </Link>
            )}
          </div>

          <div className="flex gap-10 justify-center mt-14">
            {[
              ["50K+", "Trips Planned"],
              ["180+", "Countries"],
              ["4.9★", "Rating"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-bold text-white">
                  {v}
                </div>
                <div className="text-xs text-white/50 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HEROES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === idx ? "bg-primary-400 w-8" : "bg-white/30 w-2"}`}
            />
          ))}
        </div>
        <div className="absolute bottom-8 right-8 z-10 animate-bounce">
          <ChevronDown className="text-white/50" size={22} />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary-500 text-xs font-bold tracking-[0.15em] uppercase mb-3">
              Everything You Need
            </p>
            <h2 className="font-display text-5xl md:text-6xl bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-bold text-dark-900 mb-4">
              Travel smarter,
              <br />
              <span className="text-gradient italic">not harder.</span>
            </h2>
            <p className="text-surface-500 text-base max-w-xl mx-auto leading-relaxed">
              Every feature crafted to make your journey seamless — from the
              first flight search to the last memory.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="card p-6 group bg-linear-to-br from-indigo-200 to-purple-300 rounded-3xl hover:shadow-warm-lg hover:-translate-y-1.5 transition-all duration-300"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                  <Icon size={20} className="text-primary-500" />
                </div>
                <h3 className="font-display text-lg font-bold text-dark-900 mb-2">
                  {title}
                </h3>
                <p className="text-surface-500 text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Destinations ── */}
      <section className="py-8 pb-28 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="font-display text-3xl font-bold bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent text-dark-900 mb-8 text-center">
            Popular{" "}
            <span className="italic text-primary-500">Destinations</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
                name: "Tokyo",
                sub: "Japan",
              },
              {
                img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
                name: "Santorini",
                sub: "Greece",
              },
              {
                img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
                name: "Bali",
                sub: "Indonesia",
              },
              {
                img: "https://plus.unsplash.com/premium_photo-1717422934983-53747ad6d1aa?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                name: "Paris",
                sub: "France",
              },
            ].map((d) => (
              <div
                key={d.name}
                className="relative overflow-hidden rounded-2xl aspect-3/4 group cursor-pointer shadow-warm-md hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={d.img}
                  alt={d.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-dark-900/70 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="font-display text-xl font-bold text-white">
                    {d.name}
                  </p>
                  <p className="text-white/60 text-xs">{d.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-white border-t border-surface-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-6xl font-bold bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent text-dark-900 mb-4">
            Your next adventure
            <br />
            <span className="italic text-gradient">awaits.</span>
          </h2>
          <p className="text-surface-500 mb-8 text-base leading-relaxed">
            Join thousands of travelers who plan beautifully with Wanderlust.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="inline-flex items-center gap-2 btn-primary bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl hover:-translate-y-1.5 text-white text-base px-8 py-4"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}{" "}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-surface-200 py-8 px-6 text-center bg-surface-50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-xl bg-linear-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
            <Plane size={14} className="text-white" />
          </div>
          <span className="font-display text-center bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-bold text-dark-900">
            Wanderlust
          </span>
        </div>
        <p className="text-surface-400 text-xs">
          Travel Itinerary Planner © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
