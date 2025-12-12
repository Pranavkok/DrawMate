"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@repo/ui/button";
import {
  Pencil, Menu, X, ArrowRight, Play, Users, Zap, Download,
  Lock, Palette, Share2, MousePointer, Shapes, Share, Sparkles,
  Github, Twitter
} from "lucide-react";
import Link from "next/link";

// ============== HEADER ==============
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <Pencil className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-gray-900">Sketchboard</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-body">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors font-body">How it works</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-body">Pricing</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href={"/signin"}>
            <Button className="text-gray-700 py-2 px-3 rounded-2xl hover:text-white hover:bg-orange-500">Sign in</Button>
          </Link>
          <Link href={"/signin"}>
            <Button  className=" hover:bg-orange-600 py-2 px-3 rounded-2xl text-white bg-orange-500">Register</Button>
          </Link>
        </div>

        <button className="md:hidden p-2 text-gray-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-body py-2">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors font-body py-2">How it works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-body py-2">Pricing</a>
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                <Button className="text-gray-700 p-1 rounded-2xl hover:text-gray-900 hover:bg-gray-100">Sign in</Button>
                <Button  className="bg-orange-500 p-1 rounded-2xl hover:bg-orange-600 text-white">Start Drawing</Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ============== TOOL ICON ==============
const ToolIcon = ({ tool }: { tool: string }) => {
  const icons: Record<string, JSX.Element> = {
    square: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="1" /></svg>,
    circle: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /></svg>,
    line: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="13" x2="13" y2="3" /></svg>,
    arrow: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="13" x2="13" y2="3" /><polyline points="7 3 13 3 13 9" /></svg>,
    text: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="4" x2="13" y2="4" /><line x1="8" y1="4" x2="8" y2="13" /></svg>,
  };
  return icons[tool] || null;
};

