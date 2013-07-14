// ==UserScript==
// @name             SindAlarm [GW]
// @namespace        http://www.heymexa.ru
// @description      Звуковое оповещение при загорании кнопки «Бой»
// @include          http://www.ganjawars.ru/me/*
// @include          http://ganjawars.ru/me/*
// @version          1.0
// @author           W_or_M
// ==/UserScript==

(function(){

var SOUND_ID = 13;

var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

function playSound(soundId) {
    
    // создаем контейнер, если еще не создан
    if (root.document.getElementById('flashcontent') == null) {
        
        var div = root.document.createElement('div');
        div.id = 'flashcontent';
        root.document.body.appendChild(div);
        
    }

    root.document.getElementById('flashcontent').innerHTML = '<embed height="1" width="1" flashvars="soundPath=/sounds/'+ soundId +'.mp3" allowscriptaccess="always" quality="high" bgcolor="#F5fff5" name="gr_server" id="gr_server" src="http://images.ganjawars.ru/i/play.swf" type="application/x-shockwave-flash"/>';
    
}

if (root.location.href.indexOf('ganjawars.ru/me/') >= 0) {
    
    var a = root.document.getElementsByTagName('a');
    for (var i = 0, l = a.length; i < l; i++) {
        
        if (a[i].title == 'Ваш синдикат заявлен на бой') {
            
            playSound(SOUND_ID);
            
        }
        
    }
    
}

})();