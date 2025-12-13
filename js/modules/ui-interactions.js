window.QA = window.QA || {};

(function () {
    function initUIInteractions() {
        initStatsAnimation();
        initBetaModal();
        initBrandingRemoval();
    }

    function initStatsAnimation() {
        const stats = document.querySelectorAll('.big-stat');

        if (stats.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseInt(el.dataset.val);
                        if (!target) return;

                        let start = 0;
                        const duration = 1500;
                        const startTime = performance.now();

                        function animate(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const ease = 1 - Math.pow(1 - progress, 3);

                            const current = Math.floor(start + (target * ease));
                            el.innerText = current + "%";

                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            }
                        }
                        requestAnimationFrame(animate);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });

            stats.forEach(stat => observer.observe(stat));
        }
    }

    function initBetaModal() {
        const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzqSyLjHGfgOz9KaxEU7ejfAi0xqVdyN7ixvXoPz_dLFiqjj3zyuLGP0iXKqAajuXHBFg/exec";

        const modal = document.getElementById('betaModal');
        const heroBtn = document.querySelector('.hero .btn');
        const ctaBtn = document.querySelector('.btn-cta-primary');
        const closeBtn = document.querySelector('.modal-close');
        const betaForm = document.getElementById('betaForm');

        function openModal(e) {
            if (e) e.preventDefault();
            if (modal) modal.classList.add('active');
        }

        function closeModal() {
            if (modal) modal.classList.remove('active');
        }

        if (heroBtn) heroBtn.addEventListener('click', openModal);
        if (ctaBtn) ctaBtn.addEventListener('click', openModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }

        if (betaForm) {
            betaForm.addEventListener('submit', (e) => {
                if (GOOGLE_SCRIPT_URL === "YOUR_SCRIPT_URL_HERE" || GOOGLE_SCRIPT_URL === "") {
                    e.preventDefault();
                    alert("아직 구글 시트 연동이 설정되지 않았습니다.\n개발자에게 전달받은 URL을 js/main.js 파일에 입력해주세요.");
                    return;
                }

                const submitBtn = betaForm.querySelector('button');
                submitBtn.innerText = "저장 중...";
                submitBtn.disabled = true;

                betaForm.action = GOOGLE_SCRIPT_URL;
                betaForm.method = "POST";
                betaForm.target = "hidden_iframe";

                setTimeout(() => {
                    alert(`[베타 신청 완료]\n성공적으로 저장되었습니다. 감사합니다!`);
                    closeModal();
                    betaForm.reset();
                    submitBtn.innerText = "신청하기";
                    submitBtn.disabled = false;
                }, 1500);
            });
        }
    }

    function initBrandingRemoval() {
        const brandingObserver = new MutationObserver((mutations) => {
            const brands = document.querySelectorAll('a[href*="unicorn.studio"], [data-us-branding]');
            brands.forEach(el => {
                el.style.display = 'none !important';
                el.remove();
            });

            const possibleOverlays = document.querySelectorAll('#hero-canvas-container div, #hero-canvas-container span, #hero-canvas-container h1, #hero-canvas-container h2');
            possibleOverlays.forEach(el => {
                if (el.innerText && el.innerText.toLowerCase().includes('ostracized')) {
                    el.style.display = 'none !important';
                    el.remove();
                }
            });
        });

        brandingObserver.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            const brands = document.querySelectorAll('a[href*="unicorn.studio"]');
            brands.forEach(el => el.remove());
        }, 500);
        setTimeout(() => {
            const brands = document.querySelectorAll('a[href*="unicorn.studio"]');
            brands.forEach(el => el.remove());
        }, 2000);
    }

    window.QA.initUIInteractions = initUIInteractions;
})();
