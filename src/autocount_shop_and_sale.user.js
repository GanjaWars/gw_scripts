// ==UserScript==
// @name			AvtoCount Shop And Sale
// @namespace		using namespace std;
// @description		На странице объекта автоматически подставляет максимальное количество ресурсов для продажи или покупки в поля ввода.
// @include			http://www.ganjawars.ru/object*
// @license			MIT
// @version			1.1
// @author			MyRequiem
// ==/UserScript==

(function() {
//--------------------------------------------------------------------------------------------------
	function getTable(str) {
		for (var i = 0; i < b.length; i++) {
			if (new RegExp(str, 'i').test(b[i].innerHTML)) return b[i].parentNode.parentNode.parentNode.parentNode;
		}
		return false;
	}
//--------------------------------------------------------------------------------------------------
	function setColor(obj, color) {
		obj.setAttribute('bgcolor', color);
	}
//--------------------------------------------------------------------------------------------------
	function setFactory() {
		var table, target;

		if (table = getTable('производимые ресурсы')) {
			target = table.firstElementChild.firstElementChild.lastElementChild;
			target.setAttribute('style', 'border:solid 1px #000000;');
			var maxBuy = +target.firstElementChild.firstElementChild.innerHTML.split(' ')[0];
			//раскрашиваем ячейку
			if (maxBuy) {
				setColor(target, '#92F8BE');
			} else {
				setColor(target, '#F98383');
			}

			var forms = table.getElementsByTagName('form');
			if (forms.length) {
				forms[0].lastElementChild.firstElementChild.value = maxBuy;
			}
		}

		if (table = getTable('используемые ресурсы')) {
			var tr = table.getElementsByTagName('tr');
			var canBuy, myRes;
			for (var i = 1; i < tr.length; i++) {
				//если ссылка на ресурс есть, значит наша tr'ка
				if (tr[i].firstElementChild.firstElementChild) {

					var td = tr[i].getElementsByTagName('td');
					myRes = +td[6].innerHTML;
					if (!myRes) continue;	//если нет с собой ресурсов

					canBuy = +/\d+/.exec(td[3].innerHTML)[0];

					//раскрашиваем ячейку
					if (canBuy) {
						setColor(td[3], '#92F8BE');
					} else {
						setColor(td[3], '#F98383');
					}

					//если есть форма, подставляем в текстовое поле количество ресурсов для продажи
					if (td[5].firstElementChild) {
						td[5].firstElementChild.lastElementChild.firstElementChild.value = myRes > canBuy ? canBuy : myRes;
					}
				}
			}

		}
	}
//--------------------------------------------------------------------------------------------------
	function setCoffeeShop() {
		for (var i = 0; i < b.length; i++) {
			//найдем количество Гб, имеющихся на объекте
			if (/\$(\d+)(,?)(\d+)?/.test(b[i].innerHTML) && b[i].parentNode.nodeName == 'TD' && !b[i].firstElementChild) {
				var mon = /\$([^<]+)/.exec(b[i].innerHTML);
				var money = mon[1].replace(/,/g, '');
				continue;
			}

			if (/используемые ресурсы/i.test(b[i].innerHTML)) {
				var tr = b[i].nextElementSibling.getElementsByTagName('tr');
				break;
			}
		}

		for (i = 1; i < tr.length; i++) {
			var td = tr[i].getElementsByTagName('td');

			var myRes = +td[5].innerHTML;
			if (!myRes) continue;

			if (/(\d+)\/(\d+)/.test(td[2].innerHTML)) {
				var canBuy = /(\d+)\/(\d+)/.exec(td[2].innerHTML);
				canBuy = (+canBuy[2]) - (+canBuy[1]);
			} else {
				setColor(td[2], '#F98383');
				continue;
			}

			var price = +td[3].innerHTML;
			if (isNaN(price) || price == 0) continue;

			var maxBuy = ~~(money / price);	//отбрасываем дробную часть
			canBuy = canBuy < maxBuy ? canBuy : maxBuy;

			if (canBuy) {
				//выведем реальное количество ресурсов, которое может купить объект
				td[2].innerHTML += ' <span style="color: #0000FF; font-weight: bold;">[' + canBuy + ']</span>';
				setColor(td[2], '#92F8BE');
				if ((f = td[4].firstElementChild) && f.lastElementChild.nodeName == 'NOBR') {
					f.lastElementChild.firstElementChild.value = myRes > canBuy ? canBuy : myRes;
				}
			} else {
				td[2].setAttribute('bgcolor', '#F98383');
			}
		}
	}
//--------------------------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;

	if (/\/object\-transfers\.php/.test(root.location.href)) {
		var td = doc.getElementsByTagName('td');
		for (var i = 0; i < td.length; i++) {
			if (/Недостаточно ресурсов|Вы не можете столько купить|У Вас нет такого количества|Объект не может купить такое/.test(td[i].innerHTML) && td[i].getAttribute('class') == 'greenbg') {
				td[i].removeAttribute('class');
				var tbl = td[i].parentNode.parentNode.parentNode;
				tbl.getElementsByTagName('td')[1].removeAttribute('class');
				tbl.setAttribute('style', 'background: #F4BEC6;');
				break;
			}
		}
		return;
	}

	var b = doc.getElementsByTagName('b');
	/objects-bar/.test(root.location.href) ? setCoffeeShop() : setFactory();

}());
