    // ─── Pairwise similarity-judgment demo ───
    (function() {
      // Each trial: an `example` color and two `options`.
      // Hex codes (no '#') correspond to files in assets/color_triplets/<HEX>.png.
      const trials = [
        {
          example: 'C34F74',
          options: ['C94E4B', 'E6A8B7'],
          reveal: "My work shows that people differ in how they think about colors. Not only that, but there's also structure in that variation: people fall into groups based on the choices they make in this task."
        },
        {
          example: '72005E',
          options: ['B8509E', '1C3D61'],
          reveal: "When judging color similarity, people split. To most people, colors of the same hue are more similar, and here they'd choose the light purple. A minority judge color similarity based on lightness, and would choose the dark blue as more similar to the dark purple."
        },
        {
          example: 'F7A75A',
          options: ['F1A78A', 'FBA714'],
          reveal: "In my studies, participants do hundreds of these trials, for nearly 60 colors. I use the judgments to reconstruct each participant's perceptual color space in 3D. For my dissertation, I'm characterizing how people's personal color spaces differ, and whether they predict performance on other behavioral tasks."
        }
      ];

      const SWATCH_DIR = 'assets/color_triplets/';
      const swatchUrl  = (hex) => `${SWATCH_DIR}${hex}.png`;

      const tripletEl    = document.getElementById('triplet');
      const exampleEl    = document.getElementById('exampleSwatch');
      const counterEl    = document.getElementById('tripletCounter');
      const nextBtn      = document.getElementById('tripletNext');
      const resultPanel  = document.getElementById('boundaryResult');
      const resultLabel  = document.getElementById('resultLabel');
      const resultValue  = document.getElementById('resultValue');
      const resultBody   = document.getElementById('resultBody');
      const optionEls    = tripletEl.querySelectorAll('.triplet-options .swatch');

      let current = 0;

      function renderTrial(idx) {
        const t = trials[idx];
        exampleEl.style.backgroundImage = `url('${swatchUrl(t.example)}')`;
        optionEls.forEach((s, i) => {
          s.style.backgroundImage = `url('${swatchUrl(t.options[i])}')`;
          s.classList.remove('selected');
        });
        counterEl.textContent = `trial ${idx + 1} / ${trials.length}`;
        nextBtn.disabled = true;
        resultPanel.classList.remove('shown');
      }

      function handleSelect(swatch) {
        optionEls.forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');

        const letter = ['A', 'B'][parseInt(swatch.dataset.idx, 10)];
        resultLabel.textContent = `your choice — trial ${current + 1}`;
        resultValue.textContent = `You picked option ${letter} as the closer match.`;
        resultBody.textContent = trials[current].reveal;
        resultPanel.classList.add('shown');

        if (current < trials.length - 1) {
          nextBtn.disabled = false;
          nextBtn.textContent = 'try another →';
        } else {
          nextBtn.disabled = true;
          nextBtn.textContent = '— end of demo —';
        }
      }

      tripletEl.addEventListener('click', (e) => {
        const sw = e.target.closest('.triplet-options .swatch');
        if (sw) handleSelect(sw);
      });

      nextBtn.addEventListener('click', () => {
        if (current < trials.length - 1) {
          current++;
          renderTrial(current);
        }
      });

      renderTrial(0);
    })();

    // ─── Scroll reveals ───
    (function() {
      if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
        return;
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      document.querySelectorAll('.reveal').forEach(el => io.observe(el));

      // Reveal-on-scroll for sections not explicitly marked
      document.querySelectorAll('.section-head, .area, .resume-block, .resume-job, .pub, .contact-link, .contact-headline, .contact-aside')
        .forEach((el, i) => {
          el.classList.add('reveal');
          if (i % 4) el.classList.add('reveal-delay-' + (i % 4));
          io.observe(el);
        });
    })();

    // ─── 70s retro rainbow ribbon (canvas) ───
    (function() {
      const SVG_NS = 'http://www.w3.org/2000/svg';
      // Warm-to-cool rainbow stripes — each color is one parallel band running the full ribbon length
      const PALETTE = [
        '#cca573',  // yellow
        '#d78c6c',  // orange
        '#d16c77',  // pink-red
        '#a45b84',  // red-purple
        '#724a7d'   // purple
      ];
      const STRIPE_WIDTH = 12;     // px per stripe
      const STRIPE_COUNT = PALETTE.length;
      const STEP = 4;              // sample density along path; smaller = smoother curves
      const CORNER_RADIUS = 60;    // rounding radius at each corner

      const main = document.querySelector('main');
      const canvas = main && main.querySelector('canvas.ribbon');
      if (!main || !canvas) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const ctx = canvas.getContext('2d');

      // Reusable hidden SVG path for arc-length measurement (off-screen but in the DOM)
      const measureSvg = document.createElementNS(SVG_NS, 'svg');
      measureSvg.setAttribute('width', '0');
      measureSvg.setAttribute('height', '0');
      measureSvg.style.position = 'absolute';
      measureSvg.style.left = '-9999px';
      measureSvg.style.pointerEvents = 'none';
      const measurePath = document.createElementNS(SVG_NS, 'path');
      measureSvg.appendChild(measurePath);
      document.body.appendChild(measureSvg);

      function buildPath(points, radius) {
        if (points.length < 2) return '';
        const f = (n) => n.toFixed(2);
        const parts = [`M${f(points[0].x)},${f(points[0].y)}`];
        for (let i = 1; i < points.length - 1; i++) {
          const prev = points[i - 1], curr = points[i], next = points[i + 1];
          const inDx = prev.x - curr.x, inDy = prev.y - curr.y;
          const outDx = next.x - curr.x, outDy = next.y - curr.y;
          const inLen = Math.hypot(inDx, inDy) || 1;
          const outLen = Math.hypot(outDx, outDy) || 1;
          const r = Math.min(radius, inLen / 2, outLen / 2);
          const ax = curr.x + (inDx / inLen) * r;
          const ay = curr.y + (inDy / inLen) * r;
          const ex = curr.x + (outDx / outLen) * r;
          const ey = curr.y + (outDy / outLen) * r;
          parts.push(`L${f(ax)},${f(ay)}`);
          parts.push(`Q${f(curr.x)},${f(curr.y)} ${f(ex)},${f(ey)}`);
        }
        const last = points[points.length - 1];
        parts.push(`L${f(last.x)},${f(last.y)}`);
        return parts.join(' ');
      }

      function build() {
        const sections = main.querySelectorAll('section');
        if (sections.length < 2) return;

        const W = main.offsetWidth;
        const H = main.offsetHeight;
        // DPR pinned to 1: a tall (~5000px+) page at DPR 2 is a 100+ MB canvas
        // buffer that kills load. Strokes are anti-aliased so 1× still looks smooth.
        const dpr = 1;
        canvas.width  = Math.max(1, Math.round(W * dpr));
        canvas.height = Math.max(1, Math.round(H * dpr));
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);

        const sectionTops = Array.from(sections).map(s => s.offsetTop);
        const INSET = Math.max(18, Math.min(W * 0.025, 50));
        const rightX = W - INSET;
        const leftX  = INSET;

        // Snake corner-points
        const pts = [];
        let cx0 = rightX;
        pts.push({ x: cx0, y: 0 });
        for (let i = 1; i < sectionTops.length; i++) {
          pts.push({ x: cx0, y: sectionTops[i] });
          cx0 = (cx0 === rightX) ? leftX : rightX;
          pts.push({ x: cx0, y: sectionTops[i] });
        }
        pts.push({ x: cx0, y: H });

        measurePath.setAttribute('d', buildPath(pts, CORNER_RADIUS));
        const totalLength = measurePath.getTotalLength();

        // Sample along the path; for each stripe, accumulate its perpendicular-offset center points
        const halfStripes = (STRIPE_COUNT - 1) / 2;
        const stripePoints = Array.from({ length: STRIPE_COUNT }, () => []);

        for (let dist = 0; dist <= totalLength; dist += STEP) {
          const p  = measurePath.getPointAtLength(dist);
          const p2 = measurePath.getPointAtLength(Math.min(dist + 0.5, totalLength));
          const dx = p2.x - p.x, dy = p2.y - p.y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len, ny = dx / len; // perpendicular unit vector

          for (let i = 0; i < STRIPE_COUNT; i++) {
            const off = (i - halfStripes) * STRIPE_WIDTH;
            stripePoints[i].push(p.x + nx * off, p.y + ny * off);
          }
        }

        // +1 lineWidth so adjacent stripes overlap by 1px — avoids hairline gaps from antialiasing
        ctx.lineWidth = STRIPE_WIDTH + 1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 0; i < STRIPE_COUNT; i++) {
          const flat = stripePoints[i];
          if (flat.length < 4) continue;
          ctx.strokeStyle = PALETTE[i];
          ctx.beginPath();
          ctx.moveTo(flat[0], flat[1]);
          for (let j = 2; j < flat.length; j += 2) {
            ctx.lineTo(flat[j], flat[j + 1]);
          }
          ctx.stroke();
        }
      }

      let rafToken = null;
      function scheduleBuild() {
        if (rafToken) cancelAnimationFrame(rafToken);
        rafToken = requestAnimationFrame(build);
      }

      // Defer the first paint until the browser is idle, so the page becomes
      // interactive before the ribbon draws.
      const kick = () => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(build, { timeout: 500 });
        } else {
          setTimeout(build, 50);
        }
      };

      kick();
      // Rebuild after images/fonts load (page height shifts)
      window.addEventListener('load', () => setTimeout(build, 100));
      // Debounced resize
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(scheduleBuild, 200);
      });
    })();
