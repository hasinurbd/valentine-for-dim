import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; x: number; delay: number; scale: number }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      scale: 0.5 + Math.random() * 1,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: "110vh", x: `${heart.x}vw`, opacity: 0, scale: heart.scale }}
          animate={{
            y: "-10vh",
            opacity: [0, 1, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
          className="absolute text-pink-300/40"
        >
          <Heart fill="currentColor" size={24 * heart.scale} />
        </motion.div>
      ))}
    </div>
  );
}
