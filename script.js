const alphabetData = [
    { letter: "A", word: "Apple", emoji: "🍎" },
    { letter: "B", word: "Bear", emoji: "🐻" },
    { letter: "C", word: "Cat", emoji: "🐱" },
    { letter: "D", word: "Dog", emoji: "🐶" },
    { letter: "E", word: "Elephant", emoji: "🐘" },
    { letter: "F", word: "Fish", emoji: "🐟" },
    { letter: "G", word: "Grapes", emoji: "🍇" },
    { letter: "H", word: "Horse", emoji: "🐴" },
    { letter: "I", word: "Ice Cream", emoji: "🍦" },
    { letter: "J", word: "Juice", emoji: "🧃" },
    { letter: "K", word: "Key", emoji: "🔑" },
    { letter: "L", word: "Lion", emoji: "🦁" },
    { letter: "M", word: "Monkey", emoji: "🐵" },
    { letter: "N", word: "Nest", emoji: "🪺" },
    { letter: "O", word: "Orange", emoji: "🍊" },
    { letter: "P", word: "Penguin", emoji: "🐧" },
    { letter: "Q", word: "Queen", emoji: "👑" },
    { letter: "R", word: "Rabbit", emoji: "🐰" },
    { letter: "S", word: "Sun", emoji: "☀️" },
    { letter: "T", word: "Tiger", emoji: "🐯" },
    { letter: "U", word: "Umbrella", emoji: "☂️" },
    { letter: "V", word: "Violin", emoji: "🎻" },
    { letter: "W", word: "Whale", emoji: "🐳" },
    { letter: "X", word: "Xylophone", emoji: "🎼" },
    { letter: "Y", word: "Yo-Yo", emoji: "🪀" },
    { letter: "Z", word: "Zebra", emoji: "🦓" }
];

// نظام حفظ النجوم في المتصفح
function getStars() {
    return parseInt(localStorage.getItem("englishGameStars") || "0", 10);
}

function addStars(amount) {
    const updated = getStars() + amount;
    localStorage.setItem("englishGameStars", updated);
    updateStarDisplays();
}

function updateStarDisplays() {
    const stars = getStars();
    const globalEl = document.getElementById("globalStars");
    const rewardsEl = document.getElementById("rewardsStars");
    if (globalEl) globalEl.innerText = stars;
    if (rewardsEl) rewardsEl.innerText = stars;
}

function speak(text, callback = null) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    if (callback) utterance.onend = callback;
    window.speechSynthesis.speak(utterance);
}

// ==========================================
// 1. صفحة التعلم (learn.html)
// ==========================================
function initLearnPage() {
    const container = document.getElementById("lettersContainer");
    if (!container) return;
    container.innerHTML = "";
    alphabetData.forEach(item => {
        const box = document.createElement("div");
        box.className = "letter-box";
        box.innerHTML = `
            <h2>${item.letter}${item.letter.toLowerCase()}</h2>
            <span>${item.emoji}</span>
            <p>${item.word}</p>
        `;
        box.addEventListener("click", () => speak(`${item.letter} ... ${item.word}`));
        container.appendChild(box);
    });
}

// ==========================================
// 2. صفحة تحدي الصور (quiz.html)
// ==========================================
let currentQuizItem = null;
let quizScore = 0;

function initQuizPage() {
    if (!document.getElementById("quizOptions")) return;
    nextQuizQuestion();
}

function nextQuizQuestion() {
    const feedback = document.getElementById("feedback");
    const emojiEl = document.getElementById("quizEmoji");
    const optionsDiv = document.getElementById("quizOptions");
    if (!feedback || !emojiEl || !optionsDiv) return;

    feedback.innerText = "";
    currentQuizItem = alphabetData[Math.floor(Math.random() * alphabetData.length)];
    emojiEl.innerText = currentQuizItem.emoji;

    const options = [currentQuizItem.letter];
    while (options.length < 3) {
        const randLetter = alphabetData[Math.floor(Math.random() * alphabetData.length)].letter;
        if (!options.includes(randLetter)) options.push(randLetter);
    }
    options.sort(() => Math.random() - 0.5);

    optionsDiv.innerHTML = "";
    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = opt;
        btn.addEventListener("click", () => checkQuizAnswer(opt));
        optionsDiv.appendChild(btn);
    });
}

function speakCurrentWord() {
    if (currentQuizItem) speak(currentQuizItem.word);
}

function checkQuizAnswer(selected) {
    const feedback = document.getElementById("feedback");
    const scoreEl = document.getElementById("score");
    if (selected === currentQuizItem.letter) {
        quizScore += 10;
        addStars(10);
        scoreEl.innerText = quizScore;
        feedback.style.color = "green";
        feedback.innerText = `أحسنت! +10 نجوم ⭐ (${currentQuizItem.letter} for ${currentQuizItem.word})`;
        speak(`Great job! ${currentQuizItem.word}`);
        setTimeout(nextQuizQuestion, 1500);
    } else {
        feedback.style.color = "red";
        feedback.innerText = "حاول مرة أخرى! ❌";
        speak("Try again");
    }
}

// ==========================================
// 3. صفحة مطابقة الحروف (match.html)
// ==========================================
let currentMatchLetter = "";
let matchScore = 0;

function initMatchPage() {
    if (!document.getElementById("matchOptions")) return;
    nextMatchQuestion();
}

