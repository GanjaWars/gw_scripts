// ==UserScript==
// @name			Farm Timer
// @namespace		using namespace std;
// @description		Выводит таймер для фермы рядом с "Об игре | Форум". Звуковое оповещение когда пора полить/собрать.
// @include			http://www.ganjawars.ru*
// @exclude			http://www.ganjawars.ru/b0*
// @exclude			http://www.ganjawars.ru/login.php
// @exclude			http://www.ganjawars.ru/index.php
// @exclude			http://www.ganjawars.ru/tmp/*
// @license			MIT
// @version			1.0
// @author			MyRequiem (идея TokimeKatoji)
// ==/UserScript==

(function() {

	var farm_sound = 8;		//Звук когда пора поливать/собирать (0 - без звука)
	var interval = 120;		//Повторять звук не чаще чем один раз в X секунд (0 - без повторения)

//------------------------------------------------------------------------------
	function playSound(sound) {
		var fl = doc.getElementById('farm_flashcontent');
		if (!fl) {
			fl = doc.createElement('div');
			fl.id = 'farm_flashcontent';
			doc.body.appendChild(fl);
		}

		fl.innerHTML = '<embed ' +
			'flashvars="soundPath=http://www.ganjawars.ru/sounds/'+ sound + '.mp3" ' +
			'allowscriptaccess="always" ' +
			'quality="high" height="1" width="1" ' +
			'src="http://images.ganjawars.ru/i/play.swf" ' +
			'type="application/x-shockwave-flash" ' +
			'pluginspage="http://www.macromedia.com/go/getflashplayer" />';
	}
//------------------------------------------------------------------------------
	function getRandom(a, b) {return Math.round((b - a) * Math.random());}
//------------------------------------------------------------------------------
	function showTimer(sec) {
		var s = sec;
		var h = Math.floor(s / 3600);
		s = s - h * 3600;
		var min = Math.floor(s / 60);
		s = s - min * 60;

		h = h < 10 ? '0' + h : h;
		min = min < 10 ? '0' + min : min;
		s = s < 10 ? '0' + s : s;
		link.innerHTML = '[' + h + ':' + min + ':' + s + ']';
		sec--;
		if (sec > -1) {
			root.setTimeout(function() {showTimer(sec)}, 1000);
		} else {
			root.setTimeout(setReminder, getRandom(1000, 3000));
		}
	}
//------------------------------------------------------------------------------
	function setReminder() {
		var storage = st.getItem('farm_timer').split('|');
		if (!storage) {
			link.innerHTML = '';
			return;
		}

		setRedLink(storage[1]);
		check_interval = root.setInterval(checkState, 2000);

		if (!farm_sound) return;
		storage[2] = +storage[2];
		var intrvl = interval * 1000;
		var now = new Date().getTime();

		if (now < storage[0]) return;

		if (now - storage[2] >= intrvl) {
			if (!interval) {	//если звук уже был проигран один раз
				if (st.getItem('farm_timer_one')) {
					return;
				} else {
					st.setItem('farm_timer_one', '1');
				}
			}
			storage[2] = now;
			st.setItem('farm_timer', storage.join('|'));
			if (intrvl) root.setTimeout(setReminder, intrvl + getRandom(1000, 10000));
			playSound(farm_sound);
		} else if (interval) {
			root.setTimeout(setReminder, intrvl - (now - storage[2]) + getRandom(1000, 10000));
		}
	}
//------------------------------------------------------------------------------
	function getAction(str) {return /собрать/.test(str) ? 'Собрать' : 'Полить';}
//------------------------------------------------------------------------------
	function checkState() {
		if (!/bold/.test(link.getAttribute('style'))) {
			if (check_interval) root.clearInterval(check_interval);
			return;
		}

		var n = new Date().getTime();
		var t = st.getItem('farm_timer');
		if (!t) {
			link.innerHTML = '';
			return;
		}

		t = t.split('|')[0];
		if (n >  t) return;
		link.setAttribute('style', 'color: #0000FF; text-decoration: none;');
		st.removeItem('farm_timer_one');
		showTimer(((t - n) / 1000).toFixed(0));
	}
//------------------------------------------------------------------------------
	function setRedLink(str) {
		if (!/bold/.test(link.getAttribute('style'))) {
			link.setAttribute('style', 'color: #FF0000; font-weight: bold; text-decoration: none;');
		}

		if (!new RegExp(str).test(link.innerHTML)) link.innerHTML = '[' + str + ']';
	}
//------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var st = root.localStorage;
	var myID = doc.cookie.match('(^|;) ?uid=([^;]*)(;|$)')[2];
	var loc = root.location.href;
	var check_interval;
	var time_now = new Date().getTime();

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiеm рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'Farm Timer:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	// localStorage: [0] - время полива/сбора, [1] - действие, [2] - время последнего проигрывания звука
	//на ферме запоминаем данные, выходим
	if (/www\.ganjawars\.ru\/ferma\.php/.test(loc)) {
		//не на своей ферме
		if (/id=\d+/.test(loc) && /id=(\d+)/.exec(loc)[1] != myID) return;

		var time_farm = /Ближайшее действие:.*[собрать|полить].*\(.*\)/.exec(doc.body.innerHTML);
		if (!time_farm) {
			st.removeItem('farm_timer');
			return;
		}

		var action = getAction(time_farm[0]);
		if (/уже пора/.test(time_farm[0])) {
			st.setItem('farm_timer', time_now + '|' + action + '|' + time_now);
			return;
		}

		time_farm = +/через (\d+) мин/.exec(time_farm[0])[1];
		time_farm = time_now + time_farm * 60 * 1000;
		st.setItem('farm_timer', time_farm + '|' + action + '|' + time_now);
		return;
	}

	//не на ферме
	var target = doc.getElementById('hpheader');
	if (!target) return;

	var data = st.getItem('farm_timer');
	if (!data) return;
	data = data.split('|');

	//ссылка
	var link = doc.createElement('a');
	link.setAttribute('style', 'color: #0000FF; text-decoration: none;');
	link.href = 'http://www.ganjawars.ru/ferma.php?id=' + myID;
	link.setAttribute('target', '_blank');
	target.parentNode.appendChild(doc.createTextNode(' | '));
	target.parentNode.appendChild(link);

	if (time_now >= data[0]) {
		setRedLink(data[1]);
		root.setTimeout(setReminder, getRandom(1000, 3000));
		return;
	}

	st.removeItem('farm_timer_one');
	showTimer(((data[0] - time_now) / 1000).toFixed(0));

}());
