import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Heart,
  MapPin,
  Sparkles,
} from "lucide-react";
import { guests } from "../data/guests";
import { eventMeta } from "../data/timeline";
import Confetti from "./Confetti";
import Countdown from "./Countdown";
import VenueModal from "./VenueModal";

const STORAGE_KEY = "marry-me-guest-id";

const GROUP_CLASS: Record<string, string> = {
  贴身组: "guest-chip--pin",
  帮手组: "guest-chip--helper",
  行动组: "guest-chip--action",
  演员组: "guest-chip--actor",
  气氛组: "guest-chip--atmosphere",
};

export default function HomePage() {
  const navigate = useNavigate();
  const [bursting, setBursting] = useState(false);
  const [venueOpen, setVenueOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && guests.some((guest) => guest.id === saved)) {
      navigate(`/guest/${saved}`, { replace: true });
    }
  }, [navigate]);

  const choose = (id: string) => {
    window.localStorage.setItem(STORAGE_KEY, id);
    setBursting(true);
    window.setTimeout(() => navigate(`/guest/${id}`), 850);
  };

  return (
    <div className="home-page">
      {bursting && <Confetti />}
      <section className="hero">
        <span className="hero-eyebrow">
          <CalendarDays size={15} /> {eventMeta.date}
        </span>
        <h1 className="hero-title">
          <span className="title-groom">班主任小王吧</span>
          <Heart className="title-heart" size={26} fill="currentColor" />
          <span className="title-bride">瑶瑶</span>
        </h1>
        <p className="hero-sub">8 月 15 日，一场烧烤约会的秘密惊喜</p>
        <div className="hero-meta">
          <button
            type="button"
            className="meta-pill meta-pill--venue"
            onClick={() => setVenueOpen(true)}
          >
            <MapPin size={15} /> {eventMeta.venue}
            <ChevronDown size={14} />
          </button>
          <span className="meta-pill">
            <Sparkles size={15} /> 求婚时刻 17:30
          </span>
        </div>
        <button
          type="button"
          className="venue-entry"
          onClick={() => setVenueOpen(true)}
        >
          <MapPin size={15} /> 查看地点详情
          <ChevronRight size={14} />
        </button>
        <Countdown />
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">今天你是哪一位？</h2>
          <span className="section-sticker">14 人任务书</span>
        </div>
        <div className="guest-grid">
          {guests.map((guest, index) => (
            <button
              key={guest.id}
              type="button"
              className={`guest-chip ${GROUP_CLASS[guest.group] ?? ""} ${index % 2 === 0 ? "tilt-left" : "tilt-right"}`}
              onClick={() => choose(guest.id)}
            >
              {guest.name}
              <small>{guest.role}</small>
            </button>
          ))}
        </div>
              </section>
      <VenueModal open={venueOpen} onClose={() => setVenueOpen(false)} />
    </div>
  );
}


