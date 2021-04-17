const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let currentSelected = null;
let mode = '';
let characters = [];

const createBtn = document.getElementById('js-create');
const moveBtn = document.getElementById('js-move');

createBtn.addEventListener("click", (e) => {
  e.preventDefault();//「クリックしたとき」のデフォルト挙動キャンセル
  window.onkeydown = null;
  mode = 'create';
});

moveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // モードがmoveの時だけonkeydown使うのでこちらに移動
  window.onkeydown = (e) => {
    if(currentSelected === null) {
      return
    }
    ctx.clearRect(0, 0, 800, 800);
    if (e.code === "ArrowRight") {
      currentSelected.x += 20;
    } else if (e.code === "ArrowLeft") {
      currentSelected.x -= 20;
    } else if (e.code === "ArrowUp") {
      currentSelected.y += 20;
    } else if (e.code === "ArrowDown") {
      currentSelected.y -= 20;
    }
  }
  mode = 'move'
});

class Character {
  constructor(x, y, src, id) {
    this.x = x;
    this.y = y;
    this.src = src;
    this.id = id;
    this.image = new Image();
    this.image.src = this.src;
    this.image.id = this.id;
    this.image.onload = () => this.draw();
    characters.push(this);
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, 200, 200);
  }
  clicked(point) {
    if((point.x > this.x && this.x + 200 > point.x) &&(point.y > this.y && this.y + 200 > point.y)) {
      console.log('xy座標' + this.id);
      // elmObject = this.id;
      currentSelected = this;
    } 
  }
}

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const point = {
    x: e.clientX,
    y: e.clientY
  }
  if(mode !== 'create') {
    currentSelected = null;
    characters.forEach(chara => {
      chara.clicked(point);
    });
  } else if(mode === 'create'){
    new Character(point.x - 100, point.y - 100, './business_unicorn_company.png', 'chara_1');
  }
});

function mainloop() {
  characters.forEach(chara => {
      chara.draw();
    });
  requestAnimationFrame(mainloop);
}
mainloop();