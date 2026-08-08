import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  MapPin,
  Navigation,
  Smartphone,
  X,
} from "lucide-react";
import { VENUE_ADDRESS, VENUE_LANDMARK, VENUE_NAME } from "../data/venue";

interface VenueModalProps {
  open: boolean;
  onClose: () => void;
}

const copyText = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    throw new Error("clipboard unavailable");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  }
};

export default function VenueModal({ open, onClose }: VenueModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleCopy = async () => {
    const ok = await copyText(VENUE_ADDRESS);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  const openAmap = () => {
    const url = `https://uri.amap.com/search?keyword=${encodeURIComponent(
      VENUE_ADDRESS,
    )}&callnative=1`;
    window.location.href = url;
  };

  const openSystemMap = () => {
    const encoded = encodeURIComponent(VENUE_ADDRESS);
    const isIOS = /iP(hone|ad|od)/i.test(navigator.userAgent);
    if (isIOS) {
      window.location.href = `http://maps.apple.com/?q=${encoded}`;
    } else {
      window.location.href = `geo:0,0?q=${encoded}`;
    }
  };

  return (
    <div className="venue-overlay" onClick={onClose}>
      <div
        className="venue-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="地点详情"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="venue-sheet-grip" aria-hidden="true" />

        <header className="venue-head">
          <span className="venue-eyebrow">
            <MapPin size={15} /> 地点详情
          </span>
          <button
            type="button"
            className="venue-close"
            onClick={onClose}
            aria-label="关闭地点详情"
          >
            <X size={19} />
          </button>
        </header>

                <div className="venue-map">
          <img
            className="venue-map-img"
            src="/location-map.jpg"
            alt="水印长堤2栋导航图"
          />
        </div>

        <div className="venue-body">
          <div className="venue-name-row">
            <h3 className="venue-name">{VENUE_NAME}</h3>
            <span className="venue-badge">求婚现场</span>
          </div>
          <p className="venue-sub">8 月 15 日下午，大家在这里集合</p>

          <div className="venue-address">
            <span className="venue-address-icon">
              <MapPin size={18} />
            </span>
            <div className="venue-address-text">
              <p className="venue-address-line">{VENUE_ADDRESS}</p>
              <p className="venue-landmark">{VENUE_LANDMARK}</p>
            </div>
            <button
              type="button"
              className={`venue-copy-btn ${copied ? "is-copied" : ""}`}
              onClick={handleCopy}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "已复制" : "复制"}
            </button>
          </div>

          <div className="venue-actions">
            <button
              type="button"
              className="venue-action venue-action--amap"
              onClick={openAmap}
            >
              <Navigation size={19} />
              <span className="venue-action-text">
                <b>高德地图</b>
                <small>打开 App 导航</small>
              </span>
            </button>
            <button
              type="button"
              className="venue-action venue-action--system"
              onClick={openSystemMap}
            >
              <Smartphone size={19} />
              <span className="venue-action-text">
                <b>系统地图</b>
                <small>搜索这个地址</small>
              </span>
            </button>
          </div>

          <p className="venue-tip">
            💡 小提示：先复制地址，再到地图 App 粘贴搜索，就能直接导航啦
          </p>
        </div>
      </div>
    </div>
  );
}
