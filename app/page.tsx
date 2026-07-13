"use client";

import { useMemo, useState } from "react";
import { type VisualLesson } from "./drive-data";
import { VisualCasebook, VisualLessonModal } from "./visual-components";

type IconName =
  | "grid"
  | "file"
  | "book"
  | "bookmark"
  | "settings"
  | "arrow"
  | "play"
  | "search"
  | "chevron"
  | "check"
  | "close"
  | "spark";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    file: <><path d="M6 2.8h8l4 4V21H6z" /><path d="M14 2.8v4h4M9 12h6M9 16h6" /></>,
    book: <><path d="M4 4.8A2.8 2.8 0 0 1 6.8 2H20v17.5H6.8A2.8 2.8 0 0 0 4 22z" /><path d="M4 4.8v14.4M8 7h8M8 11h8" /></>,
    bookmark: <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V22l-6-3.9L6 22z" />,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.5v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6.5v-2.5h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h2.5v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1Z" /></>,
    arrow: <><path d="M5 12h13" /><path d="m13 6 6 6-6 6" /></>,
    play: <path d="m9 6 9 6-9 6z" />,
    search: <><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4.5 4.5" /></>,
    chevron: <path d="m9 6 6 6-6 6" />,
    check: <path d="m5 12 4.3 4.3L19 6.8" />,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    spark: <><path d="m12 2 1.3 6.7L20 10l-6.7 1.3L12 18l-1.3-6.7L4 10l6.7-1.3z" /><path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6z" /></>,
  };

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

const navItems: { id: string; label: string; icon: IconName }[] = [
  { id: "overview", label: "학습 홈", icon: "grid" },
  { id: "casefiles", label: "기출문제", icon: "file" },
  { id: "study", label: "문제풀이", icon: "play" },
  { id: "saved", label: "오답노트", icon: "bookmark" },
  { id: "visuals", label: "시각 해설서", icon: "book" },
];

const cases = [
  { id: 1, year: "2020", subject: "민법", title: "물권의 의의와 공신의 원칙", detail: "물권의 본질적 성질과 거래 안전의 원칙을 구분해보세요.", tag: "2020년 1차", tone: "coral" },
  { id: 2, year: "2020", subject: "부동산관계법규", title: "장기미집행 도시계획시설", detail: "시설부지의 실효 시점과 매수청구권을 묻는 기출문제입니다.", tag: "2020년 1차", tone: "blue" },
  { id: 3, year: "2019", subject: "민법", title: "선의점유와 악의점유의 구별", detail: "점유자의 선의·악의에 따라 달라지는 책임을 정리합니다.", tag: "2019년 1차", tone: "yellow" },
];

const answers = ["직접지배성", "우선적 효력", "공신의 원칙", "물권적 효력", "일물일권주의"];

