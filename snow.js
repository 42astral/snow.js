class Snow {
	constructor(x, y, s) {
		this.x = x;
		this.y = y;
		this.s = s;
		this.xv = 0;
		this.yv = Math.random() * 0.55 + 0.5;
		this.xvmult = Math.random() * 0.5 + 0.8;
		this.dying = false;
		this.grounded = false;
		this.dietime = false;
	}

	init(color) {        
		let el = document.createElement("div");
		el.style.width = el.style.height = this.s;
		el.style.borderRadius = "100%";
		el.style.position = "absolute";
		el.style.width = `${this.s}px`;
		el.style.height = `${this.s}px`;
		el.style.backgroundColor = color;
		el.style.bottom = `${100 - this.y}%`;
		el.style.left = `${this.x}%`;
		el.style.zIndex = "999";
		document.body.append(el);
		this.el = el;
	}

	update() {
		this.xv = (mouseX - window.innerWidth / 2) / window.innerWidth * 2 * this.xvmult;

		if (!this.grounded) {
			this.x += this.xv;
			this.y += this.yv;
		}
	
		if (this.y > 97) {
			this.grounded = true;
			this.y = 99 - (window.innerHeight - this.s) / window.innerHeight;
		}

		if (this.x > 99) this.x = 1;
		if (this.x < 1) this.x = 99;

		this.el.style.bottom = `${100 - this.y}%`;
		this.el.style.left = `${this.x}%`;
	}

	die() {
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
			this.dietime = false;
			this.el.style.scale = "1";
		}
	}
}

let mouseX = window.innerWidth / 2;

let now;
let frameInterval;
let then;

const snow = (num = 50, colors = ["#fff"]) => {
	if (window.ran) return;
	window.ran = true;
	
	let snows = [];
	
	for (let i = 0; i < num; i++) {
		let particle = new Snow(Math.random() * 100, Math.random() * 300 - 300, Math.random() * 5 + 2);
		particle.init(colors[Math.floor(Math.random() * colors.length)]);
		snows.push(particle);
	}

	update(snows);
}

const update = (snow) => {
	requestAnimationFrame(() => {
		update(snow);
	})
	
	for (const particle of snow) {
		if (particle.grounded) {
			if (!particle.dying) particle.el.style.scale = "1";
			if (!particle.dietime) {
				particle.dying = true;
				particle.dietime = performance.now() + Math.random() * 800 + 300;
			};
			if (particle.dietime && performance.now() > particle.dietime) particle.die()
		}
		particle.update();
	}
}

window.onmousemove = (e) => mouseX = e.clientX;
