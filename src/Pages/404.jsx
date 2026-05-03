import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mb-8 inline-block"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-2xl animate-ping"></div>
            <div className="relative bg-[#0a0a1a] p-6 rounded-full border border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              <Ghost size={64} className="text-cyan-400" />
            </div>
          </div>
        </motion.div>

        {/* 404 Glitch Text */}
        <div className="mb-6 relative inline-block">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 relative z-10"
          >
            404
          </motion.h1>
          <h1 className="text-8xl md:text-9xl font-black text-cyan-500/20 absolute top-0 left-0 -translate-x-1 translate-y-1 z-0 animate-pulse">
            404
          </h1>
          <h1 className="text-8xl md:text-9xl font-black text-emerald-500/20 absolute top-0 left-0 translate-x-1 -translate-y-1 z-0 animate-pulse delay-75">
            404
          </h1>
        </div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Lost in Cyberspace?
          </h2>
          <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
            Halaman yang Anda cari telah menghilang ke dalam void atau tidak pernah ada di semesta ini.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-8 py-3 bg-white/5 backdrop-blur-xl text-white rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-xl"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-xl hover:from-cyan-500 hover:to-emerald-500 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
          >
            <Home size={20} className="group-hover:scale-110 transition-transform" />
            Ke Beranda
          </button>
        </motion.div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none"></div>
    </div>
  );
}