import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  RotateCcw,
} from 'lucide-react';
import {
  analyzeComparativeAdvantage,
  formatCleanDecimal,
  type LabInputs,
} from '../../engine/tradeMath';
import type { DataInputMode } from '../../types/curriculum';

export interface LabPreset {
  id: string;
  label: string;
  inputs: LabInputs;
}

export const LAB_PRESETS: LabPreset[] = [
  {
    id: 'cloth_rice',
    label: '기본 검증 (옷 10/5 · 쌀 20/15)',
    inputs: {
      mode: 'production',
      countryAName: '갑국',
      countryBName: '을국',
      goodXName: '옷',
      goodXUnit: '벌',
      goodYName: '쌀',
      goodYUnit: '포대',
      laborUnit: '시간',
      aX: '10',
      aY: '20',
      bX: '5',
      bY: '15',
    },
  },
  {
    id: 'fish_berries',
    label: '모두 절대우위 (물고기 15/12 · 열매 24/9)',
    inputs: {
      mode: 'production',
      countryAName: '갑국',
      countryBName: '을국',
      goodXName: '물고기',
      goodXUnit: '마리',
      goodYName: '열매',
      goodYUnit: '개',
      laborUnit: '일',
      aX: '15',
      aY: '24',
      bX: '12',
      bY: '9',
    },
  },
  {
    id: 'labor_xy',
    label: '노동 투입량 (X재 10/4명 · Y재 5/8명)',
    inputs: {
      mode: 'labor',
      countryAName: '갑국',
      countryBName: '을국',
      goodXName: 'X재',
      goodXUnit: '개',
      goodYName: 'Y재',
      goodYUnit: '개',
      laborUnit: '명',
      aX: '10',
      aY: '5',
      bX: '4',
      bY: '8',
    },
  },
  {
    id: 'equal_oc',
    label: '예외: 기회비용 동일 (옷 10/5 · 쌀 20/10)',
    inputs: {
      mode: 'production',
      countryAName: '갑국',
      countryBName: '을국',
      goodXName: '옷',
      goodXUnit: '벌',
      goodYName: '쌀',
      goodYUnit: '포대',
      laborUnit: '시간',
      aX: '10',
      aY: '20',
      bX: '5',
      bY: '10',
    },
  },
];

interface Unit03CalculatorLabProps {
  inputs: LabInputs;
  revealedSteps: number; // 0..6
  onChangeInputs: (next: LabInputs) => void;
  onChangeRevealedSteps: (steps: number) => void;
  onReset: () => void;
  onSendToPpcSimulator: (inputs: LabInputs) => void;
}

const STEP_LABELS = [
  '① 자료 유형 확인',
  '② 절대우위 판단',
  '③ 기회비용 공식',
  '④ 각국의 기회비용',
  '⑤ 비교우위 판정',
  '⑥ 특화 및 교역 방향',
];

