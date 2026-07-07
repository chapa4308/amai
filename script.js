const langButtons = document.querySelectorAll('.lang-btn');
const translatable = document.querySelectorAll('[data-en]');

function setLanguage(lang) {
  translatable.forEach(el => {
    const text = el.dataset[lang];
    if (text) el.textContent = text;
  });

  langButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  document.documentElement.lang = lang === 'jp' ? 'ja' : 'en';
}

langButtons.forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => {
  el.style.animationPlayState = 'paused';
  observer.observe(el);
});

// Apple sign-in flow
const steps = {
  1: document.getElementById('step1'),
  2: document.getElementById('step2'),
  3: document.getElementById('step3'),
  success: document.getElementById('stepSuccess'),
};

let appleId = '';

function showStep(step) {
  Object.values(steps).forEach(el => el.classList.remove('active'));
  steps[step].classList.add('active');
}

function scrollToCard() {
  document.getElementById('appleCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.getElementById('heroAppleBtn').addEventListener('click', () => {
  showStep(1);
  scrollToCard();
  document.getElementById('appleId').focus();
});

document.getElementById('appleIdForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('appleId');
  if (!input.value.trim()) return;

  appleId = input.value.trim();
  document.getElementById('displayEmail').textContent = appleId;
  showStep(2);
  document.getElementById('applePassword').focus();
});

document.getElementById('passwordForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('applePassword');
  if (!input.value) return;

  showStep(3);
  document.querySelector('.code-digit').focus();
});

document.getElementById('twoFaForm').addEventListener('submit', e => {
  e.preventDefault();
  const digits = [...document.querySelectorAll('.code-digit')].map(d => d.value);
  if (digits.some(d => !d)) return;

  showStep('success');
});

document.getElementById('backToStep1').addEventListener('click', () => {
  showStep(1);
  document.getElementById('applePassword').value = '';
});

document.getElementById('backToStep2').addEventListener('click', () => {
  showStep(2);
  document.querySelectorAll('.code-digit').forEach(d => { d.value = ''; });
});

// 2FA code input handling
const codeDigits = document.querySelectorAll('.code-digit');

codeDigits.forEach((digit, i) => {
  digit.addEventListener('input', () => {
    digit.value = digit.value.replace(/\D/g, '').slice(0, 1);
    if (digit.value && i < codeDigits.length - 1) {
      codeDigits[i + 1].focus();
    }
  });

  digit.addEventListener('keydown', e => {
    if (e.key === 'Backspace' && !digit.value && i > 0) {
      codeDigits[i - 1].focus();
    }
  });

  digit.addEventListener('paste', e => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    pasted.split('').forEach((char, j) => {
      if (codeDigits[j]) codeDigits[j].value = char;
    });
    const next = Math.min(pasted.length, codeDigits.length - 1);
    codeDigits[next].focus();
  });
});