export default function Home() {
  const [activeNav, setActiveNav] = useState("overview");
  const [query, setQuery] = useState("");
  const [isCaseOpen, setIsCaseOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [completedCase, setCompletedCase] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<VisualLesson | null>(null);

  const filteredCases = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return cases;
    return cases.filter((item) => `${item.subject} ${item.title} ${item.detail}`.toLowerCase().includes(normalized));
  }, [query]);

  const openCase = () => {
    setSelectedAnswer(null);
    setIsCaseOpen(true);
  };

  const finishCase = () => {
    setCompletedCase(true);
    setIsCaseOpen(false);
  };

  const openLesson = (lesson: VisualLesson) => setSelectedLesson(lesson);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><span>BE</span><i /></div>
          <div>
            <p className="eyebrow">COMPENSATION EXAM</p>
            <p className="brand-name">보상관리사 시험</p>
          </div>
        </div>

        <div className="sidebar-section-label">EXAM STUDY</div>
        <nav className="main-nav" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <button key={item.id} className={`nav-item ${activeNav === item.id ? "active" : ""}`} onClick={() => setActiveNav(item.id)}>
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
              {item.id === "saved" && <small>03</small>}
            </button>
          ))}
        </nav>

        <div className="sidebar-progress">
          <div className="progress-orbit"><div className="progress-orbit-inner">62<span>%</span></div></div>
          <p>이번 주 학습</p>
          <strong>4일 연속 기록 중</strong>
          <div className="week-dots" aria-label="이번 주 학습 기록"><i /><i /><i /><i /><i className="muted" /><i className="muted" /><i className="muted" /></div>
        </div>

        <div className="sidebar-footer">
          <button className="nav-item"><Icon name="settings" size={17} /><span>환경 설정</span></button>
          <div className="profile-chip"><div className="avatar">K</div><div><strong>왕규</strong><span>예비 보상관리사</span></div><Icon name="chevron" size={15} /></div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="breadcrumb"><span>보상관리사 시험</span><Icon name="chevron" size={13} /><strong>{navItems.find((item) => item.id === activeNav)?.label}</strong></div>
          <div className="topbar-actions">
            <div className="search-box"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="기출문제, 과목, 키워드 검색" aria-label="기출문제, 과목, 키워드 검색" /></div>
            <button className="icon-button" aria-label="알림"><span className="notification-dot" /><span className="bell-shape">♧</span></button>
          </div>
        </header>

        <div className="page-content">
          <div className="intro-row">
            <div>
              <p className="date-line">SUNDAY, JULY 12, 2026 <span>·</span> 09:40 AM</p>
              <h1>{activeNav === "overview" ? <>오늘의 기출문제로<br /><em>합격 감각</em>을 채워보세요.</> : navItems.find((item) => item.id === activeNav)?.label}</h1>
            </div>
            <div className="quote-note"><span className="quote-mark">“</span><p>기출을 푼 횟수가<br />실전에서의 자신감이 됩니다.</p></div>
          </div>

          {activeNav === "overview" && (
            <>
              <section className="hero-card">
                <div className="hero-copy">
                  <div className="label-row"><span className="case-label">TODAY&apos;S PAST QUESTION</span><span className="label-dot" /><span>약 8분 풀이</span></div>
                  <h2>기출 한 문제로<br /><strong>핵심 개념</strong>을 정리해요.</h2>
                  <p>문제를 풀고, 정답 근거와 오답 포인트까지<br />한 번에 확인해 실전 감각을 쌓아보세요.</p>
                  <button className="primary-button" onClick={openCase}>문제 풀이 시작하기 <Icon name="arrow" size={16} /></button>
                </div>
                <div className="hero-art" aria-label="기출문제 풀이를 표현한 일러스트" role="img">
                  <div className="art-sun" /><div className="art-grid" />
                  <div className="art-file"><span>CASE<br />02</span><i /><b /></div>
                  <div className="art-building"><span /><span /><span /><span /><i /></div>
                  <div className="art-person"><i /><b /><em /></div>
                  <div className="art-speech">기출 지문에서<br /><strong>핵심 단서 찾기</strong></div>
                  <div className="art-caption">PAST QUESTION<br />KEY POINT</div>
                </div>
                <div className="hero-index"><strong>02</strong><span>/</span><span>03</span></div>
              </section>

              <section className="metric-strip">
                <div><span>오늘의 기출</span><strong>03</strong><small>문제</small></div>
                <div><span>오답 복습</span><strong>12</strong><small>문제</small></div>
                <div><span>연속 풀이</span><strong>04</strong><small>일째</small></div>
                <div className="metric-note"><Icon name="spark" size={16} /><span>어제보다 <b>1문제 더</b> 풀었어요</span></div>
              </section>

              <div className="section-heading"><div><p className="eyebrow">TODAY&apos;S PAST QUESTIONS</p><h3>오늘 풀 기출문제</h3></div><button className="text-button" onClick={() => setActiveNav("casefiles")}>기출문제 전체 보기 <Icon name="arrow" size={15} /></button></div>

              <section className="content-grid">
                <article className="featured-case-card">
                  <div className="card-top"><span className="number-badge">01</span><span className="subject-pill">민법 · 물권</span><button className={`bookmark-button ${isBookmarked ? "saved" : ""}`} aria-label="북마크" onClick={() => setIsBookmarked((value) => !value)}><Icon name="bookmark" size={17} /></button></div>
                  <h4>물권의 본질을 묻는<br />2020년 민법 기출</h4>
                  <p className="case-question">“공신의 원칙도 물권의 의의에 해당할까요?”</p>
                  <div className="dialogue"><div className="mini-avatar judge">H</div><div><span>풀이 힌트</span><p>권리의 <b>본질적 성질</b>과<br />거래 안전을 위한 원칙을 구분하세요.</p></div></div>
                  <div className="card-bottom"><span><i className="status-dot" /> 2020년 1차 · 민법</span><button className="small-arrow" onClick={openCase} aria-label="문제 풀기"><Icon name="arrow" size={16} /></button></div>
                </article>

                <article className="routine-card">
                  <div className="card-top"><span className="eyebrow">PRACTICE STATUS</span><span className="streak-badge">4 DAY STREAK</span></div>
                  <h4>기출과 오답을<br /><em>매일 한 세트씩.</em></h4>
                  <div className="routine-chart"><div className="chart-lines"><i /><i /><i /><i /></div><div className="bar-set"><span style={{ height: "42%" }} /><span style={{ height: "68%" }} /><span style={{ height: "54%" }} /><span className="today" style={{ height: "88%" }} /><span style={{ height: "64%" }} /><span style={{ height: "28%" }} /><span style={{ height: "18%" }} /></div><div className="chart-labels"><span>월</span><span>화</span><span>수</span><span className="today-label">목</span><span>금</span><span>토</span><span>일</span></div></div>
                  <div className="routine-footer"><span>누적 학습시간</span><strong>06<span>h</span> 24<span>m</span></strong><span className="up-label">↑ 18%</span></div>
                </article>
              </section>

              <section className="bottom-grid">
                <div className="topic-list-card"><div className="section-heading compact"><div><p className="eyebrow">SUBJECT PROGRESS</p><h3>과목별 풀이 현황</h3></div><button className="more-button" aria-label="더보기">•••</button></div><div className="topic-list"><div><span className="topic-icon coral">민</span><span><b>민법</b><small>물권 · 계약 · 점유</small></span><strong>72%</strong><i><em style={{ width: "72%" }} /></i></div><div><span className="topic-icon blue">법</span><span><b>부동산관계법규</b><small>도시계획 · 건축</small></span><strong>48%</strong><i><em className="blue-fill" style={{ width: "48%" }} /></i></div><div><span className="topic-icon yellow">실</span><span><b>보상 실무</b><small>협의 · 수용 · 이의</small></span><strong>31%</strong><i><em className="yellow-fill" style={{ width: "31%" }} /></i></div></div></div>
                <div className="next-card"><p className="eyebrow">NEXT PRACTICE</p><div className="next-illustration"><div className="next-paper" /><div className="next-pencil" /></div><h4>기출 풀이 뒤에는<br /><em>오답 5문제 복습</em></h4><p>방금 헷갈린 개념을 바로 다시 풀어<br />실수를 줄여보세요.</p><button className="outline-button" onClick={openCase}>오답 문제 풀기 <Icon name="arrow" size={15} /></button></div>
              </section>
            </>
          )}

          {activeNav === "casefiles" && <CaseFiles cases={filteredCases} onOpen={openCase} query={query} />}
          {activeNav === "study" && <StudyRoutine onOpen={openCase} />}
          {activeNav === "saved" && <SavedCases isBookmarked={isBookmarked} onOpen={openCase} />}
          {activeNav === "visuals" && <VisualCasebook onOpen={openLesson} />}
        </div>
      </section>

      {isCaseOpen && <CaseModal selectedAnswer={selectedAnswer} setSelectedAnswer={setSelectedAnswer} completedCase={completedCase} onClose={() => setIsCaseOpen(false)} onFinish={finishCase} />}
      {selectedLesson && <VisualLessonModal lesson={selectedLesson} onClose={() => setSelectedLesson(null)} />}
    </main>
  );
}

