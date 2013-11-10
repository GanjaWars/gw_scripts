// ==UserScript==
// @name			Ads Filter
// @namespace		using namespace std;
// @description		Фильтр онлайн/оффлайн и по островам на странице поиска аренды/продажи.
// @include			http://www.ganjawars.ru/market.php?stage=2&item_id=*
// @include			http://www.ganjawars.ru/market.php?buy=*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {
//-----------------------------------------------------------------------------
	function setFilter(lines, tp, reg) {
		switch (tp) {
			case 0:	{//показать все
				for (var i = 3; i < lines.length; i++) {
					lines[i].style.display = '';
				}
				break;
			}
			case 1: {//острова
				setFilter(lines, 0);
				for (i = 3; i < lines.length; i++) {
					if (!reg.test(lines[i].getElementsByTagName('td')[3].innerHTML)) {
						lines[i].style.display = 'none';
					}
				}
				break;
			}
			case 2: {//онлайн/оффлайн
				for (i = 3; i < lines.length; i++) {
					if (lines[i].style.display == 'none') continue;
					if (lines[i].lastElementChild.firstElementChild.getAttribute('style') == 'color:#999999') {
						lines[i].style.display = 'none';
					}
				}
			}
		}
	}
//-----------------------------------------------------------------------------
	function set_Item(id, value) {
		var item = doc.createElement('span');
		item.setAttribute('style', 'cursor: pointer; color: #808080; margin-right: 3px;');
		item.id = id;
		item.innerHTML = value;
		span.appendChild(item);
	}
//-----------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var span, lines;

	var li = doc.getElementsByTagName('li');
	for (var i = 0; i < li.length; i++) {
		if (/Базовая цена/.test(li[i].innerHTML)) {
			span = doc.createElement('span');
			span.setAttribute('style', 'margin-left: 10px;');
			set_Item('isl_z', '[Z]');
			set_Item('isl_g', '[G]');
			set_Item('online', '[Online]');
			set_Item('reset1', '[Сброс]');
			li[i].insertBefore(span, li[i].firstElementChild.nextSibling);
			lines = li[i].parentNode.parentNode.parentNode.parentNode.getElementsByTagName('tr');
			break;
		}
	}

	if (!lines) return;

	doc.getElementById('reset1').addEventListener('click', function() {setFilter(lines, 0);}, false);
	doc.getElementById('isl_z').addEventListener('click', function() {setFilter(lines, 1, new RegExp('Z'));}, false);
	doc.getElementById('isl_g').addEventListener('click', function() {setFilter(lines, 1, new RegExp('G'));}, false);
	doc.getElementById('online').addEventListener('click', function() {setFilter(lines, 2);}, false);

}());
