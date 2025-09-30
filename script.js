const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const progress = document.getElementById("progress");
const timeDisplay = document.getElementById("time");
const currentLine = document.getElementById("current-line");
audio.volume = 0.1;
const lyrics = [
  { t: 28.0, text: " " },
  { t: 29.0, text: "Среди тревог и вечной грусти" },
  { t: 34.0, text: "Стань мне антидепрессантом." },
  { t: 37.2, text: "Позволь любить себя допустим," },
  { t: 41.0, text: "Любить меня в ответ не надо." },
  { t: 44.5, text: "Ты можешь не любить совсем," },
  { t: 48.5, text: "Позволь с тобой быть просто рядом." },
  { t: 52.0, text: "Среди тревог и вечной грусти" },
  { t: 56.5, text: "Стань мне антидепрессантом." },
  { t: 59.5, text: "Стань мне антидепрессантом. x2" },
  { t: 63.0, text: "Стань мне антидепрессантом. x3" },
  { t: 67.0, text: "Стань мне антидепрессантом. x4" },
  { t: 71.0, text: "Стань мне антиде-." },
  { t: 73.0, text: "Я боюсь, что умру." },
  { t: 77.0, text: "Не коснусь твоих губ." },
  { t: 80.0, text: "Знаешь кто, о ком пою?" },
  { t: 84.5, text: "И я в неё влюблен! И не могу сказать Люблю" },
  { t: 88.0, text: 'Прыгаю в "Бумер", рядом Пэрис Хилтон,' },
  { t: 91.5, text: "Конечно же не настоящая, а только с виду." },
  { t: 95.5, text: "Она любит кокер, делает дороги," },
  { t: 99.0, text: "А я всё прощаю ей за длинные ноги." },
  { t: 103.5, text: "Среди тревог и вечной грусти" },
  { t: 107.0, text: "Стань мне антидепрессантом." },
  { t: 111.0, text: "Позволь любить себя допустим," },
  { t: 114.5, text: "Я не прошу любви обратной." },
];

let currentIndex = 0;
let activeReveal = null;

function fmt(s) {
  if (!s && s !== 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
}

function revealTextRelay(el, text, options = {}) {
  const { speed = 50, char = "日月火水木金土", jitter = 3 } = options;

  if (activeReveal) clearInterval(activeReveal);
  const textLength = text.length;
  let display = Array(textLength).fill("");
  let current = 0;

  activeReveal = setInterval(() => {
    if (current >= textLength) {
      clearInterval(activeReveal);
      activeReveal = null;
      el.textContent = text;
      return;
    }

    let iterations = 0;
    const jitterInterval = setInterval(() => {
      if (iterations < jitter) {
        display[current] = char[Math.floor(Math.random() * char.length)];
        el.textContent = display.join("");
        iterations++;
      } else {
        clearInterval(jitterInterval);
        display[current] = text[current];
        el.textContent = display.join("");
        current++;
      }
    }, speed / jitter);
  }, speed);
}

playBtn.addEventListener("click", () => {
  if (audio.paused) audio.play();
  else audio.pause();
});

audio.addEventListener("play", () => (playBtn.textContent = "Pause"));
audio.addEventListener("pause", () => (playBtn.textContent = "Play"));

audio.addEventListener("loadedmetadata", () => {
  progress.max = audio.duration;
  timeDisplay.textContent = `${fmt(0)} / ${fmt(audio.duration)}`;
});

audio.addEventListener("timeupdate", () => {
  progress.value = audio.currentTime;
  timeDisplay.textContent = `${fmt(audio.currentTime)} / ${fmt(
    audio.duration
  )}`;

  let idx = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].t <= audio.currentTime) idx = i;
    else break;
  }

  if (idx !== currentIndex) {
    currentIndex = idx;
    revealTextRelay(currentLine, lyrics[currentIndex].text, {
      speed: 50,
      char: "日月火水木金土曜祭祝愛夢光星空風雪雨雲海山川森竹花鳥魚龍狐猫犬狼虎虎蛇虎蝶鳥心魂命希望自由平和美学哲学芸術音楽詩物語幻想",
    });
  }
});

progress.addEventListener("input", (e) => {
  audio.currentTime = e.target.value;
});
