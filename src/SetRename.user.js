// ==UserScript==
// @name             SetRename [GW]
// @namespace        http://www.heymexa.ru/
// @description      Пиу-пиу, пыщ-пыщ
// @include          http://www.ganjawars.ru/items.php*
// @include          http://ganjawars.ru/items.php*
// @version          1.0
// @author           W_or_M
// ==/UserScript==

// >(o)__
//  (_~_/ — это талисман защиты от банов! скопируй его себе в скрипт на удачу.
(function(){

var root = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;

root.addHandler = function(obj, name, handler) {
    if (obj.addEventListener) obj.addEventListener(name, handler, false)
    else obj.attachEvent('on'+ name, handler);
};

root.SetRename = function(event) {
    try {
        var o = document.getElementsByName('set_id')[0];
        var s = /^\d+\. (.*?)$/.exec(o.options[o.selectedIndex].innerHTML)[1];
        document.getElementsByName('set_name')[0].value = s;
    } catch (e) {}
};

// костыль для оперы
if (root.opera) {
    root.postdo = function(url) {
        new Ajax.Updater('itemsbody', url, {asynchronous:true, onSuccess: dumb, method: 'post' });
        return false;
    }
}

root.dumb = function(req) {
    setTimeout(function() {
        root.addHandler(root.document.getElementsByName('set_id')[0], 'change', root.SetRename);
        root.SetRename();
    }, 10);
};

if (root.location.href.indexOf('ganjawars.ru/items.php') >= 0) {
    root.addHandler(root.document.getElementsByName('set_id')[0], 'change', root.SetRename);
    root.SetRename();
}

})();