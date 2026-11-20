const mascots = ['🐰', '🐻', '🐶', '🐱', '🐼', '🦊'];
const items = ['🍎', '🍌', '🍓', '🥕', '🍪', '⭐'];

let score = 0;
let currentAnswer = 0;
let currentSpokenQuestion = '';
let nextQuestionTimeout = null;

const scoreEl = document.getElementById('score');
const mascotEl = document.getElementById('mascot');
const bubbleEl = document.getElementById('speech-bubble');
const questionEl = document.getElementById('question-text');
const visualEl = document.getElementById('visual-items');
const optionsEl = document.getElementById('options-container');
const speakBtn = document.getElementById('speak-btn');

function speakText(text, onEndCallback = null) {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      utterance.pitch = 1.1;

      if (onEndCallback) {
        utterance.onend = onEndCallback;
      }

      window.speechSynthesis.speak(utterance);
    } else if (onEndCallback) {
      setTimeout(onEndCallback, 3500);
    }
  } catch (e) {
    if (onEndCallback) {
      setTimeout(onEndCallback, 3500);
    }
  }
}

function playSound(type) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'win') {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.12);
      oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.24);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.45);
    } else {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(250, audioCtx.currentTime + 0.18);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.35);
    }
  } catch (e) {
    // تجاهل أي خطأ صوتي حتى لا يوقف اللعبة
  }
}

function generateQuestion() {
  if (nextQuestionTimeout) {
    clearTimeout(nextQuestionTimeout);
    nextQuestionTimeout = null;
  }

  mascotEl.classList.remove('happy');

  const randomMascot = mascots[Math.floor(Math.random() * mascots.length)];
  const randomItem = items[Math.floor(Math.random() * items.length)];
  mascotEl.textContent = randomMascot;

  const num1 = Math.floor(Math.random() * 5) + 1;
  const num2 = Math.floor(Math.random() * 5) + 1;
  currentAnswer = num1 + num2;

  questionEl.textContent = `كم يساوي: ${num1} + ${num2} ؟`;
  visualEl.textContent = `${randomItem.repeat(num1)} + ${randomItem.repeat(num2)}`;
  bubbleEl.textContent = 'عدّ الأشكال لمساعدتي في معرفة الجواب!';

  currentSpokenQuestion = `كم يساوي ${num1} زائد ${num2} ؟`;
  speakText(currentSpokenQuestion);

  generateOptions(currentAnswer);
}

function generateOptions(correct) {
  optionsEl.innerHTML = '';
  const choices = [correct];

  while (choices.length < 3) {
    const wrong = Math.floor(Math.random() * 10) + 1;
    if (!choices.includes(wrong)) {
      choices.push(wrong);
    }
  }

  choices.sort(() => Math.random() - 0.5);

  choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(choice);
    optionsEl.appendChild(btn);
  });
}

function checkAnswer(selected) {
  if (selected === currentAnswer) {
    playSound('win');
    score += 10;
    scoreEl.textContent = score;
    mascotEl.classList.add('happy');

    const winMsg = 'رائع! إجابة صحيحة يا عبقري';
    bubbleEl.textContent = `${winMsg} 🎉`;

    let movedToNext = false;
    const goNext = () => {
      if (!movedToNext) {
        movedToNext = true;
        clearTimeout(nextQuestionTimeout);
        generateQuestion();
      }
    };

    nextQuestionTimeout = setTimeout(goNext, 4000);
    speakText(winMsg, () => {
      setTimeout(goNext, 800);
    });
  } else {
    playSound('lose');
    const tryMsg = 'حاول مرة أخرى، أنا أثق بك';
    bubbleEl.textContent = `${tryMsg} 💪`;
    speakText(tryMsg);
  }
}

if (speakBtn) {
  speakBtn.onclick = () => speakText(currentSpokenQuestion);
}

generateQuestion();