function CaseFiles({ cases: items, onOpen, query }: { cases: typeof cases; onOpen: () => void; query: string }) {
  return <section className="subpage"><div className="subpage-intro"><div><p className="eyebrow">ARCHIVE · PAST QUESTIONS</p><h2>연도와 과목으로 고르는<br /><em>보상관리사 기출문제</em></h2></div><span className="archive-stamp">PAST<br />QUESTIONS</span></div><div className="filter-row"><button className="filter-chip selected">전체 기출</button><button className="filter-chip">민법</button><button className="filter-chip">부동산관계법규</button><span className="filter-result">{query ? `“${query}” 검색 결과 ${items.length}건` : "최근 추가된 순서"}</span></div><div className="archive-grid">{items.map((item) => <article className={`archive-card ${item.tone}`} key={item.id}><div className="archive-card-top"><span>{item.year} · {item.subject}</span><span className="archive-number">0{item.id}</span></div><div className="archive-graphic"><div className="graphic-sun" /><div className="graphic-file">{item.id === 1 ? "民" : item.id === 2 ? "法" : "判"}</div><div className="graphic-lines" /></div><p className="eyebrow">{item.tag}</p><h3>{item.title}</h3><p>{item.detail}</p><button className="text-button" onClick={onOpen}>문제 풀기 <Icon name="arrow" size={15} /></button></article>)}</div></section>;
}

