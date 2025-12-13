import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, MessageCircle, Pencil } from "lucide-react";

export const SomethingWentWrong = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-canvas relative overflow-hidden flex items-center justify-center">
      {/* Decorative Broken Elements */}
      <motion.svg
        className="absolute top-20 left-10 w-32 h-32 text-destructive/20"
        viewBox="0 0 100 100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <path
          d="M10,20 L30,25 L25,50 L50,45 L45,70 L70,65 L90,80"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="8,4"
        />
      </motion.svg>

      <motion.svg
        className="absolute bottom-20 right-10 w-40 h-40 text-muted-foreground/20"
        viewBox="0 0 100 100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10,5" />
        <line x1="25" y1="25" x2="75" y2="75" stroke="currentColor" strokeWidth="3" />
        <line x1="75" y1="25" x2="25" y2="75" stroke="currentColor" strokeWidth="3" />
      </motion.svg>

      <motion.div
        className="absolute top-1/4 right-16 w-6 h-6 bg-highlight/30 rounded-full"
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-1/3 left-16 w-8 h-8 border-2 border-dashed border-primary/30 rounded-lg"
        animate={{ rotate: [0, 45, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
            className="relative w-32 h-32 mx-auto mb-8"
          >
            <div className="absolute inset-0 bg-destructive/10 rounded-3xl sketch-border" />
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertTriangle className="w-16 h-16 text-destructive" />
            </div>
            {/* Broken pencil decoration */}
            <motion.div
              className="absolute -top-4 -right-4"
              initial={{ opacity: 0, rotate: 45 }}
              animate={{ opacity: 1, rotate: 30 }}
              transition={{ delay: 0.5 }}
            >
              <Pencil className="w-8 h-8 text-muted-foreground" />
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl md:text-5xl text-foreground mb-4"
          >
            Oops! Something broke
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground font-body text-lg mb-8 max-w-md mx-auto"
          >
            Our pencils got a bit tangled up. Dont worry, we are sketching out a solution!
          </motion.p>

          {/* Sketch-style error illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10"
          >
            <svg viewBox="0 0 300 100" className="w-full max-w-xs mx-auto text-muted-foreground/40">
              {/* Broken line */}
              <motion.path
                d="M20,50 C50,30 80,70 110,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.path
                d="M130,50 C160,30 190,70 220,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
              />
              <motion.path
                d="M240,50 L280,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              />
              {/* Question marks */}
              <motion.text
                x="125"
                y="35"
                className="fill-current text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                ?
              </motion.text>
            </svg>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={handleRefresh}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-display text-lg hover:bg-primary/90 transition-colors sketch-border"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </motion.button>

            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-card border-2 border-sketch text-foreground rounded-xl font-display text-lg hover:bg-muted transition-colors w-full"
              >
                <Home className="w-5 h-5" />
                Go Home
              </motion.button>
            </Link>
          </motion.div>

          {/* Help Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10"
          >
            <a
              href="#"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Support
            </a>
          </motion.div>

          {/* Error Code */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-sm text-muted-foreground/60 font-body"
          >
            Error Code: SKETCH_ERR_500
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default SomethingWentWrong;
