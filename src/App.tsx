import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TableOfContentsModal } from './components/layout/TableOfContentsModal';
import { TopNavBar } from './components/layout/TopNavBar';
import { TeacherDrawer } from './components/teacher/TeacherDrawer';
import { WhiteboardOverlay } from './components/teacher/WhiteboardOverlay';
import { Unit01Necessity } from './components/units/Unit01Necessity';
import { Unit02Advantages } from './components/units/Unit02Advantages';
import { LAB_PRESETS, Unit03CalculatorLab } from './components/units/Unit03CalculatorLab';
import { Unit04TradeGainsLab } from './components/units/Unit04TradeGainsLab';
import { Unit05PolicySustainable } from './components/units/Unit05PolicySustainable';
import { Unit06ProblemSet } from './components/units/Unit06ProblemSet';
import { TEACHER_GUIDE_NOTES, UNIT_META_LIST } from './data/unitContent';
import {
  analyzeComparativeAdvantage,
  type LabInputs,
  type TradeSimInputs,
} from './engine/tradeMath';
import type { UnitId } from './types/curriculum';

const STORAGE_KEY = 'trade_lab_textbook_state_v1';

const DEFAULT_LAB_INPUTS: LabInputs = {
  ...LAB_PRESETS[0].inputs,
};

const DEFAULT_SIM_INPUTS: TradeSimInputs = {
  countryAName: '갑국',
  countryBName: '을국',
  goodXName: '옷',
  goodXUnit: '벌',
  goodYName: '쌀',
  goodYUnit: '포대',
  aMaxX: 10,
  aMaxY: 20,
  bMaxX: 5,
  bMaxY: 15,
  autarkyShareXA: 0.5,
  autarkyShareXB: 0.5,
  yPerX: 2.5,
  exportAmountX: 4,
};

interface SavedState {
  activeUnitId: UnitId;
  activeScreenIndex: number;
  showTeacherGuide: boolean;
  labInputs: LabInputs;
  labRevealedSteps: number;
  simInputs: TradeSimInputs;
}

function loadSavedState(): Partial<SavedState> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<SavedState>;
  } catch {
    return {};
  }
}

