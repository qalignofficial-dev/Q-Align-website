ㅜ# 1. Product Requirements Document (PRD)

## 1.1 프로젝트 개요 (Project Overview)
* **프로젝트명:** Q-ALIGN 공식 랜딩 페이지 (Beta Season 1)
* **목적:** "보이지 않는 팀의 기울기(Initial Tilt)"라는 문제 의식을 전달하고, 잠재 고객(리더)의 **사전 예약(Waitlist)** 전환을 유도한다.
* **핵심 가치:** 기존 HR 툴과 달리 '원인(해석의 차이)'을 시각화하고, '예방'에 초점을 맞춘다는 점을 강조.
* **타겟 유저:** 6~20인 규모의 B2B SaaS 스타트업 CEO 및 팀 리더.

## 1.2 성공 지표 (KPIs)
1.  **전환율 (CVR):** 방문자 대비 'Join Waitlist' 버튼 클릭률 (목표: 5% 이상)
2.  **체류 시간:** ROI 계산기 및 시나리오 섹션 인터랙션 참여 시간.
3.  **이탈률:** Hero Section에서 스크롤 없이 이탈하는 비율 최소화.

## 1.3 디자인 원칙 (Design Principles)
* **Visual Identity:**
    * **Primary Color:** Soft Orange (#FF8A5B) - 경고, 중요성, 핵심 연결.
    * **Base Color:** Clean White (#FFFFFF) & Silver (#E0E0E0) - 신뢰, 데이터, 전문성.
* **Interaction:**
    * **"Show, Don't Tell":** 텍스트 설명보다 스크롤에 따른 시각적 변화(기울기 발생, 정렬 등)로 개념을 체감하게 한다.
* **Content Strategy:**
    * **No Vanity Metrics:** 허위 숫자(가짜 유저 수)를 배제하고, 실제 인터뷰 데이터(67% 통계)와 논리(비용 계산)로 설득한다.

---

# 2. Functional Requirements Document (FRD)

## 2.1 사이트 구조 (Sitemap)
1.  **Hero:** Plexus Animation & Main Copy
2.  **Social Proof:** Interview Data (Slider/Cards)
3.  **Problem:** Interactive Scenario (Hover Effect)
4.  **Solution:** Input UI Mockup
5.  **Value Prop:** Split View (Leader vs. Member)
6.  **Calculator:** ROI Cost Calculator
7.  **Footer:** CTA & Form

## 2.2 섹션별 상세 기능 명세 (Detailed Requirements)

### **Section 1. Hero: The Invisible Drift**
* **기능(Function):**
    * **Background:** Canvas API를 활용한 Plexus 효과 (Orange & White 파티클).
    * **Scroll Trigger:** 스크롤 다운 시 화면 중앙의 평행한 두 라인이 서서히 양옆으로 벌어지는(Diverge) 애니메이션 구현.
* **콘텐츠(Content):**
    * Copy: "Teams don't fail suddenly. They fail silently."
    * CTA Button: [ Beta Access 신청하기 ] (클릭 시 Footer로 스크롤 이동).

### **Section 2. Social Proof: Fact Check**
* **기능(Function):**
    * **Text Slider/Carousel:** 3개의 리더 코멘트 카드가 3~5초 간격으로 자동 롤링.
* **콘텐츠(Content):**
    * **Key Stat:** "리더 **67%**가 '해석의 불일치'를 핵심 문제로 지목" (강조 타이포그래피).
    * **Testimonials:** "묘하게 속도가 안 난다", "합의했다고 생각했는데 결과가 다르다" 등 실제 인터뷰 내용 각색.

### **Section 3. Problem: Interactive Scenario (동상이몽)**
* **기능(Function):**
    * **Mouse Hover Interaction:** 중앙 키워드("고객 친화적")에 마우스 오버(Hover) 시, 3개의 말풍선으로 분기(Split)되는 CSS 애니메이션.
* **콘텐츠(Content):**
    * Keyword: "User Friendly"
    * Branch 1 (PM): "속도와 효율"
    * Branch 2 (Designer): "감성과 퀄리티"
    * Branch 3 (Engineer): "안정성"

### **Section 4. Solution: The Common Ground**
* **기능(Function):**
    * **Interactive Mockup:** `image_f965ba.png` 디자인을 기반으로 한 웹 UI 구현.
    * **Slider Simulation:** 사용자가 1~5점 슬라이더를 드래그할 수 있는 마이크로 인터랙션.
    * **Transition:** '보내기' 버튼 클릭 시 부드럽게 다음 섹션(Value Prop)으로 전환되는 효과.
* **콘텐츠(Content):**
    * Copy: "매일 3초, 서로의 주파수를 맞추는 시간."

### **Section 5. Value Proposition: Two Outcomes**
* **기능(Function):**
    * **Toggle Switch:** [ Leader Mode ] ↔ [ Member Mode ] 전환 스위치.
    * **Content Swap:** 스위치 클릭 시 이미지와 카피가 즉시 변경(Fade-in/out).
* **콘텐츠(Content):**
    * **Leader Mode:** 대시보드 이미지(`image_f9619d.png` 우측 하단) + "초기 기울기 감지 & 예방".
    * **Member Mode:** 성장 리포트 그래픽 + "나를 위한 커리어 기록".

### **Section 6. Calculator: ROI Analysis**
* **기능(Function):**
    * **Input Field:** 숫자만 입력 가능 (Default: 0).
    * **Calculation Logic:** `입력값(N) * 696,000원` (주당 174,000원 * 4주).
    * **Count Up Animation:** 결과 금액이 '0'에서 계산된 금액으로 빠르게 카운팅되는 숫자 애니메이션.
* **콘텐츠(Content):**
    * Copy: "당신의 팀은 매달 얼마를 잃고 있습니까?"
    * Result Copy: "Q-ALIGN 도입 비용은 이 손실액의 1% 미만입니다."

### **Section 7. Footer & CTA**
* **기능(Function):**
    * **Input Form:** 이메일 주소 입력 및 유효성 검사 (Regex Validation).
    * **Submit Action:** 버튼 클릭 시 "등록되었습니다. 곧 연락드리겠습니다." 토스트 팝업 또는 텍스트 변경.
* **콘텐츠(Content):**
    * Copy: "초기 200팀 한정 Beta Season 1 모집."
    * Privacy Note: "스팸은 발송하지 않습니다."

---

## 2.3 기술적 제약 사항 (Technical Constraints)
1.  **Framework:** 별도의 프레임워크 없이 **Vanilla HTML/CSS/JS** 사용을 권장 (가볍고 빠른 로딩 속도).
2.  **Performance:**
    * Hero Section의 Canvas 애니메이션은 `requestAnimationFrame`을 사용하여 60FPS 유지.
    * 모바일 환경에서는 파티클 개수를 50%로 줄여 성능 최적화.
3.  **Responsive:**
    * Mobile (375px~), Tablet (768px~), Desktop (1200px~) 대응.
    * 모바일에서는 Hover 인터랙션을 Touch 또는 Scroll Trigger로 대체.

## 2.4 필요 에셋 (Assets Required)
1.  **Images:**
    * `dashboard_leader_view.png` (IR 자료 크롭 및 고해상도화)
    * `growth_map_member_view.png` (IR 자료 크롭 및 고해상도화)
2.  **Icons:** PM, Designer, Engineer 직군 아이콘 (SVG).
3.  **Fonts:** Pretendard (Web Font CDN).
