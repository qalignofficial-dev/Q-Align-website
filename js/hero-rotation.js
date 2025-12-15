// Hero Text Rotation (Dynamic Vertical Slide)
document.addEventListener('DOMContentLoaded', () => {
    const catchphraseElement = document.getElementById('hero-catchphrase');
    if (!catchphraseElement) return;

    const phrases = [
        "팀이 흔들리지 않으려면<br>방향이 매일 같아야 해요.",
        "감으로 팀 상태를<br>판단하지 마세요.",
        "기준이 어긋나면<br>실행은 느려집니다.",
        "보이지 않는 팀의 정렬을<br>매일 확인하세요.",
        "오늘 중요한 게,<br>모두에게 같나요?"
    ];

    let currentIndex = 0;

    function rotateText() {
        // 1. Slide Out Up
        catchphraseElement.classList.remove('slide-in-up');
        catchphraseElement.classList.add('slide-out-up');

        // 2. Change Text & Slide In Up (after animation)
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % phrases.length;
            catchphraseElement.innerHTML = phrases[currentIndex];
            catchphraseElement.classList.remove('slide-out-up');
            catchphraseElement.classList.add('slide-in-up');
        }, 500); // Matches CSS animation duration
    }

    // Start Rotation Interval (2500ms = 2.5 seconds)
    setInterval(rotateText, 2500);
});
