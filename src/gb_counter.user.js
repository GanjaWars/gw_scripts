// ==UserScript==
// @name			GB Counter
// @namespace		using namespace std;
// @description		Показывает измененние количества Гб на главной странице.
// @include			http://www.ganjawars.ru/me/*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==


(function() {
//------------------------------------------------------------------------------
	function setPoints(num, separator, flag_sign) {
		var x = +num;
		if (isNaN(x)) return 'NaN';
		var sign = (x > 0 && flag_sign) ? '+' : '';
		x = (x + '').split('').reverse();
		for (var i = 2; i < x.length; i += 3) {
			if (x[i] == '-' || !x[i + 1] || x[i + 1] == '-') break;
			x[i] = separator + x[i];
		}

		return sign + x.reverse().join('');
	}
//------------------------------------------------------------------------------
	function reset() {
		st.setItem('gb_counter', now);
		spanCount.innerHTML = '[0]';
	}
//------------------------------------------------------------------------------
	function _$(id) {return doc.getElementById(id);}
//------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var st = root.localStorage;

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiеm рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'GB Counter:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	var now = _$('cdiv').innerHTML.replace(/,/g, '');

	var spanCount = doc.createElement('span');
	spanCount.setAttribute('style', 'margin-left: 5px; color: #FF0000; font-weight: normal; font-size: 9px; cursor: pointer;');
	_$('cdiv').appendChild(spanCount);

	spanCount.addEventListener('click', function() {
		if (!confirm('Сбросить счетчик?')) return;
		reset();
	}, false);

	var old = st.getItem('gb_counter');
	if (!old) {
		reset();
		return;
	}

	var diff = +now - (+old);
	spanCount.innerHTML = '[' + setPoints(diff, '.', true) + ']';

}());
