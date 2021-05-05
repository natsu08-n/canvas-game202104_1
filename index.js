const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let currentSelected = null;
let mode = '';
let characters = [];
let enemies = [];
// 制限時間について
const timerId = document.getElementById('timer');
let LimitTime;

const createBtn = document.getElementById('js-create');
const moveBtn = document.getElementById('js-move');

createBtn.addEventListener("click", (e) => {
  // e.preventDefault();//「クリックしたとき」のデフォルト挙動キャンセル
  window.onkeydown = null;
  mode = 'create';
});

moveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // モードがmoveの時だけonkeydown使うのでこちらに移動
  window.onkeydown = (e) => {
    if (currentSelected === null) {
      return
    }
    ctx.clearRect(0, 0, 800, 800);
    currentSelected.move(e.code);
  }
  mode = 'move'
});

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
  }
  clicked(point) {
    if ((point.x > this.x && this.x + 200 > point.x) && (point.y > this.y && this.y + 200 > point.y)) {
      // console.log('xy座標 ' + this.id);
      // elmObject = this.id;
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
        // console.log("敵と遭遇しました");
        // console.log("chara.hit: " + chara.hit);
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
    this.speed = Math.random() * 5 + 2;
  }
  move() {
    this.x += 0;
    this.y += this.speed;
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    // this.collision();
  }
  
}

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();//getBoundingClientRect();メソッドでキャンバスの座標を取得する
  const point = {
    x: e.clientX,
    y: e.clientY
  }
  if (mode !== 'create') {
    currentSelected = null;
    characters.forEach(chara => {
      chara.clicked(point);
    });
  } else if (mode === 'create') {
    new Character(point.x - 100, point.y - 100, './img/business_unicorn_company.png', 'chara_1');
  }

});

// 敵の処理
function generateEnemy() {
  for (let i = 0; i < 6; i++) {
    let enemy = new Enemy(110 * i, 0, './img/fantasy_orc.png', 'enemy_1');
    enemies.push(enemy);
  }
}

setInterval(generateEnemy, 3000);

function mainloop() {
  let flg = false;
  ctx.clearRect(0, 0, 800, 800);
  // ユニコーンの処理
  characters.forEach(chara => {
    chara.draw();
    if(chara.hit) {
      flg = true;
    }
  });
  // console.log(flg);

  enemies.forEach(enemy => {
    enemy.move();
    enemy.draw();
  })

  if(flg) {
    canvas.classList.add('atari');
  } else {
    canvas.classList.remove('atari');
  }

  requestAnimationFrame(mainloop);
}
mainloop();

function init() {
  LimitTime = 20;
  timerId.innerHTML = LimitTime;
}

function updateTime() {
  setTimeout(function () {
    LimitTime--;
    timerId.innerHTML = LimitTime;
    if (LimitTime < 0) {
      // alert('Game Over!');
      init();
      return;
    }
    updateTime();
  }, 1000);
}

window.onload = function () {
  init();
  updateTime();
}

