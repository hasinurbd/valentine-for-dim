import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import QRCode from "react-qr-code";
import { Heart, Gift, Music, Mail, Frown, Smile, RefreshCw, Star } from "lucide-react";

// Components
import FloatingHearts from "./components/FloatingHearts";

// --- Sub-components defined here for simplicity ---

function Character({ type }: { type: "happy" | "sad" | "neutral" }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative inline-block"
    >
      <motion.div
        animate={
          type === "sad" 
            ? { rotate: [0, -5, 5, -5, 5, 0], x: [0, -2, 2, -2, 2, 0] } 
            : type === "happy" 
            ? { rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] } 
            : {}
        }
        transition={{ 
          repeat: Infinity, 
          duration: type === "sad" ? 2 : 3, 
          repeatDelay: type === "sad" ? 1 : 0,
          ease: "easeInOut"
        }}
      >
        {type === "sad" ? (
          <div className="relative">
            <Heart className="w-32 h-32 text-gray-400 fill-gray-200 drop-shadow-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
               <Frown className="w-16 h-16 text-gray-600" />
            </div>
             <motion.div 
              animate={{ y: [0, 15, 0], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeIn" }}
              className="absolute top-20 right-8 text-blue-400 text-2xl"
             >
               💧
             </motion.div>
          </div>
        ) : (
          <div className="relative">
            <Heart className={`w-32 h-32 ${type === "happy" ? "text-red-500 fill-red-400" : "text-pink-500 fill-pink-400"} drop-shadow-xl`} />
            <div className="absolute inset-0 flex items-center justify-center">
               <Smile className="w-16 h-16 text-white/90" />
            </div>
            {type === "happy" && (
              <motion.div
                animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 45, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-6 -right-6 text-yellow-400"
              >
                <Star className="w-10 h-10 fill-yellow-400" />
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function GiftCard({ frontIcon, frontText, backContent, colorClass, backPadding = "p-6" }: { frontIcon: ReactNode, frontText: string, backContent: ReactNode, colorClass: string, backPadding?: string }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="group h-96 w-72 [perspective:1000px]" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front */}
        <div className={`absolute inset-0 h-full w-full rounded-xl ${colorClass} p-6 flex flex-col items-center justify-center text-center shadow-xl [backface-visibility:hidden] border-4 border-white/30`}>
          <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
            {frontIcon}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{frontText}</h3>
          <p className="text-white/80 text-sm animate-pulse">Tap to open</p>
        </div>

        {/* Back */}
        <div className={`absolute inset-0 h-full w-full rounded-xl bg-white ${backPadding} flex flex-col items-center justify-center text-center shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden border-4 border-pink-100`}>
          {backContent}
        </div>
      </motion.div>
    </div>
  );
}

// --- Main App Component ---

export default function App() {
  const [screen, setScreen] = useState<"greeting" | "sad" | "happy">("greeting");

  const handleYes = () => {
    setScreen("happy");
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff69b4', '#ff1493', '#ffb6c1']
    });
  };

  const handleNo = () => {
    setScreen("sad");
  };

  const handleRestart = () => {
    setScreen("greeting");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-200 via-red-100 to-pink-300 overflow-x-hidden font-sans text-gray-800 relative">
      <FloatingHearts />

      <AnimatePresence mode="wait">
        {screen === "greeting" && (
          <motion.div
            key="greeting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen p-4 text-center z-10 relative"
          >
            <Character type="neutral" />
            <h1 className="text-4xl md:text-6xl font-bold text-red-600 mt-8 mb-4 drop-shadow-sm">
              Hey there!
            </h1>
            <p className="text-2xl md:text-3xl text-pink-700 mb-12 font-medium">
              Will you be my Valentine?
            </p>
            
            <div className="flex flex-col md:flex-row gap-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleYes}
                className="px-8 py-4 bg-red-500 text-white text-xl font-bold rounded-full shadow-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Heart className="fill-white" /> YES OF COURSE
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNo}
                className="px-8 py-4 bg-white text-gray-600 text-xl font-bold rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                NO THANK YOU
              </motion.button>
            </div>
          </motion.div>
        )}

        {screen === "sad" && (
          <motion.div
            key="sad"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-4 text-center z-10 relative"
          >
            <Character type="sad" />
            <h2 className="text-3xl md:text-5xl font-bold text-gray-700 mt-8 mb-4">
              Try again please :(
            </h2>
            <p className="text-xl text-gray-500 mb-8">
              My heart is breaking...
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              className="px-8 py-3 bg-blue-400 text-white text-lg font-bold rounded-full shadow-md hover:bg-blue-500 transition-colors flex items-center gap-2 animate-pulse"
            >
              <RefreshCw size={20} /> Restart
            </motion.button>
          </motion.div>
        )}

        {screen === "happy" && (
          <motion.div
            key="happy"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center min-h-screen p-4 z-10 relative w-full max-w-6xl mx-auto"
          >
            {/* Header Section */}
            <div className="text-center mt-12 mb-16">
              <Character type="happy" />
              <h1 className="text-4xl md:text-6xl font-bold text-red-600 mt-6 mb-2">
                Yay, you said yes!
              </h1>
              <p className="text-xl text-pink-600">
                I made all these for you hehe ❤️
              </p>
            </div>

            {/* Gifts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 w-full place-items-center">
              {/* Gift 1: Flowers */}
              <GiftCard
                colorClass="bg-gradient-to-br from-red-400 to-pink-500"
                frontIcon={<Gift size={48} className="text-white" />}
                frontText="A Gift For You"
                backContent={
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-4xl mb-2">🌹💐</div>
                    <h4 className="font-bold text-red-500 text-lg">My Dearest</h4>
                    <p className="text-sm text-gray-600 italic">"You are the best part of my life."</p>
                    <div className="w-full h-px bg-pink-200 my-2" />
                    <p className="text-sm text-gray-600 italic">"I can’t imagine a life without you in it."</p>
                  </div>
                }
              />

              {/* Gift 2: Letter */}
              <GiftCard
                colorClass="bg-gradient-to-br from-purple-400 to-pink-400"
                frontIcon={<Mail size={48} className="text-white" />}
                frontText="Read Me"
                backContent={
                  <div className="text-left w-full h-full overflow-y-auto scrollbar-thin">
                    <p className="font-handwriting text-gray-700 leading-relaxed text-sm">
                      Dim,
                      <br/><br/>
                      Every moment with you feels like a dream I never want to wake up from. You bring so much joy, laughter, and warmth into my world.
                      <br/><br/>
                      Thank you for being you.
                      <br/><br/>
                      Forever yours,
                      <br/>
                      Nave
                    </p>
                  </div>
                }
              />

              {/* Gift 3: Music */}
              <GiftCard
                colorClass="bg-gradient-to-br from-blue-400 to-indigo-400"
                frontIcon={<Music size={48} className="text-white" />}
                frontText="Our Song"
                backPadding="p-0"
                backContent={
                  <div className="w-full h-full rounded-lg overflow-hidden shadow-md bg-black">
                    <iframe 
                      style={{borderRadius: "12px"}} 
                      src="https://open.spotify.com/embed/track/1d5lpW3gUyq537iuyrb9Lf?utm_source=generator" 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                      loading="lazy"
                    ></iframe>
                  </div>
                }
              />
            </div>

            {/* Card Section */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-24 relative overflow-hidden border-8 border-pink-100"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Heart size={200} />
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-center text-red-500 mb-8 font-serif">
                Happy Valentine’s Day, Dim
              </h2>

              <div className="flex flex-col items-center gap-8 mb-12 w-full px-4">
                {/* Couple Image Card */}
                <div className="bg-white p-4 rounded-3xl shadow-2xl border-4 border-pink-100 flex flex-col items-center w-full max-w-lg aspect-[4/3] relative group transform hover:scale-[1.02] transition-all duration-500">
                  <div className="w-full h-full overflow-hidden rounded-2xl bg-gray-50 relative flex items-center justify-center">
                    <img 
                      src="https://lh3.googleusercontent.com/d/1eF6sjL0KO5LKJ9gBV_ad_HL9uGrwxilW" 
                      onError={(e) => e.currentTarget.src = "https://placehold.co/600x800?text=Check+Link+Permissions"}
                      alt="Nave + Dim" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 -rotate-90" 
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  <div className="absolute -bottom-6 bg-white shadow-lg px-8 py-3 rounded-full flex items-center gap-2 border border-pink-50 z-20">
                    <Heart className="fill-red-500 text-red-500 w-5 h-5" />
                    <span className="font-bold text-gray-800 tracking-wide">Nave + Dim</span>
                  </div>
                </div>
                
                {/* Forever Section */}
                <div className="flex flex-col items-center mt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-px w-12 bg-red-200"></div>
                    <div className="text-4xl">♾️</div>
                    <div className="h-px w-12 bg-red-200"></div>
                  </div>
                  <p className="font-handwriting text-3xl text-red-500 font-bold">Forever & Always</p>
                  <div className="flex gap-2 mt-3">
                    <Heart className="fill-pink-400 text-pink-400 w-4 h-4 animate-bounce" />
                    <Heart className="fill-red-400 text-red-400 w-4 h-4 animate-bounce delay-100" />
                    <Heart className="fill-pink-400 text-pink-400 w-4 h-4 animate-bounce delay-200" />
                  </div>
                </div>
              </div>

              {/* Special Messages */}
              <div className="flex flex-col md:flex-row justify-center gap-6 mb-10 w-full px-4">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 px-8 py-4 rounded-2xl shadow-md flex items-center justify-center gap-4 transform -rotate-1"
                >
                  <span className="text-4xl">💍</span>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-amber-800/70 font-serif text-sm uppercase tracking-wider">Best Moment</span>
                    <span className="font-bold text-amber-600 font-handwriting text-2xl">You said YES!</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="bg-gradient-to-r from-purple-50 to-fuchsia-50 border-2 border-purple-200 px-8 py-4 rounded-2xl shadow-md flex items-center justify-center gap-4 transform rotate-1"
                >
                  <span className="text-4xl">🎂</span>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-purple-800/70 font-serif text-sm uppercase tracking-wider">Advance HBD</span>
                    <span className="font-bold text-purple-600 font-handwriting text-2xl">16 Feb uwu</span>
                  </div>
                </motion.div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-gray-600 text-lg italic">
                  "Here's to many more memories, laughs, and quiet moments together."
                </p>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex justify-center gap-4 text-2xl text-red-500 font-bold font-serif tracking-wider">
                    <span>NAVE</span>
                    <span>&</span>
                    <span>DIM</span>
                  </div>
                  <div className="text-sm font-medium text-pink-400 tracking-widest uppercase border-t border-pink-100 pt-2 px-8">
                    May 21, 2025
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Screenshot Section */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="mb-24 text-center max-w-md mx-auto w-full px-4"
            >
              <p className="text-xl font-bold text-gray-700 mb-6 bg-white/50 inline-block px-6 py-2 rounded-full shadow-sm">
                Hey don't forget:
              </p>
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://lh3.googleusercontent.com/d/1byrmSIQNLH30ahC05quYc6g1CgqUiwJW" 
                  onError={(e) => e.currentTarget.src = "https://placehold.co/600x1200?text=Check+Link+Permissions"}
                  alt="Chat Screenshot" 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto" 
                />
              </div>
            </motion.div>

            {/* Footer / Restart */}
            <div className="mb-12 text-center">
              <button
                onClick={handleRestart}
                className="text-pink-600 hover:text-pink-800 underline decoration-2 underline-offset-4 font-medium transition-colors"
              >
                Relive the moment ↺
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
