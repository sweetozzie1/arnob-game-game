const arabicLetters = [
    { char: "أ", name: "ألف", word: "أسد", emoji: "🦁", start: "أ", mid: "ـأ", end: "ـأ" },
    { char: "ب", name: "باء", word: "بطة", emoji: "🦆", start: "بـ", mid: "ـبـ", end: "ـب" },
    { char: "ت", name: "تاء", word: "تفاحة", emoji: "🍎", start: "تـ", mid: "ـتـ", end: "ـت" },
    { char: "ث", name: "ثاء", word: "ثعلب", emoji: "🦊", start: "ثـ", mid: "ـثـ", end: "ـث" },
    { char: "ج", name: "جيم", word: "جمل", emoji: "🐪", start: "جـ", mid: "ـجـ", end: "ـج" },
    { char: "ح", name: "حاء", word: "حصان", emoji: "🐴", start: "حـ", mid: "ـحـ", end: "ـح" },
    { char: "خ", name: "خاء", word: "خروف", emoji: "🐑", start: "خـ", mid: "ـخـ", end: "ـخ" },
    { char: "د", name: "دال", word: "دب", emoji: "🐻", start: "د", mid: "ـد", end: "ـد" },
    { char: "ذ", name: "ذال", word: "ذرة", emoji: "🌽", start: "ذ", mid: "ـذ", end: "ـذ" },
    { char: "ر", name: "راء", word: "رمان", emoji: "🫐", start: "ر", mid: "ـر", end: "ـر" },
    { char: "ز", name: "زاي", word: "زرافة", emoji: "🦒", start: "ز", mid: "ـز", end: "ـز" },
    { char: "س", name: "سين", word: "سمكة", emoji: "🐟", start: "سـ", mid: "ـسـ", end: "ـس" },
    { char: "ش", name: "شين", word: "شمس", emoji: "☀️", start: "شـ", mid: "ـشـ", end: "ـش" },
    { char: "ص", name: "صاد", word: "صقر", emoji: "🦅", start: "صـ", mid: "ـصـ", end: "ـص" },
    { char: "ض", name: "ضاد", word: "ضفدع", emoji: "🐸", start: "ضـ", mid: "ـضـ", end: "ـض" },
    { char: "ط", name: "طاء", word: "طائرة", emoji: "✈️", start: "طـ", mid: "ـطـ", end: "ـط" },
    { char: "ظ", name: "ظاء", word: "ظرف", emoji: "✉️", start: "ظـ", mid: "ـظـ", end: "ـظ" },
    { char: "ع", name: "عين", word: "عصفور", emoji: "🐦", start: "عـ", mid: "ـعـ", end: "ـع" },
    { char: "غ", name: "غين", word: "غزال", emoji: "🦌", start: "غـ", mid: "ـغـ", end: "ـغ" },
    { char: "ف", name: "فاء", word: "فيل", emoji: "🐘", start: "فـ", mid: "ـفـ", end: "ـف" },
    { char: "ق", name: "قاف", word: "قمر", emoji: "🌙", start: "قـ", mid: "ـقـ", end: "ـق" },
    { char: "ك", name: "كاف", word: "كتاب", emoji: "📘", start: "كـ", mid: "ـكـ", end: "ـك" },
    { char: "ل", name: "لام", word: "ليمون", emoji: "🍋", start: "لـ", mid: "ـلـ", end: "ـل" },
    { char: "م", name: "ميم", word: "موز", emoji: "🍌", start: "مـ", mid: "ـمـ", end: "ـم" },
    { char: "ن", name: "نون", word: "نحلة", emoji: "🐝", start: "نـ", mid: "ـنـ", end: "ـن" },
    { char: "هـ", name: "هاء", word: "هدية", emoji: "🎁", start: "هـ", mid: "ـهـ", end: "ـه" },
    { char: "و", name: "واو", word: "وردة", emoji: "🌹", start: "و", mid: "ـو", end: "ـو" },
    { char: "ي", name: "ياء", word: "يد", emoji: "✋", start: "يـ", mid: "ـيـ", end: "ـي" }
];

