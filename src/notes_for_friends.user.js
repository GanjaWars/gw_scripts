// ==UserScript==
// @name			Notes for friends and blacklist
// @namespace		using namespace std;
// @description		Добавляет возможность сохранять комментарии для ваших друзей и персонажей из черного списка.
// @include			http://www.ganjawars.ru/home.friends.php*
// @include			http://www.ganjawars.ru/me/*
// @license			MIT
// @version			1.0
// @author			MyRequiem (идея: ЧупакаЪра)
// ==/UserScript==

(function() {
//------------------------------------------------------------------------------
	function ajaxQuery(url, rmethod, param, onsuccess, onfailure) {
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open(rmethod, url, true);

		if (rmethod == 'POST') {
			xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xmlHttpRequest.setRequestHeader("Content-length", param.length);
			xmlHttpRequest.setRequestHeader("Connection", "close");
		}

		xmlHttpRequest.send(param);

		var timeout = setTimeout(function() {xmlHttpRequest.abort();}, 10000);
		xmlHttpRequest.onreadystatechange = function() {
			if (xmlHttpRequest.readyState != 4) return;

			clearTimeout(timeout);
			if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200 && typeof onsuccess != 'undefined') {
				onsuccess(xmlHttpRequest);
			} else {
				if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status != 200 && typeof onfailure != 'undefined') {
					onfailure();
				}
			}
		};
	}
//------------------------------------------------------------------------------
	function decode_UTF8(str) {
		var rez = '';
		var ch = 0;
		for (var i = 0; i < str.length; i++) {
			ch = str.charCodeAt(i);
			if (ch > 1024) {
				ch = (ch == 1025) ? 1016 : ((ch == 1105) ? 1032 : ch);
				rez += String.fromCharCode(ch - 848);
			} else if (ch <= 127) {
				rez += str.charAt(i);
			}
		}

		return rez;
	}
//------------------------------------------------------------------------------
	function getPersNote(id) {
		if (/Ошибка|Err/.test(data)) return data;
		var reg = new RegExp('\\|' + id + '\\|: ([^\\n]*)\\n');
		var note = reg.exec(data);
		if (!note) return '';
		return note[1];
	}
//------------------------------------------------------------------------------
	function saveData(inp) {
		inp.disabled = true;
		var val = inp.value;
		inp.value = 'Сохранение...';

		var reg = new RegExp('\\|' + inp.id + '\\|: [^\\n]*\\n');
		var rez_test = reg.test(data);

		if (!rez_test && !val) {	//поле пустое и записи для персонажа нет
			inp.disabled = false;
			inp.value = '';
			alert('Нечего сохранять');
			return;
		} else if (!rez_test && val) {	//нет записи для персонажа, добавляем
			data += '|' + inp.id + '|: ' + val + '\n';
		} else if (rez_test && !val) {	//есть запись и ничего не введено, удаляем ее
			data = data.replace(reg, '');
		} else {
			data = data.replace(reg, '|' + inp.id + '|: ' + val + '\n');
		}


		var param = 'isk_id=' + complaintID + '&save_body=1&isk_body=' + escape(decode_UTF8(data));
		ajaxQuery('http://www.ganjawars.ru/complaint.php', 'POST', param, function() {
			root.location.reload();
		},
		function() {
			inp.disabled = false;
			inp.value = 'Ошибка ответа сервера...';
		});
	}
//------------------------------------------------------------------------------
	function addEvent(id, ev) {
		var node = _$(id);
		if (ev == 'mouseout') {
			node.addEventListener(ev, function() {div_info.style.display = 'none';}, false);
			return;
		}

		node.addEventListener(ev, function(e) {
			e = e || root.event;
			div_info.style.left = e.pageX - 50;
			div_info.style.top = e.pageY - 30;
			div_info.innerHTML = getPersNote(/\d+/.exec(id)[0]) || '-------';
			div_info.style.display = '';
		}, false);

	}
