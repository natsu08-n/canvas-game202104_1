const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let currentSelected = null;
let mode = '';
let characters = [];

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
    // console.log(currentSelected);
    // if (currentSelected.x < 300 && currentSelected.y < 300) {
    //   alert("敵と遭遇");
    // }
  }
  mode = 'move'
});

// ユニコーンのクラス
class Character {
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
    this.speed = 20;
    this.image.onload = () => this.draw();
    characters.push(this);
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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
  }
}

// 敵（オーク）のクラス
class Enemy {
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
  move() {
    this.x += 1;
    this.y += 1;
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    this.collision();
  }
  collision() {
    characters.forEach(chara => {
      //敵との当たり判定（2点間の中心座標の距離）
      let distance = Math.pow(this.x - chara.x, 2) + Math.pow(this.y - chara.y, 2);
      // console.log(chara.x);
      // console.log(this.x);
      let sqrt = Math.sqrt(distance);
      console.log(sqrt);
      if(sqrt < 50) {
        alert("hit!");
      }
      // console.log(distance);
    });
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

// window.onload = function(){
//   const enemyImg = new Enemy(400, 400, './img/fantasy_orc.png', 'enemy_1');
//   console.log(enemyImg);
//   // enemyImg.draw();ここで描けない
// }

// 敵の処理
const enemyImg = new Enemy(100, 100, './img/fantasy_orc.png', 'enemy_1');

function mainloop() {
  ctx.clearRect(0, 0, 800, 800);
  // ユニコーンの処理
  characters.forEach(chara => {
    chara.draw();
  });

  // console.log(enemyImg);
  enemyImg.move();
  enemyImg.draw(); //今の指定だとx座標が100,y座標が100

  requestAnimationFrame(mainloop);
}
mainloop();