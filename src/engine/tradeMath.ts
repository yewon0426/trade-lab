import type { DataInputMode } from '../types/curriculum';

export interface ParsedInput {
  valid: boolean;
  value: number;
  error?: string;
}

export interface ExactNumber {
  value: number;
  fractionText: string;
  decimalText: string;
  displayText: string;
}

export interface LabInputs {
  mode: DataInputMode;
  countryAName: string;
  countryBName: string;
  goodXName: string;
  goodXUnit: string;
  goodYName: string;
  goodYUnit: string;
  laborUnit: string;
  aX: string;
  aY: string;
  bX: string;
  bY: string;
}

export type AdvantageWinner = 'A' | 'B' | 'tie';

export interface ComparativeAdvantageResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  mode: DataInputMode;
  values: {
    aX: number;
    aY: number;
    bX: number;
    bY: number;
  };
  absoluteAdvantage: {
    goodX: AdvantageWinner;
    goodY: AdvantageWinner;
    sameCountryHoldsBoth: boolean;
    holderOfBoth?: 'A' | 'B';
    reasonX: string;
    reasonY: string;
  };
  opportunityCost: {
    aGoodXInY: ExactNumber;
    aGoodYInX: ExactNumber;
    bGoodXInY: ExactNumber;
    bGoodYInX: ExactNumber;
    formulaX: string;
    formulaY: string;
    formulaReason: string;
    aXSteps: string;
    aYSteps: string;
    bXSteps: string;
    bYSteps: string;
  };
  comparativeAdvantage: {
    hasComparativeAdvantage: boolean;
    goodXWinner: AdvantageWinner;
    goodYWinner: AdvantageWinner;
    reasonX: string;
    reasonY: string;
  };
  specialization: {
    countryAGood: string | null;
    countryBGood: string | null;
    summary: string;
    termsOfTradeMinYPerX: ExactNumber | null;
    termsOfTradeMaxYPerX: ExactNumber | null;
    termsGuidance: string;
  };
}

export interface TradeSimInputs {
  countryAName: string;
  countryBName: string;
  goodXName: string;
  goodXUnit: string;
  goodYName: string;
  goodYUnit: string;
  aMaxX: number;
  aMaxY: number;
  bMaxX: number;
  bMaxY: number;
  autarkyShareXA: number; // 0..1
  autarkyShareXB: number; // 0..1
  yPerX: number; // Exchange rate: 1 X = yPerX Y
  exportAmountX: number; // Units of X exported by the X-specializing country
}

export type TermsStatus =
  | 'mutual_gain'
  | 'boundary_A'
  | 'boundary_B'
  | 'unfavorable_A'
  | 'unfavorable_B'
  | 'no_comparative_advantage';

export interface BundlePoint {
  x: number;
  y: number;
}

export interface TradeSimResult {
  valid: boolean;
  error?: string;
  xExporter: 'A' | 'B' | null;
  yExporter: 'A' | 'B' | null;
  ocA_X: ExactNumber;
  ocB_X: ExactNumber;
  minYPerX: number;
  maxYPerX: number;
  termsStatus: TermsStatus;
  termsExplanation: string;
  maxPossibleExportX: number;
  actualExportX: number;
  actualExportY: number;
  preTradeA: BundlePoint;
  preTradeB: BundlePoint;
  specProdA: BundlePoint;
  specProdB: BundlePoint;
  postTradeA: BundlePoint;
  postTradeB: BundlePoint;
  gainA: { dx: number; dy: number };
  gainB: { dx: number; dy: number };
  isAOutsidePPC: boolean;
  isBOutsidePPC: boolean;
  worldPreTrade: BundlePoint;
  worldPostTrade: BundlePoint;
}

export interface TariffResult {
  valid: boolean;
  error?: string;
  importPrice: number;
  tariffRate: number;
  importQuantity: number;
  tariffPerUnit: number;
  consumerPriceAfterTariff: number;
  priceIncreasePercent: number;
  totalTariffRevenue: number;
  totalConsumerCostAfterTariff: number;
}

const EPS = 1e-9;

