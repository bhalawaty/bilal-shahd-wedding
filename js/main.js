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
        scheduleScrollHint();
      }, 300);
    }, 600);
  }

  seal.addEventListener('click', openInvitation);
  document.querySelector('.opening-hint-ar')?.addEventListener('click', openInvitation);
  document.querySelector('.opening-hint')?.addEventListener('click', openInvitation);

  // ─── SCROLL HINT — gentle page nudge so user knows to scroll ───
  const scrollIndicator = document.getElementById('scroll-indicator');

  function scheduleScrollHint() {
    setTimeout(() => {
      if (window.scrollY > 10) return; // user already scrolled
      const target = 70;
      window.scrollTo({ top: target, behavior: 'smooth' });
      setTimeout(() => {
        if (window.scrollY > target + 30) return; // user took over
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 900);
    }, 1800);
  }

  window.addEventListener('scroll', () => {
    if (!scrollIndicator) return;
    if (window.scrollY > 80) scrollIndicator.classList.add('hidden-fade');
    else scrollIndicator.classList.remove('hidden-fade');
  }, { passive: true });

  scrollIndicator?.addEventListener('click', () => {
    const heroEl = document.querySelector('.hero');
    const nextSection = heroEl?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  });

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

  // ─── SECRET ─────────────────────────────────
  const secretTrigger = document.getElementById('footer-date');
  const secretGate = document.getElementById('secret-gate');
  const secretForm = document.getElementById('secret-form');
  const secretInput = document.getElementById('secret-input');
  const secretError = document.getElementById('secret-error');
  const secretClose = document.getElementById('secret-gate-close');
  const revealScene = document.getElementById('reveal-scene');
  const revealImage = document.getElementById('reveal-image');
  const revealClose = document.getElementById('reveal-close');
  const revealPetals = document.getElementById('reveal-petals');

  function openSecretGate() {
    if (!secretGate) return;
    secretGate.classList.remove('hidden');
    secretGate.removeAttribute('aria-hidden');
    setTimeout(() => secretInput?.focus(), 150);
  }

  function closeSecretGate() {
    secretGate?.classList.add('hidden');
    secretGate?.setAttribute('aria-hidden', 'true');
    if (secretInput) secretInput.value = '';
    secretError?.classList.remove('show');
  }

  function showSecretError(msg) {
    if (!secretError) return;
    secretError.textContent = msg;
    secretError.classList.add('show');
    secretGate.querySelector('.secret-gate-card')?.classList.add('secret-shake');
    setTimeout(() => secretGate.querySelector('.secret-gate-card')?.classList.remove('secret-shake'), 450);
  }

  let secretClickCount = 0;
  let secretClickTimer = null;
  secretTrigger?.addEventListener('click', (e) => {
    e.preventDefault();
    secretClickCount++;
    if (secretClickCount === 1) {
      secretClickTimer = setTimeout(() => { secretClickCount = 0; }, 500);
    } else if (secretClickCount >= 2) {
      clearTimeout(secretClickTimer);
      secretClickCount = 0;
      openSecretGate();
    }
  });
  secretTrigger?.addEventListener('dblclick', (e) => {
    e.preventDefault();
    openSecretGate();
  });

  secretClose?.addEventListener('click', closeSecretGate);
  secretGate?.addEventListener('click', (e) => {
    if (e.target === secretGate || e.target.classList.contains('secret-gate-bg')) closeSecretGate();
  });

  async function deriveKey(password, salt) {
    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
      'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 250000, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
  }

  function spawnRevealPetals() {
    if (!revealPetals || revealPetals.childElementCount) return;
    const reds = ['#B22222', '#CC3333', '#A01020', '#D44444', '#8B1A1A'];
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      const size = 10 + Math.random() * 10;
      p.style.left = (Math.random() * 100) + '%';
      p.style.width = size + 'px';
      p.style.height = (size * 1.25) + 'px';
      p.style.background = reds[i % reds.length];
      p.style.setProperty('--dur', (6 + Math.random() * 3) + 's');
      p.style.setProperty('--delay', (Math.random() * 6) + 's');
      revealPetals.appendChild(p);
    }
  }

  async function unlockSecret(password) {
    try {
      const res = await fetch('assets/data/poem.dat', { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch_failed');
      const buf = new Uint8Array(await res.arrayBuffer());
      if (buf.length < 44) throw new Error('bad_payload');

      const salt = buf.slice(0, 16);
      const iv = buf.slice(16, 28);
      const ctWithTag = buf.slice(28);

      const key = await deriveKey(password, salt);
      const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ctWithTag);

      const blob = new Blob([plaintext], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);

      if (revealImage) revealImage.src = url;
      closeSecretGate();
      revealScene?.classList.remove('hidden');
      revealScene?.removeAttribute('aria-hidden');
      spawnRevealPetals();
    } catch (err) {
      showSecretError('Not quite. Try again.');
    }
  }

  secretForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pwd = (secretInput?.value || '').trim();
    if (!pwd) return;
    secretError?.classList.remove('show');
    unlockSecret(pwd);
  });

  revealClose?.addEventListener('click', () => {
    revealScene?.classList.add('hidden');
    revealScene?.setAttribute('aria-hidden', 'true');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!revealScene?.classList.contains('hidden')) revealClose?.click();
      else if (!secretGate?.classList.contains('hidden')) closeSecretGate();
    }
  });

});
