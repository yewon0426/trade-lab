import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Globe2, HelpCircle, Layers, RotateCcw } from 'lucide-react';
import { GLOBAL_VALUE_CHAINS } from '../../data/unitContent';

interface Unit01NecessityProps {
  screenIndex: number;
  onGoToScreen: (index: number) => void;
}

const CAUSAL_FLOW_STEPS = [
  {
    id: 'step-1',
    num: '01',
    title: '국가별 생산 조건의 차이',
    summary: '자연환경·자원·사회적 조건이 서로 다릅니다.',
    detail:
      '지구상의 모든 나라는 기후·지형 같은 자연환경, 광물·에너지 같은 보유 자원, 인구·교육 수준·자본·기술 수준 같은 사회적 조건이 서로 다르게 분포합니다.',
    example: '브라질의 열대·아열대 기후와 넓은 토지, 호주의 풍부한 철광석, 한국·독일의 높은 기술력과 산업 자본',
  },
  {
    id: 'step-2',
    num: '02',
    title: '생산비(기회비용)의 차이',
    summary: '같은 물건을 만들어도 나라마다 드는 비용이 다릅니다.',
    detail:
      '생산 요소의 부존량과 기술 수준이 다르기 때문에, 동일한 재화를 1단위 생산할 때 포기해야 하는 다른 재화의 양(기회비용)과 생산비가 국가마다 달라집니다.',
    example: '한국에서 열대 과일을 온실로 재배하면 비용이 매우 크지만, 열대 기후 국가에서는 적은 비용으로 수확할 수 있습니다.',
  },
  {
    id: 'step-3',
    num: '03',
    title: '상대적으로 유리한 분야 발견',
    summary: '절대량이 아니라 기회비용이 작은 재화를 찾습니다.',
    detail:
      '한 나라가 단순히 어떤 물건을 많이 만들 수 있다는 이유만으로 무역 품목이 정해지지 않습니다. 다른 나라와 비교했을 때 상대적 기회비용이 더 작은 분야가 그 나라에 유리한 분야입니다.',
    example: '모든 제품을 잘 만드는 선진국이라도 자국 내에서 상대적으로 더 적은 비용이 드는 핵심 산업에 집중하는 것이 유리합니다.',
  },
  {
    id: 'step-4',
    num: '04',
    title: '비교우위에 따른 특화',
    summary: '유리한 재화에 자원을 집중하여 생산합니다.',
    detail:
      '특화(Specialization)란 한 나라가 모든 재화를 조금씩 다 만드는 대신, 상대적으로 유리한 재화나 생산 단계에 노동과 자본을 집중하여 전문적으로 생산하는 것입니다.',
    example: '칠레는 구리 채굴에, 스위스는 정밀 시계·제약에, 한국은 반도체·자동차·조선 산업에 생산 역량을 집중합니다.',
  },
  {
    id: 'step-5',
    num: '05',
    title: '국제 분업과 무역 및 상호 의존',
    summary: '서로 특화한 것을 교환해 양국 모두 이익을 얻습니다.',
    detail:
      '각국이 특화한 재화와 서비스를 국경을 넘어 사고파는 무역이 이루어지면 전 세계 총생산량이 늘어나고, 각 나라는 스스로 만들 때보다 더 많은 재화를 소비할 수 있으며 경제적 상호 의존이 깊어집니다.',
    example: '한국은 반도체와 자동차를 수출하고 원유·곡물·커피를 수입하며 세계 경제와 긴밀하게 연결되어 있습니다.',
  },
];

