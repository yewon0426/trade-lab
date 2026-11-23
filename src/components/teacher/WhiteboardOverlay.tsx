import React, { useEffect, useRef, useState } from 'react';
import { Eraser, Highlighter, PenTool, Trash2, X } from 'lucide-react';

type ToolType = 'pen' | 'highlighter' | 'eraser';

interface Stroke {
  tool: ToolType;
  color: string;
  size: number;
  points: { x: number; y: number }[];
}

interface WhiteboardOverlayProps {
  isActive: boolean;
  onClose: () => void;
}

const PEN_COLORS = [
  { id: 'navy', label: '네이비', hex: '#10233F' },
  { id: 'crimson', label: '강조 레드', hex: '#DC2626' },
  { id: 'teal', label: '틸 그린', hex: '#1D9A97' },
];

export const WhiteboardOverlay: React.FC<WhiteboardOverlayProps> = ({ isActive, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<ToolType>('pen');
  const [penColor, setPenColor] = useState<string>('#DC2626');
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const [strokeCount, setStrokeCount] = useState(0);

  const redrawAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const allStrokes = currentStrokeRef.current
      ? [...strokesRef.current, currentStrokeRef.current]
      : strokesRef.current;

    for (const s of allStrokes) {
      if (s.points.length === 0) continue;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (s.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = s.size;
      } else if (s.tool === 'highlighter') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.34;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
      }

      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i].x, s.points[i].y);
      }
      if (s.points.length === 1) {
        ctx.lineTo(s.points[0].x + 0.1, s.points[0].y + 0.1);
      }
      ctx.stroke();
      ctx.restore();
    }
  };

  useEffect(() => {
    const syncCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      redrawAll();
    };

    syncCanvasSize();
    window.addEventListener('resize', syncCanvasSize);
    return () => window.removeEventListener('resize', syncCanvasSize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isActive) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const strokeColor = tool === 'highlighter' ? '#FACC15' : penColor;
    const size = tool === 'highlighter' ? 24 : tool === 'eraser' ? 32 : 4;

    currentStrokeRef.current = {
      tool,
      color: strokeColor,
      size,
      points: [{ x, y }],
    };
    redrawAll();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isActive || !currentStrokeRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    currentStrokeRef.current.points.push({ x, y });
    redrawAll();
  };

  const handlePointerUp = () => {
    if (!currentStrokeRef.current) return;
    strokesRef.current.push(currentStrokeRef.current);
    currentStrokeRef.current = null;
    setStrokeCount(strokesRef.current.length);
    redrawAll();
  };

  const handleClear = () => {
    strokesRef.current = [];
    currentStrokeRef.current = null;
    setStrokeCount(0);
    redrawAll();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        data-testid="whiteboard-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`fixed inset-0 z-40 touch-none ${
          isActive ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
        }`}
      />

      {isActive && (
        <div
          role="toolbar"
          aria-label="전자칠판 판서 도구"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#10233F] text-white rounded-2xl border border-[#235E91] shadow-2xl px-5 py-3 flex flex-wrap items-center gap-3"
        >
          <button
            type="button"
            onClick={() => setTool('pen')}
            aria-pressed={tool === 'pen'}
            className={`px-4 py-2.5 rounded-xl text-base font-bold flex items-center gap-2 cursor-pointer ${
              tool === 'pen' ? 'bg-[#1D9A97] text-white' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <PenTool className="w-5 h-5" />
            <span>펜</span>
          </button>

          <button
            type="button"
            onClick={() => setTool('highlighter')}
            aria-pressed={tool === 'highlighter'}
            className={`px-4 py-2.5 rounded-xl text-base font-bold flex items-center gap-2 cursor-pointer ${
              tool === 'highlighter'
                ? 'bg-[#EAB308] text-[#10233F]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Highlighter className="w-5 h-5" />
            <span>형광펜</span>
          </button>

          <button
            type="button"
            onClick={() => setTool('eraser')}
            aria-pressed={tool === 'eraser'}
            className={`px-4 py-2.5 rounded-xl text-base font-bold flex items-center gap-2 cursor-pointer ${
              tool === 'eraser' ? 'bg-white text-[#10233F]' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Eraser className="w-5 h-5" />
            <span>지우개</span>
          </button>

          <div className="h-7 w-px bg-white/20 mx-1" aria-hidden="true" />

          <div className="flex items-center gap-2" role="group" aria-label="펜 색상 선택">
            {PEN_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-label={`펜 색상 ${c.label}`}
                onClick={() => {
                  setPenColor(c.hex);
                  setTool('pen');
                }}
                className={`w-9 h-9 rounded-full border-2 cursor-pointer transition-transform ${
                  penColor === c.hex && tool === 'pen'
                    ? 'border-white scale-110'
                    : 'border-white/40 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          <div className="h-7 w-px bg-white/20 mx-1" aria-hidden="true" />

          <button
            type="button"
            onClick={handleClear}
            disabled={strokeCount === 0}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-red-600 disabled:opacity-40 text-white text-base font-bold flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
            <span>필기 초기화</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white text-[#10233F] hover:bg-[#EAF1F8] text-base font-bold flex items-center gap-2 cursor-pointer"
          >
            <X className="w-5 h-5" />
            <span>판서 종료</span>
          </button>
        </div>
      )}
    </>
  );
};
