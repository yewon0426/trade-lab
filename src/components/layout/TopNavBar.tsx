import React from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  List,
  Maximize2,
  Minimize2,
  PenTool,
  Presentation,
} from 'lucide-react';
import type { UnitId, UnitMeta } from '../../types/curriculum';

interface TopNavBarProps {
  units: UnitMeta[];
  activeUnitId: UnitId;
  activeScreenIndex: number;
  isPresentationMode: boolean;
  isFullscreen: boolean;
  showTeacherGuide: boolean;
  isAnnotationActive: boolean;
  hasPreviousScreen: boolean;
  hasNextScreen: boolean;
  onSelectUnit: (unitId: UnitId, screenIndex?: number) => void;
  onSelectScreen: (screenIndex: number) => void;
  onPrevScreen: () => void;
  onNextScreen: () => void;
  onTogglePresentationMode: () => void;
  onToggleFullscreen: () => void;
  onToggleTeacherGuide: () => void;
  onToggleAnnotation: () => void;
  onOpenToc: () => void;
}

const SHORT_NAV_LABELS: Record<UnitId, string> = {
  'unit-01': '01. 필요성',
  'unit-02': '02. 우위이론',
  'unit-03': '03. 계산실험',
  'unit-04': '04. 무역이익',
  'unit-05': '05. 무역정책',
  'unit-06': '06. 문제풀이',
};

