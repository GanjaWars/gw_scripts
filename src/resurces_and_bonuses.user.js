// ==UserScript==
// @name			ResurcesAndBonuses
// @namespace		using namespace std;
// @description		Создает "Ресурсы" и "Бонусы" рядом со ссылкой на форум. При клике выводятся соответствующие данные.
// @include			http://www.ganjawars.ru/*
// @exclude			http://www.ganjawars.ru/tmp/*
// @exclude			http://www.ganjawars.ru/login.php
// @exclude			http://www.ganjawars.ru/index.php
// @exclude			http://www.ganjawars.ru/b0*
// @exclude			http://www.ganjawars.ru/ferma.php?*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function(){
//------------------------------------------------------------------------------
	function ajaxQuery(url, onsuccess, onfailure) {
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open('GET', url, true);
		xmlHttpRequest.send(null);

		var timeout = setTimeout(function() {
			xmlHttpRequest.abort();
			alert('ResurcesAndBonuses: Превышено время ожидания ответа сервера...');
		}, 10000);

		xmlHttpRequest.onreadystatechange = function () {
			if (xmlHttpRequest.readyState != 4) {
				return;
			}
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
//------------------------------------------------------------------------------
	function showData(e) {
		e = e || root.event;
		divResult.style.left = e.pageX - 50;
		divResult.style.top = e.pageY + 25;
		divResult.style.visibility = 'visible';
		divResult.innerHTML = '<img src="' + imgLoad + '">';

		var idElem = e.target.id;
		ajaxQuery('http://www.ganjawars.ru/info.php?id=' + myID, function(xml) {
				span.innerHTML = xml.responseText;
				var b = span.getElementsByTagName('b');

				var data = '';
				if (idElem == 'res') {
					for (var i = 0; i < b.length; i++) {
						if (b[i].innerHTML == 'Ресурсы') {
							data = b[i].parentNode.parentNode.nextElementSibling.firstElementChild.innerHTML;
							if (/Ресурсов в наличии нет/i.test(data)) {
								data = '<span style="color: #0000FF;">Ресурсов в наличии нет</span>';
							}
							break;
						}
					}
				} else {
					for (i = 0; i < b.length; i++) {
						if (b[i].innerHTML == 'Бонусы') {
							data = b[i].parentNode.parentNode.nextElementSibling.firstElementChild.nextElementSibling.innerHTML;
							break;
						}
					}
				}

				divResult.innerHTML = data + '<div style="margin-top: 5px;"><img id="divres_close" src="' +
					imgClose + '"></img></div>';
				doc.getElementById('divres_close').addEventListener('click', function() {
					divResult.style.visibility = 'hidden';
				}, false);
			},
			function() {
				alert('ResurcesAndBonuses: ошибка ответа сервера...');
			});
	}
//------------------------------------------------------------------------------
	function createButton(value, id) {
		var span = doc.createElement('span');
		span.innerHTML = value;
		span.id = id;
		span.setAttribute('style', 'cursor: pointer;');
		span.addEventListener('click', showData, false);
		return span;
	}
//------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var span = doc.createElement('span');
	var myID = doc.cookie.match('(^|;) ?uid=([^;]*)(;|$)')[2];
	var imgClose = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0A%00%00%00%0A%08%02%00%00%00%02PX%EA%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%04gAMA%00%00%B1%8F%0B%FCa%05%00%00%00%20cHRM%00%00z%26%00%00%80%84%00%00%FA%00%00%00%80%E8%00%00u0%00%00%EA%60%00%00%3A%98%00%00%17p%9C%BAQ%3C%00%00%00%1AtEXtSoftware%00Paint.NET%20v3.5.100%F4r%A1%00%00%00%92IDAT(Scd%A8%E7c%C0%07%EA%F9%BE%17%A4%BE%7D%7F%E3%CD%FFg%C8%E8GB%B8n%99%04%03P%F7%87%F3%BB%7F9X!%AB%00%CA%7D%9E%DF%CF%DE%2C%0A%92%06j%82%A8xw%FF%E4%DB%EF%F7%7F%06x%00%E5%80%82%60%7B%C1%D2P%15v%16%BF%DC%EC%3F%AD%9F%07%11A%91%06%EA%03%CA%FD%D6%D3%04%9A%81.%0D1%F3%E3%F6%A5%409%88-%08%DDp9%88%26%B8%0A%A8%E1%BF%3C%1C%81%FA%90%7D%05R%E1%E1%C8Q%0Dr%1A%3F%7F%BB%0C%90%C4%86%F8%00%C2f%A8c-p%C3%D5%00%00%00%00IEND%AEB%60%82";
	var imgLoad = "data:image/gif,GIF89a!%00%08%00%91%00%00%CC%CC%CCf%CC%00%FF%FF%FF%00%00%00!%FF%0BNETSCAPE2.0%03%01%00%00%00!%F9%04%05%07%00%02%00%2C%00%00%00%00!%00%08%00%00%02%2B%14%8E%A9%CBh%02%A3%9C%B4%C6%23%82%0E%C6%A5%8E%7D%22%90m%209%86%DEZj%E7%9B%A2%EC%C6%C5%F0%AAZ%FA.%C9%CD%0F%C4%14%00%00!%F9%04%05%07%00%02%00%2C%07%00%02%00%04%00%04%00%00%02%04%8C%8F%19%05%00!%F9%04%05%07%00%02%00%2C%0C%00%02%00%04%00%04%00%00%02%04%8C%8F%19%05%00!%F9%04%05%07%00%02%00%2C%02%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%05%07%00%02%00%2C%07%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%05%07%00%02%00%2C%0C%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%09%07%00%02%00%2C%00%00%00%00!%00%08%00%00%02%14%94%8F%A9%CB%ED%0F%13%98%20ZC%EB%8Dys%EA%85%E2%88%14%00%3B";

	var divResult = document.createElement('div');
	divResult.setAttribute('style','visibility: hidden; position: absolute; padding: 3px; background-color: #E7FFE7; border: solid 1px #339933; border-radius:5px; top:0; left:0;');
	doc.body.appendChild(divResult);

	//ищем ссылку на Форум
	var target;
	var a = doc.getElementsByTagName('a');
	for (var i = 0; i < a.length; i++) {
		if(a[i].innerHTML == 'Форум') {
			target = a[i].parentNode;
			break;
		}
	}

	if (!target) return;
	target.appendChild(doc.createTextNode(' | '));
	target.appendChild(createButton('Ресурсы', 'res'));
	target.appendChild(doc.createTextNode(' | '));
	target.appendChild(createButton('Бонусы', 'bonus'));

}());
