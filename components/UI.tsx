import React, { useState, useRef, useEffect } from 'react';

interface UIProps {
  isFormed: boolean;
  toggleFormed: () => void;
}

export const UI: React.FC<UIProps> = ({ isFormed, toggleFormed }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Background Music: "All I Want For Christmas Is You" style (Upbeat Holiday Pop)
  const MUSIC_URL = "https://cdn.pixabay.com/download/audio/2023/11/29/audio_6c99c27702.mp3?filename=christmas-pop-178875.mp3";

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.volume = 0.5; // Pop music volume
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleMainAction = () => {
    // 1. Trigger the tree animation
    toggleFormed();

    // 2. If this is the first interaction and music isn't playing, start it
    if (!hasInteracted && !isPlaying && audioRef.current) {
      audioRef.current.volume = 0.5; 
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => console.error("Auto-play blocked:", e));
      setHasInteracted(true);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-8 z-10">
      
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={MUSIC_URL} loop />

      {/* Header */}
      <header className="flex justify-center mt-4 pointer-events-auto">
        <div className="text-center">
          <h1 className="font-serif text-4xl md:text-6xl text-[#D4AF37] tracking-wider uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            Grand Holiday
          </h1>
          <p className="font-sans text-[#E5E4E2] text-sm md:text-lg tracking-[0.3em] mt-2 opacity-80">
            INTERACTIVE EXPERIENCE
          </p>
        </div>
      </header>

      {/* Main Controls */}
      <div className="flex justify-center mb-12 pointer-events-auto flex-col items-center gap-6">
        <button
          onClick={handleMainAction}
          className={`
            group relative px-12 py-4 bg-black/40 backdrop-blur-md border border-[#D4AF37] 
            text-[#D4AF37] font-serif text-xl tracking-widest uppercase transition-all duration-500
            hover:bg-[#D4AF37] hover:text-black overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.2)]
          `}
        >
          <span className="relative z-10">
            {isFormed ? "Release Chaos" : "Assemble Tree"}
          </span>
          
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
        </button>

        <p className="text-[#D4AF37]/60 text-xs tracking-widest uppercase font-sans">
          {isPlaying ? "Music Playing: All I Want For Xmas" : "Tap above to start experience"}
        </p>
      </div>
      
      {/* Music Toggle (Bottom Right) */}
      <div className="absolute bottom-8 right-8 pointer-events-auto">
        <button 
          onClick={toggleMusic}
          className="w-12 h-12 rounded-full border border-[#D4AF37]/30 bg-black/40 backdrop-blur-md flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
          title="Toggle Music"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Decorative Corners */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37]/50" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#D4AF37]/50" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#D4AF37]/50" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37]/50 pointer-events-none" />

    </div>
  );
};