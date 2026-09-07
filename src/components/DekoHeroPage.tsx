import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Heart, Star, Flame, Crown, Zap, Music, Volume2, 
  VolumeX, Share2, Check, ArrowRight, Eye, Trophy, Smile,
  PartyPopper, Compass
} from 'lucide-react';

const COMPLIMENTS = [
  "Official NASA reports confirm: Deko's aura is visible from outer space. ✨",
  "Scientists tried to measure her coolness. The thermometer shattered immediately. 🔥",
  "The Georgian Academy of Science officially verified: She is 100% 'Magari Tipia'. 👑",
  "Deko doesn't follow trends. Trends take notes when Deko walks in. 💅",
  "The padel ball hits 30% faster when Deko is watching the court. 🎾",
  "Dictionary definition of 'magari tipi': Literally just a high-res photo of Deko. 💫",
  "Energy level: Infinite. Charm rating: 1000/10. Vibes: Unmatched. 💖",
  "Even the sun checks its reflection before rising near Deko. ☀️"
];

export const DekoHeroPage: React.FC = () => {
  const [hypeCount, setHypeCount] = useState(() => {
    const saved = localStorage.getItem('deko_hype_score');
    return saved ? parseInt(saved, 10) : 1240;
  });
  const [copied, setCopied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeCompliment, setActiveCompliment] = useState<string | null>(null);
  const [clickSparks, setClickSparks] = useState<{ id: number; x: number; y: number }[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Resume or unlock Web Audio on first gesture
  useEffect(() => {
    const unlockAudio = () => {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
      } catch (e) {
        // Ignore audio unlock errors
      }
    };
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  // Sound Synth via Web Audio API (Magical Chime / Pop)
  const playSparkleSound = (freq = 520, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Audio not permitted yet
    }
  };

  // Maximalist confetti explosion
  const triggerMaximalistBurst = (x = 0.5, y = 0.5) => {
    playSparkleSound(660, 'triangle');

    // Confetti cannon 1: Gold & Pink stars
    confetti({
      particleCount: 75,
      spread: 120,
      startVelocity: 45,
      origin: { x, y },
      colors: ['#ff007f', '#a855f7', '#ec4899', '#fbbf24', '#06b6d4', '#10b981'],
      shapes: ['star', 'circle'],
      scalar: 1.2,
      zIndex: 9999
    });

    // Confetti cannon 2: Neon streamers
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 90,
        startVelocity: 35,
        origin: { x, y },
        colors: ['#ffffff', '#f43f5e', '#8b5cf6', '#3b82f6', '#f59e0b'],
        zIndex: 9999
      });
    }, 120);
  };

  const handleHypeClick = (e: React.MouseEvent) => {
    const newCount = hypeCount + 1;
    setHypeCount(newCount);
    localStorage.setItem('deko_hype_score', newCount.toString());

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    triggerMaximalistBurst(x, y);

    // Random compliment
    const randomIdx = Math.floor(Math.random() * COMPLIMENTS.length);
    setActiveCompliment(COMPLIMENTS[randomIdx]);
  };

  const handleScreenClick = (e: React.MouseEvent) => {
    // Avoid double trigger if clicking interactive buttons
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }

    playSparkleSound(440 + Math.random() * 400);

    const sparkId = Date.now() + Math.random();
    setClickSparks(prev => [...prev.slice(-12), { id: sparkId, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setClickSparks(prev => prev.filter(s => s.id !== sparkId));
    }, 1000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/deko');
    setCopied(true);
    triggerMaximalistBurst(0.9, 0.1);
    setTimeout(() => setCopied(false), 2500);
  };

  // Initial welcome confetti and title on mount
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "DEKO — magari tipia 👑✨";

    const timer = setTimeout(() => {
      triggerMaximalistBurst(0.5, 0.4);
    }, 600);

    return () => {
      clearTimeout(timer);
      document.title = prevTitle;
    };
  }, []);

  return (
    <div 
      onClick={handleScreenClick}
      className="relative min-h-screen w-full bg-[#05010b] text-white overflow-x-hidden flex flex-col justify-between selection:bg-pink-500 selection:text-white cursor-default select-none"
    >
      {/* Click Sparkles Effect */}
      {clickSparks.map(s => (
        <div 
          key={s.id}
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{ left: s.x, top: s.y }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-amber-300 blur-sm opacity-80" />
          <Star className="w-6 h-6 text-yellow-300 absolute inset-0 m-auto animate-spin" />
        </div>
      ))}

      {/* 1. KINETIC MAXIMALIST BACKGROUND LAYERS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Glow Orb 1 - Neon Pink */}
        <div className="absolute -top-32 -left-32 w-96 sm:w-[36rem] h-96 sm:h-[36rem] rounded-full bg-gradient-to-br from-pink-600/35 via-fuchsia-600/25 to-transparent blur-[120px] animate-pulse" />
        
        {/* Glow Orb 2 - Electric Violet */}
        <div className="absolute top-1/3 -right-32 w-96 sm:w-[40rem] h-96 sm:h-[40rem] rounded-full bg-gradient-to-bl from-purple-600/40 via-indigo-600/30 to-transparent blur-[140px] animate-pulse" style={{ animationDuration: '6s' }} />

        {/* Glow Orb 3 - Tennis Acid Gold */}
        <div className="absolute -bottom-32 left-1/4 w-96 sm:w-[44rem] h-96 sm:h-[44rem] rounded-full bg-gradient-to-tr from-amber-500/30 via-pink-500/20 to-transparent blur-[130px] animate-pulse" style={{ animationDuration: '8s' }} />

        {/* Retro Cyber Laser Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(236, 72, 153, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(168, 85, 247, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 85%)'
          }}
        />

        {/* Floating Ambient Sparkles & Stars */}
        <div className="absolute inset-0">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-300/60 animate-bounce"
              style={{
                top: `${(i * 17) % 95}%`,
                left: `${(i * 23) % 96}%`,
                animationDuration: `${2.5 + (i % 5)}s`,
                animationDelay: `${(i * 0.3)}s`,
                fontSize: `${10 + (i % 14)}px`
              }}
            >
              {i % 3 === 0 ? '✦' : i % 3 === 1 ? '★' : '✨'}
            </div>
          ))}
        </div>
      </div>

      {/* 2. TOP MAXIMALIST MARQUEE TICKER */}
      <div className="relative z-20 w-full overflow-hidden bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 text-black py-2 font-black tracking-widest text-[11px] sm:text-xs uppercase shadow-lg shadow-pink-950/40 border-b border-white/20">
        <div className="flex w-[200%] animate-marquee whitespace-nowrap gap-6 items-center">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 shrink-0">
              <span className="flex items-center gap-1.5"><Crown className="w-3.5 h-3.5 fill-black" /> DEKO SUPREMACY</span>
              <span>✦</span>
              <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 fill-black" /> MAGARI TIPIA</span>
              <span>✦</span>
              <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 fill-black" /> 100/10 ICON</span>
              <span>✦</span>
              <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 fill-black" /> MAIN CHARACTER ENERGY</span>
              <span>✦</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 fill-black" /> UNMATCHED VIBES</span>
              <span>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Controls Bar */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-2 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white/90">OFFICIAL DEKO TRIBUTE</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) {
                playSparkleSound(880, 'sine');
              }
            }}
            className={`px-3 sm:px-4 py-2 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg active:scale-95 cursor-pointer ${
              soundEnabled 
                ? 'bg-pink-600 border-pink-400 text-white shadow-pink-600/40' 
                : 'bg-white/10 border-white/15 text-white/80 hover:bg-white/15'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-white" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound FX ON' : 'Sound FX OFF'}</span>
          </button>

          {/* Share Link */}
          <button
            onClick={handleCopyLink}
            className="px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border border-white/30 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-purple-900/50 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied! 💖' : 'Share /deko'}</span>
          </button>
        </div>
      </header>

      {/* 3. MAIN HERO SECTION - MAXIMALIST SPECTACLE */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 py-8 sm:py-16 max-w-6xl mx-auto w-full">

        {/* FLOATING STICKER 1: TOP LEFT */}
        <div className="hidden lg:block absolute left-4 top-20 -rotate-12 hover:rotate-0 transition-transform duration-300 cursor-pointer animate-float">
          <div className="px-5 py-3 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black font-black text-xs uppercase shadow-2xl border-2 border-black flex items-center gap-2 ring-4 ring-yellow-400/30">
            <Trophy className="w-4 h-4 fill-black" />
            <span>UNMATCHED 10/10</span>
          </div>
        </div>

        {/* FLOATING STICKER 2: TOP RIGHT */}
        <div className="hidden lg:block absolute right-6 top-24 rotate-12 hover:rotate-0 transition-transform duration-300 cursor-pointer animate-float" style={{ animationDelay: '1s' }}>
          <div className="px-5 py-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white font-black text-xs uppercase shadow-2xl border-2 border-white/40 flex items-center gap-2 ring-4 ring-pink-500/30">
            <Flame className="w-4 h-4 fill-yellow-300 text-yellow-300" />
            <span>SHE DOESN'T MISS</span>
          </div>
        </div>

        {/* FLOATING STICKER 3: BOTTOM LEFT */}
        <div className="hidden md:block absolute left-8 bottom-28 rotate-6 hover:rotate-0 transition-transform duration-300 cursor-pointer animate-float" style={{ animationDelay: '1.5s' }}>
          <div className="px-5 py-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-black text-xs uppercase shadow-2xl border-2 border-purple-300/40 flex items-center gap-2 ring-4 ring-purple-600/30">
            <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>QUEEN OF VIBES</span>
          </div>
        </div>

        {/* FLOATING STICKER 4: BOTTOM RIGHT */}
        <div className="hidden md:block absolute right-8 bottom-32 -rotate-6 hover:rotate-0 transition-transform duration-300 cursor-pointer animate-float" style={{ animationDelay: '2s' }}>
          <div className="px-5 py-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-black font-black text-xs uppercase shadow-2xl border-2 border-black flex items-center gap-2 ring-4 ring-emerald-400/30">
            <Sparkles className="w-4 h-4 fill-black" />
            <span>CERTIFIED ICON</span>
          </div>
        </div>

        {/* CROWN BADGE ABOVE NAME */}
        <div className="mb-4 sm:mb-6 animate-bounce">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-600/90 via-purple-600/90 to-amber-500/90 backdrop-blur-xl border-2 border-white/40 shadow-2xl shadow-pink-600/50 ring-4 ring-pink-500/20 text-xs sm:text-sm font-black tracking-wider uppercase text-white">
            <Crown className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>HER MAJESTY</span>
            <Crown className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* THE CENTERPIECE: MONUMENTAL "DEKO" */}
        <div className="relative my-2 sm:my-4 group">
          {/* Chromatic back shadow glow */}
          <div className="absolute inset-0 font-black text-7xl sm:text-9xl md:text-[12rem] lg:text-[14rem] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity select-none">
            DEKO
          </div>

          {/* 3D layered chromatic offset */}
          <div className="absolute -inset-1 font-black text-7xl sm:text-9xl md:text-[12rem] lg:text-[14rem] tracking-tight text-fuchsia-700/40 select-none translate-x-1 translate-y-1">
            DEKO
          </div>

          {/* Forefront Giant Holographic Typography */}
          <h1 className="relative font-black text-7xl sm:text-9xl md:text-[12rem] lg:text-[14rem] tracking-tight leading-none uppercase font-fugaz">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-pink-100 to-pink-500 drop-shadow-[0_15px_30px_rgba(236,72,153,0.7)]">
              DEKO
            </span>
          </h1>

          {/* Interactive Floating Tennis/Heart Emojis directly on the name */}
          <div className="absolute -top-6 -right-4 sm:-right-8 text-3xl sm:text-5xl animate-spin" style={{ animationDuration: '10s' }}>
            🎾
          </div>
          <div className="absolute -bottom-4 -left-4 sm:-left-8 text-3xl sm:text-5xl animate-bounce">
            💖
          </div>
          <div className="absolute top-1/2 -left-6 sm:-left-12 text-2xl sm:text-4xl animate-pulse">
            ⚡
          </div>
          <div className="absolute top-1/2 -right-6 sm:-right-12 text-2xl sm:text-4xl animate-pulse">
            ✨
          </div>
        </div>

        {/* THE SUBTITLE: "magari tipia" */}
        <div className="mt-4 sm:mt-6 mb-8 sm:mb-12 relative">
          <div className="relative inline-flex items-center gap-3 px-6 sm:px-10 py-3 sm:py-4 rounded-3xl bg-gradient-to-r from-purple-950/80 via-black/90 to-pink-950/80 backdrop-blur-2xl border-2 border-pink-500/60 shadow-[0_0_50px_rgba(236,72,153,0.5)] ring-4 ring-purple-600/30">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 animate-spin" />
            
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 italic lowercase drop-shadow">
              "magari tipia"
            </h2>

            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 animate-spin" style={{ animationDirection: 'reverse' }} />
          </div>

          {/* Under-subtitle English tag */}
          <div className="mt-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-pink-300/80 flex items-center justify-center gap-2">
            <span>[ LITERAL DEFINITION: COOLEST PERSON ON EARTH ]</span>
          </div>
        </div>

        {/* ACTIVE COMPLIMENT POPUP IF TRIGGERED */}
        {activeCompliment && (
          <div className="mb-8 max-w-xl w-full mx-auto animate-bounce">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-900/90 via-purple-900/90 to-pink-900/90 border border-pink-400/50 shadow-2xl text-xs sm:text-sm font-bold text-white text-center flex items-center justify-center gap-2">
              <PartyPopper className="w-4 h-4 text-yellow-300 shrink-0" />
              <span>{activeCompliment}</span>
            </div>
          </div>
        )}

        {/* 4. MAXIMALIST INTERACTION CENTER */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
          
          {/* HUGE HYPE BUTTON */}
          <button
            onClick={handleHypeClick}
            className="w-full sm:w-auto flex-1 px-8 py-5 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white font-black text-base uppercase tracking-wider shadow-[0_10px_35px_rgba(236,72,153,0.6)] ring-4 ring-pink-500/40 transform hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3 group"
          >
            <Heart className="w-6 h-6 fill-white group-hover:scale-125 transition-transform" />
            <span>Hype Deko ({hypeCount})</span>
            <Flame className="w-5 h-5 text-yellow-200" />
          </button>

          {/* EXPLODE CONFETTI BUTTON */}
          <button
            onClick={() => triggerMaximalistBurst()}
            className="w-full sm:w-auto px-6 py-5 rounded-3xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border-2 border-white/30 text-white font-black text-sm uppercase tracking-wider shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span>Explode Confetti</span>
          </button>

        </div>

        {/* VIBE METER / VERIFIED BADGE */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-purple-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            <span>Aura Level: <strong className="text-pink-400 font-mono text-xs">OVER 9000</strong></span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-amber-200 flex items-center gap-2">
            <span>✨</span>
            <span>Vibe Check: <strong className="text-emerald-400">100% MAGARI TIPIA</strong></span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-cyan-200 flex items-center gap-2">
            <span>👑</span>
            <span>Unmatched Status: <strong className="text-yellow-300">CONFIRMED</strong></span>
          </div>
        </div>

      </main>

      {/* 5. BOTTOM MAXIMALIST TICKER */}
      <footer className="relative z-20 w-full overflow-hidden bg-gradient-to-r from-amber-500 via-pink-600 to-purple-700 text-white py-2.5 font-black tracking-widest text-[11px] sm:text-xs uppercase shadow-2xl border-t border-white/20">
        <div className="flex w-[200%] animate-marquee whitespace-nowrap gap-6 items-center" style={{ animationDirection: 'reverse' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 shrink-0">
              <span className="flex items-center gap-1.5">★ DEKO ★</span>
              <span>MAGARI TIPIA</span>
              <span>★</span>
              <span>ABSOLUTE LEGEND</span>
              <span>★</span>
              <span>CERTIFIED UNMATCHED</span>
              <span>★</span>
              <span>QUEEN OF THE COURT</span>
              <span>★</span>
              <span>ICONIC FOREVER</span>
              <span>★</span>
            </div>
          ))}
        </div>
      </footer>

      {/* Discreet Back to Padely portal at very bottom edge */}
      <div className="relative z-30 pb-3 pt-1 text-center bg-[#05010b]">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="text-[10px] text-purple-400/50 hover:text-purple-300 underline underline-offset-2 transition-colors cursor-pointer"
        >
          Go to Padely Tbilisi
        </a>
      </div>

    </div>
  );
};
