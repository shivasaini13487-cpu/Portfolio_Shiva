document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('lock');

      /* ---------- LOADER ---------- */
      window.addEventListener('load', () => {
        setTimeout(() => {
          const loader = document.getElementById('loader');
          loader.classList.add('hide');
          document.body.classList.remove('lock');
        }, 500);
      });
      // Fallback in case 'load' already fired
      setTimeout(() => {
        document.getElementById('loader').classList.add('hide');
        document.body.classList.remove('lock');
      }, 2500);

      /* ---------- CUSTOM CURSOR ---------- */
      const isFinePointer = window.matchMedia('(pointer:fine)').matches;
      if (isFinePointer) {
        document.body.classList.add('has-cursor');
        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let rx = mx, ry = my;
        window.addEventListener('mousemove', e => {
          mx = e.clientX; my = e.clientY;
          dot.style.left = mx + 'px';
          dot.style.top = my + 'px';
        });
        function animateRing() {
          rx += (mx - rx) * 0.16;
          ry += (my - ry) * 0.16;
          ring.style.left = rx + 'px';
          ring.style.top = ry + 'px';
          requestAnimationFrame(animateRing);
        }
        animateRing();
        document.querySelectorAll('a, button, .project-card, .edu-card, .btn').forEach(el => {
          el.addEventListener('mouseenter', () => ring.classList.add('hover'));
          el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
        });
      } else {
        document.getElementById('cursor-dot').style.display = 'none';
        document.getElementById('cursor-ring').style.display = 'none';
      }

      /* ---------- PARTICLE NETWORK ---------- */
      const canvas = document.getElementById('particle-canvas');
      const ctx = canvas.getContext('2d');
      let w, h, particles;
      const PARTICLE_COUNT_BASE = 90;

      function resizeCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      }
      function initParticles() {
        const count = Math.min(PARTICLE_COUNT_BASE, Math.floor(w / 14));
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6
        }));
      }
      resizeCanvas();
      initParticles();
      window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

      const accentColor = '71,215,196';
      const linkColor = '108,124,255';

      function tick() {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + accentColor + ',0.55)';
          ctx.fill();
        }
        const maxDist = 130;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i], b = particles[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = 'rgba(' + linkColor + ',' + (0.14 * (1 - dist / maxDist)) + ')';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(tick);
      }
      tick();

      /* ---------- SCROLL REVEAL ---------- */
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      document.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.transitionDelay = (i % 6) * 0.06 + 's';
        revealObserver.observe(el);
      });

      /* ---------- SKILL BARS ---------- */
      const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            fill.style.width = fill.dataset.level + '%';
            skillObserver.unobserve(fill);
          }
        });
      }, { threshold: 0.4 });
      document.querySelectorAll('.skill-bar-fill').forEach(el => skillObserver.observe(el));

      /* ---------- MARQUEE CONTENT ---------- */
      const marqueeItems = [
        'PrernaGati and Technology — Flutter Training',
        'Solitaire Infosystem Pvt. Ltd. — Web Designing',
        'OOPs in Java',
        'Web Designing',
        'Introduction to Android Studio',
        'Introduction to MS Excel',
        'Introduction to Flutter — DataFlair',
        'Generative AI for All',
        'Software Product Developer'
      ];
      const track = document.getElementById('marquee-track');
      function buildBadge(text) {
        const span = document.createElement('span');
        span.className = 'badge';
        span.innerHTML = text;
        return span;
      }
      // duplicate list twice for seamless -50% loop
      [...marqueeItems, ...marqueeItems].forEach(t => track.appendChild(buildBadge(t)));
    });