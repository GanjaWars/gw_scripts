// ==UserScript==
// @name             SpaceBackpack [GW]
// @namespace        http://www.heymexa.ru/
// @description      В магазинах показывает кол-во свободного места в рюкзаке. Автоматически подставляет место во все поля (опционально).
// @include          http://www.ganjawars.ru/object.php*
// @include          http://ganjawars.ru/object.php*
// @version          1.0
// @author           W_or_M
// ==/UserScript==

// >(o)__
//  (_~_/ — это талисман защиты от банов! скопируй его себе в скрипт на удачу.
(function(){
//-----------------------------------------------------------------------------
var AUTO_VALUE = 0; // подстановка свободного места во все поля. 1 — вкл., 0 — выкл.
//-----------------------------------------------------------------------------

var root = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;
if (root.location.href.indexOf('ganjawars.ru/object.php?id') == -1) return;

function isShop() {
    return (/Оборот за сегодня: \$(\d+)/.test(root.document.body.innerHTML));
};

function getNode() {
    var b = root.document.getElementsByTagName('b');
    for (var i = 0, l = b.length; i < l; i++) {
        if (/Сейчас в продаже/.test(b[i].innerHTML)) {
            return b[i].previousSibling.previousSibling;
        }
    }
    return false;
};

function getXmlHttp(){
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}

function init(func) {
    var xmlhttp = getXmlHttp();
    xmlhttp.open('GET', '/items.php', true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200) {
                func(xmlhttp);
            }
        }
    }
    xmlhttp.send(null);
};

function printSpace(space) {
    var node = getNode();
    var span = root.document.createElement('span');
    span.innerHTML = '<br />Свободное место в рюкзаке: <b>'+ space +'</b><br />';
    node.parentNode.insertBefore(span, node);
};

function setAllValue(value) {
    var input = root.document.getElementsByName('amount');
    for (var i = 0, l = input.length; i < l; i++) {
        input[i].value = value;
    }
}

// не в магазинчке мы
if (!isShop()) return;

init(function(req) {
    // кол-во свободного места
    var _s = /Предметы с собой \((\d+)\/(\d+)\)/.exec(req.responseText);
    var space = _s[2] - _s[1];
    
    // рисуем место
    printSpace(space);
    
    // заполняем поля
    if (AUTO_VALUE) {
        setAllValue(space);
    }
});

})();