# 보상관리사 기출학습

법정드라마형 사건 흐름과 Google Drive 시각 자료를 연결한 보상관리사 학습 사이트입니다.

## GitHub Pages

이 저장소는 `main`에 push되면 `.github/workflows/deploy-pages.yml`이 정적 사이트를 빌드합니다.

저장소 관리자라면 최초 1회 다음 설정을 켜야 합니다.

1. GitHub 저장소의 **Settings → Pages**로 이동
2. **Build and deployment → Source**를 **GitHub Actions**로 선택
3. `main`에 push된 `Deploy compensation exam to GitHub Pages` workflow 확인

예상 주소:

`https://gaja-trip.github.io/compensation-exam/`

## 로컬 실행

```bash
npm install
npm run dev
```

Drive 자료는 `app/drive-data.ts`에 문제·개념별로 매칭되어 있으며, 원본 이미지는 연결된 Google Drive 폴더에서 불러옵니다.
