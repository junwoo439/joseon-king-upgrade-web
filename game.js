const KINGS = [
  "태조","정종","태종","세종","문종","단종","세조","예종","성종","연산군",
  "중종","인종","명종","선조","광해군","인조","효종","현종","숙종","경종",
  "영조","정조","순조","헌종","철종","고종","순종"
];

let king = 0;
let level = 0;
let money = 500000;

const face = document.getElementById("face");
const popup = document.getElementById("popup");
const faceX = document.getElementById("face-x");

function cost() {
  return Math.floor(500 * Math.pow(1.18, level));
}

function sellPrice() {
  return Math.floor(cost() * 0.9 + level * 1000);
}

function successRate() {
  if (level <= 2) return 100;
  return Math.max(10, 100 - (level - 2) * 5);
}

function downRate() {
  if (level < 5) return 0;
  return Math.min(15, (level - 4) * 3);
}

function breakRate() {
  if (level < 10) return 0;
  return Math.min(5, level - 9);
}

function updateUI() {
  document.getElementById("cost").innerText = `강화비용: ${cost()}원`;
  document.getElementById("sell").innerText =
    level === 0 ? "판매: 불가" : `판매가: ${sellPrice()}원`;
  document.getElementById("money").innerText = `돈: ${money}원`;
  document.getElementById("status").innerText = `+${level} ${KINGS[king]}`;
  document.getElementById("rate").innerText =
    `성공 ${successRate()}% / 하락 ${downRate()}% / 파괴 ${breakRate()}%`;
  face.src = `assets/kings/${king + 1}.png`;
}

function showPopup(text) {
  popup.innerText = text;
  setTimeout(() => popup.innerText = "", 1200);
}

function showX() {
  faceX.style.display = "block";
  setTimeout(() => faceX.style.display = "none", 1000);
}

document.getElementById("upgrade").onclick = () => {
  const c = cost();
  if (money < c) {
    showPopup("돈 부족!");
    return;
  }
  money -= c;

  const r = Math.random() * 100;
  if (r <= successRate()) {
    level++;
    if (king < KINGS.length - 1) king++;
    showPopup("성공!");
    if (king === KINGS.length - 1 && level >= KINGS.length) {
      document.getElementById("ending").style.display = "block";
      document.getElementById("ending-text").innerText =
        `엔딩 달성!\n최종 강화 +${level}`;
    }
  } else if (r <= successRate() + breakRate()) {
    level = 0;
    king = 0;
    showPopup("파괴!");
    showX();
  } else if (r <= successRate() + breakRate() + downRate()) {
    level = Math.max(0, level - 1);
    king = Math.max(0, king - 1);
    showPopup("하락!");
    showX();
  } else {
    showPopup("실패(유지)");
  }
  updateUI();
};

document.getElementById("sellBtn").onclick = () => {
  if (level === 0) {
    showPopup("0강 판매 불가");
    return;
  }
  money += sellPrice();
  level = 0;
  king = 0;
  showPopup("판매!");
  updateUI();
};

updateUI();
