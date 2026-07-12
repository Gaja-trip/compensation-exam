"use client";

import { useMemo, useState } from "react";

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
  { id: "overview", label: "오늘의 사건", icon: "grid" },
  { id: "casefiles", label: "기출 사건함", icon: "file" },
  { id: "study", label: "학습 루틴", icon: "book" },
  { id: "saved", label: "내 북마크", icon: "bookmark" },
];

const cases = [
  { id: 1, year: "2020", subject: "민법", title: "물권의 본질을 둘러싼 첫 공방", detail: "공신의 원칙은 물권의 의의에 포함될까?", tag: "기초 개념", tone: "coral" },
  { id: 2, year: "2020", subject: "부동산관계법규", title: "도시계획시설, 멈춘 시간의 값", detail: "장기미집행 시설부지의 실효와 매수청구", tag: "보상 실무", tone: "blue" },
  { id: 3, year: "2019", subject: "민법", title: "점유자는 누구의 편인가", detail: "선의점유와 악의점유를 가르는 순간", tag: "판례 읽기", tone: "yellow" },
];

const answers = ["직접지배성", "우선적 효력", "공신의 원칙", "물권적 효력", "일물일권주의"];

export default function Home() {
  const [activeNav, setActiveNav] = useState("overview");
  const [query, setQuery] = useState("");
  const [isCaseOpen, setIsCaseOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [completedCase, setCompletedCase] = useState(false);

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

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><span>CR</span><i /></div>
          <div>
            <p className="eyebrow">COMPENSATION · 01</p>
            <p className="brand-name">케이스룸</p>
          </div>
        </div>

        <div className="sidebar-section-label">LEARNING DESK</div>
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
          <div className="breadcrumb"><span>LEARNING DESK</span><Icon name="chevron" size={13} /><strong>{navItems.find((item) => item.id === activeNav)?.label}</strong></div>
          <div className="topbar-actions">
            <div className="search-box"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="사건, 개념 검색" aria-label="사건, 개념 검색" /></div>
            <button className="icon-button" aria-label="알림"><span className="notification-dot" /><span className="bell-shape">♧</span></button>
          </div>
        </header>

        <div className="page-content">
          <div className="intro-row">
            <div>
              <p className="date-line">SUNDAY, JULY 12, 2026 <span>·</span> 09:40 AM</p>
              <h1>{activeNav === "overview" ? <>오늘, 한 사건만<br /><em>제대로</em> 기억해요.</> : navItems.find((item) => item.id === activeNav)?.label}</h1>
            </div>
            <div className="quote-note"><span className="quote-mark">“</span><p>판례를 외우는 대신<br />판결이 된 순간을 따라가요.</p></div>
          </div>

          {activeNav === "overview" && (
            <>
              <section className="hero-card">
                <div className="hero-copy">
                  <div className="label-row"><span className="case-label">CASE OF THE DAY</span><span className="label-dot" /><span>약 8분 소요</span></div>
                  <h2>“이 토지는<br /><strong>누구의 것</strong>인가?”</h2>
                  <p>도시계획시설로 묶인 땅. 시간이 길어질수록<br />소유자의 선택지는 어떻게 달라질까요?</p>
                  <button className="primary-button" onClick={openCase}>사건의 첫 장 열기 <Icon name="arrow" size={16} /></button>
                </div>
                <div className="hero-art" aria-label="법정 사건을 표현한 일러스트" role="img">
                  <div className="art-sun" /><div className="art-grid" />
                  <div className="art-file"><span>CASE<br />02</span><i /><b /></div>
                  <div className="art-building"><span /><span /><span /><span /><i /></div>
                  <div className="art-person"><i /><b /><em /></div>
                  <div className="art-speech">“기간이<br /><strong>너무 길어요.</strong>”</div>
                  <div className="art-caption">LONG-UNEXECUTED<br />FACILITY</div>
                </div>
                <div className="hero-index"><strong>02</strong><span>/</span><span>03</span></div>
              </section>

              <section className="metric-strip">
                <div><span>오늘의 사건</span><strong>03</strong><small>건</small></div>
                <div><span>복습 대기</span><strong>12</strong><small>개념</small></div>
                <div><span>연속 학습</span><strong>04</strong><small>일째</small></div>
                <div className="metric-note"><Icon name="spark" size={16} /><span>어제보다 <b>1개 더</b> 풀었어요</span></div>
              </section>

              <div className="section-heading"><div><p className="eyebrow">TODAY&apos;S DOCKET</p><h3>오늘의 사건함</h3></div><button className="text-button" onClick={() => setActiveNav("casefiles")}>전체 사건 보기 <Icon name="arrow" size={15} /></button></div>

              <section className="content-grid">
                <article className="featured-case-card">
                  <div className="card-top"><span className="number-badge">01</span><span className="subject-pill">민법 · 물권</span><button className={`bookmark-button ${isBookmarked ? "saved" : ""}`} aria-label="북마크" onClick={() => setIsBookmarked((value) => !value)}><Icon name="bookmark" size={17} /></button></div>
                  <h4>물권의 본질을 둘러싼<br />첫 공방</h4>
                  <p className="case-question">“공신의 원칙도 물권의 의의에 해당할까요?”</p>
                  <div className="dialogue"><div className="mini-avatar judge">J</div><div><span>판사 김도형</span><p>“핵심은 권리의 <b>성질</b>을<br />정확히 구분하는 것입니다.”</p></div></div>
                  <div className="card-bottom"><span><i className="status-dot" /> 2020년 1차 기출</span><button className="small-arrow" onClick={openCase}><Icon name="arrow" size={16} /></button></div>
                </article>

                <article className="routine-card">
                  <div className="card-top"><span className="eyebrow">YOUR ROUTINE</span><span className="streak-badge">4 DAY STREAK</span></div>
                  <h4>이번 주, 이렇게<br /><em>쌓아가고 있어요.</em></h4>
                  <div className="routine-chart"><div className="chart-lines"><i /><i /><i /><i /></div><div className="bar-set"><span style={{ height: "42%" }} /><span style={{ height: "68%" }} /><span style={{ height: "54%" }} /><span className="today" style={{ height: "88%" }} /><span style={{ height: "64%" }} /><span style={{ height: "28%" }} /><span style={{ height: "18%" }} /></div><div className="chart-labels"><span>월</span><span>화</span><span>수</span><span className="today-label">목</span><span>금</span><span>토</span><span>일</span></div></div>
                  <div className="routine-footer"><span>누적 학습시간</span><strong>06<span>h</span> 24<span>m</span></strong><span className="up-label">↑ 18%</span></div>
                </article>
              </section>

              <section className="bottom-grid">
                <div className="topic-list-card"><div className="section-heading compact"><div><p className="eyebrow">CONCEPT MAP</p><h3>과목별 사건 지도</h3></div><button className="more-button" aria-label="더보기">•••</button></div><div className="topic-list"><div><span className="topic-icon coral">민</span><span><b>민법</b><small>물권 · 계약 · 점유</small></span><strong>72%</strong><i><em style={{ width: "72%" }} /></i></div><div><span className="topic-icon blue">법</span><span><b>부동산관계법규</b><small>도시계획 · 건축</small></span><strong>48%</strong><i><em className="blue-fill" style={{ width: "48%" }} /></i></div><div><span className="topic-icon yellow">실</span><span><b>보상 실무</b><small>협의 · 수용 · 이의</small></span><strong>31%</strong><i><em className="yellow-fill" style={{ width: "31%" }} /></i></div></div></div>
                <div className="next-card"><p className="eyebrow">UP NEXT</p><div className="next-illustration"><div className="next-paper" /><div className="next-pencil" /></div><h4>사건을 읽은 뒤에는<br /><em>5문제 미니퀴즈</em></h4><p>방금 본 개념을 바로 꺼내<br />기억의 자국을 남겨보세요.</p><button className="outline-button" onClick={openCase}>퀴즈 미리보기 <Icon name="arrow" size={15} /></button></div>
              </section>
            </>
          )}

          {activeNav === "casefiles" && <CaseFiles cases={filteredCases} onOpen={openCase} query={query} />}
          {activeNav === "study" && <StudyRoutine onOpen={openCase} />}
          {activeNav === "saved" && <SavedCases isBookmarked={isBookmarked} onOpen={openCase} />}
        </div>
      </section>

      {isCaseOpen && <CaseModal selectedAnswer={selectedAnswer} setSelectedAnswer={setSelectedAnswer} completedCase={completedCase} onClose={() => setIsCaseOpen(false)} onFinish={finishCase} />}
    </main>
  );
}

