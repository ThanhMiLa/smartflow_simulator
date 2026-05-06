import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Công Nghệ', href: '#core' },
    { name: 'Ưu Điểm', href: '#features' },
    { name: 'Video', href: '#video' },
    { name: 'Mô Phỏng', href: '#simulator' },
    { name: 'Liên Hệ', href: '#team' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#030508]/90 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400 blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
            <img src="/image/logo.jpg" alt="CTech Logo" className="h-12 w-12 rounded-xl border border-white/10 relative z-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-wider text-white">SMART<span className="text-cyan-400">FLOW</span></span>
            <span className="text-[0.65rem] text-slate-400 tracking-[0.2em]">POWERED BY CTECH</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-bold text-slate-400 hover:text-cyan-400 uppercase tracking-wide transition-colors">
              {link.name}
            </a>
          ))}
          <a href="#simulator" className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-full hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all uppercase tracking-wide">
            Xem Demo
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#030508]/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-6 md:hidden">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-slate-300 hover:text-cyan-400 uppercase tracking-wide">
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
