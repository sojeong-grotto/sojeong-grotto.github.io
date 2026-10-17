# 김소정 · 로봇 SW 포트폴리오

웹 버전(GitHub Pages)과 A4 PDF를 같은 `index.html` 하나로 만듭니다.

- 웹: 화면 폭이 820px 이하이면 한 단 레이아웃으로 바뀝니다 (모바일).
- PDF: `./build.sh`를 실행하면 Chrome headless로 `김소정_로봇SW_포트폴리오.pdf`(A4 13장)를 만듭니다.
- 점검: `./build.sh check`는 각 페이지의 내용 높이를 출력하고, 넘친 페이지에 `OVER`를 표시합니다.

## GitHub Pages 배포

1. GitHub에 `<아이디>.github.io` 저장소를 만듭니다.
2. 이 `site/` 폴더의 내용(`index.html`, `style.css`, `assets/`, `fonts/`, PDF)을 저장소 루트에 올립니다.
3. Settings → Pages에서 `main` 브랜치 루트를 배포 대상으로 고릅니다.

## 구성

| 쪽 | 내용 |
|---|---|
| 01 | 표지 · 대표 성과 · 직무 키워드 · 대표 프로젝트 |
| 02 | 자기소개 · 경력/교육 타임라인 · 지원 분야 |
| 03 | 핵심 역량 4가지 · 기술 스택 |
| 04 | 프로젝트 한눈에 · 역량×프로젝트 |
| 05–06 | P1 다중 로봇 물류 FMS |
| 07–08 | P2 STM32 RC카 |
| 09–10 | P3 AutoStore PLC |
| 11–12 | P4 그룹사 통합 메신저 (실무) |
| 13 | 마무리 · 연락처 |

글꼴: Pretendard (SIL OFL 1.1), `fonts/`에 포함.
