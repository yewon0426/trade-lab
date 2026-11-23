import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Eye, EyeOff, HelpCircle, RotateCcw } from 'lucide-react';

interface Unit02AdvantagesProps {
  screenIndex: number;
  onGoToScreen: (index: number) => void;
  onJumpToLab: (presetId: 'fish_berries' | 'labor_xy') => void;
}

interface CompareCaseStudy {
  id: 'fish_berries' | 'labor_xy';
  tabLabel: string;
  dataTypeLabel: string;
  title: string;
  description: string;
  headers: string[];
  rows: string[][];
  steps: {
    stepNum: number;
    title: string;
    headline: string;
    details: string[];
  }[];
}

const COMPARE_CASES: CompareCaseStudy[] = [
  {
    id: 'fish_berries',
    tabLabel: '사례 A: 하루 최대 생산량 자료',
    dataTypeLabel: '같은 자원으로 생산 가능한 최대 생산량',
    title: '모든 재화에서 절대우위를 가진 나라도 무역할 수 있을까?',
    description:
      '갑국과 을국은 노동만을 생산 요소로 사용하여 물고기와 열매를 생산하며, 두 나라의 하루 노동량과 생산 시간은 동일합니다.',
    headers: ['구분', '물고기 (하루 최대)', '열매 (하루 최대)'],
    rows: [
      ['갑국', '15마리', '24개'],
      ['을국', '12마리', '9개'],
    ],
    steps: [
      {
        stepNum: 1,
        title: '1단계 · 절대우위 판단',
        headline: '갑국이 물고기와 열매 모두에서 절대우위를 가집니다.',
        details: [
          '생산량 자료에서는 같은 자원으로 더 많이 생산할 수 있는 나라가 절대우위를 가집니다.',
          '물고기: 갑국(15마리) > 을국(12마리) → 갑국 절대우위',
          '열매: 갑국(24개) > 을국(9개) → 갑국 절대우위',
        ],
      },
      {
        stepNum: 2,
        title: '2단계 · 기회비용 계산',
        headline: '생산량 자료이므로 "포기한 재화 ÷ 얻은 재화"로 계산합니다.',
        details: [
          '갑국 물고기 1마리 기회비용 = 열매 24 ÷ 15 = 8/5개 (1.6개) | 열매 1개 = 물고기 15 ÷ 24 = 5/8마리',
          '을국 물고기 1마리 기회비용 = 열매 9 ÷ 12 = 3/4개 (0.75개) | 열매 1개 = 물고기 12 ÷ 9 = 4/3마리',
        ],
      },
      {
        stepNum: 3,
        title: '3단계 · 비교우위 판단',
        headline: '기회비용이 작은 재화가 비교우위! 물고기는 을국, 열매는 갑국입니다.',
        details: [
          '물고기 1마리 기회비용: 을국(열매 3/4개) < 갑국(열매 8/5개) → 을국이 물고기에 비교우위!',
          '열매 1개 기회비용: 갑국(물고기 5/8마리) < 을국(물고기 4/3마리) → 갑국이 열매에 비교우위!',
        ],
      },
      {
        stepNum: 4,
        title: '4단계 · 특화할 재화',
        headline: '갑국은 열매에, 을국은 물고기에 특화하여 교역하면 양국 모두 이익을 얻습니다.',
        details: [
          '갑국이 두 재화를 모두 더 잘 만들더라도, 을국에 비해 상대적으로 기회비용이 더 작은 열매에 집중하고 물고기는 을국에서 수입하는 편이 유리합니다.',
          '예: 물고기 1마리당 열매 1개를 교환하면(3/4 < 1 < 8/5), 갑국도 을국도 국내 생산보다 더 유리하게 소비할 수 있습니다.',
        ],
      },
    ],
  },
  {
    id: 'labor_xy',
    tabLabel: '사례 B: 재화 1개 생산 노동 투입량 자료',
    dataTypeLabel: '재화 1단위 생산에 필요한 노동자 수',
    title: '투입량 자료에서는 숫자 해석 방향이 반대가 됩니다!',
    description:
      '갑국과 을국은 동일한 총노동량을 보유하고 있으며, X재와 Y재 1개를 생산하는 데 필요한 노동자 수가 아래와 같습니다.',
    headers: ['구분', 'X재 1개 필요 노동자', 'Y재 1개 필요 노동자'],
    rows: [
      ['갑국', '10명', '5명'],
      ['을국', '4명', '8명'],
    ],
    steps: [
      {
        stepNum: 1,
        title: '1단계 · 절대우위 판단',
        headline: '투입량 자료에서는 숫자가 작을수록(적은 노동으로 만들수록) 절대우위입니다.',
        details: [
          'X재 1개 생산: 을국(4명) < 갑국(10명) → 을국이 X재 절대우위',
          'Y재 1개 생산: 갑국(5명) < 을국(8명) → 갑국이 Y재 절대우위',
        ],
      },
      {
        stepNum: 2,
        title: '2단계 · 기회비용 계산',
        headline: '노동 투입량 자료는 "만드는 재화 투입량 ÷ 포기하는 재화 투입량"으로 계산합니다.',
        details: [
          '갑국 X재 1개(10명) 기회비용 = Y재 10 ÷ 5 = 2개 | Y재 1개(5명) = X재 5 ÷ 10 = 1/2개',
          '을국 X재 1개(4명) 기회비용 = Y재 4 ÷ 8 = 1/2개 | Y재 1개(8명) = X재 8 ÷ 4 = 2개',
        ],
      },
      {
        stepNum: 3,
        title: '3단계 · 비교우위 판단',
        headline: 'X재는 을국(1/2 < 2), Y재는 갑국(1/2 < 2)이 비교우위를 가집니다.',
        details: [
          'X재 1개 기회비용: 을국(Y재 1/2개) < 갑국(Y재 2개) → 을국이 X재 비교우위',
          'Y재 1개 기회비용: 갑국(X재 1/2개) < 을국(X재 2개) → 갑국이 Y재 비교우위',
        ],
      },
      {
        stepNum: 4,
        title: '4단계 · 특화할 재화',
        headline: '갑국은 Y재 생산에, 을국은 X재 생산에 특화하여 교환합니다.',
        details: [
          '갑국은 Y재를 수출하고 X재를 수입하며, 을국은 X재를 수출하고 Y재를 수입합니다.',
          '만약 총노동량이 40명이라면 무역 전 갑국(X 2, Y 4)·을국(X 5, Y 2.5) 대비 특화 후 갑국(Y 8)·을국(X 10)으로 총생산량이 크게 증가합니다.',
        ],
      },
    ],
  },
];

