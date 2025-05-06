let message1 = "wAiT or sHaKe?";
let message2 = "When you're ready, press the shutter button carefully.\nIt will take about 5 minutes for the instant film to fully develop.\n If you shake the photo, it will develop faster, \nbut the quality will be reduced.\n\nWill you wait the full 5 minutes, or will you shake time itself?";

let showText = false;
let showWelcome = true;

let buttonX, buttonY, buttonW, buttonH;
let blinkInterval = 15;

let welcomeFontSize = 50;
let welcomeW, welcomeH;
let welcomeX, welcomeY;

let music;
let clickSound;

function preload() {
  music = loadSound('music.mp3');       // 반드시 같은 폴더에 위치
  clickSound = loadSound('click.mp3');  // 클릭 사운드
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  fill(255);

  // 음량 설정
  clickSound.setVolume(9.0);  // 클릭 사운드 최대 볼륨
  music.setVolume(0.5);       // 배경 음악은 적절한 수준

  // 버튼 위치 설정
  buttonW = 200;
  buttonH = 60;
  buttonX = width / 2 - buttonW / 2;
  buttonY = height * 0.68;

  // welcome 텍스트 위치 설정
  textFont('Arial');
  textSize(welcomeFontSize);
  textStyle(BOLD);
  welcomeW = textWidth("!wElCoMe!") + 40;
  welcomeH = 60;
  welcomeX = width / 2 - welcomeW / 2;
  welcomeY = height / 2 - welcomeH / 2;
}

function draw() {
  background(0);

  if (showWelcome) {
    let isHovering = mouseX > welcomeX && mouseX < welcomeX + welcomeW &&
                     mouseY > welcomeY && mouseY < welcomeY + welcomeH;

    let scaleAmount = isHovering ? 1.1 : 1.0;

    push();
    translate(width / 2, height / 2);
    scale(scaleAmount);

    // 첫 줄: Welcome
    fill(255);
    textFont('Arial');
    textStyle(BOLD);
    textSize(welcomeFontSize);
    text("WeLcOmE!", 0, -15);

    // 두 번째 줄: Sound 안내
    textSize(30);
    text("please turn on the SoUnD", 0, 30);

    pop();

    noFill();
    stroke(0);
    strokeWeight(0);
    rect(welcomeX, welcomeY, welcomeW, welcomeH, 20);
  }

  if (showText) {
    // message1: 깜빡임 효과
    let alphaValue = map(sin(frameCount / blinkInterval), -1, 1, 70, 300);
    fill(255, alphaValue);
    textFont('Arial');
    textSize(80);
    text(message1, width / 2, height / 3);

    // message2: 안내문
    textFont('Arial');
    textSize(20);
    fill(255);
    text(message2, width / 2, height * 0.52);

    // Start 버튼
    noFill();
    stroke(255);
    strokeWeight(2.5);
    rect(buttonX, buttonY, buttonW, buttonH, 50);

    noStroke();
    fill(255);
    textFont('Arial');
    textSize(30);
    text("sTaRt", width / 2, buttonY + buttonH / 2);
  }
}

function mousePressed() {
  if (showWelcome) {
    if (
      mouseX > welcomeX && mouseX < welcomeX + welcomeW &&
      mouseY > welcomeY && mouseY < welcomeY + welcomeH
    ) {
      if (clickSound.isLoaded()) {
        clickSound.play();
      }
      showWelcome = false;
      showText = true;

      if (!music.isPlaying()) {
        music.loop();
      }
    }
  } else if (showText) {
    if (
      mouseX > buttonX && mouseX < buttonX + buttonW &&
      mouseY > buttonY && mouseY < buttonY + buttonH
    ) {
      if (clickSound.isLoaded()) {
        clickSound.play();
      }

      // Start 버튼 클릭 시에만 300ms 딜레이 추가
      setTimeout(() => {
        window.location.href = "index2.html";
      }, 300); // 0.3초 후 페이지 이동
    }
  }
}




