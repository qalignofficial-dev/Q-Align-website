window.QA = window.QA || {};

(function () {
    function initVision3D() {
        const canvas = document.getElementById('gridCanvas');
        const container = document.getElementById('alignTrigger');

        if (!canvas || !container) return;

        // Scene Setup
        const scene = new THREE.Scene();
        scene.background = null;

        const camera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 100);
        camera.position.z = 25;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(10, 20, 20);
        scene.add(dirLight);

        const shape = new THREE.Shape();
        const w = 0.35;
        const armLen = 0.6;
        shape.moveTo(0, 0);
        shape.quadraticCurveTo(armLen * 0.5, armLen * 0.5, armLen, armLen);
        shape.lineTo(armLen - w, armLen);
        shape.quadraticCurveTo(0, armLen * 0.3, 0, w);
        shape.quadraticCurveTo(0, armLen * 0.3, -armLen + w, armLen);
        shape.lineTo(-armLen, armLen);
        shape.quadraticCurveTo(-armLen * 0.5, armLen * 0.5, 0, 0);

        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 0.03,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 1,
            bevelSize: 0.005,
            bevelThickness: 0.005
        });
        geometry.center();

        const colorSoft = new THREE.Color(0xFAD7A0);
        const colorPrimary = new THREE.Color(0xE67E22);
        const colorHighlight = new THREE.Color(0xFF9F43);

        const arrows = [];
        const group = new THREE.Group();
        scene.add(group);

        const gridX = 20;
        const gridY = 10;
        const spacingX = 1.8;
        const spacingY = 1.8;

        for (let i = 0; i < gridX; i++) {
            for (let j = 0; j < gridY; j++) {
                const material = new THREE.MeshPhysicalMaterial({
                    color: colorSoft,
                    roughness: 0.4,
                    metalness: 0.1,
                    transmission: 0.0,
                    transparent: true,
                    opacity: 1.0,
                    side: THREE.DoubleSide
                });

                const mesh = new THREE.Mesh(geometry, material);

                const x = (i - gridX / 2) * spacingX + 0.9;
                const y = (j - gridY / 2) * spacingY + 0.9;

                mesh.position.set(x, y, 0);
                group.add(mesh);

                const distFromCenter = Math.sqrt(x * x + y * y);
                const maxDist = 20;
                const staticOpacity = Math.max(0.3, 1.0 - (distFromCenter / maxDist) * 0.8);

                material.opacity = staticOpacity;

                arrows.push({
                    mesh: mesh,
                    x: x,
                    y: y,
                    baseOpacity: staticOpacity,
                    initialRot: 0
                });
            }
        }

        let mouse = new THREE.Vector2(-9999, -9999);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const raycaster = new THREE.Raycaster();

        const onMouseMove = (event) => {
            const rect = container.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            container.style.setProperty('--x', x + 'px');
            container.style.setProperty('--y', y + 'px');
        };

        const onMouseLeave = () => {
            mouse.x = -9999;
            mouse.y = -9999;
        };

        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseleave', onMouseLeave);

        function animate() {
            requestAnimationFrame(animate);

            raycaster.setFromCamera(mouse, camera);
            const target = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, target);

            const hasMouse = (mouse.x !== -9999);

            arrows.forEach(item => {
                const mesh = item.mesh;
                let targetRot = item.initialRot;
                let targetScale = 1.0;
                let targetColor = colorSoft;
                let targetOpacity = item.baseOpacity;
                let targetEmissive = new THREE.Color(0x000000);

                if (hasMouse) {
                    const dx = target.x - mesh.position.x;
                    const dy = target.y - mesh.position.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) + Math.PI / 2;

                    targetRot = angle;

                    const radius = 12;
                    if (dist < radius) {
                        const influence = 1 - (dist / radius);
                        const easeInfluence = Math.pow(influence, 2);

                        targetScale = 1.0 + (easeInfluence * 0.5);

                        if (influence < 0.7) {
                            const t = influence / 0.7;
                            targetColor = colorSoft.clone().lerp(colorPrimary, t);
                        } else {
                            const t = (influence - 0.7) / 0.3;
                            targetColor = colorPrimary.clone().lerp(colorHighlight, t);
                            targetEmissive.setHex(0xFF9F43).multiplyScalar(t * 0.6);
                        }

                        targetOpacity = THREE.MathUtils.lerp(item.baseOpacity, 1.0, easeInfluence);
                    }
                }

                let diff = targetRot - mesh.rotation.z;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                mesh.rotation.z += diff * 0.1;

                mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.1));
                mesh.material.color.lerp(targetColor, 0.1);
                mesh.material.opacity += (targetOpacity - mesh.material.opacity) * 0.1;
                mesh.material.emissive.lerp(targetEmissive, 0.1);
            });

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);

            // Re-init HeroVisuals (2D Effect) here if needed, or in main.
            // Note: HeroVisuals is now global `HeroVisuals`
            if (typeof HeroVisuals !== 'undefined') {
                new HeroVisuals('hero-canvas');
            }
        });
    }

    window.QA.initVision3D = initVision3D;
})();
