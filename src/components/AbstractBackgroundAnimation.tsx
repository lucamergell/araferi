import React from 'react';

export const AbstractBackgroundAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* Background Subtle Tech/Padel Perforation Grid */}
      <div 
        className="absolute inset-0 opacity-[0.09] bg-[radial-gradient(#a855f7_1.5px,transparent_1.5px)] [background-size:28px_28px] animate-pulse-slow"
      />

      {/* Large Ambient Liquid Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-gradient-to-br from-purple-600/25 via-indigo-600/15 to-pink-500/15 blur-[140px] animate-blob-1" />
      <div className="absolute top-1/4 -right-40 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-700/20 to-lime-500/15 blur-[140px] animate-blob-2" />
      <div className="absolute top-2/3 -left-32 w-[28rem] h-[28rem] rounded-full bg-gradient-to-r from-lime-500/10 via-purple-800/20 to-pink-600/15 blur-[130px] animate-blob-3" />
      <div className="absolute -bottom-40 right-1/4 w-[36rem] h-[36rem] rounded-full bg-gradient-to-t from-purple-900/25 via-violet-600/15 to-amber-500/10 blur-[150px] animate-blob-1" />

      {/* Abstract Perspective Padel Court Lines & Net */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] animate-court-pulse pointer-events-none">
        <svg className="w-full h-full max-w-6xl max-h-[800px] text-purple-300" viewBox="0 0 1000 600" fill="none">
          {/* Court Outer Boundary */}
          <rect x="100" y="50" width="800" height="500" stroke="currentColor" strokeWidth="2" rx="10" />
          {/* Service Box Center Line */}
          <line x1="500" y1="50" x2="500" y2="550" stroke="currentColor" strokeWidth="2" />
          {/* Service Lines */}
          <line x1="250" y1="50" x2="250" y2="550" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
          <line x1="750" y1="50" x2="750" y2="550" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
          {/* Net Mesh Line */}
          <line x1="100" y1="300" x2="900" y2="300" stroke="#cfff04" strokeWidth="3" opacity="0.6" />
          {/* Corner Glass Wall Indicators */}
          <path d="M 100 120 L 100 50 L 170 50" stroke="currentColor" strokeWidth="4" />
          <path d="M 900 120 L 900 50 L 830 50" stroke="currentColor" strokeWidth="4" />
          <path d="M 100 480 L 100 550 L 170 550" stroke="currentColor" strokeWidth="4" />
          <path d="M 900 480 L 900 550 L 830 550" stroke="currentColor" strokeWidth="4" />
        </svg>
      </div>

      {/* 1. Floating Padel Racket (Top Right) */}
      <div className="absolute top-[12%] right-[8%] opacity-25 animate-padel-racket-1">
        <svg className="w-48 h-64 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]" viewBox="0 0 200 300" fill="none">
          {/* Racket Head (Teardrop / Round Padel Shape) */}
          <path 
            d="M 100 20 C 150 20 185 60 185 115 C 185 160 150 200 115 210 L 115 260 C 115 270 108 275 100 275 C 92 275 85 270 85 260 L 85 210 C 50 200 15 160 15 115 C 15 60 50 20 100 20 Z" 
            stroke="currentColor" 
            strokeWidth="3" 
            fill="rgba(147, 51, 234, 0.05)"
          />
          {/* Racket Throat Triangular Bridge */}
          <polygon points="85,200 115,200 100,175" stroke="currentColor" strokeWidth="2" fill="none" />
          {/* Handle Grip Wrapping */}
          <rect x="87" y="215" width="26" height="45" rx="3" stroke="currentColor" strokeWidth="1.5" fill="rgba(255,255,255,0.05)" />
          <line x1="87" y1="225" x2="113" y2="225" stroke="currentColor" strokeWidth="1" />
          <line x1="87" y1="235" x2="113" y2="235" stroke="currentColor" strokeWidth="1" />
          <line x1="87" y1="245" x2="113" y2="245" stroke="currentColor" strokeWidth="1" />
          {/* Wrist Cord */}
          <path d="M 100 275 C 100 288 112 295 100 300" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />

          {/* Padel Perforation Holes Matrix */}
          <g fill="currentColor" opacity="0.8">
            {/* Row 1 */}
            <circle cx="100" cy="65" r="4" />
            {/* Row 2 */}
            <circle cx="80" cy="85" r="4" /><circle cx="100" cy="85" r="4" /><circle cx="120" cy="85" r="4" />
            {/* Row 3 */}
            <circle cx="65" cy="110" r="4" /><circle cx="85" cy="110" r="4" /><circle cx="100" cy="110" r="4.5" /><circle cx="115" cy="110" r="4" /><circle cx="135" cy="110" r="4" />
            {/* Row 4 */}
            <circle cx="70" cy="135" r="4" /><circle cx="90" cy="135" r="4" /><circle cx="110" cy="135" r="4" /><circle cx="130" cy="135" r="4" />
            {/* Row 5 */}
            <circle cx="80" cy="160" r="4" /><circle cx="100" cy="160" r="4" /><circle cx="120" cy="160" r="4" />
          </g>
        </svg>
      </div>

      {/* 2. Floating Padel Racket (Bottom Left) */}
      <div className="absolute bottom-[15%] left-[5%] opacity-20 animate-padel-racket-2">
        <svg className="w-40 h-56 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]" viewBox="0 0 200 300" fill="none">
          <path 
            d="M 100 20 C 150 20 185 60 185 115 C 185 160 150 200 115 210 L 115 260 C 115 270 108 275 100 275 C 92 275 85 270 85 260 L 85 210 C 50 200 15 160 15 115 C 15 60 50 20 100 20 Z" 
            stroke="currentColor" 
            strokeWidth="3" 
            fill="rgba(99, 102, 241, 0.05)"
          />
          <polygon points="85,200 115,200 100,175" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="87" y="215" width="26" height="45" rx="3" stroke="currentColor" strokeWidth="1.5" fill="rgba(255,255,255,0.05)" />
          <g fill="currentColor" opacity="0.8">
            <circle cx="100" cy="70" r="4.5" />
            <circle cx="80" cy="95" r="4.5" /><circle cx="100" cy="95" r="4.5" /><circle cx="120" cy="95" r="4.5" />
            <circle cx="65" cy="120" r="4.5" /><circle cx="85" cy="120" r="4.5" /><circle cx="100" cy="120" r="5" /><circle cx="115" cy="120" r="4.5" /><circle cx="135" cy="120" r="4.5" />
            <circle cx="80" cy="145" r="4.5" /><circle cx="100" cy="145" r="4.5" /><circle cx="120" cy="145" r="4.5" />
          </g>
        </svg>
      </div>

      {/* 3. Glowing Animated Padel Ball #1 (Neon Lime Bounce Arc) */}
      <div className="absolute top-[30%] left-[20%] animate-padel-ball-1 z-1">
        <div className="relative">
          {/* Ball Glow */}
          <div className="w-7 h-7 rounded-full bg-[#ccff04] shadow-[0_0_20px_#ccff04,0_0_35px_rgba(204,255,4,0.6)] flex items-center justify-center border border-white/80">
            {/* Padel Ball Curved Seams */}
            <svg className="w-full h-full text-zinc-900 opacity-60" viewBox="0 0 100 100" fill="none">
              <path d="M 20 50 C 20 25 75 25 75 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              <path d="M 25 80 C 50 80 50 20 75 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>
          {/* Motion Tail */}
          <div className="absolute top-1/2 -left-8 -translate-y-1/2 w-10 h-2 bg-gradient-to-r from-transparent to-[#ccff04]/60 blur-[2px] rounded-full" />
        </div>
      </div>

      {/* 4. Glowing Animated Padel Ball #2 (Floating Trajectory) */}
      <div className="absolute bottom-[35%] right-[25%] animate-padel-ball-2 z-1">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-lime-400 shadow-[0_0_22px_#a3e635,0_0_40px_rgba(163,230,53,0.5)] flex items-center justify-center border border-white/90">
            <svg className="w-full h-full text-zinc-900 opacity-60" viewBox="0 0 100 100" fill="none">
              <path d="M 20 50 C 20 25 75 25 75 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              <path d="M 25 80 C 50 80 50 20 75 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-12 h-2.5 bg-gradient-to-l from-transparent to-[#a3e635]/60 blur-[2px] rounded-full" />
        </div>
      </div>

      {/* 5. Trajectory Arc Curves (Subtle Dashed Trajectory Lines) */}
      <div className="absolute top-[20%] left-[15%] w-[450px] h-[250px] opacity-25">
        <svg className="w-full h-full text-lime-400" viewBox="0 0 450 250" fill="none">
          <path 
            d="M 10 220 Q 200 10 440 180" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeDasharray="6 6" 
            className="animate-dash-flow"
          />
        </svg>
      </div>

      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[280px] opacity-20">
        <svg className="w-full h-full text-purple-400" viewBox="0 0 500 280" fill="none">
          <path 
            d="M 20 50 Q 250 260 480 30" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeDasharray="8 6" 
            className="animate-dash-flow"
          />
        </svg>
      </div>

      {/* Floating Abstract Light Particles */}
      <div className="absolute top-[15%] left-[30%] w-2 h-2 rounded-full bg-[#ccff04]/60 blur-[1px] animate-particle-1" />
      <div className="absolute top-[45%] right-[35%] w-2.5 h-2.5 rounded-full bg-purple-400/60 blur-[1px] animate-particle-2" />
      <div className="absolute bottom-[25%] left-[40%] w-2 h-2 rounded-full bg-pink-400/50 blur-[1px] animate-particle-3" />

    </div>
  );
};