// النجوم المحفوظة
function getArabicStars() {
    return parseInt(localStorage.getItem("arabicStarsCount") || "0", 10);
}

function addArabicStars(points) {
    const total = getArabicStars() + points;
    localStorage.setItem("arabicStarsCount", total);
    refreshStarsUI();
    checkSpecialThanksBanner();
}

function refreshStarsUI() {
    document.querySelectorAll("#totalStars").forEach(el => {
        el.innerText = getArabicStars();
    });
}

// نطق عربي
function speakArabic(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "ar-SA";
    msg.rate = 0.85;
    window.speechSynthesis.speak(msg);
}

// 1. حديقة الحروف (learn.html)
function setupLearnArabic() {
    const grid = document.getElementById("arabicLettersGrid");
    if (!grid) return;
    grid.innerHTML = "";
    arabicLetters.forEach(item => {
        const card = document.createElement("div");
        card.className = "letter-tile";
        card.innerHTML = `
            <div class="big-char">${item.char}</div>
            <div class="emoji-pic">${item.emoji}</div>
            <div class="word-label">${item.word}</div>
        `;
        card.addEventListener("click", () => speakArabic(`${item.name} ... ${item.word}`));
        grid.appendChild(card);
    });
}

// 2. تحدي الصور (quiz.html)
let activeQuiz = null;

function setupQuizArabic() {
    if (!document.getElementById("quizChoices")) return;
    loadNextQuiz();
}

function loadNextQuiz() {
    const status = document.getElementById("quizStatus");
    const pic = document.getElementById("quizPic");
    const choicesBox = document.getElementById("quizChoices");
    if (!status || !pic || !choicesBox) return;

    status.innerText = "";
    activeQuiz = arabicLetters[Math.floor(Math.random() * arabicLetters.length)];
    pic.innerText = activeQuiz.emoji;

    const options = [activeQuiz.char];
    while (options.length < 3) {
        const randomChar = arabicLetters[Math.floor(Math.random() * arabicLetters.length)].char;
        if (!options.includes(randomChar)) options.push(randomChar);
    }
    options.sort(() => Math.random() - 0.5);

    choicesBox.innerHTML = "";
    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.innerText = opt;
        btn.addEventListener("click", () => verifyQuiz(opt));
        choicesBox.appendChild(btn);
    });
}

function sayCurrentArabicWord() {
    if (activeQuiz) speakArabic(activeQuiz.word);
}

function verifyQuiz(picked) {
    const status = document.getElementById("quizStatus");
    if (picked === activeQuiz.char) {
        addArabicStars(10);
        status.style.color = "#2A9D8F";
        status.innerText = `رائع! ${activeQuiz.char} - ${activeQuiz.word} (+10 نجوم)`;
        speakArabic(`أحسنت، ${activeQuiz.word}`);
        setTimeout(loadNextQuiz, 1500);
    } else {
        status.style.color = "#D62828";
        status.innerText = "حاول مرة ثانية يا بطل!";
        speakArabic("حاول مرة أخرى");
    }
}

// 3. لعبة أشكال الحرف (forms.html)
const connectedLetters = arabicLetters.filter(l => !["أ", "د", "ذ", "ر", "ز", "و"].includes(l.char));
let currentFormAnswer = "";

function setupFormsArabic() {
    if (!document.getElementById("formChoices")) return;
    loadNextForm();
}

