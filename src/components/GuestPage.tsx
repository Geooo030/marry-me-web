import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Backpack,
  CalendarDays,
  Clock3,
  EyeOff,
  Heart,
  Lock,
  MapPin,
  TriangleAlert,
} from "lucide-react";
import { getGuestById } from "../data/guests";
import { eventMeta } from "../data/timeline";
import Countdown from "./Countdown";
import GlobalTimeline from "./GlobalTimeline";

const STORAGE_KEY = "marry-me-guest-id";

export default function GuestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"actions" | "overview">("actions");
  const guest = getGuestById(id);

  useEffect(() => {
    if (guest) {
      window.localStorage.setItem(STORAGE_KEY, guest.id);
    }
  }, [guest]);

  if (!guest) {
    return <Navigate to="/" replace />;
  }

  const changePerson = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    navigate("/");
  };

  return (
    <div className="guest-page">
      <header className="topbar">
        <button type="button" className="icon-btn" onClick={changePerson}>
          <ArrowLeft size={17} /> 换个人
        </button>
        <span className="topbar-date">
          <CalendarDays size={14} /> {eventMeta.date}
        </span>
      </header>

      <section className="identity-card">
        <span className="identity-ribbon">{guest.role}</span>
        <h1 className="identity-name">{guest.name}</h1>
        <p className="tagline">{guest.tagline}</p>
        {guest.secretNote && (
          <div className="secret-note">
            <Lock size={16} /> {guest.secretNote}
          </div>
        )}
      </section>

      <div className="countdown-card">
        <div className="countdown-head">
          <Heart size={16} fill="currentColor" /> 距离 17:30 惊喜时刻
        </div>
        <Countdown />
      </div>

      <div className="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "actions"}
          className={`tab ${tab === "actions" ? "active" : ""}`}
          onClick={() => setTab("actions")}
        >
          我的行动线
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "overview"}
          className={`tab ${tab === "overview" ? "active" : ""}`}
          onClick={() => setTab("overview")}
        >
          全天总览
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === "actions" ? (
          <motion.section
            key="actions"
            className="action-list"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {guest.actions.map((action) => (
              <article key={action.id} className="action-card">
                <span className="action-dot" />
                <span className="action-time">
                  <Clock3 size={13} /> {action.timeLabel}
                </span>
                <h2 className="action-title">{action.title}</h2>
                {action.location && (
                  <div className="action-loc">
                    <MapPin size={14} /> {action.location}
                  </div>
                )}
                <p className="action-detail">{action.detail}</p>
                <div className="action-meta">
                  {action.items && (
                    <span className="meta-tag">
                      <Backpack size={13} /> {action.items.join("、")}
                    </span>
                  )}
                  {action.note && (
                    <span className="meta-tag meta-tag--note">
                      <TriangleAlert size={13} /> {action.note}
                    </span>
                  )}
                  {action.secret && (
                    <span className="meta-tag meta-tag--secret">
                      <EyeOff size={13} /> 保密行动
                    </span>
                  )}
                </div>
              </article>
            ))}
          </motion.section>
        ) : (
          <motion.section
            key="overview"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <GlobalTimeline />
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="app-footer">
        <Heart size={14} fill="currentColor" />
        {eventMeta.couple} · {eventMeta.date}
      </footer>
    </div>
  );
}
