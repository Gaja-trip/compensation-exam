"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  examLabel,
  examQuestions,
  examYears,
  questionDirection,
  sourceSummary,
  type ExamPhase,
  type ExamQuestion,
  visualLessonByQuestionId,
} from "./exam-data";
import { type VisualLesson, visualLessons } from "./drive-data";
import { questionStoryById, type QuestionStoryExplanation } from "./question-explanations";
import { VisualCasebook, VisualLessonModal } from "./visual-components";

type IconName =
  | "grid"
  | "file"
  | "book"
  | "bookmark"
  | "arrow"
  | "play"
  | "search"
  | "chevron"
  | "check"
  | "close"
  | "spark";

type NavId = "overview" | "casefiles" | "study" | "saved" | "visuals";

type ExamGroup = {
  id: string;
  year: number;
  phase: ExamPhase;
  subject: string;
  questions: ExamQuestion[];
};

type StoredProgress = {
  bookmarkedIds?: string[];
  wrongIds?: string[];
  completedIds?: string[];
};

const progressStorageKey = "compensation-exam-progress-v1";

const navItems: { id: NavId; label: string; icon: IconName }[] = [
  { id: "overview", label: "학습 홈", icon: "grid" },
  { id: "casefiles", label: "기출문제", icon: "file" },
  { id: "study", label: "문제풀이", icon: "play" },
  { id: "saved", label: "오답노트", icon: "bookmark" },
  { id: "visuals", label: "시각 해설서", icon: "book" },
];

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    file: <><path d="M6 2.8h8l4 4V21H6z" /><path d="M14 2.8v4h4M9 12h6M9 16h6" /></>,
    book: <><path d="M4 4.8A2.8 2.8 0 0 1 6.8 2H20v17.5H6.8A2.8 2.8 0 0 0 4 22z" /><path d="M4 4.8v14.4M8 7h8M8 11h8" /></>,
    bookmark: <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V22l-6-3.9L6 22z" />,
    arrow: <><path d="M5 12h13" /><path d="m13 6 6 6-6 6" /></>,
    play: <path d="m9 6 9 6-9 6z" />,
    search: <><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4.5 4.5" /></>,
    chevron: <path d="m9 6 6 6" />,
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

function uniqueIds(value: unknown) {
  return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === "string"))] : [];
}

function toneFor(index: number) {
  return ["coral", "blue", "yellow"][index % 3];
}

function findQuestion(questionId: string) {
  return examQuestions.find((question) => question.id === questionId);
}

