export type UnitId = 'unit-01' | 'unit-02' | 'unit-03' | 'unit-04' | 'unit-05' | 'unit-06';

export type DataInputMode = 'production' | 'labor';

export interface TeacherGuideNote {
  screenId: string;
  unitId: UnitId;
  screenTitle: string;
  detailedExplanation: string;
  studentQuestion: string;
  expectedAnswer: string;
  realLifeExample: string;
  commonMisconception: string;
  transitionToNext: string;
}

export interface UnitMeta {
  id: UnitId;
  number: string;
  shortTitle: string;
  fullTitle: string;
  subtitle: string;
  screens: { id: string; title: string }[];
}

export type ProblemDifficulty = '기초' | '기본' | '심화';

export type ProblemCategory =
  | '국제 분업의 필요성'
  | '절대우위 판단'
  | '비교우위 판단'
  | '생산량 표 분석'
  | '노동시간 표 분석'
  | '기회비용 계산'
  | '특화'
  | '교역 조건'
  | '생산가능곡선 해석'
  | '무역 이익'
  | '자유무역·보호무역'
  | '지속가능한 무역';

export interface ProblemTableData {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface ProblemPpcChartData {
  countryAName: string;
  countryBName: string;
  goodXLabel: string;
  goodYLabel: string;
  aMaxX: number;
  aMaxY: number;
  bMaxX: number;
  bMaxY: number;
}

export interface McqProblem {
  id: string;
  kind: 'mcq';
  number: number;
  category: ProblemCategory;
  difficulty: ProblemDifficulty;
  relatedUnitId: UnitId;
  relatedConceptLabel: string;
  stem: string;
  passage?: string;
  tableData?: ProblemTableData;
  secondaryTableData?: ProblemTableData;
  ppcData?: ProblemPpcChartData;
  statements?: { label: string; text: string }[];
  choices: string[];
  correctIndex: number; // 0-based
  calculationSteps: string[];
  choiceExplanations: string[];
  misconceptionNote: string;
}

export interface EssayProblem {
  id: string;
  kind: 'essay';
  number: number;
  category: ProblemCategory;
  difficulty: ProblemDifficulty;
  relatedUnitId: UnitId;
  relatedConceptLabel: string;
  stem: string;
  passage?: string;
  tableData?: ProblemTableData;
  ppcData?: ProblemPpcChartData;
  keywords: string[];
  gradingCriteria: string[];
  modelAnswer: string;
  calculationSteps: string[];
  misconceptionNote: string;
}

export type CurriculumProblem = McqProblem | EssayProblem;