function nextMatchQuestion() {
    const feedback = document.getElementById("matchFeedback");
    const bigLetterEl = document.getElementById("bigLetterDisplay");
    const optionsDiv = document.getElementById("matchOptions");
    if (!feedback || !bigLetterEl || !optionsDiv) return;

    feedback.innerText = "";
    const randomItem = alphabetData[Math.floor(Math.random() * alphabetData.length)];
    currentMatchLetter = randomItem.letter;
    bigLetterEl.innerText = currentMatchLetter;

    const options = [currentMatchLetter.toLowerCase()];
    while (options.length < 3) {
        const randSmall = alphabetData[Math.floor(Math.random() * alphabetData.length)].letter.toLowerCase();
        if (!options.includes(randSmall)) options.push(randSmall);
    }
    options.sort(() => Math.random() - 0.5);

    optionsDiv.innerHTML = "";
    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = opt;
        btn.addEventListener("click", () => checkMatchAnswer(opt));
        optionsDiv.appendChild(btn);
    });
}

function checkMatchAnswer(selected) {
    const feedback = document.getElementById("matchFeedback");
    const scoreEl = document.getElementById("matchScore");
    if (selected === currentMatchLetter.toLowerCase()) {
        matchScore += 10;
        addStars(10);
        scoreEl.innerText = matchScore;
        feedback.style.color = "green";
        feedback.innerText = "مطابقة صحيحة! +10 نجوم 🌟";
        speak(currentMatchLetter);
        setTimeout(nextMatchQuestion, 1300);
    } else {
        feedback.style.color = "red";
        feedback.innerText = "ليس هذا الحرف، جرب مجدداً! ❌";
        speak("Oops, try again");
    }
}

// ==========================================
// 4. صفحة الكتابة والتلوين (draw.html)
// ==========================================
let drawIndex = 0;
let penColor = "#ff6b6b";
let isDrawing = false;

function initDrawPage() {
    const canvas = document.getElementById("drawCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    drawTemplateLetter();

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const start = (e) => {
        isDrawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineWidth = 14;
        ctx.lineCap = "round";
        ctx.strokeStyle = penColor;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const stop = () => { isDrawing = false; };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", stop);

    canvas.addEventListener("touchstart", start);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stop);
}

function drawTemplateLetter() {
    const canvas = document.getElementById("drawCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const letter = alphabetData[drawIndex].letter;
    ctx.font = "bold 210px Arial";
    ctx.fillStyle = "#e0e0e0";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2 + 10);
    speak(letter);
}

function setPenColor(color) {
    penColor = color;
}

function clearCanvas() {
    drawTemplateLetter();
}

function nextDrawLetter() {
    addStars(5);
    drawIndex = (drawIndex + 1) % alphabetData.length;
    drawTemplateLetter();
}

// ==========================================
// 5. صفحة أنشودة الحروف (song.html)
// ==========================================
let isSinging = false;
let songIndex = 0;

function initSongPage() {
    const grid = document.getElementById("songGrid");
    if (!grid) return;
    grid.innerHTML = "";
    alphabetData.forEach((item, idx) => {
        const div = document.createElement("div");
        div.className = "song-letter";
        div.id = `song-box-${idx}`;
        div.innerText = item.letter;
        grid.appendChild(div);
    });
}

function toggleAlphabetSong() {
    const btn = document.getElementById("playSongBtn");
    if (isSinging) {
        isSinging = false;
        window.speechSynthesis.cancel();
        btn.innerText = "▶️ ابدأ الأنشودة";
        document.querySelectorAll(".song-letter").forEach(el => el.classList.remove("active"));
    } else {
        isSinging = true;
        songIndex = 0;
        btn.innerText = "⏹️ إيقاف";
        singNextLetter();
    }
}

function singNextLetter() {
    if (!isSinging) return;
    document.querySelectorAll(".song-letter").forEach(el => el.classList.remove("active"));

    if (songIndex >= alphabetData.length) {
        isSinging = false;
        document.getElementById("playSongBtn").innerText = "▶️ ابدأ الأنشودة";
        addStars(15);
        return;
    }

    const currentBox = document.getElementById(`song-box-${songIndex}`);
    if (currentBox) currentBox.classList.add("active");

    const letter = alphabetData[songIndex].letter;
    songIndex++;
    speak(letter, () => {
        setTimeout(singNextLetter, 150);
    });
}

// ==========================================
// 6. صفحة الجوائز (rewards.html)
// ==========================================
const stickersList = [
    { name: "نجمة البداية", icon: "🌟", required: 10 },
    { name: "صاروخ الفضاء", icon: "🚀", required: 30 },
    { name: "تاج الأبطال", icon: "👑", required: 60 },
    { name: "وحيد القرن", icon: "🦄", required: 100 },
    { name: "الديناصور الذكي", icon: "🦖", required: 150 },
    { name: "كأس العبقرية", icon: "🏆", required: 250 }
];

function initRewardsPage() {
    const grid = document.getElementById("rewardsGrid");
    if (!grid) return;
    const stars = getStars();
    grid.innerHTML = "";

    stickersList.forEach(sticker => {
        const unlocked = stars >= sticker.required;
        const card = document.createElement("div");
        card.className = `reward-card ${unlocked ? "unlocked" : ""}`;
        card.innerHTML = `
            <div style="font-size: 4rem;">${sticker.icon}</div>
            <h3>${sticker.name}</h3>
            <p>${unlocked ? "مفتوح! 🎉" : `يحتاج ${sticker.required} نجمة ⭐`}</p>
        `;
        grid.appendChild(card);
    });
}

// تشغيل التهيئة عند فتح أي صفحة
document.addEventListener("DOMContentLoaded", () => {
    updateStarDisplays();
    initLearnPage();
    initQuizPage();
    initMatchPage();
    initDrawPage();
    initSongPage();
    initRewardsPage();
});