window.QA = window.QA || {};

(function () {
    function initROICalculator() {
        const teamInput = document.querySelector('.team-size-input');
        const roiSlider = document.getElementById('roiSlider');
        const costResult = document.querySelector('.cost-result');

        const PER_PERSON_COST = 696000;
        let currentCost = 0;

        function updateCost(source) {
            if (!teamInput || !costResult || !roiSlider) return;

            let val;

            if (source === 'slider') {
                val = parseInt(roiSlider.value);
                teamInput.value = val;
            } else {
                val = parseInt(teamInput.value);
                if (isNaN(val) || val < 1) val = 1;
                if (val > 1000) val = 1000;
                roiSlider.value = val;
            }

            const percentage = ((val - 1) / (1000 - 1)) * 100;
            roiSlider.style.background = `linear-gradient(to right, #F46A36 ${percentage}%, #444 ${percentage}%)`;

            const targetCost = val * PER_PERSON_COST;

            // Use QA.utils
            window.QA.utils.animateValue(currentCost, targetCost, 800, (val) => {
                currentCost = val;
                costResult.innerText = Math.floor(val).toLocaleString() + "원";
            });
        }

        if (teamInput && roiSlider) {
            updateCost('slider');
            teamInput.addEventListener('input', () => updateCost('input'));
            roiSlider.addEventListener('input', () => updateCost('slider'));
        }
    }

    window.QA.initROICalculator = initROICalculator;
})();
