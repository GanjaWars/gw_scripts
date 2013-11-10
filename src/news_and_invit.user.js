// ==UserScript==
// @name			News GW
// @namespace		using namespace std;
// @description		Мигание новых и не прочитанных новостей на главной странице персонажа.
// @include			http://www.ganjawars.ru/me/*
// @include			http://www.ganjawars.ru/messages.php?fid=1&tid=*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {
//------------------------------------------------------------------------------
	function getNewsLinks() {
		var nobr = doc.getElementsByTagName('nobr');
		for (var i = 0; i < nobr.length; i++) {
			var child = nobr[i].firstElementChild;
			if (child && /\/messages\.php\?fid=1&tid=\d+/.test(child.href)) {
				return nobr[i].getElementsByTagName('a');
			}
		}
		return false;
	}
//------------------------------------------------------------------------------
	function setBlink(elem) {
		root.setInterval(function() {
			elem.style.visibility = elem.style.visibility == 'visible' ? 'hidden' : 'visible';
		}, 700);
	}
//------------------------------------------------------------------------------
	function getNewsId(str) {
		return /&tid=(\d+)/.exec(str)[1];
	}
//------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var loc = root.location.href;
	var doc = root.document;
	var st = root.localStorage;
	var news_id;

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiеm рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'News GW:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	//приглосы
	var a = doc.getElementsByTagName('a');
	for (var i = 0; i < a.length; i++) {
		if (/\/me\/\?nb=synd/.test(a[i].href) && /Приглашения/.test(a[i].innerHTML)) {
			a[i].setAttribute('style', 'color: #FF0000; font-weight: bold;');
			break;
		}
	}

	var data = JSON.parse(st.getItem('news_gw'));

	//на форуме новостей
	if (/fid=1&tid=\d+/.test(loc) && data) {
		news_id = getNewsId(loc);
		if (data[news_id] == '0') {
			data[news_id] = '1';
			st.setItem('news_gw', JSON.stringify(data));
		}
		return;
	}

	//на главной
	var links = getNewsLinks();
	if (!links) return;
	var new_data = {};

	for (i = 0; i < links.length; i++) {
		news_id = getNewsId(links[i].href);
		if (!data) {	//если данных в storage нет, то записываем все темы как прочитанные
			new_data[news_id] = '1';
			continue;
		}

		if (!data[news_id]) data[news_id] = '0';
		if (data[news_id] == '0') {
			//{text-decoration: blink;} хром не понимает, пишем костыль
			links[i].style.color = '#FF0000';
			setBlink(links[i]);
		}

		new_data[news_id] = data[news_id];
	}

	st.setItem('news_gw', JSON.stringify(new_data));

}());
