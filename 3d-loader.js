/* ==========================================================================
   LOADING ANIMATION & 3D PARALLAX JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Loader Animation
  const loaderScreen = document.getElementById('loaderScreen');
  const loaderPercent = document.getElementById('loaderPercent');
  const loaderBar = document.getElementById('loaderBar');
  const body = document.body;
  
  let percent = 0;
  
  // Simulate loading progress
  const interval = setInterval(() => {
    // Random increment between 1 and 8
    const increment = Math.floor(Math.random() * 8) + 1;
    percent += increment;
    
    if (percent >= 100) {
      percent = 100;
      clearInterval(interval);
      
      // Update UI to 100%
      loaderPercent.textContent = percent;
      loaderBar.style.width = percent + '%';
      
      // Hide loader after a short delay
      setTimeout(() => {
        loaderScreen.classList.add('hidden');
        body.classList.remove('loading');
        
        // Trigger intro animation for 3D room
        introAnimation();
      }, 500);
    } else {
      loaderPercent.textContent = percent;
      loaderBar.style.width = percent + '%';
    }
  }, 30); // 30ms intervals for smooth but fast loading

  // 2. 3D Parallax Mouse Tracking
  const roomScene = document.querySelector('.room-perspective');
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let hasStarted = false; // Flag to prevent tracking during intro
  
  // Mouse movement tracking
  document.addEventListener('mousemove', (e) => {
    if(!hasStarted) return;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Normalize mouse position from -1 to 1
    const mouseX = (e.clientX / windowWidth) * 2 - 1;
    const mouseY = (e.clientY / windowHeight) * 2 - 1;
    
    // Max rotation angles (degrees)
    const maxRotateY = 15;
    const maxRotateX = 10;
    
    // Calculate target rotation
    targetY = mouseX * maxRotateY;
    targetX = -mouseY * maxRotateX + 5; // +5 to keep slight downward tilt
  });
  
  // Smooth animation loop for parallax
  function animateParallax() {
    if(hasStarted) {
      // Lerp (Linear Interpolation) for smooth movement
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      
      if(roomScene) {
        roomScene.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg) scale(0.9)`;
      }
    }
    requestAnimationFrame(animateParallax);
  }
  
  // Start the animation loop
  animateParallax();
  
  // 3. Intro Animation when loader finishes
  function introAnimation() {
    if(!roomScene) return;
    
    // Set transition for smooth zoom out
    roomScene.style.transition = 'transform 2.5s cubic-bezier(0.15, 0.85, 0.35, 1)';
    
    // Trigger the animation to the target base state
    requestAnimationFrame(() => {
      roomScene.style.transform = `rotateX(5deg) rotateY(0deg) scale(0.9)`;
      
      // Enable mouse tracking when transition finishes
      setTimeout(() => {
        roomScene.style.transition = 'transform 0.1s ease-out';
        hasStarted = true;
        currentX = 5;
        currentY = 0;
      }, 2500);
    });
  }
});
