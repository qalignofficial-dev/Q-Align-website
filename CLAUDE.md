# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Q-Align (큐얼라인) is a Korean landing page for a team alignment SaaS product. It's a static website built with Vanilla HTML/CSS/JavaScript, deployed on Vercel.

## Development

**No build step required** - this is a pure static site. Open `index.html` directly in a browser or use any local server:

```bash
# Python
python3 -m http.server 8000

# Node (if npx available)
npx serve
```

**Deployment**: Vercel with `cleanUrls: true` (links work without `.html` extension).

## Architecture

### JavaScript Namespace Pattern
All JS modules use the `window.QA` namespace pattern:
- [utils.js](js/modules/utils.js) initializes `window.QA = window.QA || {}` and adds shared utilities
- Each module adds its init function to `window.QA` (e.g., `window.QA.initROICalculator`)
- [main.js](js/main.js) orchestrates initialization on DOMContentLoaded

### Multi-Page Structure
The site has multiple HTML pages sharing common header/footer:
- `index.html` - Main landing page (hero, ROI calculator, charts)
- `product.html`, `pricing.html`, `use-cases.html`, `about.html` - Marketing pages
- `contact.html`, `help.html` - Support pages
- `terms.html`, `privacy.html` - Legal pages

### Script Loading Order
Scripts load with `defer` attribute in this order:
1. `js/modules/utils.js` - shared utilities (animateValue, lerpColor)
2. `js/navigation.js` - header sticky behavior, mobile menu, active nav link
3. `js/modules/roi-calculator.js` - cost calculator with slider sync
4. `js/modules/charts.js` - Canvas network and matrix visualizations
5. `js/modules/ui-interactions.js` - scroll animations, modal, FAQ, stats counter
6. `js/main.js` - final orchestrator

### Key Modules
- **roi-calculator.js**: Interactive cost calculator (PER_PERSON_COST = 696,000원)
- **charts.js**: Canvas-based network complexity and alignment matrix
- **ui-interactions.js**:
  - `initScrollAnimations()` - Intersection Observer for fade-in effects
  - `initStatsAnimation()` - Animated number counters
  - `initBetaModal()` - Google Sheets form integration
  - `initFAQ()` - Accordion toggle

### CSS Architecture
Two stylesheets loaded in order:
1. [css/style.css](css/style.css) - Core design system and landing page components
2. [css/pages.css](css/pages.css) - Header, footer, navigation, and page-specific layouts

Design tokens (CSS custom properties):

```css
--primary-color: #F46A36;
--bg-cream: #f9f8f6;
--gradient-blue: linear-gradient(135deg, #9cc1e7 0%, #eddfd0 100%);
--card-radius: 20px;
--card-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
```

- Responsive breakpoints: Mobile (375px+), Tablet (768px+), Desktop (1200px+)
- Uses Pretendard font (Korean web font via CDN)
- Scroll animations: `.fade-in`, `.scale-in`, `.slide-in-left`, `.slide-in-right` classes

---

## 코딩 원칙 — 제1원칙(First Principles) 사고 프레임워크

모든 코딩 작업은 아래 원칙을 준수한다.

### 핵심 철학

1. **물리학적 사고**: 유추·관행·전례가 아닌, 확실한 사실(물리·경제 법칙)에서 출발
2. **원가·재료 기반 사고**: 시스템을 근본 요소(바이트, 연산, 네트워크 비용)로 분해
3. **삭제 → 단순화 → 가속 → 자동화** 순서 준수
4. **비선형 설계**: 10% 개선이 아닌 10배 개선 목표

### 7단계 문제 해결 프로세스

| 단계 | 내용 |
|------|------|
| 1. 문제 재정의 | 관행적 표현 제거, 측정 가능한 문제로 변환 |
| 2. 가정 파쇄 | 모든 가정을 목록화 → 삭제 가능 / 검증 필요 / 물리적 필수 제약으로 분류 |
| 3. 제1원칙 분해 | 더 이상 쪼갤 수 없는 근본 요소로 환원 |
| 4. 새로운 구조 설계 | 기존 형태 무시, 기능 중심으로 바닥부터 재조립 |
| 5. 머스크 5단계 알고리즘 | 요구사항 의심 → 삭제 → 단순화 → 가속 → 자동화 |
| 6. 비용 구조 분석 | Idiot Index(완제품 비용 ÷ 원자재 비용) 높은 요소부터 재설계 |
| 7. 리스크 모델링 | 복잡계 리스크(인간·조직·규제·2차 파급효과) 분석 |

### 코딩 시 적용 규칙

**삭제 우선**
- 불필요한 코드, 의존성, 추상화 계층을 먼저 삭제
- "10% 되돌릴 필요가 없다면 아직 덜 삭제한 것"

**단순화**
- 최적화는 삭제 이후에만 시행
- 기존 패턴에 집착하지 않고 기능 중심으로 재설계

**가속**
- 사이클 타임 단축, 피드백 루프 최소화
- 빠르게 실패하고 빠르게 학습하는 구조

**자동화는 마지막**
- 안정화된 공정만 자동화
- 잘못된 공정을 자동화하는 오류 방지

### 금지 사항

- "원래 그렇다", "업계에서는", "보통은" 같은 유추/관행 기반 표현
- 단순 개선(5-20% 수준)에 머무르는 접근
- 기존 형태 최적화에 집중 (기능 중심이 아닌 경우)
- 자동화를 먼저 제안하는 것
- 복잡계 리스크를 생략하는 것