export function parsePositiveNumberOrFraction(raw: string, fieldLabel: string): ParsedInput {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { valid: false, value: NaN, error: `${fieldLabel} 값을 입력해 주세요.` };
  }

  if (trimmed.includes('/')) {
    const parts = trimmed.split('/');
    if (parts.length !== 2) {
      return { valid: false, value: NaN, error: `${fieldLabel}의 분수 형식이 올바르지 않습니다 (예: 3/4).` };
    }
    const num = Number(parts[0].trim());
    const den = Number(parts[1].trim());
    if (!Number.isFinite(num) || !Number.isFinite(den)) {
      return { valid: false, value: NaN, error: `${fieldLabel}에 올바른 숫자를 입력해 주세요.` };
    }
    if (den === 0) {
      return { valid: false, value: NaN, error: `${fieldLabel}의 분모는 0일 수 없습니다.` };
    }
    const val = num / den;
    if (val <= 0) {
      return { valid: false, value: NaN, error: `${fieldLabel}은(는) 0보다 큰 양수여야 합니다.` };
    }
    return { valid: true, value: val };
  }

  const val = Number(trimmed);
  if (!Number.isFinite(val)) {
    return { valid: false, value: NaN, error: `${fieldLabel}에 올바른 숫자를 입력해 주세요.` };
  }
  if (val <= 0) {
    return { valid: false, value: NaN, error: `${fieldLabel}은(는) 0보다 큰 양수여야 합니다.` };
  }
  return { valid: true, value: val };
}

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
}

export function formatCleanDecimal(n: number, maxDecimals = 2): string {
  if (!Number.isFinite(n)) return '-';
  if (Math.abs(n - Math.round(n)) < 1e-7) {
    return String(Math.round(n));
  }
  return Number(n.toFixed(maxDecimals)).toString();
}

/**
 * Formats a ratio numerator / denominator as an exact simplified fraction
 * when both inputs can be scaled cleanly to integers, plus a decimal readout.
 */
export function formatExactRatio(numerator: number, denominator: number): ExactNumber {
  const value = numerator / denominator;
  const decimalText = formatCleanDecimal(value, 3);

  // Scale decimals up to 1000 to get exact integer fraction when possible
  const scale = 1000;
  const nScaled = Math.round(numerator * scale);
  const dScaled = Math.round(denominator * scale);

  if (
    Math.abs(numerator * scale - nScaled) < 1e-5 &&
    Math.abs(denominator * scale - dScaled) < 1e-5 &&
    dScaled !== 0
  ) {
    const divisor = gcd(nScaled, dScaled);
    const simpN = nScaled / divisor;
    const simpD = dScaled / divisor;
    if (simpD === 1) {
      return {
        value,
        fractionText: String(simpN),
        decimalText,
        displayText: String(simpN),
      };
    }
    const fractionText = `${simpN}/${simpD}`;
    return {
      value,
      fractionText,
      decimalText,
      displayText: `${fractionText} (${decimalText})`,
    };
  }

  return {
    value,
    fractionText: decimalText,
    decimalText,
    displayText: decimalText,
  };
}