function CaseFiles({ cases: items, onOpen, query }: { cases: typeof cases; onOpen: () => void; query: string }) {
  return <section className="subpage"><div className="subpage-intro"><div><p className="eyebrow">ARCHIVE · 24 CASES</p><h2>기출은 사건의 형태로<br /><em>다시 만나야 오래 남아요.</em></h2></div><span className="archive-stamp">OPEN<br />ARCHIVE</span></div><div className="filter-row"><button className="filter-chip selected">전체 사건</button><button className="filter-chip">민법</button><button className="filter-chip">부동산관계법규</button><span className="filter-result">{query ? `“${query}” 검색 결과 ${items.length}건` : "최근 추가된 순서"}</span></div><div className="archive-grid">{items.map((item) => <article className={`archive-card ${item.tone}`} key={item.id}><div className="archive-card-top"><span>{item.year} · {item.subject}</span><span className="archive-number">0{item.id}</span></div><div className="archive-graphic"><div className="graphic-sun" /><div className="graphic-file">{item.id === 1 ? "民" : item.id === 2 ? "法" : "判"}</div><div className="graphic-lines" /></div><p className="eyebrow">{item.tag}</p><h3>{item.title}</h3><p>{item.detail}</p><button className="text-button" onClick={onOpen}>사건 열기 <Icon name="arrow" size={15} /></button></article>)}</div></section>;
}

