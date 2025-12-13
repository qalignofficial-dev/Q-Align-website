/* Main Entry Point (Namespaced) */
// Relies on window.QA being populated by previous scripts

document.addEventListener('DOMContentLoaded', () => {
    if (!window.QA) {
        console.error("Critical Error: QA Namespace not found. Scripts loaded out of order?");
        return;
    }

    // 0. Initialize Hero Visuals (2D Background)
    // Make sure it runs!
    if (typeof HeroVisuals !== 'undefined') {
        new HeroVisuals('hero-canvas');
    }

    // 1. ROI Calculator
    if (window.QA.initROICalculator) window.QA.initROICalculator();

    // 2. Charts (Network & Matrix)
    if (window.QA.initCharts) window.QA.initCharts();

    // 3. 3D Visualizations
    if (window.QA.initVision3D) window.QA.initVision3D();
    if (window.QA.initHero3D) window.QA.initHero3D();

    // 4. UI Interactions (Modals, Stats, etc.)
    if (window.QA.initUIInteractions) window.QA.initUIInteractions();
});
