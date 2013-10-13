// ==UserScript==
// @name            Kornet
// @namespace       http://www.heymexa.ru/
// @description     Kornet is beautiful!
// @include         http://www.ganjawars.ru/*
// @include         http://ganjawars.ru/*
// @grant           none
// @version         1.0
// @author          W_or_M
// ==/UserScript==

// >(o)__
//  (_~_/ — это талисман защиты от банов! скопируй его себе в скрипт на удачу.
(function () {

    /**
     * @class
     * @constructor
     */
    var Kornet = function () {

        /**
         * @type {null|HTMLTableElement}
         * @private
         */
        this._table = null;

        this._init();
    };

    /**
     * @this Kornet
     */
    Kornet.prototype = /** @lends Kornet.prototype */ {

        /**
         * @private
         */
        _init: function () {
            if (/info\.php.*pattack_msg/.test(location.href)) {
                this._onUserInfo();
            } else if (/map\.php.*st=arriving/.test(location.href)) {
                this._onMap();
            }
            this._onAllPage();
        },

        /**
         * @private
         */
        _onAllPage: function () {
            this._initKornetInfo();
        },

        /**
         * @private
         */
        _checkKornetTime: function () {
            if (this._isLaunchTime()) {
                this._kornetInfo.innerHTML = 'Корнет';
                this._kornetInfo.style.color = 'green';
                this._kornetInfo.style.fontWeight = 'bold';
            } else {
                var time = 600 - Math.floor((new Date() - new Date(this._getKornetTime())) / 1000);
                if (time < 0) {
                    return;

                }
                var min = Math.floor(time / 60),
                    sec = time - min * 60;
                if (min < 10) {
                    min = '0' + min;
                }
                if (sec < 10) {
                    sec = '0' + sec;
                }
                this._kornetInfo.title = 'Время до следующего выстрела.';
                this._kornetInfo.innerHTML = min + ':' + sec;
                this._kornetInfo.style.color = 'red';
                this._kornetInfo.style.fontWeight = 'bold'
            }
        },

        /**
         * @private
         */
        _initKornetInfo: function () {
            var node = document.querySelector('a[href*="/forum.php"]');
            if (!node) {
                return;
            }
            /**
             * @type {HTMLElement}
             * @private
             */
            this._kornetInfo = document.createElement('a');
            this._kornetInfo.href = '/map.php?st=arriving';
            node.parentNode.appendChild(document.createTextNode(' | '));
            node.parentNode.appendChild(this._kornetInfo);

            setInterval(function () {
                this._checkKornetTime();
            }.bind(this), 1000);
            this._checkKornetTime();
        },

        /**
         * @returns {String}
         * @private
         */
        _getKornetTime: function () {
            return window.localStorage.getItem('kornet__time');
        },

        /**
         * @returns {Boolean}
         * @private
         */
        _isLaunchTime: function () {
            var time = this._getKornetTime();
            if (!time) {
                return true;
            }
            var dateTime = new Date(time);
            dateTime.setMinutes(dateTime.getMinutes() + 10);
            return dateTime < new Date();
        },

        /**
         * @private
         */
        _onUserInfo: function () {
            this._setLastKornetLaunch();
        },

        /**
         * @private
         */
        _setLastKornetLaunch: function () {
            window.localStorage.setItem('kornet__time', new Date().toString());
        },

        /**
         * @private
         */
        _onMap: function () {
            if (this._isLaunchTime()) {
                this._checkUsers();
            }
        },

        /**
         * @private
         */
        _checkUsers: function () {
            var users = this._getUsers(),
                self = this;
            users.forEach(function (userLink) {
                ajaxQuery(userLink + '&showattack=1', 'GET', '', true, function (response) {
                    self._addUser(userLink, response);
                }, this._error);
            });
        },

        /**
         * @param {HTMLAnchorElement} userLink
         * @param response
         * @private
         */
        _addUser: function (userLink, response) {
            var info = this._getUserInfo(response),
                html = userLink.innerHTML;
            if (info.sind) {
                var a = document.createElement('a');
                a.innerHTML = '<img src="http://images.ganjawars.ru/img/synds/'+ info.sind +'.gif" />';
                a.href = 'http://www.ganjawars.ru/syndicate.php?id='+ info.sind;
                userLink.parentNode.insertBefore(a, userLink.parentNode.firstChild);
            }
            if (info.hp) {
                html += ' ['+ info.hp.min +' / '+ info.hp.max +']';
            }
            userLink.href += '&showattack=1';
            userLink.innerHTML = html;
        },

        /**
         * @returns {Object}
         * @param response
         * @private
         */
        _getUserInfo: function (response) {
            var div = document.createElement('div'),
                fire = null;
            div.innerHTML = response.responseText;

            var result = {};

            var node = div.querySelector('img[src*="/q/turist"]'),
                html = node.parentNode.innerHTML,
                hp = /\[([\d-]+) \/ ([\d-]+)\]/.exec(html),
                sind = /\/img\/synds\/(\d+)\.gif/.exec(node.parentNode.innerHTML);

            if (hp) {
                result.hp = {
                    min: hp[1],
                    max: hp[2]
                }
            }
            if (sind) {
                result.sind = sind[1];
            }
            return result;
        },

        /**
         * @returns {null|HTMLTableElement}
         * @private
         */
        _getTable: function () {
            if (this._table) {
                return this._table;
            }
            var b = document.getElementsByTagName('b');
            for (var i = 0, l = b.length; i < l; i++) {
                if (/Игроки, перемещающиеся в этот сектор/i.test(b[i].innerHTML)) {
                    var node = b[i];
                    while (node.tagName !== 'TABLE') {
                        node = node.nextSibling;
                    }
                    this._table = node;
                    return node;
                }
            }
            return null;
        },

        /**
         * @returns {Array}
         * @private
         */
        _getUsers: function () {
            var table = this._getTable();
            if (!table) {
                return [];
            }
            var userLink = table.querySelectorAll('a[href*="info.php"]'),
                returnsUsers = [];
            for (var i = 0, l = userLink.length; i < l; i++) {
                returnsUsers.push(userLink[i]);
            }
            return returnsUsers;
        }
    };

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
    };

    var kornet = new Kornet();
})();