import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import type { UnitId, UnitMeta } from '../../types/curriculum';

interface TableOfContentsModalProps {
  isOpen: boolean;
  units: UnitMeta[];
  activeUnitId: UnitId;
  activeScreenIndex: number;
  onClose: () => void;
  onNavigate: (unitId: UnitId, screenIndex: number) => void;
}

export const TableOfContentsModal: React.FC<TableOfContentsModalProps> = ({
  isOpen,
  units,
  activeUnitId,
  activeScreenIndex,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#10233F]/55 backdrop-blur-xs flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="toc-modal-title"
    >
      <div className="bg-white rounded-2xl border border-[#D5E0EC] shadow-2xl w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden">
        <div className="px-8 py-6 border-b border-[#E6EEF7] flex items-center justify-between bg-[#F7F9FC]">
          <div>
            <p className="text-base font-semibold text-[#235E91]">
              2022 개정 교육과정 통합사회2 · 국제 분업과 무역
            </p>
            <h2 id="toc-modal-title" className="text-3xl font-extrabold text-[#10233F] mt-1">
              TRADE LAB 전체 단원 목차
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="전체 목차 닫기"
            className="p-3 rounded-xl border border-[#D5E0EC] bg-white hover:bg-[#EAF1F8] text-[#10233F] cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {units.map((unit) => {
            const isCurrentUnit = unit.id === activeUnitId;
            return (
              <div
                key={unit.id}
                className={`p-6 rounded-xl border transition-colors ${
                  isCurrentUnit
                    ? 'border-[#1D9A97] bg-[#F2FBF9]'
                    : 'border-[#D5E0EC] bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-base font-bold text-[#235E91]">{unit.number}</span>
                  {isCurrentUnit && (
                    <span className="text-sm font-bold text-[#1D9A97] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      현재 학습 단원
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-[#10233F]">{unit.fullTitle}</h3>
                <p className="text-lg text-[#4B617B] mt-1.5 mb-4">{unit.subtitle}</p>

                <div className="space-y-2">
                  {unit.screens.map((scr, idx) => {
                    const isCurrentScreen = isCurrentUnit && idx === activeScreenIndex;
                    return (
                      <button
                        key={scr.id}
                        type="button"
                        onClick={() => {
                          onNavigate(unit.id, idx);
                          onClose();
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-lg font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          isCurrentScreen
                            ? 'bg-[#10233F] text-white border-[#10233F]'
                            : 'bg-[#F7F9FC] text-[#10233F] border-[#E1EAF3] hover:bg-[#EAF1F8]'
                        }`}
                      >
                        <span>
                          {idx + 1}. {scr.title}
                        </span>
                        {isCurrentScreen && <span className="text-sm text-[#DDF4EF]">학습 중</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
