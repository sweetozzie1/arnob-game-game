const mascots = ['🐰', '🐱', '🐶', '🐼', '🦊'];
const symbols = ['🍎', '🍓', '🌟', '🧁', '🎈'];

let score = 0;
let currentAnswer = 0;
let currentSpokenQuestion = '';
let currentMode = 'add';
let movedToNext = false;
let nextQuestionTimeout = null;

const scoreEl = document.getElementById('score');
const mascotEl = document.getElementById('mascot');
const bubbleEl = document.getElementById('bubble');
const questionTextEl = document.getElementById('question-text');
const visualItemsEl = document.getElementById('visual-items');
const choicesEl = document.getElementById('choices');
const speakBtn = document.getElementById('speak-btn');
const modeButtons = document.querySelectorAll('.mode-btn');

function playSound(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'win') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24);
    } else {
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.setValueAtTime(195, ctx.currentTime + 0.16);
    }

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // تجاهل إذا منع المتصفح الصوت قبل التفاعل
  }
}

function speakText(text, onDone) {
  if (!('speechSynthesis' in window)) {
    if (typeof onDone === 'function') onDone();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.95;
  if (typeof onDone === 'function') {
    utterance.onend = onDone;
  }
  window.speechSynthesis.speak(utterance);
}

function buildMathPair() {
  if (currentMode === 'sub') {
    const a = Math.floor(Math.random() * 8) + 2; // 2 إلى 9
    const b = Math.floor(Math.random() * (a + 1)); // 0 إلى a لتجنب السالب
    return {
      a,
      b,
      operator: '-',
      answer: a - b,
      spoken: `كم يساوي ${a} ناقص ${b}؟`
    };
  }

  const a = Math.floor(Math.random() * 6) + 1; // 1 إلى 6
  const b = Math.floor(Math.random() * 6) + 1; // 1 إلى 6
  return {
    a,
    b,
    operator: '+',
    answer: a + b,
    spoken: `كم يساوي ${a} زائد ${b}؟`
  };
}

function buildChoices(correctAnswer) {
  const set = new Set([correctAnswer]);
  while (set.size < 4) {
    const delta = Math.floor(Math.random() * 5) - 2; // -2 إلى +2
    const candidate = Math.max(0, correctAnswer + delta);
    set.add(candidate);
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
}

function generateQuestion() {
  movedToNext = false;
  clearTimeout(nextQuestionTimeout);

  const pair = buildMathPair();
  currentAnswer = pair.answer;
  currentSpokenQuestion = pair.spoken;

  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const mascot = mascots[Math.floor(Math.random() * mascots.length)];

  if (mascotEl) mascotEl.textContent = mascot;
  if (questionTextEl) {
    questionTextEl.textContent = `كم يساوي: ${pair.a} ${pair.operator} ${pair.b} ؟`;
  }
  if (visualItemsEl) {
    const leftGroup = symbol.repeat(pair.a);
    const rightGroup = pair.b > 0 ? symbol.repeat(pair.b) : '0';
    visualItemsEl.textContent = `${leftGroup} ${pair.operator} ${rightGroup}`;
  }

  if (choicesEl) {
    choicesEl.innerHTML = '';
    const options = buildChoices(pair.answer);
    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(opt);
      choicesEl.appendChild(btn);
    });
  }
}

function checkAnswer(selected) {
  if (selected === currentAnswer) {
    score += 1;
    if (scoreEl) scoreEl.textContent = score;
    playSound('win');

    const winMsg = 'أحسنت يا بطل! إجابة صحيحة!';
    if (bubbleEl) bubbleEl.textContent = `${winMsg} 🌟`;

    const goNext = () => {
      if (!movedToNext) {
        movedToNext = true;
        clearTimeout(nextQuestionTimeout);
        generateQuestion();
      }
    };

    nextQuestionTimeout = setTimeout(goNext, 3500);
    speakText(winMsg, () => {
      setTimeout(goNext, 700);
    });
  } else {
    playSound('lose');
    const tryMsg = 'حاول مرة أخرى، أنا أثق بك!';
    if (bubbleEl) bubbleEl.textContent = `${tryMsg} 💪`;
    speakText(tryMsg);
  }
}

modeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    currentMode = btn.dataset.mode;
    modeButtons.forEach((b) => b.classList.toggle('active', b === btn));
    if (bubbleEl) {
      bubbleEl.textContent =
        currentMode === 'add'
          ? 'اخترنا الجمع (+) — هيا نحسب معاً!'
          : 'اخترنا الطرح (-) — ركّز جيداً يا بطل!';
    }
    generateQuestion();
  });
});

if (speakBtn) {
  speakBtn.onclick = () => speakText(currentSpokenQuestion);
}

generateQuestion();