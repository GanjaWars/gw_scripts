// ==UserScript==
// @name            Dressroom [GW]
// @namespace       http://www.heymexa.ru/
// @description     Ссылка на переодевалку на странице информации об персонаже
// @include         http://ganjawars.ru/info.php?id=*
// @include         http://www.ganjawars.ru/info.php?id=*
// @grant           none
// @version         1.0
// @author          W_or_M
// ==/UserScript==

// >(o)__
//  (_~_/ — это талисман защиты от банов! скопируй его себе в скрипт на удачу.
(function () {
    /**
     * @returns {number|boolean}
     */
    function getUserId() {
        var userId = /ganjawars\.ru\/info\.php\?id=(\d+)/.exec(document.location.href);
        return userId ? userId[1] : false;
    }

    /**
     * @param {string|number} userId
     */
    function createLinkToDressroom(userId) {
        if (!userId) {
            return;
        }
        var imgTurist = document.querySelector('img[src*="turist"]');
        if (imgTurist) {
            var html = imgTurist.outerHTML;
            imgTurist.outerHTML = '<a href="http://gw-dressroom.ru/?id=' + userId + '" target="_blank" title="Персонаж в переодевалке">' + html + '</a>';
        }
    }

    var userId = getUserId();
    createLinkToDressroom(userId);
})();
