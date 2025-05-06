let video;
let frame2, polaroid, filmback, polaroidframe, noiseImage;
let buttonX, buttonY, buttonW, buttonH;
let showCaptured = false;
let capturedImage;
let animationStartTime = null;
let filmbackY;
let targetY;
let fadeAmount = 255;
let polaroidFrameY;
let textAlpha = 255;
let fadeOutStarted = false;
let aboutToCapture = false;
let shutterSound;
let takingPolaroidSound;
let polaroidSoundPlayed = false;

let capturedImageShowDelay = 300000;
let capturedImageShowTime = null;

let lastMouse = null;
let shakePower = 0;
let isShaking = false;
let shakingStartX = 0;

let noiseAlpha = 0;

let saveButtonW = 200;
let saveButtonH = 60;
let saveButtonX, saveButtonY;

let takeNewButtonW = 200;
let takeNewButtonH = 60;
let takeNewButtonX, takeNewButtonY;

let flashAlpha = 0;
let flashDecay = 10;

let music; // 음악 변수 추가
let clickSound; // 클릭 사운드 추가

function preload() {
  frame2 = loadImage('frame2.png');
  polaroid = loadImage('polaroid.png');
  filmback = loadImage('filmback.png');
  noiseImage = loadImage('noise.png');
  polaroidframe = loadImage('polaroidframe.png');

  shutterSound = loadSound('shoot.mp3');
  takingPolaroidSound = loadSound('takingpolaroid.mp3');
  clickSound = loadSound('click.mp3'); // 클릭 사운드 로드
  
  music = loadSound('music.mp3'); // 음악 파일 로드
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(447, 332);
  video.hide();

  // 음악 자동 재생 + 반복 설정
  if (music && !music.isPlaying()) {
    music.loop(); // 반복 재생
  }

  buttonW = 250;
  buttonH = 70;
  buttonX = width / 2 - buttonW / 2;
  buttonY = height - 280;

  saveButtonX = width / 2 - saveButtonW / 2;
  saveButtonY = height - 260;

  takeNewButtonX = width / 2 - takeNewButtonW / 2;
  takeNewButtonY = saveButtonY + saveButtonH + 20;

  filmbackY = height / 2 + 90;
  targetY = height / 2 - 280;
  polaroidFrameY = height / 2;
}

function draw() {
  background(0);

  if (!showCaptured) {
    push();
    translate(width / 2, height / 2);
    scale(-1, 1);
    imageMode(CENTER);
    drawingContext.filter = "blur(4px) brightness(70) contrast(100) saturate(1.2)";
    image(video, 0, 0, 447, 320);
    pop();

    if (!aboutToCapture) {
      imageMode(CENTER);
      image(frame2, width / 2, height / 2, 447, 332);
    }

    drawStyledButton("tAkE a pHoTo!", buttonX, buttonY, buttonW, buttonH);
    return;
  }

  let elapsed = millis() - animationStartTime;

  if (elapsed > 3000 && filmbackY > targetY) {
    filmbackY -= 2;
    if (filmbackY < targetY) filmbackY = targetY;
  }

  if (filmbackY <= targetY && fadeAmount > 0) {
    fadeAmount -= 5;
    if (fadeAmount < 0) fadeAmount = 0;
  }

  imageMode(CENTER);
  tint(255, fadeAmount);
  image(filmback, width / 2, filmbackY);
  image(polaroid, width / 2, height / 2 + 20);
  noTint();

  if (fadeAmount > 0) return;

  fill(0, 180);
  noStroke();
  rect(0, 0, width, height);

  if (lastMouse) {
    let mv = dist(mouseX, mouseY, lastMouse.x, lastMouse.y);
    if (mv > 5) {
      shakePower += mv;
      capturedImageShowTime -= mv * 10;
      capturedImageShowTime = max(millis(), capturedImageShowTime);
    }
  }
  lastMouse = createVector(mouseX, mouseY);

  let remaining = max(capturedImageShowTime - millis(), 0);

  if (remaining === 0 && !fadeOutStarted) fadeOutStarted = true;
  if (fadeOutStarted && textAlpha > 0) {
    textAlpha -= 1;
    textAlpha = max(0, textAlpha);
  }

  textFont('Arial');
  textStyle(BOLD);
  textSize(20);
  fill(255, textAlpha);
  noStroke();
  textAlign(CENTER, CENTER);
  text(nf(floor(remaining / 60000), 2) + ':' + nf(floor((remaining % 60000) / 1000), 2), width / 2, height / 2 - 190);
  text("\n\n\n dEvElOpInG ・ ・ ・ \n _- wait for 5 minutes -_ \n\n - - - -\n cAn'T wAiT?\n\n ▹‣ ◁ shake the photo left and right with your mouse‣ ◀︎ ◁\n until the timer disappears!", width / 2, height / 2 + 250);

  if (capturedImage) {
    let total = capturedImageShowDelay;
    let passed = millis() - (capturedImageShowTime - total);
    let a = map(passed, 0, total, 0, 255);
    a = constrain(a, 0, 255);
    tint(255, a);
    image(capturedImage, width / 2, height / 2, 447, 332);
    noTint();
  }

  if (capturedImage && millis() >= capturedImageShowTime) {
    if (isShaking) {
      noiseAlpha = min(noiseAlpha + 5, 255);
    }
    if (noiseAlpha > 0) {
      tint(255, noiseAlpha);
      image(noiseImage, width / 2, height / 2, 447, 280);
      noTint();
    }
  }

  if (isShaking) {
    let shakeAmt = (mouseX - shakingStartX) * 0.05;
    push();
    translate(shakeAmt, 0);
    image(polaroidframe, width / 2, height / 2);
    pop();
  } else {
    image(polaroidframe, width / 2, height / 2);
  }

  if (textAlpha === 0) {
    drawStyledButton("sAvE", saveButtonX, saveButtonY, saveButtonW, saveButtonH);
    drawStyledButton("tAkE nEw pHoToS", takeNewButtonX, takeNewButtonY, takeNewButtonW, takeNewButtonH);
  }

  if (flashAlpha > 0) {
    fill(255, flashAlpha);
    rect(0, 0, width, height);
    flashAlpha -= flashDecay;
  }
}