export default function Home() {
  const [activeNav, setActiveNav] = useState<NavId>("overview");
  const [query, setQuery] = useState("");
  const [filterYear, setFilterYear] = useState<number | "all">("all");
  const [filterPhase, setFilterPhase] = useState<ExamPhase | "all">("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [selectedQuestion, setSelectedQuestion] = useState<ExamQuestion | null>(null);
  const [activeQuestionPool, setActiveQuestionPool] = useState<ExamQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<VisualLesson | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isProgressLoaded, setIsProgressLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(progressStorageKey);
      if (stored) {
        const progress = JSON.parse(stored) as StoredProgress;
        setBookmarkedIds(uniqueIds(progress.bookmarkedIds));
        setWrongIds(uniqueIds(progress.wrongIds));
        setCompletedIds(uniqueIds(progress.completedIds));
      }
    } catch {
      window.localStorage.removeItem(progressStorageKey);
    } finally {
      setIsProgressLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isProgressLoaded) return;
    window.localStorage.setItem(
      progressStorageKey,
      JSON.stringify({ bookmarkedIds, wrongIds, completedIds }),
    );
  }, [bookmarkedIds, completedIds, isProgressLoaded, wrongIds]);

  const availableSubjects = useMemo(() => {
    return [...new Set(examQuestions
      .filter((question) => filterYear === "all" || question.year === filterYear)
      .filter((question) => filterPhase === "all" || question.phase === filterPhase)
      .map((question) => question.subject))].sort();
  }, [filterPhase, filterYear]);

  const filteredQuestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return examQuestions.filter((question) => {
      const matchesYear = filterYear === "all" || question.year === filterYear;
      const matchesPhase = filterPhase === "all" || question.phase === filterPhase;
      const matchesSubject = filterSubject === "all" || question.subject === filterSubject;
      const searchable = `${question.subject} ${question.stem} ${question.choices.join(" ")}`.toLowerCase();
      const matchesQuery = !normalized || searchable.includes(normalized);

      return matchesYear && matchesPhase && matchesSubject && matchesQuery;
    });
  }, [filterPhase, filterSubject, filterYear, query]);

  const examGroups = useMemo(() => {
    const groups = new Map<string, ExamGroup>();
    filteredQuestions.forEach((question) => {
      const id = `${question.year}-${question.phase}-${question.subject}`;
      const existing = groups.get(id);
      if (existing) {
        existing.questions.push(question);
      } else {
        groups.set(id, {
          id,
          year: question.year,
          phase: question.phase,
          subject: question.subject,
          questions: [question],
        });
      }
    });

    return [...groups.values()].sort((left, right) => {
      if (left.year !== right.year) return right.year - left.year;
      if (left.phase !== right.phase) return left.phase - right.phase;
      return left.subject.localeCompare(right.subject, "ko");
    });
  }, [filteredQuestions]);

  const featuredQuestion = useMemo(() => {
    return findQuestion("2020-1-민법-001") ?? filteredQuestions[0] ?? examQuestions[0];
  }, [filteredQuestions]);

  const reviewQuestions = useMemo(() => {
    const orderedIds = [...wrongIds, ...bookmarkedIds.filter((id) => !wrongIds.includes(id))];
    return orderedIds.map(findQuestion).filter((question): question is ExamQuestion => Boolean(question));
  }, [bookmarkedIds, wrongIds]);

  const completedCount = completedIds.length;
  const practiceSet = filteredQuestions.slice(0, 10);
  const completedPercent = Math.round((completedCount / Math.max(examQuestions.length, 1)) * 100);
  const practiceCompletedCount = practiceSet.filter((question) => completedIds.includes(question.id)).length;

  const openQuestion = (question: ExamQuestion, pool = filteredQuestions) => {
    const resolvedPool = pool.some((item) => item.id === question.id) ? pool : [question, ...pool];
    setSelectedQuestion(question);
    setActiveQuestionPool(resolvedPool);
    setSelectedAnswer(null);
    setAnswerRevealed(false);
  };

  const closeQuestion = () => setSelectedQuestion(null);

  const chooseAnswer = (answerIndex: number) => {
    if (!selectedQuestion) return;
    const isCorrect = selectedQuestion.answerIndex === answerIndex;

    setSelectedAnswer(answerIndex);
    setAnswerRevealed(true);
    setCompletedIds((ids) => ids.includes(selectedQuestion.id) ? ids : [...ids, selectedQuestion.id]);
    setWrongIds((ids) => {
      if (isCorrect) return ids.filter((id) => id !== selectedQuestion.id);
      return ids.includes(selectedQuestion.id) ? ids : [...ids, selectedQuestion.id];
    });
  };

  const toggleBookmark = (questionId: string) => {
    setBookmarkedIds((ids) => ids.includes(questionId) ? ids.filter((id) => id !== questionId) : [...ids, questionId]);
  };

  const openNextQuestion = () => {
    if (!selectedQuestion) return;
    const pool = activeQuestionPool.length > 1
      ? activeQuestionPool
      : filteredQuestions.length > 1
        ? filteredQuestions
        : examQuestions;
    if (pool.length === 0) return;
    const currentIndex = pool.findIndex((question) => question.id === selectedQuestion.id);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % pool.length;
    openQuestion(pool[nextIndex], pool);
  };

  const openVisualLesson = (lesson: VisualLesson) => setSelectedLesson(lesson);

  const openQuestionVisualLesson = (question: ExamQuestion) => {
    const lessonId = visualLessonByQuestionId[question.id];
    const lesson = visualLessons.find((item) => item.id === lessonId);
    if (!lesson) return;
    closeQuestion();
    setSelectedLesson(lesson);
  };

  const updateYear = (year: number | "all") => {
    setFilterYear(year);
    setFilterSubject("all");
  };

  const updatePhase = (phase: ExamPhase | "all") => {
    setFilterPhase(phase);
    setFilterSubject("all");
  };

  const resetFilters = () => {
    setFilterYear("all");
    setFilterPhase("all");
    setFilterSubject("all");
    setQuery("");
  };

  const headerTitle = navItems.find((item) => item.id === activeNav)?.label;

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
              {item.id === "saved" && reviewQuestions.length > 0 && <small>{String(reviewQuestions.length).padStart(2, "0")}</small>}
            </button>
          ))}
        </nav>

        <div className="sidebar-progress">
          <div className="progress-orbit" style={{ background: `conic-gradient(var(--coral) 0 ${completedPercent}%, rgba(255,255,255,.1) ${completedPercent}% 100%)` }}><div className="progress-orbit-inner">{completedPercent}<span>%</span></div></div>
          <p>누적 학습 현황</p>
          <strong>{completedCount}문제 풀이 기록</strong>
          <div className="week-dots" aria-label="학습 단계"><i className={completedCount > 0 ? "" : "muted"} /><i className={completedCount > 5 ? "" : "muted"} /><i className={completedCount > 15 ? "" : "muted"} /><i className={completedCount > 30 ? "" : "muted"} /><i className="muted" /><i className="muted" /><i className="muted" /></div>
        </div>

        <div className="sidebar-footer">
          <div className="profile-chip"><div className="avatar">Q</div><div><strong>기출 학습</strong><span>정답표 대조 완료</span></div><Icon name="chevron" size={15} /></div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="breadcrumb"><span>보상관리사 시험</span><Icon name="chevron" size={13} /><strong>{headerTitle}</strong></div>
          <div className="topbar-actions">
            <div className="search-box"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="기출문제, 과목, 키워드 검색" aria-label="기출문제, 과목, 키워드 검색" /></div>
            <div className="exam-library-counter" aria-label="탑재 문항 수"><strong>{examQuestions.length}</strong><span>문항</span></div>
          </div>
        </header>

        <div className="page-content">
          <div className="intro-row exam-intro-row">
            <div>
              <p className="date-line">PAST EXAM LIBRARY <span>·</span> SOURCE-VERIFIED</p>
              <h1>{activeNav === "overview" ? <>기출을 풀고,<br /><em>틀린 이유까지</em> 남겨보세요.</> : headerTitle}</h1>
            </div>
            <div className="quote-note"><span className="quote-mark">“</span><p>정답만 확인하지 말고<br />근거를 한 줄로 남겨보세요.</p></div>
          </div>

          {activeNav === "overview" && <OverviewPanel question={featuredQuestion} completedCount={completedCount} wrongCount={wrongIds.length} bookmarkedCount={bookmarkedIds.length} onOpen={openQuestion} onBookmark={toggleBookmark} isBookmarked={bookmarkedIds.includes(featuredQuestion.id)} onShowArchive={() => setActiveNav("casefiles")} />}
          {activeNav === "casefiles" && <ExamArchive groups={examGroups} questions={filteredQuestions} year={filterYear} phase={filterPhase} subject={filterSubject} subjects={availableSubjects} onYearChange={updateYear} onPhaseChange={updatePhase} onSubjectChange={setFilterSubject} onReset={resetFilters} onOpen={openQuestion} />}
          {activeNav === "study" && <PracticePanel questions={practiceSet} total={filteredQuestions.length} completed={practiceCompletedCount} onOpen={(question) => openQuestion(question, practiceSet)} />}
          {activeNav === "saved" && <ReviewPanel questions={reviewQuestions} wrongIds={wrongIds} bookmarkedIds={bookmarkedIds} onOpen={(question) => openQuestion(question, reviewQuestions)} onToggleBookmark={toggleBookmark} onBrowse={() => setActiveNav("casefiles")} />}
          {activeNav === "visuals" && <VisualCasebook onOpen={openVisualLesson} />}
        </div>
      </section>

      {selectedQuestion && <QuestionModal key={selectedQuestion.id} question={selectedQuestion} selectedAnswer={selectedAnswer} answerRevealed={answerRevealed} isBookmarked={bookmarkedIds.includes(selectedQuestion.id)} onChoose={chooseAnswer} onClose={closeQuestion} onNext={openNextQuestion} onToggleBookmark={toggleBookmark} onOpenVisualLesson={openQuestionVisualLesson} />}
      {selectedLesson && <VisualLessonModal lesson={selectedLesson} onClose={() => setSelectedLesson(null)} />}
    </main>
  );
}

