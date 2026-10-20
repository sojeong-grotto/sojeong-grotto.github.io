"""web.src.html의 <!--SVG:이름--> 자리에 print.html에서 data-name="이름"인 <svg>를 넣어 index.html을 만든다.

다이어그램을 한곳(print.html)에서만 관리해 웹과 PDF의 내용이 어긋나지 않게 한다.
PDF에는 싣지 않고 웹에서만 쓰는 다이어그램은 print.html 끝의 <div class="web-only" hidden>에 둔다.
web.css 주소에는 파일 내용의 해시를 붙여, CSS가 바뀌면 브라우저 캐시 대신 새 파일을 받게 한다.
"""
import hashlib
import re
import sys
from pathlib import Path

here = Path(__file__).resolve().parent
print_html = (here / "print.html").read_text(encoding="utf-8")
svgs = {
    m.group(1): m.group(0)
    for m in re.finditer(r'<svg\b[^>]*\bdata-name="([\w-]+)"[^>]*>.*?</svg>', print_html, flags=re.S)
}
src = (here / "web.src.html").read_text(encoding="utf-8")


def inject(m):
    name = m.group(1)
    if name not in svgs:
        sys.exit(f"SVG:{name} 없음 (print.html에 있는 이름: {', '.join(sorted(svgs))})")
    return svgs[name]


out = re.sub(r"<!--SVG:([\w-]+)-->", inject, src)
css_ver = hashlib.sha1((here / "web.css").read_bytes()).hexdigest()[:8]
out = out.replace('href="web.css"', f'href="web.css?v={css_ver}"')
(here / "index.html").write_text(out, encoding="utf-8")
print(f"생성: {here / 'index.html'} (SVG {len(re.findall(r'<!--SVG:', src))}개 삽입)")
