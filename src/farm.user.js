// ==UserScript==
// @name            Farm [GW]
// @namespace       http://www.heymexa.ru/
// @description     Скрипт для облегчения трудовых будней на ферме.
// @include         http://www.ganjawars.ru/*
// @include         http://ganjawars.ru/*
// @downloadURL     https://github.com/HeyMeXa/gw_scripts/raw/master/src/farm.user.js
// @updateURL       https://github.com/HeyMeXa/gw_scripts/raw/master/src/farm.user.js
// @grant           none
// @version         1.00
// @author          W_or_M
// ==/UserScript==

// >(o)__
//  (_~_/ — это талисман защиты от банов! скопируй его себе в скрипт на удачу.
(function () {

// ==================== НАСТРОЙКИ ==========================
    var SHOW_IN_MENU = 1; // показывать ссылку на ферме в меню
// =========================================================

    /**
     * @type {object}
     */
    var PLANTS = {
        ukrop: {buy: 5, sell: 6, exp: 0.007},
        opyata: {buy: 10, sell: 40, exp: 0.204},
        tulips: {buy: 20, sell: 26, exp: 0.04},
        mak: {buy: 12, sell: 15, exp: 0.02},
        muhomor: {buy: 150, sell: 165, exp: 0.098},
        podsolnuh: {buy: 50, sell: 62, exp: 0.082},
        kaktus: {buy: 160, sell: 197, exp: 0.245},
        geran: {buy: 10, sell: 17, exp: 0.048},
        tabak: {buy: 20, sell: 37, exp: 0.114},
        korica: {buy: 16, sell: 25, exp: 0.057},
        hren: {buy: 210, sell: 244, exp: 0.229},
        baklajan: {buy: 150, sell: 176, exp: 0.171},
        chai: {buy: 50, sell: 63, exp: 0.087},
        aloe: {buy: 120, sell: 127, exp: 0.044},
        ogurets: {buy: 350, sell: 360, exp: 0.065},
        klubnika: {buy: 100, sell: 159, exp: 0.392},
        malina: {buy: 190, sell: 203, exp: 0.087},
        shalfei: {buy: 800, sell: 885, exp: 0.566},
        mint: {buy: 50, sell: 56, exp: 0.037},
        kokos: {buy: 200, sell: 226, exp: 0.171},
        vinograd: {buy: 140, sell: 155, exp: 0.098},
        tabak2: {buy: 170, sell: 175, exp: 0.031},
        whitemush: {buy: 120, sell: 138, exp: 0.122},
        kapusta: {buy: 150, sell: 164, exp: 0.095},
        kust: {buy: 600, sell: 657, exp: 0.381},
        kabachok: {buy: 140, sell: 155, exp: 0.102},
        kukuruza: {buy: 170, sell: 182, exp: 0.082},
        jahntak: {buy: 130, sell: 157, exp: 0.177},
        kaktusi: {buy: 1100, sell: 1194, exp: 0.626},
        perets: {buy: 180, sell: 191, exp: 0.073},
        petrushka: {buy: 145, sell: 151, exp: 0.041},
        tomat: {buy: 500, sell: 554, exp: 0.359},
        arbuz: {buy: 100, sell: 111, exp: 0.071},
        hmel: {buy: 130, sell: 135, exp: 0.035},
        bambuk: {buy: 10, sell: 14, exp: 0.029},
        tikva: {buy: 200, sell: 214, exp: 0.095},
        shishki: {buy: 250, sell: 262, exp: 0.082},
        dinya: {buy: 120, sell: 141, exp: 0.143},
        podsolnuh2: {buy: 200, sell: 213, exp: 0.087},
        poganka: {buy: 1500, sell: 1604, exp: 0.694}
    };

    /**
     * @constructor
     */
    var Ferma = function () {
        /**
         * @type {object}
         */
        this.info = {};

        /**
         * @type {null|HTMLTableElement}
         * @private
         */
        this._table = null;

        /**
         * @type {Array}
         * @private
         */
        this._plots = [];

        /**
         * @type {object}
         */
        this.costPlots = {
            buy: 0,
            sell: 0,
            exp: 0
        };

        this.init();
    };

    Ferma.prototype = /** @lends Ferma.prototype */{

        init: function () {
            this._initCSS();
            if (SHOW_IN_MENU) {
                this._initMenu();
            }
            if (this._isFermaPage()) {
                this._table = this._getFermaTable();
                if (!this._table) {
                    return;
                }

                this._addInfoBlock();
                this.updateInfo();
            }
        },

        /**
         * @returns {boolean}
         * @private
         */
        _isFermaPage: function () {
            return document.location.href.indexOf('/ferma.php') > -1;
        },

        /**
         * @private
         */
        _initMenu: function () {
            this._menu = new Menu();
            this._menu.addSeparator();
            this._fermaLink = this._menu.add('<b>Ферма</b>', '/ferma.php');
            var nearAction = this._getNearAction();
            if (!nearAction) {
                return;
            }
            if (new Date(nearAction) < new Date()) {
                this._showItsPlantingTime();
            } else {
                this._showTime();
                this._tid = setInterval(this._showTime.bind(this), 1000);
            }
        },

        /**
         * @private
         */
        _showItsPlantingTime: function () {
            this._fermaLink.innerHTML = '<b>Ферма</b>';
            this._fermaLink.className = 'ferma__its-planting-time';
        },

        /**
         * @private
         */
        _showTime: function () {
            var nearAction = window.localStorage.getItem('ferma__planting-time');
            if (!nearAction) {
                return;
            }
            var time = Math.ceil((new Date(nearAction) - new Date()) / 1000);
            if (time <= 0) {
                clearInterval(this._tid);
                this._showItsPlantingTime();
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

            this._fermaLink.innerHTML = '<b>Ферма</b> [' + min + ':' + sec + ']';
        },

        /**
         * Инициализация CSS
         * @private
         */
        _initCSS: function () {
            var head = document.getElementsByTagName('head')[0],
                style = document.createElement('style'),
                text = '.ferma__info-block {\
                        }\
                        .ferma__info-block_title {\
                            color: #990000;\
                            font-weight: bold;\
                            text-align: center;\
                            background: #d0eed0;\
                            padding: 5px 0;\
                        }\
                        .ferma__info-block p {\
                            margin: 0;\
                            padding: 5px 0;\
                        }\
                        .ferma__info-block span {\
                            font-weight: bold;\
                        }\
                        .ferma__info-block span:before {\
                            content: "$"\
                        }\
                        .ferma__info-block .success {\
                            color: #009900;\
                        }\
                        .ferma__info-block .not-content:before {\
                            content: ""\
                        }\
                        .ferma__its-planting-time {\
                            font-weight: bold;\
                            color: #009900;\
                        }\
                    ';
            style.type = "text/css";
            style.innerHTML = text;
            head.appendChild(style);
        },

        _addInfoBlock: function () {
            var parent = document.getElementById('cashcontrol').parentNode.nextSibling;

            var infoBlock = document.createElement('div'),
                title = document.createElement('div');
            infoBlock.className = 'ferma__info-block';

            title.className = 'ferma__info-block_title';
            title.innerHTML = 'Дополнительная информация';

            var buyAllPlotsBlock = document.createElement('p');
            buyAllPlotsBlock.appendChild(document.createTextNode('Стоимость покупки всех растений: '));
            this._buyAllPlots = document.createElement('span');
            this._buyAllPlots.innerHTML = '0';
            buyAllPlotsBlock.appendChild(this._buyAllPlots);

            var sellAllPlotsBlock = document.createElement('p');
            sellAllPlotsBlock.appendChild(document.createTextNode('Стоимость продажи всех растений: '));
            this._sellAllPlots = document.createElement('span');
            this._sellAllPlots.innerHTML = '0';
            sellAllPlotsBlock.appendChild(this._sellAllPlots);

            var expBlock = document.createElement('p');
            expBlock.appendChild(document.createTextNode('Количество опыта от продажи всех растений: '));
            this._expAllPlots = document.createElement('span');
            this._expAllPlots.innerHTML = '0';
            this._expAllPlots.className = 'not-content';
            expBlock.appendChild(this._expAllPlots);

            var numberLandingPlotsBlock = document.createElement('p');
            numberLandingPlotsBlock.appendChild(document.createTextNode('Количество посадок до следующей клетки: '));
            this._numberLandingPlots = document.createElement('span');
            this._numberLandingPlots.innerHTML = '0';
            this._numberLandingPlots.className = 'not-content';
            numberLandingPlotsBlock.appendChild(this._numberLandingPlots);

            var activeFermaBlock = document.createElement('p');
            activeFermaBlock.appendChild(document.createTextNode('Итоговый актив фермы: '));
            activeFermaBlock.title = 'Сумма на счету фермы + стоимость продажи всех растений';
            this._activeFerma = document.createElement('span');
            this._activeFerma.innerHTML = '0';
            activeFermaBlock.appendChild(this._activeFerma);

            var costNextPlotBlock = document.createElement('p');
            costNextPlotBlock.appendChild(document.createTextNode('Стоимость следующего участка: '));
            costNextPlotBlock.title = 'Для сохранения стоимости следующего участка, нужно выбрать любой свободный участок для покупки';
            this._costNextPlot = document.createElement('span');
            this._costNextPlot.innerHTML = '0';
            costNextPlotBlock.appendChild(this._costNextPlot);

            infoBlock.appendChild(title);
            infoBlock.appendChild(buyAllPlotsBlock);
            infoBlock.appendChild(sellAllPlotsBlock);
            infoBlock.appendChild(expBlock);
            infoBlock.appendChild(activeFermaBlock);
            infoBlock.appendChild(costNextPlotBlock);
            infoBlock.appendChild(numberLandingPlotsBlock);
            parent.appendChild(infoBlock);
        },

        /**
         * @public
         */
        getInfo: function () {
            this.info.plots = this._getAllPlots();
            this.info.cost = this.getCostAllCurrentPlots();
            this.info.costNextPlot = this._getCostNextPlot();
            this.info.money = this._getMoney();
            this.info.numberLandingPlots = this._getNumberLandingPlots();
            this.info.nearAction = this._getNearAction();
            return this.info;
        },

        /**
         * @private
         */
        _getNearAction: function () {
            var html = document.body.innerHTML,
                plantingTime = window.localStorage.getItem('ferma__planting-time');
            if (html.match(/Ближайшее действие/)) {
                var node = document.querySelector('td[bgcolor*="e0eee0"]');
                if (node) {
                    var time = node.innerHTML.match(/\(.*\s(\d+)/),
                        itsTime = node.innerHTML.indexOf('уже пора') > -1;
                    if (itsTime) {
                        plantingTime = new Date();
                    } else if (time) {
                        time = parseInt(time[1], 10);
                        plantingTime = new Date(new Date().setMinutes(new Date().getMinutes() + time));
                    }
                    if (plantingTime) {
                        window.localStorage.setItem('ferma__planting-time', plantingTime.toString());
                    }
                }
            }
            return plantingTime;
        },

        /**
         * @private
         */
        _getExpAllPlots: function () {

        },

        updateInfo: function () {
            this._checkCostNextPlot();
            var info = this.getInfo();
            this._buyAllPlots.innerHTML = info.cost.buy;
            this._sellAllPlots.innerHTML = info.cost.sell;
            this._activeFerma.innerHTML = info.cost.sell + info.money;
            if (this.info.costNextPlot < info.cost.sell + info.money) {
                this._activeFerma.className += ' success';
                this._activeFerma.title = 'Достаточно средств для покупки следующей клетки';
            } else {
                this._activeFerma.title = 'Недостаточно средств для покупки следующей клетки';
            }
            this._costNextPlot.innerHTML = info.costNextPlot;
            this._expAllPlots.innerHTML = info.cost.exp.toFixed(3);
            this._numberLandingPlots.innerHTML = info.numberLandingPlots;
        },

        /**
         * @returns {number}
         * @private
         */
        _getNumberLandingPlots: function () {
            if (!this.info.cost || this.info.cost.buy === 0) {
                return 0;
            }
            var diffCost = this.info.costNextPlot - (this.info.cost.sell + this.info.money);
            if (diffCost <= 0) {
                return 0;
            }
            return Math.ceil(diffCost / (this.info.cost.sell - this.info.cost.buy));
        },

        /**
         * @return {number}
         * @private
         */
        _getMoney: function () {
            var money = /на ферме <b>\$(\d+)<\/b>/.exec(document.body.innerHTML);
            return money ? parseInt(money[1], 10) : 0;
        },

        /**
         * @param {string} plotName
         * @private
         */
        _normalizePlotName: function (plotName) {
            return plotName.replace(/\d/g, '');
        },

        /**
         * @returns {object}
         */
        getCostAllCurrentPlots: function () {
            var plots = this._getAllPlots(),
                result = {
                    buy: 0,
                    sell: 0,
                    exp: 0
                };
            plots.forEach(function (plotName) {
                var normPlotName = this._normalizePlotName(plotName),
                    plant = PLANTS[normPlotName];
                if (plant) {
                    result.buy += plant.buy;
                    result.sell += plant.sell;
                    result.exp += plant.exp;
                }
            }.bind(this));
            this.costPlots = result;
            return result;
        },

        /**
         * @returns {object}
         * @private
         */
        _getFermaTable: function () {
            return document.querySelector('table[background*="ferma_bg.jpg"] table:first-child');
        },

        /**
         * @returns {Array}
         * @private
         */
        _getAllPlots: function () {
            if (!this._table) {
                return;
            }
            this._plots = [];
            var img = this._table.querySelectorAll('a img:first-child');
            for (var i = 0, l = img.length; i < l; i++) {
                try {
                    var plantName = /\/([\w\d]+)\.\w+$/.exec(img[i].src)[1];
                    plantName = plantName.replace(/^(ground|t)$/, '');
                    this._plots.push(plantName);
                } catch (e) {};
            }
            return this._plots;
        },

        /**
         * @private
         */
        _getCacheCostNextPlot: function () {
            return window.localStorage.getItem('ferma__costNextPlot') | 0;
        },

        /**
         * @param {number} cost
         * @private
         */
        _setCacheCostNextPlot: function (cost) {
            window.localStorage.setItem('ferma__costNextPlot', cost);
        },

        /**
         * @returns {number}
         */
        _getCostNextPlot: function () {
            return this._getCacheCostNextPlot();
        },

        /**
         * @private
         */
        _checkCostNextPlot: function () {
            var plot = /участок стоит <b>\$([\d,]+)<\/b>|<b>Купить землю за \$([\d,]+)<\/b>/.exec(document.body.innerHTML);
            if (plot) {
                var costPlot = parseInt((plot[1] || plot[2]).replace(',', ''), 10);
                this._setCacheCostNextPlot(costPlot);
            }
        }
    };

    /**
     * Класс для добавления пунктов в главное в меню
     * @class Menu
     * @constructor
     */
    function Menu() {
        this._getHolder();
    }

    Menu.prototype = {
        /**
         * Получение menu holder
         * @private
         */
        _getHolder: function () {
            var chat = document.querySelector('a[href="http://chat.ganjawars.ru"]');
            this.holder = chat.parentNode;
        },

        /**
         * Добавление пункта меню
         * @param {String} html Html
         * @param {String} [href]
         * @param {Function} [callback] Callback-функция, сработает при клике по пункту меню
         * @returns {HTMLAnchorElement}
         */
        add: function (html, href, callback) {
            var el = document.createElement('a');
            el.innerHTML = html;
            el.href = typeof href === 'string' ? href : '#';
            el.style.textDecoration = 'none';
            if (typeof callback === 'function') {
                el.onclick = callback;
            }
            this.holder.appendChild(el);
            return el;
        },
        /**
         * Добавление сепарататора | в меню
         */
        addSeparator: function () {
            var el = document.createTextNode(' | ');
            this.holder.appendChild(el);
        }

    };

    var ferma = new Ferma();
})();
