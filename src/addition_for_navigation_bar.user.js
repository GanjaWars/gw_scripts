// ==UserScript==
// @name			Addition For Navigation Bar
// @namespace		using namespace std;
// @description		Добавляет возможность установить дополнительные ссылки в панель навигации.
// @include			http://www.ganjawars.ru*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {
//----------------------------------------------------------------------------
	function getPos(obj) {
		var x = 0;
		var y = 0;
		while(obj) {
			x += obj.offsetLeft;
			y += obj.offsetTop;
			obj = obj.offsetParent;
		}
		return {x:x, y:y};
	}
//----------------------------------------------------------------------------
	function _$(id) {return doc.getElementById(id);}
//----------------------------------------------------------------------------
	function clear_fields() {
		_$('lname').value = '';
		_$('lhref').value = 'http://';
	}
//----------------------------------------------------------------------------
	function getData() {return JSON.parse(st.getItem('navig_bar'));}
//----------------------------------------------------------------------------
	function setData(obj) {st.setItem('navig_bar', JSON.stringify(obj));}
//----------------------------------------------------------------------------
	function createLink(name, href, size) {
		var a = doc.createElement('a');
		a.setAttribute('style', 'color: #669966; text-decoration: none; font-size: ' + size + 'pt;');
		a.innerHTML = name;
		a.href = href;
		return a;
	}
//----------------------------------------------------------------------------
	function addLink(link, mode) {
		if (!mode) {    //добавление в панель
			var target = panel.lastElementChild.previousSibling;
			panel.insertBefore(doc.createTextNode(' | '), target);
			panel.insertBefore(link, target);
		} else {    //добавление в div
			//кнопка удаления ссылки
			var del_link = doc.createElement('span');
			del_link.setAttribute('style', 'margin-left: 2px; cursor: pointer; font-size: 7pt;');
			del_link.innerHTML = '[x]';

			var div = doc.createElement('div');
			div.appendChild(link);
			div.appendChild(del_link);
			div_main.insertBefore(div, div_main.lastElementChild);

			//обработчик удаления ссылки
			del_link.addEventListener('click', function() {
				//удаляем ссылку из панели
				var name = this.previousElementSibling.innerHTML;
				var a = panel.getElementsByTagName('a');
				for (var i = 0; i < a.length; i++) {
					if (a[i].innerHTML == name) {
						panel.removeChild(a[i].previousSibling);
						panel.removeChild(a[i]);
						break;
					}
				}

				//удаляем ссылку из div'а
				div_main.removeChild(this.parentNode);

				//удаляем ссылку из хранилища
				var data = getData();
				var temp = {};
				for (var n in data) {
					if (data.hasOwnProperty(n)) {
						if (n == name) continue;
						temp[n] = data[n];
					}
				}

				setData(temp);
			}, false);
		}
	}
//----------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var st = root.localStorage;

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiеm рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'Addition For Navigation Bar:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	//данные из хранилища
	var data = st.getItem('navig_bar');
	if (!data) {
		setData({});
		data = '{}';
	}

	data = JSON.parse(data);

	//ищем панель навигации
	var v = doc.cookie.match('(^|;) ?version=([^;]*)(;|$)')[2];	//версия оформления игры
	var panel = v == 'v2' ? doc.getElementsByTagName('div') : doc.getElementsByTagName('td');
	for (var i = 0; i < panel.length; i++) {
		if (/font\-size:\s?7pt/.test(panel[i].getAttribute('style'))) {
			panel = v == 'v2' ? panel[i].firstElementChild : panel[i];
			break;
		}
	}

	//панель не найдена. Видимо что-то случилось :)
	if (panel.length) return;

	//добавляем в панель '+'
	var add_link = doc.createElement('span');
	add_link.setAttribute('style', 'cursor: pointer;');
	add_link.innerHTML = '+';
	panel.appendChild(doc.createTextNode(' | '));
	panel.appendChild(add_link);

	//div для добавления ссылок
	var div_main = doc.createElement('div');
	var div_add = doc.createElement('div');
	div_add.setAttribute('style', 'margin-top: 5px;');
	div_add.innerHTML = 'Название:<br><input id="lname" type="text" maxlength="20" style="width: 237px;" /><br>' +
		'Ссылка:<br><input id="lhref" style="width: 237px;" value="http://"/><br>' +
		'<span id="set_link" style="cursor: pointer; color: #0000FF;">Добавить</span>' +
		'<span id="hide_nav_div" style="cursor: pointer; margin-left: 20px; color: #FF0000;">Закрыть</span>';
	div_main.appendChild(div_add);

	//добавляем ссылки из хранилища в панель и в div
	for (var n in data) {
		if (data.hasOwnProperty(n)) {
			addLink(createLink(n, data[n], 7));
			addLink(createLink(n, data[n], 9), 1);
		}
	}

	var pos = getPos(add_link);
	div_main.setAttribute('style', 'position: absolute; display: none; border: 1px #339933 solid; background: #F0FFF0; ' +
		'width: 240px; font-size: 8pt; padding: 3px; left: ' + (pos.x - 260) + '; top: ' + (pos.y + 12) + ';');
	doc.body.appendChild(div_main);

	//кнопа закрытия div'а
	_$('hide_nav_div').addEventListener('click', function() {
		div_main.style.display = 'none';
		clear_fields();
	}, false);

	//обработчик открытия/скрытия div'а
	add_link.addEventListener('click', function() {
		div_main.style.display = div_main.style.display ? '' : 'none';
		clear_fields();
	}, false);

	//обработчик кнопы добавления ссылки
	_$('set_link').addEventListener('click', function() {
		var val1 = _$('lname').value;
		var val2 = _$('lhref').value;
		if (!val1) {
			alert('Введите имя ссылки');
			return;
		} else if (!/^\s*http:\/\/[^\s]*\s*$/.test(val2)) {
			alert('Введена не верная ссылка.\nФормат: http://адрес_без_пробелов....');
			return;
		}

		val1 = /^\s*(.*[^\s])\s*$/.exec(val1)[1];
		val2 = /^\s*(http:\/\/[^\s]*)\s*$/.exec(val2)[1];

		//если ссылка с таким названием уже есть
		var a = panel.getElementsByTagName('a');
		for (var i = 0; i < a.length; i++) {
			if (a[i].innerHTML == val1) {
				alert('Такое название уже есть');
				return;
			}
		}

		//создаем ссылку и втыкаем ее в панель
		addLink(createLink(val1, val2, 7));
		//добавляем ссылку в div
		addLink(createLink(val1, val2, 9), 1);

		//добавляем ссылку в хранилище
		var data = getData();
		data[val1] = val2;
		setData(data);

		clear_fields();
	}, false);

}());