function OverviewPanel({ question, completedCount, wrongCount, bookmarkedCount, onOpen, onBookmark, isBookmarked, onShowArchive }: { question: ExamQuestion; completedCount: number; wrongCount: number; bookmarkedCount: number; onOpen: (question: ExamQuestion) => void; onBookmark: (questionId: string) => void; isBookmarked: boolean; onShowArchive: () => void }) {
  const subjects = ["민법", "부동산관계법규", "토지보상법규", "보상실무 1", "보상실무 2"];

  return (
    <>
      <section className="hero-card">
        <div className="hero-copy">
          <div className="label-row"><span className="case-label">TODAY&apos;S PAST QUESTION</span><span className="label-dot" /><span>{examLabel(question)}</span></div>
          <h2>실제 기출 한 문제로<br /><strong>정답 근거</strong>를 정리해요.</h2>
          <p>선지를 고른 뒤 정답표 근거와 쉬운 풀이 순서를<br />바로 확인해 오답노트에 남길 수 있어요.</p>
          <button className="primary-button" onClick={() => onOpen(question)}>이 문제 풀기 <Icon name="arrow" size={16} /></button>
        </div>
        <div className="hero-art" aria-label="기출문제 풀이를 표현한 일러스트" role="img">
          <div className="art-sun" /><div className="art-grid" />
          <div className="art-file"><span>PAST<br />Q</span><i /><b /></div>
          <div className="art-building"><span /><span /><span /><span /><i /></div>
          <div className="art-person"><i /><b /><em /></div>
          <div className="art-speech">문제 → 정답 →<br /><strong>근거 한 줄 정리</strong></div>
          <div className="art-caption">355 QUESTIONS<br />READY TO STUDY</div>
        </div>
        <div className="hero-index"><strong>01</strong><span>/</span><span>01</span></div>
      </section>

      <section className="metric-strip exam-metric-strip">
        <div><span>탑재 기출</span><strong>{examQuestions.length}</strong><small>객관식</small></div>
        <div><span>풀이 기록</span><strong>{completedCount}</strong><small>문제</small></div>
        <div><span>오답 복습</span><strong>{wrongCount}</strong><small>문제</small></div>
        <div className="metric-note"><Icon name="spark" size={16} /><span>저장한 문제 <b>{bookmarkedCount}개</b>를 복습할 수 있어요.</span></div>
      </section>

      <div className="section-heading"><div><p className="eyebrow">START HERE</p><h3>오늘의 기출문제</h3></div><button className="text-button" onClick={onShowArchive}>전체 기출 보기 <Icon name="arrow" size={15} /></button></div>
      <section className="content-grid">
        <article className="featured-case-card">
          <div className="card-top"><span className="number-badge">{String(question.number).padStart(2, "0")}</span><span className="subject-pill">{question.subject}</span><button className={`bookmark-button ${isBookmarked ? "saved" : ""}`} aria-label={isBookmarked ? "저장 해제" : "복습 문제 저장"} onClick={() => onBookmark(question.id)}><Icon name="bookmark" size={17} /></button></div>
          <h4>{question.year}년 {question.phase}차<br />실전 기출문제</h4>
          <p className="case-question">“{question.stem}”</p>
          <div className="dialogue"><div className="mini-avatar judge">Q</div><div><span>풀이 방향</span><p>{questionDirection(question.stem)}</p></div></div>
          <div className="card-bottom"><span><i className="status-dot" /> {sourceSummary(question)}</span><button className="small-arrow" onClick={() => onOpen(question)} aria-label="문제 풀기"><Icon name="arrow" size={16} /></button></div>
        </article>

        <article className="routine-card exam-source-card">
          <div className="card-top"><span className="eyebrow">SOURCE COVERAGE</span><span className="streak-badge">2016—2022</span></div>
          <h4>연도·차수·과목별로<br /><em>정답표 대조를 마쳤어요.</em></h4>
          <div className="exam-subject-cloud">{subjects.map((subject) => <span key={subject}>{subject}</span>)}</div>
          <div className="routine-footer"><span>수록 연도</span><strong>5<span>개</span></strong><span className="up-label">1·2차 포함</span></div>
        </article>
      </section>
    </>
  );
}

