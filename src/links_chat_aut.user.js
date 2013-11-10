// ==UserScript==
// @name			Links Chat Aut
// @namespace		using namespace std;
// @description		На ауте в чате делает все ники ссылками на персонажей.
// @include			http://quest.ganjawars.ru*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==


(function() {
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;

	var fonts;
	var tds = root.document.getElementsByTagName('td');
	for (var i = 0; i < tds.length; i++) {
		if (tds[i].getAttribute('class') == 'wb' && tds[i].getAttribute('style') == 'font-size:8pt') {
			fonts = tds[i].getElementsByTagName('font');
			break;
		}
	}

	if (!fonts || !fonts.length) return;

	var name;
	for (i = 0; i < fonts.length; i++) {
		if (!fonts[i].firstElementChild) {
			name = fonts[i].innerHTML;
			fonts[i].innerHTML = '<a target="_blank" style="font-size: 8pt; text-decoration: none; color: #990000;"' +
				'href="http://www.ganjawars.ru/search.php?key=' + name + '">' + name + '</a>';
		}
	}

}());
