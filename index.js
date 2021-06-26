//========================================
// ＊＊＊クラス＊＊＊（本当は別ファイルに分ける）
//========================================
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
    // キャラと敵のオブジェクトが入る
    gemeObjects.push(this);
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
    // arr 1回だけ呼び出すとメモリ節約になる
    this.arr = {
      ArrowRight: { x: 20, y: 0 },
      ArrowLeft: { x: -20, y: 0 },
      ArrowDown: { x: 0, y: -20 },
      ArrowUp: { x: 0, y: 20 },
    }
  }
  initialize() {
    window.onkeydown = (e) => {
      if (e.code === "Space") {
        this.shot(e.code);
      } else {
        this.move(e.code);
      }
    }
  }
  move(direction) {
    if (this.arr[direction]) {
      this.x += this.arr[direction].x;
      this.y += this.arr[direction].y;
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
  shot() {
    new Bullet(this.x, this.y, './img/blue_ball.png', 'moon_1');
  }
  update() {
    this.draw();
    this.collision();
    this.isHit();
  }
  isHit() {
    if (this.hit) {
      canvas.classList.add('atari'); //canvasクラスの関心ごとだがキャラクタークラスで操作してる
      charactorLife.setLife();
    } else {
      canvas.classList.remove('atari');
    }
  }
}

// キャラクターが攻撃する
class Bullet extends GameObject {
  constructor(x, y, src, id) {
    super(x, y, src, id)
    this.speed = 20;
    // 弾のサイズを継承ではなくこのクラスで指定
    this.width = 20;
    this.height = 20;
  }
  update() {
    this.y -= 2;
    this.draw();
    this.collision();
  }
  collision() {
    enemies.forEach(enemy => {
      let distance = this.calcDistance(enemy);
      if (distance <= 30 && enemy.isDead === false) {
        enemy.dameged();
      }
    });
    return enemies;
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
    this.originX = this.x;
    this.isDead = false; //初期値はfalseが良い
    this.speed = Math.random() * 2 + 1;
    this.speedX = Math.random() * 2 + 1;
  }
  move() {
    if (this.x > this.originX + 50) {
      this.speedX *= -1;
    } else if (this.x < this.originX - 35) {
      this.speedX *= -1;
    }
    if (this.y > 600) {
      this.y = 0;
    }
    this.x += this.speedX;
    this.y += this.speed;
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
  }
  // オブジェクトの中身を更新
  update() {
    this.move();
    this.draw();
  }
  dameged() {
    this.isDead = true;
    score.add(100);
    gemeObjects = gemeObjects.filter(obj => obj !== this); //自身に一致しない
    enemies = enemies.filter(obj => obj !== this); 
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
        this.form() //とりあえず設定中
        this.saveScore();
        return;
      }
    }, 1000);
  }
  form() {
    form.style.display = 'block';
    overlay.style.display = 'block';
  }

  async saveScore() {
    var params = new URLSearchParams();
    params.append('user_name', userName.value);
    params.append('score', score.value);
    const res = await axios.post('http://localhost:3000/create', params)//クロスオリジンリソースシェアリング
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
      return;
    }
  }
}

// スコアのクラス、
// 画面にスコア表示
class Score {
  constructor() {
    this.value = 0;
    this.scoreId = document.getElementById('score');
    this.scoreId.innerHTML = this.value;
  }
  add(num) {
    this.value += num;
    this.scoreId.innerHTML = this.value;
  }
}


//========================================
// ***各変数設定***(グローバルはなるべくconstだけにする)
//========================================
const canvas = document.getElementById('canvas');
const userName = document.getElementById('js-userName');
const form = document.getElementById('js-form');
const overlay = document.getElementById('js-overlay');
const ctx = canvas.getContext('2d');
let enemies = [];
let gemeObjects = [];
let DefeatedEnemies = [];
const character = new Character(250, 550, './img/business_unicorn_company.png', 'chara_1');
const charactorLife = new CharaLife();
const initialTime = new Timer();
const score = new Score();

//========================================
// ***関数***
//========================================
// 敵の処理
function generateEnemy() {
  for (let i = 0; i < 6; i++) {
    let enemy = new Enemy(Math.random() * 500, 0, './img/fantasy_orc.png', `enemy_${i}`);
    enemies.push(enemy);
  }
}

function mainloop() {
  if (initialTime.isStop) {
    return;
  }

  ctx.clearRect(0, 0, 800, 800);

  gemeObjects.forEach(obj => {
    obj.update();
  })

  requestAnimationFrame(mainloop);
}

//========================================
// 画面ロード時の処理
//========================================
window.onload = function () {
  initialTime.start();
  character.draw();
  generateEnemy();
  mainloop();
}