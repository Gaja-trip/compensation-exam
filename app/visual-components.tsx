"use client";

import { useState } from "react";
import { driveFolderUrl, visualLessons, type DriveImage, type VisualLesson } from "./drive-data";

function Arrow() {
  return <span className="visual-arrow" aria-hidden="true">→</span>;
}

function DriveImageFrame({ image, className = "" }: { image: DriveImage; className?: string }) {
  return (
    <a className={`drive-image-frame ${className}`} href={image.driveUrl} target="_blank" rel="noreferrer">
      <img src={image.thumbnail} alt={image.sceneLabel} loading="lazy" referrerPolicy="no-referrer" />
      <span className="drive-image-label">{image.sceneLabel}</span>
    </a>
  );
}

export function VisualCasebook({ onOpen }: { onOpen: (lesson: VisualLesson) => void }) {
  const [activeId, setActiveId] = useState("all");
  const filtered = activeId === "all" ? visualLessons : visualLessons.filter((lesson) => lesson.id === activeId);

  return (
    <section className="visual-casebook subpage">
      <div className="subpage-intro visual-intro">
        <div>
          <p className="eyebrow">DRIVE VISUAL CASEBOOK · 41 SCENES</p>
          <h2>문제를 읽은 다음,<br /><em>장면으로 다시 기억해요.</em></h2>
          <p className="visual-intro-copy">Google Drive의 민법 이미지 41장을 기출 쟁점별로 묶었습니다. 문제를 고르면 관련 장면, 법조문, 시험용 정리가 한 흐름으로 열립니다.</p>
        </div>
        <a className="drive-folder-link" href={driveFolderUrl} target="_blank" rel="noreferrer">Drive 원본 폴더 <Arrow /></a>
      </div>

      <div className="visual-filter-row" aria-label="시각 해설 주제 필터">
        <button className={activeId === "all" ? "active" : ""} onClick={() => setActiveId("all")}>전체 해설</button>
        {visualLessons.map((lesson) => <button key={lesson.id} className={activeId === lesson.id ? "active" : ""} onClick={() => setActiveId(lesson.id)}>{lesson.shortTitle}</button>)}
      </div>

      <div className="visual-lesson-grid">
        {filtered.map((lesson) => (
          <article className={`visual-lesson-card ${lesson.tone}`} key={lesson.id}>
            <div className="visual-card-top"><span>{lesson.questionLabel}</span><strong>{String(lesson.images.length).padStart(2, "0")} SCENES</strong></div>
            <div className="visual-card-collage">
              {lesson.images.slice(0, 3).map((image, index) => <DriveImageFrame key={image.id} image={image} className={`collage-image collage-${index + 1}`} />)}
              <span className="collage-stamp">CASE<br />VISUAL</span>
            </div>
            <p className="eyebrow">{lesson.subject}</p>
            <h3>{lesson.title}</h3>
            <p className="visual-card-summary">{lesson.summary}</p>
            <div className="visual-card-footer"><span>{lesson.statute}</span><button onClick={() => onOpen(lesson)}>해설서 열기 <Arrow /></button></div>
          </article>
        ))}
      </div>

      <div className="visual-source-note"><span className="source-mark">↗</span><p><b>이미지 출처</b> 사용자가 연결한 Google Drive 폴더의 원본 이미지입니다. 이미지가 보이지 않으면 각 장면을 눌러 Drive 원본 권한을 확인하세요.</p><a href={driveFolderUrl} target="_blank" rel="noreferrer">폴더 열기 <Arrow /></a></div>
    </section>
  );
}

export function VisualLessonModal({ lesson, onClose }: { lesson: VisualLesson; onClose: () => void }) {
  const [activeScene, setActiveScene] = useState(0);
  const scene = lesson.images[activeScene];

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={`lesson-modal ${lesson.tone}`} role="dialog" aria-modal="true" aria-labelledby="visual-lesson-title">
        <div className="lesson-modal-header"><div><p className="eyebrow">VISUAL EXPLANATION · {lesson.questionLabel}</p><h2 id="visual-lesson-title">{lesson.title}</h2></div><button className="modal-close" onClick={onClose} aria-label="닫기">×</button></div>
        <div className="lesson-progress"><span style={{ width: `${((activeScene + 1) / lesson.images.length) * 100}%` }} /></div>
        <div className="lesson-main-grid">
          <div className="lesson-stage"><DriveImageFrame image={scene} className="lesson-stage-image" /><div className="lesson-stage-count">SCENE {String(activeScene + 1).padStart(2, "0")} / {String(lesson.images.length).padStart(2, "0")}</div></div>
          <div className="lesson-explanation"><span className="lesson-kicker">{lesson.statute}</span><h3>이 장면에서<br /><em>기억할 한 문장</em></h3><p>{lesson.answer}</p><div className="lesson-question-box"><span>문제와 연결</span><strong>{lesson.questionLabel}</strong><p>{lesson.summary}</p></div><a className="source-link" href={lesson.sourceUrl} target="_blank" rel="noreferrer">기출 원문 PDF 보기 <Arrow /></a></div>
        </div>
        <div className="scene-strip" aria-label="해설 장면 목록">{lesson.images.map((image, index) => <button key={image.id} className={activeScene === index ? "active" : ""} onClick={() => setActiveScene(index)}><img src={image.thumbnail} alt="" loading="lazy" referrerPolicy="no-referrer" /><span>{String(index + 1).padStart(2, "0")}</span></button>)}</div>
        <div className="lesson-modal-footer"><span>장면을 클릭하면 Drive 원본으로 이동합니다.</span><button className="primary-button" onClick={onClose}>해설서 닫기 <Arrow /></button></div>
      </section>
    </div>
  );
}

