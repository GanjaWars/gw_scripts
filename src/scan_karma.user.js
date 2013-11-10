// ==UserScript==
// @name			Scan Karma
// @namespace		using namespace std;
// @description		На странице инфо перса при изменении вашей кармы выводит сообщение.
// @include			http://www.ganjawars.ru/info.php?id=*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var st = root.localStorage;

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiеm рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'Scan Karma:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	//id перса
	myID = doc.cookie.match('(^|;) ?uid=([^;]*)(;|$)')[2];
	//если не наша страница инфы
	if (!new RegExp(myID).test(root.location.href)) return;

	var nowKarma = /Карма:\s\d+\.?\d*\s\((\d+)\/(\d+)\)/i.exec(doc.body.textContent);
	nowKarma = nowKarma[1] + '|' + nowKarma[2];

	if (!st.getItem('scanKarma_' + myID)) {
		st.setItem('scanKarma_' + myID, nowKarma);
		return;
	}

	var oldKarma = st.getItem('scanKarma_' + myID);
	if (nowKarma == oldKarma) return;
	st.setItem('scanKarma_' + myID, nowKarma);

	oldKarma = oldKarma.split('|');
	oldKarma[0] = +oldKarma[0];
	oldKarma[1] = +oldKarma[1];

	nowKarma = nowKarma.split('|');
	nowKarma[0] = +nowKarma[0];
	nowKarma[1] = +nowKarma[1];

	var str = 'Ваша карма была изменена \n\n';
	if (nowKarma[0] == oldKarma[0]) {
		str += '';
	} else if (nowKarma[0] > oldKarma[0]) {
		str += 'Отрицательная карма увеличилась на ' + (nowKarma[0] - oldKarma[0]) + ' (' + oldKarma[0] + ' ---> ' + nowKarma[0] + ')\n';
	} else {
		str += 'Отрицательная карма уменьшилась на ' + (oldKarma[0] - nowKarma[0]) + ' (' + oldKarma[0] + ' ---> ' + nowKarma[0] + ')\n';
	}

	if (nowKarma[1] == oldKarma[1]) {
		str += '';
	} else if (nowKarma[1] > oldKarma[1]) {
		str += 'Положительная карма увеличилась на ' + (nowKarma[1] - oldKarma[1]) +  ' (' + oldKarma[1] + ' ---> ' + nowKarma[1] + ')';
	} else {
		str += 'Положительная карма уменьшилась на ' + (oldKarma[1] - nowKarma[1]) +  ' (' + oldKarma[1] + ' ---> ' + nowKarma[1] + ')';
	}

	alert(str);

}());
