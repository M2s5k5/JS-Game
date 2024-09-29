//neprijatelji

class StrongOrange {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30; // ili drugačija veličina
        this.height = 30;
        this.color = 'orange';
        this.speed = 2; // Brži od drugih neprijatelja
        this.bullets = [];
    }

    move() {
        // Kretanje neprijatelja (po potrebi prilagodi logiku)
        this.y += this.speed;
    }

    shoot() {
        this.bullets.push({ 
            x: this.x + this.width / 2, 
            y: this.y + this.height, 
            dy: 3 // ili druga brzina
        });
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
