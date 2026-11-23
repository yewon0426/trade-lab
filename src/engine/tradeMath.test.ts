import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeComparativeAdvantage,
  calculateTariffImpact,
  calculateTradeSimulation,
  parsePositiveNumberOrFraction,
} from './tradeMath';

test('parsePositiveNumberOrFraction handles integers, decimals, fractions, and invalid inputs', () => {
  assert.equal(parsePositiveNumberOrFraction('10', 'test').value, 10);
  assert.equal(parsePositiveNumberOrFraction('2.5', 'test').value, 2.5);
  assert.equal(parsePositiveNumberOrFraction('3/4', 'test').value, 0.75);
  assert.equal(parsePositiveNumberOrFraction('0', 'test').valid, false);
  assert.equal(parsePositiveNumberOrFraction('-5', 'test').valid, false);
  assert.equal(parsePositiveNumberOrFraction('', 'test').valid, false);
  assert.equal(parsePositiveNumberOrFraction('1/0', 'test').valid, false);
});

test('UNIT 03 verification example: Cloth 10/5 and Rice 20/15 (production mode)', () => {
  const res = analyzeComparativeAdvantage({
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
  });

  assert.equal(res.valid, true);
  assert.equal(res.absoluteAdvantage.goodX, 'A');
  assert.equal(res.absoluteAdvantage.goodY, 'A');
  assert.equal(res.absoluteAdvantage.sameCountryHoldsBoth, true);

  // 갑국: 옷 1벌 기회비용 = 쌀 2포대, 쌀 1포대 기회비용 = 옷 1/2벌
  assert.equal(res.opportunityCost.aGoodXInY.fractionText, '2');
  assert.equal(res.opportunityCost.aGoodYInX.fractionText, '1/2');
  // 을국: 옷 1벌 기회비용 = 쌀 3포대, 쌀 1포대 기회비용 = 옷 1/3벌
  assert.equal(res.opportunityCost.bGoodXInY.fractionText, '3');
  assert.equal(res.opportunityCost.bGoodYInX.fractionText, '1/3');

  // 갑국은 옷, 을국은 쌀에 비교우위
  assert.equal(res.comparativeAdvantage.hasComparativeAdvantage, true);
  assert.equal(res.comparativeAdvantage.goodXWinner, 'A');
  assert.equal(res.comparativeAdvantage.goodYWinner, 'B');
  assert.equal(res.specialization.countryAGood, '옷');
  assert.equal(res.specialization.countryBGood, '쌀');
});

test('Labor input mode reverses numerator and denominator properly', () => {
  // 갑국: X=10명, Y=5명 | 을국: X=4명, Y=8명
  const res = analyzeComparativeAdvantage({
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
  });

  assert.equal(res.valid, true);
  // Fewer workers = absolute advantage
  assert.equal(res.absoluteAdvantage.goodX, 'B');
  assert.equal(res.absoluteAdvantage.goodY, 'A');
  // 갑국 X 1개 기회비용 = 10/5 = Y 2개, Y 1개 = X 1/2개
  assert.equal(res.opportunityCost.aGoodXInY.fractionText, '2');
  assert.equal(res.opportunityCost.aGoodYInX.fractionText, '1/2');
  // 을국 X 1개 기회비용 = 4/8 = Y 1/2개, Y 1개 = X 2개
  assert.equal(res.opportunityCost.bGoodXInY.fractionText, '1/2');
  assert.equal(res.opportunityCost.bGoodYInX.fractionText, '2');
  // 비교우위: 갑국은 Y재, 을국은 X재
  assert.equal(res.comparativeAdvantage.goodXWinner, 'B');
  assert.equal(res.comparativeAdvantage.goodYWinner, 'A');
});

test('Equal opportunity cost triggers no comparative advantage warning', () => {
  const res = analyzeComparativeAdvantage({
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
  });

  assert.equal(res.valid, true);
  assert.equal(res.comparativeAdvantage.hasComparativeAdvantage, false);
  assert.equal(res.comparativeAdvantage.goodXWinner, 'tie');
  assert.ok(res.warnings.length > 0);
});

test('PPC & Trade Negotiation simulator detects mutual gain, boundary, and unfavorable terms', () => {
  // 갑국: 옷 10, 쌀 20 (OC 옷=2) | 을국: 옷 5, 쌀 15 (OC 옷=3)
  const mutual = calculateTradeSimulation({
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
  });

  assert.equal(mutual.valid, true);
  assert.equal(mutual.termsStatus, 'mutual_gain');
  assert.equal(mutual.isAOutsidePPC, true);
  assert.equal(mutual.isBOutsidePPC, true);
  // 갑국: 10 - 4 = 옷 6벌, 쌀 4*2.5 = 10포대 (무역 전 5벌, 10포대 -> 옷 +1)
  assert.equal(mutual.postTradeA.x, 6);
  assert.equal(mutual.postTradeA.y, 10);
  // 을국: 옷 4벌, 쌀 15 - 10 = 5포대 (무역 전 2.5벌, 7.5포대)
  assert.equal(mutual.postTradeB.x, 4);
  assert.equal(mutual.postTradeB.y, 5);

  const unfavorable = calculateTradeSimulation({
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
    yPerX: 3.5, // > 3 (unfavorable for B)
    exportAmountX: 3,
  });
  assert.equal(unfavorable.termsStatus, 'unfavorable_B');

  const boundary = calculateTradeSimulation({
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
    yPerX: 2,
    exportAmountX: 4,
  });
  assert.equal(boundary.termsStatus, 'boundary_A');
});

test('Tariff policy calculator computes direct arithmetic accurately', () => {
  const t = calculateTariffImpact(10000, 25, 100);
  assert.equal(t.valid, true);
  assert.equal(t.tariffPerUnit, 2500);
  assert.equal(t.consumerPriceAfterTariff, 12500);
  assert.equal(t.totalTariffRevenue, 250000);
});