export function analyzeComparativeAdvantage(inputs: LabInputs): ComparativeAdvantageResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const countryA = inputs.countryAName.trim() || '갑국';
  const countryB = inputs.countryBName.trim() || '을국';
  const goodX = inputs.goodXName.trim() || 'X재';
  const goodY = inputs.goodYName.trim() || 'Y재';
  const unitX = inputs.goodXUnit.trim() || '개';
  const unitY = inputs.goodYUnit.trim() || '개';
  const laborUnit = inputs.laborUnit.trim() || '시간';

  const pAX = parsePositiveNumberOrFraction(inputs.aX, `${countryA} ${goodX}`);
  const pAY = parsePositiveNumberOrFraction(inputs.aY, `${countryA} ${goodY}`);
  const pBX = parsePositiveNumberOrFraction(inputs.bX, `${countryB} ${goodX}`);
  const pBY = parsePositiveNumberOrFraction(inputs.bY, `${countryB} ${goodY}`);

  for (const p of [pAX, pAY, pBX, pBY]) {
    if (!p.valid && p.error) {
      errors.push(p.error);
    }
  }

  if (unitX === unitY && goodX === goodY) {
    warnings.push('두 재화의 이름이 같습니다. 서로 다른 두 재화를 비교해 주세요.');
  }

  if (errors.length > 0) {
    const emptyExact: ExactNumber = { value: 0, fractionText: '-', decimalText: '-', displayText: '-' };
    return {
      valid: false,
      errors,
      warnings,
      mode: inputs.mode,
      values: { aX: 0, aY: 0, bX: 0, bY: 0 },
      absoluteAdvantage: {
        goodX: 'tie',
        goodY: 'tie',
        sameCountryHoldsBoth: false,
        reasonX: '',
        reasonY: '',
      },
      opportunityCost: {
        aGoodXInY: emptyExact,
        aGoodYInX: emptyExact,
        bGoodXInY: emptyExact,
        bGoodYInX: emptyExact,
        formulaX: '',
        formulaY: '',
        formulaReason: '',
        aXSteps: '',
        aYSteps: '',
        bXSteps: '',
        bYSteps: '',
      },
      comparativeAdvantage: {
        hasComparativeAdvantage: false,
        goodXWinner: 'tie',
        goodYWinner: 'tie',
        reasonX: '',
        reasonY: '',
      },
      specialization: {
        countryAGood: null,
        countryBGood: null,
        summary: '',
        termsOfTradeMinYPerX: null,
        termsOfTradeMaxYPerX: null,
        termsGuidance: '',
      },
    };
  }

  const aX = pAX.value;
  const aY = pAY.value;
  const bX = pBX.value;
  const bY = pBY.value;

  const isProduction = inputs.mode === 'production';

  // Absolute Advantage
  let aaX: AdvantageWinner = 'tie';
  let aaY: AdvantageWinner = 'tie';
  if (Math.abs(aX - bX) > EPS) {
    aaX = isProduction ? (aX > bX ? 'A' : 'B') : (aX < bX ? 'A' : 'B');
  }
  if (Math.abs(aY - bY) > EPS) {
    aaY = isProduction ? (aY > bY ? 'A' : 'B') : (aY < bY ? 'A' : 'B');
  }

  const sameCountryHoldsBoth = (aaX === 'A' && aaY === 'A') || (aaX === 'B' && aaY === 'B');
  const holderOfBoth = sameCountryHoldsBoth ? (aaX as 'A' | 'B') : undefined;

  const reasonX =
    aaX === 'tie'
      ? `${goodX} 생산 조건이 ${countryA}과 ${countryB}이 동일하므로 절대우위를 가릴 수 없습니다.`
      : isProduction
        ? `동일 자원으로 ${goodX} 최대 생산량이 ${aaX === 'A' ? countryA : countryB}(${formatCleanDecimal(aaX === 'A' ? aX : bX)}${unitX}) > ${aaX === 'A' ? countryB : countryA}(${formatCleanDecimal(aaX === 'A' ? bX : aX)}${unitX})이므로 ${aaX === 'A' ? countryA : countryB}이 ${goodX}에 절대우위를 가집니다.`
        : `${goodX} 1${unitX} 생산에 필요한 투입량이 ${aaX === 'A' ? countryA : countryB}(${formatCleanDecimal(aaX === 'A' ? aX : bX)}${laborUnit}) < ${aaX === 'A' ? countryB : countryA}(${formatCleanDecimal(aaX === 'A' ? bX : aX)}${laborUnit})이므로 ${aaX === 'A' ? countryA : countryB}이 ${goodX}에 절대우위를 가집니다.`;

  const reasonY =
    aaY === 'tie'
      ? `${goodY} 생산 조건이 ${countryA}과 ${countryB}이 동일하므로 절대우위를 가릴 수 없습니다.`
      : isProduction
        ? `동일 자원으로 ${goodY} 최대 생산량이 ${aaY === 'A' ? countryA : countryB}(${formatCleanDecimal(aaY === 'A' ? aY : bY)}${unitY}) > ${aaY === 'A' ? countryB : countryA}(${formatCleanDecimal(aaY === 'A' ? bY : aY)}${unitY})이므로 ${aaY === 'A' ? countryA : countryB}이 ${goodY}에 절대우위를 가집니다.`
        : `${goodY} 1${unitY} 생산에 필요한 투입량이 ${aaY === 'A' ? countryA : countryB}(${formatCleanDecimal(aaY === 'A' ? aY : bY)}${laborUnit}) < ${aaY === 'A' ? countryB : countryA}(${formatCleanDecimal(aaY === 'A' ? bY : aY)}${laborUnit})이므로 ${aaY === 'A' ? countryA : countryB}이 ${goodY}에 절대우위를 가집니다.`;

  // Opportunity Costs
  // Production mode: OC(1 X) = maxY / maxX; OC(1 Y) = maxX / maxY
  // Labor mode: OC(1 X) = laborX / laborY; OC(1 Y) = laborY / laborX
  const aGoodXInY = isProduction ? formatExactRatio(aY, aX) : formatExactRatio(aX, aY);
  const aGoodYInX = isProduction ? formatExactRatio(aX, aY) : formatExactRatio(aY, aX);
  const bGoodXInY = isProduction ? formatExactRatio(bY, bX) : formatExactRatio(bX, bY);
  const bGoodYInX = isProduction ? formatExactRatio(bX, bY) : formatExactRatio(bY, bX);

  const formulaX = isProduction
    ? `${goodX} 1${unitX} 기회비용 = ${goodY} 최대 생산량 ÷ ${goodX} 최대 생산량`
    : `${goodX} 1${unitX} 기회비용 = ${goodX} 단위당 ${laborUnit} ÷ ${goodY} 단위당 ${laborUnit}`;

  const formulaY = isProduction
    ? `${goodY} 1${unitY} 기회비용 = ${goodX} 최대 생산량 ÷ ${goodY} 최대 생산량`
    : `${goodY} 1${unitY} 기회비용 = ${goodY} 단위당 ${laborUnit} ÷ ${goodX} 단위당 ${laborUnit}`;

  const formulaReason = isProduction
    ? `생산량 자료는 자원을 모두 ${goodX}에 쓸 때 포기한 ${goodY}의 양(상대 생산량)이므로 '포기한 재화(${goodY}) ÷ 얻은 재화(${goodX})'로 계산합니다.`
    : `노동 투입량 자료는 ${goodX} 1단위를 만드는 데 드는 시간·인력 동안 만들 수 있었던 ${goodY}의 수량을 구해야 하므로 '${goodX} 투입량 ÷ ${goodY} 투입량'이 됩니다. 생산량 자료와 분자·분모 위치가 반대인 점에 주의하세요!`;

  const aXSteps = isProduction
    ? `${formatCleanDecimal(aY)}${unitY} ÷ ${formatCleanDecimal(aX)}${unitX} = ${goodY} ${aGoodXInY.displayText}${unitY}`
    : `${formatCleanDecimal(aX)}${laborUnit} ÷ ${formatCleanDecimal(aY)}${laborUnit} = ${goodY} ${aGoodXInY.displayText}${unitY}`;
  const aYSteps = isProduction
    ? `${formatCleanDecimal(aX)}${unitX} ÷ ${formatCleanDecimal(aY)}${unitY} = ${goodX} ${aGoodYInX.displayText}${unitX}`
    : `${formatCleanDecimal(aY)}${laborUnit} ÷ ${formatCleanDecimal(aX)}${laborUnit} = ${goodX} ${aGoodYInX.displayText}${unitX}`;
  const bXSteps = isProduction
    ? `${formatCleanDecimal(bY)}${unitY} ÷ ${formatCleanDecimal(bX)}${unitX} = ${goodY} ${bGoodXInY.displayText}${unitY}`
    : `${formatCleanDecimal(bX)}${laborUnit} ÷ ${formatCleanDecimal(bY)}${laborUnit} = ${goodY} ${bGoodXInY.displayText}${unitY}`;
  const bYSteps = isProduction
    ? `${formatCleanDecimal(bX)}${unitX} ÷ ${formatCleanDecimal(bY)}${unitY} = ${goodX} ${bGoodYInX.displayText}${unitX}`
    : `${formatCleanDecimal(bY)}${laborUnit} ÷ ${formatCleanDecimal(bX)}${laborUnit} = ${goodX} ${bGoodYInX.displayText}${unitX}`;

  // Comparative Advantage
  let caX: AdvantageWinner = 'tie';
  let caY: AdvantageWinner = 'tie';
  const hasComparativeAdvantage = Math.abs(aGoodXInY.value - bGoodXInY.value) > EPS;

  if (hasComparativeAdvantage) {
    caX = aGoodXInY.value < bGoodXInY.value ? 'A' : 'B';
    caY = caX === 'A' ? 'B' : 'A';
  } else {
    warnings.push('두 나라의 기회비용이 완전히 같아 비교우위가 존재하지 않으며, 교역을 통한 추가 이익이 발생하지 않습니다.');
  }

  const caReasonX = hasComparativeAdvantage
    ? `${goodX} 1${unitX} 기회비용이 ${caX === 'A' ? countryA : countryB}(${goodY} ${(caX === 'A' ? aGoodXInY : bGoodXInY).fractionText}${unitY}) < ${caX === 'A' ? countryB : countryA}(${goodY} ${(caX === 'A' ? bGoodXInY : aGoodXInY).fractionText}${unitY})이므로 ${caX === 'A' ? countryA : countryB}이 ${goodX}에 비교우위를 가집니다.`
    : `두 나라의 ${goodX} 1${unitX} 생산 기회비용이 모두 ${goodY} ${aGoodXInY.fractionText}${unitY}로 동일하여 비교우위가 없습니다.`;

  const caReasonY = hasComparativeAdvantage
    ? `${goodY} 1${unitY} 기회비용이 ${caY === 'A' ? countryA : countryB}(${goodX} ${(caY === 'A' ? aGoodYInX : bGoodYInX).fractionText}${unitX}) < ${caY === 'A' ? countryB : countryA}(${goodX} ${(caY === 'A' ? bGoodYInX : aGoodYInX).fractionText}${unitX})이므로 ${caY === 'A' ? countryA : countryB}이 ${goodY}에 비교우위를 가집니다.`
    : `두 나라의 ${goodY} 1${unitY} 생산 기회비용이 모두 ${goodX} ${aGoodYInX.fractionText}${unitX}로 동일하여 비교우위가 없습니다.`;

  // Specialization & Terms of Trade
  let countryAGood: string | null = null;
  let countryBGood: string | null = null;
  let summary = '두 나라의 기회비용이 같아 특화와 교역의 이익이 발생하지 않습니다.';
  let minTerms: ExactNumber | null = null;
  let maxTerms: ExactNumber | null = null;
  let termsGuidance = '기회비용 차이가 없으므로 유리한 교역 조건 구간이 존재하지 않습니다.';

  if (hasComparativeAdvantage) {
    countryAGood = caX === 'A' ? goodX : goodY;
    countryBGood = caX === 'A' ? goodY : goodX;
    summary = `${countryA}은 ${countryAGood} 생산에 특화하여 수출하고 ${countryBGood}을 수입하며, ${countryB}은 ${countryBGood} 생산에 특화하여 수출하고 ${countryAGood}을 수입합니다.`;

    minTerms = aGoodXInY.value < bGoodXInY.value ? aGoodXInY : bGoodXInY;
    maxTerms = aGoodXInY.value > bGoodXInY.value ? aGoodXInY : bGoodXInY;
    const xExporterName = caX === 'A' ? countryA : countryB;
    const yExporterName = caY === 'A' ? countryA : countryB;

    termsGuidance = `${goodX} 1${unitX}당 교환되는 ${goodY}의 양이 ${minTerms.fractionText}${unitY}보다 크고(${xExporterName} 이익) ${maxTerms.fractionText}${unitY}보다 작아야(${yExporterName} 이익) 양국 모두 교역의 이익을 얻습니다.`;
  }

  return {
    valid: true,
    errors,
    warnings,
    mode: inputs.mode,
    values: { aX, aY, bX, bY },
    absoluteAdvantage: {
      goodX: aaX,
      goodY: aaY,
      sameCountryHoldsBoth,
      holderOfBoth,
      reasonX,
      reasonY,
    },
    opportunityCost: {
      aGoodXInY,
      aGoodYInX,
      bGoodXInY,
      bGoodYInX,
      formulaX,
      formulaY,
      formulaReason,
      aXSteps,
      aYSteps,
      bXSteps,
      bYSteps,
    },
    comparativeAdvantage: {
      hasComparativeAdvantage,
      goodXWinner: caX,
      goodYWinner: caY,
      reasonX: caReasonX,
      reasonY: caReasonY,
    },
    specialization: {
      countryAGood,
      countryBGood,
      summary,
      termsOfTradeMinYPerX: minTerms,
      termsOfTradeMaxYPerX: maxTerms,
      termsGuidance,
    },
  };
}

