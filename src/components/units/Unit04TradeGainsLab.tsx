import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, Info, RotateCcw } from 'lucide-react';
import {
  calculateTradeSimulation,
  formatCleanDecimal,
  type TradeSimInputs,
} from '../../engine/tradeMath';

interface Unit04TradeGainsLabProps {
  simInputs: TradeSimInputs;
  onChangeSimInputs: (next: TradeSimInputs) => void;
  onReset: () => void;
}

interface SinglePpcSvgProps {
  countryName: string;
  goodXLabel: string;
  goodYLabel: string;
  maxX: number;
  maxY: number;
  preTrade: { x: number; y: number };
  specProd: { x: number; y: number };
  postTrade: { x: number; y: number };
  isOutside: boolean;
  accentColor: string;
}

const SinglePpcSvg: React.FC<SinglePpcSvgProps> = ({
  countryName,
  goodXLabel,
  goodYLabel,
  maxX,
  maxY,
  preTrade,
  specProd,
  postTrade,
  isOutside,
  accentColor,
}) => {
  // Dynamic domain to ensure post-trade point outside PPC never clips
  const domainX = Math.max(maxX, postTrade.x, preTrade.x) * 1.25;
  const domainY = Math.max(maxY, postTrade.y, preTrade.y) * 1.25;

  const width = 520;
  const height = 380;
  const padLeft = 72;
  const padRight = 32;
  const padTop = 36;
  const padBottom = 64;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const mapX = (x: number) => padLeft + (x / domainX) * plotW;
  const mapY = (y: number) => padTop + plotH - (y / domainY) * plotH;

  const x0 = mapX(0);
  const y0 = mapY(0);
  const xMaxPx = mapX(maxX);
  const yMaxPx = mapY(maxY);

  const prePx = { x: mapX(preTrade.x), y: mapY(preTrade.y) };
  const specPx = { x: mapX(specProd.x), y: mapY(specProd.y) };
  const postPx = { x: mapX(postTrade.x), y: mapY(postTrade.y) };

  return (
    <div className="bg-[#F7F9FC] rounded-xl border border-[#D5E0EC] p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-2xl font-extrabold text-[#10233F]">{countryName} 생산가능곡선 (PPC)</h3>
        <span
          className={`text-base font-bold ${
            isOutside ? 'text-[#1D9A97]' : 'text-[#4B617B]'
          }`}
        >
          {isOutside ? '● 교역 후 소비점: 곡선 밖 도달' : '○ 교역 후 소비점: 곡선 내/위'}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto bg-white rounded-lg border border-[#E1EAF3]"
        role="img"
        aria-label={`${countryName} 생산가능곡선 그래프`}
      >
        {/* Subtle Grid */}
        {[0.25, 0.5, 0.75, 1].map((t) => {
          const gx = padLeft + plotW * t;
          const gy = padTop + plotH * (1 - t);
          return (
            <g key={t}>
              <line x1={gx} y1={padTop} x2={gx} y2={y0} stroke="#EEF3F8" strokeWidth="1.5" />
              <line x1={padLeft} y1={gy} x2={padLeft + plotW} y2={gy} stroke="#EEF3F8" strokeWidth="1.5" />
            </g>
          );
        })}

        {/* Shaded Domestic Feasible Area */}
        <polygon
          points={`${x0},${y0} ${x0},${yMaxPx} ${xMaxPx},${y0}`}
          fill={accentColor}
          fillOpacity="0.10"
        />

        {/* Axes */}
        <line x1={x0} y1={padTop - 10} x2={x0} y2={y0} stroke="#10233F" strokeWidth="2.5" />
        <line x1={x0} y1={y0} x2={padLeft + plotW + 10} y2={y0} stroke="#10233F" strokeWidth="2.5" />

        {/* PPC Line */}
        <line
          x1={x0}
          y1={yMaxPx}
          x2={xMaxPx}
          y2={y0}
          stroke={accentColor}
          strokeWidth="4"
        />

        {/* Exchange Path from Spec Point to Post-Trade Consumption Point */}
        <line
          x1={specPx.x}
          y1={specPx.y}
          x2={postPx.x}
          y2={postPx.y}
          stroke="#1D9A97"
          strokeWidth="3"
          strokeDasharray="7 5"
        />

        {/* Axis Intercept Labels */}
        <text
          x={x0 - 12}
          y={yMaxPx + 6}
          textAnchor="end"
          fontSize="18"
          fontWeight="700"
          fill="#10233F"
        >
          {formatCleanDecimal(maxY)}
        </text>
        <text
          x={xMaxPx}
          y={y0 + 26}
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="#10233F"
        >
          {formatCleanDecimal(maxX)}
        </text>
        <text x={x0 - 14} y={y0 + 24} textAnchor="end" fontSize="16" fontWeight="600" fill="#4B617B">
          0
        </text>

        {/* Axis Titles */}
        <text x={padLeft + 8} y={padTop - 10} fontSize="17" fontWeight="700" fill="#10233F">
          {goodYLabel}
        </text>
        <text
          x={padLeft + plotW}
          y={height - 14}
          textAnchor="end"
          fontSize="17"
          fontWeight="700"
          fill="#10233F"
        >
          {goodXLabel}
        </text>

        {/* Pre-Trade Point */}
        <circle cx={prePx.x} cy={prePx.y} r="7" fill="#64748B" stroke="#FFFFFF" strokeWidth="2.5" />
        <text
          x={Math.max(padLeft + 10, prePx.x - 12)}
          y={Math.min(y0 - 12, prePx.y + 22)}
          textAnchor={prePx.x - padLeft < 140 ? 'start' : 'end'}
          fontSize="16"
          fontWeight="700"
          fill="#334155"
          stroke="#FFFFFF"
          strokeWidth="5"
          paintOrder="stroke"
        >
          무역전 ({formatCleanDecimal(preTrade.x, 1)}, {formatCleanDecimal(preTrade.y, 1)})
        </text>

        {/* Specialization Production Point */}
        <circle cx={specPx.x} cy={specPx.y} r="7.5" fill={accentColor} stroke="#FFFFFF" strokeWidth="2.5" />
        <text
          x={specProd.x > 0 ? Math.min(specPx.x - 10, padLeft + plotW - 10) : specPx.x + 14}
          y={specProd.x > 0 ? specPx.y - 16 : specPx.y + 6}
          textAnchor={specProd.x > 0 ? 'end' : 'start'}
          fontSize="16"
          fontWeight="800"
          fill={accentColor}
          stroke="#FFFFFF"
          strokeWidth="5"
          paintOrder="stroke"
        >
          특화점 ({formatCleanDecimal(specProd.x, 1)}, {formatCleanDecimal(specProd.y, 1)})
        </text>

        {/* Post-Trade Consumption Point */}
        <circle cx={postPx.x} cy={postPx.y} r="9" fill="#1D9A97" stroke="#FFFFFF" strokeWidth="2.5" />
        <text
          x={Math.min(postPx.x + 14, padLeft + plotW - 150)}
          y={Math.max(postPx.y - 14, padTop + 20)}
          fontSize="17"
          fontWeight="800"
          fill="#0F766E"
          stroke="#FFFFFF"
          strokeWidth="5"
          paintOrder="stroke"
        >
          교역후 ({formatCleanDecimal(postTrade.x, 1)}, {formatCleanDecimal(postTrade.y, 1)})
        </text>
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-5 text-base font-semibold text-[#354C66]">
        <span>[회색 점] 무역 전 자급자족점</span>
        <span style={{ color: accentColor }}>[실선] 국내 생산가능곡선</span>
        <span className="text-[#1D9A97]">[초록 점·점선] 교역 후 소비점</span>
      </div>
    </div>
  );
};

export const Unit04TradeGainsLab: React.FC<Unit04TradeGainsLabProps> = ({
  simInputs,
  onChangeSimInputs,
  onReset,
}) => {
  const sim = useMemo(() => calculateTradeSimulation(simInputs), [simInputs]);

  const {
    countryAName,
    countryBName,
    goodXName,
    goodXUnit,
    goodYName,
    goodYUnit,
    aMaxX,
    aMaxY,
    bMaxX,
    bMaxY,
    yPerX,
    exportAmountX,
  } = simInputs;

  const sliderMinTerms = sim.valid && sim.minYPerX > 0 ? Math.max(0.2, Number((sim.minYPerX * 0.5).toFixed(2))) : 0.5;
  const sliderMaxTerms = sim.valid && sim.maxYPerX > 0 ? Number((sim.maxYPerX * 1.5).toFixed(2)) : 5;

  const updateNum = (field: keyof TradeSimInputs, value: number) => {
    if (!Number.isFinite(value)) return;
    onChangeSimInputs({ ...simInputs, [field]: value });
  };

  const xExporterName = sim.xExporter === 'A' ? countryAName : countryBName;
  const yExporterName = sim.yExporter === 'A' ? countryAName : countryBName;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#D5E0EC] flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-lg font-bold text-[#1D9A97]">UNIT 04 · 생산가능곡선 &amp; 무역 협상 시뮬레이터</p>
          <h1 className="text-4xl font-extrabold text-[#10233F] mt-1">
            특화와 교역은 어떻게 자국의 한계를 뛰어넘을까?
          </h1>
          <p className="text-2xl text-[#4B617B] mt-2">
            생산 능력, 교역 조건, 수출량을 직접 조절하며 생산가능곡선 밖의 소비를 확인해 보세요.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="px-5 py-3 rounded-xl border border-[#D5E0EC] bg-white hover:bg-[#F7F9FC] text-[#10233F] text-lg font-bold flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>시뮬레이터 초기화</span>
        </button>
      </div>

      {/* Model Assumption Notice */}
      <div className="bg-[#EEF5FC] border border-[#C6DCF2] rounded-xl px-6 py-4 flex flex-wrap items-center gap-3 text-lg text-[#10233F]">
        <Info className="w-6 h-6 text-[#235E91] shrink-0" />
        <span>
          <strong>단순 모형 가정:</strong> 본 시뮬레이터는 두 나라와 두 재화만 존재하고, 운송비·거래비용이 없으며, 생산성이 일정하여 생산가능곡선이 직선인 표준 교과서 모형을 기준으로 계산합니다.
        </span>
      </div>

      {/* Interactive PPC Charts */}
      {sim.valid && (
        <section aria-label="생산가능곡선 시각화" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SinglePpcSvg
            countryName={countryAName}
            goodXLabel={`${goodXName} (${goodXUnit})`}
            goodYLabel={`${goodYName} (${goodYUnit})`}
            maxX={aMaxX}
            maxY={aMaxY}
            preTrade={sim.preTradeA}
            specProd={sim.specProdA}
            postTrade={sim.postTradeA}
            isOutside={sim.isAOutsidePPC}
            accentColor="#235E91"
          />
          <SinglePpcSvg
            countryName={countryBName}
            goodXLabel={`${goodXName} (${goodXUnit})`}
            goodYLabel={`${goodYName} (${goodYUnit})`}
            maxX={bMaxX}
            maxY={bMaxY}
            preTrade={sim.preTradeB}
            specProd={sim.specProdB}
            postTrade={sim.postTradeB}
            isOutside={sim.isBOutsidePPC}
            accentColor="#D97706"
          />
        </section>
      )}

      {/* Control Deck & Negotiation Table */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left: Controls (Production Capacities + Negotiation Sliders) */}
        <section
          aria-label="무역 협상 조절 패널"
          className="xl:col-span-5 bg-white rounded-2xl border border-[#D5E0EC] p-7 space-y-6"
        >
          <h2 className="text-2xl font-extrabold text-[#10233F]">1. 최대 생산 가능량 설정</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ppc-a-x" className="block text-base font-bold text-[#354C66] mb-1">
                {countryAName} {goodXName} 최대 ({goodXUnit})
              </label>
              <input
                id="ppc-a-x"
                type="number"
                min={1}
                step={1}
                value={aMaxX}
                onChange={(e) => updateNum('aMaxX', Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD7E6] text-2xl font-bold font-math text-[#10233F]"
              />
            </div>
            <div>
              <label htmlFor="ppc-a-y" className="block text-base font-bold text-[#354C66] mb-1">
                {countryAName} {goodYName} 최대 ({goodYUnit})
              </label>
              <input
                id="ppc-a-y"
                type="number"
                min={1}
                step={1}
                value={aMaxY}
                onChange={(e) => updateNum('aMaxY', Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD7E6] text-2xl font-bold font-math text-[#10233F]"
              />
            </div>
            <div>
              <label htmlFor="ppc-b-x" className="block text-base font-bold text-[#354C66] mb-1">
                {countryBName} {goodXName} 최대 ({goodXUnit})
              </label>
              <input
                id="ppc-b-x"
                type="number"
                min={1}
                step={1}
                value={bMaxX}
                onChange={(e) => updateNum('bMaxX', Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD7E6] text-2xl font-bold font-math text-[#10233F]"
              />
            </div>
            <div>
              <label htmlFor="ppc-b-y" className="block text-base font-bold text-[#354C66] mb-1">
                {countryBName} {goodYName} 최대 ({goodYUnit})
              </label>
              <input
                id="ppc-b-y"
                type="number"
                min={1}
                step={1}
                value={bMaxY}
                onChange={(e) => updateNum('bMaxY', Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD7E6] text-2xl font-bold font-math text-[#10233F]"
              />
            </div>
          </div>

          {/* Terms of Trade Slider */}
          <div className="pt-4 border-t border-[#E6EEF7] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="terms-slider" className="text-xl font-extrabold text-[#10233F]">
                2. 교역 조건 ({goodXName} 1{goodXUnit}당 {goodYName})
              </label>
              <span className="text-2xl font-extrabold font-math text-[#1D9A97]">
                1 : {formatCleanDecimal(yPerX, 2)}
              </span>
            </div>

            <input
              id="terms-slider"
              type="range"
              min={sliderMinTerms}
              max={sliderMaxTerms}
              step={0.1}
              value={yPerX}
              onChange={(e) => updateNum('yPerX', Number(e.target.value))}
              className="w-full trade-slider"
            />

            <div className="flex items-center justify-between text-base font-semibold text-[#4B617B] tabular-nums">
              <span>{sliderMinTerms}</span>
              <span className="text-[#1D9A97] font-bold">
                상호 이익 구간: {formatCleanDecimal(sim.minYPerX, 2)} ~ {formatCleanDecimal(sim.maxYPerX, 2)}
              </span>
              <span>{sliderMaxTerms}</span>
            </div>
          </div>

          {/* Export Volume Slider */}
          <div className="pt-4 border-t border-[#E6EEF7] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="export-slider" className="text-xl font-extrabold text-[#10233F]">
                3. {xExporterName || countryAName}의 {goodXName} 수출량
              </label>
              <span className="text-2xl font-extrabold font-math text-[#235E91]">
                {formatCleanDecimal(sim.actualExportX, 1)}
                {goodXUnit} ↔ {formatCleanDecimal(sim.actualExportY, 1)}
                {goodYUnit}
              </span>
            </div>

            <input
              id="export-slider"
              type="range"
              min={0}
              max={Math.max(0.5, sim.maxPossibleExportX)}
              step={0.5}
              value={sim.actualExportX}
              disabled={!sim.xExporter}
              onChange={(e) => updateNum('exportAmountX', Number(e.target.value))}
              className="w-full trade-slider"
            />

            <div className="flex items-center justify-between text-base font-semibold text-[#4B617B]">
              <span>0{goodXUnit} (교역 없음)</span>
              <span>최대 교역 가능: {formatCleanDecimal(sim.maxPossibleExportX, 1)}{goodXUnit}</span>
            </div>
          </div>
        </section>

        {/* Right: Trade Negotiation Outcomes & Comparison Table */}
        <section
          aria-label="교역 조건 판정 및 무역 전후 비교"
          className="xl:col-span-7 space-y-6"
        >
          {/* Terms Status Banner */}
          <div
            role="status"
            className={`rounded-2xl border p-6 flex items-start gap-4 ${
              sim.termsStatus === 'mutual_gain'
                ? 'bg-[#F2FBF9] border-[#1D9A97] text-[#10233F]'
                : 'bg-amber-50 border-amber-400 text-amber-950'
            }`}
          >
            {sim.termsStatus === 'mutual_gain' ? (
              <CheckCircle2 className="w-8 h-8 text-[#1D9A97] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="text-2xl font-extrabold">
                {sim.termsStatus === 'mutual_gain'
                  ? '상호 이익 교역 조건 성립'
                  : sim.termsStatus === 'no_comparative_advantage'
                    ? '비교우위 없음 (기회비용 동일)'
                    : sim.termsStatus.startsWith('boundary')
                      ? '경계값 교역 조건 (한쪽 국가 이익 0)'
                      : '불리한 교역 조건 (교역 결렬 위험)'}
              </h3>
              <p className="text-xl mt-2 leading-relaxed">{sim.termsExplanation}</p>
            </div>
          </div>

          {/* Pre-Trade vs Post-Trade Consumption Table */}
          <div className="bg-white rounded-2xl border border-[#D5E0EC] p-7">
            <h3 className="text-2xl font-extrabold text-[#10233F] mb-4">
              무역 전후 생산 · 소비량 비교표
            </h3>
            <p className="text-lg text-[#4B617B] mb-4">
              {sim.xExporter
                ? `비교우위 특화: ${xExporterName}은 ${goodXName}, ${yExporterName}은 ${goodYName}만 전량 생산 후 교환합니다.`
                : '두 나라의 기회비용이 같아 자급자족 상태를 유지합니다.'}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-center">
                <thead>
                  <tr className="bg-[#10233F] text-white">
                    <th className="py-3.5 px-4 text-lg font-bold border border-[#235E91]">국가 / 재화</th>
                    <th className="py-3.5 px-4 text-lg font-bold border border-[#235E91]">
                      무역 전 소비(절반 투입)
                    </th>
                    <th className="py-3.5 px-4 text-lg font-bold border border-[#235E91]">
                      특화 후 생산량
                    </th>
                    <th className="py-3.5 px-4 text-lg font-bold border border-[#235E91]">
                      교역 후 소비량
                    </th>
                    <th className="py-3.5 px-4 text-lg font-bold border border-[#235E91]">
                      무역 이익 (변화량)
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xl tabular-nums">
                  <tr className="bg-[#F7F9FC]">
                    <td className="py-4 px-4 font-extrabold text-[#10233F] border border-[#D5E0EC]">
                      {countryAName} · {goodXName}
                    </td>
                    <td className="py-4 px-4 border border-[#D5E0EC]">
                      {formatCleanDecimal(sim.preTradeA.x, 1)}{goodXUnit}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#235E91] border border-[#D5E0EC]">
                      {formatCleanDecimal(sim.specProdA.x, 1)}{goodXUnit}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-[#10233F] border border-[#D5E0EC]">
                      {formatCleanDecimal(sim.postTradeA.x, 1)}{goodXUnit}
                    </td>
                    <td
                      className={`py-4 px-4 font-extrabold border border-[#D5E0EC] ${
                        sim.gainA.dx >= 0 ? 'text-[#1D9A97]' : 'text-red-600'
                      }`}
                    >
                      {sim.gainA.dx >= 0 ? '+' : ''}
                      {formatCleanDecimal(sim.gainA.dx, 1)}{goodXUnit}
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-4 px-4 font-extrabold text-[#10233F] border border-[#D5E0EC]">
                      {countryAName} · {goodYName}
                    </td>
                    <td className="py-4 px-4 border border-[#D5E0EC]">
                      {formatCleanDecimal(sim.preTradeA.y, 1)}{goodYUnit}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#235E91] border border-[#D5E0EC]">
                      {formatCleanDecimal(sim.specProdA.y, 1)}{goodYUnit}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-[#10233F] border border-[#D5E0EC]">
                      {formatCleanDecimal(sim.postTradeA.y, 1)}{goodYUnit}
                    </td>
                    <td
                      className={`py-4 px-4 font-extrabold border border-[#D5E0EC] ${
                        sim.gainA.dy >= 0 ? 'text-[#1D9A97]' : 'text-red-600'
                      }`}
                    >
                      {sim.gainA.dy >= 0 ? '+' : ''}
                      {formatCleanDecimal(sim.gainA.dy, 1)}{goodYUnit}
                    </td>
                  </tr>
                  <tr className="bg-[#F7F9FC]">
                    <td className="py-4 px-4 font-extrabold text-[#10233F] border border-[#D5E0EC]">
                      {countryBName} · {goodXName}
                    </td>
                    <td className="py-4 px-4 border border-[#D5E0EC]">
                      {formatCleanDecimal(sim.preTradeB.x, 1)}{goodXUnit}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#D97706] border border-[#D5E0EC]">
                      {formatCleanDecimal(sim.specProdB.x, 1)}{goodXUnit}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-[#10233F] border border-[#D5E0EC]">
                      {formatCleanDecimal(sim.postTradeB.x, 1)}{goodXUnit}
                    </td>
                    <td
                      className={`py-4 px-4 font-extrabold border border-[#D5E0EC] ${
                        sim.gainB.dx >= 0 ? 'text-[#1D9A97]' : 'text-red-600'
                      }`}
                    >
                      {sim.gainB.dx >= 0 ? '+' : ''}
                      {formatCleanDecimal(sim.gainB.dx, 1)}{goodXUnit}
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-4 px-4 font-extrabold text-[#10233F] border border-[#D5E0EC]">
                      {countryBName} · {goodYName}
                    </td>
                    <td className="py-4 px-4 border border-[#D5E0EC]">
                      {formatCleanDecimal(sim.preTradeB.y, 1)}{goodYUnit}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#D97706] border border-[#D5E0EC]">
                      {formatCleanDecimal(sim.specProdB.y, 1)}{goodYUnit}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-[#10233F] border border-[#D5E0EC]">
                      {formatCleanDecimal(sim.postTradeB.y, 1)}{goodYUnit}
                    </td>
                    <td
                      className={`py-4 px-4 font-extrabold border border-[#D5E0EC] ${
                        sim.gainB.dy >= 0 ? 'text-[#1D9A97]' : 'text-red-600'
                      }`}
                    >
                      {sim.gainB.dy >= 0 ? '+' : ''}
                      {formatCleanDecimal(sim.gainB.dy, 1)}{goodYUnit}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Principle Recap */}
            <div className="mt-5 p-5 rounded-xl bg-[#F7F9FC] border border-[#E1EAF3] text-xl text-[#1E3552] leading-relaxed">
              <strong className="text-[#10233F]">왜 소비점이 생산가능곡선 밖으로 나갈 수 있을까?</strong>{' '}
              한 나라가 자급자족할 때는 자국이 생산할 수 있는 조합(생산가능곡선 내부 또는 선 위)만 소비할 수 있습니다.
              하지만 비교우위 재화에 특화한 뒤 상대국과 유리한 비율로 교환하면, 자국 안에서 직접 만드는 것보다 적은 비용으로 수입 재화를 얻기 때문에 국내 생산 한계를 넘어선 소비 조합에 도달할 수 있습니다.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
