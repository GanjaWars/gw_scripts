// ==UserScript==
// @name			House Health
// @namespace		using namespace std;
// @description		Выводит сообщение после боя, если персонаж находится не в секторе со своим домиком и его здоровье менее 80%.
// @include			http://www.ganjawars.ru/warlog.php?bid=*
// @include			http://www.ganjawars.ru/b0*
// @license			MIT
// @version			1.1
// @author			MyRequiem
// ==/UserScript==

(function() {
//----------------------------------------------------------------------------------------------------------------------
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
//----------------------------------------------------------------------------------------------------------------------
	function start(url, type) {
		ajaxQuery(url, function(xml) {
			spanContent.innerHTML = xml.responseText;

			var i;
			if (!type) {
				//ищем сектор перса
				var b = spanContent.getElementsByTagName('b');
				for (i = 0; i < b.length; i++) {
					if (b[i].innerHTML == 'Район:' && b[i].nextElementSibling && b[i].nextElementSibling.nodeName == 'A') {
						sector = b[i].nextElementSibling.innerHTML;
						break;
					}
				}

				setTimeout(function() {start(realty_link, 1);}, 500);

			} else {
				var table = spanContent.getElementsByTagName('table');
				for (i = 0; i < table.length; i++) {
					if (table[i].getAttribute('class') == 'wb' && table[i].getAttribute('align') == 'center') {
						var tr = table[i].getElementsByTagName('tr');
						for (var j = 1; j < tr.length; j++) {
							var node = tr[j].firstElementChild;
							if (/Частный дом/.test(node.innerHTML) && ~node.nextElementSibling.innerHTML.indexOf(sector)) return;
						}
					}
				}
				alert('Вы находитесь не в секторе с домиком !');
			}
		},
		function() {
			alert('House Health: ошибка ответа сервера');
		});
	}
//----------------------------------------------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var spanContent = doc.createElement('span');
	var sector;
	var st = root.localStorage;

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiеm рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'House Health:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}


	//в бою устанавливаем запись и выходим
	if (/b0/.test(root.location.href)) {
		st.setItem('house_health', '1');
		return;
	}

	//на странице лога боя
	if (st.getItem('house_health') == '0') return;
	st.setItem('house_health', '0');

	//найдем здоровье, если оно больше 80%, то выходим
	if (!doc.getElementById('hpheader').firstElementChild) return;

	myID = doc.cookie.match('(^|;) ?uid=([^;]*)(;|$)')[2];
	//ссылка на недвижимость перса
	var realty_link = 'http://www.ganjawars.ru/info.realty.php?id=' + myID;

	start('http://www.ganjawars.ru/info.php?id=' + myID, 0);

}());
