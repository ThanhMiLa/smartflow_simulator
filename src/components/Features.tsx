import { Coins, TrendingUp, Smartphone } from 'lucide-react';

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[auto]">
        
        {/* Row 1 / Col 1 & 2: Hiệu Quả Đã Kiểm Chứng */}
        <div 
          onClick={() => onOpenModal('modal-eff')}
          className="md:col-span-2 bg-gradient-to-br from-[#0b101a] to-blue-900/10 p-8 md:p-10 rounded-3xl border border-white/5 hover:border-cyan-400 hover:shadow-[0_10px_30px_rgba(0,240,255,0.15)] hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-center"
        >
          <div className="absolute right-0 bottom-0 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none">
            <TrendingUp size={240} />
          </div>
          <TrendingUp size={48} className="text-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
          <h3 className="text-3xl font-bold text-white mb-4 z-10">Hiệu Quả Đã Kiểm Chứng</h3>
          <p className="text-lg text-slate-400 max-w-lg z-10 mb-6">
            Giảm <strong className="text-cyan-400">34.2%</strong> lượng xe tồn đọng vào giờ cao điểm. Đã thử nghiệm thực tế tại nút giao Nguyễn Vịnh – Trần Hữu Khác.
          </p>
          <span className="text-cyan-400 text-sm font-bold uppercase tracking-widest group-hover:text-cyan-300 w-fit">Xem chi tiết &rarr;</span>
        </div>

        {/* Row 1 / Col 3: Chi Phí Cực Thấp */}
        <div 
          onClick={() => onOpenModal('modal-cost')}
          className="bg-gradient-to-bl from-[#0b101a] to-purple-900/10 p-8 md:p-10 rounded-3xl border border-white/5 hover:border-purple-400 hover:shadow-[0_10px_30px_rgba(168,85,247,0.15)] hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-center"
        >
          <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 group-hover:rotate-12 transition-all duration-500 pointer-events-none">
            <Coins size={160} />
          </div>
          <Coins size={48} className="text-purple-400 mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          <h3 className="text-2xl font-bold text-white mb-4 z-10">Chi Phí Cực Thấp</h3>
          <p className="text-slate-400 mb-6 z-10">Chỉ ~50 triệu VNĐ/nút giao. Rẻ hơn 10 lần so với hệ thống ITS nhập khẩu.</p>
          <span className="text-purple-400 text-sm font-bold uppercase tracking-widest group-hover:text-purple-300 w-fit mt-auto">Xem chi tiết &rarr;</span>
        </div>

        {/* Row 2 / Col 1-3: Điều Khiển Mọi Lúc */}
        <div 
          onClick={() => onOpenModal('modal-control')}
          className="md:col-span-3 bg-gradient-to-r from-[#0b101a] via-emerald-900/10 to-[#0b101a] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-emerald-400 hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-all cursor-pointer group relative flex flex-col md:flex-row items-center gap-10"
        >
          <div className="flex-1 z-10">
            <Smartphone size={48} className="text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            <h3 className="text-3xl font-bold text-white mb-4">Điều Khiển Mọi Lúc</h3>
            <p className="text-lg text-slate-400 max-w-2xl mb-6">Hệ thống Dashboard/App giúp CSGT giám sát trực quan và can thiệp thủ công từ xa khi cần thiết mà không cần thao tác tại tủ điện.</p>
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest group-hover:text-emerald-300">Xem chi tiết &rarr;</span>
          </div>
          
          <div className="hidden md:flex w-1/3 justify-center relative">
             <div className="absolute w-32 h-32 bg-emerald-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
             <div className="relative border-[4px] border-white/10 rounded-3xl w-28 h-56 bg-black flex flex-col p-2 overflow-hidden shadow-2xl group-hover:border-emerald-500/50 transition-colors">
               {/* Mock phone UI */}
               <div className="w-10 h-1 bg-white/20 mx-auto rounded-full mb-3"></div>
               <div className="flex-1 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                 <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin"></div>
               </div>
               <div className="mt-3 grid grid-cols-2 gap-2">
                 <div className="h-6 bg-white/10 rounded-md"></div>
                 <div className="h-6 bg-emerald-500/40 rounded-md"></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
