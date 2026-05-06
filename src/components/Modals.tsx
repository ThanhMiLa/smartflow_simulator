import { X } from 'lucide-react';

interface ModalsProps {
  activeModal: string | null;
  onClose: () => void;
}

export function Modals({ activeModal, onClose }: ModalsProps) {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0e141f] border border-cyan-400/50 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] p-8 md:p-10 animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 transition-colors"
        >
          <X size={32} />
        </button>

        {activeModal === 'modal-yolo' && <ModalYolo />}
        {activeModal === 'modal-rhodes' && <ModalRhodes />}
        {activeModal === 'modal-iot' && <ModalIot />}
        {activeModal === 'modal-cost' && <ModalCost />}
        {activeModal === 'modal-eff' && <ModalEff />}
        {activeModal === 'modal-control' && <ModalControl />}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MODAL CONTENTS
// ----------------------------------------------------------------------

function ModalYolo() {
  return (
    <>
      <h3 className="text-3xl font-black text-cyan-400 mb-6 pb-6 border-b border-white/10">YOLOv8 Vision (Chi Tiết)</h3>
      <div className="text-slate-300 text-lg leading-relaxed space-y-6">
        <p>Hệ thống điều khiển đèn giao thông tự thích ứng sử dụng camera giám sát kết hợp mô hình <strong className="text-white">YOLOv8 (Deep CNN)</strong> cài đặt trên server để phát hiện, phân loại, theo dõi và đếm các đối tượng giao thông theo thời gian thực.</p>
        <p>YOLO nhận dạng phương tiện (xe máy, ô tô, xe tải, xe đạp…) và người đi bộ, đồng thời xác định luồng xe theo từng hướng, đếm số lượng và ước tính thời gian chờ. Các thông tin này được đưa vào thuật toán tối ưu để tính toán thời gian đèn phù hợp cho pha tiếp theo.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <ImageCard src="/image/yolo_diagram_1.jpg" caption="Phát hiện đối tượng" />
          <ImageCard src="/image/yolo_diagram_2.jpg" caption="Phân loại phương tiện" />
          <ImageCard src="/image/yolo_diagram_3.jpg" caption="Đếm xe theo làn" />
        </div>

        <p>Nhờ cơ chế điều chỉnh liên tục theo lưu lượng thực tế, hệ thống giúp <strong className="text-white">giảm ùn tắc</strong> và <strong className="text-white">tăng hiệu quả vận hành</strong> tại giao lộ.</p>
      </div>
    </>
  );
}

function ModalRhodes() {
  return (
    <>
      <h3 className="text-3xl font-black text-cyan-400 mb-6 pb-6 border-b border-white/10">RHODES Logic</h3>
      <div className="text-slate-300 text-lg leading-relaxed space-y-6">
        <p>Quy trình hoạt động tham khảo theo <strong className="text-white">RHODES</strong> gồm 5 bước:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>(1) Thu thập và chuẩn hóa dữ liệu từ camera/mô phỏng để tạo thông tin lưu lượng theo hướng, mật độ và tốc độ dòng xe.</li>
          <li>(2) Xác định đầu vào–đầu ra, trong đó đầu vào là số xe từng hướng và thời gian chờ trung bình.</li>
          <li>(3) Tính toán thời gian xanh tối ưu (GTnext) dựa trên công thức tuyến tính có chặn.</li>
          <li>(4) Điều khiển pha đèn tín hiệu thông qua vi điều khiển.</li>
          <li>(5) Cập nhật trạng thái thực tế.</li>
        </ul>

        <div className="flex justify-center my-8">
          <div className="w-full max-w-2xl">
            <ImageCard src="/image/rhodes_diagram_1.jpg" caption="Sơ đồ thuật toán điều khiển đèn thích ứng" />
          </div>
        </div>
      </div>
    </>
  );
}

function ModalIot() {
  return (
    <>
      <h3 className="text-3xl font-black text-cyan-400 mb-6 pb-6 border-b border-white/10">Hệ thống điều khiển IoT (ESP32)</h3>
      <div className="text-slate-300 text-lg leading-relaxed space-y-6">
        <p>Khối điều khiển trung tâm sử dụng <strong className="text-white">ESP32</strong> đóng vai trò là Gateway IoT và bộ xử lý tại biên. ESP32 nhận dữ liệu từ Server, tính toán logic an toàn (Fail-safe) và điều khiển trực tiếp các Relay đóng ngắt đèn. Đảm bảo hệ thống hoạt động ổn định và có thể giám sát từ xa thông qua giao diện Web/App.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <ImageCard src="/image/iot_diagram_1.jpg" caption="Sơ đồ phần cứng" />
          <ImageCard src="/image/iot_diagram_2.jpg" caption="Kết nối Relay" />
        </div>

        <p><strong className="text-white">Giao diện điều khiển trên điện thoại:</strong></p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 max-w-lg mx-auto">
          <ImageCard src="/image/iot_diagram_3.jpg" caption="Dashboard Giám Sát" className="aspect-[9/19]" />
          <ImageCard src="/image/iot_diagram_4.jpg" caption="Điều khiển thủ công" className="aspect-[9/19]" />
        </div>
      </div>
    </>
  );
}

