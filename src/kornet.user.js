// ==UserScript==
// @name            Kornet
// @namespace       http://www.heymexa.ru/
// @description     Kornet is beautiful!
// @include         http://www.ganjawars.ru/*
// @include         http://ganjawars.ru/*
// @grant           none
// @version         1.01
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

        /**
         * @type {Number}
         * @private
         */
        this._killerLevel = 0;

        /**
         * @const
         */
        this.KILLER_CHECK_TIMEOUT = 3600;

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
            this._checkKillerLevel();
            this._initKornetInfo();
        },

        /**
         * @private
         */
        _checkKillerLevel: function () {
            var time = this._getKillerCheckTime();
            if (!time || (this.KILLER_CHECK_TIMEOUT - Math.floor((new Date(time) - new Date()) / 1000)) < 0) {
                this._getKillerLevel();
                return;
            }
            this._killerLevel = parseInt(window.localStorage.getItem('kornet__killer-level'), 10);
        },

        /**
         * @returns {*}
         * @private
         */
        _getKillerLevel: function () {
            var self = this;
            ajaxQuery('/info.php?id='+ getCookie('uid'), 'GET', '', true, function (req) {
                var html = req.responseText;
                try {
                    self._killerLevel = parseInt(/Киллер.*?<font color=#000099>(\d+)<\/b>/.exec(html)[1], 10);
                    window.localStorage.setItem('kornet__killer-level', self._killerLevel);
                    window.localStorage.setItem('kornet__killer-check-time', new Date());
                } catch (e) {}
            });
        },

        /**
         * @returns {null|String}
         * @private
         */
        _getKillerCheckTime: function () {
            return window.localStorage.getItem('kornet__killer-check-time');
        },

        /**
         * @returns {Number}
         * @private
         */
        _getTime: function () {
            return 10 - (Math.floor(this._killerLevel / 2));
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
                var time = (this._getTime() * 60) - Math.floor((new Date() - new Date(this._getKornetTime())) / 1000);
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
            dateTime.setMinutes(dateTime.getMinutes() + this._getTime());
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
    }

    function getCookie(name) {
        var cookie = " " + document.cookie;
        var search = " " + name + "=";
        var setStr = null;
        var offset = 0;
        var end = 0;
        if (cookie.length > 0) {
            offset = cookie.indexOf(search);
            if (offset != -1) {
                offset += search.length;
                end = cookie.indexOf(";", offset)
                if (end == -1) {
                    end = cookie.length;
                }
                setStr = unescape(cookie.substring(offset, end));
            }
        }
        return(setStr);
    }

    var kornet = new Kornet();
})();
