import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Heart, Info, Lock, Mail, X } from "lucide-react";
import Confetti from "./Confetti";
import "./yaoyao-letter.css";

const PASS_DIGITS = "120197";

export default function YaoyaoLetter() {
  const [unlocked, setUnlocked] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [code, setCode] = useState<string[]>(
    Array.from({ length: PASS_DIGITS.length }, () => ""),
  );
  const [error, setError] = useState("");
  const [celebrating, setCelebrating] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!passwordOpen && !letterOpen && !hintOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (hintOpen) setHintOpen(false);
        else if (letterOpen) setLetterOpen(false);
        else if (passwordOpen) setPasswordOpen(false);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    const focusTimer = passwordOpen
      ? window.setTimeout(() => inputRefs.current[0]?.focus(), 120)
      : undefined;
    return () => {
      if (focusTimer) window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [passwordOpen, letterOpen, hintOpen]);

  const openCard = () => {
    if (unlocked) {
      setLetterOpen(true);
      return;
    }
    setCode(Array.from({ length: PASS_DIGITS.length }, () => ""));
    setError("");
    setPasswordOpen(true);
  };

  const handleDigitChange = (index: number, value: string) => {
    const digits = value
      .replace(/\D/g, "")
      .split("")
      .slice(0, PASS_DIGITS.length - index);
    if (digits.length === 0) {
      if (error) setError("");
      return;
    }
    setCode((prev) => {
      const next = [...prev];
      digits.forEach((digit, offset) => {
        next[index + offset] = digit;
      });
      return next;
    });
    if (error) setError("");
    inputRefs.current[
      Math.min(index + digits.length, PASS_DIGITS.length - 1)
    ]?.focus();
  };

  const handleDigitKeyDown = (
    index: number,
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (code[index]) {
        setCode((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        setCode((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
      return;
    }

    if (event.key === "ArrowRight" && index < PASS_DIGITS.length - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
      return;
    }

    if (event.key === "Enter" && code.every((digit) => digit !== "")) {
      event.preventDefault();
      submit();
    }
  };

  const submit = () => {
    if (code.some((digit) => digit === "")) return;
    if (code.join("") === PASS_DIGITS) {
      setUnlocked(true);
      setPasswordOpen(false);
      setCelebrating(true);
      window.setTimeout(() => {
        setCelebrating(false);
        setLetterOpen(true);
      }, 650);
    } else {
      setError("暗号不对，再试一次");
      setCode(Array.from({ length: PASS_DIGITS.length }, () => ""));
      window.setTimeout(() => inputRefs.current[0]?.focus(), 60);
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
                <button
                  type="button"
                  className="letter-hint-btn"
                  onClick={() => setHintOpen(true)}
                  aria-label="查看密码提示"
                >
                  <Info size={15} /> 提示
                </button>
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
                输入六位密码，就能拆开这封信
              </p>
              <div className={`pass-field ${error ? "is-error" : ""}`}>
                <div className="pass-digits" role="group" aria-label="暗号六位">
                  {PASS_DIGITS.split("").map((_, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[index] = element;
                      }}
                      className="pass-input"
                      value={code[index] ?? ""}
                      onChange={(event) =>
                        handleDigitChange(index, event.target.value)
                      }
                      onKeyDown={(event) => handleDigitKeyDown(index, event)}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      autoComplete="one-time-code"
                      aria-label={`暗号第 ${index + 1} 位`}
                    />
                  ))}
                </div>
              </div>
              <p className="letter-error" role="alert">
                {error}
              </p>
              <button
                type="button"
                className="pass-submit"
                onClick={submit}
                disabled={code.some((digit) => digit === "")}
              >
                <Heart size={16} fill="currentColor" /> 拆开这封信
              </button>
            </div>
          </div>
        </div>
      )}

      {hintOpen && (
        <div className="letter-overlay" onClick={() => setHintOpen(false)}>
          <div
            className="letter-sheet letter-sheet--hint"
            role="dialog"
            aria-modal="true"
            aria-label="密码提示"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="letter-sheet-grip" aria-hidden="true" />
            <header className="letter-head">
              <span className="letter-eyebrow">
                <Info size={15} /> 密码提示
              </span>
              <button
                type="button"
                className="letter-close"
                onClick={() => setHintOpen(false)}
                aria-label="关闭密码提示"
              >
                <X size={19} />
              </button>
            </header>
            <div className="letter-password letter-hint">
              <p className="letter-password-title">拆信提示</p>
              <p className="letter-password-sub">
                密码是我的手机锁屏密码，输入六位数字就能拆开这封信
              </p>
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
