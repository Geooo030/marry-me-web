import { Car, Hammer, Heart, MapPin, ShoppingCart, Users } from "lucide-react";
import { timeline } from "../data/timeline";
import type { TimelineIcon } from "../types";

const ICONS: Record<TimelineIcon, typeof Car> = {
  cart: ShoppingCart,
  tools: Hammer,
  users: Users,
  car: Car,
  heart: Heart,
};

export default function GlobalTimeline() {
  return (
    <div className="overview-list">
      {timeline.map((node) => {
        const Icon = ICONS[node.icon];
        return (
          <article key={node.id} className="overview-card">
            <span className="overview-icon">
              <Icon size={18} />
            </span>
            <div className="overview-body">
              <span className="overview-time">{node.timeLabel}</span>
              <h3 className="overview-title">{node.title}</h3>
              <div className="overview-loc">
                <MapPin size={13} /> {node.location}
              </div>
              <p className="overview-detail">{node.detail}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
