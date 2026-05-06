import { ShieldAlert, Coins, TrendingUp, Smartphone } from 'lucide-react';

interface FeaturesProps {
  onOpenModal: (id: string) => void;
}

export function Features({ onOpenModal }: FeaturesProps) {
  return (
    <section id="features" className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <span className="text-cyan-400 text-sm tracking-[0.2em] uppercase font-bold">WHY CHOOSE US?</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">Tại Sao Chọn <span className="text-cyan-400">SMARTFLOW?</span></h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Chúng tôi mang đến giải pháp thực tế, tiết kiệm và hiệu quả tức thì.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Abstract Shield Visual */}
        <div className="w-full lg:w-[45%] h-[400px] md:h-[450px] bg-[#0b101a] border border-white/10 rounded-3xl relative flex justify-center items-center overflow-hidden shrink-0">
          <div className="absolute border border-purple-600 rounded-full animate-[ripple_4s_infinite_linear] opacity-100 border-[5px]" style={{ animationDelay: '0s' }}></div>
          <div className="absolute border border-purple-600 rounded-full animate-[ripple_4s_infinite_linear] opacity-100 border-[5px]" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute border border-purple-600 rounded-full animate-[ripple_4s_infinite_linear] opacity-100 border-[5px]" style={{ animationDelay: '3s' }}></div>
          <ShieldAlert size={100} className="text-white z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]" />
          
          <style>{`
            @keyframes ripple {
              0% { width: 0; height: 0; opacity: 1; border-width: 5px; }
              100% { width: 400px; height: 400px; opacity: 0; border-width: 0px; }
            }
          `}</style>
        </div>

        {/* Feature List */}
        <div className="w-full lg:w-[50%] flex flex-col gap-4">
          <div 
            onClick={() => onOpenModal('modal-cost')}
            className="flex gap-5 bg-white/5 p-5 rounded-2xl border border-transparent hover:border-cyan-400 hover:bg-cyan-400/5 hover:translate-x-2 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all cursor-pointer group"
          >
            <Coins size={36} className="text-cyan-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Chi Phí Cực Thấp</h3>
              <p className="text-sm text-slate-400 mb-3 leading-relaxed">Chỉ ~50 triệu VNĐ/nút giao. Rẻ hơn 10 lần so với hệ thống ITS nhập khẩu.</p>
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-wide group-hover:text-cyan-300">Xem chi tiết</span>
            </div>
          </div>

          <div 
            onClick={() => onOpenModal('modal-eff')}
            className="flex gap-5 bg-white/5 p-5 rounded-2xl border border-transparent hover:border-cyan-400 hover:bg-cyan-400/5 hover:translate-x-2 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all cursor-pointer group"
          >
            <TrendingUp size={36} className="text-cyan-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Hiệu Quả Đã Kiểm Chứng</h3>
              <p className="text-sm text-slate-400 mb-3 leading-relaxed">Giảm <strong>34.2%</strong> lượng xe tồn đọng vào giờ cao điểm. Đã thử nghiệm thực tế tại nút giao Nguyễn Vịnh – Trần Hữu Khác.</p>
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-wide group-hover:text-cyan-300">Xem chi tiết</span>
            </div>
          </div>

          <div 
            onClick={() => onOpenModal('modal-control')}
            className="flex gap-5 bg-white/5 p-5 rounded-2xl border border-transparent hover:border-cyan-400 hover:bg-cyan-400/5 hover:translate-x-2 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all cursor-pointer group"
          >
            <Smartphone size={36} className="text-cyan-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Điều Khiển Mọi Lúc</h3>
              <p className="text-sm text-slate-400 mb-3 leading-relaxed">Hệ thống Dashboard/App giúp CSGT giám sát và can thiệp thủ công từ xa khi cần thiết.</p>
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-wide group-hover:text-cyan-300">Xem chi tiết</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
