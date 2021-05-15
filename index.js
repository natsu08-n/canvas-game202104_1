// ＊＊＊クラス＊＊＊（本当は別ファイルに分ける）
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

// ユニコーンのクラス:キャラクターに対する処理はこちらにまとめるとみやすい
class Character extends GameObject {
  constructor(x, y, src, id) {
    super(x, y, src, id)
    this.speed = 20;
    this.hit = false;
    this.initialize();
  }
  initialize() {
    window.onkeydown = (e) => {
      ctx.clearRect(0, 0, 800, 800);
      this.move(e.code);
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
  update() {
    this.draw();
    this.collision();
    this.isHit()
  }
  isHit() {
    if (this.hit) {
      canvas.classList.add('atari');
      charactorLife.setLife();
    } else {
      canvas.classList.remove('atari');
    }
  }
}

// 敵（オーク）のクラス
class Enemy extends GameObject {
  constructor(x, y, src, id) {
    super(x, y, src, id)
    this.originX = this.x;
    this.speed = Math.random() * 2 + 1;
    this.speedX = Math.random() * 2 + 1;
  }
  move() {
    if(this.x > this.originX + 50) {
      this.speedX *= -1;
    } else if (this.x < this.originX - 35){
      this.speedX *= -1;
    }
    if(this.y > 600) {
      this.y = 0;
    }
    this.x += this.speedX;
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
    this.isStop = false;
  }
  start() {
    this.intervalId = setInterval(() => {
      this.LimitTime--;
      this.timerId.innerHTML = this.LimitTime;
      if (this.LimitTime === 0) {
        clearInterval(this.intervalId);
        this.isStop = true;
        // alert('ゲーム終了')
        return;
      }
    }, 1000);
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
      // console.log("ゲームオーバー");
      return;
    }
  }
}

// 各変数設定(グローバルはなるべくconstだけにしたい)
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const character = new Character(250, 550, './img/business_unicorn_company.png', 'chara_1');
const charactorLife = new CharaLife();
const initialTime = new Timer();
let enemies = [];

// 敵の処理
function generateEnemy() {
  for (let i = 0; i < 6; i++) {
    let enemy = new Enemy(Math.random()* 500, 0, './img/fantasy_orc.png', 'enemy_1');
    enemies.push(enemy);
  }
}

function mainloop() {
  if(initialTime.isStop) {
    return;
  }

  ctx.clearRect(0, 0, 800, 800);
  // ユニコーンの処理
  character.update();

  enemies.forEach(enemy => {
    enemy.move();
    enemy.draw();
  })

  requestAnimationFrame(mainloop);
}


// 画面ロード後処理
window.onload = function () {
  initialTime.start();
  character.draw();
  generateEnemy();
  mainloop();
}