export const Unit01Necessity: React.FC<Unit01NecessityProps> = ({ screenIndex, onGoToScreen }) => {
  const [selectedFlowIdx, setSelectedFlowIdx] = useState<number>(0);
  const [showCheckAnswer, setShowCheckAnswer] = useState<boolean>(false);

  const [selectedProductId, setSelectedProductId] = useState<string>('smartphone');
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);

  const activeFlow = CAUSAL_FLOW_STEPS[selectedFlowIdx];
  const activeProduct =
    GLOBAL_VALUE_CHAINS.find((p) => p.id === selectedProductId) ?? GLOBAL_VALUE_CHAINS[0];
  const activeStage = activeProduct.stages[selectedStageIdx] ?? activeProduct.stages[0];

  if (screenIndex === 1) {
    return (
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="flex flex-wrap items-end justify-between gap-6 pb-6 border-b border-[#D5E0EC]">
          <div>
            <p className="text-lg font-bold text-[#1D9A97]">UNIT 01 · 인터랙티브 탐구 활동</p>
            <h1 className="text-4xl font-extrabold text-[#10233F] mt-1">
              세계 생산망: 하나의 제품에 담긴 국제 분업
            </h1>
            <p className="text-2xl text-[#4B617B] mt-2">
              생활 속 제품을 선택하고 생산 단계별 국가와 분업 이유를 탐구해 봅시다.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-[#E8EFF7] rounded-xl" role="tablist" aria-label="제품 선택">
            {GLOBAL_VALUE_CHAINS.map((prod) => {
              const isSelected = prod.id === activeProduct.id;
              return (
                <button
                  key={prod.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setSelectedProductId(prod.id);
                    setSelectedStageIdx(0);
                  }}
                  className={`px-5 py-3 rounded-lg text-xl font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#10233F] text-white shadow-sm'
                      : 'text-[#354C66] hover:text-[#10233F] hover:bg-white/60'
                  }`}
                >
                  {prod.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Overview */}
        <div className="bg-white rounded-2xl border border-[#D5E0EC] p-7">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-lg font-bold text-[#235E91]">{activeProduct.category}</span>
              <h2 className="text-3xl font-extrabold text-[#10233F] mt-1">
                {activeProduct.name}의 국제 분업 6단계
              </h2>
            </div>
            <p className="text-xl text-[#354C66] max-w-3xl leading-relaxed">
              {activeProduct.overview}
            </p>
          </div>

          {/* 6-Stage Interactive Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
            {activeProduct.stages.map((stage, idx) => {
              const isCurrent = idx === selectedStageIdx;
              return (
                <button
                  key={stage.step}
                  type="button"
                  onClick={() => setSelectedStageIdx(idx)}
                  className={`text-left p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[168px] ${
                    isCurrent
                      ? 'bg-[#10233F] text-white border-[#10233F] shadow-md'
                      : 'bg-[#F7F9FC] text-[#10233F] border-[#D5E0EC] hover:border-[#235E91] hover:bg-white'
                  }`}
                >
                  <div>
                    <div
                      className={`text-base font-bold ${
                        isCurrent ? 'text-[#8CE4D9]' : 'text-[#235E91]'
                      }`}
                    >
                      {stage.step}
                    </div>
                    <div className="text-xl font-bold mt-2 leading-snug">{stage.role}</div>
                  </div>
                  <div
                    className={`text-lg font-semibold mt-4 pt-3 border-t ${
                      isCurrent
                        ? 'border-white/15 text-[#DDF4EF]'
                        : 'border-[#E1EAF3] text-[#4B617B]'
                    }`}
                  >
                    {stage.country}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Stage Deep Explanation */}
          <div className="mt-8 bg-[#F2FBF9] rounded-2xl border border-[#BFE6DE] p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 lg:border-r lg:border-[#BFE6DE] lg:pr-6">
              <p className="text-lg font-bold text-[#1D9A97]">{activeStage.step}</p>
              <h3 className="text-3xl font-extrabold text-[#10233F] mt-1">{activeStage.country}</h3>
              <p className="text-xl font-semibold text-[#235E91] mt-2">{activeStage.role}</p>
            </div>

            <div className="lg:col-span-8 space-y-3">
              <div className="text-lg font-bold text-[#10233F]">
                담당 이유(생산 조건 차이):{' '}
                <span className="text-[#1D9A97]">{activeStage.factorReason}</span>
              </div>
              <p className="text-2xl text-[#1E3552] leading-relaxed">{activeStage.detail}</p>
            </div>
          </div>
        </div>

        {/* Summary & Cross-Unit Connection */}
        <div className="bg-white rounded-2xl border border-[#D5E0EC] p-7 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-4xl">
            <h3 className="text-2xl font-bold text-[#10233F] flex items-center gap-2">
              <Globe2 className="w-7 h-7 text-[#1D9A97]" />
              <span>세계 생산망이 보여주는 경제적 상호 의존</span>
            </h3>
            <p className="text-xl text-[#354C66] mt-2 leading-relaxed">
              {activeProduct.summaryInsight}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onGoToScreen(0)}
            className="px-5 py-3 rounded-xl border border-[#D5E0EC] bg-[#F7F9FC] hover:bg-[#EAF1F8] text-[#10233F] text-lg font-bold flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>개념 원리 화면으로</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Unit Title */}
      <div className="pb-6 border-b border-[#D5E0EC] flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-lg font-bold text-[#1D9A97]">UNIT 01 · 핵심 개념과 원리</p>
          <h1 className="text-4xl font-extrabold text-[#10233F] mt-1">
            국제 분업과 무역은 왜 필요할까?
          </h1>
          <p className="text-2xl text-[#4B617B] mt-2">
            무역 · 국제 분업 · 특화의 의미와 국가별 생산 조건의 차이를 이해해 봅시다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onGoToScreen(1)}
          className="px-6 py-3.5 rounded-xl bg-[#235E91] hover:bg-[#10233F] text-white text-xl font-bold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Layers className="w-6 h-6" />
          <span>세계 생산망 활동 열기</span>
        </button>
      </div>

      {/* 3 Core Definitions */}
      <section aria-label="무역, 국제 분업, 특화의 의미" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-[#D5E0EC] p-7 flex flex-col justify-between">
          <div>
            <p className="text-lg font-bold text-[#235E91]">핵심 개념 01</p>
            <h2 className="text-3xl font-extrabold text-[#10233F] mt-1">무역 (Trade)</h2>
            <p className="text-2xl text-[#1E3552] mt-4 leading-relaxed">
              각 나라가 자신들이 생산한 <strong className="text-[#235E91]">재화와 서비스</strong>를 다른 나라와 사고파는 국제 거래를 말합니다.
            </p>
          </div>
          <p className="text-lg text-[#4B617B] mt-5 pt-4 border-t border-[#E6EEF7]">
            예시: 한국이 자동차와 반도체를 수출하고, 원유·커피·천연가스를 수입하는 거래
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#D5E0EC] p-7 flex flex-col justify-between">
          <div>
            <p className="text-lg font-bold text-[#235E91]">핵심 개념 02</p>
            <h2 className="text-3xl font-extrabold text-[#10233F] mt-1">국제 분업</h2>
            <p className="text-2xl text-[#1E3552] mt-4 leading-relaxed">
              각 나라가 무역에서 상대적으로 유리한 품목이나 생산 공정을 나누어 담당하는 <strong className="text-[#235E91]">국가 간 역할 분담</strong>입니다.
            </p>
          </div>
          <p className="text-lg text-[#4B617B] mt-5 pt-4 border-t border-[#E6EEF7]">
            결과: 교역에 참여하는 국가 모두가 자급자족할 때보다 더 많은 소비 이익을 얻습니다.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#D5E0EC] p-7 flex flex-col justify-between">
          <div>
            <p className="text-lg font-bold text-[#1D9A97]">핵심 개념 03</p>
            <h2 className="text-3xl font-extrabold text-[#10233F] mt-1">특화 (Specialization)</h2>
            <p className="text-2xl text-[#1E3552] mt-4 leading-relaxed">
              여러 재화를 조금씩 다 만드는 대신, <strong className="text-[#1D9A97]">기회비용이 작은 재화</strong> 생산에 자원을 집중하는 것입니다.
            </p>
          </div>
          <p className="text-lg text-[#4B617B] mt-5 pt-4 border-t border-[#E6EEF7]">
            주의: 단순히 생산량이 많다는 이유만으로 특화 품목이 결정되지 않습니다.
          </p>
        </div>
      </section>

      {/* Why Trade Happens: 3 Production Condition Differences */}
      <section aria-label="국가별 생산 조건의 차이" className="bg-white rounded-2xl border border-[#D5E0EC] p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-[#10233F]">
            왜 나라마다 잘 만드는 물건이 다를까? (생산 조건의 차이)
          </h2>
          <p className="text-xl text-[#4B617B] mt-2">
            국가마다 보유한 생산 요소의 종류와 양이 다르기 때문에, 같은 상품을 만들어도 생산비 차이가 발생합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#F7F9FC] rounded-xl border border-[#E1EAF3] p-6">
            <h3 className="text-2xl font-bold text-[#10233F]">1. 자연환경의 차이</h3>
            <p className="text-xl text-[#354C66] mt-3 leading-relaxed">
              나라마다 위도, 기후, 강수량, 토양, 지형 조건이 달라 재배할 수 있는 농작물과 축산물이 다릅니다.
            </p>
            <p className="text-lg font-semibold text-[#235E91] mt-4">
              사례: 열대 기후의 커피·바나나, 초원 지대의 뉴질랜드 유제품
            </p>
          </div>

          <div className="bg-[#F7F9FC] rounded-xl border border-[#E1EAF3] p-6">
            <h3 className="text-2xl font-bold text-[#10233F]">2. 보유 자원의 차이</h3>
            <p className="text-xl text-[#354C66] mt-3 leading-relaxed">
              지하자원과 에너지 자원의 매장량과 품질이 지구상에 고르게 분포하지 않아 자원 편중이 나타납니다.
            </p>
            <p className="text-lg font-semibold text-[#235E91] mt-4">
              사례: 중동의 원유, 호주의 철광석, 칠레의 구리·리튬
            </p>
          </div>

          <div className="bg-[#F7F9FC] rounded-xl border border-[#E1EAF3] p-6">
            <h3 className="text-2xl font-bold text-[#10233F]">3. 노동·자본·기술의 차이</h3>
            <p className="text-xl text-[#354C66] mt-3 leading-relaxed">
              인구 규모, 교육 수준, 축적된 자본, 과학 기술력 같은 사회적 조건의 차이가 산업 경쟁력 차이로 이어집니다.
            </p>
            <p className="text-lg font-semibold text-[#235E91] mt-4">
              사례: 한국의 반도체·조선, 독일의 정밀 기계, 동남아의 제조 인력
            </p>
          </div>
        </div>
      </section>

      {/* Interactive 5-Step Causal Flow Diagram */}
      <section aria-label="국제 분업과 무역의 발생 흐름" className="bg-white rounded-2xl border border-[#D5E0EC] p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-[#10233F]">
              국제 분업과 무역의 발생 원리 (단계를 클릭해 보세요)
            </h2>
            <p className="text-xl text-[#4B617B] mt-1">
              생산 조건의 차이가 어떻게 국가 간 무역과 상호 의존으로 이어지는지 순서대로 확인합니다.
            </p>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row items-stretch gap-3">
          {CAUSAL_FLOW_STEPS.map((step, idx) => {
            const isSelected = idx === selectedFlowIdx;
            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => setSelectedFlowIdx(idx)}
                  className={`flex-1 text-left p-5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#10233F] text-white border-[#10233F] shadow-md'
                      : 'bg-[#F7F9FC] text-[#10233F] border-[#D5E0EC] hover:border-[#1D9A97]'
                  }`}
                >
                  <div
                    className={`text-base font-bold ${
                      isSelected ? 'text-[#8CE4D9]' : 'text-[#1D9A97]'
                    }`}
                  >
                    STEP {step.num}
                  </div>
                  <div className="text-xl font-extrabold mt-1.5 leading-snug">{step.title}</div>
                  <div
                    className={`text-lg mt-2 leading-snug ${
                      isSelected ? 'text-[#DCE8F5]' : 'text-[#4B617B]'
                    }`}
                  >
                    {step.summary}
                  </div>
                </button>
                {idx < CAUSAL_FLOW_STEPS.length - 1 && (
                  <div className="hidden xl:flex items-center justify-center text-[#235E91] shrink-0">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="mt-6 bg-[#F2FBF9] border border-[#BFE6DE] rounded-xl p-6">
          <div className="text-lg font-bold text-[#1D9A97]">
            STEP {activeFlow.num} 상세 원리 · {activeFlow.title}
          </div>
          <p className="text-2xl text-[#10233F] mt-2 leading-relaxed">{activeFlow.detail}</p>
          <p className="text-xl text-[#235E91] font-semibold mt-3">
            구체적 사례: {activeFlow.example}
          </p>
        </div>
      </section>

      {/* Check Question for Students */}
      <section aria-label="학생 확인 질문" className="bg-white rounded-2xl border border-[#D5E0EC] p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-4xl">
            <h3 className="text-2xl font-extrabold text-[#10233F] flex items-center gap-2.5">
              <HelpCircle className="w-7 h-7 text-[#235E91]" />
              <span>생각해 볼 확인 질문</span>
            </h3>
            <p className="text-2xl text-[#1E3552] mt-3 leading-relaxed">
              “기후 조건만 맞는다면 우리나라는 모든 공산품과 농산물을 자급자족할 수도 있지 않을까요? 굳이 국제 분업을 통해 다른 나라에 의존하는 이유는 무엇일까요?”
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCheckAnswer((prev) => !prev)}
            className="px-5 py-3 rounded-xl bg-[#1D9A97] hover:bg-[#17827F] text-white text-lg font-bold whitespace-nowrap cursor-pointer"
          >
            {showCheckAnswer ? '확인 답안 숨기기' : '핵심 답안 확인'}
          </button>
        </div>

        {showCheckAnswer && (
          <div className="mt-5 pt-5 border-t border-[#E6EEF7] flex items-start gap-3">
            <CheckCircle2 className="w-7 h-7 text-[#1D9A97] shrink-0 mt-1" />
            <p className="text-xl text-[#10233F] leading-relaxed">
              모든 재화를 자급자족하려 하면 자국의 생산 조건에 맞지 않는 재화를 만드는 데 과도한 비용과 자원이 낭비됩니다. 각국이 상대적으로 생산비(기회비용)가 적은 재화에 특화하여 교환하면 사회 전체의 생산량과 소비 수준이 크게 높아집니다. 다만 특정 부품·식량·에너지에 대한 과도한 해외 의존은 공급망 위기 시 위험 요인이 될 수 있으므로 균형 있는 관리가 필요합니다.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