function StudyRoutine({ onOpen }: { onOpen: () => void }) {
  return <section className="subpage"><div className="subpage-intro"><div><p className="eyebrow">PRACTICE MODES</p><h2>지금 필요한 방식으로<br /><em>문제를 풀어보세요.</em></h2></div><div className="routine-ring-large">62<span>%</span></div></div><div className="study-grid"><article className="study-plan-card"><div className="card-top"><span className="subject-pill">오늘의 문제풀이</span><span className="streak-badge">4 DAY STREAK</span></div><h3>기출 10문제 · 약점 5문제 · 오답 복습</h3><div className="plan-steps"><div className="done"><span>01</span><p><b>최근 기출 10문제 풀기</b><small>연도별·과목별 출제 감각 익히기</small></p><Icon name="check" size={16} /></div><div><span>02</span><p><b>핵심 개념 확인하기</b><small>정답 근거와 오답 포인트 정리</small></p><i>8분</i></div><div><span>03</span><p><b>오답 다시 풀기</b><small>헷갈린 문제 5개 재도전</small></p><i>5분</i></div></div><button className="primary-button" onClick={onOpen}>문제 풀이 시작하기 <Icon name="arrow" size={16} /></button></article><article className="principle-card"><p className="eyebrow">PRACTICE TIP</p><div className="principle-mark">“</div><h3>많이 푸는 것보다,<br /><em>틀린 이유를 남기기.</em></h3><p>기출을 푼 뒤 틀린 이유와 핵심 근거를 오답노트에 남기면 같은 실수를 빠르게 줄일 수 있습니다.</p><div className="principle-line" /></article></div></section>;
}

