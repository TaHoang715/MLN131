import confetti from "canvas-confetti";
import { sound } from "./audio/SoundEngine";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id, Doc } from "../convex/_generated/dataModel";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  MonitorPlay,
  Users,
  LogIn,
  ScrollText,
  X,
  Trophy,
  PlusCircle,
  Crown,
  Check,
  LogOut,
  Timer,
  Send,
  Copy,
  Zap,
  Maximize2,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Flame,
  GraduationCap,
  Volume2,
  VolumeX,
  Eye
} from "lucide-react";

import { SCENARIOS } from "./gameData";

const calculateQuickScore = (remainingMs: number) => {
  return Math.max(100, Math.floor(remainingMs / 10));
};

function sortPlayersByScore(players: Doc<"mlnPlayers">[]) {
  return [...players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

const OPTION_THEMES: Record<string, { bg: string; border: string; badge: string; hover: string; active: string }> = {
  A: {
    bg: "bg-sky-950/40",
    border: "border-sky-500/40",
    badge: "bg-sky-500 text-slate-950",
    hover: "hover:bg-sky-900/50 hover:border-sky-400",
    active: "bg-sky-600 border-sky-400 text-white"
  },
  B: {
    bg: "bg-emerald-950/40",
    border: "border-emerald-500/40",
    badge: "bg-emerald-500 text-slate-950",
    hover: "hover:bg-emerald-900/50 hover:border-emerald-400",
    active: "bg-emerald-600 border-emerald-400 text-white"
  },
  C: {
    bg: "bg-amber-950/40",
    border: "border-amber-500/40",
    badge: "bg-amber-500 text-slate-950",
    hover: "hover:bg-amber-900/50 hover:border-amber-400",
    active: "bg-amber-600 border-amber-400 text-white"
  },
  D: {
    bg: "bg-purple-950/40",
    border: "border-purple-500/40",
    badge: "bg-purple-500 text-slate-950",
    hover: "hover:bg-purple-900/50 hover:border-purple-400",
    active: "bg-purple-600 border-purple-400 text-white"
  }
};

// ============================================================
// IMAGE ZOOM MODAL
// ============================================================
function ImageZoomModal({ imageUrl, onClose }: { imageUrl: string | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[120] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-slate-300 hover:text-white bg-slate-800/80 p-2.5 rounded-full transition-colors border border-slate-700"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={imageUrl}
              alt="Gợi ý phóng to"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border-2 border-amber-500/40 shadow-2xl"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// RULES MODAL
// ============================================================
function RulesModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-amber-500/40 text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-950 border-b border-slate-800 p-5 md:p-6 flex justify-between items-center shrink-0">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 tracking-tight text-amber-400 font-headline">
                <ScrollText className="w-6 h-6 text-amber-400" /> Thể Lệ Đấu Trường Tri Thức MLN131
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-300 custom-scrollbar">
              <div className="bg-amber-500/10 border-l-4 border-amber-500 p-5 rounded-r-2xl">
                <p className="text-amber-200 leading-relaxed italic text-base md:text-lg font-medium">
                  "Hệ thống câu hỏi chuyên sâu về Dân chủ Xã hội Chủ nghĩa & Nhà nước Xã hội Chủ nghĩa - Môn Chủ nghĩa Xã hội Khoa học."
                </p>
              </div>

              <section>
                <h3 className="font-bold text-lg md:text-xl text-white mb-3 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" /> 2 Thể Thức Vòng Đấu (Tổng {SCENARIOS.length} Vòng)
                </h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="font-bold text-sky-400 flex items-center gap-2 mb-1">
                      <HelpCircle className="w-5 h-5" /> 1. Trắc Nghiệm Phản Xạ Nhanh (A, B, C, D)
                    </div>
                    <p className="text-sm text-slate-400">
                      Đọc câu hỏi lý luận và bấm chọn phương án chuẩn xác nhất. Thời gian nộp bài càng sớm điểm số cộng càng cao!
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="font-bold text-amber-400 flex items-center gap-2 mb-1">
                      <ImageIcon className="w-5 h-5" /> 2. Đuổi Hình Bắt Chữ & Từ Khóa Học Thuật
                    </div>
                    <p className="text-sm text-slate-400">
                      Quan sát hình ảnh minh họa nghệ thuật, gợi ý số lượng tiếng và các ô chữ được lật mở dần theo thời gian. Có thể gõ thử liên tục đến khi đúng!
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-bold text-lg md:text-xl text-white mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" /> Cách Tính Điểm Tốc Độ
                </h3>
                <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/20 text-center">
                  <div className="text-2xl font-mono font-bold text-amber-400 mb-1">Tối đa ~6000 Điểm / Vòng</div>
                  <p className="text-sm text-slate-400">Điểm = (Mili-giây còn lại trên đồng hồ / 10). Phản xạ càng chớp nhoáng, thứ hạng càng bứt phá!</p>
                </div>
              </section>
            </div>

            <div className="p-5 border-t border-slate-800 bg-slate-950 flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white px-8 py-3 rounded-xl font-bold text-base transition-all shadow-lg active:scale-95"
              >
                Đã Rõ, Sẵn Sàng!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// LOBBY VIEW
// ============================================================
function LobbyView({
  onCreateRoom,
  onJoinRoom,
  error,
  loading,
}: {
  onCreateRoom: (name: string, password?: string) => void;
  onJoinRoom: (code: string, name: string) => void;
  error: string | null;
  loading: boolean;
}) {
  const [hostName, setHostName] = useState("");
  const [hostPassword, setHostPassword] = useState("");
  const [joinCode, setJoinCode] = useState(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code") || searchParams.get("room") || "";
      return code.replace(/\D/g, "").slice(0, 5);
    } catch {
      return "";
    }
  });
  const [joinName, setJoinName] = useState("");

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl w-full px-4 flex-grow flex flex-col justify-center pb-12"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-amber-400 font-bold text-sm mb-4">
          <GraduationCap className="w-4 h-4 text-red-400" /> MLN131 · CHỦ NGHĨA XÃ HỘI KHOA HỌC
        </div>
        <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight uppercase leading-tight">
          ĐẤU TRƯỜNG <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-500">TRI THỨC</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Chủ đề: <span className="text-amber-300 font-semibold">Dân chủ Xã hội Chủ nghĩa & Nhà nước Xã hội Chủ nghĩa</span>. Tranh tài trực tiếp cùng tập thể lớp!
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto mb-6 bg-red-500/20 border border-red-500/50 text-red-300 px-5 py-3 rounded-2xl text-center font-medium text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
        {/* Host card */}
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group hover:border-red-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none" />
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl mb-5 text-red-400 group-hover:scale-110 transition-transform">
            <MonitorPlay className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white font-headline">Quản Trò / Giảng Viên</h2>
          <p className="text-slate-400 mb-6 text-sm leading-relaxed">
            Khởi tạo phòng đấu, trình chiếu bảng câu hỏi và bảng xếp hạng trực tiếp trên máy chiếu lớp học.
          </p>
          <div className="mt-auto w-full space-y-3.5">
            <input
              type="text"
              placeholder="Tên người dẫn trò"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 focus:border-red-500 text-white py-3.5 px-4 rounded-xl font-medium focus:outline-none text-center text-base"
            />
            <input
              type="password"
              placeholder="Nhập mật khẩu quản trò"
              value={hostPassword}
              onChange={(e) => setHostPassword(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 focus:border-red-500 text-white py-3.5 px-4 rounded-xl font-medium focus:outline-none text-center text-base"
            />
            <button
              onClick={() => onCreateRoom(hostName.trim(), hostPassword)}
              disabled={!hostName.trim() || !hostPassword.trim() || loading}
              className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white py-3.5 rounded-xl font-bold text-base transition-all flex justify-center items-center gap-2 shadow-lg shadow-red-950/50 disabled:opacity-50 active:scale-98"
            >
              <PlusCircle className="w-5 h-5" />
              {loading ? "Đang tạo phòng..." : "Tạo Phòng Mới"}
            </button>
          </div>
        </div>

        {/* Player card */}
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl mb-5 text-amber-400 group-hover:scale-110 transition-transform">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white font-headline">Sinh Viên Tham Gia</h2>
          <p className="text-slate-400 mb-6 text-sm leading-relaxed">
            Nhập mã phòng từ màn hình chiếu hoặc quét mã QR để bắt đầu tranh tài trả lời câu hỏi.
          </p>
          <div className="w-full flex flex-col gap-3.5 mt-auto">
            <input
              type="text"
              placeholder="MÃ PHÒNG (5 SỐ)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-500 text-amber-400 py-3.5 px-4 rounded-xl font-mono font-bold text-center text-xl tracking-[0.2em] uppercase focus:outline-none"
            />
            <input
              type="text"
              placeholder="Họ và tên của bạn"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-500 text-white py-3.5 px-4 rounded-xl font-medium focus:outline-none text-center text-base"
            />
            <button
              onClick={() => onJoinRoom(joinCode.trim(), joinName.trim())}
              disabled={!joinCode.trim() || !joinName.trim() || loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 py-3.5 rounded-xl font-bold text-base transition-all flex justify-center items-center gap-2 shadow-lg shadow-amber-950/50 disabled:opacity-50 active:scale-98"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Đang kết nối..." : "Vào Thi Ngay"}
            </button>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

// ============================================================
// WAITING ROOM VIEW
// ============================================================
function WaitingRoom({
  room,
  players,
  isHost,
  onStart,
  onLeave,
  musicEnabled,
  onToggleMusic,
}: {
  room: Doc<"mlnRooms">;
  players: Doc<"mlnPlayers">[];
  isHost: boolean;
  onStart: () => void;
  onLeave: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showLargeQr, setShowLargeQr] = useState(false);

  const nonHostPlayers = players.filter((p) => !p.isHost);
  const canStart = nonHostPlayers.length > 0;

  const copyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinLink = `${window.location.origin}${window.location.pathname}?code=${room.code}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(joinLink)}`;

  const copyLink = () => {
    sound.playClick();
    navigator.clipboard.writeText(joinLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full px-4 mx-auto">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100">
        <div className="text-center mb-6">
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white mb-2">Phòng Chờ Đấu Trường</h2>
          <p className="text-slate-400 text-sm">Mời các bạn cùng quét mã hoặc nhập mã số phòng bên dưới</p>
        </div>

        {/* Room Code & Audio controls */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-slate-950 border-2 border-amber-500/40 rounded-2xl px-6 sm:px-8 py-3.5 shadow-inner">
            <span className="font-mono text-3xl sm:text-4xl font-black text-amber-400 tracking-[0.3em]">{room.code}</span>
          </div>
          <button
            onClick={copyCode}
            title="Sao chép mã phòng"
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
          >
            {copied ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6" />}
          </button>
          <button
            onClick={onToggleMusic}
            title={musicEnabled ? "Tắt nhạc nền" : "Bật nhạc nền"}
            className={`p-3.5 rounded-2xl transition-all border ${
              musicEnabled
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
            }`}
          >
            {musicEnabled ? <Volume2 className="w-6 h-6 animate-pulse" /> : <VolumeX className="w-6 h-6" />}
          </button>
        </div>

        {/* QR Section */}
        {isHost && (
          <div className="flex flex-col items-center bg-slate-950/80 border border-slate-800 rounded-2xl p-5 mb-6 max-w-xs mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quét mã QR bằng điện thoại:</p>
            <div
              className="relative group bg-white p-3 rounded-2xl border border-slate-700 shadow-md cursor-pointer overflow-hidden"
              onClick={() => { sound.playClick(); setShowLargeQr(true); }}
            >
              <img src={qrUrl} alt="Join QR Code" className="w-40 h-40 object-contain" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1">
                <Maximize2 className="w-5 h-5 text-amber-400" />
                <span>Phóng to màn hình</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 w-full justify-center">
              <button
                onClick={() => { sound.playClick(); setShowLargeQr(true); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Phóng to QR
              </button>
              <button
                onClick={copyLink}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 min-w-[100px] justify-center"
              >
                {linkCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Chép link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Player List */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3 text-xs uppercase tracking-widest text-slate-400 font-bold">
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-amber-400" /> Danh sách thí sinh ({players.length})</span>
            <span className="text-amber-400 font-mono">{nonHostPlayers.length} người chơi</span>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
            {players.map((p) => (
              <div key={p._id} className="flex items-center gap-3 bg-slate-950/70 border border-slate-800/80 px-4 py-3 rounded-xl">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${p.isHost ? "bg-red-600 text-white" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`}>
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-slate-200 flex-1 truncate text-sm sm:text-base">{p.name}</span>
                {p.isHost && (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full shrink-0">
                    <Crown className="w-3 h-3" /> Chủ phòng
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {isHost ? (
            <button
              onClick={() => { sound.playClick(); onStart(); }}
              disabled={!canStart}
              className="w-full bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 shadow-xl disabled:opacity-40 transition-all active:scale-98"
            >
              <Zap className="w-6 h-6 text-amber-300" /> BẮT ĐẦU ĐẤU TRƯỜNG ({SCENARIOS.length} VÒNG)
            </button>
          ) : (
            <div className="text-center py-3 text-slate-400 text-sm font-medium animate-pulse">
              ⏳ Đang chờ Quản trò nhấn nút bắt đầu...
            </div>
          )}
          <button
            onClick={() => { sound.playClick(); onLeave(); }}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 flex justify-center items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Rời phòng
          </button>
        </div>
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showLargeQr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-4"
            onClick={() => setShowLargeQr(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-amber-500/40 shadow-2xl flex flex-col items-center relative text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLargeQr(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="font-headline text-2xl font-bold text-center text-amber-400 mb-2">
                Quét Mã QR Tham Gia
              </h3>
              <p className="text-xs text-slate-300 text-center mb-6">
                Mở camera trên điện thoại quét trực tiếp để kết nối vào phòng thi
              </p>

              <div className="bg-white p-4 rounded-2xl border border-slate-700 shadow-md mb-6">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(joinLink)}`}
                  alt="Large Join QR Code"
                  className="w-60 h-60 sm:w-72 sm:h-72 object-contain"
                />
              </div>

              <div className="bg-slate-950 px-5 py-3 rounded-xl border border-amber-500/30 flex flex-col items-center gap-0.5 mb-6 w-full text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Mã phòng của bạn:</span>
                <span className="font-mono text-3xl font-black text-amber-400 tracking-[0.25em]">
                  {room.code}
                </span>
              </div>

              <button
                onClick={copyLink}
                className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {linkCopied ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-300" /> Đã Sao Chép Link
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" /> Sao Chép Đường Link
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================
// GAMEPLAY VIEW: HYBRID (TRẮC NGHIỆM + ĐUỔI HÌNH BẮT CHỮ)
// ============================================================
function GameplayView({
  room,
  currentPlayer,
  players,
  onChoice,
  onForceRound,
  onEndGame,
  onZoomImage,
}: {
  room: Doc<"mlnRooms">;
  currentPlayer: Doc<"mlnPlayers">;
  players: Doc<"mlnPlayers">[];
  onChoice: (answer: string, score: number) => void;
  onForceRound: () => void;
  onEndGame: () => void;
  onZoomImage: (url: string) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [isWrong, setIsWrong] = useState(false);
  const [startTime] = useState(Date.now());
  const [displayTime, setDisplayTime] = useState("60.00");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const scenario = SCENARIOS[room.currentRound - 1];

  const revealOrder = useMemo(() => {
    if (!scenario || scenario.type !== "catchphrase") return [];
    const indices: number[] = [];
    for (let i = 0; i < scenario.correctAnswer.length; i++) {
      if (scenario.correctAnswer[i] !== " ") {
        indices.push(i);
      }
    }
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [scenario?.correctAnswer, scenario?.type]);

  const remainingMs = Math.max(0, parseFloat(displayTime) * 1000);
  const elapsed = 60000 - remainingMs;
  const ratio = Math.min(1, elapsed / 60000);
  const numRevealed = Math.floor(ratio * revealOrder.length);
  const revealedIndices = new Set(revealOrder.slice(0, numRevealed));

  useEffect(() => {
    const timer = setInterval(() => {
      const el = Date.now() - startTime;
      const rem = Math.max(0, 60000 - el);
      setDisplayTime((rem / 1000).toFixed(2));

      if (rem <= 0) {
        clearInterval(timer);
        if (currentPlayer.isHost) onForceRound();
      }
    }, 16);
    return () => clearInterval(timer);
  }, [startTime, currentPlayer.isHost, onForceRound]);

  const handleSendCatchphraseAnswer = () => {
    if (!scenario || scenario.type !== "catchphrase") return;
    const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    
    const userAns = normalize(answer);
    const correctAns = normalize(scenario.correctAnswer);
    const isAccepted = scenario.acceptedAnswers?.some(a => normalize(a) === userAns) || userAns === correctAns;

    if (isAccepted) {
      sound.playQuizSuccess();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      const el = Date.now() - startTime;
      const rem = Math.max(0, 60000 - el);
      const finalScore = calculateQuickScore(rem);
      onChoice(answer.trim(), finalScore);
    } else {
      sound.playQuizWrong();
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 500);
      setAnswer("");
    }
  };

  const handleSelectChoice = (opt: string) => {
    if (!scenario || scenario.type !== "choice" || currentPlayer.isHost || currentPlayer.hasSubmitted) return;
    const letter = opt.trim().charAt(0).toUpperCase();
    setSelectedChoice(letter);

    const isCorrect = letter === scenario.correctAnswer.trim().toUpperCase();
    if (isCorrect) {
      sound.playQuizSuccess();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      const el = Date.now() - startTime;
      const rem = Math.max(0, 60000 - el);
      const finalScore = calculateQuickScore(rem);
      onChoice(letter, finalScore);
    } else {
      sound.playQuizWrong();
      onChoice(letter, 0);
    }
  };

  if (!scenario) return null;

  const isChoiceMode = scenario.type === "choice";
  const scenarioImage = typeof scenario.image === "string" ? scenario.image : undefined;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl w-full px-4 mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white px-3.5 py-1 rounded-full font-bold text-sm shadow-sm">
            Vòng {room.currentRound}/{SCENARIOS.length}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isChoiceMode ? "bg-sky-500/10 text-sky-400 border border-sky-500/30" : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
          }`}>
            {isChoiceMode ? <HelpCircle className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
            {isChoiceMode ? "Trắc Nghiệm Phản Xạ" : "Đuổi Hình Bắt Chữ"}
          </span>

          {currentPlayer.isHost && (
            <div className="flex gap-2 flex-wrap ml-2">
              <button
                onClick={() => { sound.playClick(); onForceRound(); }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
              >
                <Zap className="w-3.5 h-3.5" /> Qua vòng
              </button>
              <button
                onClick={() => { sound.playClick(); onEndGame(); }}
                className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Kết thúc
              </button>
            </div>
          )}
        </div>

        <div className={`flex items-center gap-2 font-mono text-2xl font-black ${parseFloat(displayTime) < 10 ? "text-red-500 animate-pulse" : "text-amber-400"}`}>
          <Timer className="w-6 h-6" />
          {displayTime}s
        </div>
      </div>

      <div className="space-y-6 max-w-3xl mx-auto w-full">
        {/* ============================================================ */}
        {/* MODE 1: TRẮC NGHIỆM */}
        {/* ============================================================ */}
        {isChoiceMode && (
          <motion.div
            key={room.currentRound}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="text-xs uppercase tracking-widest text-amber-400 font-extrabold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> {scenario.category}
              </div>
              <h2 className="text-xl sm:text-2xl font-headline font-bold text-white leading-relaxed">
                {scenario.question}
              </h2>
            </div>

            {/* Optional Hint Image for Choice Question */}
            {scenarioImage && (
              <div
                className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 max-h-48 flex items-center justify-center cursor-pointer shadow-lg"
                onClick={() => onZoomImage(scenarioImage)}
              >
                <img
                  src={scenarioImage}
                  alt="Minh họa gợi ý"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1 font-semibold text-amber-300">
                    <ImageIcon className="w-4 h-4" /> Hình ảnh gợi ý minh họa
                  </span>
                  <span className="bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Bấm để xem lớn
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {scenario.options?.map((opt) => {
                const letter = opt.trim().charAt(0).toUpperCase();
                const theme = OPTION_THEMES[letter] || OPTION_THEMES.A;
                const isSelected = selectedChoice === letter || currentPlayer.currentChoice === letter;
                const isDisabled = currentPlayer.isHost || currentPlayer.hasSubmitted;

                return (
                  <motion.button
                    key={letter}
                    onClick={() => handleSelectChoice(opt)}
                    disabled={isDisabled}
                    whileHover={!isDisabled ? { scale: 1.02 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    className={`text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-3.5 shadow-lg relative overflow-hidden ${
                      isSelected
                        ? theme.active
                        : `${theme.bg} ${theme.border} ${!isDisabled ? theme.hover : "opacity-80"} text-slate-100`
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-base shrink-0 shadow-md ${
                      isSelected ? "bg-white text-slate-950" : theme.badge
                    }`}>
                      {letter}
                    </span>
                    <span className="font-medium text-sm sm:text-base flex-1 pt-0.5 leading-snug text-slate-200">
                      {opt.replace(/^[A-D]\.\s*/, "")}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {!currentPlayer.isHost && currentPlayer.hasSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border-2 border-emerald-500/40 p-4 rounded-2xl text-center flex items-center justify-center gap-2 text-emerald-400 font-bold text-base"
              >
                <CheckCircle2 className="w-5 h-5" /> Đã chốt lựa chọn {currentPlayer.currentChoice}! Đang chờ mọi người hoàn thành...
              </motion.div>
            )}

            {currentPlayer.isHost && (
              <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl text-center text-slate-400 text-sm font-medium">
                📺 Máy chiếu quản trò đang phát sóng câu hỏi cho sinh viên trả lời...
              </div>
            )}
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* MODE 2: CATCHPHRASE (ĐOÁN TỪ + HÌNH ẢNH GỢI Ý) */}
        {/* ============================================================ */}
        {!isChoiceMode && (
          <div className="space-y-5">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-5 sm:p-7 rounded-3xl shadow-2xl text-center">
              <div className="text-xs uppercase tracking-widest text-amber-400 font-extrabold mb-2">
                {scenario.category}
              </div>
              <h2 className="text-lg sm:text-xl font-headline font-bold text-white leading-relaxed">
                {scenario.question}
              </h2>
            </div>

            {/* ARTWORK HINT IMAGE CARD */}
            {scenarioImage && (
              <motion.div
                key={room.currentRound}
                className="relative group rounded-3xl overflow-hidden border-2 border-amber-500/30 bg-slate-950/90 shadow-2xl max-h-64 sm:max-h-80 flex items-center justify-center cursor-pointer"
                onClick={() => onZoomImage(scenarioImage)}
              >
                <img
                  src={scenarioImage}
                  alt="Hình gợi ý Đuổi hình bắt chữ"
                  className="w-full max-h-64 sm:max-h-80 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-4 text-xs sm:text-sm text-slate-200">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" /> Bức ảnh gợi ý từ khóa
                  </span>
                  <span className="bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 border border-slate-700 text-slate-300 group-hover:text-white">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" /> Nhấn để phóng to
                  </span>
                </div>
              </motion.div>
            )}

            {/* Hint Suggestion */}
            {scenario.suggestion && (
              <div className="flex justify-center">
                <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-full text-xs sm:text-sm text-amber-300 italic font-medium flex items-center gap-2">
                  <span>💡 Gợi ý:</span> {scenario.suggestion}
                </div>
              </div>
            )}

            {/* HINT BOARD: Letter reveal boxes */}
            <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-2 py-3 px-2">
              {scenario.correctAnswer.split(" ").map((word, wordIdx, wordsArr) => {
                const startIndex = wordsArr.slice(0, wordIdx).join(" ").length + (wordIdx > 0 ? 1 : 0);
                return (
                  <div key={wordIdx} className="flex gap-x-1 sm:gap-x-1.5">
                    {word.split("").map((char, charIdx) => {
                      const absoluteIdx = startIndex + charIdx;
                      const isRevealed = revealedIndices.has(absoluteIdx);
                      return (
                        <div
                          key={charIdx}
                          className={`w-8 h-10 sm:w-11 sm:h-14 rounded-xl flex items-center justify-center font-black text-base sm:text-2xl shadow-md border-b-4 transition-all duration-300 ${
                            isRevealed
                              ? "bg-amber-500 text-slate-950 border-amber-600 scale-100"
                              : "bg-slate-950 border-slate-800 text-transparent scale-95"
                          }`}
                        >
                          {isRevealed ? char.toUpperCase() : ""}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Input Box */}
            {!currentPlayer.isHost && !currentPlayer.hasSubmitted ? (
              <motion.div
                animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
                className="relative group max-w-xl mx-auto"
              >
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendCatchphraseAnswer()}
                  placeholder="Gõ đáp án từ khóa vào đây..."
                  className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-500 text-white py-4 px-6 rounded-2xl font-bold text-lg sm:text-xl text-center outline-none transition-all shadow-inner"
                />
                <button
                  onClick={handleSendCatchphraseAnswer}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 p-2.5 sm:p-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  <Send className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl text-center max-w-xl mx-auto">
                <p className="text-base font-bold text-amber-400">
                  {currentPlayer.isHost ? "⏳ Đang chờ sinh viên gõ đáp án từ khóa..." : "✅ Đã nộp đáp án chính xác! Đang chờ tổng kết vòng..."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Live Feed Bar */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl w-full overflow-hidden">
          <h3 className="font-bold flex items-center gap-2 mb-3 uppercase text-xs tracking-widest text-slate-400">
            <Zap className="w-4 h-4 text-amber-400" /> Cập Nhật Tốc Độ Nộp Bài
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-1 custom-scrollbar">
            <AnimatePresence>
              {players
                .filter(p => !p.isHost && p.hasSubmitted)
                .sort((a, b) => (b.lastScoreIncrement ?? 0) - (a.lastScoreIncrement ?? 0))
                .map(p => (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex shrink-0 items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-sm font-semibold"
                  >
                    <span className="text-slate-200 truncate max-w-[90px]">{p.name}</span>
                    <span className={`font-mono font-bold ${(p.lastScoreIncrement ?? 0) > 0 ? "text-emerald-400" : "text-slate-500"}`}>
                      {(p.lastScoreIncrement ?? 0) > 0 ? `+${p.lastScoreIncrement}` : "+0"}
                    </span>
                  </motion.div>
                ))}
            </AnimatePresence>
            {players.filter(p => !p.isHost && !p.hasSubmitted).length > 0 && (
              <div className="flex shrink-0 items-center text-slate-500 italic text-xs px-2">
                Đang chờ các bạn khác...
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// ANIMATED NUMBER HELPER
// ============================================================
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (display === value) return;
    const duration = 400;
    const steps = 20;
    const stepValue = (value - display) / steps;
    let current = display;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      if (count >= steps) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        current += stepValue;
        setDisplay(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, display]);

  return <>{display}</>;
}

// ============================================================
// ROUND RESULTS VIEW
// ============================================================
function RoundResultsView({
  room,
  players,
  isHost,
  onNextRound,
}: {
  room: Doc<"mlnRooms">;
  players: Doc<"mlnPlayers">[];
  isHost: boolean;
  onNextRound: () => void;
}) {
  const [showNewScore, setShowNewScore] = useState(false);
  const scenario = SCENARIOS[room.currentRound - 1];

  useEffect(() => {
    const t = setTimeout(() => setShowNewScore(true), 800);
    return () => clearTimeout(t);
  }, []);

  const sortedPlayers = [...players].filter(p => !p.isHost).sort((a, b) => {
    const aScore = showNewScore ? (a.score ?? 0) : ((a.score ?? 0) - (a.lastScoreIncrement ?? 0));
    const bScore = showNewScore ? (b.score ?? 0) : ((b.score ?? 0) - (b.lastScoreIncrement ?? 0));
    return bScore - aScore;
  });

  const correctDisplay = useMemo(() => {
    if (!scenario) return "";
    if (scenario.type === "choice") {
      const fullOpt = scenario.options?.find(o => o.startsWith(scenario.correctAnswer));
      return fullOpt ?? `Đáp án ${scenario.correctAnswer}`;
    }
    return scenario.correctAnswer;
  }, [scenario]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl w-full px-4 mx-auto space-y-6 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
        <CheckCircle2 className="w-4 h-4" /> Kết Quả Vòng {room.currentRound}/{SCENARIOS.length}
      </div>

      <div className="bg-slate-900/90 backdrop-blur-md border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
        <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400 block mb-2">
          Đáp Án Chính Xác
        </span>
        <h3 className="text-xl sm:text-3xl font-extrabold text-white mb-4 leading-tight font-headline">
          {correctDisplay}
        </h3>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800 mb-3">
          {scenario?.description}
        </p>
        {scenario?.philosophicalNote && (
          <p className="text-amber-300 text-xs sm:text-sm italic bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
            📜 Ý nghĩa lý luận: {scenario.philosophicalNote}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 w-full max-w-xl mx-auto text-left">
        <h3 className="font-bold text-lg uppercase tracking-widest text-amber-400 mb-1 flex items-center justify-center gap-2">
          <Trophy className="w-5 h-5" /> Bảng Điểm Tích Lũy
        </h3>
        {sortedPlayers.map((p, index) => {
          const prevScore = (p.score ?? 0) - (p.lastScoreIncrement ?? 0);
          const currentScore = p.score ?? 0;
          const diff = p.lastScoreIncrement ?? 0;

          return (
            <motion.div
              key={p._id}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`flex items-center justify-between px-5 py-3.5 rounded-2xl border shadow-lg ${
                index === 0
                  ? "bg-amber-950/40 border-amber-400/60"
                  : index === 1
                  ? "bg-slate-800/60 border-slate-600"
                  : index === 2
                  ? "bg-orange-950/30 border-orange-600/40"
                  : "bg-slate-900/60 border-slate-800"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                  index === 0 ? "bg-amber-400 text-slate-950" : index === 1 ? "bg-slate-300 text-slate-950" : index === 2 ? "bg-amber-700 text-white" : "bg-slate-800 text-slate-300"
                }`}>
                  {index + 1}
                </div>
                <span className="font-bold text-base text-white truncate max-w-[150px]">{p.name}</span>
              </div>
              <div className="flex items-center gap-3 font-mono font-bold text-xl">
                {diff > 0 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={showNewScore ? { opacity: 0, y: -15, scale: 0.5 } : { opacity: 1, y: 0, scale: 1 }}
                    className="text-emerald-400 text-sm"
                  >
                    +{diff}
                  </motion.span>
                )}
                <span className={showNewScore && diff > 0 ? "text-emerald-400" : "text-amber-400"}>
                  <AnimatedNumber value={showNewScore ? currentScore : prevScore} />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center pt-2">
        {isHost ? (
          <button
            onClick={() => { sound.playClick(); onNextRound(); }}
            className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white px-8 py-3.5 rounded-xl font-bold text-base transition-all shadow-xl active:scale-95 flex items-center gap-2 mx-auto"
          >
            {room.currentRound >= SCENARIOS.length ? "Xem Tổng Kết Bảng Vàng 🏆" : "Sang Vòng Tiếp Theo ➔"}
          </button>
        ) : (
          <p className="text-slate-400 text-sm italic">Đang chờ Quản trò chuyển sang vòng kế tiếp...</p>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// FINAL RESULTS VIEW: BẢNG VÀNG
// ============================================================
function FinalResultsView({ players, onPlayAgain }: { players: Doc<"mlnPlayers">[], onPlayAgain: () => void }) {
  const sorted = sortPlayersByScore(players.filter(p => !p.isHost));

  useEffect(() => {
    sound.playVictoryFanfare();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  }, []);

  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl w-full mx-auto text-center space-y-6 px-4">
      <div className="bg-slate-900/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border-2 border-amber-500/40 shadow-2xl">
        <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400 mx-auto mb-3 animate-bounce" />
        <h1 className="text-3xl sm:text-4xl font-headline font-black text-white">BẢNG VÀNG VINH DANH</h1>
        <p className="text-slate-300 mt-2 text-sm sm:text-base">
          Chúc mừng tất cả các bạn đã xuất sắc chinh phục {SCENARIOS.length} vòng thi môn MLN131!
        </p>
      </div>

      <div className="space-y-3">
        {sorted.map((p, i) => (
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            key={p._id}
            className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 shadow-xl ${
              i === 0
                ? "bg-amber-950/60 border-amber-400"
                : i === 1
                ? "bg-slate-800/80 border-slate-500"
                : i === 2
                ? "bg-orange-950/50 border-orange-600"
                : "bg-slate-900/70 border-slate-800"
            }`}
          >
            <span className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl font-black text-lg ${
              i === 0 ? "bg-amber-400 text-slate-950" : i === 1 ? "bg-slate-300 text-slate-950" : i === 2 ? "bg-amber-700 text-white" : "bg-slate-800 text-slate-400"
            }`}>
              {i === 0 ? <Crown className="w-6 h-6 text-slate-950" /> : i + 1}
            </span>
            <span className="flex-1 text-left font-bold text-lg sm:text-xl truncate text-white">{p.name}</span>
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-mono font-black text-amber-400">{p.score ?? 0}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Điểm chung cuộc</div>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={() => { sound.playClick(); onPlayAgain(); }}
        className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto"
      >
        <LogOut className="w-5 h-5" /> Quay Lại Trang Chủ
      </button>
    </motion.div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function App() {
  const [showRules, setShowRules] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  // Background Audio elements
  const lobbyAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const [playerId, setPlayerId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("mlnGameSession");
      return stored ? JSON.parse(stored).playerId : null;
    } catch { return null; }
  });
  const [roomId, setRoomId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("mlnGameSession");
      return stored ? JSON.parse(stored).roomId : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (playerId && roomId) {
      localStorage.setItem("mlnGameSession", JSON.stringify({ playerId, roomId }));
    }
  }, [playerId, roomId]);

  const room = useQuery(api.rooms.get, roomId ? { roomId: roomId as Id<"mlnRooms"> } : "skip");
  const players = useQuery(api.rooms.getPlayers, roomId ? { roomId: roomId as Id<"mlnRooms"> } : "skip");
  const currentPlayer = useQuery(api.rooms.getPlayer, playerId ? { playerId: playerId as Id<"mlnPlayers"> } : "skip");

  const createRoomMutation = useMutation(api.rooms.create);
  const joinRoomMutation = useMutation(api.rooms.join);
  const leaveRoomMutation = useMutation(api.rooms.leave);
  const startGameMutation = useMutation(api.game.startGame);
  const submitAnswerMutation = useMutation(api.game.submitChoice);
  const nextRoundMutation = useMutation(api.game.nextRound);
  const forceProcessRoundMutation = useMutation(api.game.forceProcessRound);
  const endGameMutation = useMutation(api.game.endGame);

  useEffect(() => {
    if (roomId && room === null) clearSession();
    if (playerId && currentPlayer === null) clearSession();
  }, [room, currentPlayer, roomId, playerId]);

  function clearSession() {
    localStorage.removeItem("mlnGameSession");
    setPlayerId(null);
    setRoomId(null);
    setError(null);
  }

  // Audio Playback Synchronization
  useEffect(() => {
    const lobbyAudio = lobbyAudioRef.current;
    const gameAudio = gameAudioRef.current;
    const winAudio = winAudioRef.current;

    if (!lobbyAudio || !gameAudio || !winAudio) return;

    lobbyAudio.volume = 0.45;
    gameAudio.volume = 0.45;
    winAudio.volume = 0.55;

    lobbyAudio.pause();
    gameAudio.pause();
    winAudio.pause();

    if (musicEnabled) {
      if (!roomId || !room || room.status === "lobby") {
        lobbyAudio.play().catch(() => {});
      } else if (room.status === "playing") {
        gameAudio.play().catch(() => {});
      } else if (room.status === "finished") {
        winAudio.play().catch(() => {});
      }
    }
  }, [roomId, room?.status, musicEnabled]);

  const toggleMusic = () => {
    sound.playClick();
    setMusicEnabled((prev) => !prev);
  };

  async function handleLeaveGame() {
    sound.playClick();
    if (!playerId) {
      clearSession();
      return;
    }
    try {
      await leaveRoomMutation({ playerId: playerId as Id<"mlnPlayers"> });
    } catch { } finally { clearSession(); }
  }

  async function handleCreateRoom(hostName: string, password?: string) {
    sound.playClick();
    if (password !== "Admin@123") {
      setError("Mật khẩu quản trò không chính xác!");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await createRoomMutation({ hostName, password });
      setPlayerId(result.playerId);
      setRoomId(result.roomId);
    } catch (e: any) { setError(e.message || "Lỗi tạo phòng"); } finally { setLoading(false); }
  }

  async function handleJoinRoom(code: string, name: string) {
    sound.playClick();
    try {
      setLoading(true);
      setError(null);
      const result = await joinRoomMutation({ code, name });
      setPlayerId(result.playerId);
      setRoomId(result.roomId);
    } catch (e: any) { setError(e.message || "Lỗi tham gia phòng"); } finally { setLoading(false); }
  }

  async function handleStartGame() {
    sound.playClick();
    try {
      await startGameMutation({ roomId: roomId as Id<"mlnRooms">, playerId: playerId as Id<"mlnPlayers"> });
    } catch (e: any) { setError(e.message || "Lỗi bắt đầu trận đấu"); }
  }

  const handleAnswerSubmit = async (val: string, quickScore: number) => {
    try {
      await submitAnswerMutation({
        playerId: playerId as Id<"mlnPlayers">,
        answer: val,
        scoreIncrement: quickScore
      });
    } catch (e: any) {
      setError(e.message || "Lỗi gửi đáp án. Vui lòng thử lại!");
    }
  };

  async function handleForceProcessRound() {
    sound.playClick();
    try {
      await forceProcessRoundMutation({ roomId: roomId as Id<"mlnRooms">, playerId: playerId as Id<"mlnPlayers"> });
    } catch (e: any) { setError(e.message || "Không thể chuyển vòng"); }
  }

  async function handleEndGame() {
    sound.playClick();
    try {
      await endGameMutation({ roomId: roomId as Id<"mlnRooms">, playerId: playerId as Id<"mlnPlayers"> });
    } catch (e: any) { setError(e.message || "Lỗi kết thúc trò chơi"); }
  }

  async function handleNextRound() {
    sound.playClick();
    try {
      await nextRoundMutation({ roomId: roomId as Id<"mlnRooms">, playerId: playerId as Id<"mlnPlayers"> });
    } catch (e: any) { setError(e.message || "Không thể chuyển vòng"); }
  }

  const isHost = currentPlayer?.isHost ?? false;
  const isInRoom = !!(roomId && playerId && room && currentPlayer);

  let content: React.ReactNode;

  if (!isInRoom) {
    content = <LobbyView onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} error={error} loading={loading} />;
  } else if (room.status === "lobby") {
    content = (
      <WaitingRoom
        room={room}
        players={players ?? []}
        isHost={isHost}
        onStart={handleStartGame}
        onLeave={handleLeaveGame}
        musicEnabled={musicEnabled}
        onToggleMusic={toggleMusic}
      />
    );
  } else if (room.status === "playing" && room.phase === "choosing") {
    content = (
      <GameplayView
        room={room}
        currentPlayer={currentPlayer}
        players={players ?? []}
        onChoice={handleAnswerSubmit}
        onForceRound={handleForceProcessRound}
        onEndGame={handleEndGame}
        onZoomImage={(url) => setZoomImageUrl(url)}
      />
    );
  } else if (room.status === "playing" && room.phase === "results") {
    content = <RoundResultsView room={room} players={players ?? []} isHost={isHost} onNextRound={handleNextRound} />;
  } else if (room.status === "finished") {
    content = <FinalResultsView players={players ?? []} onPlayAgain={handleLeaveGame} />;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start pt-6 pb-12 bg-[#080c16] text-slate-100 relative overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Background Audio Tracks */}
      <audio ref={lobbyAudioRef} src="/sound/astral.mp3" loop preload="auto" />
      <audio ref={gameAudioRef} src="/sound/symphony.mp3" loop preload="auto" />
      <audio ref={winAudioRef} src="/sound/win.mp3" preload="auto" />

      {/* Background glow ornaments */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/15 blur-[140px] rounded-full" />
      </div>

      {/* Top Bar */}
      <div className="w-full max-w-5xl px-4 flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <span className="font-headline font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">
            MLN131
          </span>
          {isInRoom && room.status !== "lobby" && (
            <span className="bg-slate-900 border border-slate-800 text-amber-400 font-mono text-xs font-bold px-3 py-1 rounded-full">
              Phòng: {room.code}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleMusic}
            title={musicEnabled ? "Tắt nhạc nền" : "Bật nhạc nền"}
            className={`p-2 rounded-full border transition-all ${
              musicEnabled
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30"
                : "bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {musicEnabled ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => { sound.playClick(); setShowRules(true); }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full border border-slate-700 text-xs font-bold shadow-md transition-all"
          >
            <BookOpen className="w-4 h-4 text-amber-400" /> Thể Lệ
          </button>
        </div>
      </div>

      {error && isInRoom && (
        <div className="relative z-10 max-w-md mx-auto mb-4 bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-2 rounded-xl text-center font-medium text-xs">
          {error}
        </div>
      )}

      <div className="relative z-10 w-full flex flex-col items-center">
        {content}
      </div>

      <RulesModal show={showRules} onClose={() => setShowRules(false)} />
      <ImageZoomModal imageUrl={zoomImageUrl} onClose={() => setZoomImageUrl(null)} />
    </div>
  );
}
