import type { StaticImageData } from "next/image";
import urbanPlanQ1Image from "./assets/urban-plan-q1-explanation.png";

export type StoryLine = {
  speaker: string;
  text: string;
};

export type StoryScene = {
  label: string;
  title: string;
  lines: StoryLine[];
};

export type ExamPoint = {
  label: string;
  text: string;
};

export type QuestionStoryExplanation = {
  eyebrow: string;
  title: string;
  lead: string;
  image: StaticImageData;
  imageAlt: string;
  imageCaption: string;
  cast: { name: string; role: string }[];
  scenes: StoryScene[];
  examPoints: ExamPoint[];
  accuracyNote: string;
  statuteLabel: string;
  statuteUrl: string;
};

export const questionStoryById: Record<string, QuestionStoryExplanation> = {
  "2020-1-부동산관계법규-001": {
    eyebrow: "DRAMATIZED EXPLANATION · 도시·군관리계획",
    title: "우리 동네 미래 지도, 진짜 그리는 사람은?",
    lead: "법정에 선 나주민과 김변호의 대화를 따라가며 ‘사업을 시행하거나 계획을 제안하는 사람’과 법률상 ‘입안권자’를 구별해 봅니다.",
    image: urbanPlanQ1Image,
    imageAlt: "주민, 변호사, 판사와 학생이 도시·군관리계획의 입안권자, 5년 재검토, 주민 의견 제출을 설명하는 법정 만화",
    imageCaption: "그림은 전체 흐름을 기억하는 보조 자료입니다. 아래 시나리오에서 시험에 필요한 정확한 법적 범위를 확인하세요.",
    cast: [
      { name: "나주민", role: "동네 계획이 궁금한 주민" },
      { name: "김변호", role: "입안권자를 짚어 주는 변호사" },
      { name: "판사", role: "입안과 결정을 구별하는 심판" },
      { name: "이학생", role: "시험 포인트를 묻는 방청객" },
    ],
    scenes: [
      {
        label: "장면 1",
        title: "갑자기 바뀐 동네 지도",
        lines: [
          { speaker: "나주민", text: "우리 집 옆에 고층 아파트가 들어선대요. 이 동네의 미래 지도는 도대체 누가 그리는 건가요?" },
          { speaker: "김변호", text: "토지의 용도와 시설 배치 등을 구체화하는 도시·군관리계획이 바로 그 ‘미래 지도’입니다. 오늘은 그 계획안을 법적으로 만들 수 있는 사람, 즉 입안권자를 찾겠습니다." },
        ],
      },
      {
        label: "장면 2",
        title: "시장·군수만 그릴 수 있을까?",
        lines: [
          { speaker: "판사", text: "입안권자는 시장이나 군수뿐입니까?" },
          { speaker: "김변호", text: "아닙니다. 특별시장·광역시장·특별자치시장·특별자치도지사·시장·군수가 원칙적 입안권자입니다. 법에서 정한 경우에는 국토교통부장관과 도지사도 직접 입안할 수 있습니다." },
          { speaker: "이학생", text: "그럼 한국토지주택공사 사장도 공공기관장이니까 입안권자인가요?" },
          { speaker: "김변호", text: "아니요. 한국토지주택공사 사장은 국토계획법 제24조의 입안권자에 포함되지 않습니다. 따라서 이 문제의 정답은 ③입니다." },
        ],
      },
      {
        label: "장면 3",
        title: "5년 재검토는 누가 할까?",
        lines: [
          { speaker: "이학생", text: "도지사나 국토교통부장관도 모두 5년마다 계획을 다시 검토하나요?" },
          { speaker: "김변호", text: "그렇게 외우면 안 됩니다. 5년마다 관할 계획의 타당성을 전반적으로 재검토해 정비하는 주체는 특별시장·광역시장·특별자치시장·특별자치도지사·시장·군수입니다. 예외적 입안권자와 5년 재검토 의무자는 구별하세요." },
        ],
      },
      {
        label: "장면 4",
        title: "주민도 의견을 낼 수 있을까?",
        lines: [
          { speaker: "나주민", text: "그렇다면 주민인 저는 계획 과정에서 무엇을 할 수 있나요?" },
          { speaker: "김변호", text: "입안 과정에서는 원칙적으로 주민 의견을 듣고, 타당하다고 인정된 의견은 계획안에 반영합니다. 2020년 당시에는 계획안을 공고한 뒤 14일 이상 열람하게 하고, 그 기간에 의견서를 낼 수 있었습니다." },
          { speaker: "판사", text: "다만 모든 의견이 자동으로 채택되는 것은 아닙니다. 결정 뒤의 행정심판이나 취소소송도 구체적인 처분성·원고적격·제소기간 등 요건에 따라 검토해야 하므로, 언제나 별도의 ‘이의신청’이 보장된다고 단정해서는 안 됩니다." },
        ],
      },
    ],
    examPoints: [
      { label: "정답", text: "③ 한국토지주택공사 사장" },
      { label: "원칙", text: "특별시장·광역시장·특별자치시장·특별자치도지사·시장·군수" },
      { label: "예외", text: "법정 사유가 있으면 국토교통부장관·도지사도 입안 가능" },
      { label: "함정", text: "입안권자, 결정권자, 사업시행자를 같은 개념으로 보지 않기" },
    ],
    accuracyNote: "제공된 이미지의 ‘이의신청 및 행정소송 가능’ 문구는 기억을 돕는 표현입니다. 국토계획법상 모든 도시·군관리계획에 공통되는 별도의 이의신청 절차가 있다는 뜻은 아닙니다.",
    statuteLabel: "2020년 시행 국토계획법 제24조·제28조·제34조 확인",
    statuteUrl: "https://law.go.kr/lsInfoP.do?lsiSeq=213591",
  },
};
