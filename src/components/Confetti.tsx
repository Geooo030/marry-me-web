import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#DB2777", "#A16207", "#0F766E", "#7C3AED", "#F59E0B"];

export default function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        left: Math.random() * 96,
        delay: Math.random() * 0.25,
        rotate: Math.random() * 360,
        color: COLORS[index % COLORS.length],
        width: 8 + Math.random() * 8,
        height: 5 + Math.random() * 6,
      })),
    [],
  );

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece, index) => (
        <motion.span
          key={index}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
          }}
          initial={{ y: -30, opacity: 0, rotate: 0 }}
          animate={{ y: "112vh", opacity: [0, 1, 1, 0], rotate: piece.rotate }}
          transition={{ duration: 1.15, delay: piece.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
