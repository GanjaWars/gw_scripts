// ==UserScript==
// @name			Mahinator
// @namespace		using namespace std;
// @description		Анализ результативности игры в рулетку, тотализатор, покер и заработанных денег в боях на странице информации персонажа.
// @include			http://www.ganjawars.ru/info.php*
// @license			MIT
// @version			1.2
// @author			MyRequiem
// ==/UserScript==

(function() {
//--------------------------------------------------------------------------------------------------
	function setComma(x) {//расставляет запятые в числе, добавляет символ '$' или '- $' и раскрашивает результат
		var style = x < 0 ? '<span style="color: #0000FF;">-$' : '<span style="color: #FF0000;">$';
		var str = ('' + x).replace('-', '');

		var buff = [];
		for (var i = str.length - 1, j = 0; i >= 0; i--, j++) {
			if (j < 3) {
				buff.unshift(str[i]);
			} else {
				buff.unshift(',');
				buff.unshift(str[i]);
				j = 0;
			}
		}

		return style + buff.join('') + '</span>';
	}
//--------------------------------------------------------------------------------------------------
	function getRez(reg1, reg2) {
		var spent = reg1.test(target.innerHTML) ? +reg1.exec(target.innerHTML)[1].replace(/,/g, '') : 0;
		var prize = reg2.test(target.innerHTML) ? +reg2.exec(target.innerHTML)[1].replace(/,/g, '') : 0;
		var rez = prize - spent;
		if (!rez) return 0;
		total += rez;
		return setComma(rez);
	}
//--------------------------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var total = 0;

	var target;
	var a = doc.getElementsByTagName('a');
	for (var i = 0; i < a.length; i++) {
		if (a[i].innerHTML == 'Достижения игрока') {
			target = a[i].parentNode.nextElementSibling;
			break;
		}
	}

	var roul = getRez(/Потрачено в казино: <b>\$([^<]*)/i, /Выигрыш в казино: <b>\$([^<]*)/i);
	var tot = getRez(/Потрачено в тотализаторе: <b>\$([^<]*)/i, /Выигрыш в тотализаторе: <b>\$([^<]*)/i);
	var poker = getRez(/Потрачено на покер: <b>\$([^<]*)/i, /Получено с покера: <b>\$([^<]*)/i);
	var fight;
	if (/Выигрыш в боях/i.test(target.innerHTML)) {
		fight = 1;
		total += +/Выигрыш в боях: <b>\$([^<]*)/i.exec(target.innerHTML)[1].replace(/,/g, '');
	}

	if (!roul && !tot && !poker && !fight) return;

	var str = '<hr><table>';
	if (roul) str += '<tr><td style="color: #008000;">Рулетка:</td><td>' + roul + '</td>';
	if (tot) str += '<tr><td style="color: #008000;">Тотализатор:</td><td>' + tot + '</td>';
	if (poker) str += '<tr><td style="color: #008000;">Покер:</td><td>' + poker + '</td>';
	str += '<tr><td style="font-weight: bold;">Всего:</td><td>' + setComma(total) + '</td>';
	if (fight) str += '<tr><td colspan="2" style="font-size: 10px;">(с учетом выигрыша в боях)</td>';
	str += '</table>';

	var div = doc.createElement('div');
	div.innerHTML = str;
	target.appendChild(div);

}());
