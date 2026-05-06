import { Eye, Brain, Wifi } from 'lucide-react';

interface CoreTechProps {
  onOpenModal: (id: string) => void;
}

export function CoreTech({ onOpenModal }: CoreTechProps) {
  return (
    <section id="core" className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <span className="text-cyan-400 text-sm tracking-[0.2em] uppercase font-bold">CORE TECHNOLOGY</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">Công Nghệ Lõi</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Bấm vào từng mục để xem chi tiết quy trình hoạt động.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* YOLO Card */}
        <div 
          onClick={() => onOpenModal('modal-yolo')}
          className="bg-[#0b101a] p-8 rounded-2xl border border-white/5 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-cyan-400 transition-all cursor-pointer group"
        >
          <div className="mb-6 inline-block">
            <Eye size={48} className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-600" style={{ stroke: 'url(#cyan-purple)' }} />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-white">YOLOv8 Vision</h3>
          <p className="text-slate-400 leading-relaxed mb-6">
            Mắt thần AI xử lý hình ảnh thời gian thực, đếm chính xác số lượng xe và phân loại phương tiện bất kể ngày đêm.
          </p>
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-wide group-hover:text-cyan-300">Xem chi tiết</span>
        </div>

        {/* RHODES Card */}
        <div 
          onClick={() => onOpenModal('modal-rhodes')}
          className="bg-[#0b101a] p-8 rounded-2xl border border-white/5 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-cyan-400 transition-all cursor-pointer group"
        >
          <div className="mb-6 inline-block">
            <Brain size={48} className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-600" style={{ stroke: 'url(#cyan-purple)' }} />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-white">RHODES Logic</h3>
          <p className="text-slate-400 leading-relaxed mb-6">
            Thuật toán tối ưu hóa phân tán. Tự động tính toán thời gian xanh dựa trên mật độ xe thực tế.
          </p>
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-wide group-hover:text-cyan-300">Xem chi tiết</span>
        </div>

        {/* IoT Card */}
        <div 
          onClick={() => onOpenModal('modal-iot')}
          className="bg-[#0b101a] p-8 rounded-2xl border border-white/5 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-cyan-400 transition-all cursor-pointer group"
        >
          <div className="mb-6 inline-block">
            <Wifi size={48} className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-600" style={{ stroke: 'url(#cyan-purple)' }} />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-white">IoT Edge Control</h3>
          <p className="text-slate-400 leading-relaxed mb-6">
            Vi điều khiển ESP32 xử lý tại biên, đảm bảo hoạt động an toàn (Fail-safe) khi mất kết nối.
          </p>
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-wide group-hover:text-cyan-300">Xem chi tiết</span>
        </div>
      </div>

      {/* SVG Gradient Def for Lucide Icons */}
      <svg width="0" height="0" className="absolute">
        <linearGradient id="cyan-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#00f0ff" offset="0%" />
          <stop stopColor="#7000ff" offset="100%" />
        </linearGradient>
      </svg>
    </section>
  );
}
