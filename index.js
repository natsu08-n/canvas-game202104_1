const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let currentSelected = null;
    let mode = 'create';
    let characters = [];

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
        if(point.x > this.x && this.x + 200 > point.x ) {
          console.log('x座標' + this.id);
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
        characters.forEach(chara => {
          chara.clicked(point);
        });
      } else if(mode === 'create'){
        new Character(point.x - 100, point.y - 100, './business_unicorn_company.png', 'chara_1');
      }
    });

    window.onkeydown = (e) => {
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
      // currentSelected.draw();
    }

    function mainloop() {
      characters.forEach(chara => {
          chara.draw();
        });
      // chara1.draw();
      // chara2.draw();
      // chara3.draw();
      requestAnimationFrame(mainloop);
    }
    mainloop();

