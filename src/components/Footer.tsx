import { MapPin, Phone, Mail, FileText, UserCircle, Users } from 'lucide-react';

export function Footer() {
  return (
    <footer id="team" className="pt-24 pb-8 bg-[#020305] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap gap-12 justify-between mb-16">
          {/* Brand Info */}
          <div className="flex-1 min-w-[300px]">
            <a href="#" className="flex items-center gap-3 mb-6">
              <img src="/image/logo.jpg" alt="Logo" className="h-10 rounded-md" />
              <span className="text-xl font-black text-white tracking-widest">SMARTFLOW</span>
            </a>
            <p className="text-slate-400 leading-relaxed mb-6">
              Dự án đạt giải Khoa học Kỹ thuật cấp Trường (2025-2026).<br/>
              Giải pháp tiên phong cho hạ tầng giao thông thông minh bền vững.<br/>
              Đã được các cơ quan chức năng cấp phép thử nghiệm tại nút giao Nguyễn Vịnh - Trần Hữu Khác, xã Quảng Điền, Tp Huế.
            </p>
            <div className="flex flex-col gap-3">
              <a href="/pdf/phieu_xac_nhan_1.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-rose-500 text-rose-500 rounded-md font-bold text-sm hover:bg-rose-500 hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all w-fit">
                <FileText size={16} /> Xem Phiếu Xác Nhận 1
              </a>
              <a href="/pdf/phieu_xac_nhan_2.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-rose-500 text-rose-500 rounded-md font-bold text-sm hover:bg-rose-500 hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all w-fit">
                <FileText size={16} /> Xem Phiếu Xác Nhận 2
              </a>
            </div>
          </div>

          {/* Team Info */}
          <div className="flex-1 min-w-[250px]">
            <h4 className="text-white font-bold tracking-widest uppercase mb-6 text-sm">NHÓM TÁC GIẢ</h4>
            <ul className="flex flex-col gap-3">
              <li className="text-slate-400 flex items-center gap-3"><UserCircle size={18} className="text-cyan-400" /> Đinh Xuân Trường (12/3)</li>
              <li className="text-slate-400 flex items-center gap-3"><UserCircle size={18} className="text-cyan-400" /> Nguyễn Nhất Nguyên (12/3)</li>
              <li className="text-slate-400 flex items-center gap-3"><UserCircle size={18} className="text-cyan-400" /> Lê Văn Quốc Hùng (12/8)</li>
              <li className="text-slate-400 flex items-center gap-3"><UserCircle size={18} className="text-cyan-400" /> Lê Quang Thành (11/3)</li>
              <li className="text-slate-400 flex items-center gap-3"><UserCircle size={18} className="text-cyan-400" /> Phạm Bảo Minh Hân (10/8)</li>
              <li className="text-purple-400 flex items-center gap-3 mt-2 font-semibold"><Users size={18} /> GVHD: ThS. Nguyễn Thị Lan Anh</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex-1 min-w-[250px]">
            <h4 className="text-white font-bold tracking-widest uppercase mb-6 text-sm">THÔNG TIN LIÊN HỆ</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-cyan-400 shrink-0" />
                <span className="text-slate-400">11 Đống Đa, TP. Huế</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-cyan-400 shrink-0" />
                <a href="tel:0813514789" className="text-slate-400 hover:text-white transition-colors">0813514789 (Hotline)</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-cyan-400 shrink-0" />
                <a href="mailto:xuantruong.dinh2020@gmail.com" className="text-slate-400 hover:text-white transition-colors">xuantruong.dinh2020@gmail.com</a>
              </li>
              <li className="mt-4">
                <a href="https://www.facebook.com/share/1717sfXPjS/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-[#1877F2]/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  Fanpage Chính Thức
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-white/5 text-sm text-slate-500">
          &copy; 2026 CTech Innovation Team. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
