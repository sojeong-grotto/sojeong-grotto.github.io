# 김소정 포트폴리오

https://sojeong-grotto.github.io/ 에 GitHub Pages로 배포하는 정적 포트폴리오입니다. 빌드 과정이 없는 HTML/CSS/JS로 되어 있습니다.

- `index.html` — 7페이지 (프로필 1 + 프로젝트별 최대 2페이지)
- `assets/style.css` — 화면에서는 A4 가로 용지 형태로, 좁은 화면에서는 한 줄 레이아웃으로 표시하고, 인쇄하면 A4 한 장에 한 페이지씩 나옵니다
- `assets/main.js` — 화면 크기 맞춤, STM32 기울기 시뮬레이터
- `assets/img/` — 프로젝트 이미지

## 수정할 곳

프로필·경력·연락처는 `index.html` 첫 번째 `<section>`에 있습니다.


## GitHub Pages 배포

1. GitHub에서 새 저장소를 만듭니다. 저장소 이름을 `<아이디>.github.io`로 하면 주소가 `https://<아이디>.github.io/`가 됩니다.
2. 이 폴더에서 아래 명령을 실행합니다.

   ```bash
   git init -b main
   git add .
   git commit -m "Add portfolio"
   git remote add origin https://github.com/<아이디>/<저장소>.git
   git push -u origin main
   ```

3. 저장소의 **Settings → Pages**에서 Source를 `Deploy from a branch`, Branch를 `main` / `(root)`로 설정합니다.

## PDF 만들기

브라우저에서 페이지를 연 뒤 오른쪽 위 **PDF 저장**을 누르거나 인쇄(Ctrl+P)를 사용합니다.
설정은 대상 `PDF로 저장`, 여백 `없음`, `배경 그래픽` 켜기로 합니다.

명령줄로 만들 수도 있습니다.

```bash
python3 -m http.server 8765 &
google-chrome --headless=new --no-pdf-header-footer --virtual-time-budget=6000 \
  --print-to-pdf=portfolio.pdf http://localhost:8765/
```