function StudyRoutine({ onOpen }: { onOpen: () => void }) {
  return <section className="subpage"><div className="subpage-intro"><div><p className="eyebrow">A SMALL SYSTEM, EVERY DAY</p><h2>공부는 의지가 아니라<br /><em>다음 장면을 정하는 일.</em></h2></div><div className="routine-ring-large">62<span>%</span></div></div><div className="study-grid"><article className="study-plan-card"><div className="card-top"><span className="subject-pill">오늘의 루틴</span><span className="streak-badge">4 DAY STREAK</span></div><h3>사건 1개 · 개념 1개 · 퀴즈 5개</h3><div className="plan-steps"><div className="done"><span>01</span><p><b>사건으로 진입하기</b><small>법정드라마 1막 읽기</small></p><Icon name="check" size={16} /></div><div><span>02</span><p><b>판결의 근거 찾기</b><small>핵심 개념 3줄 정리</small></p><i>8분</i></div><div><span>03</span><p><b>기억의 흔적 남기기</b><small>미니퀴즈 5문제</small></p><i>5분</i></div></div><button className="primary-button" onClick={onOpen}>오늘 루틴 시작하기 <Icon name="arrow" size={16} /></button></article><article className="principle-card"><p className="eyebrow">ROOM RULE #01</p><div className="principle-mark">“</div><h3>한 번에 많이보다,<br /><em>다시 꺼내기 쉽게.</em></h3><p>각 사건은 ‘상황 → 대화 → 판결 → 퀴즈’ 네 장면으로 쪼개집니다. 완주보다 재생이 쉬운 공부를 만듭니다.</p><div className="principle-line" /></article></div></section>;
}