function FilterToolbar({ year, phase, subject, subjects, onYearChange, onPhaseChange, onSubjectChange, onReset }: { year: number | "all"; phase: ExamPhase | "all"; subject: string; subjects: string[]; onYearChange: (year: number | "all") => void; onPhaseChange: (phase: ExamPhase | "all") => void; onSubjectChange: (subject: string) => void; onReset: () => void }) {
  return (
    <div className="exam-filter-bar" aria-label="기출문제 필터">
      <label className="exam-filter-select"><span>연도</span><select value={year} onChange={(event) => onYearChange(event.target.value === "all" ? "all" : Number(event.target.value))}><option value="all">전체 연도</option>{examYears.map((item) => <option key={item} value={item}>{item}년</option>)}</select></label>
      <label className="exam-filter-select"><span>차수</span><select value={phase} onChange={(event) => onPhaseChange(event.target.value === "all" ? "all" : Number(event.target.value) as ExamPhase)}><option value="all">전체 차수</option><option value="1">1차</option><option value="2">2차</option></select></label>
      <label className="exam-filter-select"><span>과목</span><select value={subject} onChange={(event) => onSubjectChange(event.target.value)}><option value="all">전체 과목</option>{subjects.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <button className="filter-reset" onClick={onReset}>필터 초기화</button>
    </div>
  );
}

function ExamArchive({ groups, questions, year, phase, subject, subjects, onYearChange, onPhaseChange, onSubjectChange, onReset, onOpen }: { groups: ExamGroup[]; questions: ExamQuestion[]; year: number | "all"; phase: ExamPhase | "all"; subject: string; subjects: string[]; onYearChange: (year: number | "all") => void; onPhaseChange: (phase: ExamPhase | "all") => void; onSubjectChange: (subject: string) => void; onReset: () => void; onOpen: (question: ExamQuestion) => void }) {
  return (
    <section className="subpage exam-archive">
      <div className="subpage-intro"><div><p className="eyebrow">ARCHIVE · PAST QUESTIONS</p><h2>실제 기출을 골라<br /><em>바로 풀어보세요.</em></h2></div><span className="archive-stamp">PAST<br />QUESTIONS</span></div>
      <FilterToolbar year={year} phase={phase} subject={subject} subjects={subjects} onYearChange={onYearChange} onPhaseChange={onPhaseChange} onSubjectChange={onSubjectChange} onReset={onReset} />
      <div className="exam-result-line"><strong>{questions.length}문항</strong><span>필터에 맞는 선택형 기출문제예요. 카드에서 첫 문항을 열거나 아래 문항을 바로 선택하세요.</span></div>

      {groups.length > 0 ? <section className="exam-set-grid">{groups.map((group, index) => {
        const firstQuestion = group.questions[0];
        return <article className={`exam-set-card ${toneFor(index)}`} key={group.id}>
          <div className="exam-set-card-top"><span>{group.year}년 · {group.phase}차</span><strong>{group.questions.length}문항</strong></div>
          <div className="exam-set-mark">{group.phase === 1 ? "1" : "2"}<small>차</small></div>
          <p className="eyebrow">{group.subject}</p>
          <h3>{group.subject}<br />기출문제</h3>
          <p>문제지와 표준정답표를 문항 번호 기준으로 대조했습니다.</p>
          <button className="text-button" onClick={() => onOpen(firstQuestion)}>첫 문제 풀기 <Icon name="arrow" size={15} /></button>
        </article>;
      })}</section> : <EmptySearch onReset={onReset} />}

      {questions.length > 0 && <section className="exam-preview-section"><div className="section-heading compact"><div><p className="eyebrow">QUESTION PREVIEW</p><h3>문항 바로 풀기</h3></div><span className="exam-preview-count">최근 {Math.min(12, questions.length)}문항</span></div><div className="question-preview-list">{questions.slice(0, 12).map((question) => <QuestionPreview key={question.id} question={question} onOpen={onOpen} />)}</div></section>}
    </section>
  );
}

function PracticePanel({ questions, total, completed, onOpen }: { questions: ExamQuestion[]; total: number; completed: number; onOpen: (question: ExamQuestion) => void }) {
  const progress = questions.length ? Math.round((completed / questions.length) * 100) : 0;

  return (
    <section className="subpage">
      <div className="subpage-intro"><div><p className="eyebrow">PRACTICE MODES</p><h2>선택하고, 확인하고,<br /><em>틀린 이유를 정리하세요.</em></h2></div><div className="routine-ring-large" style={{ background: `conic-gradient(var(--coral) 0 ${progress}%, #e5e3dc ${progress}% 100%)` }}>{progress}<span>%</span></div></div>
      <section className="study-grid exam-practice-grid">
        <article className="study-plan-card">
          <div className="card-top"><span className="subject-pill">맞춤 10문제</span><span className="streak-badge">{total}문항 선택됨</span></div>
          <h3>한 문제씩 풀고<br />정답 근거를 확인해요.</h3>
          <div className="plan-steps"><div className="done"><span>01</span><p><b>선지 먼저 고르기</b><small>정답을 보기 전에 지문의 핵심어를 확인해요.</small></p><Icon name="check" size={16} /></div><div><span>02</span><p><b>표준정답표 근거 보기</b><small>원문 해설이 있으면 그대로, 없으면 정답표 기준으로 안내해요.</small></p><i>즉시</i></div><div><span>03</span><p><b>오답노트에 남기기</b><small>헷갈린 문제는 저장해 다음 회차에 다시 풀어요.</small></p><i>복습</i></div></div>
          <button className="primary-button" disabled={questions.length === 0} onClick={() => questions[0] && onOpen(questions[0])}>10문제 시작하기 <Icon name="arrow" size={16} /></button>
        </article>
        <article className="principle-card"><p className="eyebrow">풀이 팁</p><div className="principle-mark">“</div><h3>먼저 <em>질문의 방향</em>을<br />표시하세요.</h3><p>“틀린 것은”, “아닌 것은” 같은 부정 표현을 먼저 표시하면 실수를 크게 줄일 수 있습니다.</p><div className="principle-line" /></article>
      </section>
      <section className="exam-preview-section"><div className="section-heading compact"><div><p className="eyebrow">PRACTICE QUEUE</p><h3>이번 세트</h3></div><span className="exam-preview-count">{questions.length} / 10문항</span></div><div className="question-preview-list">{questions.map((question) => <QuestionPreview key={question.id} question={question} onOpen={onOpen} />)}</div></section>
    </section>
  );
}

function ReviewPanel({ questions, wrongIds, bookmarkedIds, onOpen, onToggleBookmark, onBrowse }: { questions: ExamQuestion[]; wrongIds: string[]; bookmarkedIds: string[]; onOpen: (question: ExamQuestion) => void; onToggleBookmark: (questionId: string) => void; onBrowse: () => void }) {
  return (
    <section className="subpage">
      <div className="subpage-intro"><div><p className="eyebrow">YOUR REVIEW NOTE</p><h2>다시 풀어야 할<br /><em>오답과 저장 문제</em></h2></div><div className="shelf-count"><strong>{String(questions.length).padStart(2, "0")}</strong><span>review questions</span></div></div>
      {questions.length === 0 ? <div className="saved-empty"><div className="saved-stack"><span /><span /><span /></div><div><p className="eyebrow">REVIEW QUEUE</p><h3>아직 복습할 문제가 없어요.</h3><p>문제를 틀리거나 북마크를 누르면 이곳에서 다시 풀 수 있어요.</p><button className="outline-button" onClick={onBrowse}>기출문제 보러가기 <Icon name="arrow" size={15} /></button></div></div> : <><div className="exam-result-line"><strong>오답 {wrongIds.length} · 저장 {bookmarkedIds.length}</strong><span>정답을 맞히면 오답 표시가 해제됩니다. 저장은 별도로 유지할 수 있어요.</span></div><div className="review-question-grid">{questions.map((question, index) => <article className="review-question-card" key={question.id}><div><span className={`review-state ${wrongIds.includes(question.id) ? "wrong" : "saved"}`}>{wrongIds.includes(question.id) ? "오답" : "저장"}</span><span className="exam-preview-meta">{examLabel(question)}</span></div><h3>{question.stem}</h3><div><button className="text-button" onClick={() => onOpen(question)}>다시 풀기 <Icon name="arrow" size={15} /></button><button className={`bookmark-button ${bookmarkedIds.includes(question.id) ? "saved" : ""}`} aria-label="저장 상태 변경" onClick={() => onToggleBookmark(question.id)}><Icon name="bookmark" size={16} /></button></div></article>)}</div></>}
    </section>
  );
}

function EmptySearch({ onReset }: { onReset: () => void }) {
  return <div className="exam-empty"><div className="saved-stack"><span /><span /><span /></div><div><p className="eyebrow">NO MATCHES</p><h3>조건에 맞는 문항이 없어요.</h3><p>연도·차수·과목 필터를 초기화하거나 검색어를 바꿔보세요.</p><button className="outline-button" onClick={onReset}>전체 기출 보기 <Icon name="arrow" size={15} /></button></div></div>;
}

function QuestionPreview({ question, onOpen }: { question: ExamQuestion; onOpen: (question: ExamQuestion) => void }) {
  return <article className="question-preview"><div className="question-preview-number">{String(question.number).padStart(2, "0")}</div><div className="question-preview-copy"><span className="exam-preview-meta">{question.year}년 {question.phase}차 · {question.subject}</span><h4>{question.stem}</h4><p>{questionDirection(question.stem)}</p></div><button className="small-arrow" onClick={() => onOpen(question)} aria-label={`${examLabel(question)} 풀기`}><Icon name="arrow" size={16} /></button></article>;
}

function QuestionStory({ story }: { story: QuestionStoryExplanation }) {
  return (
    <section className="question-story" aria-labelledby="question-story-title">
      <header className="question-story-header">
        <p className="eyebrow">{story.eyebrow}</p>
        <h3 id="question-story-title">{story.title}</h3>
        <p>{story.lead}</p>
      </header>

      <figure className="question-story-figure">
        <a href={story.image.src} target="_blank" rel="noreferrer" aria-label="각색 해설 이미지를 원본 크기로 열기">
          <Image src={story.image} alt={story.imageAlt} sizes="(max-width: 780px) calc(100vw - 64px), 860px" />
          <span>이미지 크게 보기 ↗</span>
        </a>
        <figcaption>{story.imageCaption}</figcaption>
      </figure>

      <div className="question-story-cast" aria-label="각색 해설 등장인물">
        {story.cast.map((person) => <span key={person.name}><b>{person.name}</b>{person.role}</span>)}
      </div>

      <ol className="question-story-scenes">
        {story.scenes.map((scene) => (
          <li key={scene.label}>
            <div className="question-story-scene-heading"><span>{scene.label}</span><h4>{scene.title}</h4></div>
            <div className="question-story-dialogue">
              {scene.lines.map((line, index) => <p key={`${scene.label}-${line.speaker}-${index}`}><b>{line.speaker}</b><span>{line.text}</span></p>)}
            </div>
          </li>
        ))}
      </ol>

      <div className="question-story-points">
        <div><p className="eyebrow">EXAM CHECK</p><h4>중학생도 바로 기억하는 핵심 정리</h4></div>
        <dl>{story.examPoints.map((point) => <div key={point.label}><dt>{point.label}</dt><dd>{point.text}</dd></div>)}</dl>
      </div>

      <aside className="question-story-note"><b>표현 바로잡기</b><p>{story.accuracyNote}</p></aside>
      <a className="question-story-source" href={story.statuteUrl} target="_blank" rel="noreferrer">{story.statuteLabel} <span aria-hidden="true">↗</span></a>
    </section>
  );
}

function QuestionModal({ question, selectedAnswer, answerRevealed, isBookmarked, onChoose, onClose, onNext, onToggleBookmark, onOpenVisualLesson }: { question: ExamQuestion; selectedAnswer: number | null; answerRevealed: boolean; isBookmarked: boolean; onChoose: (answerIndex: number) => void; onClose: () => void; onNext: () => void; onToggleBookmark: (questionId: string) => void; onOpenVisualLesson: (question: ExamQuestion) => void }) {
  const isCorrect = selectedAnswer === question.answerIndex;
  const officialExplanation = question.officialNote || `원문 정답표에는 이 문항의 해설이 수록되어 있지 않습니다. 정답 ${question.answerIndex + 1}번 선지의 요건을 지문에서 다시 확인해 보세요.`;
  const visualLessonAvailable = Boolean(visualLessonByQuestionId[question.id]);
  const questionStory = questionStoryById[question.id];

  useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="case-modal exam-question-modal" role="dialog" aria-modal="true" aria-labelledby="case-modal-title">
        <div className="modal-header exam-question-header">
          <div><p className="eyebrow">{question.year}년 보상관리사 {question.phase}차 · {question.subject}</p><h2 id="case-modal-title">기출문제 <em>풀이</em></h2></div>
          <div className="exam-question-header-actions">
            <button className="question-next-button" type="button" onClick={onNext} aria-label={answerRevealed ? "다음 문제로 이동" : "이 문제를 건너뛰고 다음 문제로 이동"}><span className="question-next-label-wide">다음 문제</span><span className="question-next-label-short">다음</span><Icon name="arrow" size={17} /></button>
            <button className="modal-close" type="button" autoFocus onClick={onClose} aria-label="닫기"><Icon name="close" size={20} /></button>
          </div>
        </div>
        <div className="modal-progress"><span style={{ width: answerRevealed ? "100%" : "45%" }} /></div>
        <div className="scene-header"><span>QUESTION {String(question.number).padStart(2, "0")}</span><strong>{sourceSummary(question)}</strong></div>
        <div className="exam-question-guide"><span>풀이 가이드</span><p>{questionDirection(question.stem)}</p></div>

        <div className="question-block"><p className="question-label">{examLabel(question)}</p><h3>{question.stem}</h3><div className="answer-list exam-answer-list">{question.choices.map((choice, index) => {
          const answerState = answerRevealed ? (index === question.answerIndex ? "correct" : index === selectedAnswer ? "wrong" : "") : selectedAnswer === index ? "selected" : "";
          return <button key={`${question.id}-${index}`} className={`answer-option ${answerState}`} disabled={answerRevealed} onClick={() => onChoose(index)}><span>{index + 1}</span><b>{choice}</b>{answerRevealed && index === question.answerIndex && <i>정답</i>}{answerRevealed && index === selectedAnswer && index !== question.answerIndex && <i>선택</i>}</button>;
        })}</div></div>

        {answerRevealed && <section className={`feedback exam-feedback ${isCorrect ? "correct" : "wrong"}`}><div className="feedback-icon"><Icon name={isCorrect ? "check" : "close"} size={17} /></div><div><strong>{isCorrect ? "정답입니다. 근거까지 확인해 보세요." : "오답이에요. 아래 순서로 다시 정리해 보세요."}</strong><p>{isCorrect ? "정답 선지와 정답표의 근거가 일치하는지 확인해 보세요." : "선택한 선지보다 정답 선지가 왜 지문에 더 정확히 맞는지 비교해 보세요."}</p></div></section>}

        {answerRevealed && <section className="easy-solution"><div className="easy-solution-header"><div><p className="eyebrow">EASY SOLUTION</p><h3>3단계로 정리하기</h3></div><span>{question.officialNote ? "정답표 해설" : "정답표 기준"}</span></div><ol><li><span>01</span><div><b>질문 방향 확인</b><p>{questionDirection(question.stem)}</p></div></li><li><span>02</span><div><b>정답 선지 확인</b><p><strong>{question.answerIndex + 1}번</strong> {question.choices[question.answerIndex]}</p></div></li><li><span>03</span><div><b>근거 되짚기</b><p>{officialExplanation}</p></div></li></ol></section>}

        {answerRevealed && questionStory && <QuestionStory story={questionStory} />}

        {answerRevealed && <details className="source-details"><summary>원문 출처와 페이지 확인</summary><p>문제지: {question.source.questionPdf} · p.{question.source.questionPage}</p><p>정답표: {question.source.answerPdf} · p.{question.source.answerPage}</p></details>}

        <div className="modal-footer exam-modal-footer"><button className={`outline-button ${isBookmarked ? "active" : ""}`} onClick={() => onToggleBookmark(question.id)}><Icon name="bookmark" size={15} /> {isBookmarked ? "복습 저장 해제" : "오답노트에 저장"}</button><div className="exam-modal-actions">{visualLessonAvailable && <button className="text-button" onClick={() => onOpenVisualLesson(question)}>시각 해설서 <Icon name="book" size={15} /></button>}<button className="primary-button" onClick={onNext}>다음 문제 <Icon name="arrow" size={16} /></button></div></div>
      </section>
    </div>
  );
}
