// ==UserScript==
// @name			Filter Resources On Stat
// @namespace		using namespace std;
// @description		Фильтр ресурсов на странице статистики.
// @include			http://www.ganjawars.ru/stats.php
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {

	//список ресурсов, которые будут отображаться (ЧЕРЕЗ ЗАПЯТУЮ, БЕЗ ПРОБЕЛА ПОСЛЕ ЗАПЯТОЙ)
	var res = 'Уран,Водоросли,Маковая соломка,Трава,Батареи,Пластик,Сталь,Бокситы,Ганджиум,Нефть,Резина';

	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;

	var trs;
	var tbls = doc.getElementsByTagName('table');
	for (var i = 0; i < tbls.length; i++) {
		if (tbls[i].getAttribute('border') == '0' && tbls[i].getAttribute('class') == 'wb') {
			trs = tbls[i].getElementsByTagName('tr');
			break;
		}
	}

	var flag;
	res = res.split(',');
	for (i = 1; i < trs.length; i++) {
		flag = false;
		for (var j = 0; j < res.length; j++) {
			if (~trs[i].firstElementChild.innerHTML.indexOf(res[j])) {
				flag = true;
				break;
			}
		}
		if (!flag) trs[i].style.display = 'none';
	}

}());
