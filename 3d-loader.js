/* ==========================================================================
   LOADING ANIMATION & DEVICE STAGE PARALLAX
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Loader Animation
  const loaderScreen = document.getElementById('loaderScreen');
  const loaderPercent = document.getElementById('loaderPercent');
  const loaderBar = document.getElementById('loaderBar');
  const body = document.body;

  let percent = 0;

  const interval = setInterval(() => {
    const increment = Math.floor(Math.random() * 8) + 1;
    percent += increment;

    if (percent >= 100) {
      percent = 100;
      clearInterval(interval);

      loaderPercent.textContent = percent;
      loaderBar.style.width = percent + '%';

      setTimeout(() => {
        loaderScreen.classList.add('hidden');
        body.classList.remove('loading');
        introAnimation();
      }, 500);
    } else {
      loaderPercent.textContent = percent;
      loaderBar.style.width = percent + '%';
    }
  }, 30);

  // 2. Subtle Mouse Parallax on Device Stage
  // We tilt the entire device-stage slightly — safe because perspective is
  // embedded in the element itself, so there is zero camera-clipping risk.
  const stage = document.getElementById('deviceStage');
  let targetTiltX = 4;   // resting rotateX in degrees (matches CSS default)
  let targetTiltY = 0;
  let currentTiltX = 4;
  let currentTiltY = 0;
  let parallaxActive = false;

  document.addEventListener('mousemove', (e) => {
    if (!parallaxActive) return;

    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;

    // Normalize: -1 to +1
    const nx = (e.clientX - cx) / cx;
    const ny = (e.clientY - cy) / cy;

    // Very gentle — max ±4deg Y, ±2deg X around the resting 4deg tilt
    targetTiltY = nx * 4;
    targetTiltX = 4 + (-ny * 2);
  });

  function rafParallax() {
    if (parallaxActive) {
      currentTiltX += (targetTiltX - currentTiltX) * 0.06;
      currentTiltY += (targetTiltY - currentTiltY) * 0.06;

      if (stage) {
        stage.style.transform =
          `perspective(1800px) rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg)`;
      }
    }
    requestAnimationFrame(rafParallax);
  }
  rafParallax();

  // 3. Intro Animation — fade-in + settle from below
  function introAnimation() {
    if (!stage) return;

    // Start from slightly below & smaller
    stage.style.transition = 'none';
    stage.style.transform   = 'perspective(1800px) rotateX(8deg) rotateY(0deg) translateY(30px) scale(0.94)';
    stage.style.opacity     = '0';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        stage.style.transition = 'transform 1.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.2s ease';
        stage.style.transform   = 'perspective(1800px) rotateX(4deg) rotateY(0deg) translateY(0px) scale(1)';
        stage.style.opacity     = '1';

        setTimeout(() => {
          stage.style.transition = '';
          parallaxActive = true;
          currentTiltX = 4;
          currentTiltY = 0;
        }, 1800);
      });
    });
  }
});

