// ==UserScript==
// @name			Critical Shots And Links in Battles
// @namespace		using namespace std;
// @description		В бою и на странице лога боя показывает критические выстрелы вашего персонажа и их общее количество. Делает все ники персонажей в логе боя ссылками.
// @include			http://www.ganjawars.ru/b0*
// @include			http://www.ganjawars.ru/warlog.php?bid=*
// @include			http://battles.ganjawars.ru/warlog.php?*
// @license			MIT
// @version			1.1
// @author			MyRequiem
// ==/UserScript==

(function() {

	//НАСТРОЙКИ
	var show_crits = 1;	// 1 - выводить криты, 0 - нет
	//КОНЕЦ НАСТРОЕК

//------------------------------------------------------------------------------
	function Critical_shots() {
		this.groin = 0;		//пах
		this.neck = 0;		//шея
		this.ear = 0;		//ухо
		this.temple = 0;	//висок
		this.getAllCrits = function() {return this.groin + this.neck + this.ear + this.temple;}
	}
//------------------------------------------------------------------------------
	function get_critical_shots(b, page) {
		var critical_shots = new Critical_shots();

		for (i = 0; i < b.length; i++) {
			//делаем ссылки на персов
			//если это не урон (-XX), 'vs' и т.д. и ссылка еще не установлена
			if (!/^\-\d+|vs|\[|,/.test(b[i].innerHTML) && !/может взять предметы/.test(b[i].innerHTML) &&
				!(b[i].firstElementChild && b[i].firstElementChild.nodeName == 'A')) {

				var linkStyle = 'text-decoration: none; font-weight: 700;';
				if (page) {
					linkStyle += 'font-size: 12px;';
				} else {
					linkStyle += 'font-size: 11px;';
				}

				var nik, font;
				if ((font = b[i].parentNode) && font.nodeName == 'FONT') {
					linkStyle += ' color: ' + font.color + ';';
				}

				//если это окрашенный ник, то внутри будет <font>
				if (font = b[i].firstElementChild) {
					linkStyle += ' color: ' + font.color + ';';
					nik = font.innerHTML;
				} else {
					nik = b[i].innerHTML;
				}

				var a = doc.createElement('a');
				a.setAttribute('style', linkStyle);
				a.setAttribute('target', '_blank');
				a.href = 'http://www.ganjawars.ru/search.php?key=' + nik;
				a.innerHTML = nik;

				b[i].innerHTML = '';
				b[i].appendChild(a);
			}

			//если мой ход, то проверяем криты
			if (~b[i].innerHTML.indexOf(myNik) && b[i].previousSibling &&
				b[i].previousSibling.nodeValue && (/\d+:\d+, #\d+ :/.test(b[i].previousSibling.nodeValue))) {

				//получаем запись своего хода
				var str = '';
				var node = b[i];
				while (node.nodeName != 'BR') {
					if (node.nextSibling.nodeValue) str += node.nextSibling.nodeValue;
					node = node.nextSibling;
				}

				//считаем криты
				if (/в пах/.test(str))  {
					if (/\d+ в пах/.test(str)) {
						critical_shots.groin += (+/(\d+) в пах/.exec(str)[1]);
					} else {
						critical_shots.groin++;
					}
				}

				if (/в шею/.test(str))  {
					if (/\d+ в шею/.test(str)) {
						critical_shots.neck += (+/(\d+) в шею/.exec(str)[1]);
					} else {
						critical_shots.neck++;
					}
				}

				if (/в ухо/.test(str))  {
					if (/\d+ в ухо/.test(str)) {
						critical_shots.ear += (+/(\d+) в ухо/.exec(str)[1]);
					} else {
						critical_shots.ear++;
					}
				}

				if (/в висок/.test(str))  {
					if (/\d+ в висок/.test(str)) {
						critical_shots.temple += (+/(\d+) в висок/.exec(str)[1]);
					} else {
						critical_shots.temple++;
					}
				}
			}
		}

		return critical_shots;
	}
//------------------------------------------------------------------------------
	function showCrits(result) {
		if (!show_crits) return;
		getObj('data_div').innerHTML = '<span style="color: #008000; font-weight: bold;">Криты:</span> ' +
			'<span style="color: #FF0000; font-weight: bold;">' + result.getAllCrits() + '</span> ' +
			'[ <span style="text-decoration: underline;">в пах:</span><span style="color: #FF0000;"> ' + result.groin +
			'</span> <span style="text-decoration: underline;">в шею:</span> <span style="color: #FF0000;">' +
			result.neck + '</span> <span style="text-decoration: underline;">в ухо:</span> ' +
			'<span style="color: #FF0000;">' + result.ear + '</span> <span style="text-decoration: underline;">' +
			'в висок:</span> <span style="color: #FF0000;">' + result.temple + '</span> ]';
	}
//------------------------------------------------------------------------------
	function getObj(id) {return doc.getElementById(id);}
//------------------------------------------------------------------------------
	function change_updatechatlines() {
		root.updatechatlines = function() {
			var logDiv = root.frames.bsrc.document.getElementById('log');
			if (logDiv && logDiv.childNodes.length) {
				var battleLog = root.document.getElementById('log');
				battleLog.innerHTML = logDiv.innerHTML + battleLog.innerHTML;
				logDiv.innerHTML = '';
			}
			showCrits(get_critical_shots(document.getElementById('log').getElementsByTagName('b'), 0));
		};
	}
//------------------------------------------------------------------------------
	function start() {
		var center, b;
		//в бою
		if (/www\.ganjawars\.ru\/b0/.test(root.location.href)) {
			//ждем загрузки данных на странице
			if (/загружаются данные/i.test(getObj('listleft').innerHTML)) {
				root.setTimeout(start, 100);
				return;
			}

			//ищем свой ник
			var myID = doc.cookie.match('(^|;) ?uid=([^;]*)(;|$)')[2];
			for (var i = 0; i < a.length; i++) {
				if ((a[i].href == 'http://www.ganjawars.ru/info.php?id=' + myID) && a[i].firstElementChild) {
					myNik = a[i].firstElementChild.innerHTML;
					break;
				}
			}

			center = doc.getElementsByName('battlechat')[0].parentNode;
			center.appendChild(data_div);
			center.appendChild(doc.createElement('br'));

			b = getObj('log').getElementsByTagName('b');

			//если хром, то криво xD)
			if (/Chrome/i.test(root.navigator.appVersion)) {
				root.setInterval(function() {showCrits(get_critical_shots(b, 0));}, 1000);
			} else {
				change_updatechatlines();	//изменяем функцию обновления чата на странице
				showCrits(get_critical_shots(b, 0));
			}
		} else {	//на странице лога боя
			var v = doc.cookie.match('(^|;) ?version=([^;]*)(;|$)')[2];
			var ind = (v == 'v2') ? 1 : 2;
			myNik =  a[ind].firstElementChild.innerHTML;

			b = doc.getElementsByTagName('b');
			for (i = 0; i < b.length; i++) {
				if (/Режим наблюдения/.test(b[i].innerHTML)) {
					center = b[i].parentNode;
					center.appendChild(doc.createElement('br'));
					center.appendChild(doc.createElement('br'));
					center.appendChild(data_div);
					showCrits(get_critical_shots(center.parentNode.lastElementChild.getElementsByTagName('b'), 1));
					break;
				}
			}
		}
	}
//------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var data_div = doc.createElement('div');
	data_div.id = 'data_div';
	var a = doc.getElementsByTagName('a');
	var myNik;

	start();

}());
