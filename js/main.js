/* ============================================
   عقد القران — Bilal & Shahd
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── AUDIO ─────────────────────────────────
  const bgMusic = document.getElementById('bg-music');
  bgMusic.volume = 0.3;

  const audioToggle = document.getElementById('audio-toggle');
  const audioIconOn = document.getElementById('audio-icon-on');
  const audioIconOff = document.getElementById('audio-icon-off');
  let isPlaying = false;

  function startMusic() {
    bgMusic.play().then(() => {
      isPlaying = true;
      audioIconOn.classList.remove('hidden');
      audioIconOff.classList.add('hidden');
      audioToggle.classList.add('playing');
    }).catch(() => {});
  }

  function toggleMusic() {
    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;
      audioIconOn.classList.add('hidden');
      audioIconOff.classList.remove('hidden');
      audioToggle.classList.remove('playing');
    } else {
      startMusic();
    }
  }

  audioToggle.addEventListener('click', toggleMusic);

  // ─── VIDEO LOADING ─────────────────────────
  const heroVideo = document.getElementById('hero-video');

  document.querySelectorAll('video').forEach(video => {
    // Belt-and-suspenders: force-disable any native control surface
    video.controls = false;
    video.removeAttribute('controls');
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    video.addEventListener('loadeddata', () => video.classList.add('loaded'));
    video.addEventListener('canplay', () => {
      video.play().catch(() => {});
    });
    video.addEventListener('error', () => { video.style.display = 'none'; });
  });

  function forcePlayHeroVideo() {
    if (!heroVideo) return;
    const tryPlay = () => heroVideo.play().catch(() => {});
    tryPlay();
    if (heroVideo.readyState < 3) {
      heroVideo.load();
      heroVideo.addEventListener('canplay', tryPlay, { once: true });
    }
  }

  // ─── OPENING SCREEN ───────────────────────
  const envelopeScreen = document.getElementById('envelope-screen');
  const seal = document.getElementById('wax-seal');
  const invitation = document.getElementById('invitation');

  document.body.style.overflow = 'hidden';

  let invitationOpened = false;
  function openInvitation() {
    if (invitationOpened) return;
    invitationOpened = true;

    startMusic();
    forcePlayHeroVideo();

    seal.style.transition = 'transform 0.6s cubic-bezier(.4,0,.2,1), opacity 0.6s ease';
    seal.style.transform = 'scale(1.5)';
    seal.style.opacity = '0';

    setTimeout(() => {
      envelopeScreen.classList.add('opening');
      invitation.classList.remove('hidden');

      setTimeout(() => {
        invitation.classList.add('show');
        document.body.style.overflow = 'auto';
        setTimeout(() => { envelopeScreen.style.display = 'none'; }, 800);
      }, 300);
    }, 600);
  }

  seal.addEventListener('click', openInvitation);
  document.querySelector('.opening-hint-ar')?.addEventListener('click', openInvitation);
  document.querySelector('.opening-hint')?.addEventListener('click', openInvitation);

  // ─── COUNTDOWN ─────────────────────────────
  const weddingDate = new Date('2026-06-12T20:00:00').getTime();

  function updateCountdown() {
    const dist = weddingDate - Date.now();
    if (dist < 0) return;

    document.getElementById('days').textContent    = Math.floor(dist / 86400000);
    document.getElementById('hours').textContent   = Math.floor((dist % 86400000) / 3600000);
    document.getElementById('minutes').textContent = Math.floor((dist % 3600000) / 60000);
    document.getElementById('seconds').textContent = Math.floor((dist % 60000) / 1000);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ─── SCROLL FADE-INS ──────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ─── HERO PARALLAX ────────────────────────
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight && heroContent) {
      heroContent.style.opacity = Math.max(0, 1 - (y / window.innerHeight) * 1.3);
      heroContent.style.transform = `translateY(${y * 0.25}px)`;
    }
  }, { passive: true });

  // ─── CALENDAR ──────────────────────────────
  document.getElementById('add-calendar').addEventListener('click', () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'DTSTART:20260612T200000',
      'DTEND:20260612T220000',
      'SUMMARY:Bilal & Shahd — Marriage Ceremony',
      'LOCATION:Masjid Al-Quds',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'bilal-shahed-ceremony.ics';
    a.click();
  });

});
