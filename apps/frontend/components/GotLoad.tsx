"use client"
import { motion } from "framer-motion";

const GotLoading = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-orange-500/20"
            style={{
              left: `${15 + (i * 10)}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <motion.div
        className="flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated pencil icon */}
        <div className="relative">
          <motion.svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-orange-500"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </motion.svg>
          
          {/* Drawing line animation */}
          <motion.div
            className="absolute -bottom-2 left-1/2 h-0.5 bg-orange-500 rounded-full"
            initial={{ width: 0, x: "-50%" }}
            animate={{ width: [0, 60, 0], x: "-50%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Logo text */}
        <motion.h1
          className="font-display text-4xl text-gray-900"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          SketchFlow
        </motion.h1>

        {/* Loading dots */}
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-orange-500"
              animate={{
                y: [0, -12, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <motion.p
          className="font-body text-gray-600 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Preparing your canvas...
        </motion.p>
      </motion.div>

      {/* Corner decorations */}
      <svg className="absolute top-8 left-8 w-16 h-16 text-orange-200 opacity-40" viewBox="0 0 100 100">
        <motion.path
          d="M10,50 Q30,20 50,50 T90,50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      <svg className="absolute bottom-8 right-8 w-16 h-16 text-orange-200 opacity-40" viewBox="0 0 100 100">
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5,5"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
};

export default GotLoading;