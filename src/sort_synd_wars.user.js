// ==UserScript==
// @name			SortSyndWars
// @namespace		using namespace std;
// @description		Сортировка на странице нападений по острову и типу недвиги. Вывод общего количества боев и боев по синдикатам.
// @include			http://www.ganjawars.ru/wargroup.php?war=attacks*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function () {
//----------------------------------------------------------------------------------------------------------------------
	function showSyndData(obj) {
		var str = '<table>';
		for (var i = 0; i < obj.length; i++) {
			str += '<tr><td style="text-align: right;"><a target="_blank" ' +
				'href="http://www.ganjawars.ru/syndicate.php?id=' + obj[i].synd + '&page=online">' +
				'<img src=http://images.ganjawars.ru/img/synds/' + obj[i].synd + '.gif></img>#' + obj[i].synd + '</a>';
			if (obj[i].union) str += ', <a target="_blank" href="http://www.ganjawars.ru/syndicate.php?id=' +
				obj[i].union + '&page=online"><img src=http://images.ganjawars.ru/img/synds/' + obj[i].union +
				'.gif></img>#' + obj[i].union + '</a>';
			str += '</td><td style="color: #0000FF; padding-left: 10px;">' + obj[i].count + '</td></tr>';
		}
		str += '</table>';
		span_count.innerHTML = str;
	}
//----------------------------------------------------------------------------------------------------------------------
	function findObj(obj, mass) {
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].synd == mass[0] || obj[i].union == mass[0]) {
				obj[i].count++;
				return true;
			}
		}
		return false;
	}
//----------------------------------------------------------------------------------------------------------------------
	function showAllLines() {
		for (var i = 1; i < table_lines.length; i++) table_lines[i].style.display = '';
	}
//----------------------------------------------------------------------------------------------------------------------
	function setSortData() {
		st.setItem('sort_synd_wars', sel_1.value + '|' + sel_2.value);
		showAllLines();
		sort_synd_wars();
	}
//----------------------------------------------------------------------------------------------------------------------
	function sort_synd_wars() {
		var data = st.getItem('sort_synd_wars').split('|');
		var x = +data[0];
		var y = +data[1];
		sel_1.childNodes[x].selected = true;
		sel_2.childNodes[y].selected = true;

		var reg1, reg2;
		switch (x) {
			case 0: reg1 = /./; break;
			case 1: reg1 = /Остров Z/; break;
			case 2: reg1 = /Остров G/; break;
			case 3: reg1 = /Остров S/;
		}
		switch (y) {
			case 0: reg2 = /./; break;
			case 1: reg2 = /Электростанция/; break;
			case 2: reg2 = /Урановый рудник/;
		}

		var objs = [];
		var count = 0;	//общее количество заявок
		for (var i = 1; i < table_lines.length; i++) {
			var target = table_lines[i].firstElementChild.nextElementSibling.nextElementSibling;
			var txt = target.innerHTML;
			if (!reg2) {
				if (!reg1.test(txt) || /Электростанция/.test(txt) || /Урановый рудник/.test(txt)) {
					table_lines[i].style.display = 'none';
					continue;
				}
			} else {
				if (!reg1.test(txt) || !reg2.test(txt)) {
					table_lines[i].style.display = 'none';
					continue;
				}
			}
			count++;

			var a = target.nextElementSibling.nextElementSibling.getElementsByTagName('a');
			var r = []; var b = [];
			for (var j = 0; j < a.length; j++) {
				var clss = a[j].getAttribute('class');
				if (!clss || (clss != 'r' && clss != 'b')) continue;
				var num = /\d+/.exec(a[j].lastElementChild.innerHTML)[0];
				if (clss == 'r') r[r.length] = num;
				else b[b.length] = num;
			}

			var ob;
			if (r.length && !findObj(objs, r)) {
				ob = {synd: r[0], union: 0, count: 1};
				if (r.length > 1) ob.union = r[1];
				objs[objs.length] = ob;
			}
			if (b.length && !findObj(objs, b)) {
				ob = {synd: b[0], union: 0, count: 1};
				if (b.length > 1) ob.union = b[1];
				objs[objs.length] = ob;
			}
		}

		count_lines.innerHTML = count ? '[' + count + ']' : '';
		showSyndData(objs);
	}
//----------------------------------------------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var st = root.localStorage;

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiеm рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'SortSyndWars:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	if (!st.getItem('sort_synd_wars')) st.setItem('sort_synd_wars', '0|0');

	//вставляем списки выбора типа недвиги, островов и кнопку
	var target = doc.getElementById('updatetimer2').parentNode;
	var sp_panel = doc.createElement('span');
	sp_panel.setAttribute('style', 'margin-left: 20px;');
	sp_panel.innerHTML = 'Остров: <select id="sel_isl" style="border: 1px solid #339933;">' +
		'<option value="0" selected>Все</option><option value="1">[Z]</option><option value="2">[G]</option>' +
		'<option value="3">[S]</option></select> Объект: ' +
		'<select id="sel_real_estate" style="border: 1px solid #339933; margin-left: 3px;">' +
		'<option value="0" selected>Все</option><option value="1">Эс</option><option value="2">Уран</option>' +
		'<option value="3">Недвига</option></select> ' +
		'<input type="button" id="_but_sort" value="Ok" style="border: 1px solid #339933; margin-left: 3px;">' +
		'<span id="count_lines" style="margin-left: 10px;"></span>';
	target.parentNode.insertBefore(sp_panel, target.nextSibling);

	var sel_1 = doc.getElementById('sel_isl');
	var sel_2 = doc.getElementById('sel_real_estate');
	var but_sort = doc.getElementById('_but_sort');
	var count_lines = doc.getElementById('count_lines');

	var table_lines = target.parentNode.getElementsByTagName('table')[0].getElementsByTagName('tr');
	but_sort.addEventListener('click', setSortData, false);

	var span_count = doc.createElement('span');
	target.parentNode.appendChild(span_count);

	sort_synd_wars();

}());
