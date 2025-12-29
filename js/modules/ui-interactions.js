window.QA = window.QA || {};

(function () {
    function initHeroRotation() {
        const el = document.getElementById('hero-catchphrase');
        if (!el) return;
        const phrases = [
            "조직이 흔들리지 않으려면<br>방향이 매일 같아야 해요.",
            "감으로 조직 상태를<br>판단하지 마세요.",
            "기준이 어긋나면<br>실행은 느려집니다.",
            "보이지 않는 조직의 정렬을<br>매일 확인하세요.",
            "오늘 중요한 게,<br>모두에게 같나요?"
        ];
        let idx = 0;
        setInterval(() => {
            el.classList.replace('slide-in-up', 'slide-out-up');
            setTimeout(() => {
                idx = (idx + 1) % phrases.length;
                el.innerHTML = phrases[idx];
                el.classList.replace('slide-out-up', 'slide-in-up');
            }, 500);
        }, 2500);
    }

    function initFAQ() {
        // 1. Toggle Categories
        const categories = document.querySelectorAll('.faq-category-header');
        categories.forEach(header => {
            header.addEventListener('click', () => {
                const category = header.parentElement;
                // Optional: Close others? For now, independent toggling.
                category.classList.toggle('active');
            });
        });

        // 2. Toggle Q&A within Categories
        const questions = document.querySelectorAll('.faq-question');
        questions.forEach(question => {
            question.addEventListener('click', () => {
                const qna = question.parentElement;
                qna.classList.toggle('active');
            });
        });
    }

    function initUIInteractions() {
        initScrollAnimations();
        initStatsAnimation();
        initBetaModal();
        initBrandingRemoval();
        initFAQ();
        initHeroRotation();
    }

    // Dreelio-style scroll animations
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .scale-in, .slide-in-left, .slide-in-right');

        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
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
        const closeBtn = document.querySelector('.modal-close');
        const betaForm = document.getElementById('betaForm');

        // 모달을 여는 모든 CTA 버튼들
        const modalTriggers = document.querySelectorAll('.btn-modal-trigger, .btn-cta-primary');

        function openModal(e) {
            if (e) e.preventDefault();
            if (modal) modal.classList.add('active');
        }

        function closeModal() {
            if (modal) modal.classList.remove('active');
        }

        modalTriggers.forEach(btn => btn.addEventListener('click', openModal));
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }

        if (betaForm) {
            betaForm.addEventListener('submit', (e) => {
                const emailInput = betaForm.querySelector('input[type="email"]');
                const userEmail = emailInput ? emailInput.value.trim() : "";

                // 1. Client-side Duplicate Check
                const appliedEmail = localStorage.getItem('qa_beta_applied_email');
                if (appliedEmail === userEmail) {
                    e.preventDefault();
                    alert("이미 신청이 완료된 이메일입니다.\n감사합니다!");
                    return;
                }

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

                    // 2. Save to LocalStorage
                    if (userEmail) {
                        localStorage.setItem('qa_beta_applied_email', userEmail);
                    }

                    closeModal();
                    betaForm.reset();
                    submitBtn.innerText = "신청하기";
                    submitBtn.disabled = false;
                }, 1500);
            });
        }
    }

    function initBrandingRemoval() {
        // 단순화: MutationObserver 대신 일회성 실행 + 단일 타임아웃
        function removeBranding() {
            const brands = document.querySelectorAll('a[href*="unicorn.studio"], [data-us-branding]');
            brands.forEach(el => el.remove());
        }

        removeBranding();
        setTimeout(removeBranding, 1000);
    }

    window.QA.initUIInteractions = initUIInteractions;
})();
