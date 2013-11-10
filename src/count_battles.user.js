// ==UserScript==
// @name			Count Battles
// @namespace		using namespace std;
// @description		Показывает количество боев, побед и поражений за текущие сутки на странице протоколов боев.
// @include			http://www.ganjawars.ru/info.warstats.php*
// @license			MIT
// @version			1.5
// @author			MyRequiem
// ==/UserScript==

(function() {
//------------------------------------------------------------------------------
	function ajaxQuery(url, onsuccess, onfailure) {
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open('GET', url, true);
		xmlHttpRequest.send(null);

		var timeout = setTimeout(function() {
			xmlHttpRequest.abort();
			div_cb.innerHTML = 'Сервер не отвечает...';
		}, 10000);

		xmlHttpRequest.onreadystatechange = function () {
			if (xmlHttpRequest.readyState != 4) return;
			clearTimeout(timeout);
			if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200 && typeof onsuccess != 'undefined') {
				onsuccess(xmlHttpRequest);
			} else {
				if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status != 200 && typeof onfailure != 'undefined') {
					onfailure();
				}
			}
		}
	}
//------------------------------------------------------------------------------
	function setResultBattle(a) {
		for (var i = 0; i < a.length; i++) {
			if (a[i].firstElementChild) {
				var style = a[i].getAttribute('style');
				switch (style) {
					case 'color:red': {rez.win++; break;}
					case 'color:blue': {rez.loss++; break;}
					default: rez.draw++;
				}
				break;
			}
		}
	}
//------------------------------------------------------------------------------
	function parseData() {
		for (var i = 0; i < rez.btls.length; i++) {
			setResultBattle(rez.btls[i].getElementsByTagName('a'));
		}

		div_cb.innerHTML = 'Проведено боев за текущие сутки: <span style="font-weight: bold;">' + rez.btls.length +
			' (<span style="color: #FF0000;">' + rez.win + '</span>/<span style="color: #0000FF;">' +
			rez.loss + '</span>/<span style="color :#008000;">' + rez.draw + '</span>)</span>';
	}
//------------------------------------------------------------------------------
	function getBattles(obj) {  //ищет все бои за текущие сутки в документе и заносит их в массив
		var nobr = obj.getElementsByTagName('nobr');
		for (var i = 0; i < nobr.length; i++) {
			if (reg.test(nobr[i].innerHTML)) {
				rez.btls[rez.btls.length] = nobr[i].nextElementSibling;
			}
		}
		//если самый нижний бой в документе был сегодня, то нужно будет делать запрос на следующую страницу
		return reg.test(nobr[nobr.length - 2].innerHTML);
	}
//------------------------------------------------------------------------------
	function start(ind) {
		if (!ind) {
			if (getBattles(doc)) {
				div_cb.innerHTML = '<span style="margin-left: 100px;">Загрузка ' +
					'<img src="' + img_load_data + '" alt="Загрузка" title="Загрузка"></span>';
				start(++ind);
			} else {
				parseData();
			}
		} else {
			var id = /php\?id=(\d+)/.exec(loc)[1];
			ajaxQuery('http://www.ganjawars.ru/info.warstats.php?id=' + id + '&page_id=' + ind, function(xml) {
				var span = doc.createElement('span');
				span.innerHTML = xml.responseText;
				//если перс в это время зашел в заявку/бой, то просто перезагрузим страницу
				if (/игрок находится в бою/.test(span.innerHTML)) {
					root.location.reload();
					return;
				}

				if (getBattles(span)) {
					root.setTimeout(function() {start(++ind);}, 700);
				} else {
					parseData();
				}
			},
			function() {
				div_cb.innerHTML = 'Ошибка ответа сервера...';
			});
		}
	}
//------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var st = root.localStorage;

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiеm рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'Count Battles:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	var doc = root.document;
	var loc = root.location.href;
	var rez = {win: 0, draw: 0, loss: 0, btls: []};
	var img_load_data = "data:image/gif,GIF89a!%00%08%00%91%00%00%CC%CC%CCf%CC%00%FF%FF%FF%00%00%00!%FF%0BNETSCAPE2.0%03%01%00%00%00!%F9%04%05%07%00%02%00%2C%00%00%00%00!%00%08%00%00%02%2B%14%8E%A9%CBh%02%A3%9C%B4%C6%23%82%0E%C6%A5%8E%7D%22%90m%209%86%DEZj%E7%9B%A2%EC%C6%C5%F0%AAZ%FA.%C9%CD%0F%C4%14%00%00!%F9%04%05%07%00%02%00%2C%07%00%02%00%04%00%04%00%00%02%04%8C%8F%19%05%00!%F9%04%05%07%00%02%00%2C%0C%00%02%00%04%00%04%00%00%02%04%8C%8F%19%05%00!%F9%04%05%07%00%02%00%2C%02%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%05%07%00%02%00%2C%07%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%05%07%00%02%00%2C%0C%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%09%07%00%02%00%2C%00%00%00%00!%00%08%00%00%02%14%94%8F%A9%CB%ED%0F%13%98%20ZC%EB%8Dys%EA%85%E2%88%14%00%3B";

	//если перс в заявке/бою или не на первой странице протоколов
	if (/игрок находится в бою/.test(doc.body.innerHTML) ||
		(/page_id=\d+/.test(loc) && /page_id=(\d+)/.exec(loc)[1] != '0')) return;

	//вставляем div на страницу
	var div_cb = doc.createElement('div');
	div_cb.setAttribute('style', 'margin-left: 10px;');
	var nbr = doc.getElementsByTagName('nobr');
	for (var i = 0; i < nbr.length; i++) {
		if (/\d+\.\d+\.\d+ \d+:\d+/.test(nbr[i].innerHTML)) {
			nbr[i].parentNode.insertBefore(div_cb, nbr[i].previousElementSibling);
			break;
		}
	}

	var date = new Date();
	var year = /20(\d+)/.exec(date.getFullYear())[1];
	var month = (date.getMonth() + 1);
	month = month < 10 ? '0' + month : month + '';
	var day = date.getDate();
	day = day < 10 ? '0' + day : day + '';
	var reg  = new RegExp(day + '\\.' + month + '\\.' + year);

	start(0);

}());


