// Confetti animation
class Confetti {
    constructor() {
        this.canvas = document.getElementById('confetti');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#00d4ff', '#ff00ff', '#ffff00', '#00ff88'];
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        const size = Math.random() * 10 + 5;
        return {
            x: Math.random() * this.canvas.width,
            y: -size,
            size: size,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            speed: Math.random() * 2 + 1,
            angle: Math.random() * 6,
            spin: Math.random() * 0.2 - 0.1,
            opacity: 1
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Add new particles
        if (this.particles.length < 100) {
            this.particles.push(this.createParticle());
        }

        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.y += p.speed;
            p.angle += p.spin;
            p.opacity -= 0.005;

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.angle);
            this.ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            this.ctx.restore();

            // Remove particles that are off screen or faded out
            if (p.y > this.canvas.height || p.opacity <= 0) {
                this.particles.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }

    start() {
        this.particles = [];
        this.animate();
    }
}

window.confetti = new Confetti();