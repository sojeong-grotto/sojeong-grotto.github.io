# 김소정 · 로봇 SW 포트폴리오

https://sojeong-grotto.github.io

| 파일 | 역할 |
|---|---|
| `web.src.html` + `web.css` | 웹 포트폴리오 원본 (상단 메뉴, 섹션 스크롤, 모바일 반응형) |
| `index.html` | 생성 파일. `web.src.html`에 `print.html`의 SVG 다이어그램을 넣어 만듦 — 직접 수정하지 않음 |
| `print.html` + `style.css` | A4 12장 인쇄용 원본, PDF 생성에 사용 |
| `김소정_로봇SW_포트폴리오.pdf` | 생성 파일 |

- `./build.sh` : `index.html`과 PDF를 함께 생성합니다 (Python 3, Google Chrome 필요).
- `./build.sh check` : PDF 각 페이지의 내용 높이를 출력하고, 넘친 페이지에 `OVER`를 표시합니다.
- 다이어그램은 `print.html`에서만 고치면 웹과 PDF에 함께 반영됩니다.

## PDF 구성

| 쪽 | 내용 |
|---|---|
| 01 | 표지 · 대표 성과 · 바로 기여 / 넓혀 가는 중 · 경력·교육 |
| 02 | 소개 · 핵심 역량 4가지 · 기술 스택 |
| 03 | 프로젝트 한눈에 |
| 04–05 | P1 다중 로봇 물류 FMS (협업 사례 포함) |
| 06–07 | P2 STM32 RC카 |
| 08–09 | P3 AutoStore PLC |
| 10–11 | P4 그룹사 통합 메신저 (실무) |
| 12 | 마무리 · 연락처 |

글꼴: Pretendard (SIL OFL 1.1), `fonts/`에 포함.