export const Unit02Advantages: React.FC<Unit02AdvantagesProps> = ({
  screenIndex,
  onGoToScreen,
  onJumpToLab,
}) => {
  const [showTheoryQuestion, setShowTheoryQuestion] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<'fish_berries' | 'labor_xy'>('fish_berries');
  const [revealedStepCount, setRevealedStepCount] = useState<number>(0);

  const activeCase = COMPARE_CASES.find((c) => c.id === selectedCaseId) ?? COMPARE_CASES[0];

  if (screenIndex === 1) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-[#D5E0EC] flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-lg font-bold text-[#1D9A97]">UNIT 02 · 단계별 비교 탐구</p>
            <h1 className="text-4xl font-extrabold text-[#10233F] mt-1">
              생산량 자료 vs 노동 투입량 자료 단계별 판정
            </h1>
            <p className="text-2xl text-[#4B617B] mt-2">
              표의 성격을 먼저 확인한 뒤, 1단계부터 4단계까지 버튼을 눌러 판단 근거를 순서대로 확인하세요.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-[#E8EFF7] rounded-xl" role="tablist" aria-label="자료 유형 사례 선택">
            {COMPARE_CASES.map((cs) => (
              <button
                key={cs.id}
                type="button"
                role="tab"
                aria-selected={cs.id === selectedCaseId}
                onClick={() => {
                  setSelectedCaseId(cs.id);
                  setRevealedStepCount(0);
                }}
                className={`px-5 py-3 rounded-lg text-lg font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  cs.id === selectedCaseId
                    ? 'bg-[#10233F] text-white'
                    : 'text-[#354C66] hover:text-[#10233F]'
                }`}
              >
                {cs.tabLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table + Step Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#D5E0EC] p-7 space-y-6">
            <div>
              <p className="text-lg font-bold text-[#235E91]">{activeCase.dataTypeLabel}</p>
              <h2 className="text-2xl font-extrabold text-[#10233F] mt-1">{activeCase.title}</h2>
              <p className="text-xl text-[#4B617B] mt-3 leading-relaxed">{activeCase.description}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-center">
                <thead>
                  <tr className="bg-[#10233F] text-white">
                    {activeCase.headers.map((h) => (
                      <th key={h} className="py-4 px-4 text-xl font-bold border border-[#235E91]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeCase.rows.map((row) => (
                    <tr key={row[0]} className="bg-[#F7F9FC] even:bg-white">
                      {row.map((cell, cIdx) => (
                        <td
                          key={`${row[0]}-${cIdx}`}
                          className={`py-4 px-4 text-2xl border border-[#D5E0EC] tabular-nums ${
                            cIdx === 0 ? 'font-extrabold text-[#10233F]' : 'font-bold text-[#235E91]'
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

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onJumpToLab(activeCase.id)}
                className="w-full px-5 py-3.5 rounded-xl bg-[#DDF4EF] hover:bg-[#C6ECE4] text-[#10233F] text-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>이 자료를 UNIT 03 계산 실험실에서 직접 수정해 보기</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onGoToScreen(0)}
                className="w-full px-5 py-3 rounded-xl border border-[#D5E0EC] bg-white hover:bg-[#F7F9FC] text-[#354C66] text-lg font-semibold cursor-pointer"
              >
                이론 설명 화면으로 돌아가기
              </button>
            </div>
          </div>

          {/* 4-Step Progressive Disclosure */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#D5E0EC] p-7">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E6EEF7]">
              <div>
                <h3 className="text-2xl font-extrabold text-[#10233F]">
                  교사용 단계별 판정 공개
                </h3>
                <p className="text-lg text-[#4B617B] mt-1">
                  학생들과 먼저 계산해 본 뒤 버튼을 눌러 단계별로 확인하세요 ({revealedStepCount}/4 단계 공개)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRevealedStepCount((c) => Math.min(4, c + 1))}
                  disabled={revealedStepCount >= 4}
                  className="px-4 py-2.5 rounded-xl bg-[#1D9A97] hover:bg-[#17827F] disabled:opacity-40 text-white text-lg font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-5 h-5" />
                  <span>다음 단계 공개</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRevealedStepCount(4)}
                  className="px-4 py-2.5 rounded-xl border border-[#D5E0EC] bg-[#F7F9FC] hover:bg-[#EAF1F8] text-[#10233F] text-lg font-bold cursor-pointer"
                >
                  모두 공개
                </button>
                <button
                  type="button"
                  onClick={() => setRevealedStepCount(0)}
                  aria-label="단계 가리기"
                  className="px-4 py-2.5 rounded-xl border border-[#D5E0EC] bg-white hover:bg-[#F7F9FC] text-[#4B617B] text-lg font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <EyeOff className="w-5 h-5" />
                  <span>가리기</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {activeCase.steps.map((st, idx) => {
                const isRevealed = idx < revealedStepCount;
                return (
                  <div
                    key={st.stepNum}
                    className={`rounded-xl border p-6 transition-all ${
                      isRevealed
                        ? 'bg-[#F7F9FC] border-[#235E91]'
                        : 'bg-[#F9FBFD] border-dashed border-[#CBD7E6]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xl font-extrabold text-[#10233F]">{st.title}</span>
                      {!isRevealed ? (
                        <button
                          type="button"
                          onClick={() => setRevealedStepCount(idx + 1)}
                          className="px-4 py-2 rounded-lg bg-[#10233F] hover:bg-[#235E91] text-white text-base font-bold cursor-pointer"
                        >
                          {st.stepNum}단계 공개하기
                        </button>
                      ) : (
                        <span className="text-base font-bold text-[#1D9A97] flex items-center gap-1">
                          <CheckCircle2 className="w-5 h-5" />
                          공개됨
                        </span>
                      )}
                    </div>

                    {isRevealed ? (
                      <div className="mt-4 space-y-2.5">
                        <p className="text-2xl font-bold text-[#235E91]">{st.headline}</p>
                        <ul className="space-y-2 text-xl text-[#1E3552]">
                          {st.details.map((line) => (
                            <li key={line} className="leading-relaxed">
                              • {line}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-lg text-[#6B809A] mt-2">
                        학생들과 먼저 판단한 뒤 버튼을 눌러 근거와 계산 과정을 확인하세요.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#D5E0EC] flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-lg font-bold text-[#1D9A97]">UNIT 02 · 무역의 핵심 원리</p>
          <h1 className="text-4xl font-extrabold text-[#10233F] mt-1">
            절대우위와 비교우위: 기회비용으로 이해하기
          </h1>
          <p className="text-2xl text-[#4B617B] mt-2">
            모든 물건을 혼자 더 잘 만드는 나라도 왜 다른 나라와 교환할 때 더 부유해질까요?
          </p>
        </div>

        <button
          type="button"
          onClick={() => onGoToScreen(1)}
          className="px-6 py-3.5 rounded-xl bg-[#235E91] hover:bg-[#10233F] text-white text-xl font-bold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <span>표 자료 4단계 판정 연습하기</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Absolute vs Comparative Advantage Side-by-Side */}
      <section aria-label="절대우위와 비교우위 비교" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-[#D5E0EC] p-8 flex flex-col justify-between">
          <div>
            <p className="text-lg font-bold text-[#235E91]">이론 01 · 애덤 스미스</p>
            <h2 className="text-3xl font-extrabold text-[#10233F] mt-1">절대우위 (Absolute Advantage)</h2>

            <div className="mt-5 space-y-4 text-2xl text-[#1E3552] leading-relaxed">
              <p>
                <strong className="text-[#10233F]">의미:</strong> 어떤 상품을 생산하는{' '}
                <strong className="text-[#235E91]">절대적 생산비(투입 노동량)가 다른 나라보다 적거나</strong>,
                같은 자원으로 <strong className="text-[#235E91]">더 많은 양을 생산</strong>할 수 있는 상태입니다.
              </p>
              <p>
                <strong className="text-[#10233F]">무역의 발생:</strong> 각국이 절대우위를 가진 상품만 생산하여 수출하고, 절대우위가 없는 상품은 수입할 때 교역 이익이 발생한다고 설명합니다.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#E6EEF7] text-xl text-[#4B617B]">
            <strong className="text-[#10233F]">이론의 한계:</strong> 한 나라가 모든 재화에서 절대우위를 가지면 두 나라 간 무역이 왜 일어나는지 설명할 수 없습니다.
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#1D9A97] p-8 flex flex-col justify-between">
          <div>
            <p className="text-lg font-bold text-[#1D9A97]">이론 02 · 데이비드 리카도</p>
            <h2 className="text-3xl font-extrabold text-[#10233F] mt-1">비교우위 (Comparative Advantage)</h2>

            <div className="mt-5 space-y-4 text-2xl text-[#1E3552] leading-relaxed">
              <p>
                <strong className="text-[#10233F]">의미:</strong> 어떤 상품을 생산할 때 포기해야 하는 다른 상품의 가치, 즉{' '}
                <strong className="text-[#1D9A97]">기회비용이 다른 나라보다 작은 경우</strong>를 말합니다.
              </p>
              <p>
                <strong className="text-[#10233F]">무역의 발생:</strong> 각국이 상대적으로 기회비용이 작은 재화에 특화하여 수출하고, 기회비용이 큰 재화를 수입하면 양국 모두 이익을 얻습니다.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#DDF4EF] text-xl text-[#10233F]">
            <strong className="text-[#1D9A97]">이론의 의의:</strong> 한 나라가 모든 재화에서 절대우위를 가지더라도 무역이 발생하는 이유를 완벽히 설명합니다.
          </div>
        </div>
      </section>

      {/* Opportunity Cost Core Principle & Everyday Analogy */}
      <section aria-label="기회비용과 비교우위의 관계" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-[#10233F] text-white rounded-2xl p-8 space-y-5">
          <p className="text-lg font-bold text-[#8CE4D9]">핵심 연결 고리</p>
          <h2 className="text-3xl font-extrabold">기회비용(Opportunity Cost)과 특화의 원리</h2>
          <p className="text-2xl text-[#E3EDF7] leading-relaxed">
            기회비용이란 한 재화를 추가로 생산하기 위해 포기해야 하는 다른 재화의 생산량입니다.
            한 나라의 자원은 한정되어 있으므로, X재를 더 만들려면 반드시 Y재를 덜 만들어야 합니다.
          </p>
          <div className="bg-white/10 rounded-xl p-6 text-2xl font-bold text-[#DDF4EF] leading-relaxed">
            “다른 나라보다 절대적으로 못 만드는 나라라도, 두 재화 중 상대적으로 덜 불리한(기회비용이 더 작은) 재화에는 반드시 비교우위를 가진다!”
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#D5E0EC] p-8 flex flex-col justify-between">
          <div>
            <p className="text-lg font-bold text-[#235E91]">생활 속 직관 사례</p>
            <h3 className="text-3xl font-extrabold text-[#10233F] mt-1">
              유능한 경영자와 비서의 분업
            </h3>
            <p className="text-xl text-[#354C66] mt-4 leading-relaxed">
              경영자가 비서보다 기업 경영도 훨씬 잘하고 문서 작성도 2배 빠르다고 합시다.
              경영자가 모든 일에 절대우위가 있지만, 문서 작성에 1시간을 쓰면 기업 경영으로 벌 수 있는 큰 수익(높은 기회비용)을 포기해야 합니다.
              따라서 문서 작성은 비서에게 맡기고 경영자는 경영에 특화할 때 전체 성과가 극대화됩니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTheoryQuestion((prev) => !prev)}
            className="mt-6 px-5 py-3 rounded-xl bg-[#F2FBF9] border border-[#BFE6DE] hover:bg-[#DDF4EF] text-[#10233F] text-lg font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-5 h-5 text-[#1D9A97]" />
            <span>{showTheoryQuestion ? '확인 질문 답안 닫기' : '확인 질문: 두 나라의 기회비용이 같다면?'}</span>
          </button>
        </div>
      </section>

      {showTheoryQuestion && (
        <div className="bg-[#F2FBF9] rounded-2xl border border-[#1D9A97] p-7">
          <h4 className="text-2xl font-extrabold text-[#10233F]">
            질문: 만약 두 나라의 기회비용이 완전히 같다면 어떻게 될까요?
          </h4>
          <p className="text-2xl text-[#1E3552] mt-3 leading-relaxed">
            예외적으로 두 나라의 각 재화 1단위 생산의 기회비용이 정확히 같다면(예: 갑국 옷 1벌=쌀 2포대, 을국 옷 1벌=쌀 2포대),
            두 나라 모두 어느 재화에도 비교우위를 가지지 않으므로 특화와 교환을 통한 무역 이익이 발생하지 않습니다.
          </p>
        </div>
      )}
    </div>
  );
};
