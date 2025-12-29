window.QA = window.QA || {};

(function () {
    // Utilities
    function animateValue(start, end, duration, onUpdate, onComplete) {
        if (start === end) {
            if (onUpdate) onUpdate(end, 1);
            if (onComplete) onComplete();
            return;
        }

        const range = end - start;
        const startTime = performance.now();
        let animationFrameId;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            const current = start + (range * ease);

            if (onUpdate) onUpdate(current, progress);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(update);
            } else {
                if (onComplete) onComplete();
            }
        }

        animationFrameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationFrameId);
    }

    function lerpColor(a, b, amount) {
        const ah = parseInt(a.replace(/#/g, ''), 16),
            ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
            bh = parseInt(b.replace(/#/g, ''), 16),
            br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);
        return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + (rb | 0)).toString(16).slice(1);
    }

    // Attach to Namespace
    window.QA.utils = {
        animateValue,
        lerpColor
    };
})();
