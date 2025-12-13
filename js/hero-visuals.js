class HeroVisuals {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Configuration
        this.config = {
            gridGap: 40,        // Dense grid
            arrowSize: 14,      // Size
            mouseThreshold: 1000,
            baseColor: '#FFD000', // Solid Yellow (matches Active)
            activeColor: '#FFD000', // Solid Yellow
            centerX: window.innerWidth / 2,
            centerY: window.innerHeight / 2
        };

        this.mouse = {
            x: this.config.centerX,
            y: this.config.centerY
        };

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Track mouse
        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        // Loop
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.config.centerX = this.width / 2;
        this.config.centerY = this.height / 2;
    }

    drawChevron(x, y, angle, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);

        this.ctx.beginPath();
        this.ctx.lineWidth = 6;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = color;

        // Draw V shape (chevron pointing right by default, so we rotate 180 to point at target)
        // V shape: (-size, -size) -> (0, 0) -> (-size, size)
        const s = this.config.arrowSize;
        this.ctx.moveTo(-s * 0.5, -s * 0.5);
        this.ctx.lineTo(s * 0.5, 0);
        this.ctx.lineTo(-s * 0.5, s * 0.5);

        this.ctx.stroke();
        this.ctx.restore();
    }

    // Helper to blend two hex colors
    lerpColor(a, b, amount) {
        const ah = parseInt(a.replace(/#/g, ''), 16),
            ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
            bh = parseInt(b.replace(/#/g, ''), 16),
            br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);
        return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + (rb | 0)).toString(16).slice(1);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        const cols = Math.ceil(this.width / this.config.gridGap);
        const rows = Math.ceil(this.height / this.config.gridGap);

        for (let i = 0; i <= cols; i++) {
            for (let j = 0; j <= rows; j++) {
                const x = i * this.config.gridGap;
                const y = j * this.config.gridGap;

                // Calculate angle to mouse
                const dx = this.mouse.x - x;
                const dy = this.mouse.y - y;
                const angle = Math.atan2(dy, dx);

                // Calculate distance from center
                const distFromCenter = Math.sqrt(Math.pow(x - this.config.centerX, 2) + Math.pow(y - this.config.centerY, 2));
                const maxDist = Math.sqrt(Math.pow(this.config.centerX, 2) + Math.pow(this.config.centerY, 2));

                // Optional: Very subtle opacity fade at edges (cleaner look)
                // If user wants NO gradient, we can set opacity to 1.
                // But a slight fade looks better on white. Let's keep it subtle (0.4 to 1.0)
                let opacity = 1 - (distFromCenter / (maxDist * 0.9));
                opacity = Math.max(0.3, opacity); // Min opacity 0.3

                this.ctx.globalAlpha = opacity;
                this.drawChevron(x, y, angle, this.config.activeColor);
                this.ctx.globalAlpha = 1.0; // Reset
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}
