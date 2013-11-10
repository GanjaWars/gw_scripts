// ==UserScript==
// @name			Skill Counters
// @namespace		using namespace std;
// @description		Счетчики опыта и умелок на главной странице перса.
// @include			http://www.ganjawars.ru/me/*
// @license			MIT
// @version			1.2
// @author			MyRequiem
// ==/UserScript==

(function() {
//--------------------------------------------------------------------------------------------------
	function getDigit(obj, fix) {
		fix = fix || 0;
		return parseFloat(/\((\d+.?\d*)\)/.exec(obj.innerHTML)[1]).toFixed(fix);
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
			'Skill Counters:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	//найдем ID перса (для каждого мульта своя запись в storage)
	var ID = doc.cookie.match('(^|;) ?uid=([^;]*)(;|$)')[2];

	//таблицы умелок
	var table = doc.getElementsByTagName('table');
	for (i = 0; i < table.length; i++) {
		if ((temp = table[i].getAttribute('width')) && temp == '330') {
			var tr = table[i].getElementsByTagName('tr');
			var battle = tr[0].firstElementChild.nextElementSibling;
			var econom = tr[1].firstElementChild.nextElementSibling;
			var production = tr[2].firstElementChild.nextElementSibling;
			tr = table[i].parentNode.nextElementSibling.getElementsByTagName('tr');
			var guns = tr[0];
			var grenades = tr[1];
			var auto = tr[2];
			var pul = tr[3];
			var drob = tr[4];
			var snip = tr[5];
			break;
		}
	}

	//находим значения умелок
	var bt = getDigit(battle);		//боевой
	var e = getDigit(econom);		//эконом
	var pr = getDigit(production);	//производ
	var gn = getDigit(guns, 2);		//пп
	var gr = getDigit(grenades, 2);	//грены
	var a = getDigit(auto, 2);		//авто
	var pl = getDigit(pul, 2);		//пуль
	var d = getDigit(drob, 2);		//дроб
	var s = getDigit(snip, 2);		//снип

	//синдовый уровень
	var syndExp, Nobr;
	var b = doc.getElementsByTagName('b');
	for (i = 0; i < b.length; i++) {
		if (b[i].innerHTML == 'Основной синдикат:' && b[i].parentNode.nodeName == 'SPAN') {
			syndExp = getDigit(b[i].nextElementSibling.nextElementSibling);
			Nobr = doc.createElement('nobr');
			b[i].parentNode.appendChild(Nobr);
			break;
		}
	}

	//время
	var time = '';
	var date = new Date();
	var day = date.getDate();
	time  += day < 10 ? '0' + day : day;
	time += '.';
	var month = date.getMonth() + 1;
	time += month < 10 ? '0' + month : month;
	time += '.';
	var year = /20(\d+)/.exec(date.getFullYear() + '')[1];
	time += year + ' ';
	var hours = date.getHours();
	time += hours < 10 ? '0' + hours : hours;
	time += ':';
	var min = date.getMinutes();
	time += min < 10 ? '0' + min : min;

	//строка для storage
	var str = time + '|' + bt + '|' + e + '|' + pr + '|' + gn + '|' + gr + '|' + a + '|' + pl + '|' + d + '|' + s;
	if (syndExp) str += '|' + syndExp;

	if (!st.getItem('countSkills_' + ID)) st.setItem('countSkills_' + ID, str);
	var counts = st.getItem('countSkills_' + ID).split('|');

	//устанавливаем кнопку сброса счетчиков и время сброса
	tr = doc.createElement('tr');
	tr.appendChild(doc.createElement('td'));
	var td = doc.createElement('td');
	td.setAttribute('colspan', '2');
	td.setAttribute('style', 'font-weight: bold; font-size: 9px;');
	td.innerHTML = '<span style="cursor: pointer; color: #008000; text-decoration: underline;">' +
		'Сбросить счетчики</span><br><span style="cursor: default; color: #0000FF;">(' + counts[0] + ')</span>';
	tr.appendChild(td);
	guns.parentNode.appendChild(tr);

	td.firstElementChild.addEventListener('click', function() {
		st.removeItem('countSkills_' + ID);
		root.location.reload();
	}, false);

	//устанавливаем счетчики
	var s1 = '<span style="color: #FF0000; font-size: 9px;"> [';
	var s2 = ']</span>';

	battle.parentNode.lastElementChild.innerHTML = s1 + ((bt - parseFloat(counts[1])).toFixed(0)) + s2;
	econom.parentNode.lastElementChild.innerHTML = s1 + ((e - parseFloat(counts[2])).toFixed(0)) + s2;
	production.parentNode.lastElementChild.innerHTML = s1 + ((pr - parseFloat(counts[3])).toFixed(0)) + s2;
	guns.lastElementChild.innerHTML = s1 + ((gn - parseFloat(counts[4])).toFixed(2)) + s2;
	grenades.lastElementChild.innerHTML = s1 + ((gr - parseFloat(counts[5])).toFixed(2)) + s2;
	auto.lastElementChild.innerHTML = s1 + ((a - parseFloat(counts[6])).toFixed(2)) + s2;
	pul.lastElementChild.innerHTML = s1 + ((pl - parseFloat(counts[7])).toFixed(2)) + s2;
	drob.lastElementChild.innerHTML = s1 + ((d - parseFloat(counts[8])).toFixed(2)) + s2;
	snip.lastElementChild.innerHTML = s1 + ((s - parseFloat(counts[9])).toFixed(2)) + s2;

	//если есть синдовый уровень у перса
	if (counts.length > 10) Nobr.innerHTML = s1 + ((syndExp - parseFloat(counts[10])).toFixed(0)) + s2;

}());
