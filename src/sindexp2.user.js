// ==UserScript==
// @name             SindExp #2 [GW]
// @namespace        http://www.heymexa.ru/
// @description      Показывает сумму экспы со всемх синдов.
// @include          http://www.ganjawars.ru/home.reset.php*
// @include          http://ganjawars.ru/home.reset.php*
// @version          1.0
// @author           W_or_M
// ==/UserScript==

// >(o)__
//  (_~_/ — это талисман защиты от банов! скопируй его себе в скрипт на удачу.
(function(){

// таблица опыта
var tableExp = {
1 : 5,
2 : 15,
3 : 37,
4 : 76,
5 : 143,
6 : 249,
7 : 412,
8 : 655,
9 : 1007,
10 : 1505,
11 : 2199,
12 : 3149,
13 : 4433,
14 : 6146,
15 : 8407,
16 : 11362,
17 : 15192,
18 : 20113,
19 : 26394,
20 : 34353,
21 : 44377,
22 : 56931,
23 : 72568,
24 : 91947,
25 : 115853,
26 : 145214,
27 : 181127,
28 : 224882,
29 : 277996,
30 : 342247,
31 : 419713,
32 : 512821,
33 : 624395,
34 : 757716,
35 : 916591,
36 : 1105426,
37 : 1329313,
38 : 1594124,
39 : 1906627,
40 : 2274598,
41 : 2723523,
42 : 3293658,
43 : 4046236,
44 : 5077268,
45 : 6541333,
46 : 8693509,
47 : 11964817,
48 : 17100771,
49 : 25421016,
50 : 39315825
};

var root = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;
if (root.location.href.indexOf('ganjawars.ru/home.reset.php?page=syndexp') == -1) return;

// возвращает всю экспу
function getAllExp() {
    var o = root.document.getElementsByName('transfer_from')[0].options;
    var exp = 0;
    for (var i = 0, l = o.length; i < l; i++) {
        try {
             exp += parseInt(/\[([\d,]+)/.exec(o[i].innerHTML)[1].replace(/,/, ''));
        } catch (e) { }
    }
    
    return exp;
}

// возвращает синдовый уровень и остаток экспы
function getSindLevelInfo() {
    var exp  = getAllExp();
    var info = {};
    for (var i in tableExp) {
        if (tableExp[i] >= exp) {
            info.level = i - 1;
            info.exp = tableExp[i] - exp;
            return info;
        }
    }
    return false;
}


var info = getSindLevelInfo();
if (info) {
    var node = root.document.getElementsByName('transfer_amount')[0].nextSibling.nextSibling.nextSibling.nextSibling;
    var span = root.document.createElement('span');
    span.innerHTML = '<br />Всего опыта: [ <b>'+ info.level +'</b> ('+ getAllExp() +') ] <span style="color:#809980;font-size:9px">+'+ info.exp +'</span>';
    node.parentNode.insertBefore(span, node);
}

})();