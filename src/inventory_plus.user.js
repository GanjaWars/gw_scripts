// ==UserScript==
// @name			Inventory Plus
// @namespace		using namespace std;
// @description		Упаковка одинаковых предметов в инвентаре.
// @include			http://www.ganjawars.ru/items.php*
// @license			MIT
// @version			1.1
// @author			MyRequiem
// ==/UserScript==

(function () {
//-----------------------------------------------------------------------------
	function compareLines(line, lines_obj) {
		line.link = line.line_1.getElementsByTagName('font')[0].parentNode.parentNode;
		line.id = /id=(.*)$/.exec(line.link)[1];
		for (var i = 0; i < lines_obj.length; i++) {
			if (lines_obj[i].line.id == line.id) {
				return lines_obj[i];
			}
		}
		return false;
	}
//-----------------------------------------------------------------------------
	function _start() {
		var tbody;
		//ищем таблицу с инвентарем
		var table = doc.getElementsByTagName('table');
		for (i = 0; i < table.length; i++) {
			if (table[i].getAttribute('width') == '700' && table[i].getAttribute('cellspacing') == '1' &&
				table[i].getAttribute('align') == 'center' && !table[i].getAttribute('style') &&
				table[i].getAttribute('cellpadding') != '0') {
				tbody = table[i].firstElementChild;
				break;
			}
		}

		//отберем все <tr> предметов в инвентаре
		//в каждом предмете может быть 1 или 2 <tr>, поэтому закидываем в объект
		var all_lines = [];
		var node = tbody.firstElementChild.nextElementSibling;
		//если нет предметов в инвентаре
		if (/предметов нет/.test(node.innerHTML)) return;

		while (node) {
			i = all_lines.length;
			all_lines[i] = {'line_1': node.cloneNode(true), 'line_2': 0};
			var next = node.nextSibling;
			if (next.nodeType == 1) {
				all_lines[i].line_2 = next.cloneNode(true);
				node = next.nextElementSibling;
			} else {
				node = node.nextElementSibling;
			}
		}

		//удаляем все предметы из инвентаря
		var title = tbody.firstElementChild.cloneNode(true);
		tbody.innerHTML = '';
		tbody.appendChild(title);

		//массив "уникальных" вещей (каждая вешь по одной и количество)
		var lines_obj = [];
		for (i = 0; i < all_lines.length; i++) {
			var obj = compareLines(all_lines[i], lines_obj);
			if (!obj) {
				lines_obj[lines_obj.length] = {line: all_lines[i], count: 1};
			} else {
				obj.count++;
			}
		}

		//вставляем вещи обратно в инвентарь
		for (i = 0; i < lines_obj.length; i++) {
			tbody.appendChild(lines_obj[i].line.line_1);
			if (lines_obj[i].line.line_2) tbody.appendChild(lines_obj[i].line.line_2);

			//показываем количество только если оно больше 1
			if (lines_obj[i].count == 1) continue;

			var id = lines_obj[i].line.id;
			//вставим скрытые вещи
			var tr_hide = doc.createElement('tr');
			tr_hide.id = 'tr_' + id;
			tr_hide.setAttribute('style', 'display: none');
			var td = doc.createElement('td');
			td.setAttribute('colspan', '2');
			var tbl_target = doc.createElement('table');
			tbl_target.setAttribute('style', 'width: 100%; margin-left: 30px;');
			td.appendChild(tbl_target);
			tr_hide.appendChild(td);
			tbody.appendChild(tr_hide);

			for (j = 0; j < all_lines.length; j++) {
				if (all_lines[j].id == id && lines_obj[i].line.line_1.innerHTML != all_lines[j].line_1.innerHTML) {
					all_lines[j].line_1.firstElementChild.setAttribute('width', '400px');
					tbl_target.appendChild(all_lines[j].line_1);
					if (all_lines[j].line_2) tbl_target.appendChild(all_lines[j].line_2);
				}
			}

			//показываем количество и кнопу раскрытия списка
			var div = doc.createElement('div');
			div.setAttribute('style', 'color: #606060; margin-right: 300px; margin-left: 10px; font-weight: bold; cursor: pointer;');
			div.innerHTML = '[' + lines_obj[i].count + '+]';
			div.addEventListener('click', function(id) {
				return function() {
					var tb = doc.getElementById('tr_' + id);
					if (tb.style.display == '') {
						tb.style.display = 'none';
						this.innerHTML = this.innerHTML.replace('-', '+');
					} else {
						tb.style.display = '';
						this.innerHTML = this.innerHTML.replace('+', '-');
					}
				}
			}(id), false);

			lines_obj[i].line.link.parentNode.appendChild(div);
		}
	}
//------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	var doc = root.document;

	if (/Chrome/i.test(root.navigator.appVersion)) {
		//костыль для хрома
		var scrpt = doc.createElement('script');
		scrpt.innerHTML =  "function postdo_mod(url) {" +
		"new Ajax.Updater('itemsbody', url, {asynchronous: true, onSuccess: " +
		"function() {location.reload();}, method: 'post'}); return false;}";
		doc.body.insertBefore(scrpt, doc.body.getElementsByTagName('script')[1].nextElementSibling);

		//изменим все ссылки на странице, использующие в атрибуте onclick функцию 'postdo' на 'postdo_mod'
		var a = doc.getElementsByTagName('a');
		for (var i = 0; i < a.length; i++) {
			var attr = a[i].getAttribute('onclick');
			if (attr && /^return postdo/.test(attr)) {
				a[i].setAttribute('onclick', attr.replace('postdo', 'postdo_mod'));
			}
		}
	} else {
		root.dumb = function() {setTimeout(_start, 100);};
	}

	_start();

}());
