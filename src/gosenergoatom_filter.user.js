// ==UserScript==
// @name			GosEnergoAtom Filter
// @namespace		using namespace std;
// @description		Сортирует Эс, Уранки по островам G, Z и S на странице ГосЭнегоАтом (http://www.ganjawars.ru/info.realty.php?id=2). Выводит онлайны и уровни контролирующего синдиката и его союза. Ничейные объекты выделяются цветом.
// @include			http://www.ganjawars.ru/info.realty.php?id=2
// @license			MIT
// @version			1.2
// @author			MyRequiem
// ==/UserScript==

(function() {
//--------------------------------------------------------------------------------------------------
	function req(url) {
		var xmlHTTP = new XMLHttpRequest();
		xmlHTTP.open('GET', url, false);
		xmlHTTP.send(null);
		if (xmlHTTP.status != 200) {
			alert('GosEnergoAtom Filter: Ошибка ответа сервера...');
			return false;
		}
	return xmlHTTP.responseText;
  }
//--------------------------------------------------------------------------------------------------
	function parsePage(obj) {
		var data = [];  //название синда, количество бойцов онлайн и уровень синда
		var td = obj.getElementsByTagName('td');
		for (var i = 0; i < td.length; i++) {
			if (/бойцов/.test(td[i].innerHTML) && /LVL/.test(td[i].innerHTML)) {
				data[0] = td[i].firstElementChild.innerHTML;
				data[2] = /(\d+) LVL/.exec(td[i].innerHTML)[1];
				break;
			}
		}

		var b = obj.getElementsByTagName('b');
		for (i = 0; i < b.length; i++) {
			if (/\d+ бойцов онлайн/i.test(b[i].innerHTML)){
				data[1] = /\d+/.exec(b[i].innerHTML)[0];
				break;
			}
		}

		return data;
	}
//--------------------------------------------------------------------------------------------------
	function out_Result(value) {
		divOnline.innerHTML = value;
		doc.getElementById('close_online').addEventListener('click', function() {
			divOnline.style.visibility = 'hidden';
		}, false);
	}
//--------------------------------------------------------------------------------------------------
	function getOnline(e) {
		if (!e) e = root.event;
		divOnline.style.left = e.pageX;
		divOnline.style.top = e.pageY - 45;
		divOnline.innerHTML = '<img style="margin: 3px 6px 3px 6px;" src="' + img_load_data + '">';
		divOnline.style.visibility = 'visible';

		var link = e.target.parentNode.nextElementSibling.firstElementChild.href;
	 	span_req.innerHTML = req(link + '&page=online');
		var mass = parsePage(span_req);
		var online_1 = '<table><tr><td style="color: #FF0000;">(' + mass[1] + ')</td>' +
			'<td><a target="_blank" href="' + link + '" style="color: #0000FF;">' + mass[0] + '</a></td>' +
			'<td style="color: #008000;">[' + mass[2] + ']</td>' +
			'<td rowspan="2"><span id="close_online" style="color: #FF0000; font-weight: bold; cursor: pointer;">' +
			'&#215;</span></td>';

		var online_2 = '<tr><td colspan="2">Нет союза</td><td></td></table>';
		root.setTimeout(function() {
			span_req.innerHTML = req(link + '&page=politics');
			var union;
			var b = span_req.getElementsByTagName('b');
			for (var i = 0; i < b.length; i++) {
				if (/Союзный синдикат/i.test(b[i].innerHTML)) {
					union = b[i].nextElementSibling;
					break;
				}
			}

			if(!union) {
				out_Result(online_1 + online_2);
			} else {
				root.setTimeout(function() {
					span_req.innerHTML = req(union.href + '&page=online');
					mass = parsePage(span_req);
					online_2 = '<tr><td style="color: #FF0000;">(' + mass[1] + ')</td>' +
						'<td><a target="_blank" href="' + link + '" style="color: #0000FF;">' + mass[0] + '</a></td>' +
						'<td style="color: #008000;">[' + mass[2] + ']</td></table>';
					out_Result(online_1 + online_2);
				}, 300);
			}
		}, 300);
	}
//--------------------------------------------------------------------------------------------------
	function reset() {
		for (var i = 1; i < tr.length; i++) {
			tr[i].style.display = '';
		}
	}
//--------------------------------------------------------------------------------------------------
	function Sort() {
		reset();

		var str1 = doc.getElementById('type_obj').value == 'es' ? 'Электростанция' : 'Урановый рудник';
		var str2 = doc.getElementById('island').value;

		for (var i = 1; i < tr.length; i++) {
			if (!~tr[i].innerHTML.indexOf(str1) || !~tr[i].innerHTML.indexOf(str2)) {
				tr[i].style.display = 'none';
			}
		}
	}
//--------------------------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var img_load_data = "data:image/gif,GIF89a!%00%08%00%91%00%00%CC%CC%CCf%CC%00%FF%FF%FF%00%00%00!%FF%0BNETSCAPE2.0%03%01%00%00%00!%F9%04%05%07%00%02%00%2C%00%00%00%00!%00%08%00%00%02%2B%14%8E%A9%CBh%02%A3%9C%B4%C6%23%82%0E%C6%A5%8E%7D%22%90m%209%86%DEZj%E7%9B%A2%EC%C6%C5%F0%AAZ%FA.%C9%CD%0F%C4%14%00%00!%F9%04%05%07%00%02%00%2C%07%00%02%00%04%00%04%00%00%02%04%8C%8F%19%05%00!%F9%04%05%07%00%02%00%2C%0C%00%02%00%04%00%04%00%00%02%04%8C%8F%19%05%00!%F9%04%05%07%00%02%00%2C%02%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%05%07%00%02%00%2C%07%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%05%07%00%02%00%2C%0C%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%09%07%00%02%00%2C%00%00%00%00!%00%08%00%00%02%14%94%8F%A9%CB%ED%0F%13%98%20ZC%EB%8Dys%EA%85%E2%88%14%00%3B";
	var span_req = doc.createElement('span');

	var div_sort = doc.createElement('div');
	div_sort.setAttribute('style', 'position :absolute; border: solid 1px #339933; background-color: #F5FFF5; padding: 5px;  top: 100px; left:20px;');
	div_sort.innerHTML = '<table><tr>' +
		'<td style="text-align: center;"><select id="island" style="border: solid 1px #339933;">' +
		'<option value="[Z]">[Z]</option><option value="[G]">[G]</option><option value="[S]">[S]</option>' +
		'</select><select id="type_obj" style="border: solid 1px #339933; margin-left: 10px;">' +
		'<option value="es" selected>Эски</option><option value="uran">Уранки</option></select></td>' +
		'<tr><td style="text-align: center;"><input type="button" id="but_sort" value="Сортировать" ' +
		'style="border: solid 1px #339933; margin-top: 10px; background-color: #D0EED0;"></td>' +
		'<tr><td style="text-align: center;"><input type="button" id="but_cancel" value="Отменить" ' +
		'style="border: solid 1px #339933; margin-top: 10px; background-color: #D0EED0;"></td></table>';
	doc.body.appendChild(div_sort);

	var divOnline = doc.createElement('div');
	divOnline.setAttribute('style', 'position: absolute; visibility: hidden; border: solid 1px #339933; border-radius: 5px; cursor: default; background-color: #D0EED0; top:0; left:0;');
	doc.body.appendChild(divOnline);

	//находим таблицу с недвигой и добавляем в нее еще одно поле
	var tr;
	var tbl = doc.getElementsByTagName('table');
	for (var i = 0; i < tbl.length; i++) {
		if (/<b>Продукция<\/b>/i.test(tbl[i].innerHTML)) {
			tr = tbl[i].getElementsByTagName('tr');
			break;
		}
	}

	var td = doc.createElement('td');
	td.innerHTML = '<b>Online<b>';
	tr[0].insertBefore(td, tr[0].firstElementChild);

	for (i = 1; i < tr.length; i++) {
		//под контролем или ничейка?
		var control = /syndicate\.php\?id=/.test(tr[i].firstElementChild.innerHTML);
		//добавляем ячейку
		td = tr[i].firstElementChild.cloneNode(false);
		td.setAttribute('style', 'text-align: center');
		tr[i].insertBefore(td, tr[i].firstElementChild);
		if (control) {
			td.innerHTML = '<span style="cursor: pointer;">click</span>';
			td.addEventListener('click', getOnline, false);
		} else if (/Электростанция/i.test(tr[i].innerHTML) || /Урановый рудник/i.test(tr[i].innerHTML)) {
				tr[i].style.background = '#D0EED0';
		}
	}

	doc.getElementById('but_sort').addEventListener('click', Sort, false);
	doc.getElementById('but_cancel').addEventListener('click', reset, false);

}());
