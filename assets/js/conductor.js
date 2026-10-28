(function () {
    const box = document.querySelector('.conductor-photo');
    if (!box) return;

    const video = box.querySelector('.conductor-video');
    const soundButton = box.querySelector('.conductor-sound');
    if (!video || !soundButton) return;

    const VIDEO_TIME = 10000;
    const PHOTO_TIME = 5000;
    let switchTimer = null;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.pause();
        box.classList.add('is-photo', 'is-static');
        return;
    }

    function scheduleNext() {
        const showingPhoto = box.classList.contains('is-photo');
        switchTimer = setTimeout(function () {
            box.classList.toggle('is-photo');
            scheduleNext();
        }, showingPhoto ? PHOTO_TIME : VIDEO_TIME);
    }

    function startSwitching() {
        if (switchTimer !== null) return;
        scheduleNext();
    }

    function stopSwitching() {
        clearTimeout(switchTimer);
        switchTimer = null;
    }

    soundButton.addEventListener('click', function () {
        const soundOn = video.muted;
        video.muted = !soundOn;
        soundButton.setAttribute('aria-pressed', String(soundOn));
        soundButton.setAttribute('aria-label', soundOn ? 'Wyłącz dźwięk' : 'Włącz dźwięk');
    });

    new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            video.play().catch(function () {});
            startSwitching();
        } else {
            stopSwitching();
        }
    }, { threshold: 0.3 }).observe(box);
})();