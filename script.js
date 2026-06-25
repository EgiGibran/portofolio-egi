/* ==========================================================================
   1. SESSION-BASED PRELOADER (0% - 100%)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const percentText = document.getElementById("preloader-percentage");
  const progressBar = document.getElementById("preloader-bar");

  if (preloader) {
    const hasLoaded = sessionStorage.getItem("portfolio_loaded");

    if (hasLoaded === "true") {
      preloader.style.display = "none";
      preloader.classList.add("hidden");
    } else {
      let currentPercent = 0;
      const loadingInterval = setInterval(() => {
        currentPercent += Math.floor(Math.random() * 5) + 2;
        
        if (currentPercent >= 100) {
          currentPercent = 100;
          clearInterval(loadingInterval);
          percentText.innerText = "100%";
          progressBar.style.width = "100%";
          
          setTimeout(() => {
            preloader.classList.add("hidden");
            sessionStorage.setItem("portfolio_loaded", "true");
          }, 400);
        } else {
          percentText.innerText = `${currentPercent}%`;
          progressBar.style.width = `${currentPercent}%`;
        }
      }, 40);
    }
  }
});

/* ==========================================================================
   2. NAVBAR FLOATING & STICKY SCROLL EFFECT (MURNI WINDOW WINDOW SCROLL)
   ========================================================================== */
const navbar = document.getElementById("navbar");
const scrollThreshold = 60;
let navbarFloating = false;

// Karena scroll berjalan di level body/window utama, kita kunci pakai window listener
window.addEventListener("scroll", () => {
  if (window.scrollY > scrollThreshold) {
    if (!navbarFloating) {
      navbar.classList.add("scrolled");
      navbarFloating = true;
    }
  } else {
    if (navbarFloating) {
      navbar.classList.remove("scrolled");
      navbarFloating = false;
    }
  }
});

/* ==========================================================================
   3. HAMBURGER MENU & OVERLAY CLICK + ANIMASI BERGESER HALUS (SMOOTH SCROLL)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const overlayMenu = document.getElementById("overlayMenu");
  const navTriggers = document.querySelectorAll(".nav-trigger");

  if (hamburger && overlayMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      overlayMenu.classList.toggle("active");
    });
  }

  navTriggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      const targetId = trigger.getAttribute("href");

      // Cek jika link emang valid mengarah ke ID internal halaman (#home, #about, dll)
      if (targetId && targetId.startsWith("#")) {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault(); // Matikan lompatan kasar bawaan browser

          // Tutup menu mobile overlay dengan rapi kalau lagi kebuka
          if (hamburger && overlayMenu) {
            hamburger.classList.remove("active");
            overlayMenu.classList.remove("active");
          }

          // SOLUSI PASTI: Ambil posisi koordinat elemen target dari atas halaman browser
          const targetOffset = targetElement.getBoundingClientRect().top + window.scrollY;
          
          // Lakukan pergeseran layar meluncur halus murni lewat window browser
          window.scrollTo({
            top: targetOffset,
            behavior: "smooth"
          });
        }
      }
    });
  });
});

/* ==========================================================================
   4. DETEKSI SCROLL REVEAL BOLAK-BALIK (INTERSECTION OBSERVER)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    revealObserver.observe(element);
  });
});