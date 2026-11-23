import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Pause,
  Play,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { CURRICULUM_PROBLEMS } from '../../data/problems';
import type {
  ProblemDifficulty,
  ProblemPpcChartData,
  UnitId,
} from '../../types/curriculum';

interface Unit06ProblemSetProps {
  onJumpToUnit: (unitId: UnitId) => void;
}

const CIRCLE_NUMS = ['①', '②', '③', '④', '⑤'];

const ProblemPpcGraphic: React.FC<{ ppc: ProblemPpcChartData }> = ({ ppc }) => {
  const maxX = Math.max(ppc.aMaxX, ppc.bMaxX) * 1.15;
  const maxY = Math.max(ppc.aMaxY, ppc.bMaxY) * 1.15;
  const width = 460;
  const height = 300;
  const padL = 62;
  const padR = 26;
  const padT = 26;
  const padB = 52;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const mx = (v: number) => padL + (v / maxX) * plotW;
  const my = (v: number) => padT + plotH - (v / maxY) * plotH;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-[480px] h-auto bg-white rounded-xl border border-[#D5E0EC]"
      role="img"
      aria-label="문항 생산가능곡선 그래프"
    >
      <line x1={mx(0)} y1={padT} x2={mx(0)} y2={my(0)} stroke="#10233F" strokeWidth="2.5" />
      <line x1={mx(0)} y1={my(0)} x2={padL + plotW} y2={my(0)} stroke="#10233F" strokeWidth="2.5" />

      {/* Country A */}
      <line
        x1={mx(0)}
        y1={my(ppc.aMaxY)}
        x2={mx(ppc.aMaxX)}
        y2={my(0)}
        stroke="#235E91"
        strokeWidth="4"
      />
      {/* Country B */}
      <line
        x1={mx(0)}
        y1={my(ppc.bMaxY)}
        x2={mx(ppc.bMaxX)}
        y2={my(0)}
        stroke="#D97706"
        strokeWidth="4"
      />

      {/* Y Intercepts */}
      <text x={mx(0) - 10} y={my(ppc.aMaxY) + 5} textAnchor="end" fontSize="16" fontWeight="700" fill="#235E91">
        {ppc.aMaxY}
      </text>
      <text x={mx(0) - 10} y={my(ppc.bMaxY) + 5} textAnchor="end" fontSize="16" fontWeight="700" fill="#D97706">
        {ppc.bMaxY}
      </text>

      {/* X Intercepts */}
      <text x={mx(ppc.aMaxX)} y={my(0) + 22} textAnchor="middle" fontSize="16" fontWeight="700" fill="#235E91">
        {ppc.aMaxX}
      </text>
      <text x={mx(ppc.bMaxX)} y={my(0) + 22} textAnchor="middle" fontSize="16" fontWeight="700" fill="#D97706">
        {ppc.bMaxX}
      </text>

      <text x={mx(0) - 10} y={my(0) + 20} textAnchor="end" fontSize="15" fontWeight="600" fill="#4B617B">
        0
      </text>

      {/* Line Labels */}
      <text x={mx(ppc.aMaxX * 0.35)} y={my(ppc.aMaxY * 0.65) - 10} fontSize="16" fontWeight="800" fill="#235E91">
        {ppc.countryAName}
      </text>
      <text x={mx(ppc.bMaxX * 0.62)} y={my(ppc.bMaxY * 0.38) - 10} fontSize="16" fontWeight="800" fill="#D97706">
        {ppc.countryBName}
      </text>

      {/* Axis Labels */}
      <text x={padL + 8} y={padT + 8} fontSize="15" fontWeight="700" fill="#10233F">
        {ppc.goodYLabel}
      </text>
      <text x={padL + plotW} y={height - 10} textAnchor="end" fontSize="15" fontWeight="700" fill="#10233F">
        {ppc.goodXLabel}
      </text>
    </svg>
  );
};