function SavedCases({ isBookmarked, onOpen }: { isBookmarked: boolean; onOpen: () => void }) {
  return <section className="subpage"><div className="subpage-intro"><div><p className="eyebrow">YOUR REVIEW NOTE</p><h2>다시 풀어야 할<br /><em>오답과 저장 문제</em></h2></div><div className="shelf-count"><strong>{isBookmarked ? "04" : "03"}</strong><span>review questions</span></div></div><div className="saved-empty"><div className="saved-stack"><span /><span /><span /></div><div><p className="eyebrow">REVIEW QUEUE</p><h3>{isBookmarked ? "저장한 문제가 오답노트에 추가됐어요." : "아직 저장한 문제가 없어요."}</h3><p>{isBookmarked ? "물권 문제를 복습 목록에 넣었습니다. 다음 풀이 전에 다시 확인해보세요." : "기출문제 카드의 북마크를 눌러 헷갈리는 문제를 오답노트에 모아보세요."}</p><button className="outline-button" onClick={onOpen}>기출문제 풀러가기 <Icon name="arrow" size={15} /></button></div></div></section>;
}

function CaseModal({ selectedAnswer, setSelectedAnswer, completedCase, onClose, onFinish }: { selectedAnswer: number | null; setSelectedAnswer: (answer: number) => void; completedCase: boolean; onClose: () => void; onFinish: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="case-modal" role="dialog" aria-modal="true" aria-labelledby="case-modal-title">
        <div className="modal-header">
          <div><p className="eyebrow">2020년 보상관리사 1차 · 민법</p><h2 id="case-modal-title">물권의 의의를 묻는<br /><em>기출문제 풀이</em></h2></div>
          <button className="modal-close" onClick={onClose} aria-label="닫기"><Icon name="close" size={20} /></button>
        </div>
        <div className="modal-progress"><span style={{ width: selectedAnswer === null ? "32%" : "78%" }} /></div>
        <div className="scene-header"><span>QUESTION 01 / 05</span><strong>핵심 쟁점 · 물권의 의의</strong></div>
        <div className="court-scene"><div className="judge-bubble"><span>풀이 가이드</span><p>“다섯 개의 문장 중,<br /><b>물권 자체의 성질</b>이 아닌 것은?”</p></div><div className="modal-figure"><div className="modal-figure-head" /><div className="modal-figure-body" /><div className="modal-figure-desk" /></div><div className="law-book"><span>民法</span><i /></div></div>
        <div className="question-block"><p className="question-label">2020년도 보상관리사 1차시험 · 민법 1번</p><h3>다음 중 물권의 의의에 해당하지 않는 것은?</h3><div className="answer-list">{answers.map((answer, index) => <button key={answer} className={`answer-option ${selectedAnswer === index ? (index === 2 ? "correct" : "wrong") : ""}`} onClick={() => setSelectedAnswer(index)}><span>{index + 1}</span><b>{answer}</b>{selectedAnswer === index && <i>{index === 2 ? "정답" : "다시 생각해봐요"}</i>}</button>)}</div></div>
        {selectedAnswer !== null && <div className={`feedback ${selectedAnswer === 2 ? "correct" : "wrong"}`}><div className="feedback-icon"><Icon name={selectedAnswer === 2 ? "check" : "close"} size={17} /></div><div><strong>{selectedAnswer === 2 ? "좋아요. 쟁점을 정확히 짚었어요." : "거의 다 왔어요. 권리의 성질을 다시 살펴보세요."}</strong><p>{selectedAnswer === 2 ? "공신의 원칙은 거래의 안전을 위한 원칙이지, 물권의 본질적 의의는 아닙니다." : "직접지배성·우선적 효력·물권적 효력·일물일권주의는 물권의 특징으로 설명됩니다."}</p></div></div>}
        <div className="modal-footer"><a href="https://drive.google.com/file/d/1Vzi8r4e2wBro7_KJQg64QnrAmef1UW_t/view" target="_blank" rel="noreferrer">원문 기출 PDF 보기 <Icon name="arrow" size={15} /></a><button className="primary-button" disabled={selectedAnswer === null} onClick={onFinish}>{completedCase ? "다음 문제 풀기" : "풀이 기록하기"} <Icon name="arrow" size={16} /></button></div>
      </section>
    </div>
  );
}
