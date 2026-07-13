import rawExamBank from "./exam-bank.json";

export type ExamPhase = 1 | 2;

export type ExamQuestion = {
  id: string;
  year: number;
  phase: ExamPhase;
  subject: string;
  number: number;
  type: "객관식";
  stem: string;
  choices: string[];
  answerIndex: number;
  officialNote: string;
  source: {
    questionPdf: string;
    questionPage: number;
    answerPdf: string;
    answerPage: number;
  };
};

export const examQuestions = rawExamBank as unknown as ExamQuestion[];

export const examYears = [...new Set(examQuestions.map((question) => question.year))].sort((a, b) => b - a);

export const visualLessonByQuestionId: Record<string, string> = {
  "2020-1-민법-010": "possession",
  "2020-1-민법-011": "possession",
  "2020-1-민법-012": "possession",
  "2020-1-민법-013": "possession",
  "2020-1-민법-014": "land-ownership",
  "2020-1-민법-015": "prescription",
};

export function examLabel(question: Pick<ExamQuestion, "year" | "phase" | "subject" | "number">) {
  return `${question.year}년 ${question.phase}차 · ${question.subject} ${question.number}번`;
}

export function questionDirection(stem: string) {
  const normalizedStem = stem.replace(/\s+/g, " ").trim();
  const asksForException = /(?:틀린\s*(?:것|경우)|아닌\s*(?:것|경우)|(?:옳지|해당(?:되지|하지)|적절하지|올바르지|타당하지|있지)\s*않?(?:은|는)?\s*(?:것|경우))(?:은|는|이|가)?\s*\?*$/.test(normalizedStem);

  if (asksForException) {
    return "지문의 원칙과 다른 예외·오류 선지를 찾는 문제예요.";
  }

  return "지문이 묻는 원칙에 가장 맞는 선지를 고르는 문제예요.";
}

export function sourceSummary(question: ExamQuestion) {
  return `문제지 p.${question.source.questionPage} · 정답표 p.${question.source.answerPage}`;
}
