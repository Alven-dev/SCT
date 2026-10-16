
(function () {
    const nav = document.querySelector('header nav');
    const burger = nav.querySelector('.burger');
    const panel = document.getElementById('nav-menu');
    const lines = burger.querySelectorAll('span');

    const mobileQuery = window.matchMedia('(max-width: 1024px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const DURATION = 250;    
    const LINE_OFFSET = 9;  
    const LINE_ANGLE = 45;   

    let isOpen = false;
    let progress = 0;        
    let fullHeight = 0;
    let rafId = null;


    function ease(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function render() {
        panel.style.height = progress * fullHeight + 'px';

        lines[0].style.transform =
            'translateY(' + (-LINE_OFFSET * (1 - progress)) + 'px) rotate(' + (LINE_ANGLE * progress) + 'deg)';
        lines[1].style.opacity = 1 - progress;
        lines[2].style.transform =
            'translateY(' + (LINE_OFFSET * (1 - progress)) + 'px) rotate(' + (-LINE_ANGLE * progress) + 'deg)';
    }

    function finish() {
        rafId = null;
        if (isOpen) {
            panel.style.height = 'auto';   
        } else {
            panel.inert = true;
        }
    }

    function animateTo(target) {
        cancelAnimationFrame(rafId);

        const start = progress;
        const duration = reduceMotion.matches ? 0 : DURATION * Math.abs(target - start);
        const startTime = performance.now();

        function frame(now) {
            const t = duration === 0 ? 1 : Math.min((now - startTime) / duration, 1);
            progress = start + (target - start) * ease(t);
            render();

            if (t < 1) {
                rafId = requestAnimationFrame(frame);
            } else {
                finish();
            }
        }

        rafId = requestAnimationFrame(frame);
    }

    function setOpen(open) {
        if (open === isOpen) return;
        isOpen = open;

        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');

        if (open) panel.inert = false;

        fullHeight = panel.scrollHeight;
        animateTo(open ? 1 : 0);
    }

    function syncLayout() {
        cancelAnimationFrame(rafId);
        rafId = null;

        if (mobileQuery.matches) {
            fullHeight = panel.scrollHeight;
            progress = isOpen ? 1 : 0;
            render();
            if (isOpen) panel.style.height = 'auto';
            panel.inert = !isOpen;
        } else {
            isOpen = false;
            progress = 0;
            panel.style.height = '';
            panel.inert = false;
            lines.forEach(function (line) {
                line.removeAttribute('style');
            });
            burger.setAttribute('aria-expanded', 'false');
            burger.setAttribute('aria-label', 'Otwórz menu');
        }
    }

    burger.addEventListener('click', function () {
        setOpen(!isOpen);
    });

    panel.addEventListener('click', function (e) {
        if (e.target.closest('a, button')) setOpen(false);
    });

    
    document.addEventListener('click', function (e) {
        if (isOpen && !nav.contains(e.target)) setOpen(false);
    });

  
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen) {
            setOpen(false);
            burger.focus();
        }
    });

    mobileQuery.addEventListener('change', syncLayout);
    syncLayout();
})();