// ==UserScript==
// @name			Comfortable Links For Farm
// @namespace		using namespace std;
// @description		Удобные ссылки для полива, сбора, копания, посадки на ферме.
// @include			http://www.ganjawars.ru/ferma.php*
// @license			MIT
// @version			1.01
// @author			MyRequiem
// ==/UserScript==

(function() {
//------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------
	function setLink(a, txt) {
		var link = a.cloneNode(true);

		if (!txt) {
			a.setAttribute('style', 'display: none;');
		} else {
			link.innerHTML = txt;
		}

		link.setAttribute('style', 'margin-left: 10px;');
		target.appendChild(link);
	}
//------------------------------------------------------------------------------
	function getElems(name) {return doc.getElementsByTagName(name);}
//------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;

	var target; //куда будем вставлять ссылки (рядом с "Ваша ферма")
	var fonts = getElems('font');
	for (var i = 0; i < fonts.length; i++) {
		if (/Ваша ферма/.test(fonts[i].innerHTML)) {
			target = fonts[i].parentNode;
			break;
		}
	}

	var a1, a2, pos;
	var a = getElems('a');
	for (i = 0; i < a.length; i++) {
		if (/Полить|Собрать|Вскопать/.test(a[i].innerHTML)) {
			a1 = a[i];
		} else if (/полить|собрать/.test(a[i].innerHTML) && /\(уже пора\)/.test(a[i].parentNode.innerHTML)) {
			a2 = a[i];
		} else if (/images\.ganjawars\.ru\/i\/point2\.gif/.test(a[i].innerHTML)) {
			pos = getPos(a[i]);
		}
	}

	if (a1) {
		setLink(a1);
	} else if (a2) {
		setLink(a2, 'Next cell');
	}

	var but;
	var inp = getElems('input');
	for (i = 0; i < inp.length; i++) {
		if (inp[i].getAttribute('value') == 'Посадить') {
			but = inp[i].cloneNode(true);
			break;
		}
	}

	if (!but || !pos) return;

	but.setAttribute('style', 'position: absolute; top: ' + (pos.y - 10) + 'px; left: ' + (pos.x - 15) + 'px;');
	but.addEventListener('click', function() {
		var form = getElems('form');
		for (var i = 0; i < form.length; i++) {
			if (/\/ferma\.php$/.test(form[i].getAttribute('action'))) {
				form[i].submit();
				break;
			}
		}
	}, false);

	doc.body.appendChild(but);
    but.focus();

}());
