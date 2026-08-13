import { useEffect, useRef, useState } from "react";
import { Heart, Lock, Mail, X } from "lucide-react";
import Confetti from "./Confetti";

const STORAGE_KEY = "yaoyao-letter-unlocked";
const PASS_PREFIX = "520";
const PASS_CODE = "1314";

export default function YaoyaoLetter() {
  const [unlocked, setUnlocked] = useState(
    () => window.localStorage.getItem(STORAGE_KEY) === "1",
  );
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [celebrating, setCelebrating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!passwordOpen && !letterOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (letterOpen) setLetterOpen(false);
        else setPasswordOpen(false);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    const focusTimer = passwordOpen
      ? window.setTimeout(() => inputRef.current?.focus(), 120)
      : undefined;
    return () => {
      if (focusTimer) window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [passwordOpen, letterOpen]);

  const openCard = () => {
    if (unlocked) {
      setLetterOpen(true);
      return;
    }
    setCode("");
    setError("");
    setPasswordOpen(true);
  };

  const handleCodeChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    setCode(digits);
    if (error) setError("");
  };

  const submit = () => {
    if (code.length !== 4) return;
    if (code === PASS_CODE) {
      window.localStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
      setPasswordOpen(false);
      setCelebrating(true);
      window.setTimeout(() => {
        setCelebrating(false);
        setLetterOpen(true);
      }, 650);
    } else {
      setError("暗号不对，再试一次");
      setCode("");
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  };

  return (
    <>
      {celebrating && (
        <div className="letter-confetti" aria-hidden="true">
          <Confetti />
        </div>
      )}

      <section className="letter-spot" aria-label="瑶瑶的一封信">
        <button
          type="button"
          className={`letter-card ${unlocked ? "is-unlocked" : ""}`}
          onClick={openCard}
        >
          <span className="letter-card-stamp">瑶瑶亲启</span>
          <span className="letter-card-title">瑶瑶的一封信</span>
          <span className="letter-card-hint">
            {unlocked ? "已拆封 · 再看一遍" : "一封封口的信，输入暗号才能拆开"}
          </span>
          <span className="letter-card-seal">
            {unlocked ? (
              <Heart size={20} fill="currentColor" />
            ) : (
              <Lock size={20} />
            )}
          </span>
        </button>
      </section>

      {passwordOpen && (
        <div
          className="letter-overlay"
          onClick={() => setPasswordOpen(false)}
        >
          <div
            className="letter-sheet letter-sheet--password"
            role="dialog"
            aria-modal="true"
            aria-label="输入暗号"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="letter-sheet-grip" aria-hidden="true" />
            <header className="letter-head">
              <span className="letter-eyebrow">
                <Mail size={15} /> 拆信暗号
              </span>
              <button
                type="button"
                className="letter-close"
                onClick={() => setPasswordOpen(false)}
                aria-label="关闭暗号输入"
              >
                <X size={19} />
              </button>
            </header>
            <div className="letter-password">
              <p className="letter-password-title">只有你知道的暗号</p>
              <p className="letter-password-sub">
                前面 520 已经替你放好了，输入后四位
              </p>
              <div className={`pass-field ${error ? "is-error" : ""}`}>
                <span className="pass-prefix">{PASS_PREFIX}</span>
                <input
                  ref={inputRef}
                  className="pass-input"
                  value={code}
                  onChange={(event) => handleCodeChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") submit();
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  autoComplete="one-time-code"
                  aria-label="暗号后四位"
                  placeholder="1314"
                />
              </div>
              <p className="letter-error" role="alert">
                {error}
              </p>
              <button
                type="button"
                className="pass-submit"
                onClick={submit}
                disabled={code.length !== 4}
              >
                <Heart size={16} fill="currentColor" /> 拆开这封信
              </button>
            </div>
          </div>
        </div>
      )}

      {letterOpen && (
        <div className="letter-overlay" onClick={() => setLetterOpen(false)}>
          <div
            className="letter-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="瑶瑶的一封信"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="letter-sheet-grip" aria-hidden="true" />
            <header className="letter-head">
              <span className="letter-eyebrow">
                <Mail size={15} /> 瑶瑶的一封信
              </span>
              <button
                type="button"
                className="letter-close"
                onClick={() => setLetterOpen(false)}
                aria-label="收起信件"
              >
                <X size={19} />
              </button>
            </header>
            <div className="letter-paper">
              <h3 className="letter-title">瑶瑶的一封信</h3>
              <p className="letter-greeting">亲爱的瑶瑶：</p>
              <p>
                写这封信的时候，我的手一直在抖。
                <br />
                今晚我不讲厚街话，想讲最认真的真心话。
              </p>
              <p>
                还记得我们第一次见面吗？
                <br />
                在 binke 的婚礼上。我嘴上在祝福新人，眼睛却一直在找你。
                Love at first sight，二十几年了，我真的第一次有这种感觉。
              </p>
              <p>
                后来我们第一次去深圳海边，我一路偷偷藏了狗狗花给你，
                你全程都不知道我要表白。
              </p>
              <p>
                这一次也一样，你只当是一场普通烧烤约会。
                <br />
                但今天在场的朋友，都是我们最要好的朋友，
                他们都在陪我一起“表演”：
                从你出门买食材，到你被带到水印长堤2栋，
                每一个若无其事的人，都在替我紧张。
              </p>
              <p>
                你总说我们像速成班，但真正的 feeling 从来不看时间。
                binke 和莹莹一路看着我们从认识到在一起，
                以后我还想组很多局，让大家继续见证我们的小长跑。
              </p>
              <p>
                从前我是全班的班主任，往后我只想当一个人的家属，你的家属。
                以后不只送你狗狗花，还要陪你一起遛狗，
                一起把普通日子过成喜欢的模样。
              </p>
              <p>
                8月15日，水印长堤2栋，17:30。
                <br />
                朋友们都到了，烟花也许没有，
                但我准备了戒指，也准备了余生。
              </p>
              <p>如果你愿意，请在那时走向我。</p>
              <p className="letter-sign">你的 班主任小王吧</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