//------------------------------------------------------------------------------
	function setSettingsLink(tbl) {
		var table = tbl.getElementsByTagName('table')[0];
		var sett_img = doc.createElement('img');
		sett_img.setAttribute('style', 'cursor: pointer; margin-right: 10px;');
		sett_img.setAttribute('title', 'Настройки');
		sett_img.src = settings_img;
		var target = table.getElementsByTagName('td')[0];
		target.insertBefore(sett_img, target.firstElementChild);
		//ссылка на жалобу
		if (complaintID) {
			var link_compl = doc.createElement('a');
			link_compl.setAttribute('style', 'color: #0000FF; margin-right: 10px; text-decoration: none;');
			link_compl.setAttribute('target', '_blank');
			link_compl.href = url_complaint;
			link_compl.innerHTML = 'Заметки';
			target.insertBefore(link_compl, target.firstElementChild);
		}

		sett_img.addEventListener('click', function() {
			table.innerHTML = '<tr><td>' +
				'Создайте и сохраните ПУСТУЮ жалобу (если еще не создана) на <a href="http://www.ganjawars.ru/complaint.php"' +
				' target="_blank">этой</a> странице.<br><br>' +
				'<input id="compl_id"  maxlength="7" size="6" /> <label for="compl_id">ID жалобы</label><br>' +
				'<input id="chk" type="checkbox" /> <label for="chk">Заметки на главной странице</label><br>' +
				'<input id="back" type="button" value="Отмена" /> <input id="set" type="button" value="Принять" />' +
				'<td></tr>';

			var inp = _$('compl_id');
			var chk = _$('chk');
			var but_ok = _$('set');
			var back = _$('back');

			inp.value = getData(1);
			if (!inp.value) but_ok.disabled = true;
			chk.checked = +getData(0);

			inp.addEventListener('input', function() {
				if (!/^\d+\s*$/.test(this.value))  {
					but_ok.disabled = true;
					this.style.background = '#F4DEDE';
				} else {
					but_ok.disabled = false;
					this.style.background = '#FFFFFF';
				}
			}, false);

			but_ok.addEventListener('click', function() {
				var chckd = chk.checked ? '1' : '0';
				setData(chckd, 0);
				setData(inp.value, 1);
				root.location.reload();
			}, false);

			back.addEventListener('click', function() {root.location.reload();}, false);
		}, false);
	}
//------------------------------------------------------------------------------
	function setFriendPage() {
		var links;
		var tbls = doc.getElementsByTagName('table');
		for (var i = 0; i < tbls.length; i++) {
			if (tbls[i].getAttribute('width') == '600') {
				links = tbls[i].getElementsByTagName('a');
				setSettingsLink(tbls[i]);
				break;
			}
		}

		var pers_id;
		for (i = 0; i < links.length; i++) {
			pers_id = /\/info\.php\?id=(\d+)/.exec(links[i].href);
			if (!pers_id) continue;
			pers_id = pers_id[1];
			links[i].parentNode.innerHTML += ' <span id="info_' + pers_id + '" style="cursor: pointer;">[?]</span> ' +
				'<img id="edit_' + pers_id + '" src="' + env_img + '" style="cursor: pointer;"' +
				'title="Изменить заметку"/><br><input type="text" id="' + pers_id + '" value="' + getPersNote(pers_id) +
				'" style="width: 250px; margin-top: 3px; display: none;" title="Введите заметку и нажмите Enter" />';

			var inp_text = _$(pers_id);
			if (/Err/.test(inp_text.value)) {
				inp_text.disabled = true;
			} else {
				inp_text.addEventListener('keypress', function(e) {
					e = e || root.event;
					if (e.keyCode == 13) saveData(this);
				}, false);
			}

			_$('edit_' + pers_id).addEventListener('click', function(id) {
				return function() {
					var inp = _$(id);
					inp.style.display = inp.style.display == 'none' ? '' : 'none';
					inp.focus();
				}
			}(pers_id), false);

			addEvent('info_' + pers_id, 'mouseover');
			addEvent('info_' + pers_id, 'mouseout');
		}
	}
