"""web.src.html의 <!--SVG:n--> 자리에 print.html의 n번째 <svg>를 넣어 index.html을 만든다.

다이어그램을 한곳(print.html)에서만 관리해 웹과 PDF의 내용이 어긋나지 않게 한다.
"""
import re
import sys
from pathlib import Path

here = Path(__file__).resolve().parent
svgs = re.findall(r"<svg\b.*?</svg>", (here / "print.html").read_text(encoding="utf-8"), flags=re.S)
src = (here / "web.src.html").read_text(encoding="utf-8")


def inject(m):
    n = int(m.group(1))
    if not 1 <= n <= len(svgs):
        sys.exit(f"SVG:{n} 없음 (print.html에는 {len(svgs)}개)")
    return svgs[n - 1]


out = re.sub(r"<!--SVG:(\d+)-->", inject, src)
(here / "index.html").write_text(out, encoding="utf-8")
print(f"생성: {here / 'index.html'} (SVG {len(re.findall(r'<!--SVG:', src))}개 삽입)")