function loadNextForm() {
    const title = document.getElementById("formQuestionTitle");
    const hint = document.getElementById("formWordHint");
    const box = document.getElementById("formChoices");
    const status = document.getElementById("formStatus");
    if (!title || !hint || !box) return;

    status.innerText = "";
    const item = connectedLetters[Math.floor(Math.random() * connectedLetters.length)];
    const positions = [
        { label: "أول الكلمة", ans: item.start, example: `${item.start}ـلـم` },
        { label: "وسط الكلمة", ans: item.mid, example: `كـ${item.mid}ـر` },
        { label: "آخر الكلمة", ans: item.end, example: `قـلـ${item.end}` }
    ];
    const chosen = positions[Math.floor(Math.random() * positions.length)];
    currentFormAnswer = chosen.ans;

    title.innerText = `اختر شكل حرف ( ${item.char} ) في ${chosen.label}:`;
    hint.innerText = `مثال: ${chosen.example}`;

    const opts = [item.start, item.mid, item.end].sort(() => Math.random() - 0.5);
    box.innerHTML = "";
    opts.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.innerText = opt;
        btn.addEventListener("click", () => {
            if (opt === currentFormAnswer) {
                addArabicStars(10);
                status.style.color = "#2A9D8F";
                status.innerText = "إجابة ذكية! (+10 نجوم) ⭐";
                speakArabic("ممتاز");
                setTimeout(loadNextForm, 1400);
            } else {
                status.style.color = "#D62828";
                status.innerText = "انتبه لاتصال الحرف، جرب مرة أخرى!";
            }
        });
        box.appendChild(btn);
    });
}

// 4. كراسة الخط (draw.html)
let arabicDrawIdx = 0;
let activePen = "#E86A33";
let painting = false;

function setupDrawArabic() {
    const canvas = document.getElementById("arabicCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    renderTemplateChar();

    const coords = (e) => {
        const rect = canvas.getBoundingClientRect();
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: cx - rect.left, y: cy - rect.top };
    };

    const begin = (e) => {
        painting = true;
        const p = coords(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    };

    const move = (e) => {
        if (!painting) return;
        e.preventDefault();
        const p = coords(e);
        ctx.lineWidth = 15;
        ctx.lineCap = "round";
        ctx.strokeStyle = activePen;
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    };

    const end = () => { painting = false; };

    canvas.addEventListener("mousedown", begin);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseleave", end);
    canvas.addEventListener("touchstart", begin);
    canvas.addEventListener("touchmove", move);
    canvas.addEventListener("touchend", end);
}

function renderTemplateChar() {
    const canvas = document.getElementById("arabicCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const item = arabicLetters[arabicDrawIdx];
    ctx.font = "900 200px Cairo, sans-serif";
    ctx.fillStyle = "#E6DFD5";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.char, canvas.width / 2, canvas.height / 2 + 10);
    speakArabic(item.name);
}

function changePen(color) { activePen = color; }
function resetArabicCanvas() { renderTemplateChar(); }
function nextArabicDraw() {
    addArabicStars(5);
    arabicDrawIdx = (arabicDrawIdx + 1) % arabicLetters.length;
    renderTemplateChar();
}

// 5. الجوائز وإشعار الشكر الخاص (150 نجمة)
const arabicMedals = [
    { title: "مبتدئ الحروف", icon: "🌱", starsNeeded: 20 },
    { title: "صديق الكلمات", icon: "📘", starsNeeded: 50 },
    { title: "خطاط صغير", icon: "✒️", starsNeeded: 90 },
    { title: "بطل 150 نجمة", icon: "🏅", starsNeeded: 150 },
    { title: "موسوعة اللغة", icon: "👑", starsNeeded: 250 }
];

function checkSpecialThanksBanner() {
    const banner = document.getElementById("specialThanksBanner");
    if (!banner) return;

    const stars = getArabicStars();
    const dismissed = sessionStorage.getItem("dismissed150Thanks") === "true";

    if (stars >= 150 && !dismissed) {
        const countEl = document.getElementById("bannerStarsCount");
        if (countEl) countEl.innerText = stars;
        banner.style.display = "block";
    } else {
        banner.style.display = "none";
    }
}

function dismissThanksBanner() {
    sessionStorage.setItem("dismissed150Thanks", "true");
    checkSpecialThanksBanner();
}

function setupRewardsArabic() {
    const grid = document.getElementById("arabicRewardsGrid");
    if (!grid) return;

    const stars = getArabicStars();
    grid.innerHTML = "";

    arabicMedals.forEach(medal => {
        const isUnlocked = stars >= medal.starsNeeded;
        const card = document.createElement("div");
        card.className = `arabic-medal-card ${isUnlocked ? "unlocked" : ""}`;
        card.innerHTML = `
            <div style="font-size: 3.4rem; margin-bottom: 8px;">${medal.icon}</div>
            <h3 style="font-weight: 900; margin-bottom: 6px;">${medal.title}</h3>
            <p style="font-weight: 700;">${isUnlocked ? "تم فتح الوسام! 🎉" : `تحتاج ${medal.starsNeeded} نجمة ⭐`}</p>
        `;
        grid.appendChild(card);
    });
}

// 6. لعبة الحركات (harakat.html)
const harakatOptions = [
    { key: "fatha", label: "الفتحة ( ـَ )", mark: "\u064E", soundSuffix: "َ" },
    { key: "damma", label: "الضمة ( ـُ )", mark: "\u064F", soundSuffix: "ُ" },
    { key: "kasra", label: "الكسرة ( ـِ )", mark: "\u0650", soundSuffix: "ِ" }
];

let currentHarakaRound = null;

function setupHarakatArabic() {
    if (!document.getElementById("harakaChoices")) return;
    loadNextHaraka();
}

function loadNextHaraka() {
    const targetEl = document.getElementById("harakaTarget");
    const choicesBox = document.getElementById("harakaChoices");
    const statusEl = document.getElementById("harakaStatus");
    if (!targetEl || !choicesBox || !statusEl) return;

    statusEl.innerText = "";

    const baseLetterObj = arabicLetters.find(l => l.char !== "أ" && l.char !== "هـ") || arabicLetters[1];
    const randomLetter = arabicLetters.filter(l => !["أ", "هـ", "و", "ي"].includes(l.char));
    const letterItem = randomLetter[Math.floor(Math.random() * randomLetter.length)];
    const chosenHaraka = harakatOptions[Math.floor(Math.random() * harakatOptions.length)];

    currentHarakaRound = {
        letter: letterItem.char,
        haraka: chosenHaraka
    };

    // نعرض الحرف بدون حركة ليخمن الطفل الحركة المناسبة بعد سماع النطق
    targetEl.innerText = letterItem.char;
    speakArabic(`${letterItem.char}${chosenHaraka.mark}`);

    const shuffled = [...harakatOptions].sort(() => Math.random() - 0.5);
    choicesBox.innerHTML = "";

    shuffled.forEach(opt => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "choice-btn";
        btn.style.fontSize = "1.35rem";
        btn.innerText = opt.label;
        btn.addEventListener("click", () => verifyHaraka(opt.key));
        choicesBox.appendChild(btn);
    });
}

