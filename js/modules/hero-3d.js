window.QA = window.QA || {};

(function () {
    function initHero3D() {
        const container = document.getElementById('hero-canvas-container');
        if (!container) return;

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xffffff, 20, 50);

        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 30);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 15, 20);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.bias = -0.0001;
        dirLight.shadow.radius = 4;
        scene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0xE0F2FE, 0.5);
        fillLight.position.set(-10, 0, 10);
        scene.add(fillLight);

        const shape = new THREE.Shape();
        const armLen = 0.6;
        const w = 0.12;
        shape.moveTo(-armLen, armLen);
        shape.quadraticCurveTo(0, armLen * 0.3, 0, 0);
        shape.quadraticCurveTo(0, armLen * 0.3, armLen, armLen);
        shape.lineTo(armLen - w, armLen);
        shape.quadraticCurveTo(0, armLen * 0.5 + w, -armLen + w, armLen);
        shape.lineTo(-armLen, armLen);

        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 0.08,
            bevelEnabled: true,
            bevelSegments: 6,
            steps: 1,
            bevelSize: 0.02,
            bevelThickness: 0.02
        });
        geometry.center();

        const arrows = [];
        const group = new THREE.Group();
        scene.add(group);

        const gridX = 24;
        const gridY = 14;
        const spacingX = 2.2;
        const spacingY = 2.2;

        for (let i = 0; i < gridX; i++) {
            for (let j = 0; j < gridY; j++) {
                const xPct = i / gridX;
                const color1 = new THREE.Color(0xFFFFFF);
                const color2 = new THREE.Color(0xFFE4D6);
                const finalColor = color1.clone().lerp(color2, xPct);

                const material = new THREE.MeshPhysicalMaterial({
                    color: finalColor,
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

                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                const x = (i - gridX / 2) * spacingX;
                const y = (j - gridY / 2) * spacingY;

                mesh.position.set(x, y, 0);

                const randomRot = Math.random() * Math.PI * 2;
                mesh.rotation.z = randomRot;

                group.add(mesh);
                arrows.push({
                    mesh: mesh,
                    x: x,
                    y: y,
                    initialRot: randomRot,
                    baseColor: finalColor
                });
            }
        }

        const shadowPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.ShadowMaterial({
                opacity: 0.08,
                color: 0x1F2937
            })
        );
        shadowPlane.position.z = -0.5;
        group.add(shadowPlane);

        let mouse = new THREE.Vector2(-9999, -9999);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const raycaster = new THREE.Raycaster();

        function onMouseMove(event) {
            const rect = container.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        }

        container.addEventListener('mouseleave', () => {
            mouse.x = -9999;
            mouse.y = -9999;
        });

        window.addEventListener('mousemove', onMouseMove);

        function animate() {
            requestAnimationFrame(animate);

            raycaster.setFromCamera(mouse, camera);
            const target = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, target);

            if (target) {
                arrows.forEach(item => {
                    const mesh = item.mesh;

                    const dx = target.x - mesh.position.x;
                    const dy = target.y - mesh.position.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    const radius = 14;
                    const lookAtAngle = Math.atan2(dy, dx) + Math.PI / 2;

                    let targetRotZ = item.initialRot;
                    let targetRotX = 0;
                    let targetRotY = 0;
                    let targetScale = 1.0;

                    if (dist < radius) {
                        const influence = 1 - (dist / radius);
                        const powerInfluence = Math.pow(influence, 2);

                        targetRotZ = lookAtAngle;

                        targetRotX = (dy / radius) * influence * 1.5;
                        targetRotY = -(dx / radius) * influence * 1.5;

                        targetScale = 1.0 + (0.1 * powerInfluence);
                    }

                    let diff = targetRotZ - mesh.rotation.z;
                    while (diff > Math.PI) diff -= Math.PI * 2;
                    while (diff < -Math.PI) diff += Math.PI * 2;

                    if (dist >= radius) {
                        item.initialRot += 0.0005;
                        targetRotZ = item.initialRot;
                        diff = targetRotZ - mesh.rotation.z;
                        while (diff > Math.PI) diff -= Math.PI * 2;
                        while (diff < -Math.PI) diff += Math.PI * 2;
                        mesh.rotation.z += diff * 0.02;

                        mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, 0, 0.05);
                        mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, 0, 0.05);
                    } else {
                        mesh.rotation.z += diff * 0.08;
                        mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetRotX, 0.08);
                        mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetRotY, 0.08);
                    }

                    mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.1));
                });
            }

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });
    }

    window.QA.initHero3D = initHero3D;
})();
