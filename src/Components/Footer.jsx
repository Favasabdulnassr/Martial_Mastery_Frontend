import React from 'react';
import { 
  Sword, 
  Palette, 
  BarChart3, 
  Megaphone, 
  Building2, 
  Phone, 
  Briefcase, 
  Newspaper,
  Shield, 
  FileText, 
  Lock, 
  Cookie,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-black text-white py-16 relative overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-violet-500/10 opacity-20" />
      
      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent">
                Martial Mastery
              </h2>
            </div>
            <p className="text-zinc-400 text-sm mt-4 text-center md:text-left">
              Empowering martial artists through expert training and guidance since 2020.
            </p>
            {/* Social Media Icons */}
            <div className="flex justify-center md:justify-start space-x-4 pt-4">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-fuchsia-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-violet-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-4">
            <h6 className="text-lg font-semibold text-center md:text-left text-cyan-400">Services</h6>
            <ul className="space-y-3">
              <li>
                <a className="flex items-center justify-center md:justify-start space-x-2 text-zinc-400 hover:text-cyan-400 transition-colors group">
                  <Palette className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Training Programs</span>
                </a>
              </li>
              <li>
                <a className="flex items-center justify-center md:justify-start space-x-2 text-zinc-400 hover:text-fuchsia-400 transition-colors group">
                  <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Progress Tracking</span>
                </a>
              </li>
              <li>
                <a className="flex items-center justify-center md:justify-start space-x-2 text-zinc-400 hover:text-violet-400 transition-colors group">
                  <Megaphone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Live Sessions</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="space-y-4">
            <h6 className="text-lg font-semibold text-center md:text-left text-fuchsia-400">Company</h6>
            <ul className="space-y-3">
              <li>
                <a className="flex items-center justify-center md:justify-start space-x-2 text-zinc-400 hover:text-fuchsia-400 transition-colors group">
                  <Building2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>About us</span>
                </a>
              </li>
              <li>
                <a className="flex items-center justify-center md:justify-start space-x-2 text-zinc-400 hover:text-cyan-400 transition-colors group">
                  <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Contact</span>
                </a>
              </li>
              <li>
                <a className="flex items-center justify-center md:justify-start space-x-2 text-zinc-400 hover:text-violet-400 transition-colors group">
                  <Briefcase className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Careers</span>
                </a>
              </li>
              <li>
                <a className="flex items-center justify-center md:justify-start space-x-2 text-zinc-400 hover:text-fuchsia-400 transition-colors group">
                  <Newspaper className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Press kit</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="space-y-4">
            <h6 className="text-lg font-semibold text-center md:text-left text-violet-400">Legal</h6>
            <ul className="space-y-3">
              <li>
                <a className="flex items-center justify-center md:justify-start space-x-2 text-zinc-400 hover:text-violet-400 transition-colors group">
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Terms of use</span>
                </a>
              </li>
              <li>
                <a className="flex items-center justify-center md:justify-start space-x-2 text-zinc-400 hover:text-cyan-400 transition-colors group">
                  <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Privacy policy</span>
                </a>
              </li>
              <li>
                <a className="flex items-center justify-center md:justify-start space-x-2 text-zinc-400 hover:text-fuchsia-400 transition-colors group">
                  <Cookie className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Cookie policy</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-zinc-400">
          <p>© 2024 Martial Mastery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;