// ==UserScript==
// @name			Fuck The Farm
// @namespace		using namespace std;
// @description		Убирает ссылку на ферму на главной странице и на странице инфы.
// @include			http://www.ganjawars.ru/me/*
// @include			http://www.ganjawars.ru/info.php?*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;

	var i, node;
	var a = root.document.getElementsByTagName('a');
	if (/www\.ganjawars\.ru\/me\//.test(root.location.href)) {
		for(i = 0; i < a.length; i++) {
			if (a[i].innerHTML == 'Ваша ферма') {
				node = a[i].previousElementSibling.previousSibling;
				while (!(node.nextSibling.href && /shop\.php/.test(node.nextSibling.href))) {
					node.parentNode.removeChild(node.nextSibling);
				}
				return;
			}
		}
	}

	for (i = 0; i < a.length; i++) {
		if (a[i].innerHTML == 'Ферма игрока') {
			node = a[i].previousElementSibling.previousSibling;
			while (node.nextSibling) {
				node.parentNode.removeChild(node.nextSibling);
			}
			break;
		}
	}

}());