export const Unit03CalculatorLab: React.FC<Unit03CalculatorLabProps> = ({
  inputs,
  revealedSteps,
  onChangeInputs,
  onChangeRevealedSteps,
  onReset,
  onSendToPpcSimulator,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('cloth_rice');

  const analysis = useMemo(() => analyzeComparativeAdvantage(inputs), [inputs]);

  const countryA = inputs.countryAName.trim() || '갑국';
  const countryB = inputs.countryBName.trim() || '을국';
  const goodX = inputs.goodXName.trim() || 'X재';
  const goodY = inputs.goodYName.trim() || 'Y재';
  const unitX = inputs.goodXUnit.trim() || '개';
  const unitY = inputs.goodYUnit.trim() || '개';
  const laborUnit = inputs.laborUnit.trim() || '시간';

  const updateField = (field: keyof LabInputs, value: string) => {
    setSelectedPresetId('custom');
    onChangeInputs({ ...inputs, [field]: value });
  };

  const handleModeChange = (mode: DataInputMode) => {
    setSelectedPresetId('custom');
    onChangeInputs({ ...inputs, mode });
  };

  const applyPreset = (preset: LabPreset) => {
    setSelectedPresetId(preset.id);
    onChangeInputs({ ...preset.inputs });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#D5E0EC] flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-lg font-bold text-[#1D9A97]">UNIT 03 · 인터랙티브 경제 실험실</p>
          <h1 className="text-4xl font-extrabold text-[#10233F] mt-1">
            기회비용과 비교우위 계산 실험실
          </h1>
          <p className="text-2xl text-[#4B617B] mt-2">
            자료 유형을 선택하고 숫자를 바꾸면 절대우위·기회비용·비교우위·특화가 실시간으로 계산됩니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-3 rounded-xl border border-[#D5E0EC] bg-white hover:bg-[#F7F9FC] text-[#10233F] text-lg font-bold flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>실험실 초기화</span>
          </button>
          {analysis.valid && analysis.comparativeAdvantage.hasComparativeAdvantage && (
            <button
              type="button"
              onClick={() => onSendToPpcSimulator(inputs)}
              className="px-5 py-3 rounded-xl bg-[#235E91] hover:bg-[#10233F] text-white text-lg font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>이 자료로 UNIT 04 그래프 그리기</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Presets Strip */}
      <div className="bg-white rounded-2xl border border-[#D5E0EC] p-5 flex flex-wrap items-center gap-3">
        <span className="text-lg font-extrabold text-[#10233F] mr-2">수업 검증 예제:</span>
        {LAB_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyPreset(preset)}
            className={`px-4 py-2.5 rounded-lg border text-lg font-semibold cursor-pointer transition-colors ${
              selectedPresetId === preset.id
                ? 'bg-[#10233F] text-white border-[#10233F]'
                : 'bg-[#F7F9FC] text-[#10233F] border-[#D5E0EC] hover:bg-[#EAF1F8]'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main 2-Zone Layout: Left Input Control Deck, Right Progressive Calculation Stage */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left: Input Controls */}
        <section
          aria-label="자료 입력 설정"
          className="xl:col-span-5 bg-white rounded-2xl border border-[#D5E0EC] p-7 space-y-6"
        >
          {/* Data Type Switcher */}
          <div>
            <h2 className="text-2xl font-extrabold text-[#10233F] mb-3">1. 자료 유형 선택</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="자료 유형">
              <button
                type="button"
                role="radio"
                aria-checked={inputs.mode === 'production'}
                onClick={() => handleModeChange('production')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  inputs.mode === 'production'
                    ? 'bg-[#10233F] text-white border-[#10233F]'
                    : 'bg-[#F7F9FC] text-[#10233F] border-[#D5E0EC] hover:border-[#235E91]'
                }`}
              >
                <div className="text-base font-bold text-[#8CE4D9]">유형 A</div>
                <div className="text-xl font-extrabold mt-1">최대 생산량 자료</div>
                <div
                  className={`text-base mt-1 ${
                    inputs.mode === 'production' ? 'text-[#DCE8F5]' : 'text-[#4B617B]'
                  }`}
                >
                  동일 자원으로 최대 생산 가능량
                </div>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={inputs.mode === 'labor'}
                onClick={() => handleModeChange('labor')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  inputs.mode === 'labor'
                    ? 'bg-[#10233F] text-white border-[#10233F]'
                    : 'bg-[#F7F9FC] text-[#10233F] border-[#D5E0EC] hover:border-[#235E91]'
                }`}
              >
                <div className="text-base font-bold text-[#8CE4D9]">유형 B</div>
                <div className="text-xl font-extrabold mt-1">노동 투입량 자료</div>
                <div
                  className={`text-base mt-1 ${
                    inputs.mode === 'labor' ? 'text-[#DCE8F5]' : 'text-[#4B617B]'
                  }`}
                >
                  재화 1단위 생산 필요 시간·인원
                </div>
              </button>
            </div>
          </div>

          {/* Names & Units */}
          <div className="space-y-3">
            <h2 className="text-xl font-extrabold text-[#10233F]">2. 국가 · 재화 · 단위 설정</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="lab-country-a" className="block text-sm font-bold text-[#354C66] mb-1">
                  국가 A 이름
                </label>
                <input
                  id="lab-country-a"
                  type="text"
                  value={inputs.countryAName}
                  onChange={(e) => updateField('countryAName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD7E6] bg-[#F7F9FC] text-lg font-bold text-[#10233F] focus:outline-none focus:border-[#1D9A97]"
                />
              </div>
              <div>
                <label htmlFor="lab-country-b" className="block text-sm font-bold text-[#354C66] mb-1">
                  국가 B 이름
                </label>
                <input
                  id="lab-country-b"
                  type="text"
                  value={inputs.countryBName}
                  onChange={(e) => updateField('countryBName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD7E6] bg-[#F7F9FC] text-lg font-bold text-[#10233F] focus:outline-none focus:border-[#1D9A97]"
                />
              </div>
              {inputs.mode === 'labor' && (
                <div>
                  <label htmlFor="lab-labor-unit" className="block text-sm font-bold text-[#354C66] mb-1">
                    노동 단위
                  </label>
                  <input
                    id="lab-labor-unit"
                    type="text"
                    value={inputs.laborUnit}
                    onChange={(e) => updateField('laborUnit', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD7E6] bg-[#F7F9FC] text-lg font-bold text-[#10233F] focus:outline-none focus:border-[#1D9A97]"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label htmlFor="lab-good-x" className="block text-sm font-bold text-[#354C66] mb-1">
                  재화 X
                </label>
                <input
                  id="lab-good-x"
                  type="text"
                  value={inputs.goodXName}
                  onChange={(e) => updateField('goodXName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD7E6] bg-[#F7F9FC] text-lg font-bold text-[#10233F] focus:outline-none focus:border-[#1D9A97]"
                />
              </div>
              <div>
                <label htmlFor="lab-unit-x" className="block text-sm font-bold text-[#354C66] mb-1">
                  X 단위
                </label>
                <input
                  id="lab-unit-x"
                  type="text"
                  value={inputs.goodXUnit}
                  onChange={(e) => updateField('goodXUnit', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD7E6] bg-[#F7F9FC] text-lg font-bold text-[#10233F] focus:outline-none focus:border-[#1D9A97]"
                />
              </div>
              <div>
                <label htmlFor="lab-good-y" className="block text-sm font-bold text-[#354C66] mb-1">
                  재화 Y
                </label>
                <input
                  id="lab-good-y"
                  type="text"
                  value={inputs.goodYName}
                  onChange={(e) => updateField('goodYName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD7E6] bg-[#F7F9FC] text-lg font-bold text-[#10233F] focus:outline-none focus:border-[#1D9A97]"
                />
              </div>
              <div>
                <label htmlFor="lab-unit-y" className="block text-sm font-bold text-[#354C66] mb-1">
                  Y 단위
                </label>
                <input
                  id="lab-unit-y"
                  type="text"
                  value={inputs.goodYUnit}
                  onChange={(e) => updateField('goodYUnit', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD7E6] bg-[#F7F9FC] text-lg font-bold text-[#10233F] focus:outline-none focus:border-[#1D9A97]"
                />
              </div>
            </div>
          </div>

          {/* Numeric Matrix Table */}
          <div>
            <h2 className="text-2xl font-extrabold text-[#10233F] mb-2">
              3. 수치 입력 (소수 · 분수 입력 가능, 예: 2.5 또는 3/4)
            </h2>
            <p className="text-base text-[#4B617B] mb-3">
              {inputs.mode === 'production'
                ? `동일한 자원으로 생산 가능한 최대 수량을 입력하세요.`
                : `각 재화 1단위를 생산하는 데 필요한 ${laborUnit}을(를) 입력하세요.`}
            </p>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#10233F] text-white">
                  <th className="py-3 px-3 text-lg font-bold border border-[#235E91]">구분</th>
                  <th className="py-3 px-3 text-lg font-bold border border-[#235E91]">
                    {goodX} ({inputs.mode === 'production' ? unitX : `1${unitX}당 ${laborUnit}`})
                  </th>
                  <th className="py-3 px-3 text-lg font-bold border border-[#235E91]">
                    {goodY} ({inputs.mode === 'production' ? unitY : `1${unitY}당 ${laborUnit}`})
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-3 text-xl font-extrabold text-[#10233F] bg-[#F7F9FC] border border-[#D5E0EC] text-center">
                    {countryA}
                  </td>
                  <td className="p-2 border border-[#D5E0EC]">
                    <input
                      aria-label={`${countryA} ${goodX} 수치`}
                      type="text"
                      value={inputs.aX}
                      onChange={(e) => updateField('aX', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-[#CBD7E6] text-2xl font-bold font-math text-center text-[#10233F] focus:outline-none focus:border-[#1D9A97]"
                    />
                  </td>
                  <td className="p-2 border border-[#D5E0EC]">
                    <input
                      aria-label={`${countryA} ${goodY} 수치`}
                      type="text"
                      value={inputs.aY}
                      onChange={(e) => updateField('aY', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-[#CBD7E6] text-2xl font-bold font-math text-center text-[#10233F] focus:outline-none focus:border-[#1D9A97]"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-xl font-extrabold text-[#10233F] bg-[#F7F9FC] border border-[#D5E0EC] text-center">
                    {countryB}
                  </td>
                  <td className="p-2 border border-[#D5E0EC]">
                    <input
                      aria-label={`${countryB} ${goodX} 수치`}
                      type="text"
                      value={inputs.bX}
                      onChange={(e) => updateField('bX', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-[#CBD7E6] text-2xl font-bold font-math text-center text-[#10233F] focus:outline-none focus:border-[#1D9A97]"
                    />
                  </td>
                  <td className="p-2 border border-[#D5E0EC]">
                    <input
                      aria-label={`${countryB} ${goodY} 수치`}
                      type="text"
                      value={inputs.bY}
                      onChange={(e) => updateField('bY', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-[#CBD7E6] text-2xl font-bold font-math text-center text-[#10233F] focus:outline-none focus:border-[#1D9A97]"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Errors or Warnings */}
          {!analysis.valid && (
            <div role="alert" className="bg-red-50 border border-red-300 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-red-800 text-xl font-bold">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <span>입력값을 확인해 주세요</span>
              </div>
              <ul className="space-y-1 text-lg text-red-700">
                {analysis.errors.map((err) => (
                  <li key={err}>• {err}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.valid && analysis.warnings.length > 0 && (
            <div role="status" className="bg-amber-50 border border-amber-300 rounded-xl p-5 space-y-1">
              <div className="flex items-center gap-2 text-amber-900 text-xl font-bold">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <span>주의 및 예외 상황 안내</span>
              </div>
              {analysis.warnings.map((w) => (
                <p key={w} className="text-lg text-amber-800 leading-relaxed">
                  {w}
                </p>
              ))}
            </div>
          )}
        </section>

        {/* Right: Step-by-Step Teacher Disclosure Stage */}
        <section
          aria-label="단계별 계산 결과 공개"
          className="xl:col-span-7 bg-white rounded-2xl border border-[#D5E0EC] p-7 space-y-6"
        >
          {/* Step Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E6EEF7]">
            <div>
              <h2 className="text-3xl font-extrabold text-[#10233F]">
                단계별 결과 공개 ({revealedSteps}/6 단계)
              </h2>
              <p className="text-lg text-[#4B617B] mt-1">
                기본적으로 정답이 숨겨져 있습니다. 수업 흐름에 맞춰 한 단계씩 공개하세요.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onChangeRevealedSteps(Math.min(6, revealedSteps + 1))}
                disabled={!analysis.valid || revealedSteps >= 6}
                className="px-5 py-3 rounded-xl bg-[#1D9A97] hover:bg-[#17827F] disabled:opacity-40 text-white text-lg font-bold flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-5 h-5" />
                <span>다음 단계 공개</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeRevealedSteps(6)}
                disabled={!analysis.valid}
                className="px-4 py-3 rounded-xl bg-[#10233F] hover:bg-[#235E91] disabled:opacity-40 text-white text-lg font-bold cursor-pointer"
              >
                모두 공개
              </button>
              <button
                type="button"
                onClick={() => onChangeRevealedSteps(0)}
                className="px-4 py-3 rounded-xl border border-[#D5E0EC] bg-[#F7F9FC] hover:bg-[#EAF1F8] text-[#10233F] text-lg font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <EyeOff className="w-5 h-5" />
                <span>모두 숨기기</span>
              </button>
            </div>
          </div>

          {/* Quick Jump Step Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {STEP_LABELS.map((label, idx) => {
              const stepNum = idx + 1;
              const isOpen = revealedSteps >= stepNum && analysis.valid;
              return (
                <button
                  key={label}
                  type="button"
                  disabled={!analysis.valid}
                  onClick={() => onChangeRevealedSteps(stepNum)}
                  className={`px-3.5 py-2.5 rounded-lg border text-base font-bold text-left flex items-center justify-between cursor-pointer transition-colors disabled:opacity-40 ${
                    isOpen
                      ? 'bg-[#DDF4EF] border-[#1D9A97] text-[#10233F]'
                      : 'bg-[#F7F9FC] border-[#D5E0EC] text-[#4B617B] hover:border-[#235E91]'
                  }`}
                >
                  <span className="truncate">{label}</span>
                  {isOpen && <CheckCircle2 className="w-4 h-4 text-[#1D9A97] shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Revealed Cards */}
          {!analysis.valid ? (
            <div className="py-16 text-center text-2xl text-[#4B617B]">
              왼쪽 표에 0보다 큰 올바른 수치를 입력하면 계산 결과가 준비됩니다.
            </div>
          ) : revealedSteps === 0 ? (
            <div className="py-14 px-6 bg-[#F7F9FC] rounded-2xl border border-dashed border-[#CBD7E6] text-center space-y-4">
              <p className="text-2xl font-bold text-[#10233F]">
                현재 모든 계산 과정과 정답이 숨겨져 있습니다.
              </p>
              <p className="text-xl text-[#4B617B]">
                학생들이 직접 공식을 떠올려 계산해 본 뒤 [다음 단계 공개] 버튼을 눌러 확인하세요.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Step 1: Data Type Check */}
              {revealedSteps >= 1 && (
                <div className="p-6 rounded-xl border border-[#D5E0EC] bg-[#F7F9FC]">
                  <div className="text-lg font-bold text-[#235E91]">① 자료 유형 확인</div>
                  <p className="text-2xl font-bold text-[#10233F] mt-1">
                    {inputs.mode === 'production'
                      ? '동일 자원으로 생산 가능한 [최대 생산량] 자료입니다.'
                      : `재화 1단위 생산에 필요한 [노동 투입량(${laborUnit})] 자료입니다.`}
                  </p>
                  <p className="text-xl text-[#354C66] mt-2">
                    {inputs.mode === 'production'
                      ? '생산량 자료는 숫자가 클수록 생산 효율이 높습니다.'
                      : '투입량 자료는 숫자가 작을수록(적은 시간·인원이 들수록) 생산 효율이 높습니다.'}
                  </p>
                </div>
              )}

              {/* Step 2: Absolute Advantage */}
              {revealedSteps >= 2 && (
                <div className="p-6 rounded-xl border border-[#D5E0EC] bg-white">
                  <div className="text-lg font-bold text-[#235E91]">② 절대우위 판단</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div className="p-4 rounded-lg bg-[#F7F9FC] border border-[#E1EAF3]">
                      <div className="text-base font-bold text-[#4B617B]">{goodX} 절대우위</div>
                      <div className="text-2xl font-extrabold text-[#10233F] mt-1">
                        {analysis.absoluteAdvantage.goodX === 'tie'
                          ? '동일 (우위 없음)'
                          : analysis.absoluteAdvantage.goodX === 'A'
                            ? countryA
                            : countryB}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-[#F7F9FC] border border-[#E1EAF3]">
                      <div className="text-base font-bold text-[#4B617B]">{goodY} 절대우위</div>
                      <div className="text-2xl font-extrabold text-[#10233F] mt-1">
                        {analysis.absoluteAdvantage.goodY === 'tie'
                          ? '동일 (우위 없음)'
                          : analysis.absoluteAdvantage.goodY === 'A'
                            ? countryA
                            : countryB}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5 text-lg text-[#354C66]">
                    <p>• {analysis.absoluteAdvantage.reasonX}</p>
                    <p>• {analysis.absoluteAdvantage.reasonY}</p>
                    {analysis.absoluteAdvantage.sameCountryHoldsBoth && (
                      <p className="font-bold text-[#235E91] pt-1">
                        ※ {analysis.absoluteAdvantage.holderOfBoth === 'A' ? countryA : countryB}이 두 재화 모두 절대우위를 가지고 있지만, 비교우위를 계산하면 교역이 가능합니다!
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Opportunity Cost Formula */}
              {revealedSteps >= 3 && (
                <div className="p-6 rounded-xl border border-[#235E91] bg-[#EEF5FC]">
                  <div className="text-lg font-bold text-[#235E91]">③ 기회비용 계산 공식</div>
                  <div className="mt-3 space-y-2 text-2xl font-bold font-math text-[#10233F]">
                    <p>• {analysis.opportunityCost.formulaX}</p>
                    <p>• {analysis.opportunityCost.formulaY}</p>
                  </div>
                  <p className="text-xl text-[#1E3552] mt-3 leading-relaxed">
                    {analysis.opportunityCost.formulaReason}
                  </p>
                </div>
              )}

              {/* Step 4: Each Country's Opportunity Cost */}
              {revealedSteps >= 4 && (
                <div className="p-6 rounded-xl border border-[#D5E0EC] bg-white">
                  <div className="text-lg font-bold text-[#1D9A97] mb-3">
                    ④ 각국의 기회비용 계산 결과
                  </div>
                  <table className="w-full border-collapse text-center">
                    <thead>
                      <tr className="bg-[#10233F] text-white">
                        <th className="py-3 px-4 text-lg font-bold border border-[#235E91]">구분</th>
                        <th className="py-3 px-4 text-lg font-bold border border-[#235E91]">
                          {goodX} 1{unitX} 기회비용
                        </th>
                        <th className="py-3 px-4 text-lg font-bold border border-[#235E91]">
                          {goodY} 1{unitY} 기회비용
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-[#F7F9FC]">
                        <td className="py-4 px-4 text-xl font-extrabold text-[#10233F] border border-[#D5E0EC]">
                          {countryA}
                        </td>
                        <td className="py-4 px-4 border border-[#D5E0EC]">
                          <div className="text-2xl font-extrabold font-math text-[#235E91]">
                            {goodY} {analysis.opportunityCost.aGoodXInY.displayText}{unitY}
                          </div>
                          <div className="text-base text-[#4B617B] mt-1">
                            ({analysis.opportunityCost.aXSteps})
                          </div>
                        </td>
                        <td className="py-4 px-4 border border-[#D5E0EC]">
                          <div className="text-2xl font-extrabold font-math text-[#235E91]">
                            {goodX} {analysis.opportunityCost.aGoodYInX.displayText}{unitX}
                          </div>
                          <div className="text-base text-[#4B617B] mt-1">
                            ({analysis.opportunityCost.aYSteps})
                          </div>
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-4 px-4 text-xl font-extrabold text-[#10233F] border border-[#D5E0EC]">
                          {countryB}
                        </td>
                        <td className="py-4 px-4 border border-[#D5E0EC]">
                          <div className="text-2xl font-extrabold font-math text-[#235E91]">
                            {goodY} {analysis.opportunityCost.bGoodXInY.displayText}{unitY}
                          </div>
                          <div className="text-base text-[#4B617B] mt-1">
                            ({analysis.opportunityCost.bXSteps})
                          </div>
                        </td>
                        <td className="py-4 px-4 border border-[#D5E0EC]">
                          <div className="text-2xl font-extrabold font-math text-[#235E91]">
                            {goodX} {analysis.opportunityCost.bGoodYInX.displayText}{unitX}
                          </div>
                          <div className="text-base text-[#4B617B] mt-1">
                            ({analysis.opportunityCost.bYSteps})
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Step 5: Comparative Advantage */}
              {revealedSteps >= 5 && (
                <div className="p-6 rounded-xl border border-[#1D9A97] bg-[#F2FBF9]">
                  <div className="text-lg font-bold text-[#1D9A97]">⑤ 비교우위 판정</div>
                  {analysis.comparativeAdvantage.hasComparativeAdvantage ? (
                    <div className="mt-3 space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-white border border-[#BFE6DE]">
                          <div className="text-base font-bold text-[#4B617B]">{goodX} 비교우위</div>
                          <div className="text-3xl font-extrabold text-[#10233F] mt-1">
                            {analysis.comparativeAdvantage.goodXWinner === 'A' ? countryA : countryB}
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-white border border-[#BFE6DE]">
                          <div className="text-base font-bold text-[#4B617B]">{goodY} 비교우위</div>
                          <div className="text-3xl font-extrabold text-[#10233F] mt-1">
                            {analysis.comparativeAdvantage.goodYWinner === 'A' ? countryA : countryB}
                          </div>
                        </div>
                      </div>
                      <p className="text-xl text-[#10233F] pt-2">
                        • {analysis.comparativeAdvantage.reasonX}
                      </p>
                      <p className="text-xl text-[#10233F]">
                        • {analysis.comparativeAdvantage.reasonY}
                      </p>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-amber-900 mt-2">
                      두 나라의 기회비용이 동일하여 어느 나라도 비교우위를 가지지 않습니다.
                    </p>
                  )}
                </div>
              )}

              {/* Step 6: Specialization & Terms Guidance */}
              {revealedSteps >= 6 && (
                <div className="p-6 rounded-xl bg-[#10233F] text-white">
                  <div className="text-lg font-bold text-[#8CE4D9]">⑥ 특화할 재화 및 교역 조건</div>
                  <p className="text-2xl font-extrabold mt-2 leading-relaxed">
                    {analysis.specialization.summary}
                  </p>
                  <p className="text-xl text-[#DDF4EF] mt-3 leading-relaxed">
                    {analysis.specialization.termsGuidance}
                  </p>
                  {analysis.specialization.termsOfTradeMinYPerX &&
                    analysis.specialization.termsOfTradeMaxYPerX && (
                      <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center gap-4 text-2xl font-bold font-math text-[#8CE4D9]">
                        <span>
                          상호 이익 교역 조건: {analysis.specialization.termsOfTradeMinYPerX.fractionText}
                          {unitY} &lt; ({goodX} 1{unitX}당 {goodY}) &lt;{' '}
                          {analysis.specialization.termsOfTradeMaxYPerX.fractionText}
                          {unitY}
                        </span>
                        <span className="text-lg text-[#B8D4EE]">
                          (소수 환산: {formatCleanDecimal(analysis.specialization.termsOfTradeMinYPerX.value)} ~{' '}
                          {formatCleanDecimal(analysis.specialization.termsOfTradeMaxYPerX.value)})
                        </span>
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
