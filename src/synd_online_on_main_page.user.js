// ==UserScript==
// @name			Synd online on the main page
// @namespace		using namespace std;
// @description		Добавляет на главной странице персонажа ссылку на его основной синдикат и союз, при нажатии на которые выводится онлайн синда со ссылками отправки сообщения каждому бойцу. Если персонаж в бою, то ссылка на него будет красная. Так же добавляются конвертики для отправки сообщений в "Мои друзья" и "Гости".
// @include			http://www.ganjawars.ru/me/*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {
//-----------------------------------------------------------------------------
	function ajaxQuery(url, async, onsuccess, onfailure) {
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open('GET', url, async);
		xmlHttpRequest.send(null);

		if (async) {
			var timeout = setTimeout(function() {xmlHttpRequest.abort();}, 10000);

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
		} else {
			if (xmlHttpRequest.status == 200 && typeof onsuccess != 'undefined') {
				onsuccess(xmlHttpRequest);
			} else {
				if (xmlHttpRequest.status != 200 && typeof onfailure != 'undefined') {
					onfailure();
				}
			}
		}
	}
//-----------------------------------------------------------------------------
	function start(url, type) {
		if (!target_div.firstElementChild || target_div.firstElementChild.nodeName != 'DIV') {
			target_div.innerHTML = '';
			target_div.appendChild(doc.createElement('div'));
			if (synd_union) {
				target_div.appendChild(doc.createElement('hr'));
				target_div.appendChild(doc.createElement('div'));
			}
		}

		var div1 = target_div.firstElementChild;
		var div2 = target_div.lastElementChild;

		if (!type) {
			div1.innerHTML = '';
			div1.appendChild(img_load);
		} else {
			div2.innerHTML = '';
			div2.appendChild(img_load);
		}

		ajaxQuery(url, true, function(xml) {
			span.innerHTML = xml.responseText;
			var time = /(\d+:\d+), \d+ игроков онлайн/.exec(span.innerHTML)[1];
			var fighters = [];
			var tabl = span.getElementsByTagName('table');
			for (var i = 0; i < tabl.length; i++) {
				if (/\d+ бойцов онлайн/.test(tabl[i].firstElementChild.firstElementChild.innerHTML)) {
					var trs = tabl[i].getElementsByTagName('tr');
					if (trs.length == 1) break;
					for (var j = 1; j < trs.length; j++) {
						var war = false;
						//если в бою, то делаем ссылку на перса красной
						if (trs[j].lastElementChild.firstElementChild.nodeName == 'A') war = true;
						fighters[fighters.length] = trs[j].firstElementChild.nextElementSibling.firstElementChild;
						if (war) {
							var temp = fighters[fighters.length - 1].getElementsByTagName('a');
							temp.length == 2 ? temp[1].setAttribute('style', 'color:#ff0000;') : temp[0].setAttribute('style', 'color:#ff0000;');
						}
					}
					break;
				}
			}

			var img_synd = doc.createElement('a');
			img_synd.href = url;
			img_synd.setAttribute('target', '_blanc');
			var id = /id=(\d+)/.exec(url)[1];
			img_synd.innerHTML = '<img src="http://images.ganjawars.ru/img/synds/' + id +
				'.gif" width="20" height="14" border="0" alt="#' + id + '" title="#' + id + '" />';

			span.innerHTML = '';
			span.appendChild(img_synd);
			span.innerHTML += ' ' + time + '<br>';

			if (fighters.length) {
				for (i = 0; i < fighters.length; i++) {
					var name = fighters[i].lastElementChild.firstElementChild.innerHTML;
					var sms_link = doc.createElement('a');
					sms_link.href = 'http://www.ganjawars.ru/sms-create.php?mailto=' + name;
					var img_sms = doc.createElement('img');
					img_sms.src = sms_img;
					sms_link.appendChild(img_sms);
					fighters[i].insertBefore(sms_link, fighters[i].firstElementChild);
					span.appendChild(fighters[i]);
					span.appendChild(doc.createTextNode(', '));
				}
				span.innerHTML += ' <span style="font-weight: bold; color: #0000FF;">(' + fighters.length + ')</span>';
			} else {
				span.innerHTML += '<span style="color: #FF0000;">Никого нет</span>';
			}

			if (!type) {
				div1.innerHTML = span.innerHTML;
			} else {
				div2.innerHTML = span.innerHTML;
			}
		},
		function() {
			target_div.innerHTML = '';
			alert('Synd online on the main page: Ошибка ответа сервера.');
		});
	}