export const TopNavBar: React.FC<TopNavBarProps> = ({
  units,
  activeUnitId,
  activeScreenIndex,
  isPresentationMode,
  isFullscreen,
  showTeacherGuide,
  isAnnotationActive,
  hasPreviousScreen,
  hasNextScreen,
  onSelectUnit,
  onSelectScreen,
  onPrevScreen,
  onNextScreen,
  onTogglePresentationMode,
  onToggleFullscreen,
  onToggleTeacherGuide,
  onToggleAnnotation,
  onOpenToc,
}) => {
  const currentUnit = units.find((u) => u.id === activeUnitId) ?? units[0];
  const currentScreen = currentUnit.screens[activeScreenIndex] ?? currentUnit.screens[0];
  const totalUnitIndex = units.findIndex((u) => u.id === activeUnitId) + 1;

  return (
    <div className="sticky top-0 z-30 bg-[#F7F9FC]/95 backdrop-blur-sm border-b border-[#D5E0EC]">
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (Single-line Nav Links) — Zone 3 (1 Primary CTA) */}
      <header className="max-w-[1760px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => onSelectUnit('unit-01', 0)}
          className="font-display text-2xl font-extrabold tracking-tight text-[#10233F] whitespace-nowrap shrink-0 hover:text-[#235E91] transition-colors cursor-pointer"
        >
          TRADE LAB
        </button>

        <nav
          aria-label="단원 이동"
          className="hidden lg:flex items-center gap-6 overflow-x-auto"
        >
          {units.map((unit) => {
            const isActive = unit.id === activeUnitId;
            return (
              <button
                key={unit.id}
                type="button"
                onClick={() => onSelectUnit(unit.id, 0)}
                aria-current={isActive ? 'page' : undefined}
                className={`py-2 text-lg font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#1D9A97] text-[#10233F]'
                    : 'border-transparent text-[#4B617B] hover:text-[#10233F] hover:border-[#A8BDD4]'
                }`}
              >
                {SHORT_NAV_LABELS[unit.id]}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onTogglePresentationMode}
            className={`px-5 py-2.5 rounded-lg text-base font-bold whitespace-nowrap shrink-0 flex items-center gap-2 transition-colors cursor-pointer ${
              isPresentationMode
                ? 'bg-[#1D9A97] text-white hover:bg-[#17827F]'
                : 'bg-[#10233F] text-white hover:bg-[#235E91]'
            }`}
          >
            <Presentation className="w-5 h-5" />
            <span>{isPresentationMode ? '발표 모드 종료' : '발표 모드'}</span>
          </button>
        </div>
      </header>

      {/* Workspace Classroom Toolbar */}
      <div className="bg-white border-t border-[#E6EEF7]">
        <div className="max-w-[1760px] mx-auto px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Current Learning Position & Sub-screen Switcher */}
          <div className="flex flex-wrap items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={onOpenToc}
              className="px-3.5 py-2 rounded-lg border border-[#D5E0EC] bg-[#F7F9FC] hover:bg-[#EAF1F8] text-[#10233F] text-base font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <List className="w-5 h-5 text-[#235E91]" />
              <span>전체 목차</span>
            </button>

            <div className="flex items-center gap-2 text-base md:text-lg text-[#4B617B] min-w-0">
              <span className="font-bold text-[#235E91] whitespace-nowrap">
                {currentUnit.number} ({totalUnitIndex}/{units.length})
              </span>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-[#10233F] truncate max-w-[380px]">
                {currentScreen.title}
              </span>
            </div>

            {currentUnit.screens.length > 1 && (
              <div
                role="tablist"
                aria-label="단원 내 학습 화면 선택"
                className="flex items-center gap-1 p-1 bg-[#F0F4F9] rounded-lg"
              >
                {currentUnit.screens.map((scr, idx) => (
                  <button
                    key={scr.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === activeScreenIndex}
                    onClick={() => onSelectScreen(idx)}
                    className={`px-3.5 py-1.5 rounded-md text-base font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      idx === activeScreenIndex
                        ? 'bg-white text-[#10233F] shadow-sm'
                        : 'text-[#4B617B] hover:text-[#10233F]'
                    }`}
                  >
                    화면 {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Classroom Tools (Prev/Next, Teacher Guide, Whiteboard Pen, Fullscreen) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onPrevScreen}
              disabled={!hasPreviousScreen}
              aria-label="이전 화면"
              className="px-3.5 py-2 rounded-lg border border-[#D5E0EC] bg-white hover:bg-[#F7F9FC] disabled:opacity-40 disabled:cursor-not-allowed text-[#10233F] text-base font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>이전</span>
            </button>

            <button
              type="button"
              onClick={onNextScreen}
              disabled={!hasNextScreen}
              aria-label="다음 화면"
              className="px-3.5 py-2 rounded-lg border border-[#D5E0EC] bg-white hover:bg-[#F7F9FC] disabled:opacity-40 disabled:cursor-not-allowed text-[#10233F] text-base font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>다음</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onToggleTeacherGuide}
              aria-expanded={showTeacherGuide}
              className={`px-4 py-2 rounded-lg border text-base font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                showTeacherGuide
                  ? 'bg-[#DDF4EF] border-[#1D9A97] text-[#10233F]'
                  : 'bg-white border-[#D5E0EC] text-[#10233F] hover:bg-[#F7F9FC]'
              }`}
            >
              <BookOpen className="w-5 h-5 text-[#1D9A97]" />
              <span>{showTeacherGuide ? '교사용 해설 숨기기' : '교사용 해설'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleAnnotation}
              aria-pressed={isAnnotationActive}
              className={`px-4 py-2 rounded-lg border text-base font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isAnnotationActive
                  ? 'bg-[#10233F] border-[#10233F] text-white'
                  : 'bg-white border-[#D5E0EC] text-[#10233F] hover:bg-[#F7F9FC]'
              }`}
            >
              <PenTool className="w-5 h-5" />
              <span>{isAnnotationActive ? '판서 중' : '판서 모드'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleFullscreen}
              aria-label={isFullscreen ? '전체화면 종료' : '전체화면 진입'}
              className="px-3.5 py-2 rounded-lg border border-[#D5E0EC] bg-white hover:bg-[#F7F9FC] text-[#10233F] text-base font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              <span className="hidden xl:inline">{isFullscreen ? '창 모드' : '전체화면'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
