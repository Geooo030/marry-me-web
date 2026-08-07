import { useCountdown } from "../hooks/useCountdown";

const pad = (value: number) => value.toString().padStart(2, "0");

export default function Countdown() {
  const { days, hours, minutes, seconds, done } = useCountdown();

  if (done) {
    return <div className="countdown-done">惊喜时刻已开始</div>;
  }

  const cells = [
    { value: pad(days), label: "天" },
    { value: pad(hours), label: "时" },
    { value: pad(minutes), label: "分" },
    { value: pad(seconds), label: "秒" },
  ];

  return (
    <div className="countdown" role="timer" aria-label="距离求婚时刻的倒计时">
      {cells.map((cell) => (
        <div key={cell.label} className="countdown-cell">
          <span className="countdown-value">{cell.value}</span>
          <span className="countdown-unit">{cell.label}</span>
        </div>
      ))}
    </div>
  );
}
