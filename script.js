/* =========================
   ELEMENTS
========================= */
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const overlayMenu = document.getElementById("overlayMenu");
const navTriggers = document.querySelectorAll(".nav-trigger");
const scrollContainer = document.querySelector(".scroll-container");

/* =========================
   NAVBAR SCROLL EFFECT
   Logika biar jadi kapsul pas di-scroll
========================= */
const scrollThreshold = 60;
let navbarFloating = false;

scrollContainer.addEventListener("scroll", () => {
  const currentScroll = scrollContainer.scrollTop;

  if (currentScroll > scrollThreshold) {
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

/* =========================
   MENU TOGGLE (HAMBURGER)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const overlayMenu = document.getElementById("overlayMenu");
  const navTriggers = document.querySelectorAll(".nav-trigger");

  // 1. Fungsi Toggle Hamburger Menu (Buka / Tutup)
  if (hamburger && overlayMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      overlayMenu.classList.toggle("active");
    });
  }

  // 2. Fungsi Smooth Scroll & Auto-Close Menu Overlay saat diklik
  navTriggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      // Ambil id tujuan dari atribut href (contoh: #about, #project)
      const targetId = trigger.getAttribute("href");
      
      // Mencegah reload halaman bawaan browser jika link internal di index
      if (targetId && targetId.startsWith("#")) {
        e.preventDefault();
        
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          // Tutup menu overlay & reset tombol hamburger ke semula
          if (hamburger && overlayMenu) {
            hamburger.classList.remove("active");
            overlayMenu.classList.remove("active");
          }

          // Hitung posisi scroll dikurangi sedikit offset navbar (biar gak ketutup header)
          const navbarHeight = 80; 
          const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

          // Jalankan scroll yang mulus ke posisi target
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });
        }
      }
    });
  });

  // ========================================================
  // KODE INTERSECTION OBSERVER LU YANG KEMARIN (JANGAN DIHAPUS)
  // ========================================================
  const animatedElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
  const observerOptions = { root: null, rootMargin: "0px", threshold: 0.15 };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => scrollObserver.observe(element));
});

/* =========================
   PREMIUM SMOOTH SCROLL (KETARIK EFFECT)
========================= */

// Fungsi Easing Quartic: Gerakan "ketarik" yang smooth di akhir
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function smoothScrollTo(targetPosition) {
  const startPosition = scrollContainer.scrollTop;
  const distance = targetPosition - startPosition;
  const duration = 1000; // Durasi 1 detik biar kerasa sinematik
  let startTime = null;

  // MATIIN SNAP SEMENTARA: Biar gak guncang pas navigasi jalan
  scrollContainer.classList.add("no-snap");

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easedProgress = easeOutQuart(progress);

    scrollContainer.scrollTop = startPosition + (distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animation);
    } else {
      // NYALAIN SNAP LAGI: Pas udah nyampe tujuan
      setTimeout(() => {
        scrollContainer.classList.remove("no-snap");
      }, 50);
    }
  }

  requestAnimationFrame(animation);
}

/* =========================
   NAVIGATION CLICK HANDLER
========================= */
navTriggers.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetID = link.getAttribute("href");
    const targetSection = document.querySelector(targetID);

    if (!targetSection) return;

    // Tutup menu overlay dulu (kalo lagi di mobile/hamburger)
    hamburger.classList.remove("active");
    overlayMenu.classList.remove("active");
    document.body.style.overflow = "";

    // Langsung eksekusi scroll tanpa jeda kelamaan
    smoothScrollTo(targetSection.offsetTop);
  });
});

/* =========================
   INTERSECTION OBSERVER (REVEAL)
   Biar konten muncul pas di-scroll
========================= */
const revealElements = document.querySelectorAll(".reveal-left, .reveal-right");

const observerOptions = {
  threshold: 0.2, // Konten muncul pas 20% bagian masuk layar
  root: scrollContainer
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, observerOptions);

revealElements.forEach(element => {
  observer.observe(element);
});

document.addEventListener("DOMContentLoaded", () => {
  
  // Ambil semua elemen yang memiliki class animasi reveal
  const animatedElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  
  // Konfigurasi deteksi sensor scroll (Trigger berjalan saat 15% bagian elemen masuk layar)
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Tambahkan class active agar opacity menjadi 1 dan posisi kembali normal
        entry.target.classList.add('active');
        // Unobserve dipakai supaya animasi tidak berkedip ulang saat di-scroll ke atas lagi
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Pasang fungsi deteksi ke setiap elemen
  animatedElements.forEach(element => {
    revealObserver.observe(element);
  });
  
});