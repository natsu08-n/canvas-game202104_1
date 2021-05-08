// 各変数設定
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let currentSelected = null;
let characters = [];
let enemies = [];

// ゲームオブジェクトクラス（共通クラス）
class GameObject {
  constructor(x, y, src, id) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    this.src = src;
    this.id = id;
    this.image = new Image();
    this.image.src = this.src;
    this.image.id = this.id;
    this.image.onload = () => this.draw();
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

// ユニコーンのクラス
class Character extends GameObject {
  constructor(x, y, src, id) {
    super(x, y, src, id)
    this.speed = 20;
    this.hit = false;
    characters.push(this);
    this.initialize();
  }
  initialize() {
    window.onkeydown = (e) => {
      ctx.clearRect(0, 0, 800, 800);
      this.move(e.code);
    }
  }
  clicked(point) {
    if ((point.x > this.x && this.x + 200 > point.x) && (point.y > this.y && this.y + 200 > point.y)) {
      currentSelected = this;
    }
  }
  move(direction) {
    if (direction === "ArrowRight") {
      this.x += 20;
    } else if (direction === "ArrowLeft") {
      this.x -= 20;
    } else if (direction === "ArrowUp") {
      this.y += 20;
    } else if (direction === "ArrowDown") {
      this.y -= 20;
    }
    // centerX,Yを再計算
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    this.collision();
  }
  collision() {
    this.hit = false;
    enemies.forEach(enemy => {
      let distance = this.calcDistance(enemy);
      if (distance <= 30) {
        this.hit = true;
      }
    });
  }
  // 距離を計算するメソッド
  calcDistance(enemy) {
    //敵との当たり判定（2点間の中心座標の距離）
    let sqrt = Math.pow(this.x - enemy.x, 2) + Math.pow(this.y - enemy.y, 2);
    let distance = Math.sqrt(sqrt);
    return distance;
  }
}

// 敵（オーク）のクラス
class Enemy extends GameObject {
  constructor(x, y, src, id) {
    super(x, y, src, id)
    this.speed = Math.random() * 5 + 3;
  }
  move() {
    this.x += 0;
    this.y += this.speed;
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
  }
}

// 制限時間
class Timer {
  constructor() {
    this.timerId = document.getElementById('timer');
    this.LimitTime = 5;
    this.timerId.innerHTML = this.LimitTime;
    this.intervalId = null;
  }
  start() {
    this.intervalId = setInterval(() => {
      this.LimitTime--;
      this.timerId.innerHTML = this.LimitTime;
      if (this.LimitTime === 0) {
        clearInterval(this.intervalId);
        // alert('ゲーム終了')
        return;
      }
    }, 1000);
  }
}

// 敵の処理
function generateEnemy() {
  for (let i = 0; i < 6; i++) {
    let enemy = new Enemy(110 * i, 0, './img/fantasy_orc.png', 'enemy_1');
    enemies.push(enemy);
  }
}

//ユニコーンのライフ設定
class CharaLife {
  constructor() {
    this.lifeCounter = document.getElementsByClassName('js-lifeCount');
    this.lifeCounterValue = this.lifeCounter[0].value;
  }
  setLife() {
    this.lifeCounterValue -= 2;
    this.lifeCounter[0].setAttribute("value", this.lifeCounterValue);

    if (this.lifeCounterValue <= 0) {
      console.log("ゲームオーバー");
      return;
    }
  }
}

function mainloop() {
  let flg = false;
  ctx.clearRect(0, 0, 800, 800);
  // ユニコーンの処理
  characters.forEach(chara => {
    chara.draw();
    if (chara.hit) {
      flg = true;
    }
  });

  enemies.forEach(enemy => {
    enemy.move();
    enemy.draw();
  })

  if (flg) {
    canvas.classList.add('atari');
    const charactorLife = new CharaLife();
    charactorLife.setLife();
  } else {
    canvas.classList.remove('atari');
  }

  requestAnimationFrame(mainloop);
}
mainloop();

// 画面ロード後処理
window.onload = function () {
  const initialTime = new Timer();
  initialTime.start();
  const initialChara = new Character(250, 550, './img/business_unicorn_company.png', 'chara_1');
  initialChara.draw();
  setInterval(generateEnemy, 2000);
}

