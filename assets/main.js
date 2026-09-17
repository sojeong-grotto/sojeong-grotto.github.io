/* ---------- fit A4 sheets to the viewport ---------- */
(function () {
  const SHEET_W = 1123;
  const FLOW_BREAK = 880;

  function fit() {
    const w = document.documentElement.clientWidth;
    const flow = w < FLOW_BREAK;
    document.body.classList.toggle('flow', flow);
    const z = flow ? 1 : Math.min(1.2, (w - 48) / SHEET_W);
    document.documentElement.style.setProperty('--z', z.toFixed(4));
  }
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('beforeprint', () => document.body.classList.remove('flow'));
  window.addEventListener('afterprint', fit);
})();

/* ---------- STM32 tilt → state simulator (same math as firmware) ---------- */
(function () {
  const LCD_W = 320, LCD_H = 240, FACE = 160;
  const IN_MAX = 60, DEADZONE = 6, STATE_MARGIN = 12;
  const CENTER_X = (LCD_W - FACE) / 2;

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  function ease(accel) {
    let v = clamp(accel, -IN_MAX, IN_MAX);
    if (Math.abs(v) < DEADZONE) v = 0;
    const n = clamp(v / IN_MAX, -1, 1);
    return { n, e: n * n * n };
  }
  const toScreen = (accel, span) => Math.trunc(((ease(accel).e + 1) * 0.5) * span + 0.5);
  function stateOf(x) {
    if (x > CENTER_X + STATE_MARGIN) return 'RIGHT';
    if (x < CENTER_X - STATE_MARGIN) return 'LEFT';
    return 'CENTER';
  }

  const $ = (id) => document.getElementById(id);
  const ax = $('ax'), ay = $('ay'), lcd = $('lcd'), face = $('face');
  if (!ax || !lcd) return;

  const imgs = { LEFT: 'assets/img/face_left.png', CENTER: 'assets/img/face_center.png', RIGHT: 'assets/img/face_right.png' };
  Object.values(imgs).forEach((src) => { const i = new Image(); i.src = src; });

  let prevX = CENTER_X, prevY = (LCD_H - FACE) / 2, curState = 'CENTER';

  function render() {
    const axv = +ax.value, ayv = +ay.value;
    const x = toScreen(axv, LCD_W - FACE);
    const y = toScreen(ayv, LCD_H - FACE);
    const { n, e } = ease(axv);

    $('axv').textContent = axv;
    $('ayv').textContent = ayv;
    $('rn').textContent = n.toFixed(2);
    $('re').textContent = e.toFixed(3);
    $('rxy').textContent = x + ', ' + y;

    // firmware redraws only when the position moves by 2px or more
    if (Math.abs(x - prevX) > 1 || Math.abs(y - prevY) > 1) {
      curState = stateOf(x);
      prevX = x; prevY = y;
    }
    $('rs').textContent = curState;

    const scale = lcd.clientWidth / LCD_W;
    face.style.width = face.style.height = FACE * scale + 'px';
    face.style.left = prevX * scale + 'px';
    face.style.top = prevY * scale + 'px';
    if (!face.src.endsWith(imgs[curState])) face.src = imgs[curState];

    drawMarker(axv, x);
  }

  /* mapping curve: accel_x (-70..70) → target_x (0..160) */
  const svg = $('curve');
  const W = 470, H = 170, L = 34, R = 10, T = 10, B = 26;
  const px = (a) => L + ((a + 70) / 140) * (W - L - R);
  const py = (t) => T + (1 - t / 160) * (H - T - B);
  const NS = 'http://www.w3.org/2000/svg';
  let marker;

  function el(tag, attrs, text) {
    const node = document.createElementNS(NS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (text != null) node.textContent = text;
    svg.appendChild(node);
    return node;
  }

  function drawCurve() {
    // state bands
    el('rect', { x: L, y: py(160), width: W - L - R, height: py(92) - py(160), fill: '#F8EBE5' });
    el('rect', { x: L, y: py(68), width: W - L - R, height: py(0) - py(68), fill: '#F8EBE5' });
    el('rect', { x: px(-DEADZONE), y: T, width: px(DEADZONE) - px(-DEADZONE), height: H - T - B, fill: '#E3F2EC' });
    // axes
    el('line', { x1: L, y1: H - B, x2: W - R, y2: H - B, stroke: '#C9C4BA' });
    el('line', { x1: L, y1: T, x2: L, y2: H - B, stroke: '#C9C4BA' });
    [-60, -30, 0, 30, 60].forEach((a) => el('text', { x: px(a), y: H - B + 13, 'text-anchor': 'middle', 'font-size': 9.5, fill: '#7A817D' }, a));
    [0, 68, 92, 160].forEach((t) => {
      el('text', { x: L - 5, y: py(t) + 3, 'text-anchor': 'end', 'font-size': 9.5, fill: '#7A817D' }, t);
      if (t === 68 || t === 92) el('line', { x1: L, y1: py(t), x2: W - R, y2: py(t), stroke: '#9A3F1F', 'stroke-dasharray': '3 3', 'stroke-width': 1 });
    });
    el('text', { x: W - R, y: H - 2, 'text-anchor': 'end', 'font-size': 9.5, fill: '#454D49' }, 'accel_x (raw)');
    el('text', { x: L + 4, y: T + 9, 'font-size': 9.5, fill: '#454D49' }, 'target_x (px)');
    el('text', { x: W - R - 4, y: py(126) + 3, 'text-anchor': 'end', 'font-size': 10, 'font-weight': 700, fill: '#9A3F1F' }, 'RIGHT');
    el('text', { x: W - R - 4, y: py(34) + 3, 'text-anchor': 'end', 'font-size': 10, 'font-weight': 700, fill: '#9A3F1F' }, 'LEFT');
    el('text', { x: px(0), y: py(0) - 4, 'text-anchor': 'middle', 'font-size': 9, fill: '#0D6A52' }, 'deadzone');
    // curve
    let d = '';
    for (let a = -70; a <= 70; a += 0.5) d += (d ? 'L' : 'M') + px(a).toFixed(1) + ' ' + py(toScreen(a, 160)).toFixed(1);
    el('path', { d, fill: 'none', stroke: '#0D6A52', 'stroke-width': 2 });
    marker = el('circle', { r: 4.5, fill: '#9A3F1F', stroke: '#fff', 'stroke-width': 1.5 });
  }

  function drawMarker(a, x) {
    if (!marker) return;
    marker.setAttribute('cx', px(a));
    marker.setAttribute('cy', py(x));
  }

  if (svg) drawCurve();
  ax.addEventListener('input', render);
  ay.addEventListener('input', render);
  window.addEventListener('resize', render);

  // start tilted slightly so the static/printed page shows a non-trivial state
  ax.value = 38; ay.value = -10;
  render();
})();
