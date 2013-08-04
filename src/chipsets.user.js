// ==UserScript==
// @name            Chipsets [GW}
// @namespace       http://www.heymexa.ru/
// @description     Облегчает выбор чипсета в синд магазе
// @include         http://www.ganjawars.ru/sshop.php?tshop=chipsets
// @include         http://ganjawars.ru/sshop.php?tshop=chipsets
// @grant           none
// @version         1.0
// @author          W_or_M
// ==/UserScript==

// >(o)__
//  (_~_/ — это талисман защиты от банов! скопируй его себе в скрипт на удачу.
(function () {

    var RANKS_INFO = {
        0: {name: 'Private'},
        1: {name: 'Lieutenant'},
        2: {name: 'Captain'},
        3: {name: 'Major'},
        4: {name: 'Colonel'},
        5: {name: 'Brigadier'},
        6: {name: 'Major General'},
        7: {name: 'Lieutenant General'},
        8: {name: 'Colonel General'},
        9: {name: 'Syndicate General'}
    }

    var CHIPSETS_INFO = {
        'chip_armour1': { rank: 0},
        'chip_armour': { rank: 4},
        'chip_armour2': { rank: 2},
        'chip_armour3': { rank: 5},
        'chipset_bonus1': { rank: 1},
        'chipset_bonus2': { rank: 1},
        'chipset_bonus3': { rank: 1},
        'chipset_bonus4': { rank: 2},
        'chip_explosives': { rank: 3},
        'chipset_bonus5': { rank: 4},
        'chipset_bonus6': { rank: 7},
        'chipset_bonus7': { rank: 3},
        'chip_attack': { rank: 7}
    };

    /**
     * @class
     * @constructor
     */
    var Chipsets = function () {
        var userId = this.getUserId();
        this.getRank(userId, this.init);
    };

    Chipsets.prototype = {/** @lends Chipsets */

        /**
         * Инициализация
         */
        init: function() {

        },

        /**
         * Возвращает id персонажа
         */
        getUserId: function(request) {

        },

        getRank: function(userId, callback) {
            var url = 'http://www.ganjawars.ru/info.php?id='+ userId;
            ajaxQuery(url, 'GET', '', true, callback, callback);
        }
    }

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