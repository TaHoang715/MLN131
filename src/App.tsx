import confetti from "canvas-confetti";
import { sound } from "./audio/SoundEngine";
import React, { useState, useEffect, useRef } from "react";
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
  Volume2,
  VolumeX,
  Timer,
  Send,
  Copy,
  Zap,
  Maximize2,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";

import { SCENARIOS } from "./gameData";




const calculateQuickScore = (remainingMs: number) => {
  return Math.floor(remainingMs / 10); // Tính điểm: thời gian còn lại (ms) chia 10 (tối đa ~6000 điểm)
};

function sortPlayersByScore(players: Doc<"mlnPlayers">[]) {
  return [...players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

const OPTION_THEMES: Record<string, { bg: string; border: string; badgeBg: string; hover: string; ring: string }> = {
  A: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    badgeBg: "bg-sky-600 text-white",
    hover: "hover:bg-sky-500/20 hover:border-sky-500",
    ring: "ring-sky-500"
  },
  B: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    badgeBg: "bg-emerald-600 text-white",
    hover: "hover:bg-emerald-500/20 hover:border-emerald-500",
    ring: "ring-emerald-500"
  },
  C: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    badgeBg: "bg-amber-600 text-white",
    hover: "hover:bg-amber-500/20 hover:border-amber-500",
    ring: "ring-amber-500"
  },
  D: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    badgeBg: "bg-purple-600 text-white",
    hover: "hover:bg-purple-500/20 hover:border-purple-500",
    ring: "ring-purple-500"
  }
};

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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-surface rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-outline-variant"
          >
            <div className="bg-surface border-b border-outline-variant p-5 md:p-6 text-on-surface flex justify-between items-center shrink-0">
              <h2 className="text-xl md:text-2xl font-headline font-bold flex items-center gap-3 tracking-tight text-primary">
                <ScrollText className="w-6 h-6 md:w-7 md:h-7" /> Luật Chơi Đấu Trường Tri Thức
              </h2>
              <button
                onClick={onClose}
                className="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-on-surface-variant custom-scrollbar">
              <div className="bg-primary/5 border-l-4 border-primary p-5 rounded-r-xl">
                <p className="text-on-surface leading-relaxed italic text-lg font-medium">
                  "Kết hợp giữa Trắc nghiệm phản xạ và Đuổi hình bắt chữ để chinh phục đỉnh cao kiến thức Tư tưởng Hồ Chí Minh!"
                </p>
              </div>

              <section>
                <h3 className="font-bold text-xl md:text-2xl text-on-surface mb-4">
                  🎯 2 Thể Thức Vòng Thi (Tổng {SCENARIOS.length} Vòng)
                </h3>
                <div className="space-y-4 text-base md:text-lg">
                  <div className="p-4 rounded-2xl bg-surface-variant/30 border border-outline-variant/40">
                    <div className="font-bold text-primary flex items-center gap-2 mb-1">
                      <HelpCircle className="w-5 h-5" /> 1. Trắc Nghiệm Nhanh Tay (A, B, C, D)
                    </div>
                    <p className="text-sm md:text-base text-on-surface-variant">
                      Đọc câu hỏi trên màn hình và bấm chọn phương án chính xác nhất càng sớm càng tốt.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-variant/30 border border-outline-variant/40">
                    <div className="font-bold text-amber-500 flex items-center gap-2 mb-1">
                      <ImageIcon className="w-5 h-5" /> 2. Đuổi Hình Bắt Chữ (Điền Từ Khóa)
                    </div>
                    <p className="text-sm md:text-base text-on-surface-variant">
                      Quan sát hình ảnh gợi ý nghệ thuật, ô chữ và gõ đáp án chính xác. Nếu sai có thể thử lại ngay cho đến khi hết giờ!
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-bold text-xl md:text-2xl text-on-surface mb-4">
                  🏆 Cơ Chế Tính Điểm
                </h3>
                <div className="bg-surface p-6 rounded-2xl border border-amber-500/30 shadow-sm text-center">
                  <div className="text-2xl font-bold text-amber-500 mb-2">Điểm tính theo Mili-giây!</div>
                  <p className="text-base text-on-surface-variant">Thời gian còn lại càng nhiều, điểm số cộng dồn càng lớn (tối đa ~6000 điểm mỗi vòng).</p>
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-outline-variant bg-surface-variant/30 flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="bg-primary text-on-primary px-10 py-3 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg active:scale-95"
              >
                Đã Hiểu, Sẵn Sàng!
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl w-full px-4 flex-grow flex flex-col justify-center pb-12"
    >
      <motion.div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-4">
          <Sparkles className="w-4 h-4" /> Đấu Trường Tri Thức · 10 Vòng Thi Đấu
        </div>
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface mb-5 tracking-tight uppercase">
          Tư Tưởng <span className="text-primary">Hồ Chí Minh</span>
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Thử thách phản xạ trắc nghiệm & giải mã đuổi hình bắt chữ thời gian thực!
        </p>
      </motion.div>

      {error && (
        <motion.div className="max-w-md mx-auto mb-6 bg-red-500/10 border border-red-500/30 text-red-600 px-5 py-3 rounded-xl text-center font-medium">
          {error}
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {/* Host card */}
        <motion.div className="group bg-surface rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-outline-variant w-full md:w-1/2 flex flex-col items-center text-center">
          <div className="bg-primary/10 p-5 rounded-full mb-6 text-primary group-hover:scale-110 transition-transform">
            <MonitorPlay className="w-10 h-10" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-on-surface">Bạn là Quản Trò?</h2>
          <p className="text-on-surface-variant mb-8 text-base">Tạo phòng chơi mới, trình chiếu câu hỏi và bảng xếp hạng trên màn hình lớn.</p>
          <div className="mt-auto w-full space-y-4">
            <input
              type="text"
              placeholder="Tên của bạn"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="w-full bg-surface-variant/30 border border-outline-variant text-on-surface py-4 px-6 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg"
            />
            <input
              type="password"
              placeholder="Mật khẩu tạo phòng"
              value={hostPassword}
              onChange={(e) => setHostPassword(e.target.value)}
              className="w-full bg-surface-variant/30 border border-outline-variant text-on-surface py-4 px-6 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg"
            />
            <button
              onClick={() => onCreateRoom(hostName.trim(), hostPassword)}
              disabled={!hostName.trim() || !hostPassword.trim() || loading}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors flex justify-center items-center gap-3 shadow-lg disabled:opacity-50"
            >
              <PlusCircle className="w-6 h-6" />
              {loading ? "Đang tạo..." : "Tạo Phòng Mới"}
            </button>
          </div>
        </motion.div>

        {/* Player card */}
        <motion.div className="group bg-surface rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-outline-variant w-full md:w-1/2 flex flex-col items-center text-center">
          <div className="bg-amber-500/10 p-5 rounded-full mb-6 text-amber-500 group-hover:scale-110 transition-transform">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-on-surface">Bạn là Người Chơi?</h2>
          <p className="text-on-surface-variant mb-8 text-base">Nhập mã phòng từ màn hình của quản trò để tham gia tranh tài trực tiếp.</p>
          <div className="w-full flex flex-col gap-4 mt-auto">
            <input
              type="text"
              placeholder="Nhập mã phòng"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="w-full bg-surface-variant/30 border border-outline-variant text-on-surface py-4 px-6 rounded-xl font-bold text-center text-xl tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="text"
              placeholder="Nhập tên của bạn"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              className="w-full bg-surface-variant/30 border border-outline-variant text-on-surface py-4 px-6 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-center text-lg"
            />
            <button
              onClick={() => onJoinRoom(joinCode.trim(), joinName.trim())}
              disabled={!joinCode.trim() || !joinName.trim() || loading}
              className="w-full bg-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-600 transition-colors flex justify-center items-center gap-3 shadow-lg disabled:opacity-50"
            >
              <LogIn className="w-6 h-6" />
              {loading ? "Đang tham gia..." : "Tham Gia Ngay"}
            </button>
          </div>
        </motion.div>
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
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinLink = `${window.location.origin}${window.location.pathname}?code=${room.code}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(joinLink)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(joinLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full px-4 mx-auto">
      <div className="bg-surface rounded-3xl p-8 shadow-sm border border-outline-variant">
        <div className="text-center mb-8">
          <h2 className="font-headline text-3xl font-bold text-on-surface mb-3">Phòng Chờ</h2>
          <p className="text-on-surface-variant">Chia sẻ mã phòng hoặc link QR để mời người chơi tham gia</p>
        </div>

        {/* Room Code */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="bg-primary/5 border-2 border-primary/30 rounded-2xl px-8 py-4">
            <span className="font-mono text-4xl font-bold text-primary tracking-[0.3em]">{room.code}</span>
          </div>
          <button onClick={copyCode} title="Sao chép mã" className="p-3 rounded-xl bg-surface-variant/50 hover:bg-surface-variant text-on-surface-variant transition-colors">
            {copied ? <Check className="w-6 h-6 text-emerald-500" /> : <Copy className="w-6 h-6" />}
          </button>
          <button onClick={onToggleMusic} title="Bật/Tắt nhạc nền" className="p-3 rounded-xl bg-surface-variant/50 hover:bg-surface-variant text-on-surface-variant transition-colors">
            {musicEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>
        </div>

        {isHost && (
          <div className="flex flex-col items-center bg-surface-variant/20 border border-outline-variant/30 rounded-2xl p-4 mb-8 max-w-xs mx-auto text-center">
            <p className="text-sm font-bold text-on-surface-variant mb-3">Quét mã QR để vào phòng:</p>
            <div 
              className="relative group bg-white p-3 rounded-xl border border-outline-variant/20 shadow-sm cursor-pointer overflow-hidden"
              onClick={() => setShowLargeQr(true)}
            >
              <img src={qrUrl} alt="Join QR Code" className="w-40 h-40 object-contain animate-fade-in" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1">
                <Maximize2 className="w-4 h-4" />
                <span>Phóng to</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 w-full justify-center">
              <button
                onClick={() => setShowLargeQr(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-variant text-on-surface border border-outline-variant text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Phóng to QR
              </button>
              <button
                onClick={copyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-variant text-on-surface border border-outline-variant text-xs font-bold transition-all shadow-sm active:scale-95 min-w-[90px] justify-center"
              >
                {linkCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
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
        <div className="mb-8">
          <h3 className="text-sm uppercase tracking-widest text-on-surface-variant font-bold mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" /> Người chơi ({players.length})
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
            {players.map((p) => (
              <div key={p._id} className="flex items-center gap-3 bg-surface-variant/30 border border-outline-variant/50 px-5 py-3 rounded-xl">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${p.isHost ? "bg-primary text-on-primary" : "bg-amber-500/20 text-amber-600"}`}>
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-on-surface flex-1 truncate">{p.name}</span>
                {p.isHost && (
                  <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full shrink-0">
                    <Crown className="w-3.5 h-3.5" /> Chủ phòng
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
              onClick={onStart}
              disabled={!canStart}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-lg hover:bg-primary/90 flex justify-center items-center gap-3 shadow-lg disabled:opacity-50 transition-all active:scale-98"
            >
              <Zap className="w-6 h-6" /> Bắt Đầu Trò Chơi ({SCENARIOS.length} Vòng)
            </button>
          ) : (
            <div className="text-center py-4 text-on-surface-variant font-medium">
              Đang chờ chủ phòng bắt đầu...
            </div>
          )}
          <button onClick={onLeave} className="w-full py-3 rounded-xl font-medium text-on-surface-variant hover:text-red-500 hover:bg-red-500/5 flex justify-center items-center gap-2 border border-outline-variant/50 transition-colors">
            <LogOut className="w-5 h-5" /> Rời phòng
          </button>
        </div>
      </div>

      {/* Enlarged QR Modal */}
      <AnimatePresence>
        {showLargeQr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4"
            onClick={() => setShowLargeQr(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full border border-outline-variant shadow-2xl flex flex-col items-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLargeQr(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="font-headline text-xl font-bold text-center text-on-surface mb-2">
                Quét để Tham Gia Chơi
              </h3>
              <p className="text-sm text-on-surface-variant text-center mb-6">
                Mở camera điện thoại quét mã QR bên dưới để kết nối trực tiếp
              </p>

              <div className="bg-white p-5 rounded-2xl border border-outline-variant/20 shadow-md mb-6">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(joinLink)}`}
                  alt="Large Join QR Code"
                  className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
                />
              </div>

              <div className="bg-primary/5 px-4 py-2.5 rounded-xl border border-primary/20 flex flex-col items-center gap-1 mb-6 w-full text-center">
                <span className="text-xs text-outline uppercase tracking-wider font-bold">Mã phòng của bạn:</span>
                <span className="font-mono text-3xl font-extrabold text-primary tracking-[0.2em] select-all">
                  {room.code}
                </span>
              </div>

              <button
                onClick={copyLink}
                className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                {linkCopied ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-300" /> Đã Sao Chép Link
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" /> Sao Chép Link Tham Gia
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
}: {
  room: Doc<"mlnRooms">;
  currentPlayer: Doc<"mlnPlayers">;
  players: Doc<"mlnPlayers">[];
  onChoice: (answer: string, score: number) => void;
  onForceRound: () => void;
  onEndGame: () => void;
}) {
  const [answer, setAnswer] = useState("");
  const [isWrong, setIsWrong] = useState(false);
  const [startTime] = useState(Date.now());
  const [displayTime, setDisplayTime] = useState("60.0");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const scenario = SCENARIOS[room.currentRound - 1];

  // Randomize indices to reveal characters in random order for catchphrase
  const revealOrder = React.useMemo(() => {
    if (!scenario || scenario.type !== "catchphrase") return [];
    const indices: number[] = [];
    for (let i = 0; i < scenario.correctAnswer.length; i++) {
      if (scenario.correctAnswer[i] !== " ") {
        indices.push(i);
      }
    }
    // Fisher-Yates shuffle
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

  // Handle Catchphrase input
  const handleSendCatchphraseAnswer = () => {
    if (!scenario || scenario.type !== "catchphrase") return;
    const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const isCorrect = normalize(answer) === normalize(scenario.correctAnswer);

    if (isCorrect) {
      const el = Date.now() - startTime;
      const rem = Math.max(0, 60000 - el);
      const finalScore = calculateQuickScore(rem);
      onChoice(answer.trim(), finalScore);
    } else {
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 500);
      setAnswer("");
    }
  };

  // Handle Multiple Choice click
  const handleSelectChoice = (opt: string) => {
    if (!scenario || scenario.type !== "choice" || currentPlayer.isHost || currentPlayer.hasSubmitted) return;
    const letter = opt.trim().charAt(0).toUpperCase(); // "A", "B", "C", "D"
    setSelectedChoice(letter);

    const isCorrect = letter === scenario.correctAnswer.trim().toUpperCase();
    if (isCorrect) {
      const el = Date.now() - startTime;
      const rem = Math.max(0, 60000 - el);
      const finalScore = calculateQuickScore(rem);
      onChoice(letter, finalScore);
    } else {
      // Sai: nộp đáp án 0 điểm để khóa lựa chọn
      onChoice(letter, 0);
    }
  };

  if (!scenario) return null;

  const isChoiceMode = scenario.type === "choice";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl w-full px-4 mx-auto">
      {/* Top Controls Bar */}
      <div className="flex justify-between items-center mb-6 bg-surface p-4 rounded-2xl shadow-sm border border-outline-variant">
        <div className="flex items-center gap-3">
          <span className="bg-primary text-on-primary px-4 py-1 rounded-full font-bold">
            Câu {room.currentRound}/{SCENARIOS.length}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isChoiceMode ? "bg-sky-500/10 text-sky-600 border border-sky-500/30" : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
          }`}>
            {isChoiceMode ? <HelpCircle className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
            {isChoiceMode ? "Trắc Nghiệm Nhanh Tay" : "Đuổi Hình Bắt Chữ"}
          </span>

          {currentPlayer.isHost && (
            <div className="flex gap-2 flex-wrap ml-2">
              <button
                onClick={onForceRound}
                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 transition-colors shadow-sm"
              >
                <Zap className="w-3.5 h-3.5" /> Qua vòng
              </button>
              <button
                onClick={onEndGame}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Kết thúc sớm
              </button>
            </div>
          )}
        </div>

        <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${parseFloat(displayTime) < 10 ? "text-red-500 animate-pulse" : "text-primary"}`}>
          <Timer className="w-6 h-6" />
          {displayTime}s
        </div>
      </div>

      <div className="space-y-6 max-w-3xl mx-auto w-full">
        {/* ============================================================ */}
        {/* MODE 1: TRẮC NGHIỆM (CHOICE A, B, C, D)                      */}
        {/* ============================================================ */}
        {isChoiceMode && (
          <motion.div
            key={room.currentRound}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Question Card */}
            <div className="bg-surface border-2 border-primary/30 p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
              <div className="text-xs uppercase tracking-widest text-primary font-extrabold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Câu Hỏi Trắc Nghiệm
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-on-surface leading-snug">
                {scenario.question}
              </h2>
            </div>

            {/* Options Grid (2x2 on desktop, stacked on mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    className={`text-left p-5 rounded-2xl border-2 transition-all flex items-start gap-4 shadow-sm relative overflow-hidden ${
                      isSelected
                        ? "bg-primary text-white border-primary ring-4 ring-primary/30 shadow-md"
                        : `${theme.bg} ${theme.border} ${!isDisabled ? theme.hover : "opacity-90"} text-on-surface`
                    }`}
                  >
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg shrink-0 shadow-sm ${
                      isSelected ? "bg-white text-primary" : theme.badgeBg
                    }`}>
                      {letter}
                    </span>
                    <span className="font-semibold text-base md:text-lg flex-1 pt-1 leading-relaxed">
                      {opt.replace(/^[A-D]\.\s*/, "")}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Player submission feedback */}
            {!currentPlayer.isHost && currentPlayer.hasSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border-2 border-emerald-500/30 p-4 rounded-2xl text-center flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg"
              >
                <CheckCircle2 className="w-6 h-6" /> Đã chốt đáp án {currentPlayer.currentChoice}! Chờ hết giờ để xem điểm số...
              </motion.div>
            )}

            {currentPlayer.isHost && (
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl text-center text-primary font-medium">
                Quản trò đang trình chiếu câu hỏi trắc nghiệm cho tất cả người chơi...
              </div>
            )}
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* MODE 2: ĐUỔI HÌNH BẮT CHỮ (CATCHPHRASE INPUT + IMAGE)       */}
        {/* ============================================================ */}
        {!isChoiceMode && (
          <div className="space-y-4 md:space-y-6">
            {/* Question Text */}
            <div className="bg-surface border border-outline-variant p-4 md:p-6 rounded-2xl shadow-sm text-center">
              <h2 className="text-lg md:text-xl font-headline font-bold text-on-surface">
                {scenario.question}
              </h2>
            </div>

            {/* Image Preview */}
            <motion.div
              key={room.currentRound}
              className="bg-surface p-2 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl border-4 border-primary/20 h-48 sm:h-64 md:h-auto md:aspect-video flex items-center justify-center overflow-hidden w-full"
            >
              {Array.isArray(scenario.image) ? (
                <div className="flex items-center justify-center gap-4 w-full h-full">
                  <div className="flex-1 h-full flex items-center justify-center overflow-hidden rounded-xl border border-outline-variant bg-black/20 relative group">
                    <img src={scenario.image[0]} alt="Gợi ý 1" className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-2 left-2 bg-primary/80 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Hình 1</div>
                  </div>
                  <div className="text-3xl font-black text-primary px-2 animate-pulse shrink-0">+</div>
                  <div className="flex-1 h-full flex items-center justify-center overflow-hidden rounded-xl border border-outline-variant bg-black/20 relative group">
                    <img src={scenario.image[1]} alt="Gợi ý 2" className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-2 left-2 bg-amber-500/80 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Hình 2</div>
                  </div>
                </div>
              ) : (
                <img src={scenario.image} alt="Gợi ý Đuổi hình bắt chữ" className="max-h-full object-contain" />
              )}
            </motion.div>

            {/* Input Box for Players */}
            {!currentPlayer.isHost && !currentPlayer.hasSubmitted ? (
              <motion.div
                animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
                className="relative group"
              >
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendCatchphraseAnswer()}
                  placeholder="Gõ đáp án chính xác..."
                  className="w-full bg-surface border-2 md:border-4 border-outline-variant text-on-surface py-3 px-5 md:py-6 md:px-8 rounded-2xl md:rounded-3xl font-bold text-base md:text-2xl text-center focus:border-primary outline-none transition-all shadow-inner"
                />
                <button
                  onClick={handleSendCatchphraseAnswer}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-on-primary p-2 md:p-4 rounded-xl md:rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-lg"
                >
                  <Send className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </motion.div>
            ) : (
              <div className="bg-primary/10 border-2 border-primary/20 p-6 md:p-8 rounded-2xl md:rounded-3xl text-center">
                <p className="text-lg md:text-xl font-bold text-primary">
                  {currentPlayer.isHost ? "Đang chờ người chơi nhập đáp án..." : "Đã gửi đáp án đúng! Đang chờ kết quả vòng..."}
                </p>
              </div>
            )}

            {scenario.suggestion && (
              <div className="flex justify-center">
                <p className="text-on-surface-variant italic font-medium bg-surface-variant/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-base">
                  💡 Gợi ý: {scenario.suggestion}
                </p>
              </div>
            )}

            {/* HINT BOARD: Letter reveal boxes */}
            <div className="flex flex-wrap justify-center gap-x-3 md:gap-x-6 gap-y-2 mt-2 md:mt-4 px-2">
              {scenario.correctAnswer.split(" ").map((word, wordIdx, wordsArr) => {
                const startIndex = wordsArr.slice(0, wordIdx).join(" ").length + (wordIdx > 0 ? 1 : 0);
                return (
                  <div key={wordIdx} className="flex gap-x-1">
                    {word.split("").map((char, charIdx) => {
                      const absoluteIdx = startIndex + charIdx;
                      const isRevealed = revealedIndices.has(absoluteIdx);
                      return (
                        <div
                          key={charIdx}
                          className={`w-7 h-9 sm:w-9 sm:h-11 md:w-11 md:h-14 rounded-lg flex items-center justify-center font-bold text-sm sm:text-lg md:text-2xl shadow-sm border-b-4 transition-all duration-300
                            ${isRevealed ? "bg-primary text-white border-primary/80 scale-100" : "bg-surface-variant/50 border-outline-variant text-transparent scale-95"}`}
                        >
                          {isRevealed ? char.toUpperCase() : ""}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Live Feed Bar */}
        <div className="bg-surface rounded-3xl p-6 border border-outline-variant shadow-sm w-full overflow-hidden">
          <h3 className="font-bold flex items-center gap-2 mb-4 uppercase text-sm tracking-widest text-outline">
            <Zap className="w-4 h-4" /> Live Feed (Vừa Nộp Bài)
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            <AnimatePresence>
              {players
                .filter(p => !p.isHost && p.hasSubmitted)
                .sort((a, b) => (a.lastScoreIncrement ?? 0) - (b.lastScoreIncrement ?? 0))
                .map(p => (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="flex shrink-0 flex-col items-center justify-center bg-emerald-500/10 border-2 border-emerald-500/30 px-6 py-2 rounded-2xl min-w-[120px]"
                  >
                    <span className="font-bold text-lg truncate max-w-[100px] text-on-surface">{p.name}</span>
                    <span className={`font-black ${(p.lastScoreIncrement ?? 0) > 0 ? "text-emerald-500" : "text-zinc-400"}`}>
                      {(p.lastScoreIncrement ?? 0) > 0 ? `+${p.lastScoreIncrement}` : "+0"}
                    </span>
                  </motion.div>
                ))}
            </AnimatePresence>
            {players.filter(p => !p.isHost && !p.hasSubmitted).length > 0 && (
              <div className="flex shrink-0 items-center text-on-surface-variant/50 italic px-4">
                Đang chờ những người khác...
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
    const t = setTimeout(() => setShowNewScore(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const sortedPlayers = [...players].filter(p => !p.isHost).sort((a, b) => {
    const aScore = showNewScore ? (a.score ?? 0) : ((a.score ?? 0) - (a.lastScoreIncrement ?? 0));
    const bScore = showNewScore ? (b.score ?? 0) : ((b.score ?? 0) - (b.lastScoreIncrement ?? 0));
    return bScore - aScore;
  });

  const correctDisplay = React.useMemo(() => {
    if (!scenario) return "";
    if (scenario.type === "choice") {
      const fullOpt = scenario.options?.find(o => o.startsWith(scenario.correctAnswer));
      return fullOpt ?? `Đáp án ${scenario.correctAnswer}`;
    }
    return scenario.correctAnswer;
  }, [scenario]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl w-full px-4 mx-auto space-y-6 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
        <CheckCircle2 className="w-4 h-4" /> Kết Quả Vòng {room.currentRound}/{SCENARIOS.length}
      </div>

      <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-3xl p-6 md:p-8">
        <span className="text-xs uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400 block mb-2">
          Đáp án chính xác
        </span>
        <h3 className="text-2xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-4 leading-tight">
          {correctDisplay}
        </h3>
        <p className="text-on-surface-variant text-base md:text-lg leading-relaxed bg-surface/60 p-4 rounded-2xl border border-emerald-500/20">
          {scenario?.description}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 w-full max-w-xl mx-auto">
        <h3 className="font-bold text-xl uppercase tracking-widest text-primary mb-2 flex items-center justify-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" /> Bảng Xếp Hạng Hiện Tại
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
              className={`flex items-center justify-between bg-surface-variant/30 px-6 py-4 rounded-2xl border-2 shadow-sm w-full
                ${index === 0 ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20" : "border-outline-variant"}
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md
                  ${index === 0 ? "bg-amber-500" : index === 1 ? "bg-slate-400" : index === 2 ? "bg-amber-700" : "bg-primary"}
                `}>
                  {index + 1}
                </div>
                <span className="font-bold text-xl text-on-surface truncate max-w-[150px]">{p.name}</span>
              </div>
              <div className="flex items-center gap-4 font-mono font-bold text-2xl">
                {diff > 0 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={showNewScore ? { opacity: 0, y: -20, scale: 0.5 } : { opacity: 1, y: 0, scale: 1 }}
                    className="text-emerald-500 text-lg"
                  >
                    +{diff}
                  </motion.span>
                )}
                <motion.span
                  animate={showNewScore && diff > 0 ? { scale: [1, 1.2, 1], color: ["#10b981", "#10b981", "#primary"] } : {}}
                  transition={{ duration: 0.5 }}
                  className={showNewScore && diff > 0 ? "text-emerald-500" : "text-on-surface"}
                >
                  <AnimatedNumber value={showNewScore ? currentScore : prevScore} />
                </motion.span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-8">
        {isHost ? (
          <button
            onClick={onNextRound}
            className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg active:scale-95 flex items-center gap-2 mx-auto"
          >
            {room.currentRound >= SCENARIOS.length ? "Xem Tổng Kết Chung Cuộc 🏆" : "Bắt Đầu Vòng Tiếp Theo ➔"}
          </button>
        ) : (
          <p className="text-on-surface-variant">Đang chờ chủ phòng chuyển sang vòng kế tiếp...</p>
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

  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl w-full mx-auto text-center space-y-8">
      <div className="bg-primary/10 p-10 rounded-[40px] border-4 border-primary/20 shadow-2xl">
        <Trophy className="w-20 h-20 text-amber-500 mx-auto mb-4 animate-bounce" />
        <h1 className="text-4xl font-headline font-extrabold text-on-surface">BẢNG VÀNG VINH DANH</h1>
        <p className="text-on-surface-variant mt-2 text-lg">Hoàn thành xuất sắc toàn bộ {SCENARIOS.length} vòng thi Tư tưởng Hồ Chí Minh</p>
      </div>

      <div className="space-y-3">
        {sorted.map((p, i) => (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            key={p._id}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 ${
              i === 0
                ? "bg-amber-50 dark:bg-amber-950/20 border-amber-300 shadow-lg"
                : i === 1
                ? "bg-slate-50 dark:bg-slate-900/20 border-slate-300"
                : i === 2
                ? "bg-orange-50 dark:bg-orange-950/20 border-orange-300"
                : "bg-surface border-outline-variant"
            }`}
          >
            <span className={`w-12 h-12 flex items-center justify-center rounded-full font-black text-xl ${
              i === 0 ? "bg-amber-400 text-white" : i === 1 ? "bg-slate-400 text-white" : i === 2 ? "bg-amber-700 text-white" : "bg-surface-variant text-on-surface"
            }`}>
              {i + 1}
            </span>
            <span className="flex-1 text-left font-bold text-xl truncate">{p.name}</span>
            <div className="text-right">
              <div className="text-2xl font-mono font-black text-primary">{p.score ?? 0}</div>
              <div className="text-[10px] uppercase font-bold text-outline">Điểm tích lũy</div>
            </div>
          </motion.div>
        ))}
      </div>

      <button onClick={onPlayAgain} className="bg-primary text-on-primary px-12 py-5 rounded-2xl font-bold text-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto">
        <LogOut /> Quay lại sảnh chờ
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

  const lobbyAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const [lobbyMusicEnabled, setLobbyMusicEnabled] = useState(true);

  const [playerId, setPlayerId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("gameSession");
      return stored ? JSON.parse(stored).playerId : null;
    } catch { return null; }
  });
  const [roomId, setRoomId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("gameSession");
      return stored ? JSON.parse(stored).roomId : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (playerId && roomId) {
      localStorage.setItem("gameSession", JSON.stringify({ playerId, roomId }));
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
    localStorage.removeItem("gameSession");
    setPlayerId(null);
    setRoomId(null);
    setError(null);
  }

  async function handleLeaveGame() {
    if (!playerId) {
      clearSession();
      return;
    }
    try {
      await leaveRoomMutation({ playerId: playerId as Id<"mlnPlayers"> });
    } catch { } finally { clearSession(); }
  }

  async function handleCreateRoom(hostName: string, password?: string) {
    if (password !== "Admin@123") {
      setError("Mật khẩu chủ phòng không chính xác!");
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
    try {
      setLoading(true);
      setError(null);
      const result = await joinRoomMutation({ code, name });
      setPlayerId(result.playerId);
      setRoomId(result.roomId);
    } catch (e: any) { setError(e.message || "Lỗi tham gia"); } finally { setLoading(false); }
  }

  async function handleStartGame() {
    try {
      await startGameMutation({ roomId: roomId as Id<"mlnRooms">, playerId: playerId as Id<"mlnPlayers"> });
    } catch (e: any) { setError(e.message || "Lỗi bắt đầu"); }
  }

  const handleAnswerSubmit = async (val: string, quickScore: number) => {
    try {
      await submitAnswerMutation({
        playerId: playerId as Id<"mlnPlayers">,
        answer: val,
        scoreIncrement: quickScore
      });
    } catch (e: any) {
      console.error("Lỗi gửi đáp án", e);
      setError(e.message || "Lỗi gửi đáp án. Vui lòng thử lại!");
    }
  };

  async function handleForceProcessRound() {
    try {
      await forceProcessRoundMutation({ roomId: roomId as Id<"mlnRooms">, playerId: playerId as Id<"mlnPlayers"> });
    } catch (e: any) { setError(e.message || "Không thể kết thúc vòng"); }
  }

  async function handleEndGame() {
    try {
      await endGameMutation({ roomId: roomId as Id<"mlnRooms">, playerId: playerId as Id<"mlnPlayers"> });
    } catch (e: any) { setError(e.message || "Lỗi kết thúc trò chơi"); }
  }

  async function handleNextRound() {
    try {
      await nextRoundMutation({ roomId: roomId as Id<"mlnRooms">, playerId: playerId as Id<"mlnPlayers"> });
    } catch (e: any) { setError(e.message || "Không thể chuyển vòng"); }
  }

  const isHost = currentPlayer?.isHost ?? false;
  const isInRoom = roomId && playerId && room && currentPlayer;

  // Audio Playback Logic
  useEffect(() => {
    const lobbyAudio = lobbyAudioRef.current;
    const gameAudio = gameAudioRef.current;
    const winAudio = winAudioRef.current;

    if (!lobbyAudio || !gameAudio || !winAudio) return;

    lobbyAudio.pause();
    gameAudio.pause();
    winAudio.pause();

    if (lobbyMusicEnabled) {
      if (!isInRoom || room?.status === "lobby") {
        lobbyAudio.play().catch(() => {});
      } else if (room?.status === "playing") {
        gameAudio.play().catch(() => {});
      } else if (room?.status === "finished") {
        winAudio.play().catch(() => {});
      }
    }
  }, [isInRoom, room?.status, lobbyMusicEnabled]);

  let content: React.ReactNode;

  if (!isInRoom) {
    content = <LobbyView onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} error={error} loading={loading} />;
  } else if (room.status === "lobby") {
    content = <WaitingRoom room={room} players={players ?? []} isHost={isHost} onStart={handleStartGame} onLeave={handleLeaveGame} musicEnabled={lobbyMusicEnabled} onToggleMusic={() => setLobbyMusicEnabled(v => !v)} />;
  } else if (room.status === "playing" && room.phase === "choosing") {
    content = <GameplayView room={room} currentPlayer={currentPlayer} players={players ?? []} onChoice={handleAnswerSubmit} onForceRound={handleForceProcessRound} onEndGame={handleEndGame} />;
  } else if (room.status === "playing" && room.phase === "results") {
    content = <RoundResultsView room={room} players={players ?? []} isHost={isHost} onNextRound={handleNextRound} />;
  } else if (room.status === "finished") {
    content = <FinalResultsView players={players ?? []} onPlayAgain={handleLeaveGame} />;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start pt-20 pb-12 bg-background">
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full" />
      </div>

      <audio ref={lobbyAudioRef} src={ovtkMp3} loop muted={!lobbyMusicEnabled} />
      <audio ref={gameAudioRef} src={liberationMp3} loop muted={!lobbyMusicEnabled} />
      <audio ref={winAudioRef} src={winMp3} muted={!lobbyMusicEnabled} />

      {/* Top Bar */}
      <div className="w-full max-w-5xl px-4 flex justify-between items-center mb-8 relative z-10">
        {isInRoom && room.status !== "lobby" && (
          <div className="bg-surface/80 backdrop-blur px-6 py-2 rounded-full border border-outline-variant shadow-sm font-bold text-primary">
            Phòng: {room.code}
          </div>
        )}
        <div className="ml-auto flex gap-3">
          <button onClick={() => setShowRules(true)} className="p-3 bg-surface rounded-full border border-outline-variant shadow-sm hover:text-primary transition-colors">
            <BookOpen className="w-6 h-6" />
          </button>
        </div>
      </div>

      {error && isInRoom && (
        <div className="relative z-10 max-w-md mx-auto mb-4 bg-red-500/10 border border-red-500/30 text-red-600 px-5 py-3 rounded-xl text-center font-medium text-sm">
          {error}
        </div>
      )}

      <div className="relative z-10 w-full flex flex-col items-center">
        {content}
      </div>

      <RulesModal show={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
}
