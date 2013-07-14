// ==UserScript==
// @name             ATATA [GW] 
// @namespace        http://www.heymexa.ru/
// @description      Ссылки на персонажей и недвигу заменяются ссылками нападения.
// @include          http://www.ganjawars.ru/*
// @include          http://battles.ganjawars.ru/*
// @include          http://quest.ganjawars.ru/*
// @version          1.01
// @author           W_or_M
// ==/UserScript==

(function() {

var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

    // пробегаем по всем ссылкам
    // для нужных присобачиваем параметры для нападения
    var a = root.document.getElementsByTagName('a');
    for (i = 0, l = a.length; i < l; i++) {
    
        // перс
        if (/^http:\/\/www\.ganjawars\.ru\/info\.php\?id=\d+$/.test(a[i].href)) {
            
            a[i].href += '&showattack=1&pampam=1';
            
        }
        
        // недвига
        if (/^http:\/\/www\.ganjawars\.ru\/object\.php\?id=\d+$/.test(a[i].href)) {
            
            a[i].href += '&attack=1';
            
        }
    }
    
})();