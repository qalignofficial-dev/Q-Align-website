window.QA = window.QA || {};

(function () {
    function initCharts() {
        initNetworkGraph();
        initMatrixGraph();
    }

    function initNetworkGraph() {
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
    }

    function initMatrixGraph() {
        const mCanvas = document.getElementById('matrixCanvas');
        if (mCanvas) {
            const mCtx = mCanvas.getContext('2d');
            let mTime = 0;

            const members = [
                { name: "정수영 PO", role: "Self-Driven", x: 380, y: 100, color: "#22C55E", status: "ok" },
                { name: "이병수 FE", role: "Bottleneck", x: 180, y: 180, color: "#EAB308", status: "warn" },
                { name: "민상희 PMM", role: "Risk", x: 440, y: 240, color: "#EF4444", status: "danger" },
                { name: "이명희 BE", role: "Stagnant", x: 80, y: 380, color: "#22C55E", status: "ok" },
                { name: "박명철 PM", role: "Stagnant", x: 220, y: 420, color: "#22C55E", status: "ok" },
                { name: "김철수 Des", role: "Misaligned", x: 320, y: 380, color: "#EAB308", status: "warn" },
                { name: "김용주 Des", role: "Misaligned", x: 450, y: 450, color: "#22C55E", status: "ok" },
            ];

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

                mCtx.strokeStyle = "rgba(0,0,0,0.06)";
                mCtx.lineWidth = 1;

                mCtx.beginPath(); mCtx.moveTo(20, 250); mCtx.lineTo(480, 250); mCtx.stroke();
                mCtx.fillStyle = "#999"; mCtx.font = "12px Pretendard"; mCtx.fillText("실행 모멘텀 ▶", 420, 245);

                mCtx.beginPath(); mCtx.moveTo(250, 480); mCtx.lineTo(250, 20); mCtx.stroke();
                mCtx.fillStyle = "#999"; mCtx.fillText("가치 확신 ▲", 255, 30);

                function drawQuadText(title, desc, x, y) {
                    mCtx.font = "700 16px Pretendard";
                    mCtx.fillStyle = "rgba(0,0,0,0.15)";
                    mCtx.textAlign = "center";
                    mCtx.fillText(title, x, y);

                    mCtx.font = "400 13px Pretendard";
                    mCtx.fillStyle = "rgba(0,0,0,0.1)";
                    mCtx.fillText(desc, x, y + 20);

                    mCtx.textAlign = "left";
                }

                drawQuadText("Bottleneck (실행 병목)", "의욕은 높으나 장애물에 막힌 상태", 125, 125);
                drawQuadText("Self-Driven (주도적 몰입)", "높은 확신을 가지고 거침없이 실행하는 상태", 375, 125);
                drawQuadText("Stagnant (동기 정체)", "방향도 잃고, 실행할 에너지도 부족한 상태", 125, 375);
                drawQuadText("Misaligned (방향 점검)", "열심히 달리지만, 엉뚱한 곳을 향하는 상태", 375, 375);

                members.forEach((m, i) => {
                    const floatY = Math.sin(mTime + i) * 5;
                    m.currX = m.x;
                    m.currY = m.y + floatY;

                    mCtx.beginPath();
                    mCtx.arc(m.currX, m.currY, hoveredMember === m ? 10 : 6, 0, Math.PI * 2);
                    mCtx.fillStyle = m.color;
                    mCtx.fill();

                    mCtx.beginPath();
                    mCtx.arc(m.currX, m.currY, hoveredMember === m ? 16 : 10, 0, Math.PI * 2);
                    mCtx.strokeStyle = m.color;
                    mCtx.lineWidth = 2;
                    mCtx.stroke();

                    mCtx.fillStyle = "#333";
                    mCtx.font = "14px Pretendard";
                    mCtx.textAlign = "center";
                    mCtx.fillText(m.name, m.currX, m.currY + 25);
                    mCtx.textAlign = "left";
                });

                requestAnimationFrame(drawMatrix);
            }
            drawMatrix();
        }
    }

    window.QA.initCharts = initCharts;
})();
