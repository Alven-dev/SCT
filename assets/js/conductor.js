// Wideo dyrygenta: gra bez dźwięku, przycisk włącza i wyłącza dźwięk.
// Obraz płynnie przełącza się: 10 s wideo, 5 s zdjęcie (wideo i dźwięk grają dalej pod spodem).
(function () {
    const box = document.querySelector('.conductor-photo');
    if (!box) return;

    const video = box.querySelector('.conductor-video');
    const soundButton = box.querySelector('.conductor-sound');
    if (!video || !soundButton) return;

    const VIDEO_TIME = 10000;   // ms widoczności wideo
    const PHOTO_TIME = 5000;    // ms widoczności zdjęcia
    let switchTimer = null;

    // Ograniczony ruch w systemie: zamiast wideo pokazujemy samo zdjęcie
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.pause();
        box.classList.add('is-photo', 'is-static');
        return;
    }

    // każda faza ma własny czas, więc zamiast setInterval używamy łańcucha setTimeout
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
        const soundOn = video.muted;   // był wyciszony, więc włączamy
        video.muted = !soundOn;
        soundButton.setAttribute('aria-pressed', String(soundOn));
        soundButton.setAttribute('aria-label', soundOn ? 'Wyłącz dźwięk' : 'Włącz dźwięk');
    });

    // poza ekranem wideo, dźwięk i przełączanie się zatrzymują, po powrocie ruszają dalej
    new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            video.play().catch(function () {});
            startSwitching();
        } else {
            video.pause();
            stopSwitching();
        }
    }, { threshold: 0.3 }).observe(box);
})();