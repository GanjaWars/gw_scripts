// ==UserScript==
// @name			Aut Refresh
// @namespace		using namespace std;
// @description		На ауте добавляет кнопку "Обновить" под чатом.
// @include			http://quest.ganjawars.ru*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;

	var refresh, target;
	var a = doc.getElementsByTagName('a');
	for (var i = 0; i < a.length; i++) {
		if (/walk\.ep\.php\?itemslist=\d+/.test(a[i].href) && /<b>\d+<\/b>/.test(a[i].innerHTML)) {
			target = a[i];
		}
		if (/walk\.ep\.php\?\d+/.test(a[i].href) && /<b>Обновить<\/b>/.test(a[i].innerHTML)) {
			refresh = a[i].href;
		}
	}

	var link = doc.createElement('a');
	link.href = refresh;
	link.setAttribute('style', 'font-weight: bold; margin-left: 5px;');
	link.innerHTML = 'Обновить';
	target.parentNode.insertBefore(link, target.nextElementSibling);

}());
