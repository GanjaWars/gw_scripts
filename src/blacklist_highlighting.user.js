// ==UserScript==
// @name			Blacklist Highlighting
// @namespace		using namespace std;
// @description		Подсвечивает ники персонажей, которые занесены в черный список. Делает неактивной ссылку принятия боя в одиночках.
// @include			http://www.ganjawars.ru/*
// @exclude			http://www.ganjawars.ru/index.php
// @exclude			http://www.ganjawars.ru/login.php
// @exclude			http://www.ganjawars.ru/tmp/*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function(){
//--------------------------------------------------------------------------------------------------
	function rememberClick() {
		var trs = BlTable.getElementsByTagName('tr');
		if (trs.length < 3) {
			if (st.getItem('blacklist_' + myID)) st.removeItem('blacklist_' + myID);
			alert('Ваш ЧС пуст. Сначала нужно добавить персонажей.');
			return;
		}

		var mass = [];
		for (i = 2; i < trs.length; i++) {
			mass[mass.length] = /id=(\d+)/.exec(trs[i].getElementsByTagName('a')[0])[1];
		}

		st.setItem('blacklist_' + myID, mass.join('|'));
		alert('Ваш "Черный список" сохранен и\nссылки на данные персонажи\nбудут подсвечиваться.');
		root.location.reload();
	}
//--------------------------------------------------------------------------------------------------
	function clearClick() {
		if (st.getItem('blacklist_' + myID)) {
			st.removeItem('blacklist_' + myID);
			alert('"Черный список" удален из памяти скрипта, и\n и ссылки на данные персонажи подсвечиваться не будут');
			root.location.reload();
		} else {
			alert('В памяти скрипта нет ЧС');
		}
	}
//--------------------------------------------------------------------------------------------------
	function setHighlighting() {
		var a = doc.getElementsByTagName('a');
		for (i = 0; i < a.length; i++) {
			var id = /\/info\.php\?id=(\d+)$/.exec(a[i].href);
			if (!id) continue;
			id = id[1];
			for (var j = 0; j < IDs.length; j++) {
				if (id == IDs[j]) {
					a[i].style.background = '#B6B5B5';
					//если на странице одиночных боев вызвал перс из черного списка, то делаем неактивной ссылку "Принять"
					if (a[i].parentNode && /Подтверждаете бой с/.test(a[i].parentNode.innerHTML)) {
						var link = a[i].parentNode.parentNode.parentNode.nextElementSibling.getElementsByTagName('a')[0];
						link.setAttribute('style', 'text-decoration: line-through; color: #808080;');
						link.href = '#';
					}
				}
			}
		}
	}
//--------------------------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var st = root.localStorage;

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiеm рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'Blacklist Highlighting:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	var myID = doc.cookie.match('(^|;) ?uid=([^;]*)(;|$)')[2];

	if (/home\.friends\.php/.test(root.location.href)) {
		var BlTable, target;
		var b = doc.getElementsByTagName('b');
		for (var i = 0; i < b.length; i++) {
			if (b[i].innerHTML == 'Черный список') {
				target = b[i].parentNode;
				BlTable = target.parentNode.parentNode.parentNode;
				break;
			}
		}

		var butRemember = doc.createElement('input');
		butRemember.type = 'button';
		butRemember.value = 'Запомнить ЧС';
		butRemember.setAttribute('style', 'margin-left:5px; border: solid 1px; background: #90D0B1;');
		butRemember.addEventListener('click', rememberClick, false);

		var butClear = doc.createElement('input');
		butClear.title = 'Забыть';
		butClear.type = 'button';
		butClear.value = 'X';
		butClear.setAttribute('style', 'margin-left:5px; border: solid 1px; background: #90D0B1;');
		butClear.addEventListener('click', clearClick, false);

		target.appendChild(butRemember);
		target.appendChild(butClear);
	}

	var IDs = st.getItem('blacklist_' + myID);
	if (!IDs) return;

	IDs = IDs.split('|');

	if (/www\.ganjawars\.ru\/b0\//.test(root.location.href)) {
		root.setInterval(setHighlighting, 1000);
	} else if (/\/usertransfers\.php/.test(root.location.href)) {
		root.setTimeout(setHighlighting, 300);
	} else {
		setHighlighting();
	}

}());


