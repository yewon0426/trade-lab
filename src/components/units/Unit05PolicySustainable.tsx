import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Globe, RotateCcw, Scale, ShieldAlert } from 'lucide-react';
import { SUSTAINABLE_TRADE_CASES } from '../../data/unitContent';
import { calculateTariffImpact } from '../../engine/tradeMath';

interface Unit05PolicySustainableProps {
  screenIndex: number;
  onGoToScreen: (index: number) => void;
}

const SAMPLE_PRODUCTS = [
  { id: 'ev', name: '수입 전기차 (1대)', defaultPrice: 40000000, defaultRate: 15 },
  { id: 'orange', name: '수입 오렌지 (1상자)', defaultPrice: 30000, defaultRate: 30 },
  { id: 'apparel', name: '수입 스포츠 의류 (1벌)', defaultPrice: 100000, defaultRate: 10 },
];

export const Unit05PolicySustainable: React.FC<Unit05PolicySustainableProps> = ({
  screenIndex,
  onGoToScreen,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('orange');
  const [importPrice, setImportPrice] = useState<number>(30000);
  const [tariffRate, setTariffRate] = useState<number>(30);
  const [importQuantity, setImportQuantity] = useState<number>(100);

  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});

  const tariffResult = useMemo(
    () => calculateTariffImpact(importPrice, tariffRate, importQuantity),
    [importPrice, tariffRate, importQuantity]
  );

  const handleSelectSample = (id: string) => {
    const found = SAMPLE_PRODUCTS.find((p) => p.id === id);
    if (!found) return;
    setSelectedProductId(id);
    setImportPrice(found.defaultPrice);
    setTariffRate(found.defaultRate);
  };

  const resetTariffLab = () => {
    setSelectedProductId('orange');
    setImportPrice(30000);
    setTariffRate(30);
    setImportQuantity(100);
  };

  if (screenIndex === 1) {
    const activeCase = SUSTAINABLE_TRADE_CASES[selectedCaseIdx] ?? SUSTAINABLE_TRADE_CASES[0];
    const chosenOptionIdx = selectedOptions[activeCase.id];

    return (
      <div className="space-y-8">
        <div className="pb-6 border-b border-[#D5E0EC] flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-lg font-bold text-[#1D9A97]">UNIT 05 · 국제무역의 과제와 대안</p>
            <h1 className="text-4xl font-extrabold text-[#10233F] mt-1">
              국제무역의 확대와 지속가능한 무역
            </h1>
            <p className="text-2xl text-[#4B617B] mt-2">
              경제적 효율성을 넘어 불평등·환경·인권을 고려하는 지속가능한 무역의 방향을 탐구합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onGoToScreen(0)}
            className="px-5 py-3 rounded-xl border border-[#D5E0EC] bg-white hover:bg-[#F7F9FC] text-[#10233F] text-lg font-bold cursor-pointer"
          >
            자유무역·관세 실험 화면으로
          </button>
        </div>

        {/* Trends & Problems */}
        <section aria-label="오늘날 국제무역의 흐름과 문제점" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-[#D5E0EC] p-7 space-y-4">
            <h2 className="text-2xl font-extrabold text-[#10233F] flex items-center gap-2">
              <Globe className="w-7 h-7 text-[#235E91]" />
              <span>오늘날 국제 무역 확대의 흐름과 과제</span>
            </h2>
            <ul className="space-y-3 text-xl text-[#1E3552] leading-relaxed">
              <li>
                • <strong className="text-[#10233F]">교류 확대:</strong> 교통·통신 수단 발달로 재화·서비스뿐 아니라 노동·자본·기술이 빠르게 이동합니다.
              </li>
              <li>
                • <strong className="text-[#10233F]">WTO와 FTA:</strong> 자유무역을 목표로 하는 세계무역기구(WTO) 출범과 자유무역협정(FTA) 확대로 무역 장벽이 낮아졌습니다.
              </li>
              <li>
                • <strong className="text-[#10233F]">상호 의존과 보호무역 재등장:</strong> 국가 간 경제적 상호 의존성이 커졌지만, 자국 산업 보호를 위해 보호무역을 강화하는 움직임도 나타나고 있습니다.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#D5E0EC] p-7 space-y-4">
            <h2 className="text-2xl font-extrabold text-[#10233F] flex items-center gap-2">
              <ShieldAlert className="w-7 h-7 text-[#D97706]" />
              <span>지속가능한 무역이 해결해야 할 핵심 문제</span>
            </h2>
            <ul className="space-y-3 text-xl text-[#1E3552] leading-relaxed">
              <li>
                • <strong className="text-[#10233F]">국가 간·국내 불평등:</strong> 선진국과 개발도상국 간 격차가 벌어지고, 경쟁력 약화 산업의 일자리가 줄어들 수 있습니다.
              </li>
              <li>
                • <strong className="text-[#10233F]">환경 파괴와 자원 고갈:</strong> 대량 생산과 장거리 해상·항공 운송 과정에서 온실가스 배출과 생태계 훼손이 심화됩니다.
              </li>
              <li>
                • <strong className="text-[#10233F]">노동권 침해와 불공정 거래:</strong> 개발도상국 생산자에 대한 저임금·열악한 노동 환경·아동 노동 문제가 발생합니다.
              </li>
            </ul>
          </div>
        </section>

        {/* 4 Directions of Sustainable Trade */}
        <section aria-label="지속가능한 무역의 4가지 방향" className="bg-[#10233F] text-white rounded-2xl p-8">
          <h2 className="text-3xl font-extrabold mb-5">지속가능발전을 위한 국제 무역의 실천 방향</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="bg-white/10 rounded-xl p-5">
              <h3 className="text-xl font-bold text-[#8CE4D9]">1. 공정무역(Fair Trade) 촉진</h3>
              <p className="text-lg text-[#E3EDF7] mt-2 leading-relaxed">
                개발도상국 생산자에게 정당한 가격과 안전한 노동 환경을 보장해 경제적 자립을 돕습니다.
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-5">
              <h3 className="text-xl font-bold text-[#8CE4D9]">2. 친환경 기술 연구 개발</h3>
              <p className="text-lg text-[#E3EDF7] mt-2 leading-relaxed">
                탄소 배출이 적은 생산·물류 기술을 개발하고 환경 오염을 줄이는 국제 규제를 강화합니다.
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-5">
              <h3 className="text-xl font-bold text-[#8CE4D9]">3. 선진국의 기술 이전·협력</h3>
              <p className="text-lg text-[#E3EDF7] mt-2 leading-relaxed">
                선진국이 친환경 기술과 산업 역량을 개발도상국에 이전해 세계 경제의 균형 발전을 이끕니다.
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-5">
              <h3 className="text-xl font-bold text-[#8CE4D9]">4. 지속가능한 소비·생산</h3>
              <p className="text-lg text-[#E3EDF7] mt-2 leading-relaxed">
                소비자와 기업이 환경·노동 기준을 지키는 지속가능한 제품 선택과 생산에 동참합니다.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Case Judgment Activity */}
        <section aria-label="지속가능한 무역 사례 판단 활동" className="bg-white rounded-2xl border border-[#D5E0EC] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E6EEF7]">
            <div>
              <h2 className="text-3xl font-extrabold text-[#10233F]">
                활동: 지속가능한 무역 사례 판단하기
              </h2>
              <p className="text-xl text-[#4B617B] mt-1">
                주제별 딜레마를 읽고 지속가능발전에 부합하는 방안을 선택해 보세요.
              </p>
            </div>

            <div className="flex flex-wrap gap-2" role="tablist" aria-label="사례 주제 선택">
              {SUSTAINABLE_TRADE_CASES.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === selectedCaseIdx}
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={`px-4 py-2.5 rounded-lg text-lg font-bold cursor-pointer ${
                    idx === selectedCaseIdx
                      ? 'bg-[#10233F] text-white'
                      : 'bg-[#F0F4F9] text-[#354C66] hover:text-[#10233F]'
                  }`}
                >
                  {c.topic}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <span className="text-lg font-bold text-[#1D9A97]">{activeCase.topic} 사례</span>
              <h3 className="text-3xl font-extrabold text-[#10233F] mt-1">{activeCase.title}</h3>
              <p className="text-2xl text-[#1E3552] mt-3 leading-relaxed bg-[#F7F9FC] p-5 rounded-xl border border-[#E1EAF3]">
                {activeCase.dilemma}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCase.options.map((opt, oIdx) => {
                const isPicked = chosenOptionIdx === oIdx;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() =>
                      setSelectedOptions((prev) => ({ ...prev, [activeCase.id]: oIdx }))
                    }
                    className={`p-6 rounded-xl border text-left transition-all cursor-pointer ${
                      isPicked
                        ? opt.isSustainable
                          ? 'bg-[#F2FBF9] border-[#1D9A97]'
                          : 'bg-amber-50 border-amber-400'
                        : 'bg-white border-[#D5E0EC] hover:border-[#235E91]'
                    }`}
                  >
                    <div className="text-lg font-bold text-[#235E91] mb-2">선택 {oIdx + 1}</div>
                    <p className="text-xl font-semibold text-[#10233F] leading-relaxed">
                      {opt.label}
                    </p>
                  </button>
                );
              })}
            </div>

            {chosenOptionIdx !== undefined && (
              <div
                role="status"
                className={`p-6 rounded-xl border ${
                  activeCase.options[chosenOptionIdx].isSustainable
                    ? 'bg-[#F2FBF9] border-[#1D9A97]'
                    : 'bg-amber-50 border-amber-400'
                }`}
              >
                <div className="flex items-center gap-2 text-2xl font-extrabold text-[#10233F]">
                  <CheckCircle2 className="w-7 h-7 text-[#1D9A97]" />
                  <span>{activeCase.options[chosenOptionIdx].feedback}</span>
                </div>
                <p className="text-xl text-[#354C66] mt-3 pt-3 border-t border-black/10">
                  <strong>핵심 원리:</strong> {activeCase.principle}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#D5E0EC] flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-lg font-bold text-[#1D9A97]">UNIT 05 · 무역 정책과 관세 실험</p>
          <h1 className="text-4xl font-extrabold text-[#10233F] mt-1">
            자유무역과 보호무역, 그리고 관세의 효과
          </h1>
          <p className="text-2xl text-[#4B617B] mt-2">
            자유무역과 보호무역의 논리를 비교하고, 관세율 변화가 가격과 시장에 미치는 영향을 실험해 봅시다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onGoToScreen(1)}
          className="px-6 py-3.5 rounded-xl bg-[#235E91] hover:bg-[#10233F] text-white text-xl font-bold flex items-center gap-2 cursor-pointer"
        >
          <span>지속가능한 무역 활동으로 이동</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Free Trade vs Protectionism Comparison */}
      <section aria-label="자유무역과 보호무역 비교" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-[#D5E0EC] p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold text-[#10233F]">자유무역 (Free Trade)</h2>
            <span className="text-lg font-bold text-[#1D9A97]">WTO · FTA</span>
          </div>
          <p className="text-xl text-[#354C66] leading-relaxed">
            국가가 관세나 수입 규제 같은 무역 장벽을 최소화하고 시장 원리에 따라 자유롭게 교역하는 정책입니다.
          </p>
          <div className="pt-3 border-t border-[#E6EEF7] space-y-2 text-xl text-[#1E3552]">
            <p className="font-bold text-[#235E91]">기대 효과:</p>
            <p>• 해외 기업과의 경쟁을 통해 국내 산업의 경쟁력 제고</p>
            <p>• 넓은 세계 시장을 대상으로 대량 생산하여 규모의 경제 실현</p>
            <p>• 비교우위 산업 성장에 따른 생산·고용 증가 및 소비자 선택 폭 확대</p>
          </div>
          <div className="pt-3 border-t border-[#E6EEF7] space-y-1.5 text-xl text-[#4B617B]">
            <p className="font-bold text-[#10233F]">한계:</p>
            <p>• 경쟁력이 약한 국내 산업 위축, 해당 분야 일자리 감소, 해외 의존 심화</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#D5E0EC] p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold text-[#10233F]">보호무역 (Protectionism)</h2>
            <span className="text-lg font-bold text-[#D97706]">관세 · 비관세 장벽</span>
          </div>
          <p className="text-xl text-[#354C66] leading-relaxed">
            정부가 관세 부과, 수입 물량 제한(쿼터) 등 무역 장벽을 세워 외국 상품의 수입을 억제하고 국내 산업을 보호하는 정책입니다.
          </p>
          <div className="pt-3 border-t border-[#E6EEF7] space-y-2 text-xl text-[#1E3552]">
            <p className="font-bold text-[#D97706]">필요성 및 근거:</p>
            <p>• 아직 경쟁력이 부족한 국내 유치산업이 성장할 때까지 보호</p>
            <p>• 수입 급증으로 인한 국내 기업 도산과 실업 문제 예방</p>
            <p>• 선진국과 개발도상국 간 경제 격차 심화 방지 및 국가 안보·보건 유지</p>
          </div>
          <div className="pt-3 border-t border-[#E6EEF7] space-y-1.5 text-xl text-[#4B617B]">
            <p className="font-bold text-[#10233F]">한계:</p>
            <p>• 국내 소비자 가격 상승, 선택 폭 축소, 상대국의 보복 관세로 인한 무역 갈등</p>
          </div>
        </div>
      </section>

      {/* Interactive Tariff Policy Lab */}
      <section aria-label="관세 정책 실험실" className="bg-white rounded-2xl border border-[#D5E0EC] p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E6EEF7]">
          <div>
            <h2 className="text-3xl font-extrabold text-[#10233F] flex items-center gap-2.5">
              <Scale className="w-8 h-8 text-[#235E91]" />
              <span>무역 정책 실험: 관세율 변화와 가격 계산</span>
            </h2>
            <p className="text-xl text-[#4B617B] mt-1">
              가상의 수입 상품에 관세를 부과했을 때 가격 계산 결과와 시장 파급 효과를 구분해 살펴봅니다.
            </p>
          </div>

          <button
            type="button"
            onClick={resetTariffLab}
            className="px-4 py-2.5 rounded-xl border border-[#D5E0EC] bg-[#F7F9FC] hover:bg-[#EAF1F8] text-[#10233F] text-lg font-bold flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>관세 실험 초기화</span>
          </button>
        </div>

        {/* Product Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-lg font-bold text-[#354C66]">예시 상품:</span>
          {SAMPLE_PRODUCTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectSample(p.id)}
              className={`px-4 py-2.5 rounded-lg border text-lg font-bold cursor-pointer ${
                selectedProductId === p.id
                  ? 'bg-[#10233F] text-white border-[#10233F]'
                  : 'bg-[#F7F9FC] text-[#10233F] border-[#D5E0EC] hover:bg-[#EAF1F8]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="xl:col-span-5 bg-[#F7F9FC] rounded-xl border border-[#E1EAF3] p-6 space-y-6">
            <div>
              <label htmlFor="tariff-import-price" className="block text-xl font-bold text-[#10233F] mb-2">
                수입 원가 (관세 적용 전 가격, 원)
              </label>
              <input
                id="tariff-import-price"
                type="number"
                min={1000}
                step={1000}
                value={importPrice}
                onChange={(e) => {
                  setSelectedProductId('custom');
                  setImportPrice(Math.max(100, Number(e.target.value) || 0));
                }}
                className="w-full px-4 py-3 rounded-lg border border-[#CBD7E6] bg-white text-2xl font-extrabold font-math text-[#10233F]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="tariff-rate-slider" className="text-xl font-bold text-[#10233F]">
                  관세율 (%)
                </label>
                <span className="text-3xl font-extrabold font-math text-[#D97706]">
                  {tariffRate}%
                </span>
              </div>
              <input
                id="tariff-rate-slider"
                type="range"
                min={0}
                max={100}
                step={5}
                value={tariffRate}
                onChange={(e) => setTariffRate(Number(e.target.value))}
                className="w-full trade-slider"
              />
              <div className="flex justify-between text-base font-semibold text-[#4B617B]">
                <span>0% (무관세 · 자유무역)</span>
                <span>50%</span>
                <span>100% (고율 관세)</span>
              </div>
            </div>

            <div>
              <label htmlFor="tariff-qty" className="block text-xl font-bold text-[#10233F] mb-2">
                수입 물량 (단위)
              </label>
              <input
                id="tariff-qty"
                type="number"
                min={0}
                step={10}
                value={importQuantity}
                onChange={(e) => setImportQuantity(Math.max(0, Number(e.target.value) || 0))}
                className="w-full px-4 py-3 rounded-lg border border-[#CBD7E6] bg-white text-2xl font-extrabold font-math text-[#10233F]"
              />
            </div>
          </div>

          {/* Direct Arithmetic vs Economic Market Effects */}
          <div className="xl:col-span-7 space-y-5">
            <div className="bg-[#10233F] text-white rounded-xl p-6">
              <p className="text-base font-bold text-[#8CE4D9]">
                1. 직접적인 가격 계산 결과 (수입 원가 × (1 + 관세율))
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-base text-[#DCE8F5]">개당 부과 관세액</div>
                  <div className="text-3xl font-extrabold font-math text-[#FBBF24] mt-1">
                    +{Math.round(tariffResult.tariffPerUnit).toLocaleString()}원
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-base text-[#DCE8F5]">관세 적용 후 소비자 가격</div>
                  <div className="text-3xl font-extrabold font-math text-white mt-1">
                    {Math.round(tariffResult.consumerPriceAfterTariff).toLocaleString()}원
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-base text-[#DCE8F5]">예상 정부 관세 수입</div>
                  <div className="text-3xl font-extrabold font-math text-[#8CE4D9] mt-1">
                    {Math.round(tariffResult.totalTariffRevenue).toLocaleString()}원
                  </div>
                </div>
              </div>
              <p className="text-lg text-[#B8D4EE] mt-4 font-math">
                계산식: {importPrice.toLocaleString()}원 + ({importPrice.toLocaleString()}원 × {tariffRate}%) ={' '}
                {Math.round(tariffResult.consumerPriceAfterTariff).toLocaleString()}원
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-[#D5E0EC] bg-[#F7F9FC]">
                <h3 className="text-xl font-extrabold text-[#10233F]">
                  2-A. 국내 소비자에게 미치는 시장 영향
                </h3>
                <p className="text-lg text-[#354C66] mt-2 leading-relaxed">
                  {tariffRate === 0
                    ? '관세가 없으므로 소비자는 국제 시장의 낮은 가격 그대로 상품을 구매하고 선택의 폭이 넓어집니다.'
                    : `수입품 가격이 ${tariffRate}% 인상되면서 소비자의 구매 부담이 커지고, 경쟁 압력이 줄어든 국내 대체 상품 가격까지 함께 오를 수 있습니다.`}
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[#D5E0EC] bg-[#F7F9FC]">
                <h3 className="text-xl font-extrabold text-[#10233F]">
                  2-B. 국내 생산자와 교역국에 미치는 영향
                </h3>
                <p className="text-lg text-[#354C66] mt-2 leading-relaxed">
                  {tariffRate === 0
                    ? '해외 저가 상품과의 직접 경쟁으로 경쟁력이 취약한 국내 생산자는 매출 감소와 구조조정 압력을 받습니다.'
                    : '가격 경쟁력을 얻은 국내 경쟁 기업과 고용은 일시적으로 보호되지만, 장기적으로 혁신 유인이 약화되거나 상대국의 보복 관세를 부를 수 있습니다.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
