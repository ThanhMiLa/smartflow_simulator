import { Circle } from 'lucide-react';

export function VideoDemo() {
  return (
    <section id="video" className="py-24 bg-gradient-to-b from-[#030508] to-[#080c14]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-cyan-400 text-sm tracking-[0.2em] uppercase font-bold">REAL-TIME FOOTAGE</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">Video Thực Tế</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Hình ảnh ghi lại quá trình vận hành của hệ thống SmartFlow.</p>
        </div>

        <div className="relative w-full max-w-[400px] mx-auto rounded-3xl p-3 bg-gradient-to-br from-white/5 to-black/50 border border-cyan-400/30 shadow-[0_0_40px_rgba(0,240,255,0.1)]">
          {/* Decorative dashed border behind */}
          <div className="absolute -inset-2 border border-dashed border-cyan-400/30 rounded-[28px] -z-10 opacity-30"></div>
          
          <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden border-2 border-black bg-black">
            <div className="absolute top-4 left-4 bg-black/60 text-rose-500 px-3 py-1.5 rounded-md text-xs font-bold border border-rose-500 z-10 flex items-center gap-2 animate-pulse">
              <Circle size={8} fill="currentColor" /> REC
            </div>
            
            <iframe 
              src="/video/video_1.mp4"
              title="SmartFlow Demo" 
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
