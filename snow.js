class Snow {
    constructor(x, y, s) {
        this.x = x;
        this.y = y;
        this.s = s;
        this.xv = 0;
        this.yv = Math.random() * 0.3 + 0.5;
        this.xvmult = Math.random() * 0.5 + 0.8;
        this.dying = false;
        this.grounded = false;
        this.lifetime = false;
    }

    init(color) {
        let el = document.createElement("div");
        el.style.width = el.style.height = this.s;
        el.style.borderRadius = "100%";
        el.style.position = "absolute";
        el.style.width = `${this.s}px`;
        el.style.height = `${this.s}px`;
        el.style.backgroundColor = color;
        el.style.top = `${this.y}%`;
        el.style.left = `${this.x}%`;
        el.style.zIndex = "999";
        el.id = `f${(Math.random() * 1000000000).toFixed(0).toString(25)}`;
        this.id = el.id;
        document.body.append(el);
        this.el = el;
    }

    update() {
        this.xv = (mouseX - window.innerWidth / 2) / window.innerWidth * 2 * this.xvmult;

        if (!this.grounded) {
            this.x += this.xv;
            this.y += this.yv;
        }

        if (this.y > 0 && !this.lifetime) this.lifetime = performance.now() + Math.random() * 2500 + 2000;

        if (this.y > 98.5) this.grounded = true;

        if (this.x > 99) this.x = 1;
        if (this.x < 1) this.x = 99;

        let bodyReference = document.querySelector(`#${this.el.id}`);

        bodyReference.style.top = `${this.y}%`;
        this.el.style.top = `${this.y}%`;
        bodyReference.style.left = `${this.x}%`;
        this.el.style.left = `${this.x}%`;
    }

    die() {
        this.dying = true;
        if (this.el.style.scale > 0.1) {
            setTimeout(() => {
                this.el.style.scale *= 0.75;
                this.die();
            }, 30)
        } else {
            this.x = Math.random() * 100;
            this.y = Math.random() * 100 - 100;
            this.yv = Math.random() * 0.1 + 0.5;
            this.xvmult = Math.random() * 0.15 + 1;
            this.dying = false;
            this.grounded = false;
            this.lifetime = false;
            this.el.style.scale = "1";
        }
    }
}

let mouseX = window.innerWidth / 2;

const snow = (num = 50, colors = ["#fff"]) => {
    if (window.snows) return;
    window.snows = [];
    
    for (let i = 0; i < num; i++) {
        let particle = new Snow(Math.random() * 100, Math.random() * 150 - 100, Math.random() * 5 + 2);
        particle.init(colors[Math.floor(Math.random() * colors.length)]);
        window.snows.push(particle);
    }

    update(window.snows);
}

const update = (snow) => {
    for (const particle of snow) {
        if (particle.lifetime && performance.now() > particle.lifetime) {
            if (!particle.dying) {
                particle.el.style.scale = 1;
                particle.die();
            }
        }
        particle.update();
    }

    setTimeout(() => requestAnimationFrame(() => {
        update(snow);
    }), 5);
}

window.onmousemove = (e) => mouseX = e.clientX;