function mousePressed() {
  let left = width / 2 - polaroidframe.width / 2;
  let right = width / 2 + polaroidframe.width / 2;
  let top = height / 2 - polaroidframe.height / 2;
  let bottom = height / 2 + polaroidframe.height / 2;
  if (mouseX > left && mouseX < right && mouseY > top && mouseY < bottom) {
    isShaking = true;
    shakingStartX = mouseX;
  }

  if (mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH && !showCaptured) {
    aboutToCapture = true;

    if (shutterSound && shutterSound.isLoaded()) {
      shutterSound.play();
    }

    setTimeout(() => {
      capturedImage = get(width / 2 - 223.5, height / 2 - 166, 447, 332);
      showCaptured = true;
      animationStartTime = millis();
      capturedImageShowTime = millis() + capturedImageShowDelay;
      filmbackY = height / 2 + 90;
      fadeAmount = 255;
      noiseAlpha = 0;
      lastMouse = null;
      flashAlpha = 80;
      aboutToCapture = false;
      polaroidSoundPlayed = false;

      // 🎵 사운드 2.3초 지연 재생
      setTimeout(() => {
        if (takingPolaroidSound && takingPolaroidSound.isLoaded() && !polaroidSoundPlayed) {
          takingPolaroidSound.play();
          polaroidSoundPlayed = true;
        }
      }, 2300);

    }, 50);
  }

  if (textAlpha === 0 &&
    mouseX > saveButtonX && mouseX < saveButtonX + saveButtonW &&
    mouseY > saveButtonY && mouseY < saveButtonY + saveButtonH) {
    clickSound.setVolume(9.0); // 클릭 사운드 볼륨 설정
    clickSound.play(); // 클릭 사운드 재생

    let pg = createGraphics(447, 320);
    pg.background(255);
    pg.image(capturedImage, 0, 0, 447, 332);
    if (noiseAlpha > 0) pg.image(noiseImage, 0, 0, 447, 280);
    pg.image(polaroidframe, 0, 0, 447, 320);

    let timestamp = getTimestamp();
    pg.textFont('Courier');
    pg.textSize(16);
    pg.fill(0);
    pg.textAlign(CENTER, BOTTOM);
    pg.text(timestamp, 447 / 2, 310);

    save(pg, 'shakeaphoto.png');
    flashAlpha = 80;
  }

  if (textAlpha === 0 &&
    mouseX > takeNewButtonX && mouseX < takeNewButtonX + takeNewButtonW &&
    mouseY > takeNewButtonY && mouseY < takeNewButtonY + takeNewButtonH) {
    clickSound.setVolume(9.0); // 클릭 사운드 볼륨 설정
    clickSound.play(); // 클릭 사운드 재생

    resetCaptureState();
    flashAlpha = 80;
  }
}

function mouseReleased() {
  isShaking = false;
}

function resetCaptureState() {
  showCaptured = false;
  capturedImage = null;
  animationStartTime = null;
  fadeOutStarted = false;
  fadeAmount = 255;
  textAlpha = 255;
  shakePower = 0;
  noiseAlpha = 0;
  lastMouse = null;
  filmbackY = height / 2 + 90;
  video.show();
  polaroidSoundPlayed = false;
}

function drawStyledButton(label, x, y, w, h) {
  noFill();
  stroke(255);
  strokeWeight(2.5);
  rect(x, y, w, h, 50);
  noStroke();
  fill(255);
  textFont('Arial');
  textSize(21);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);
}

function getTimestamp() {
  let now = new Date();
  let yyyy = now.getFullYear();
  let mm = nf(now.getMonth() + 1, 2);
  let dd = nf(now.getDate(), 2);
  let hh = nf(now.getHours(), 2);
  let min = nf(now.getMinutes(), 2);
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}
