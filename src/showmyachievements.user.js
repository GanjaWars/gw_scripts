// ==UserScript==
// @name			Show My Achievements
// @namespace		using namespace std;
// @description		Добавляет ссылку "Достижения" в верхней части страницы игры при нажатии на которую выводятся ачивки, но только те, которые были отмечены на странице достижений.
// @include			http://www.ganjawars.ru*
// @exclude			http://www.ganjawars.ru/b0*
// @license			MIT
// @version			1.0
// @author			MyRequiem Идея: Горыныч
// ==/UserScript==

(function () {
//------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------
	function addCloseButton() {
		divRez.innerHTML += '<div style="margin-top: 5px;"><img id="closemyachievements" src="' +
			imClose + '"></img></div>';
		doc.getElementById('closemyachievements').addEventListener('click', function() {
			divRez.style.visibility = 'hidden';
		}, false);
	}
//------------------------------------------------------------------------------
	function showData(e) {
		e = e || root.event;
		divRez.style.left = e.pageX - 50;
		divRez.style.top = e.pageY + 25;
		divRez.style.visibility = 'visible';
		divRez.innerHTML = '<img src="' + imLoad + '">';

		var data = st.getItem('showmyachievements');
		var url = 'http://www.ganjawars.ru/info.ach.php?id=' + myID;
		if (!data) {
			divRez.innerHTML = 'Не выбрано ни одной ачивки на ' +
				'<a target="_blank" href="' + url + '">этой</a> странице.';
			addCloseButton();
		} else {
			ajaxQuery(url, function(xml) {
				span.innerHTML = xml.responseText;
				achiev = getachiev(span);
				data = data.split('|');

				var str = '';
				for (var i = 0; i < achiev.length; i++) {
					var fnt = achiev[i].getElementsByTagName('font');
					for (var j = 0; j < data.length; j++) {
						if (+data[j] == i) {
							str += '<b>' + getTarget(achiev[i]).nodeValue;
							var ind = /Получить карму|50 киллов игроков/.test(achiev[i].innerHTML) ? 1 : 0;
							str += ind ? ' <span style="color: ' + fnt[0].getAttribute('color') + ';">' + fnt[0].innerHTML + '</span></b>' : '</b>';
							str += '<div style="margin-bottom: 3px;">' + fnt[ind].innerHTML + '</div>';
						}
					}
				}

				divRez.innerHTML = str;
				addCloseButton();
			},
			function() {
				divRez.innerHTML = '<span style="color: #FF0000;">Ошибка ответа сервера...</span>';
				addCloseButton();
			});
		}
	}
//------------------------------------------------------------------------------
	function getachiev(obj) {
		var mass = [];
		var tbls = obj.getElementsByTagName('table');
		for (var i = 0; i < tbls.length; i++) {
			var pre = tbls[i].previousElementSibling;
			if (pre && pre.nodeName == 'SCRIPT' && /function showinfo\d\(\)/.test(pre.innerHTML)) {
				var tds = tbls[i].getElementsByTagName('td');
				for (var j = 0; j < tds.length; j++) {
					if (!/выполнено/.test(tds[j].innerHTML)) continue;
					mass[mass.length] = tds[j];
				}
			}
		}

		return mass;
	}
//------------------------------------------------------------------------------
	function getTarget(obj) {
		return obj.firstChild.nodeType == 3 ? obj.firstChild : obj.firstChild.nextSibling;
	}
//------------------------------------------------------------------------------
	function setCheckbox() {
		var dat = st.getItem('showmyachievements');
		var data;
		if (dat != '') data = dat.split('|');
		for (var i = 0; i < achiev.length; i++) {
			var chk = doc.createElement('input');
			chk.type = 'checkbox';
			chk.id = 'achiev' + i;
			chk.checked = 0;
			if (data) for (var j = 0; j < data.length; j++) if (+data[j] == i) chk.checked = 1;
			var target = getTarget(achiev[i]);
			achiev[i].insertBefore(chk, target);

			chk.addEventListener('click', function() {
				var mass = [];
				var checkb = doc.getElementsByTagName('input');
				for (var i = 0; i < checkb.length; i++) {
					var id = /^achiev(\d+)$/.exec(checkb[i].id);
					if (!id) continue;
					if (checkb[i].checked) mass[mass.length] = id[1];
				}

				st.setItem('showmyachievements', mass.join('|'));
			}, false);
		}
	}
//------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	var st = root.localStorage;

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiеm рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'Script Name:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	var doc = root.document;
	var span = doc.createElement('span');
	var myID = doc.cookie.match('(^|;) ?uid=([^;]*)(;|$)')[2];
	var imClose = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0A%00%00%00%0A%08%02%00%00%00%02PX%EA%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%04gAMA%00%00%B1%8F%0B%FCa%05%00%00%00%20cHRM%00%00z%26%00%00%80%84%00%00%FA%00%00%00%80%E8%00%00u0%00%00%EA%60%00%00%3A%98%00%00%17p%9C%BAQ%3C%00%00%00%1AtEXtSoftware%00Paint.NET%20v3.5.100%F4r%A1%00%00%00%92IDAT(Scd%A8%E7c%C0%07%EA%F9%BE%17%A4%BE%7D%7F%E3%CD%FFg%C8%E8GB%B8n%99%04%03P%F7%87%F3%BB%7F9X!%AB%00%CA%7D%9E%DF%CF%DE%2C%0A%92%06j%82%A8xw%FF%E4%DB%EF%F7%7F%06x%00%E5%80%82%60%7B%C1%D2P%15v%16%BF%DC%EC%3F%AD%9F%07%11A%91%06%EA%03%CA%FD%D6%D3%04%9A%81.%0D1%F3%E3%F6%A5%409%88-%08%DDp9%88%26%B8%0A%A8%E1%BF%3C%1C%81%FA%90%7D%05R%E1%E1%C8Q%0Dr%1A%3F%7F%BB%0C%90%C4%86%F8%00%C2f%A8c-p%C3%D5%00%00%00%00IEND%AEB%60%82";
	var imLoad = "data:image/gif,GIF89a!%00%08%00%91%00%00%CC%CC%CCf%CC%00%FF%FF%FF%00%00%00!%FF%0BNETSCAPE2.0%03%01%00%00%00!%F9%04%05%07%00%02%00%2C%00%00%00%00!%00%08%00%00%02%2B%14%8E%A9%CBh%02%A3%9C%B4%C6%23%82%0E%C6%A5%8E%7D%22%90m%209%86%DEZj%E7%9B%A2%EC%C6%C5%F0%AAZ%FA.%C9%CD%0F%C4%14%00%00!%F9%04%05%07%00%02%00%2C%07%00%02%00%04%00%04%00%00%02%04%8C%8F%19%05%00!%F9%04%05%07%00%02%00%2C%0C%00%02%00%04%00%04%00%00%02%04%8C%8F%19%05%00!%F9%04%05%07%00%02%00%2C%02%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%05%07%00%02%00%2C%07%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%05%07%00%02%00%2C%0C%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%09%07%00%02%00%2C%00%00%00%00!%00%08%00%00%02%14%94%8F%A9%CB%ED%0F%13%98%20ZC%EB%8Dys%EA%85%E2%88%14%00%3B";
	var achiev = [];

	//ищем ссылку "Форум"
	var target;
	var a = doc.getElementsByTagName('a');
	for (var i = 0; i < a.length; i++) {
		if(a[i].innerHTML == 'Форум') {
			target = a[i].parentNode;
			break;
		}
	}

	if (!target) return;
	//добавляем ссылку "Достижения" в верхнее меню
	target.appendChild(doc.createTextNode(' | '));
	var link = doc.createElement('span');
	link.innerHTML = 'Достижения';
	link.setAttribute('style', 'cursor: pointer;');
	link.addEventListener('click', showData, false);
	target.appendChild(link);

	//div для вывода результатов
	var divRez = document.createElement('div');
	divRez.setAttribute('style','visibility: hidden; position: absolute; padding: 3px; background-color: #E7FFE7; border: solid 1px #339933; border-radius:5px; top:0; left:0;');
	doc.body.appendChild(divRez);

	//если не на странице своих ачивок, выходим
	if (!~root.location.href.indexOf('/info.ach.php?id=' + myID)) return;

	//на странице своих ачивок
	if (!st.getItem('showmyachievements')) st.setItem('showmyachievements', '');
	achiev = getachiev(doc);
	setCheckbox();

}());