//-----------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var span = doc.createElement('span');
	var target_div = doc.getElementById('friendsbody');
	//картинка загрузки данных
	var img_load = doc.createElement('img');
	img_load.setAttribute('style', 'margin-left: 30px; margin-top: 10px; margin-bottom: 10px;');
	img_load.src = "data:image/gif,GIF89a!%00%08%00%91%00%00%CC%CC%CCf%CC%00%FF%FF%FF%00%00%00!%FF%0BNETSCAPE2.0%03%01%00%00%00!%F9%04%05%07%00%02%00%2C%00%00%00%00!%00%08%00%00%02%2B%14%8E%A9%CBh%02%A3%9C%B4%C6%23%82%0E%C6%A5%8E%7D%22%90m%209%86%DEZj%E7%9B%A2%EC%C6%C5%F0%AAZ%FA.%C9%CD%0F%C4%14%00%00!%F9%04%05%07%00%02%00%2C%07%00%02%00%04%00%04%00%00%02%04%8C%8F%19%05%00!%F9%04%05%07%00%02%00%2C%0C%00%02%00%04%00%04%00%00%02%04%8C%8F%19%05%00!%F9%04%05%07%00%02%00%2C%02%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%05%07%00%02%00%2C%07%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%05%07%00%02%00%2C%0C%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%09%07%00%02%00%2C%00%00%00%00!%00%08%00%00%02%14%94%8F%A9%CB%ED%0F%13%98%20ZC%EB%8Dys%EA%85%E2%88%14%00%3B";
	var sms_img = "data:image/gif,GIF87a%12%00%0B%00%B3%00%00%FF%FF%FF%CC%CC%CCgf%00fffF%D5F%406%00%2B%A8%2B%26%8D%26%25%CB%25%1C%BC%1C%0Dk%0D%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%2C%00%00%00%00%12%00%0B%00%00%0430%C8I%AB%04%C1%E8%CD%BB%19%D9%20z%06%81%24%CA%97%91%9B%22%08%87%CA%B6E%11%83%B3%A6%24%A8%FC%89%C0Q%07%97%1B%AE%82A%0F%B1%B8%19%00%90Ph%04%00%3B";

	//конвертики у друзей и у гостей
	var guests, friends;
	var a = doc.getElementsByTagName('a');
	for (var i = 0; i < a.length; i++) {
		if (a[i].innerHTML == 'Гости') {
			guests = a[i];
			friends = guests.parentNode.previousElementSibling.lastElementChild;
			break;
		}
	}

	//помещаем свою функцию установки конвертиков в документ
	var s = doc.createElement('script');
	s.innerHTML = "function setSms() {" +
		"var _nobr = document.getElementById('friendsbody').getElementsByTagName('nobr');" +
		"if (!_nobr.length) return false;" +
		"for (var i = 0; i < _nobr.length; i++) {" +
			"var _name = _nobr[i].lastElementChild.firstElementChild.innerHTML;" +
			"var _link_sms = document.createElement('a');" +
			"_link_sms.setAttribute('target', '_blank');" +
			"_link_sms.href = 'http://www.ganjawars.ru/sms-create.php?mailto=' + _name;" +
			"var _img_sms = document.createElement('img');" +
			'_img_sms.src = "' + sms_img + '";' +
			"_link_sms.appendChild(_img_sms);" +
			"_nobr[i].insertBefore(_link_sms, _nobr[i].firstElementChild);" +
		"}" +
		"return false;" +
	"}";
	doc.getElementsByTagName('head')[0].appendChild(s);

	friends.setAttribute('href', '#');
	friends.setAttribute('onclick', 'setfriends(); setSms();');
	guests.setAttribute('href', '#');
	guests.setAttribute('onclick', 'setvisitors(); setSms();');
	friends.click();


	//ищем основной синдикат персонажа
	var synd_main;
	var b = doc.getElementsByTagName('b');
	for (i = 0; i < b.length; i++) {
		if (b[i].innerHTML == 'Основной синдикат:') {
			synd_main = b[i].nextElementSibling.firstElementChild.href;
			break;
		}
	}

	if (!synd_main) return;

	//узнаем союзный синд
	var synd_union;
	ajaxQuery(synd_main + '&page=politics', false, function(xml) {
		span.innerHTML = xml.responseText;
		var b = span.getElementsByTagName('b');
		for (var i = 0; i < b.length; i++) {
			if (b[i].innerHTML == 'Союзный синдикат:') {
				synd_union = b[i].nextElementSibling.href;
				break;
			}
		}
	},
	function() {
		alert('Synd online on the main page: Ошибка ответа сервера.');
	});

	//вставляем новую ссылку с номером синда рядом со ссылкой "Гости"
	b = doc.createElement('b');
	var link = doc.createElement('span');
	link.setAttribute('style', 'text-decoration: underline; cursor: pointer;');
	link.innerHTML = 'Основа';
	link.addEventListener('click', function() {
		start(synd_main + '&page=online', 0);
	}, false);
	b.appendChild(doc.createTextNode(' / '));
	b.appendChild(link);
	if (synd_union) {
		link = doc.createElement('span');
		link.setAttribute('style', 'text-decoration: underline;  cursor: pointer;');
		link.innerHTML = 'Союз';
		link.addEventListener('click', function() {
			start(synd_union + '&page=online', 1);
		}, false);
		b.appendChild(doc.createTextNode(' '));
		b.appendChild(link);
	}
	guests.parentNode.parentNode.appendChild(b);

}());
