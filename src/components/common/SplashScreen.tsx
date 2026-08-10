"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the splash screen has already been shown in this session
    const hasShown = sessionStorage.getItem("sakaar_splash_shown");
    if (!hasShown) {
      setIsVisible(true);
      sessionStorage.setItem("sakaar_splash_shown", "true");
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2500); // Show splash for 2.5 seconds
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF7FA] via-[#FDE2EC] to-[#FFF7FA] overflow-hidden"
        >
          {/* Decorative drifting petals */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 400 - 200, 
                y: -100, 
                rotate: 0,
                opacity: 0.2 + Math.random() * 0.5 
              }}
              animate={{ 
                y: typeof window !== "undefined" ? window.innerHeight + 100 : 1000,
                x: Math.random() * 400 - 200 + (i * 20),
                rotate: 360,
              }}
              transition={{ 
                duration: 5 + Math.random() * 5, 
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.4
              }}
              className="absolute w-6 h-6 rounded-tl-[60%] rounded-tr-[10%] rounded-bl-[10%] rounded-br-[60%] bg-[#F06292] opacity-40 shadow-sm"
              style={{
                top: -50,
                left: `${(i * 9) + 5}%`,
              }}
            />
          ))}

          {/* Core Content */}
          <div className="text-center px-4 relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[#D6336C] font-quicksand text-lg font-medium tracking-wide uppercase"
            >
              Presenting
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.7, 
                type: "spring",
                stiffness: 80,
                damping: 10
              }}
              className="mt-2 text-5xl md:text-6xl font-quicksand font-bold tracking-tight text-[#D6336C] drop-shadow-sm flex items-center justify-center gap-2"
            >
              its.kirkiri
              <motion.span
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  delay: 1.5,
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="inline-block"
              >
                💕
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-4 text-[#4A2C33]/80 font-poppins text-sm italic"
            >
              Handmade Bouquets, Gifts & Custom Craft
            </motion.p>
          </div>

          {/* Interactive Skip Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
            onClick={() => setIsVisible(false)}
            className="absolute bottom-10 px-4 py-2 text-xs font-poppins font-semibold text-[#D6336C] bg-white/60 hover:bg-white border border-[#FDE2EC] rounded-full shadow-sm backdrop-blur-sm cursor-pointer"
          >
            Skip Intro
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