function SavedCases({ isBookmarked, onOpen }: { isBookmarked: boolean; onOpen: () => void }) {
  return <section className="subpage"><div className="subpage-intro"><div><p className="eyebrow">YOUR PRIVATE SHELF</p><h2>나중에 다시 볼<br /><em>장면들을 모아뒀어요.</em></h2></div><div className="shelf-count"><strong>{isBookmarked ? "04" : "03"}</strong><span>saved scenes</span></div></div><div className="saved-empty"><div className="saved-stack"><span /><span /><span /></div><div><p className="eyebrow">BOOKMARKED CONCEPTS</p><h3>{isBookmarked ? "새 장면이 책장에 들어왔어요." : "아직 표시한 장면이 없어요."}</h3><p>{isBookmarked ? "물권 사건을 복습 서랍에 넣었습니다. 필요할 때 다시 열어보세요." : "사건 카드의 리본 아이콘을 눌러 오늘의 장면을 저장해보세요."}</p><button className="outline-button" onClick={onOpen}>사건 둘러보기 <Icon name="arrow" size={15} /></button></div></div></section>;
}

function CaseModal({ selectedAnswer, setSelectedAnswer, completedCase, onClose, onFinish }: { selectedAnswer: number | null; setSelectedAnswer: (answer: number) => void; completedCase: boolean; onClose: () => void; onFinish: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="case-modal" role="dialog" aria-modal="true" aria-labelledby="case-modal-title"><div className="modal-header"><div><p className="eyebrow">CASE 01 · CIVIL LAW</p><h2 id="case-modal-title">물권의 본질을 둘러싼<br /><em>첫 공방</em></h2></div><button className="modal-close" onClick={onClose} aria-label="닫기"><Icon name="close" size={20} /></button></div><div className="modal-progress"><span style={{ width: selectedAnswer === null ? "32%" : "78%" }} /></div><div className="scene-header"><span>SCENE 02 / 04</span><strong>쟁점. 물권의 의의</strong></div><div className="court-scene"><div className="judge-bubble"><span>판사 김도형</span><p>“다섯 개의 문장 중,<br /><b>물권 자체의 성질</b>이 아닌 것은?”</p></div><div className="modal-figure"><div className="modal-figure-head" /><div className="modal-figure-body" /><div className="modal-figure-desk" /></div><div className="law-book"><span>民法</span><i /></div></div><div className="question-block"><p className="question-label">2020년도 보상관리사 1차시험 · 민법 1번</p><h3>다음 중 물권의 의의에 해당하지 않는 것은?</h3><div className="answer-list">{answers.map((answer, index) => <button key={answer} className={`answer-option ${selectedAnswer === index ? (index === 2 ? "correct" : "wrong") : ""}`} onClick={() => setSelectedAnswer(index)}><span>{index + 1}</span><b>{answer}</b>{selectedAnswer === index && <i>{index === 2 ? "정답" : "다시 생각해봐요"}</i>}</button>)}</div></div>{selectedAnswer !== null && <div className={`feedback ${selectedAnswer === 2 ? "correct" : "wrong"}`}><div className="feedback-icon"><Icon name={selectedAnswer === 2 ? "check" : "close"} size={17} /></div><div><strong>{selectedAnswer === 2 ? "좋아요. 쟁점을 정확히 짚었어요." : "거의 다 왔어요. 권리의 성질을 다시 살펴보세요."}</strong><p>{selectedAnswer === 2 ? "공신의 원칙은 거래의 안전을 위한 원칙이지, 물권의 본질적 의의는 아닙니다." : "직접지배성·우선적 효력·물권적 효력·일물일권주의는 물권의 특징으로 설명됩니다."}</p></div></div>}<div className="modal-footer"><a href="https://drive.google.com/file/d/1Vzi8r4e2wBro7_KJQg64QnrAmef1UW_t/view" target="_blank" rel="noreferrer">원문 기출 PDF 보기 <Icon name="arrow" size={15} /></a><button className="primary-button" disabled={selectedAnswer === null} onClick={onFinish}>{completedCase ? "다음 사건으로" : "판결 기록하기"} <Icon name="arrow" size={16} /></button></div></section></div>;
}
