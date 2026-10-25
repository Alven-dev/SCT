(function () {
    const wrapper = document.querySelector('.rehearsal-location-map');
    if (!wrapper) return;
 
    const smallMap = wrapper.querySelector('iframe');
    const openButton = wrapper.querySelector('.map-expand');
    if (!smallMap || !openButton) return;
 
    const dialog = document.createElement('dialog');
    dialog.className = 'map-dialog';
    dialog.innerHTML =
        '<button class="map-dialog-close" type="button" aria-label="Zamknij mapę">&times;</button>' +
        '<div class="map-dialog-frame"></div>';
    document.body.appendChild(dialog);
 
    const frame = dialog.querySelector('.map-dialog-frame');
    const closeButton = dialog.querySelector('.map-dialog-close');
 
    function openMap() {
        const bigMap = document.createElement('iframe');
        bigMap.src = smallMap.src;
        bigMap.title = 'Mapa dojazdu';
        bigMap.referrerPolicy = smallMap.referrerPolicy;
        bigMap.setAttribute('allowfullscreen', '');
        frame.appendChild(bigMap);
        dialog.showModal();
    }
 
    openButton.addEventListener('click', openMap);
    closeButton.addEventListener('click', function () {
        dialog.close();
    });
 
    dialog.addEventListener('click', function (e) {
        if (e.target === dialog) dialog.close();
    });
 
    dialog.addEventListener('close', function () {
        frame.replaceChildren();
    });
})();