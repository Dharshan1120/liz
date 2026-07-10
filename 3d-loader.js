/* ==========================================================================
   LOADING ANIMATION + TRUE WebGL 3D HERO SCENE (Three.js r134)
   ========================================================================== */

/* ── LOADER ─────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const loaderScreen  = document.getElementById('loaderScreen');
  const loaderPercent = document.getElementById('loaderPercent');
  const loaderBar     = document.getElementById('loaderBar');
  const body          = document.body;
  let percent = 0;

  const interval = setInterval(() => {
    const increment = Math.floor(Math.random() * 4) + 1;
    percent = Math.min(percent + increment, 100);
    loaderPercent.textContent = percent;
    loaderBar.style.width = percent + '%';

    if (percent >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loaderScreen.classList.add('hidden');
        body.classList.remove('loading');
        initThreeScene();
      }, 600);
    }
  }, 75);
});

/* ── THREE.JS SCENE ─────────────────────────────────────────────────────── */
function initThreeScene() {
  if (typeof THREE === 'undefined') { console.error('Three.js not loaded'); return; }

  const container = document.getElementById('three-hero-canvas');
  if (!container) return;

  /* ── RENDERER ── */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.6;
  container.appendChild(renderer.domElement);

  /* ── SCENE & FOG ── */
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020209, 0.022);
  const stage = new THREE.Group();
  scene.add(stage);
  
  let phoneGroup, tabletGroup, hpGroup;

  /* ── CAMERA ── */
  const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
  const cameraTarget = new THREE.Vector3(0, 0.55, 0);
  const cameraBase = new THREE.Vector3();

  function frameScene() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    const aspect = w / Math.max(h, 1);
    const isMobile = w < 768;
    const isShort = h < 720;

    camera.aspect = aspect;
    camera.fov = isMobile ? 45 : 42;
    cameraBase.set(
      0,
      isMobile ? 1.45 : 2.25,
      isMobile ? 4.15 : (isShort ? 6.15 : 5.75)
    );
    camera.position.copy(cameraBase);
    cameraTarget.set(0, isMobile ? 0.52 : 0.62, 0);
    camera.updateProjectionMatrix();

    const scale = isMobile ? Math.min(Math.max(w / 390, 0.95), 1.08) : (isShort ? 0.9 : 0.96);
    stage.scale.setScalar(scale);
    stage.position.set(0, isMobile ? -0.15 : -0.24, isMobile ? -0.2 : -0.15);

    // On mobile: hide phone & tablet, keep only laptop + headphones
    if (phoneGroup && tabletGroup && hpGroup) {
      if (isMobile) {
        phoneGroup.visible = false;
        tabletGroup.visible = false;
      } else {
        phoneGroup.visible = true;
        tabletGroup.visible = true;
        phoneGroup.position.set(-2.18, 1.26, 0.18);
        tabletGroup.position.set(2.2, 1.56, 0.08);
        hpGroup.position.set(2.35, 0.61, 1.1);
      }
    }
  }

  frameScene();
  camera.lookAt(cameraTarget);

  /* ── MATERIALS ── */
  const matAluminium = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.9, roughness: 0.15 });
  const matFrameEdge = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.95, roughness: 0.1 });
  const matGlass     = new THREE.MeshStandardMaterial({ color: 0x060610, metalness: 0.1, roughness: 0.05, envMapIntensity: 1 });
  const matDesk      = new THREE.MeshStandardMaterial({ color: 0x111114, metalness: 0.3, roughness: 0.6 });
  const matHPBand    = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, metalness: 0.8, roughness: 0.2 });
  const matHPCup     = new THREE.MeshStandardMaterial({ color: 0x141414, metalness: 0.85, roughness: 0.15 });

  /* ── CANVAS TEXTURE HELPERS ── */
  function makeScreenTexture(drawFn, w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    drawFn(ctx, w, h);
    return new THREE.CanvasTexture(c);
  }

  /* Laptop Screen – LIZ Portfolio Hero (interactive) */
  const SCREEN_W = 820, SCREEN_H = 520;
  const laptopScreenCanvas = document.createElement('canvas');
  laptopScreenCanvas.width = SCREEN_W;
  laptopScreenCanvas.height = SCREEN_H;
  const laptopScreenCtx = laptopScreenCanvas.getContext('2d');

  // Button hit-areas on the 820×520 canvas
  const screenButtons = [
    { id: 'start',    x: 24,  y: 300, w: 130, h: 36, target: '#contact'  },
    { id: 'work',     x: 168, y: 300, w: 110, h: 36, target: '#projects' },
    { id: 'letstalk', x: 740, y: 16,  w: 64,  h: 20, target: '#contact'  }
  ];

  function drawLaptopScreen(ctx, w, h) {
    // BG
    ctx.fillStyle = '#07070d';
    ctx.fillRect(0, 0, w, h);
    // subtle grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 40) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,h); ctx.stroke(); }
    for (let i = 0; i < h; i += 40) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(w,i); ctx.stroke(); }
    // Navbar
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, w, 48);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText('LIZ', 28, 32);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '11px Inter, sans-serif';
    ['About','Work','Services','Contact'].forEach((t,i) => ctx.fillText(t, w-220+i*52, 32));
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(w-80, 16, 64, 20);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 10px Inter';
    ctx.fillText("Let's Talk", w-70, 30);
    // Tag
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(24, 76, 140, 20);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px Inter';
    ctx.fillText('ENGINEERING SOLUTIONS', 32, 90);
    // Headline
    ctx.fillStyle = '#f0f0f0';
    ctx.font = 'bold 52px Inter';
    ctx.fillText('LIZ', 24, 172);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '52px Inter';
    ctx.fillText('Technologies', 24, 230);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '16px Inter';
    ctx.fillText('Engineering Solutions. Not Templates.', 24, 270);
    // CTA Buttons
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(24, 300, 130, 36);
    ctx.fillStyle = '#07070d';
    ctx.font = 'bold 13px Inter';
    ctx.fillText('Start a Project', 36, 323);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(168, 300, 110, 36);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText('View Our Work', 178, 323);
    // Stats bar
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(0, h-72, w, 72);
    [['10+','Projects'],['100%','Satisfaction'],['3+','Years'],['2','Founders']].forEach(([n,l],i) => {
      const x = 24 + i * 148;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px Inter';
      ctx.fillText(n, x, h-36);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '11px Inter';
      ctx.fillText(l, x, h-18);
    });
  }

  // Draw initial screen and save the base image for hover restore
  drawLaptopScreen(laptopScreenCtx, SCREEN_W, SCREEN_H);
  const laptopBaseImageData = laptopScreenCtx.getImageData(0, 0, SCREEN_W, SCREEN_H);
  const laptopTex = new THREE.CanvasTexture(laptopScreenCanvas);

  // Highlight a button on the laptop screen texture
  let currentHoveredBtn = null;
  function highlightScreenButton(btnId) {
    if (btnId === currentHoveredBtn) return;
    currentHoveredBtn = btnId;
    // Restore base image
    laptopScreenCtx.putImageData(laptopBaseImageData, 0, 0);
    if (btnId) {
      const btn = screenButtons.find(b => b.id === btnId);
      if (btn) {
        // Draw glow highlight overlay
        laptopScreenCtx.fillStyle = 'rgba(255,255,255,0.18)';
        laptopScreenCtx.fillRect(btn.x, btn.y, btn.w, btn.h);
        laptopScreenCtx.strokeStyle = 'rgba(255,255,255,0.6)';
        laptopScreenCtx.lineWidth = 2;
        laptopScreenCtx.strokeRect(btn.x, btn.y, btn.w, btn.h);
      }
    }
    laptopTex.needsUpdate = true;
  }

  /* Phone Screen – Mobile Homepage */
  const phoneTex = makeScreenTexture((ctx, w, h) => {
    ctx.fillStyle = '#09090f';
    ctx.fillRect(0, 0, w, h);
    // Status bar
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px Inter';
    ctx.fillText('9:41', 16, 22);
    ctx.fillText('●●● ✦', w-60, 22);
    // Logo
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('LIZ', w/2, 80);
    ctx.textAlign = 'left';
    // Hero content
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('ENGINEERING SOLUTIONS', w/2, 116);
    ctx.fillStyle = '#f0f0f0';
    ctx.font = 'bold 26px Inter';
    ctx.fillText('Build. Ship.', w/2, 155);
    ctx.fillText('Repeat.', w/2, 185);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px Inter';
    ctx.fillText('Custom Software for Real Business', w/2, 215);
    // CTA
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(30, 235, w-60, 36, 6);
    ctx.fill();
    ctx.fillStyle = '#09090f';
    ctx.font = 'bold 12px Inter';
    ctx.fillText('Start a Project', w/2, 258);
    // Cards
    ctx.textAlign = 'left';
    [['Web Apps','React / Next.js'],['Mobile','iOS & Android'],['Cloud','Supabase / AWS']].forEach(([t,s], i) => {
      const y = 295 + i * 68;
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.beginPath();
      ctx.roundRect(16, y, w-32, 56, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Inter';
      ctx.fillText(t, 28, y+24);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '10px Inter';
      ctx.fillText(s, 28, y+40);
    });
    // Nav bar
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(0, h-56, w, 56);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.roundRect(w/2-24, h-10, 48, 4, 2);
    ctx.fill();
  }, 250, 540);

  /* Tablet Screen – Gym Management Dashboard */
  const tabletTex = makeScreenTexture((ctx, w, h) => {
    ctx.fillStyle = '#08080e';
    ctx.fillRect(0, 0, w, h);
    // Header
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.fillRect(0, 0, w, 52);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px Inter';
    ctx.fillText('Gym Management', 20, 34);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '10px Inter';
    ctx.fillText('● LIVE', w-60, 34);
    // KPI Cards
    [['248','Active Members'],['94%','Attendance'],['₹1.2L','Revenue'],['12','Classes Today']].forEach(([v,l], i) => {
      const x = 16 + (i % 2) * (w/2 - 10);
      const y = 68 + Math.floor(i/2) * 78;
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath();
      ctx.roundRect(x, y, w/2-26, 62, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px Inter';
      ctx.fillText(v, x+12, y+38);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '10px Inter';
      ctx.fillText(l, x+12, y+54);
    });
    // Chart area label
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = 'bold 11px Inter';
    ctx.fillText('Weekly Check-ins', 16, 238);
    // Bar chart
    const bars = [65,82,55,90,78,88,72];
    const bw = 28, gap = 14, chartH = 90, chartY = 245;
    const chartX = (w - bars.length * (bw + gap) + gap) / 2;
    bars.forEach((v, i) => {
      const bh = (v / 100) * chartH;
      const x = chartX + i * (bw + gap);
      const y = chartY + chartH - bh;
      // bar fill
      const g = ctx.createLinearGradient(x, y, x, chartY + chartH);
      g.addColorStop(0, 'rgba(255,255,255,0.9)');
      g.addColorStop(1, 'rgba(255,255,255,0.2)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(x, y, bw, bh, [4, 4, 0, 0]);
      ctx.fill();
    });
    ['M','T','W','T','F','S','S'].forEach((d, i) => {
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font = '9px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(d, chartX + i * (bw + gap) + bw/2, chartY + chartH + 14);
    });
    ctx.textAlign = 'left';
    // Line chart label
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = 'bold 11px Inter';
    ctx.fillText('Revenue Trend', 16, h-138);
    // Simple line chart
    const pts = [40,55,48,72,65,80,88,76,92].map((v,i) => ({
      x: 16 + i * ((w-32)/8),
      y: h-60 - (v/100)*80
    }));
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
    // area fill under line
    ctx.lineTo(pts[pts.length-1].x, h-60);
    ctx.lineTo(pts[0].x, h-60);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fill();
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });
  }, 540, 720);

  /* ── SCREEN MATERIAL ── */
  const matLaptopScreen = new THREE.MeshStandardMaterial({ map: laptopTex, metalness: 0.0, roughness: 0.1, emissive: 0x445588, emissiveIntensity: 0.6 });
  const matPhoneScreen  = new THREE.MeshStandardMaterial({ map: phoneTex,  metalness: 0.0, roughness: 0.1, emissive: 0x334466, emissiveIntensity: 0.5 });
  const matTabletScreen = new THREE.MeshStandardMaterial({ map: tabletTex, metalness: 0.0, roughness: 0.1, emissive: 0x334466, emissiveIntensity: 0.5 });

  /* ── HELPER: Rounded Box via BoxGeometry ── */
  function rBox(w, h, d) {
    return new THREE.BoxGeometry(w, h, d, 2, 2, 2);
  }
  function mesh(geo, mat, cast=true, recv=true) {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = cast; m.receiveShadow = recv; return m;
  }

  /* ════════════════════════════════════════════════════════════════════════
     LAPTOP
  ════════════════════════════════════════════════════════════════════════ */
  const laptopGroup = new THREE.Group();

  // Base / body (keyboard chassis)
  const lBase = mesh(rBox(2.8, 0.08, 1.9), matAluminium);
  lBase.position.set(0, 0.04, 0);
  laptopGroup.add(lBase);

  // Keyboard recess (dark inset)
  const lKeyboard = mesh(new THREE.BoxGeometry(2.4, 0.005, 1.2), new THREE.MeshStandardMaterial({ color:0x0a0a0a, roughness:0.8 }));
  lKeyboard.position.set(0, 0.09, -0.2);
  laptopGroup.add(lKeyboard);

  const keyMat = new THREE.MeshStandardMaterial({ color:0x1f1f24, metalness:0.25, roughness:0.55 });
  const keyRows = [
    { count: 12, z: -0.58, width: 0.14 },
    { count: 11, z: -0.36, width: 0.15 },
    { count: 10, z: -0.14, width: 0.16 },
    { count: 9,  z: 0.08,  width: 0.17 }
  ];
  keyRows.forEach(row => {
    const totalWidth = row.count * row.width + (row.count - 1) * 0.035;
    for (let i = 0; i < row.count; i++) {
      const key = mesh(new THREE.BoxGeometry(row.width, 0.018, 0.115), keyMat, false, false);
      key.position.set(-totalWidth / 2 + row.width / 2 + i * (row.width + 0.035), 0.105, row.z);
      laptopGroup.add(key);
    }
  });
  const spaceKey = mesh(new THREE.BoxGeometry(0.92, 0.018, 0.12), keyMat, false, false);
  spaceKey.position.set(0, 0.105, 0.3);
  laptopGroup.add(spaceKey);
  const powerKey = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.012, 20), keyMat, false, false);
  powerKey.rotation.x = Math.PI / 2;
  powerKey.position.set(1.08, 0.108, -0.72);
  laptopGroup.add(powerKey);

  // Trackpad
  const lTrackpad = mesh(new THREE.BoxGeometry(0.65, 0.005, 0.42), new THREE.MeshStandardMaterial({ color:0x151515, metalness:0.5, roughness:0.4 }));
  lTrackpad.position.set(0, 0.09, 0.65);
  laptopGroup.add(lTrackpad);

  // Lid (pivoted at back edge)
  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, 0.08, -0.95); // hinge position

  // lLid is vertical (width=2.8, height=1.9, thickness=0.06)
  const lLid = mesh(rBox(2.8, 1.9, 0.06), matAluminium);
  lLid.position.set(0, 0.95, 0); // center of vertical sheet
  lidGroup.add(lLid);

  // Screen bezel (sits slightly forward on the Z face)
  const lBezel = mesh(new THREE.BoxGeometry(2.7, 1.78, 0.01), new THREE.MeshStandardMaterial({ color:0x080808, roughness:0.9 }));
  lBezel.position.set(0, 0.95, 0.031);
  lidGroup.add(lBezel);

  // Actual screen (sits slightly forward on the bezel)
  const lScreen = mesh(new THREE.PlaneGeometry(2.5, 1.62), matLaptopScreen);
  lScreen.position.set(0, 0.95, 0.037);
  lScreen.material.emissiveIntensity = 0.8;
  lidGroup.add(lScreen);

  // Camera dot
  const lCam = mesh(new THREE.SphereGeometry(0.022, 8, 8), new THREE.MeshStandardMaterial({ color:0x111111 }));
  lCam.position.set(0, 1.8, 0.038);
  lidGroup.add(lCam);

  // Tilt lid open ~108° (18 degrees tilted backwards from vertical)
  lidGroup.rotation.x = Math.PI * (18/180);
  laptopGroup.add(lidGroup);

  // Apple-like logo on lid back (sits slightly backward on the Z face)
  const lLogo = mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshStandardMaterial({ color:0x3a3a3a, roughness:0.1, metalness:0.9, side: THREE.BackSide }));
  lLogo.position.set(0, 0.95, -0.031);
  lLogo.rotation.x = Math.PI;
  lidGroup.add(lLogo);

  // Hinge
  const lHinge = mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 16), matFrameEdge);
  lHinge.rotation.z = Math.PI/2;
  lHinge.position.set(0, 0.04, 0);
  lidGroup.add(lHinge);

  laptopGroup.position.set(0, 0.55, 0.2);
  laptopGroup.rotation.y = 0.03;
  stage.add(laptopGroup);

  /* ════════════════════════════════════════════════════════════════════════
     SMARTPHONE
  ════════════════════════════════════════════════════════════════════════ */
  phoneGroup = new THREE.Group();

  // Body
  const pBody = mesh(rBox(0.72, 1.44, 0.085), matAluminium);
  phoneGroup.add(pBody);

  // Screen glass
  const pScreen = mesh(new THREE.PlaneGeometry(0.64, 1.32), matPhoneScreen);
  pScreen.position.set(0, 0.03, 0.045);
  phoneGroup.add(pScreen);

  // Camera island
  const pCamIsland = mesh(new THREE.BoxGeometry(0.24, 0.24, 0.015), matFrameEdge);
  pCamIsland.position.set(-0.14, 0.55, -0.048);
  phoneGroup.add(pCamIsland);
  [[-0.06,0.06],[-0.06,-0.06]].forEach(([dx,dy]) => {
    const lens = mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.012, 16), matGlass);
    lens.rotation.x = Math.PI/2;
    lens.position.set(-0.14+dx, 0.55+dy, -0.056);
    phoneGroup.add(lens);
  });

  // Home indicator
  const pBar = mesh(new THREE.BoxGeometry(0.22, 0.025, 0.002), new THREE.MeshStandardMaterial({ color:0x444444 }));
  pBar.position.set(0, -0.65, 0.048);
  phoneGroup.add(pBar);

  phoneGroup.position.set(-2.18, 1.26, 0.18);
  phoneGroup.rotation.y = 0.18;
  phoneGroup.rotation.z = 0.02;
  stage.add(phoneGroup);

  /* ════════════════════════════════════════════════════════════════════════
     TABLET
  ════════════════════════════════════════════════════════════════════════ */
  tabletGroup = new THREE.Group();

  const tBody = mesh(rBox(1.55, 2.05, 0.09), matAluminium);
  tabletGroup.add(tBody);

  const tScreen = mesh(new THREE.PlaneGeometry(1.4, 1.88), matTabletScreen);
  tScreen.position.set(0, 0, 0.048);
  tabletGroup.add(tScreen);

  // Bezel
  const tBezel = mesh(new THREE.BoxGeometry(1.52, 2.02, 0.005), new THREE.MeshStandardMaterial({ color:0x090909, roughness:0.9 }));
  tBezel.position.set(0, 0, 0.045);
  tabletGroup.add(tBezel);

  // Camera dot
  const tCam = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.01, 16), matGlass);
  tCam.rotation.x = Math.PI/2;
  tCam.position.set(0.62, 0, -0.046);
  tabletGroup.add(tCam);

  tabletGroup.position.set(2.2, 1.56, 0.08);
  tabletGroup.rotation.y = -0.18;
  tabletGroup.rotation.x = 0.04;
  stage.add(tabletGroup);

  /* ════════════════════════════════════════════════════════════════════════
     HEADPHONES
  ════════════════════════════════════════════════════════════════════════ */
  hpGroup = new THREE.Group();

  // Compact premium headset, resting flat on the desk
  const bandGeo = new THREE.TorusGeometry(0.42, 0.045, 14, 56, Math.PI);
  const band = mesh(bandGeo, matHPBand);
  band.position.set(0, 0.2, 0);
  hpGroup.add(band);

  // Arms & Ear Cups
  [-1,1].forEach(side => {
    // Metal extension arms extending downwards
    const arm = mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 12), matHPBand);
    arm.position.set(side * 0.42, 0.08, 0);
    hpGroup.add(arm);

    // Ear cup cylinders rotated sideways to face ears (pointing along X axis)
    const cup = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.11, 24), matHPCup);
    cup.rotation.z = Math.PI/2;
    cup.position.set(side * 0.42, -0.05, 0);
    hpGroup.add(cup);

    // Cup cushion
    const cushion = mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.06, 24), new THREE.MeshStandardMaterial({ color:0x080808, roughness:0.95 }));
    cushion.rotation.z = Math.PI/2;
    cushion.position.set(side * (0.42 - side * 0.045), -0.05, 0);
    hpGroup.add(cushion);

    // LED dot indicator
    const led = mesh(new THREE.SphereGeometry(0.015, 8, 8), new THREE.MeshStandardMaterial({ color:0x888888, emissive:0x8888ff, emissiveIntensity:0.5 }));
    led.position.set(side * 0.475, -0.05, 0);
    hpGroup.add(led);
  });

  hpGroup.scale.set(0.68, 0.68, 0.68);
  hpGroup.position.set(2.35, 0.61, 1.1);
  hpGroup.rotation.x = Math.PI / 2;
  hpGroup.rotation.z = -0.18;
  stage.add(hpGroup);

  /* ════════════════════════════════════════════════════════════════════════
     DESK SURFACE
  ════════════════════════════════════════════════════════════════════════ */
  const desk = mesh(new THREE.BoxGeometry(6.6, 0.05, 2.75), matDesk, false, true);
  desk.position.set(0, 0.5, 0.25);
  stage.add(desk);

  // Desk edge highlight
  const deskEdge = mesh(new THREE.BoxGeometry(6.6, 0.006, 0.01), matFrameEdge, false, false);
  deskEdge.position.set(0, 0.525, 1.63);
  stage.add(deskEdge);

  /* ════════════════════════════════════════════════════════════════════════
     LIGHTING
  ════════════════════════════════════════════════════════════════════════ */
  // Key light (white, soft from upper-front-left — main illumination)
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
  keyLight.position.set(-3, 6, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 25;
  keyLight.shadow.camera.left = -5;
  keyLight.shadow.camera.right = 5;
  keyLight.shadow.camera.top = 5;
  keyLight.shadow.camera.bottom = -5;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.radius = 4;
  scene.add(keyLight);

  // Fill light (cool blue, right side — softens shadows)
  const fillLight = new THREE.DirectionalLight(0x6688ff, 1.0);
  fillLight.position.set(4, 3, 3);
  scene.add(fillLight);

  // Rim / purple light (behind devices — silhouette glow)
  const rimLight = new THREE.PointLight(0x8844ff, 1.8, 10);
  rimLight.position.set(0, 2.5, -2.5);
  scene.add(rimLight);

  // Desk under-glow
  const deskLight = new THREE.PointLight(0x6666cc, 0.6, 5);
  deskLight.position.set(0, 0.6, 0.5);
  scene.add(deskLight);

  // Ambient base (raised significantly so devices are clearly visible)
  scene.add(new THREE.AmbientLight(0x222233, 1.6));

  // Screen glow light (illuminates from laptop screen outward)
  const screenGlow = new THREE.PointLight(0x6688ff, 0.8, 4);
  screenGlow.position.set(0, 1.6, 0.8);
  scene.add(screenGlow);

  // Secondary top light for overall brightness
  const topLight = new THREE.DirectionalLight(0xeeeeff, 0.8);
  topLight.position.set(0, 8, 0);
  scene.add(topLight);

  /* ════════════════════════════════════════════════════════════════════════
     PARTICLES
  ════════════════════════════════════════════════════════════════════════ */
  const particleCount = 300;
  const pPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    pPositions[i*3+0] = (Math.random()-0.5) * 18;
    pPositions[i*3+1] = Math.random() * 7 - 0.5;
    pPositions[i*3+2] = (Math.random()-0.5) * 10;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color:0x8888ff, size:0.018, transparent:true, opacity:0.5, sizeAttenuation:true }));
  scene.add(particles);

  /* ════════════════════════════════════════════════════════════════════════
     MOUSE PARALLAX
  ════════════════════════════════════════════════════════════════════════ */
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  document.addEventListener('mousemove', e => {
    targetMouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ════════════════════════════════════════════════════════════════════════
     RESIZE
  ════════════════════════════════════════════════════════════════════════ */
  window.addEventListener('resize', () => {
    const w = container.clientWidth, h = container.clientHeight;
    frameScene();
    renderer.setSize(w, h);
  });

  /* ════════════════════════════════════════════════════════════════════════
     ANIMATION LOOP
  ════════════════════════════════════════════════════════════════════════ */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth mouse
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    // Camera breathing + parallax
    camera.position.set(
      cameraBase.x + mouseX * 0.32,
      cameraBase.y - mouseY * 0.14 + Math.sin(t * 0.4) * 0.02,
      cameraBase.z + Math.sin(t * 0.3) * 0.02
    );
    camera.lookAt(mouseX * 0.08, cameraTarget.y + mouseY * 0.03, cameraTarget.z);

    // Devices stay grounded; only subtle camera-driven turns remain
    laptopGroup.position.y = 0.55;
    laptopGroup.rotation.y = 0.03 + mouseX * 0.06;
    laptopGroup.rotation.x = mouseY * 0.03;

    // Screen glow pulse
    screenGlow.intensity = 0.7 + Math.sin(t * 1.2) * 0.2;
    lScreen.material.emissiveIntensity = 0.7 + Math.sin(t * 0.9) * 0.1;

    if (phoneGroup) {
      phoneGroup.position.y = 1.26;
      phoneGroup.rotation.y = 0.18 - mouseX * 0.025;
    }

    if (tabletGroup) {
      tabletGroup.position.y = 1.56;
      tabletGroup.rotation.y = -0.18 - mouseX * 0.025;
    }

    if (hpGroup) {
      hpGroup.position.y = 0.61;
    }

    // Rim light orbit
    rimLight.position.x = Math.sin(t * 0.3) * 2;

    // Particles drift
    const posArr = pGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      posArr[i*3+1] += 0.0006;
      if (posArr[i*3+1] > 6.5) posArr[i*3+1] = -0.5;
    }
    pGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  /* ════════════════════════════════════════════════════════════════════════
     INTERACTIVE LAPTOP SCREEN BUTTONS (Raycasting)
  ════════════════════════════════════════════════════════════════════════ */
  const raycaster = new THREE.Raycaster();
  const rayMouse = new THREE.Vector2();

  function hitTestScreen(clientX, clientY) {
    const rect = container.getBoundingClientRect();
    rayMouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    rayMouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(rayMouse, camera);
    const hits = raycaster.intersectObject(lScreen, false);
    if (hits.length > 0 && hits[0].uv) {
      const uv = hits[0].uv;
      const cx = uv.x * SCREEN_W;
      const cy = (1 - uv.y) * SCREEN_H;
      for (const btn of screenButtons) {
        if (cx >= btn.x && cx <= btn.x + btn.w && cy >= btn.y && cy <= btn.y + btn.h) {
          return btn;
        }
      }
    }
    return null;
  }

  // Hover – change cursor & highlight button on texture
  container.addEventListener('mousemove', (e) => {
    const btn = hitTestScreen(e.clientX, e.clientY);
    container.style.cursor = btn ? 'pointer' : '';
    highlightScreenButton(btn ? btn.id : null);
  });

  // Click – navigate to target section
  container.addEventListener('click', (e) => {
    const btn = hitTestScreen(e.clientX, e.clientY);
    if (btn) {
      const el = document.querySelector(btn.target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Touch support for mobile
  container.addEventListener('touchend', (e) => {
    if (e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      const btn = hitTestScreen(touch.clientX, touch.clientY);
      if (btn) {
        e.preventDefault();
        const el = document.querySelector(btn.target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}