export function calculateTradeSimulation(inputs: TradeSimInputs): TradeSimResult {
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
    autarkyShareXA,
    autarkyShareXB,
    yPerX,
    exportAmountX,
  } = inputs;

  if (aMaxX <= 0 || aMaxY <= 0 || bMaxX <= 0 || bMaxY <= 0 || yPerX <= 0) {
    return {
      valid: false,
      error: '최대 생산량과 교역 조건은 모두 0보다 커야 합니다.',
      xExporter: null,
      yExporter: null,
      ocA_X: formatExactRatio(1, 1),
      ocB_X: formatExactRatio(1, 1),
      minYPerX: 0,
      maxYPerX: 0,
      termsStatus: 'no_comparative_advantage',
      termsExplanation: '유효한 양수 값을 입력해 주세요.',
      maxPossibleExportX: 0,
      actualExportX: 0,
      actualExportY: 0,
      preTradeA: { x: 0, y: 0 },
      preTradeB: { x: 0, y: 0 },
      specProdA: { x: 0, y: 0 },
      specProdB: { x: 0, y: 0 },
      postTradeA: { x: 0, y: 0 },
      postTradeB: { x: 0, y: 0 },
      gainA: { dx: 0, dy: 0 },
      gainB: { dx: 0, dy: 0 },
      isAOutsidePPC: false,
      isBOutsidePPC: false,
      worldPreTrade: { x: 0, y: 0 },
      worldPostTrade: { x: 0, y: 0 },
    };
  }

  const ocA_X = formatExactRatio(aMaxY, aMaxX);
  const ocB_X = formatExactRatio(bMaxY, bMaxX);

  const shareA = Math.min(0.9, Math.max(0.1, autarkyShareXA));
  const shareB = Math.min(0.9, Math.max(0.1, autarkyShareXB));

  const preTradeA: BundlePoint = {
    x: Number((aMaxX * shareA).toFixed(2)),
    y: Number((aMaxY * (1 - shareA)).toFixed(2)),
  };
  const preTradeB: BundlePoint = {
    x: Number((bMaxX * shareB).toFixed(2)),
    y: Number((bMaxY * (1 - shareB)).toFixed(2)),
  };

  const worldPreTrade: BundlePoint = {
    x: Number((preTradeA.x + preTradeB.x).toFixed(2)),
    y: Number((preTradeA.y + preTradeB.y).toFixed(2)),
  };

  if (Math.abs(ocA_X.value - ocB_X.value) <= EPS) {
    return {
      valid: true,
      xExporter: null,
      yExporter: null,
      ocA_X,
      ocB_X,
      minYPerX: ocA_X.value,
      maxYPerX: ocA_X.value,
      termsStatus: 'no_comparative_advantage',
      termsExplanation: `두 나라의 ${goodXName} 1${goodXUnit} 기회비용이 ${goodYName} ${ocA_X.fractionText}${goodYUnit}로 같아 비교우위가 없습니다. 특화와 교환을 해도 양국 모두 이득을 얻기 어렵습니다.`,
      maxPossibleExportX: 0,
      actualExportX: 0,
      actualExportY: 0,
      preTradeA,
      preTradeB,
      specProdA: preTradeA,
      specProdB: preTradeB,
      postTradeA: preTradeA,
      postTradeB: preTradeB,
      gainA: { dx: 0, dy: 0 },
      gainB: { dx: 0, dy: 0 },
      isAOutsidePPC: false,
      isBOutsidePPC: false,
      worldPreTrade,
      worldPostTrade: worldPreTrade,
    };
  }

  const xExporter: 'A' | 'B' = ocA_X.value < ocB_X.value ? 'A' : 'B';
  const yExporter: 'A' | 'B' = xExporter === 'A' ? 'B' : 'A';
  const minYPerX = Math.min(ocA_X.value, ocB_X.value);
  const maxYPerX = Math.max(ocA_X.value, ocB_X.value);

  const specProdA: BundlePoint = xExporter === 'A' ? { x: aMaxX, y: 0 } : { x: 0, y: aMaxY };
  const specProdB: BundlePoint = xExporter === 'B' ? { x: bMaxX, y: 0 } : { x: 0, y: bMaxY };

  const xExporterMaxX = xExporter === 'A' ? aMaxX : bMaxX;
  const yExporterMaxY = yExporter === 'A' ? aMaxY : bMaxY;

  // Prevent exceeding either X production or Y production capacity
  const maxByYCapacity = yExporterMaxY / yPerX;
  const maxPossibleExportX = Math.max(0, Math.min(xExporterMaxX, maxByYCapacity));
  const actualExportX = Math.max(0, Math.min(exportAmountX, maxPossibleExportX));
  const actualExportY = actualExportX * yPerX;

  const postTradeA: BundlePoint =
    xExporter === 'A'
      ? {
          x: Number((specProdA.x - actualExportX).toFixed(2)),
          y: Number((specProdA.y + actualExportY).toFixed(2)),
        }
      : {
          x: Number((specProdA.x + actualExportX).toFixed(2)),
          y: Number((specProdA.y - actualExportY).toFixed(2)),
        };

  const postTradeB: BundlePoint =
    xExporter === 'B'
      ? {
          x: Number((specProdB.x - actualExportX).toFixed(2)),
          y: Number((specProdB.y + actualExportY).toFixed(2)),
        }
      : {
          x: Number((specProdB.x + actualExportX).toFixed(2)),
          y: Number((specProdB.y - actualExportY).toFixed(2)),
        };

  const gainA = {
    dx: Number((postTradeA.x - preTradeA.x).toFixed(2)),
    dy: Number((postTradeA.y - preTradeA.y).toFixed(2)),
  };
  const gainB = {
    dx: Number((postTradeB.x - preTradeB.x).toFixed(2)),
    dy: Number((postTradeB.y - preTradeB.y).toFixed(2)),
  };

  let termsStatus: TermsStatus = 'mutual_gain';
  let termsExplanation = '';

  const xExpName = xExporter === 'A' ? countryAName : countryBName;
  const yExpName = yExporter === 'A' ? countryAName : countryBName;

  if (Math.abs(yPerX - minYPerX) <= 1e-4) {
    termsStatus = xExporter === 'A' ? 'boundary_A' : 'boundary_B';
    termsExplanation = `경계값 도달: ${goodXName} 1${goodXUnit}당 ${goodYName} ${formatCleanDecimal(yPerX, 2)}${goodYUnit}은 ${xExpName}의 국내 기회비용과 같아 ${xExpName}은 교역 이익이 0이고 ${yExpName}만 이익을 얻습니다.`;
  } else if (Math.abs(yPerX - maxYPerX) <= 1e-4) {
    termsStatus = yExporter === 'A' ? 'boundary_A' : 'boundary_B';
    termsExplanation = `경계값 도달: ${goodXName} 1${goodXUnit}당 ${goodYName} ${formatCleanDecimal(yPerX, 2)}${goodYUnit}은 ${yExpName}의 국내 기회비용과 같아 ${yExpName}은 교역 이익이 0이고 ${xExpName}만 이익을 얻습니다.`;
  } else if (yPerX < minYPerX) {
    termsStatus = xExporter === 'A' ? 'unfavorable_A' : 'unfavorable_B';
    termsExplanation = `불리한 교역 조건: ${goodXName} 1${goodXUnit}을 팔고 받는 ${goodYName}(${formatCleanDecimal(yPerX, 2)}${goodYUnit})이 ${xExpName}의 국내 기회비용(${formatCleanDecimal(minYPerX, 2)}${goodYUnit})보다 적어 ${xExpName}이 손해를 봅니다. ${xExpName}은 교역에 응하지 않습니다.`;
  } else if (yPerX > maxYPerX) {
    termsStatus = yExporter === 'A' ? 'unfavorable_A' : 'unfavorable_B';
    termsExplanation = `불리한 교역 조건: ${goodXName} 1${goodXUnit}을 얻기 위해 내주는 ${goodYName}(${formatCleanDecimal(yPerX, 2)}${goodYUnit})이 ${yExpName}의 국내 기회비용(${formatCleanDecimal(maxYPerX, 2)}${goodYUnit})보다 커서 ${yExpName}이 손해를 봅니다. ${yExpName}은 교역에 응하지 않습니다.`;
  } else {
    termsStatus = 'mutual_gain';
    termsExplanation = `상호 이익 교역 조건 성립! ${formatCleanDecimal(minYPerX, 2)} < ${formatCleanDecimal(yPerX, 2)} < ${formatCleanDecimal(maxYPerX, 2)} 구간에 있으므로 ${countryAName}과 ${countryBName} 모두 자국 생산가능곡선 밖의 소비를 누릴 수 있습니다.`;
  }

  const isAOutsidePPC = postTradeA.x / aMaxX + postTradeA.y / aMaxY > 1 + 1e-6;
  const isBOutsidePPC = postTradeB.x / bMaxX + postTradeB.y / bMaxY > 1 + 1e-6;

  return {
    valid: true,
    xExporter,
    yExporter,
    ocA_X,
    ocB_X,
    minYPerX,
    maxYPerX,
    termsStatus,
    termsExplanation,
    maxPossibleExportX: Number(maxPossibleExportX.toFixed(2)),
    actualExportX: Number(actualExportX.toFixed(2)),
    actualExportY: Number(actualExportY.toFixed(2)),
    preTradeA,
    preTradeB,
    specProdA,
    specProdB,
    postTradeA,
    postTradeB,
    gainA,
    gainB,
    isAOutsidePPC,
    isBOutsidePPC,
    worldPreTrade,
    worldPostTrade: {
      x: Number((specProdA.x + specProdB.x).toFixed(2)),
      y: Number((specProdA.y + specProdB.y).toFixed(2)),
    },
  };
}

export function calculateTariffImpact(
  importPrice: number,
  tariffRate: number,
  importQuantity: number
): TariffResult {
  if (importPrice <= 0 || tariffRate < 0 || importQuantity < 0) {
    return {
      valid: false,
      error: '수입 가격은 0보다 커야 하며, 관세율과 수량은 0 이상이어야 합니다.',
      importPrice: 0,
      tariffRate: 0,
      importQuantity: 0,
      tariffPerUnit: 0,
      consumerPriceAfterTariff: 0,
      priceIncreasePercent: 0,
      totalTariffRevenue: 0,
      totalConsumerCostAfterTariff: 0,
    };
  }

  const tariffPerUnit = importPrice * (tariffRate / 100);
  const consumerPriceAfterTariff = importPrice + tariffPerUnit;
  const totalTariffRevenue = tariffPerUnit * importQuantity;
  const totalConsumerCostAfterTariff = consumerPriceAfterTariff * importQuantity;

  return {
    valid: true,
    importPrice,
    tariffRate,
    importQuantity,
    tariffPerUnit,
    consumerPriceAfterTariff,
    priceIncreasePercent: tariffRate,
    totalTariffRevenue,
    totalConsumerCostAfterTariff,
  };
}