//------------------------------------------------------------------------------
	function setMainPage() {
		var div = doc.getElementById('friendsbody');
		//если уже установлены [?]
		if (/\[\?\]/.test(div.innerHTML)) return;

		var a;
		var nobrs = div.getElementsByTagName('nobr');
		for (var i = 0; i < nobrs.length; i++) {
			a = nobrs[i].getElementsByTagName('a');
			var id = /\/info\.php\?id=(\d+)/.exec(a[0].href);
			id = id ? id[1] : /\/info\.php\?id=(\d+)/.exec(a[1].href)[1];
			nobrs[i].innerHTML += ' <span id="info_' + id + '" style="cursor: pointer;">[?]</span>';

			addEvent('info_' + id, 'mouseover');
			addEvent('info_' + id, 'mouseout');
		}

		//обработчик 'onclick' на ссылке "Друзья онлайн"
		a = doc.getElementsByTagName('a');
		for (i = 0; i < a.length; i++) {
			if (/return setfriends/.test(a[i].getAttribute('onclick'))) {
				a[i].addEventListener('click', function() {root.setTimeout(setMainPage, 50);}, false);
				break;
			}
		}
	}
//------------------------------------------------------------------------------
	function setData(data, ind) {
		var temp = st.getItem('notes_for_friends').split('|');
		temp[ind] = data;
		st.setItem('notes_for_friends', temp.join('|'));
	}
//------------------------------------------------------------------------------
	function getData(ind) {return st.getItem('notes_for_friends').split('|')[ind];}
//------------------------------------------------------------------------------
	function _$(id) {return doc.getElementById(id);}
//------------------------------------------------------------------------------
	function select_mode() {friend_page ? setFriendPage() : setMainPage();}
//------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var env_img = "data:image/gif,GIF89a%0C%00%0A%00%80%01%00%00D%00%FF%FF%FF!%F9%04%01%00%00%01%00%2C%00%00%00%00%0C%00%0A%00%00%02%17%0C%8E%18%0B%EB%DC%8C%7C%AA%C5)mv%BAo%0F%3E%A2%95%94%97%F8%14%00%3B";
	var settings_img = "data:image/gif,GIF89a%0C%00%0A%00%80%01%00%00D%00%FF%FF%FF!%F9%04%01%00%00%01%00%2C%00%00%00%00%0C%00%0A%00%00%02%18%8Co%80%AB%8D%9A%00%0CN6%19%A1%CD%14%3B%9E%3C%D4%B8%1CS%89%22%05%00%3B";
	var st = root.localStorage;

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiеm рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'Notes for friends and blacklist:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	//localStorage: [0] - отображать/не отображать на главной странице, [1] - номер жалобы
	if (!st.getItem('notes_for_friends')) st.setItem('notes_for_friends', '0|');
	var complaintID = getData(1);
	var display_on_main_page = +getData(0);

	//всплывающий div с заметкой
	var div_info = doc.createElement('div');
	div_info.setAttribute('style', 'position: absolute; display: none; background: #E7FFE7; border: 1px #339933 solid; padding: 3px; border-radius: 5px;');
	doc.body.appendChild(div_info);

	var friend_page = /\/home\.friends\.php/.test(root.location.href);
	if (!friend_page && !display_on_main_page) return;

	//получаем данные со страницы жалобы
	var data = '';
	var url_complaint = 'http://www.ganjawars.ru/complaint.php?isk_id=' + complaintID;
	ajaxQuery(url_complaint, 'GET', null, function(xml) {
		var div = doc.createElement('div');
		div.innerHTML = xml.responseText;
		var txt_area = div.getElementsByTagName('textarea');
		data = txt_area[0] && complaintID  ? txt_area[0].value : 'Err: Проверьте ID жалобы в настройках.';
		select_mode();
	},
	function() {
		data = 'Ошибка ответа сервера...';
		select_mode();
	});

}());
