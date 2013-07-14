// ==UserScript==
// @name             Move2Sector [GW] 
// @namespace        http://www.heymexa.ru/
// @description      Рядом с ссылкой на сектор добавляет ссылку на перемещение в этот сектор.
// @include          http://www.ganjawars.ru/*
// @version          1.0
// @author           W_or_M
// ==/UserScript==

(function() {
    
var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

// текст для перемещения
var MOVE_TEXT = ' [ move ] ';


// исключаем карту
if (root.location.href.indexOf('http://www.ganjawars.ru/map.php') >= 0 ) {
    
    return false;
    
}
        
// ищем все ссылки на сектора
var a = root.document.getElementsByTagName('a');
for (i = 0; i < a.length; i++) {
    
    // нашли
    var sector = /^http:\/\/www\.ganjawars\.ru\/map\.php\?sx=(\d+)&sy=(\d+)$/.exec(a[i].href);
    if (sector != null) {
        
        var aa = root.document.createElement('a');
        aa.appendChild(root.document.createTextNode(MOVE_TEXT));
        aa.style.textDecoration = 'none';
        aa.href = 'http://www.ganjawars.ru/map.move.php?gps=1&sxy=' + sector[1] + 'x' + sector[2];
        a[i].parentNode.insertBefore(aa, a[i].nextSibling);
        
    }
            
}

})();