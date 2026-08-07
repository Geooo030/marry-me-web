import { useMemo } from "react";
import { Heart } from "lucide-react";

export default function FloatingHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        left: (index * 9.5 + 3) % 94,
        size: 14 + (index % 4) * 7,
        duration: 15 + (index % 5) * 3,
        delay: index * 1.8,
      })),
    [],
  );

  return (
    <div className="hearts" aria-hidden="true">
      {hearts.map((heart, index) => (
        <Heart
          key={index}
          className="heart"
          style={{
            left: `${heart.left}%`,
            bottom: -36,
            width: heart.size,
            height: heart.size,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
          }}
          fill="currentColor"
        />
      ))}
    </div>
  );
}