export const Unit06ProblemSet: React.FC<Unit06ProblemSetProps> = ({ onJumpToUnit }) => {
  const [kindFilter, setKindFilter] = useState<'all' | 'mcq' | 'essay'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'전체' | ProblemDifficulty>('전체');
  const [activeProblemId, setActiveProblemId] = useState<string>(CURRICULUM_PROBLEMS[0].id);

  // Per-problem state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [essayDrafts, setEssayDrafts] = useState<Record<string, string>>({});
  const [revealedAnswerMap, setRevealedAnswerMap] = useState<Record<string, boolean>>({});
  const [revealedStepMap, setRevealedStepMap] = useState<Record<string, number>>({});
  const [essayRevealMap, setEssayRevealMap] = useState<
    Record<string, { keywords: boolean; rubric: boolean; model: boolean }>
  >({});

  // Classroom Timer State (seconds)
  const [timerPresetSec, setTimerPresetSec] = useState<number>(120);
  const [remainingSec, setRemainingSec] = useState<number>(120);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isTimerRunning) return;
    const id = window.setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isTimerRunning]);

  const filteredProblems = useMemo(() => {
    return CURRICULUM_PROBLEMS.filter((p) => {
      if (kindFilter !== 'all' && p.kind !== kindFilter) return false;
      if (difficultyFilter !== '전체' && p.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [kindFilter, difficultyFilter]);

  const activeProblem =
    filteredProblems.find((p) => p.id === activeProblemId) ??
    filteredProblems[0] ??
    CURRICULUM_PROBLEMS[0];

  const isAnswerRevealed = Boolean(revealedAnswerMap[activeProblem.id]);
  const currentStepCount = revealedStepMap[activeProblem.id] ?? 0;
  const totalSteps = activeProblem.calculationSteps.length;

  const selectedChoiceIdx = selectedAnswers[activeProblem.id];
  const essayState = essayRevealMap[activeProblem.id] ?? {
    keywords: false,
    rubric: false,
    model: false,
  };

  const setTimerPreset = (seconds: number) => {
    setIsTimerRunning(false);
    setTimerPresetSec(seconds);
    setRemainingSec(seconds);
  };

  const formatClock = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleResetProblem = () => {
    const id = activeProblem.id;
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setEssayDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setRevealedAnswerMap((prev) => ({ ...prev, [id]: false }));
    setRevealedStepMap((prev) => ({ ...prev, [id]: 0 }));
    setEssayRevealMap((prev) => ({
      ...prev,
      [id]: { keywords: false, rubric: false, model: false },
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header + Classroom Timer */}
      <div className="pb-6 border-b border-[#D5E0EC] flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-lg font-bold text-[#1D9A97]">UNIT 06 · 개념 확인과 실전 문제풀이</p>
          <h1 className="text-4xl font-extrabold text-[#10233F] mt-1">
            실전 자료 해석 · 계산 · 서술형 문제풀이
          </h1>
          <p className="text-2xl text-[#4B617B] mt-2">
            수업 타이머로 풀이 시간을 재고, 계산 과정과 선택지별 해설을 단계별로 공개하세요.
          </p>
        </div>

        {/* Classroom Timer Control */}
        <div
          aria-label="문제풀이 타이머"
          className="bg-[#10233F] text-white rounded-2xl px-5 py-3.5 flex flex-wrap items-center gap-3 shadow-sm"
        >
          <Clock className="w-6 h-6 text-[#8CE4D9]" />
          <span
            data-testid="problem-timer-display"
            className={`text-3xl font-extrabold font-math tabular-nums ${
              remainingSec === 0 ? 'text-amber-300' : 'text-white'
            }`}
          >
            {formatClock(remainingSec)}
          </span>

          <div className="flex items-center gap-1.5 ml-2">
            {[
              { label: '2분', sec: 120 },
              { label: '3분', sec: 180 },
              { label: '5분', sec: 300 },
            ].map((t) => (
              <button
                key={t.sec}
                type="button"
                onClick={() => setTimerPreset(t.sec)}
                className={`px-3 py-1.5 rounded-lg text-base font-bold cursor-pointer ${
                  timerPresetSec === t.sec
                    ? 'bg-[#1D9A97] text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsTimerRunning((r) => !r)}
            aria-label={isTimerRunning ? '타이머 일시정지' : '타이머 시작'}
            className="px-3.5 py-1.5 rounded-lg bg-white text-[#10233F] text-base font-bold flex items-center gap-1 cursor-pointer"
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isTimerRunning ? '정지' : '시작'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsTimerRunning(false);
              setRemainingSec(timerPresetSec);
            }}
            aria-label="타이머 초기화"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters & Problem Selector Strip */}
      <div className="bg-white rounded-2xl border border-[#D5E0EC] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="문항 형식 필터">
            {[
              { id: 'all', label: '전체 문항 (16)' },
              { id: 'mcq', label: '객관식 (12)' },
              { id: 'essay', label: '서술형 (4)' },
            ].map((k) => (
              <button
                key={k.id}
                type="button"
                role="tab"
                aria-selected={kindFilter === k.id}
                onClick={() => setKindFilter(k.id as 'all' | 'mcq' | 'essay')}
                className={`px-4 py-2 rounded-lg text-lg font-bold cursor-pointer ${
                  kindFilter === k.id
                    ? 'bg-[#10233F] text-white'
                    : 'bg-[#F0F4F9] text-[#354C66] hover:text-[#10233F]'
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="난이도 필터">
            {(['전체', '기초', '기본', '심화'] as const).map((d) => (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={difficultyFilter === d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-4 py-2 rounded-lg text-lg font-bold cursor-pointer ${
                  difficultyFilter === d
                    ? 'bg-[#1D9A97] text-white'
                    : 'bg-[#F0F4F9] text-[#354C66] hover:text-[#10233F]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Numbered Problem Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#E6EEF7]">
          <span className="text-base font-bold text-[#4B617B] mr-1">문항 선택:</span>
          {filteredProblems.map((p) => {
            const isCurrent = p.id === activeProblem.id;
            const numLabel = p.number < 10 ? `0${p.number}` : String(p.number);
            return (
              <button
                key={p.id}
                type="button"
                title={`${numLabel}. ${p.category} (${p.difficulty})`}
                aria-label={`문항 ${numLabel} ${p.category} ${p.difficulty}`}
                onClick={() => setActiveProblemId(p.id)}
                className={`px-3.5 py-2 rounded-lg border text-lg font-extrabold tabular-nums cursor-pointer transition-colors ${
                  isCurrent
                    ? 'bg-[#235E91] text-white border-[#235E91]'
                    : 'bg-[#F7F9FC] text-[#10233F] border-[#D5E0EC] hover:border-[#235E91]'
                }`}
              >
                {numLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Problem Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left: Question Stem, Materials, Choices / Essay Box */}
        <section
          aria-label="문항 내용 및 풀이"
          className="xl:col-span-7 bg-white rounded-2xl border border-[#D5E0EC] p-8 space-y-6"
        >
          {/* Quiet Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E6EEF7]">
            <div className="flex flex-wrap items-center gap-2 text-lg font-bold text-[#235E91]">
              <span>문항 {activeProblem.number < 10 ? `0${activeProblem.number}` : activeProblem.number}</span>
              <span aria-hidden="true">·</span>
              <span>{activeProblem.kind === 'mcq' ? '객관식' : '서술형'}</span>
              <span aria-hidden="true">·</span>
              <span>{activeProblem.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#1D9A97]">{activeProblem.difficulty}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetProblem}
                className="px-3.5 py-2 rounded-lg border border-[#D5E0EC] bg-[#F7F9FC] hover:bg-[#EAF1F8] text-[#10233F] text-base font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>문제 초기화</span>
              </button>
              <button
                type="button"
                onClick={() => onJumpToUnit(activeProblem.relatedUnitId)}
                className="px-3.5 py-2 rounded-lg bg-[#EEF5FC] hover:bg-[#DCEAF9] text-[#235E91] text-base font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>{activeProblem.relatedConceptLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stem */}
          <h2 className="text-2xl md:text-[26px] font-extrabold text-[#10233F] leading-snug">
            {activeProblem.stem}
          </h2>

          {/* Passage */}
          {activeProblem.passage && (
            <div className="bg-[#F7F9FC] rounded-xl border border-[#D5E0EC] p-6 text-xl text-[#1E3552] leading-relaxed whitespace-pre-line">
              {activeProblem.passage}
            </div>
          )}

          {/* Table Data */}
          {activeProblem.tableData && (
            <div className="space-y-2">
              <p className="text-lg font-bold text-[#354C66]">{activeProblem.tableData.caption}</p>
              <table className="w-full border-collapse text-center">
                <thead>
                  <tr className="bg-[#10233F] text-white">
                    {activeProblem.tableData.headers.map((h) => (
                      <th key={h} className="py-3 px-4 text-lg font-bold border border-[#235E91]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeProblem.tableData.rows.map((row) => (
                    <tr key={row[0]} className="bg-[#F7F9FC] even:bg-white">
                      {row.map((cell, idx) => (
                        <td
                          key={`${row[0]}-${idx}`}
                          className={`py-3.5 px-4 text-xl border border-[#D5E0EC] tabular-nums ${
                            idx === 0 ? 'font-extrabold text-[#10233F]' : 'font-bold text-[#235E91]'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PPC Graphic */}
          {activeProblem.ppcData && (
            <div className="flex justify-center py-2">
              <ProblemPpcGraphic ppc={activeProblem.ppcData} />
            </div>
          )}

          {/* <보기> Statements */}
          {activeProblem.kind === 'mcq' && activeProblem.statements && (
            <div className="bg-[#F9FBFD] rounded-xl border border-[#CBD7E6] p-6 space-y-3">
              <div className="text-lg font-extrabold text-[#10233F]">보기</div>
              {activeProblem.statements.map((st) => (
                <div key={st.label} className="text-xl text-[#1E3552] leading-relaxed">
                  <strong className="text-[#235E91] mr-2">{st.label}.</strong>
                  <span>{st.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* MCQ Choices */}
          {activeProblem.kind === 'mcq' && (
            <div className="space-y-3 pt-2" role="radiogroup" aria-label="객관식 선택지">
              {activeProblem.choices.map((choice, idx) => {
                const isSelected = selectedChoiceIdx === idx;
                const isCorrectChoice = idx === activeProblem.correctIndex;
                let styleClass =
                  'bg-[#F7F9FC] border-[#D5E0EC] text-[#10233F] hover:border-[#235E91]';

                if (isAnswerRevealed) {
                  if (isCorrectChoice) {
                    styleClass = 'bg-[#DDF4EF] border-[#1D9A97] text-[#10233F]';
                  } else if (isSelected && !isCorrectChoice) {
                    styleClass = 'bg-red-50 border-red-400 text-red-950';
                  }
                } else if (isSelected) {
                  styleClass = 'bg-[#10233F] border-[#10233F] text-white';
                }

                return (
                  <button
                    key={choice}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() =>
                      setSelectedAnswers((prev) => ({ ...prev, [activeProblem.id]: idx }))
                    }
                    className={`w-full text-left px-5 py-4 rounded-xl border text-xl font-semibold flex items-start justify-between gap-3 transition-colors cursor-pointer ${styleClass}`}
                  >
                    <span>
                      <strong className="mr-2.5">{CIRCLE_NUMS[idx]}</strong>
                      {choice}
                    </span>
                    {isAnswerRevealed && isCorrectChoice && (
                      <CheckCircle2 className="w-6 h-6 text-[#1D9A97] shrink-0 mt-0.5" />
                    )}
                    {isAnswerRevealed && isSelected && !isCorrectChoice && (
                      <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Essay Answer Input */}
          {activeProblem.kind === 'essay' && (
            <div className="space-y-3">
              <label
                htmlFor="essay-student-input"
                className="block text-xl font-bold text-[#10233F]"
              >
                학생 답안 작성란 (수업 중 칠판에 함께 정리해 보세요)
              </label>
              <textarea
                id="essay-student-input"
                rows={4}
                placeholder="핵심 개념과 기회비용 근거를 포함하여 답안을 작성해 보세요..."
                value={essayDrafts[activeProblem.id] ?? ''}
                onChange={(e) =>
                  setEssayDrafts((prev) => ({ ...prev, [activeProblem.id]: e.target.value }))
                }
                className="w-full p-4 rounded-xl border border-[#CBD7E6] bg-[#F7F9FC] text-xl text-[#10233F] leading-relaxed focus:outline-none focus:border-[#1D9A97]"
              />
            </div>
          )}
        </section>

        {/* Right: Teacher Solution & Progressive Explanation Panel */}
        <section
          aria-label="정답 및 단계별 해설"
          className="xl:col-span-5 bg-white rounded-2xl border border-[#D5E0EC] p-7 space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6EEF7]">
            <h3 className="text-2xl font-extrabold text-[#10233F]">교사용 정답 · 해설 제어</h3>

            {activeProblem.kind === 'mcq' && (
              <button
                type="button"
                onClick={() =>
                  setRevealedAnswerMap((prev) => ({
                    ...prev,
                    [activeProblem.id]: !isAnswerRevealed,
                  }))
                }
                className={`px-5 py-2.5 rounded-xl text-lg font-bold flex items-center gap-2 cursor-pointer ${
                  isAnswerRevealed
                    ? 'bg-[#10233F] text-white'
                    : 'bg-[#1D9A97] hover:bg-[#17827F] text-white'
                }`}
              >
                {isAnswerRevealed ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                <span>{isAnswerRevealed ? '정답 가리기' : '정답 공개'}</span>
              </button>
            )}
          </div>

          {/* Step-by-Step Calculation Disclosure */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xl font-bold text-[#10233F]">
                계산·추론 과정 ({currentStepCount}/{totalSteps}단계)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentStepCount >= totalSteps}
                  onClick={() =>
                    setRevealedStepMap((prev) => ({
                      ...prev,
                      [activeProblem.id]: Math.min(totalSteps, currentStepCount + 1),
                    }))
                  }
                  className="px-3.5 py-2 rounded-lg bg-[#235E91] hover:bg-[#10233F] disabled:opacity-40 text-white text-base font-bold cursor-pointer"
                >
                  +1단계 공개
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setRevealedStepMap((prev) => ({
                      ...prev,
                      [activeProblem.id]: currentStepCount === totalSteps ? 0 : totalSteps,
                    }))
                  }
                  className="px-3.5 py-2 rounded-lg border border-[#D5E0EC] bg-[#F7F9FC] text-[#10233F] text-base font-bold cursor-pointer"
                >
                  {currentStepCount === totalSteps ? '과정 숨기기' : '전체 과정'}
                </button>
              </div>
            </div>

            {currentStepCount === 0 ? (
              <div className="p-5 rounded-xl bg-[#F7F9FC] border border-dashed border-[#CBD7E6] text-lg text-[#4B617B]">
                계산 과정이 숨겨져 있습니다. [+1단계 공개] 버튼을 눌러 풀이 순서를 안내하세요.
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeProblem.calculationSteps.slice(0, currentStepCount).map((step) => (
                  <div
                    key={step}
                    className="p-4 rounded-xl bg-[#EEF5FC] border border-[#C6DCF2] text-xl text-[#10233F] leading-relaxed"
                  >
                    {step}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MCQ Answer & Choice Explanations */}
          {activeProblem.kind === 'mcq' && isAnswerRevealed && (
            <div className="space-y-4 pt-4 border-t border-[#E6EEF7]">
              <div className="p-5 rounded-xl bg-[#10233F] text-white">
                <div className="text-base font-bold text-[#8CE4D9]">정답 확인</div>
                <div className="text-3xl font-extrabold mt-1">
                  정답: {CIRCLE_NUMS[activeProblem.correctIndex]}
                </div>
                {selectedChoiceIdx !== undefined && (
                  <div className="text-lg mt-2 text-[#DDF4EF]">
                    {selectedChoiceIdx === activeProblem.correctIndex
                      ? '선택한 답안이 정확합니다!'
                      : `선택한 답안(${CIRCLE_NUMS[selectedChoiceIdx]})은 오답입니다. 아래 선택지별 해설을 확인하세요.`}
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xl font-extrabold text-[#10233F]">선택지별 상세 해설</h4>
                {activeProblem.choiceExplanations.map((exp) => (
                  <p
                    key={exp}
                    className="p-3.5 rounded-lg bg-[#F7F9FC] border border-[#E1EAF3] text-lg text-[#1E3552] leading-relaxed"
                  >
                    {exp}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Essay Progressive Disclosure: Keywords / Grading Criteria / Model Answer */}
          {activeProblem.kind === 'essay' && (
            <div className="space-y-4 pt-4 border-t border-[#E6EEF7]">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEssayRevealMap((prev) => ({
                      ...prev,
                      [activeProblem.id]: { ...essayState, keywords: !essayState.keywords },
                    }))
                  }
                  className={`px-4 py-2.5 rounded-xl text-base font-bold cursor-pointer ${
                    essayState.keywords
                      ? 'bg-[#10233F] text-white'
                      : 'bg-[#DDF4EF] text-[#10233F]'
                  }`}
                >
                  {essayState.keywords ? '핵심 키워드 숨기기' : '핵심 키워드 공개'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEssayRevealMap((prev) => ({
                      ...prev,
                      [activeProblem.id]: { ...essayState, rubric: !essayState.rubric },
                    }))
                  }
                  className={`px-4 py-2.5 rounded-xl text-base font-bold cursor-pointer ${
                    essayState.rubric
                      ? 'bg-[#10233F] text-white'
                      : 'bg-[#EEF5FC] text-[#10233F]'
                  }`}
                >
                  {essayState.rubric ? '채점 요소 숨기기' : '채점 요소 공개'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEssayRevealMap((prev) => ({
                      ...prev,
                      [activeProblem.id]: { ...essayState, model: !essayState.model },
                    }))
                  }
                  className={`px-4 py-2.5 rounded-xl text-base font-bold cursor-pointer ${
                    essayState.model
                      ? 'bg-[#10233F] text-white'
                      : 'bg-[#1D9A97] text-white'
                  }`}
                >
                  {essayState.model ? '예시 답안 숨기기' : '예시 답안 공개'}
                </button>
              </div>

              {essayState.keywords && (
                <div className="p-5 rounded-xl bg-[#F2FBF9] border border-[#BFE6DE]">
                  <h4 className="text-lg font-extrabold text-[#1D9A97] mb-2">필수 핵심 키워드</h4>
                  <p className="text-xl font-bold text-[#10233F]">
                    {activeProblem.keywords.join(' · ')}
                  </p>
                </div>
              )}

              {essayState.rubric && (
                <div className="p-5 rounded-xl bg-[#F7F9FC] border border-[#D5E0EC] space-y-2">
                  <h4 className="text-lg font-extrabold text-[#235E91]">서술형 채점 요소</h4>
                  {activeProblem.gradingCriteria.map((g) => (
                    <p key={g} className="text-lg text-[#1E3552] leading-relaxed">
                      • {g}
                    </p>
                  ))}
                </div>
              )}

              {essayState.model && (
                <div className="p-5 rounded-xl bg-[#10233F] text-white space-y-2">
                  <h4 className="text-lg font-extrabold text-[#8CE4D9]">예시 답안</h4>
                  <p className="text-xl leading-relaxed whitespace-pre-line">
                    {activeProblem.modelAnswer}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Common Misconception Warning */}
          <div className="p-5 rounded-xl bg-amber-50 border border-amber-300">
            <h4 className="text-lg font-extrabold text-amber-900">주의할 오개념</h4>
            <p className="text-lg text-amber-950 mt-1.5 leading-relaxed">
              {activeProblem.misconceptionNote}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
