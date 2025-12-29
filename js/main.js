/* Main Entry Point (Namespaced) */
// Relies on window.QA being populated by previous scripts

document.addEventListener('DOMContentLoaded', () => {
    if (!window.QA) {
        console.error("Critical Error: QA Namespace not found. Scripts loaded out of order?");
        return;
    }

    // 0. Navigation (Header, Mobile Menu)
    if (window.QA.initNavigation) window.QA.initNavigation();
    if (window.QA.initSmoothScroll) window.QA.initSmoothScroll();

    // 1. ROI Calculator (핵심 전환 요소 - 즉시 초기화)
    if (window.QA.initROICalculator) window.QA.initROICalculator();

    // 2. Charts (Network & Matrix)
    if (window.QA.initCharts) window.QA.initCharts();

    // 3. UI Interactions (Modals, Stats, etc.)
    if (window.QA.initUIInteractions) window.QA.initUIInteractions();
});
