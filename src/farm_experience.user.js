// ==UserScript==
// @name			Farm Experience
// @namespace		using namespace std;
// @description		На ферме показывает производственный опыт и прибыль в гб за один час для каждого растения.
// @include			http://www.ganjawars.ru/ferma.php*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {
//--------------------------------------------------------------------------------------------------
	function getData(p1, p2, time, exp) {
		var  money = ((p2 - p1) / time * 60).toFixed(2);
		var experience = (exp / time * 60).toFixed(3);
		return ' <span style="color: #FF0000;">[$' + money + ']</span><span style="color: #0000FF;">[' +
			experience + ']</span>';
	}
//--------------------------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;

	//если мы в постройках или нет пустой грядки
	if (/section=items/.test(root.location.href) || !/Грядка пустая/.test(doc.body.innerHTML)) return;

	var elem = [];
	var price1 = [];
	var price2 = [];
	var time = [];
	var exp = [];

	var font = doc.getElementsByTagName('font');
	for (var i = 0; i < font.length; i++) {
		if (font[i].getAttribute('color') == '#006600' && font[i].firstElementChild &&
			/\$(\d+)/.test(font[i].lastElementChild.innerHTML)) {
			price1[price1.length] = +/\$(\d+)/.exec(font[i].lastElementChild.innerHTML)[1];
			elem[elem.length] = font[i];
			continue;
		}
		if (font[i].getAttribute('color') == '#990000' && font[i].firstElementChild &&
			/\$(\d+)/.test(font[i].firstElementChild.innerHTML)) {
			price2[price2.length] = +/\$(\d+)/.exec(font[i].firstElementChild.innerHTML)[1];
			exp[exp.length] = parseFloat(/(\d+\.?\d*)/.exec(font[i].nextSibling.textContent));
		}
	}

	var li = doc.getElementsByTagName('li');
	for (i = 0; i < li.length; i++) {
		if (/созревания:\s\d+/.test(li[i].innerHTML)) {
			time[time.length] = +/\d+/.exec(li[i].innerHTML)[0];
		}
	}

	for (i = 0; i < elem.length; i++) {
		var span = doc.createElement('span');
		span.setAttribute('style', 'font-size: 9px;');
		span.innerHTML = getData(price1[i], price2[i], time[i], exp[i]);
		elem[i].appendChild(span);
	}

}());
