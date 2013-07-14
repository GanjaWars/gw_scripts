// ==UserScript==
// @name            ScriptName
// @namespace       http://www.heymexa.ru/
// @description     Description
// @include         http://ganjawars.ru/*
// @include         http://*.ganjawars.ru/*
// @grant           none
// @version         0.1
// @author          W_or_M
// ==/UserScript==

// >(o)__
//  (_~_/ — это талисман защиты от банов! скопируй его себе в скрипт на удачу.
(function () {

    /**
     * AJAX-запрос
     * @param url
     * @param rmethod
     * @param param
     * @param async
     * @param onsuccess
     * @param onfailure
     */
    function ajaxQuery(url, rmethod, param, async, onsuccess, onfailure) {
        var xmlHttpRequest = new XMLHttpRequest();
        if (async == true) {
            xmlHttpRequest.onreadystatechange = function () {
                if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200 && typeof onsuccess != 'undefined') onsuccess(xmlHttpRequest);
                else if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status != 200 && typeof onfailure != 'undefined') onfailure(xmlHttpRequest);
            }
        }
        if (rmethod == 'POST') xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlHttpRequest.open(rmethod, url, async);
        xmlHttpRequest.send(param);
        if (async == false) {
            if (xmlHttpRequest.status == 200 && typeof onsuccess != 'undefined') onsuccess(xmlHttpRequest);
            else if (xmlHttpRequest.status != 200 && typeof onfailure != 'undefined') onfailure(xmlHttpRequest);
        }
    }
})();
