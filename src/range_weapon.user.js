// ==UserScript==
// @name			Range Weapons
// @namespace		using namespace std;
// @description		Добавляет дальность оружия на странице информации любого персонажа.
// @include			http://www.ganjawars.ru/info.php*
// @license			MIT
// @version			1.3
// @author			MyRequiem
// ==/UserScript==

(function() {
//--------------------------------------------------------------------------------------------------
	function ajaxQuery(url, onsuccess, onfailure) {
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open('GET', url, true);
		xmlHttpRequest.send(null);

		var timeout = setTimeout(function() {xmlHttpRequest.abort();}, 10000);

		xmlHttpRequest.onreadystatechange = function() {
			if (xmlHttpRequest.readyState != 4) return;

			clearTimeout(timeout);
			if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200 && typeof onsuccess != 'undefined') {
				onsuccess(xmlHttpRequest);
			} else {
				if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status != 200 && typeof onfailure != 'undefined') {
					onfailure();
				}
			}
		};
	}
//--------------------------------------------------------------------------------------------------
	function getRange(link1, link2) {
		ajaxQuery(link1.href, function(xml) {
			result[result.length] = reg.test(xml.responseText) ? reg.exec(xml.responseText)[1] : '-';

			if (link2 && link1.href == link2.href) {	//если две руки, но оружие одинаковое, то второй запрос не делаем
				result[result.length] = result[result.length - 1];
				showData();
			} else if (link2) {
				root.setTimeout(function() {getRange(link2);}, 700);
			} else {
				showData();
			}
		}, function() {
			alert('Range Weapons: ошибка ответа сервера');
		});
	}
//--------------------------------------------------------------------------------------------------
	function showData() {
		var str = '<span style="color: #0000FF; margin-left: 5px;">[';
		b[0].innerHTML += str + result[0] + ']</span>';
		if (result[1]) b[1].innerHTML += str + result[1] + ']</span>';
	}
//--------------------------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var reg = /Дальность стрельбы: (\d+) ход/i;
	var result = [];

	var equipment, a;
	var b = root.document.getElementsByTagName('b');
	for (var i = 0; i < b.length; i++) {
		if (b[i].innerHTML == 'Вооружение') {
			equipment = b[i].parentNode.parentNode.nextElementSibling;
			a = equipment.getElementsByTagName('a');
			b = equipment.getElementsByTagName('b');
			equipment = equipment.innerHTML;
			break;
		}
	}

	//если оружия в руках нет вообще
	if(!/Правая рука/i.test(equipment) && !/Левая рука/i.test(equipment)) return;

	if(/Правая рука/i.test(equipment) && /Левая рука/i.test(equipment)) {
		getRange(a[0], a[1]);
	} else {
		getRange(a[0]);
	}

}());