// ============== CANVAS PREVIEW ==============
const CanvasPreview = () => {
  return (
    <div className="relative">
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-100 rounded-full blur-2xl" />
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-50 rounded-full blur-2xl" />
      
      <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 flex justify-center gap-2">
            {["square", "circle", "line", "arrow", "text"].map((tool) => (
              <div key={tool} className="w-8 h-8 rounded-lg bg-white hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer text-gray-700">
                <ToolIcon tool={tool} />
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-[4/3] bg-orange-50 p-6">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle, rgb(249 115 22) 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />

          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
            <motion.rect x="40" y="40" width="100" height="80" rx="4" fill="none" stroke="rgb(249 115 22)" strokeWidth="2" strokeDasharray="4 2" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} />
            <motion.circle cx="250" cy="80" r="45" fill="none" stroke="rgb(251 146 60)" strokeWidth="2" strokeDasharray="4 2" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} />
            <motion.path d="M 150 80 Q 180 60 200 80" fill="none" stroke="rgb(249 115 22)" strokeWidth="2" markerEnd="url(#arrowhead)" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 1.2 }} />
            <motion.rect x="180" y="160" width="120" height="70" rx="4" fill="rgba(251, 146, 60, 0.2)" stroke="rgb(249 115 22)" strokeWidth="2" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 1.5 }} />
            <motion.path d="M 60 180 Q 80 160 100 180 Q 120 200 140 180" fill="none" stroke="rgb(249 115 22)" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1, delay: 1.8 }} />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="rgb(249 115 22)" />
              </marker>
            </defs>
          </svg>

          <motion.div className="absolute top-12 left-12 text-xs font-display text-orange-600 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>Start here!</motion.div>
          <motion.div className="absolute bottom-16 right-20 text-xs font-display text-gray-900 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>Your idea ✨</motion.div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 font-body">
          <span>100%</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full" />3 collaborators</span>
        </div>
      </div>

      <motion.div className="absolute top-1/2 left-1/2" animate={{ x: [0, 30, 60, 30, 0], y: [0, -20, 10, 40, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <div className="relative">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 3L19 12L12 13L9 20L5 3Z" fill="rgb(249 115 22)" stroke="white" strokeWidth="2" />
          </svg>
          <span className="absolute -bottom-5 left-4 text-xs bg-orange-500 text-white px-2 py-0.5 rounded font-body whitespace-nowrap">Sarah</span>
        </div>
      </motion.div>
    </div>
  );
};

// ============== HERO ==============
const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 overflow-hidden bg-white">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-sm font-body text-orange-900">Now with real-time collaboration</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Sketch your <span className="text-orange-500">ideas</span> together
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 font-body max-w-xl">
              A virtual whiteboard for sketching hand-drawn like diagrams. Collaborate in real-time, export anywhere, and bring your ideas to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="group rounded-2xl bg-orange-500 hover:bg-orange-600 text-white">
                <div className="flex flex-row gap-4 p-4 justify-between">
                <p>Start Drawing Free</p>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>
              <Button className="group bg-white border-2 rounded-2xl border-orange-500 text-orange-500 hover:bg-orange-50">
                <div className="flex flex-row gap-4 p-4 justify-between">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </div>
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-xs font-bold text-orange-600">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="font-body font-semibold text-gray-900">10k+ creators</p>
                <p className="text-sm text-gray-600 font-body">already sketching</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="relative">
            <CanvasPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============== FEATURES ==============
const features = [
  { icon: Users, title: "Real-time Collaboration", description: "Work together with your team in real-time. See cursors, changes, and chat instantly.", color: "orange" },
  { icon: Zap, title: "Lightning Fast", description: "No loading, no lag. Start sketching instantly in your browser with zero setup.", color: "orange" },
  { icon: Download, title: "Export Anywhere", description: "Export to PNG, SVG, or share a live link. Your sketches, your way.", color: "orange" },
  { icon: Lock, title: "End-to-end Encrypted", description: "Your data stays private. We use end-to-end encryption for all your drawings.", color: "orange" },
  { icon: Palette, title: "Hand-drawn Style", description: "Beautiful, sketch-like diagrams that look natural and approachable.", color: "orange" },
  { icon: Share2, title: "Easy Sharing", description: "Share with a link, embed in Notion, or collaborate live with your team.", color: "orange" },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-4 bg-orange-50">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Everything you need to <span className="text-orange-500">sketch</span></h2>
          <p className="text-lg text-gray-600 font-body max-w-2xl mx-auto">Powerful features wrapped in a simple, intuitive interface. Focus on your ideas, not the tools.</p>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <motion.div key={feature.title} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-orange-500 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 font-body">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============== HOW IT WORKS ==============
const steps = [
  { icon: MousePointer, number: "01", title: "Open & Start", description: "No signup required. Just open the app and start drawing immediately." },
  { icon: Shapes, number: "02", title: "Sketch Your Ideas", description: "Use intuitive tools to create diagrams, wireframes, and illustrations." },
  { icon: Share, number: "03", title: "Share & Collaborate", description: "Invite others to view or edit. Export to any format you need." },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-white">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Simple as <span className="text-orange-500">1-2-3</span></h2>
          <p className="text-lg text-gray-600 font-body max-w-2xl mx-auto">Get started in seconds. No learning curve, no complicated setup.</p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-200 via-orange-500 to-orange-200 -translate-y-1/2" />
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div key={step.number} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.2 }} className="relative text-center">
                <div className="relative z-10 bg-white mx-auto w-fit">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center mb-6 shadow-lg">
                    <step.icon className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                <span className="font-display text-6xl font-bold text-orange-100 absolute -top-4 left-1/2 -translate-x-1/2">{step.number}</span>
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 font-body max-w-xs mx-auto">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============== CTA ==============
const CTA = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-orange-50 to-white">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-40" />

      <div className="container mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-900 px-4 py-2 rounded-full mb-6 font-body">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Free forever for personal use</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Ready to bring your <span className="text-orange-500">ideas</span> to life?</h2>
          <p className="text-lg md:text-xl text-gray-600 font-body mb-10 max-w-xl mx-auto">Join thousands of creators, designers, and teams who sketch their ideas on Sketchboard every day.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button  className="group p-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white">
              Start Drawing Now
            </Button>
            <Button className="bg-white border-2 p-4 rounded-2xl border-orange-500 text-orange-500 hover:bg-orange-50">View Examples</Button>
          </div>

          <p className="mt-8 text-sm text-gray-600 font-body">No credit card required • Works in your browser • Export anytime</p>
        </motion.div>
      </div>
    </section>
  );
};

// ============== FOOTER ==============
const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-gray-200 bg-white">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Pencil className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-gray-900">Sketchboard</span>
            </div>
            <p className="text-gray-600 font-body max-w-sm">A virtual whiteboard for sketching hand-drawn diagrams. Open source and free forever.</p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2 font-body">
              <li><a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">Changelog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2 font-body">
              <li><a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">API</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">Community</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 font-body">© 2024 Sketchboard. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-body">
            <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">Terms</a>
            <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============== MAIN PAGE ==============
const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;