function ModalCost() {
  return (
    <>
      <h3 className="text-3xl font-black text-cyan-400 mb-6 pb-6 border-b border-white/10">Tối Ưu Hóa Chi Phí Đầu Tư</h3>
      <div className="text-slate-300 text-lg leading-relaxed space-y-6">
        <p>Giải pháp <strong className="text-white">SMARTFLOW</strong> được nghiên cứu để giải quyết bài toán kinh tế trong việc hiện đại hóa cơ sở hạ tầng giao thông. Thay vì phải đầu tư thay thế toàn bộ hệ thống đắt tiền, giải pháp của chúng tôi tập trung vào việc nâng cấp thông minh:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Tận dụng hạ tầng tủ điều khiển tín hiệu hiện có.</li>
          <li>Sử dụng công nghệ Camera AI thay thế cho việc đào đường lắp cảm biến từ (vòng từ) tốn kém và phức tạp.</li>
          <li>Phần cứng dựa trên vi điều khiển ESP32 hiệu năng cao với chi phí hợp lý.</li>
        </ul>
        <div className="flex justify-center my-8">
          <div className="w-full max-w-lg">
            <ImageCard src="/image/cost_1.jpg" caption="Bảng so sánh chi phí triển khai" className="aspect-[2/3]" />
          </div>
        </div>
      </div>
    </>
  );
}

function ModalEff() {
  return (
    <>
      <h3 className="text-3xl font-black text-cyan-400 mb-6 pb-6 border-b border-white/10">Kết Quả Thực Nghiệm</h3>
      <div className="text-slate-300 text-lg leading-relaxed space-y-6">
        <p>Dự án đã tiến hành thu thập dữ liệu và thử nghiệm mô hình tại nút giao <strong className="text-white">Nguyễn Vịnh – Trần Hữu Khác (TP. Huế)</strong>. Các số liệu đo đạc thực tế cho thấy sự cải thiện đáng kể trong khả năng giải phóng dòng xe:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Giảm thiểu lượng xe tồn đọng vào giờ cao điểm lên đến <strong className="text-white">34.2%</strong> so với chu kỳ đèn cố định.</li>
          <li>Hệ thống phản ứng linh hoạt với các thay đổi lưu lượng đột ngột.</li>
        </ul>
        <p>Dưới đây là hình ảnh và dữ liệu ghi nhận từ quá trình nghiên cứu:</p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 my-8">
          <ImageCard src="/image/eff_1.jpg" className="aspect-square" />
          <ImageCard src="/image/eff_2.jpg" className="aspect-square" />
          <ImageCard src="/image/eff_3.jpg" className="aspect-square" />
          <ImageCard src="/image/eff_4.jpg" className="aspect-square" />
          <ImageCard src="/image/eff_5.jpg" className="aspect-square" />
          <ImageCard src="/image/eff_6.jpg" className="aspect-square" />
          <ImageCard src="/image/eff_7.jpg" className="aspect-square" />
          <ImageCard src="/image/eff_8.jpg" className="aspect-square" />
          <ImageCard src="/image/eff_9.jpg" className="aspect-square" />
          <ImageCard src="/image/eff_10.jpg" className="aspect-square" />
        </div>
      </div>
    </>
  );
}

function ModalControl() {
  return (
    <>
      <h3 className="text-3xl font-black text-cyan-400 mb-6 pb-6 border-b border-white/10">Quản Lý & Giám Sát Từ Xa</h3>
      <div className="text-slate-300 text-lg leading-relaxed space-y-6">
        <p>Ứng dụng <strong className="text-white">SMARTFLOW</strong> mang đến công cụ hỗ trợ đắc lực cho lực lượng Cảnh sát giao thông và đơn vị vận hành. Hệ thống không chỉ tự động hóa mà còn cho phép sự can thiệp của con người khi cần thiết:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Giám sát trạng thái hoạt động của đèn tín hiệu theo thời gian thực.</li>
          <li>Hỗ trợ chuyển đổi chế độ điều khiển thủ công (Manual) từ xa để phục vụ các đoàn xe ưu tiên hoặc xử lý sự cố khẩn cấp mà không cần thao tác trực tiếp tại tủ điện.</li>
        </ul>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <ImageCard src="/image/control_1.jpg" caption="Giao diện đăng nhập & Giám sát" />
          <ImageCard src="/image/control_2.jpg" caption="Giao diện điều khiển thủ công" />
        </div>
      </div>
    </>
  );
}

// ----------------------------------------------------------------------
// HELPER COMPONENT
// ----------------------------------------------------------------------
function ImageCard({ src, caption, className = "aspect-video" }: { src: string, caption?: string, className?: string }) {
  return (
    <div className={`w-full overflow-hidden rounded-xl border-2 border-white/10 bg-black hover:border-cyan-400 hover:scale-105 transition-all flex flex-col group ${className}`}>
      <img src={src} alt={caption || 'Image'} className="w-full h-full object-cover flex-1" />
      {caption && (
        <div className="text-center text-xs text-slate-400 p-2 bg-[#111] italic whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-cyan-400 transition-colors">
          {caption}
        </div>
      )}
    </div>
  );
}