function sayCurrentHaraka() {
    if (currentHarakaRound) {
        speakArabic(`${currentHarakaRound.letter}${currentHarakaRound.haraka.mark}`);
    }
}

function verifyHaraka(selectedKey) {
    const statusEl = document.getElementById("harakaStatus");
    const targetEl = document.getElementById("harakaTarget");
    if (!statusEl || !targetEl || !currentHarakaRound) return;

    if (selectedKey === currentHarakaRound.haraka.key) {
        targetEl.innerText = `${currentHarakaRound.letter}${currentHarakaRound.haraka.mark}`;
        addArabicStars(10);
        statusEl.style.color = "#2A9D8F";
        statusEl.innerText = `ممتاز! (${currentHarakaRound.haraka.label}) +10 نجوم ⭐`;
        speakArabic("أحسنت");
        setTimeout(loadNextHaraka, 1500);
    } else {
        statusEl.style.color = "#D62828";
        statusEl.innerText = "اسمع النطق مرة ثانية واختر الحركة الصحيحة!";
        sayCurrentHaraka();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    refreshStarsUI();
    checkSpecialThanksBanner();
    setupLearnArabic();
    setupQuizArabic();
    setupFormsArabic();
    setupDrawArabic();
    setupRewardsArabic();
    setupHarakatArabic();
});