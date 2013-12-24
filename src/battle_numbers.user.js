// ==UserScript==
// @name             BattleNumbers [GW]
// @namespace        http://gw.heymexa.net/
// @description      Ставит порядковый номер противника рядом с его ником. Полный лог бой в не js-версии.
// @include          http://www.ganjawars.ru/b0/b.php*
// @version          1.03
// @author           W_or_M
// ==/UserScript==

(function() {

var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

var chat;

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


function ajax(url, onload) {

    var xmlhttp = getXmlHttp();
    xmlhttp.open('GET', url, true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200) {
                onload(xmlhttp);
            }
        }
    };
    xmlhttp.send(null);

}


// возвращает список врагов
function getEnemyList() {

    var o = root.document.getElementsByName('enemy');
    var enemy = false;
    if (o.length) {

        o = o[0];

        enemy = [];

        // составляем массив id перса => его дистанция
        for (var k = 0; k < o.childNodes.length; k++) {

            if ((position = /(\d+)\. (.*)\[(\d+)\] \d+ HP - (\d+)/.exec(o.childNodes[k].innerHTML)) != null) {

                enemy[o.childNodes[k].value] = position[1];

            }

        }

    }

    return enemy;

}

// устанавливает порядковые номера вражинам
function setEnemyPosition(enemyList) {

    // ищем противников справа
    // найденым добавляем порядковый номер
    var a = root.document.getElementsByTagName('a');
    for (i = 0, l = a.length; i < l; i++) {

        var id = /userheader(\d+)/.exec(a[i].id);
        if (id != null) {

            if (typeof enemyList[id[1]] != 'undefined') {

                a[i].innerHTML = enemyList[id[1]] +'. '+ a[i].innerHTML;

            }

        }

    }

}

// возвращает id боя
function getBattleId() {

    var form = root.document.getElementsByName('battlechat');

    if (form.length) {

        form = form[0];

        // кастрированный лог

        if (form.parentNode.nextElementSibling.tagName == 'TABLE') {

            chat = form.parentNode.nextElementSibling.firstElementChild.firstElementChild.firstElementChild.firstElementChild;

        } else {

            chat = form.parentNode.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.firstElementChild.firstElementChild;

        }

        // id боя
        var battle_id = /http:\/\/www\.ganjawars\.ru\/b0\/b\.php\?bid=(\d+)/i.exec(root.location.href);

        // типа сделали ход и айдишник из ссылки фик получили
        // значит получаем из ссылки "обновить"
        if (!battle_id) {

            var a = root.document.getElementsByTagName('a');

            for (k = 0; k < a.length; k++) {

                if (/запись всех ходов/.test(a[k].innerHTML) && /\?bid=(\d+)/.test(a[k].href)) {

					battle_id = /\?bid=(\d+)/.exec(a[k].href);

                    return battle_id[1];

                }

            }

        } else {

            return battle_id[1];

        }

    }

    return false;
}

// получение div[id=log]
function getChatLog(div) {

    if (div.getElementById) {

        return div.getElementById('log').innerHTML;

    } else {

        var divs = div.getElementsByTagName('div');
        for (k = 0; k < divs.length; k++) {

            // лог нашли и заменям им кастрированный лог
            if (divs[k].id == 'log') {

                return divs[k].innerHTML;

            }

        }

    }

    return false;

}

// список врагов
var enemy;
if (enemy = getEnemyList()) {

	setEnemyPosition(enemy);

}

// полный лог чата
var battleId;
if (battleId = getBattleId()) {

	// получаем лог чата
	ajax('http://www.ganjawars.ru/b0/btk.php?bid='+ battleId +'&lines=-1&turn=-1', function(req) {

		var div = root.document.createElement('div');
		div.innerHTML = req.responseText;

		if ((log = getChatLog(div)) != false) {

			chat.innerHTML = log;

		}

	});

}


})();