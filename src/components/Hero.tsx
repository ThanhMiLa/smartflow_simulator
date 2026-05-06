import { ArrowDown, Play, Network } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-40 pb-20 min-h-screen flex items-center overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#1a103c_0%,#030508_60%)] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center">
        {/* Content */}
        <div className="max-w-2xl z-10 w-full md:w-1/2">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-bold mb-6 tracking-widest border border-cyan-400/50 px-4 py-1.5 rounded-full bg-cyan-400/10 text-xs">
            <ZapIcon /> CTECH INNOVATION
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold uppercase leading-tight mb-6 text-white">
            Giải pháp <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-400">AI VÀ IOT CHO GIAO THÔNG THÔNG MINH</span>
          </h1>
          
          <p className="text-lg text-slate-400 mb-10 border-l-4 border-purple-600 pl-5">
            Hệ thống điều khiển tín hiệu thích ứng sử dụng AI Vision và IoT Edge. Giải pháp đột phá cho đô thị thông minh, giảm ùn tắc hiệu quả với chi phí tối thiểu.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-8">
            <a href="#simulator" className="flex items-center gap-2 px-8 py-4 bg-cyan-400 text-black font-black uppercase rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:bg-white transition-all">
              <Play size={18} fill="currentColor" /> Xem Demo
            </a>
            
            <a href="#core" className="flex items-center gap-2 text-white font-bold hover:text-cyan-400 transition-colors group">
              Tìm hiểu thêm 
              <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Visual / Abstract Art */}
        <div className="w-full md:w-1/2 flex justify-center mt-20 md:mt-0 relative hidden md:flex">
          <Network size={280} className="text-white/5 animate-pulse" strokeWidth={1} />
          <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-cyan-400 rounded-full blur-[40px] opacity-50"></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-purple-600 rounded-full blur-[50px] opacity-40"></div>
        </div>
      </div>
    </section>
  );
}

function ZapIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}
