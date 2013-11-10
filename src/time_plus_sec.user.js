// ==UserScript==
// @name			Time Plus Sec
// @namespace		using namespace std;
// @description		Добавляет секунды к времени, указанному в игре. Время берется системное (включая бои и в походах на ауте).
// @include			http://*.ganjawars.ru*
// @exclude			http://www.ganjawars.ru/tmp/*
// @exclude			http://www.ganjawars.ru/index.php
// @exclude			http://www.ganjawars.ru/login.php
// @license			MIT
// @version			1.1
// @author			MyRequiem
// ==/UserScript==

(function() {

	//НАСТРОЙКИ
	var correct_time = 0;	//поправка на время (как в положительную, так и в отрицательную сторону в часах)
	//КОНЕЦ НАСТРОЕК

//----------------------------------------------------------------------------------------------------------------------
	function setTime(reg, node) {
		var date = new Date();
		var h = date.getHours() + correct_time;
		h = h < 10 ? '0' + h : h;
		var min = date.getMinutes();
		min = min < 10 ? '0' + min : min;
		var sec = date.getSeconds();
		sec = sec < 10 ? '0' + sec : sec;
		if (aut) {	//для совместимости со скриптом Outlander [GW]
			node.firstElementChild.lastChild.nodeValue = ' ' + h + ':' + min + ':' + sec;
		} else {
			node.innerHTML = node.innerHTML.replace(reg, h + ':' + min + ':' + sec);
		}
		root.setTimeout(function() {setTime(/\d+:\d+:\d+/, node);}, 1000);
	}
	//----------------------------------------------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var loc = root.location.href;
	var td = root.document.getElementsByTagName('td');
	var aut = /quest\.ganjawars\.ru/.test(loc);
	var reg;

	if (/www\.ganjawars\.ru\/b0/.test(loc)) {
		reg = /^&nbsp;Время: \d+:\d+/;
	} else if (aut) {
		reg = /\d+:\d+/;
	} else {
		reg = /игроков онлайн&nbsp;&nbsp;&nbsp;$/;
	}

	for (var i = 0; i < td.length; i++) {
		if (reg.test(td[i].innerHTML)) {
			setTime(/\d+:\d+/, td[i]);
			break;
		}
	}

}());

