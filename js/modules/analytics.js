/**
 * Q-ALIGN Google Analytics 4 유틸리티
 * 참조: GA4 통합 설치 가이드
 */

window.QA = window.QA || {};

(function() {
    const GA_MEASUREMENT_ID = 'G-HXVX3FBJYV';

    /**
     * 페이지뷰 기록
     * @param {string} path - 페이지 경로
     * @param {string} title - 페이지 제목
     */
    function logPageView(path, title) {
        if (typeof gtag !== 'function') return;
        gtag('event', 'page_view', {
            page_path: path || window.location.pathname,
            page_title: title || document.title,
            page_location: window.location.href,
        });
    }

    /**
     * 커스텀 이벤트 기록
     * @param {string} eventName - 이벤트 이름
     * @param {object} params - 이벤트 매개변수
     */
    function logEvent(eventName, params = {}) {
        if (typeof gtag !== 'function') return;
        gtag('event', eventName, {
            ...params,
            platform: 'web',
        });
    }

    /**
     * 사용자 속성 설정
     * @param {object} properties - 사용자 속성
     */
    function setUserProperties(properties) {
        if (typeof gtag !== 'function') return;
        gtag('set', 'user_properties', properties);
    }

    // ============================================
    // Q-ALIGN 이벤트 상수
    // ============================================
    const GA_EVENTS = {
        // CTA 클릭
        CTA_CLICK: 'cta_click',

        // 네비게이션
        NAV_CLICK: 'nav_click',

        // 문의
        CONTACT_FORM_VIEW: 'contact_form_view',
        CONTACT_FORM_SUBMIT: 'contact_form_submit',

        // 베타 신청
        BETA_MODAL_OPEN: 'beta_modal_open',
        BETA_SIGNUP: 'beta_signup',

        // ROI 계산기
        ROI_CALCULATOR_USE: 'roi_calculator_use',

        // FAQ
        FAQ_CLICK: 'faq_click',

        // 스크롤
        SCROLL_DEPTH: 'scroll_depth',

        // 외부 링크
        OUTBOUND_CLICK: 'outbound_click',
    };

    // ============================================
    // 이벤트 추적 헬퍼 함수
    // ============================================

    /**
     * CTA 버튼 클릭 추적
     */
    function trackCTAClick(buttonText, location) {
        logEvent(GA_EVENTS.CTA_CLICK, {
            button_text: buttonText,
            click_location: location,
        });
    }

    /**
     * 네비게이션 클릭 추적
     */
    function trackNavClick(linkText, destination) {
        logEvent(GA_EVENTS.NAV_CLICK, {
            link_text: linkText,
            destination: destination,
        });
    }

    /**
     * 문의 폼 제출 추적
     */
    function trackContactSubmit(inquiryType) {
        logEvent(GA_EVENTS.CONTACT_FORM_SUBMIT, {
            inquiry_type: inquiryType,
        });
    }

    /**
     * 베타 신청 추적
     */
    function trackBetaSignup() {
        logEvent(GA_EVENTS.BETA_SIGNUP, {
            signup_location: window.location.pathname,
        });
    }

    /**
     * ROI 계산기 사용 추적
     */
    function trackROICalculator(teamSize, calculatedCost) {
        logEvent(GA_EVENTS.ROI_CALCULATOR_USE, {
            team_size: teamSize,
            calculated_cost: calculatedCost,
        });
    }

    /**
     * FAQ 클릭 추적
     */
    function trackFAQClick(question) {
        logEvent(GA_EVENTS.FAQ_CLICK, {
            question: question,
        });
    }

    /**
     * 스크롤 깊이 추적 초기화
     */
    function initScrollTracking() {
        const thresholds = [25, 50, 75, 90];
        const tracked = new Set();

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            thresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !tracked.has(threshold)) {
                    tracked.add(threshold);
                    logEvent(GA_EVENTS.SCROLL_DEPTH, {
                        percent_scrolled: threshold,
                        page_path: window.location.pathname,
                    });
                }
            });
        }, { passive: true });
    }

    /**
     * 외부 링크 클릭 추적 초기화
     */
    function initOutboundTracking() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href) return;

            // 외부 링크인지 확인
            if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                logEvent(GA_EVENTS.OUTBOUND_CLICK, {
                    link_url: href,
                    link_text: link.textContent?.trim().substring(0, 50),
                });
            }
        });
    }

    /**
     * CTA 버튼 클릭 추적 초기화
     */
    function initCTATracking() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn, .btn-primary, .btn-cta-primary, .btn-start');
            if (!btn) return;

            const buttonText = btn.textContent?.trim();
            const section = btn.closest('section');
            const location = section?.className || 'unknown';

            trackCTAClick(buttonText, location);
        });
    }

    /**
     * Analytics 초기화
     */
    function initAnalytics() {
        // 스크롤 깊이 추적
        initScrollTracking();

        // 외부 링크 추적
        initOutboundTracking();

        // CTA 버튼 추적
        initCTATracking();

        console.log('[Q-ALIGN Analytics] Initialized');
    }

    // Public API
    window.QA.analytics = {
        logPageView,
        logEvent,
        setUserProperties,
        trackCTAClick,
        trackNavClick,
        trackContactSubmit,
        trackBetaSignup,
        trackROICalculator,
        trackFAQClick,
        GA_EVENTS,
    };

    window.QA.initAnalytics = initAnalytics;
})();