export default function App() {
  const initial = useMemo(() => loadSavedState(), []);

  const [activeUnitId, setActiveUnitId] = useState<UnitId>(initial.activeUnitId ?? 'unit-01');
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(
    initial.activeScreenIndex ?? 0
  );
  const [showTeacherGuide, setShowTeacherGuide] = useState<boolean>(
    initial.showTeacherGuide ?? false
  );
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAnnotationActive, setIsAnnotationActive] = useState<boolean>(false);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);

  const [labInputs, setLabInputs] = useState<LabInputs>(initial.labInputs ?? DEFAULT_LAB_INPUTS);
  const [labRevealedSteps, setLabRevealedSteps] = useState<number>(
    initial.labRevealedSteps ?? 0
  );
  const [simInputs, setSimInputs] = useState<TradeSimInputs>(
    initial.simInputs ?? DEFAULT_SIM_INPUTS
  );

  // Persist key learning state across navigation & reloads
  useEffect(() => {
    try {
      const payload: SavedState = {
        activeUnitId,
        activeScreenIndex,
        showTeacherGuide,
        labInputs,
        labRevealedSteps,
        simInputs,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }, [activeUnitId, activeScreenIndex, showTeacherGuide, labInputs, labRevealedSteps, simInputs]);

  // Listen to browser fullscreen events
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Flatten all screens across the 6 units for Prev / Next stepping
  const allScreens = useMemo(() => {
    const list: { unitId: UnitId; screenIndex: number; screenId: string }[] = [];
    for (const u of UNIT_META_LIST) {
      u.screens.forEach((s, idx) => {
        list.push({ unitId: u.id, screenIndex: idx, screenId: s.id });
      });
    }
    return list;
  }, []);

  const currentUnit =
    UNIT_META_LIST.find((u) => u.id === activeUnitId) ?? UNIT_META_LIST[0];
  const clampedScreenIdx = Math.min(activeScreenIndex, currentUnit.screens.length - 1);
  const currentScreen = currentUnit.screens[clampedScreenIdx] ?? currentUnit.screens[0];

  const flatIndex = allScreens.findIndex(
    (item) => item.unitId === activeUnitId && item.screenIndex === clampedScreenIdx
  );

  const hasPreviousScreen = flatIndex > 0;
  const hasNextScreen = flatIndex >= 0 && flatIndex < allScreens.length - 1;

  const navigateTo = (unitId: UnitId, screenIdx = 0) => {
    const targetUnit = UNIT_META_LIST.find((u) => u.id === unitId) ?? UNIT_META_LIST[0];
    const safeIdx = Math.max(0, Math.min(screenIdx, targetUnit.screens.length - 1));
    setActiveUnitId(targetUnit.id);
    setActiveScreenIndex(safeIdx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevScreen = () => {
    if (!hasPreviousScreen) return;
    const prev = allScreens[flatIndex - 1];
    navigateTo(prev.unitId, prev.screenIndex);
  };

  const handleNextScreen = () => {
    if (!hasNextScreen) return;
    const next = allScreens[flatIndex + 1];
    navigateTo(next.unitId, next.screenIndex);
  };

  // Keyboard shortcuts for presentation mode & TOC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT';
      if (e.key === 'Escape') {
        if (isTocOpen) {
          setIsTocOpen(false);
        } else if (isPresentationMode) {
          setIsPresentationMode(false);
        }
        return;
      }
      if (!isEditing && isPresentationMode) {
        if (e.key === 'ArrowRight') {
          handleNextScreen();
        } else if (e.key === 'ArrowLeft') {
          handlePrevScreen();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTocOpen, isPresentationMode, flatIndex]);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fallback: toggle presentation mode if iframe blocks native fullscreen
      setIsPresentationMode((prev) => !prev);
    }
  };

  const handleTogglePresentationMode = async () => {
    const next = !isPresentationMode;
    setIsPresentationMode(next);
    if (next && !document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // Safe fallback inside preview iframe
      }
    } else if (!next && document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // Ignore
      }
    }
  };

  const handleJumpFromUnit02ToLab = (presetId: 'fish_berries' | 'labor_xy') => {
    const found = LAB_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setLabInputs({ ...found.inputs });
      setLabRevealedSteps(0);
    }
    navigateTo('unit-03', 0);
  };

  const handleSendLabToPpcSim = (inputs: LabInputs) => {
    const analysis = analyzeComparativeAdvantage(inputs);
    if (!analysis.valid) return;

    let aMaxX = analysis.values.aX;
    let aMaxY = analysis.values.aY;
    let bMaxX = analysis.values.bX;
    let bMaxY = analysis.values.bY;

    if (inputs.mode === 'labor') {
      // Normalize using a shared endowment L so max production is clean whole numbers
      const totalLabor = 120;
      aMaxX = Number((totalLabor / analysis.values.aX).toFixed(2));
      aMaxY = Number((totalLabor / analysis.values.aY).toFixed(2));
      bMaxX = Number((totalLabor / analysis.values.bX).toFixed(2));
      bMaxY = Number((totalLabor / analysis.values.bY).toFixed(2));
    }

    const ocA = aMaxY / aMaxX;
    const ocB = bMaxY / bMaxX;
    const midTerms = Number(((ocA + ocB) / 2).toFixed(2));
    const xExporterMax = ocA < ocB ? aMaxX : bMaxX;

    setSimInputs({
      countryAName: inputs.countryAName.trim() || '갑국',
      countryBName: inputs.countryBName.trim() || '을국',
      goodXName: inputs.goodXName.trim() || 'X재',
      goodXUnit: inputs.goodXUnit.trim() || '개',
      goodYName: inputs.goodYName.trim() || 'Y재',
      goodYUnit: inputs.goodYUnit.trim() || '개',
      aMaxX,
      aMaxY,
      bMaxX,
      bMaxY,
      autarkyShareXA: 0.5,
      autarkyShareXB: 0.5,
      yPerX: midTerms,
      exportAmountX: Number((xExporterMax * 0.4).toFixed(1)),
    });
    navigateTo('unit-04', 0);
  };

  const activeTeacherNote =
    TEACHER_GUIDE_NOTES[currentScreen.id] ?? TEACHER_GUIDE_NOTES['u1-concepts'];

  return (
    <div
      data-presentation-mode={isPresentationMode ? 'on' : 'off'}
      className={`min-h-screen flex flex-col bg-[#F7F9FC] text-[#10233F] ${
        isPresentationMode ? 'ring-4 ring-inset ring-[#1D9A97]' : ''
      }`}
    >
      <TopNavBar
        units={UNIT_META_LIST}
        activeUnitId={activeUnitId}
        activeScreenIndex={clampedScreenIdx}
        isPresentationMode={isPresentationMode}
        isFullscreen={isFullscreen}
        showTeacherGuide={showTeacherGuide}
        isAnnotationActive={isAnnotationActive}
        hasPreviousScreen={hasPreviousScreen}
        hasNextScreen={hasNextScreen}
        onSelectUnit={navigateTo}
        onSelectScreen={(idx) => navigateTo(activeUnitId, idx)}
        onPrevScreen={handlePrevScreen}
        onNextScreen={handleNextScreen}
        onTogglePresentationMode={handleTogglePresentationMode}
        onToggleFullscreen={handleToggleFullscreen}
        onToggleTeacherGuide={() => setShowTeacherGuide((s) => !s)}
        onToggleAnnotation={() => setIsAnnotationActive((a) => !a)}
        onOpenToc={() => setIsTocOpen(true)}
      />

      {/* Mobile / Compact Unit Selector (< lg) */}
      <div className="lg:hidden bg-white border-b border-[#D5E0EC] px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
        {UNIT_META_LIST.map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => navigateTo(u.id, 0)}
            className={`px-3.5 py-2 rounded-lg text-base font-bold whitespace-nowrap shrink-0 cursor-pointer ${
              u.id === activeUnitId
                ? 'bg-[#10233F] text-white'
                : 'bg-[#F0F4F9] text-[#354C66]'
            }`}
          >
            {u.number} · {u.shortTitle}
          </button>
        ))}
      </div>

      {/* Main Content Stage */}
      <main className="flex-1 max-w-[1760px] w-full mx-auto px-6 lg:px-10 py-8">
        {isPresentationMode && (
          <div className="mb-6 bg-[#10233F] text-white rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-4">
            <span className="text-lg font-bold text-[#8CE4D9]">
              전자칠판 발표 모드 실행 중 · {currentUnit.number} ({currentUnit.fullTitle})
            </span>
            <span className="text-base text-[#DCE8F5]">
              키보드 좌·우 방향키(← / →)로 화면 이동 · ESC 키로 발표 모드 종료
            </span>
          </div>
        )}

        <TeacherDrawer
          note={activeTeacherNote}
          isOpen={showTeacherGuide}
          onClose={() => setShowTeacherGuide(false)}
        />

        {activeUnitId === 'unit-01' && (
          <Unit01Necessity
            screenIndex={clampedScreenIdx}
            onGoToScreen={(idx) => navigateTo('unit-01', idx)}
          />
        )}

        {activeUnitId === 'unit-02' && (
          <Unit02Advantages
            screenIndex={clampedScreenIdx}
            onGoToScreen={(idx) => navigateTo('unit-02', idx)}
            onJumpToLab={handleJumpFromUnit02ToLab}
          />
        )}

        {activeUnitId === 'unit-03' && (
          <Unit03CalculatorLab
            inputs={labInputs}
            revealedSteps={labRevealedSteps}
            onChangeInputs={setLabInputs}
            onChangeRevealedSteps={setLabRevealedSteps}
            onReset={() => {
              setLabInputs({ ...DEFAULT_LAB_INPUTS });
              setLabRevealedSteps(0);
            }}
            onSendToPpcSimulator={handleSendLabToPpcSim}
          />
        )}

        {activeUnitId === 'unit-04' && (
          <Unit04TradeGainsLab
            simInputs={simInputs}
            onChangeSimInputs={setSimInputs}
            onReset={() => setSimInputs({ ...DEFAULT_SIM_INPUTS })}
          />
        )}

        {activeUnitId === 'unit-05' && (
          <Unit05PolicySustainable
            screenIndex={clampedScreenIdx}
            onGoToScreen={(idx) => navigateTo('unit-05', idx)}
          />
        )}

        {activeUnitId === 'unit-06' && (
          <Unit06ProblemSet onJumpToUnit={(uid) => navigateTo(uid, 0)} />
        )}

        {/* Bottom Classroom Navigation Strip */}
        <footer className="mt-12 pt-6 border-t border-[#D5E0EC] flex flex-wrap items-center justify-between gap-4">
          <div className="text-lg text-[#4B617B]">
            <strong className="text-[#10233F]">TRADE LAB</strong> · 세계는 왜 서로 교환할까? ·
            2022 개정 교육과정 통합사회2 「국제 분업과 무역」
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrevScreen}
              disabled={!hasPreviousScreen}
              className="px-5 py-3 rounded-xl border border-[#D5E0EC] bg-white hover:bg-[#EAF1F8] disabled:opacity-40 text-[#10233F] text-lg font-bold flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>이전 학습 화면</span>
            </button>
            <button
              type="button"
              onClick={handleNextScreen}
              disabled={!hasNextScreen}
              className="px-5 py-3 rounded-xl bg-[#10233F] hover:bg-[#235E91] disabled:opacity-40 text-white text-lg font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>다음 학습 화면</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </footer>
      </main>

      <TableOfContentsModal
        isOpen={isTocOpen}
        units={UNIT_META_LIST}
        activeUnitId={activeUnitId}
        activeScreenIndex={clampedScreenIdx}
        onClose={() => setIsTocOpen(false)}
        onNavigate={navigateTo}
      />

      <WhiteboardOverlay
        isActive={isAnnotationActive}
        onClose={() => setIsAnnotationActive(false)}
      />
    </div>
  );
}
