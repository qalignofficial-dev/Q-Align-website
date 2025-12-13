/* V8 JS Logic */
document.addEventListener('DOMContentLoaded', () => {

    /* ROI Calculator */
    const teamInput = document.querySelector('.team-size-input');
    const roiSlider = document.getElementById('roiSlider');
    const costResult = document.querySelector('.cost-result');

    // Logic: 696,000 KRW per person per month
    const PER_PERSON_COST = 696000;

    let currentCost = 0;
    let animationFrameId;

    function animateValue(start, end, duration) {
        if (start === end) return;
        const range = end - start;
        const startTime = performance.now();

        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            currentCost = start + (range * ease);
            costResult.innerText = Math.floor(currentCost).toLocaleString() + "원";

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(update);
            }
        }
        animationFrameId = requestAnimationFrame(update);
    }

    function updateCost(source) {
        if (!teamInput || !costResult || !roiSlider) return;

        let val;

        // Bidirectional Sync
        if (source === 'slider') {
            val = parseInt(roiSlider.value);
            teamInput.value = val;
        } else {
            val = parseInt(teamInput.value);
            if (isNaN(val) || val < 1) val = 1;
            if (val > 1000) val = 1000; // Cap at max
            roiSlider.value = val;
        }

        // Update Slider Background (Orange Fill on Left)
        const percentage = ((val - 1) / (1000 - 1)) * 100;
        roiSlider.style.background = `linear-gradient(to right, #F46A36 ${percentage}%, #444 ${percentage}%)`;

        // Update Text with Animation
        const targetCost = val * PER_PERSON_COST;
        animateValue(currentCost, targetCost, 800);
    }

    if (teamInput && roiSlider) {
        // Initial State
        updateCost('slider');

        // Events
        teamInput.addEventListener('input', () => updateCost('input'));
        roiSlider.addEventListener('input', () => updateCost('slider'));
    }

    /* Network Graph Animation (Restored) */
    const nCanvas = document.getElementById('networkCanvas');
    if (nCanvas) {
        const nCtx = nCanvas.getContext('2d');
        let nTime = 0;
        function drawNetwork() {
            nCtx.clearRect(0, 0, 450, 450); nTime += 0.02;
            let count = 3 + (nTime % 18); if (count > 20) count = 3;
            const nodes = [];
            for (let i = 0; i < count; i++) {
                let a = i / count * Math.PI * 2;
                nodes.push({ x: 225 + Math.cos(a) * 140, y: 225 + Math.sin(a) * 140 });
            }
            nCtx.strokeStyle = `rgba(244, 106, 54, ${Math.max(0.1, 2 / count)})`;
            nCtx.lineWidth = 0.5; nCtx.beginPath();
            for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
                nCtx.moveTo(nodes[i].x, nodes[i].y); nCtx.lineTo(nodes[j].x, nodes[j].y);
            }
            nCtx.stroke();
            nodes.forEach(n => { nCtx.beginPath(); nCtx.arc(n.x, n.y, 4, 0, Math.PI * 2); nCtx.fillStyle = '#F46A36'; nCtx.fill(); });
            requestAnimationFrame(drawNetwork);
        }
        drawNetwork();
    }

    /* Team Matrix Graph Animation */
    const mCanvas = document.getElementById('matrixCanvas');
    if (mCanvas) {
        const mCtx = mCanvas.getContext('2d');
        let mTime = 0;

        // Data Points (Adjusted to avoid text overlap)
        const members = [
            { name: "정수영 PO", role: "Self-Driven", x: 380, y: 100, color: "#22C55E", status: "ok" }, // Moved up
            { name: "이병수 FE", role: "Bottleneck", x: 180, y: 180, color: "#EAB308", status: "warn" }, // Moved down-right
            { name: "민상희 PMM", role: "Risk", x: 440, y: 240, color: "#EF4444", status: "danger" },
            { name: "이명희 BE", role: "Stagnant", x: 80, y: 380, color: "#22C55E", status: "ok" }, // Moved left
            { name: "박명철 PM", role: "Stagnant", x: 220, y: 420, color: "#22C55E", status: "ok" }, // Moved down
            { name: "김철수 Des", role: "Misaligned", x: 320, y: 380, color: "#EAB308", status: "warn" }, // Moved left
            { name: "김용주 Des", role: "Misaligned", x: 450, y: 450, color: "#22C55E", status: "ok" }, // Moved corner
        ];

        // Hover state
        let hoveredMember = null;
        mCanvas.addEventListener('mousemove', (e) => {
            const rect = mCanvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            hoveredMember = null;
            members.forEach(m => {
                const dx = mouseX - m.currX;
                const dy = mouseY - m.currY;
                if (dx * dx + dy * dy < 400) {
                    hoveredMember = m;
                }
            });
        });

        function drawMatrix() {
            mCtx.clearRect(0, 0, 500, 500);
            mTime += 0.01;

            // Background Grid (Darker for White Theme)
            mCtx.strokeStyle = "rgba(0,0,0,0.06)";
            mCtx.lineWidth = 1;

            // X-Axis
            mCtx.beginPath(); mCtx.moveTo(20, 250); mCtx.lineTo(480, 250); mCtx.stroke();
            mCtx.fillStyle = "#999"; mCtx.font = "12px Pretendard"; mCtx.fillText("실행 모멘텀 ▶", 420, 245);

            // Y-Axis
            mCtx.beginPath(); mCtx.moveTo(250, 480); mCtx.lineTo(250, 20); mCtx.stroke();
            mCtx.fillStyle = "#999"; mCtx.fillText("가치 확신 ▲", 255, 30);

            // Quadrant Text Helper
            function drawQuadText(title, desc, x, y) {
                mCtx.font = "700 16px Pretendard";
                mCtx.fillStyle = "rgba(0,0,0,0.15)"; // Title color
                mCtx.textAlign = "center";
                mCtx.fillText(title, x, y);

                mCtx.font = "400 13px Pretendard";
                mCtx.fillStyle = "rgba(0,0,0,0.1)"; // Desc color
                mCtx.fillText(desc, x, y + 20);

                mCtx.textAlign = "left"; // Reset
            }

            // Draw Quadrant Labels (Background)
            drawQuadText("Bottleneck (실행 병목)", "의욕은 높으나 장애물에 막힌 상태", 125, 125);
            drawQuadText("Self-Driven (주도적 몰입)", "높은 확신을 가지고 거침없이 실행하는 상태", 375, 125);
            drawQuadText("Stagnant (동기 정체)", "방향도 잃고, 실행할 에너지도 부족한 상태", 125, 375);
            drawQuadText("Misaligned (방향 점검)", "열심히 달리지만, 엉뚱한 곳을 향하는 상태", 375, 375);

            // Draw Members
            members.forEach((m, i) => {
                // Floating Animation
                const floatY = Math.sin(mTime + i) * 5;
                m.currX = m.x;
                m.currY = m.y + floatY;

                // Draw Point
                mCtx.beginPath();
                mCtx.arc(m.currX, m.currY, hoveredMember === m ? 10 : 6, 0, Math.PI * 2);
                mCtx.fillStyle = m.color;
                mCtx.fill();

                // Ring effect
                mCtx.beginPath();
                mCtx.arc(m.currX, m.currY, hoveredMember === m ? 16 : 10, 0, Math.PI * 2);
                mCtx.strokeStyle = m.color;
                mCtx.lineWidth = 2;
                mCtx.stroke();

                // Draw Name (Dark Text)
                mCtx.fillStyle = "#333";
                mCtx.font = "14px Pretendard";
                mCtx.textAlign = "center";
                mCtx.fillText(m.name, m.currX, m.currY + 25);
                mCtx.textAlign = "left"; // Reset
            });

            requestAnimationFrame(drawMatrix);
        }
        drawMatrix();
    }
    /* 11. Alignment Vision 3D (Milky Glass Boomerangs) */
    function initVision3D() {
        const canvas = document.getElementById('gridCanvas');
        const container = document.getElementById('alignTrigger');

        if (!canvas || !container) return;

        // Scene Setup
        const scene = new THREE.Scene();
        // Transparent background to blend with section
        scene.background = null;

        // Camera
        const camera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 100);
        camera.position.z = 25;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lighting (Matching Hero: Soft Studio)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(10, 20, 20);
        dirLight.castShadow = true;
        scene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0xE0F2FE, 0.8); // Cool fill
        fillLight.position.set(-10, 0, 10);
        scene.add(fillLight);

        // Geometry: Boomerang (Smaller for Vision)
        const shape = new THREE.Shape();
        const w = 0.35; // Thinner
        const armLen = 0.6; // Smaller size
        // V-shape pointing UP initially (0,0 is bottom tip)
        shape.moveTo(0, 0);
        shape.quadraticCurveTo(armLen * 0.5, armLen * 0.5, armLen, armLen);
        shape.lineTo(armLen - w, armLen);
        shape.quadraticCurveTo(0, armLen * 0.3, 0, w);
        shape.quadraticCurveTo(0, armLen * 0.3, -armLen + w, armLen);
        shape.lineTo(-armLen, armLen);
        shape.quadraticCurveTo(-armLen * 0.5, armLen * 0.5, 0, 0);

        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 0.03, // Thinner (was 0.06)
            bevelEnabled: true,
            bevelSegments: 2, // Sharper edges (was 4)
            steps: 1,
            bevelSize: 0.005, // Tight bevel (was 0.015)
            bevelThickness: 0.005 // Tight bevel (was 0.015)
        });
        geometry.center();

        // Grid Variables
        const arrows = [];
        const group = new THREE.Group();
        scene.add(group);

        const gridX = 20; // More density
        const gridY = 10;
        const spacingX = 1.8; // Closer spacing
        const spacingY = 1.8;

        for (let i = 0; i < gridX; i++) {
            for (let j = 0; j < gridY; j++) {
                // Shared Milky Glass Material
                const material = new THREE.MeshPhysicalMaterial({
                    color: 0xFFFFFF,
                    roughness: 0.35,
                    metalness: 0.1,
                    transmission: 0.95,
                    thickness: 1.5,
                    clearcoat: 0.3,
                    clearcoatRoughness: 0.2,
                    transparent: true,
                    opacity: 1.0,
                    side: THREE.DoubleSide
                });

                // Subtle orange tint
                const color1 = new THREE.Color(0xFFFFFF);
                const color2 = new THREE.Color(0xFFE4D6);
                const xPct = i / gridX;
                material.color = color1.clone().lerp(color2, xPct);

                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                const x = (i - gridX / 2) * spacingX + 1.0;
                const y = (j - gridY / 2) * spacingY + 1.0;

                mesh.position.set(x, y, 0);
                group.add(mesh);

                arrows.push({
                    mesh: mesh,
                    x: x,
                    y: y,
                    initialRot: 0
                });
            }
        }

        // Mouse Tracker
        let mouse = new THREE.Vector2(-9999, -9999);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const raycaster = new THREE.Raycaster();

        function onMouseMove(event) {
            const rect = container.getBoundingClientRect(); // Use container rect for CSS vars

            // 3D Mouse Coords (Normalized -1 to +1)
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // CSS Config for Cursor Follower (Pixels)
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            container.style.setProperty('--x', x + 'px');
            container.style.setProperty('--y', y + 'px');
        }

        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseleave', () => {
            mouse.x = -9999;
            mouse.y = -9999;
        });


        // Animation Loop
        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.01;

            // Raycaster for mouse interaction
            raycaster.setFromCamera(mouse, camera);
            const target = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, target);

            arrows.forEach((item, index) => {
                const mesh = item.mesh;

                // Default Properties
                const dxCenter = -mesh.position.x;
                const dyCenter = -mesh.position.y;
                let targetAngle = Math.atan2(dyCenter, dxCenter) + Math.PI / 2; // Reverted to correct focus

                const baseColor = item.baseColor || new THREE.Color(0xFFFFFF); // Use stored base if avail or white
                const activeColor = new THREE.Color(0xF46A36); // Brand Orange confirmed

                let targetColor = new THREE.Color(0xFFFFFF); // Default White/Peach
                if (item.baseColor) targetColor.copy(item.baseColor);

                let targetTransmission = 0.95; // Glass
                let targetEmissive = new THREE.Color(0x000000); // No glow
                let targetScale = 1.0;

                // Mouse Interaction Override
                if (target && mouse.x !== -9999) {
                    const dx = target.x - mesh.position.x;
                    const dy = target.y - mesh.position.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Interaction Radius
                    const hoverRadius = 14;

                    if (dist < hoverRadius) {
                        const influence = 1 - (dist / hoverRadius);
                        const mouseAngle = Math.atan2(dy, dx) + Math.PI / 2; // Point AT cursor

                        targetAngle = mouseAngle;

                        // Active State Props
                        targetScale = 1.0 + influence * 0.3;

                        // Color: White -> Vibrant Orange
                        targetColor.copy(baseColor).lerp(activeColor, influence);
                        // Transmission: Glass -> Solid (0.2)
                        targetTransmission = 0.95 - (influence * 0.75);
                        // Emissive: None -> Orange Glow
                        targetEmissive.setHex(0xFF4400).multiplyScalar(influence * 0.5);
                    }
                }

                // Smooth Updates
                // Rotation
                let diff = targetAngle - mesh.rotation.z;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                mesh.rotation.z += diff * 0.1;

                // Material Props Lerp
                mesh.material.color.lerp(targetColor, 0.1);
                mesh.material.transmission += (targetTransmission - mesh.material.transmission) * 0.1;
                mesh.material.emissive.lerp(targetEmissive, 0.1);

                // Scale
                mesh.scale.setScalar(mesh.scale.x + (targetScale - mesh.scale.x) * 0.1);

                // Subtle Wave/Tilt
                mesh.rotation.x = Math.sin(time * 0.5 + index) * 0.1;
            });

            renderer.render(scene, camera);
        }

        // Resize
        function onWindowResize() {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        }
        window.addEventListener('resize', onWindowResize);

        animate();
    }

    // Initialize
    initVision3D();

    /* Count-Up Animation for Big Stats (Reality) */
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
                        const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out

                        const current = Math.floor(start + (target * ease));
                        el.innerText = current + "%";

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    }
                    requestAnimationFrame(animate);
                    observer.unobserve(el); // Run once
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    /* 14. Beta Signup Modal Logic */
    /* [!] 중요: 아래 URL을 4단계에서 만든 본인의 웹 앱 URL로 바꿔주세요! */
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

    // Close on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Handle Submit (Google Sheets Integration - Hidden Iframe Method)
    if (betaForm) {
        betaForm.addEventListener('submit', (e) => {
            // Check if URL is replaced
            if (GOOGLE_SCRIPT_URL === "YOUR_SCRIPT_URL_HERE" || GOOGLE_SCRIPT_URL === "") {
                e.preventDefault();
                alert("아직 구글 시트 연동이 설정되지 않았습니다.\n개발자에게 전달받은 URL을 js/main.js 파일에 입력해주세요.");
                return;
            }

            const submitBtn = betaForm.querySelector('button');
            submitBtn.innerText = "저장 중...";
            submitBtn.disabled = true;

            // Set Form Attributes for Iframe Submission
            betaForm.action = GOOGLE_SCRIPT_URL;
            betaForm.method = "POST";
            betaForm.target = "hidden_iframe";

            // Add delay to simulate success (since we can't reliably detect iframe load cross-origin)
            setTimeout(() => {
                alert(`[베타 신청 완료]\n성공적으로 저장되었습니다. 감사합니다!`);
                closeModal();
                betaForm.reset();
                submitBtn.innerText = "신청하기";
                submitBtn.disabled = false;
            }, 1500);

            // Let the form submit naturally to the iframe
        });
    }

    // (Old branding observer removed)



    /* Unicorn Studio Branding Removal */
    const brandingObserver = new MutationObserver((mutations) => {
        // Remove "Made with unicorn.studio" badge
        const brands = document.querySelectorAll('a[href*="unicorn.studio"], [data-us-branding]');
        brands.forEach(el => {
            el.style.display = 'none !important';
            el.remove();
        });

        // Attempt to remove "ostracized" text if it appears as an HTML overlay
        // (Note: If this text is inside the WebGL canvas, it cannot be removed via code and must be edited in the project)
        // We can look for overlays with that text
        const possibleOverlays = document.querySelectorAll('#hero-canvas-container div, #hero-canvas-container span, #hero-canvas-container h1, #hero-canvas-container h2');
        possibleOverlays.forEach(el => {
            if (el.innerText && el.innerText.toLowerCase().includes('ostracized')) {
                el.style.display = 'none !important';
                el.remove();
            }
        });
    });

    brandingObserver.observe(document.body, { childList: true, subtree: true });

    // One-time clean immediately (in case it's already there)
    setTimeout(() => {
        const brands = document.querySelectorAll('a[href*="unicorn.studio"]');
        brands.forEach(el => el.remove());
    }, 500);
    setTimeout(() => {
        const brands = document.querySelectorAll('a[href*="unicorn.studio"]');
        brands.forEach(el => el.remove());
    }, 2000); // Check again later

    /* Hybrid Accordion FAQ Logic */
    const faqCategories = document.querySelectorAll('.faq-category-header');
    faqCategories.forEach(header => {
        header.addEventListener('click', () => {
            const category = header.parentElement;
            category.classList.toggle('active');
            const icon = header.querySelector('.category-icon');
            // Icon rotation is handled by CSS via .active class
        });
    });

    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const qna = question.parentElement;
            qna.classList.toggle('active');
        });
    });

});
