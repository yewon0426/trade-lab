import React from 'react';
import {
  AlertTriangle,
  ArrowRightCircle,
  BookOpen,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  X,
} from 'lucide-react';
import type { TeacherGuideNote } from '../../types/curriculum';

interface TeacherDrawerProps {
  note: TeacherGuideNote;
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherDrawer: React.FC<TeacherDrawerProps> = ({ note, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <section
      aria-label="교사용 수업 가이드"
      className="bg-[#10233F] text-white rounded-2xl border border-[#235E91] p-7 shadow-lg mb-8"
    >
      <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/15">
        <div>
          <div className="flex items-center gap-2 text-[#8CE4D9] text-base font-semibold">
            <BookOpen className="w-5 h-5" />
            <span>교사용 수업 가이드 · {note.screenTitle}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mt-1">
            전자칠판 수업 진행 및 발문 안내
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="교사용 해설 닫기"
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-base font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <X className="w-5 h-5" />
          <span>해설 숨기기</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
          <h4 className="text-xl font-bold text-[#8CE4D9] flex items-center gap-2 mb-2.5">
            <BookOpen className="w-5 h-5" />
            <span>교사용 상세 설명</span>
          </h4>
          <p className="text-lg leading-relaxed text-[#EAF2FA]">{note.detailedExplanation}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-4">
          <div>
            <h4 className="text-xl font-bold text-[#8CE4D9] flex items-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5" />
              <span>학생에게 던질 질문</span>
            </h4>
            <p className="text-lg leading-relaxed text-white font-medium">
              “{note.studentQuestion}”
            </p>
          </div>
          <div className="pt-3 border-t border-white/10">
            <h5 className="text-base font-bold text-[#B8D4EE] flex items-center gap-2 mb-1.5">
              <MessageSquare className="w-4 h-4" />
              <span>예상 답변 및 유도 방향</span>
            </h5>
            <p className="text-lg leading-relaxed text-[#DDE9F5]">{note.expectedAnswer}</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
          <h4 className="text-xl font-bold text-[#8CE4D9] flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5" />
            <span>생활 속 예시</span>
          </h4>
          <p className="text-lg leading-relaxed text-[#EAF2FA]">{note.realLifeExample}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-4">
          <div>
            <h4 className="text-xl font-bold text-[#FBBF24] flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span>자주 발생하는 오개념</span>
            </h4>
            <p className="text-lg leading-relaxed text-[#FEF3C7]">{note.commonMisconception}</p>
          </div>
          <div className="pt-3 border-t border-white/10">
            <h4 className="text-lg font-bold text-[#8CE4D9] flex items-center gap-2 mb-1.5">
              <ArrowRightCircle className="w-5 h-5" />
              <span>다음 개념으로 연결</span>
            </h4>
            <p className="text-lg leading-relaxed text-[#EAF2FA]">{note.transitionToNext}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
