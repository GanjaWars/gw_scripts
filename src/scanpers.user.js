// ==UserScript==
// @name			ScanPers
// @namespace		using namespace std;
// @description		Выдает сообщение и/или звуковой сигнал при появлении (или выходе) в онлайне определенного перса.
// @include			http://www.ganjawars.ru/*
// @exclude			http://www.ganjawars.ru/b0*
// @exclude			http://www.ganjawars.ru/tmp/*
// @exclude			http://www.ganjawars.ru/ferma.php*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function(){
//--------------------------------------------------------------------------------------------------
	function ajaxQuery(url, onsuccess, onfailure) {
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open('GET', url, true);
		xmlHttpRequest.send(null);

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
//--------------------------------------------------------------------------------------------------
	function convert(str) {
		var mass = {1040:192,1041:193,1042:194,1043:195,1044:196,1045:197,1046:198,1047:199,1048:200,1049:201,
			1050:202,1051:203,1052:204,1053:205,1054:206,1055:207,1056:208,1057:209,1058:210,1059:211,1060:212,
			1061:213,1062:214,1063:215,1064:216,1065:217,1066:218,1067:219,1068:220,1069:221,1070:222,1071:223,
			1072:224,1073:225,1074:226,1075:227,1076:228,1077:229,1078:230,1079:231,1080:232,1081:233,1082:234,
			1083:235,1084:236,1085:237,1086:238,1087:239,1088:240,1089:241,1090:242,1091:243,1092:244,1093:245,
			1094:246,1095:247,1096:248,1097:249,1098:250,1099:251,1100:252,1101:253,1102:254,1103:255,1025:168,
			1105:184,8470:185};

		var result = '';
		for (var i = 0; i < str.length; i++) {
			var code = str.charCodeAt(i);
			code = mass[code] ? mass[code] : code;
			if (code < 16) {
				result += '%0'+ code.toString(16);
			} else {
				result += '%'+ code.toString(16);
			}
		}

		return result;
	}
//--------------------------------------------------------------------------------------------------
	function playSound(sound) {
		if (!sound) return;
		var fl = doc.getElementById('scanpers_flashcontent');
		if (!fl) {
			fl = doc.createElement('div');
			fl.id = 'scanpers_flashcontent';
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
	function scan(now) {
		showHideLoading();
		var syndID = getData(1);
		var persID = getData(6);
		var nik = getData(0);

		ajaxQuery('http://www.ganjawars.ru/syndicate.php?id=' + syndID + '&page=online', function(xml) {
			spanContent.innerHTML = xml.responseText;

			var table;
			var a = spanContent.getElementsByTagName('a');
			for (var i = 0; i < a.length; i++) {
				if (a[i].innerHTML == 'Кто онлайн' && a[i].parentNode.nodeName == 'CENTER') {
					table = a[i].parentNode.nextElementSibling.nextElementSibling;
					break;
				}
			}

			var reg = new RegExp('/info\\.php\\?id=' + persID + '"');
			var online = reg.test(table.innerHTML);

			showHideLoading();
			if (now) {	//нажали кнопу "Узнать сейчас"
				var str = online ? ' в игре' : ' не в игре';
				alert('Персонаж ' + nik + str);
				return;
			}

			//если в игре
			if (online && getData(7) == '0') {
				setData(7, '1');
				if (chkSound.checked) playSound(sel1.value);
				if (chkAllert.checked) alert('Персонаж ' + nik + ' в игре');
			}

			//если вышел
			if (!online && getData(7) == '1') {
				setData(7, '0');
				if (chkSound.checked) playSound(sel2.value);
				if (chkAllert.checked) alert('Персонаж ' + nik + ' вышел из игры');
			}
		},
		function() {
			alert('ScanPers: Ошибка ответа сервера...');
			showHideLoading();
		});
	}
//------------------------------------------------------------------------------
	function saveData() {
		var nikPers = txtNik.value;
		if (!nikPers) {
			alert('Введите ник персонажа');
			return;
		}
		var syndID = txtSynd.value;
		if (!syndID || isNaN(syndID) || +syndID < 0) {
			alert('Не верно введен номер синдиката');
			return;
		}

		showHideLoading();
		ajaxQuery('http://www.ganjawars.ru/search.php?key=' + convert(nikPers), function(xml) {
			spanContent.innerHTML = xml.responseText;
			if (/Персонаж с таким именем не найден/.test(spanContent.innerHTML)) {
				showHideLoading();
				alert('Персонаж с именем ' + nikPers + ' не найден');
				return;
			}

			var reg = new RegExp('/syndicate\\.php\\?id=' + syndID + '"');
			if (!reg.test(spanContent.innerHTML)) {
				showHideLoading();
				alert('Персонаж ' + nikPers + ' не состоит в синдикате #' + syndID + ',\nили его список ' +
					'синдикатов скрыт. Если список скрыт, то введите номер основного синдиката.');
				return;
			}

			var a = spanContent.getElementsByTagName('a');
			for (var i = 0; i < a.length; i++) {
				if (/передач денег и предметов/.test(a[i].innerHTML)) {
					setData(0, nikPers);
					setData(1, syndID);
					setData(6, /id=(\d+)/.exec(a[i].href)[1]);
					setData(7, '0');
					break;
				}
			}

			showHideLink();
			root.setTimeout(function() {showHideLoading(); scan();}, 1000);
		}, function() {
			alert('ScanPers: Ошибка ответа сервера...');
			showHideLoading();
		});
	}
//------------------------------------------------------------------------------
	function showHideLoading() {
		img_load.style.display = img_load.style.display == 'none' ? '' : 'none';
	}
//------------------------------------------------------------------------------
	function listenSound() {
		var sound = /1/.test(this.id) ? sel1.value : sel2.value;
		playSound(sound);
	}
//------------------------------------------------------------------------------
	function showHideMenu() {
		settingsWin.style.visibility = settingsWin.style.visibility == 'hidden' ? 'visible' : 'hidden';
	}
//------------------------------------------------------------------------------
	function changeSelect() {
		var ind = /1/.test(this.id) ? 4 : 5;
		var opt = this.getElementsByTagName('option');
		for (var i = 0; i < opt.length; i++) {
			if (opt[i].selected) {
				setData(ind, i);
				break;
			}
		}
	}
//------------------------------------------------------------------------------
	function chkSoundClick() {
		var check = this.checked;
		var data = check ? '1' : '0';
		setData(2, data);
		sel1.disabled = !check;
		sel2.disabled = !check;
		listen1.disabled = !check;
		listen2.disabled = !check;
	}
//------------------------------------------------------------------------------
	function createSelect(select) {
		for (var i = 1; i < 31; i++) {
			var opt = doc.createElement('option');
			opt.value = i;
			opt.innerHTML = '№ ' + i;
			select.appendChild(opt);
		}
	}
//------------------------------------------------------------------------------
	function getData(ind) {return st.getItem('scanPers_' + myID).split('|')[ind];}
//------------------------------------------------------------------------------
	function setData(ind, value) {
		var temp = st.getItem('scanPers_' + myID).split('|');
		temp[ind] = value;
		st.setItem('scanPers_' + myID, temp.join('|'));
	}
//------------------------------------------------------------------------------
	function getObj(id) {return doc.getElementById(id);}
//------------------------------------------------------------------------------
	function showHideLink() {
		var id = getData(6);
		if (id != '0') {
			td_link.innerHTML = '<a style="color: #008000;" href="http://www.ganjawars.ru/info.php?id=' + id + '">' +
				getData(0) + '</a>';
			td_link.style.display = '';
			butReset.disabled = false;
			butCheckNow.disabled = false;
		} else {
			td_link.style.display = 'none';
			butReset.disabled = true;
			butCheckNow.disabled = true;
		}
	}
//------------------------------------------------------------------------------
	var root = typeof(unsafeWindow) != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var myID = doc.cookie.match('(^|;) ?uid=([^;]*)(;|$)')[2];
	var img_loading = "data:image/gif,GIF89a!%00%08%00%91%00%00%CC%CC%CCf%CC%00%FF%FF%FF%00%00%00!%FF%0BNETSCAPE2.0%03%01%00%00%00!%F9%04%05%07%00%02%00%2C%00%00%00%00!%00%08%00%00%02%2B%14%8E%A9%CBh%02%A3%9C%B4%C6%23%82%0E%C6%A5%8E%7D%22%90m%209%86%DEZj%E7%9B%A2%EC%C6%C5%F0%AAZ%FA.%C9%CD%0F%C4%14%00%00!%F9%04%05%07%00%02%00%2C%07%00%02%00%04%00%04%00%00%02%04%8C%8F%19%05%00!%F9%04%05%07%00%02%00%2C%0C%00%02%00%04%00%04%00%00%02%04%8C%8F%19%05%00!%F9%04%05%07%00%02%00%2C%02%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%05%07%00%02%00%2C%07%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%05%07%00%02%00%2C%0C%00%02%00%13%00%04%00%00%02%0F%84!%A9%2B%E1q%10c%0F%9EI_%C4%AB%16%00!%F9%04%09%07%00%02%00%2C%00%00%00%00!%00%08%00%00%02%14%94%8F%A9%CB%ED%0F%13%98%20ZC%EB%8Dys%EA%85%E2%88%14%00%3B";
	var spanContent = doc.createElement('span');
	var st = root.localStorage;

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiеm рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'ScanPers:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	/*	localStorage:
		[0] - ник перса
		[1] - id синда
		[2] - чекбокс звук
		[3] - чекбокс сообщение
		[4] - id звука при входе
		[5] - id звука при выходе
		[6] - id перса
		[7] - играть звук(сообщение) или нет
	*/
	if (!st.getItem('scanPers_' + myID)) st.setItem('scanPers_' + myID, '0|0|0|0|0|0|0|0');

	//на login или index
	if (/www\.ganjawars\.ru\/index.php/.test(root.location.href) ||
		/www\.ganjawars\.ru\/login.php/.test(root.location.href)) {
		setData(7, '0');
		return;
	}

	//вставляем кнопу настроек
	var settingsBut = doc.createElement('td');
	settingsBut.setAttribute('style', 'text-align: center; cursor: default; width: 5%; color: #0000FF; background: #A1EA9D;');
	settingsBut.innerHTML = 'ScanPers';
	var a = doc.getElementsByTagName('a');
	for (var i = 0; i < a.length; i++) {
		if (/www\.ganjawars\.ru\/items\.php/.test(a[i].href)) {
			var target = a[i].parentNode.parentNode;
			target.setAttribute('width', '90%');
			target.parentNode.insertBefore(settingsBut, target);
			//вставим еще один td с права, чтобы центральное меню не сдвигалось
			target.parentNode.appendChild(doc.createElement('td'));
			break;
		}
	}

	//меню настроек
	var settingsWin = doc.createElement('div');
	settingsWin.setAttribute('style', 'visibility: hidden; position: absolute; cursor: default; padding: 5px; border: solid 1px #339933; background: #D7F4D8; top: 70px; left: 5px;');
	settingsWin.innerHTML = '<table><tr><td>Ник персонажа:</td><td><input id="scan_nik" type="text" value="" ' +
		'style="border: solid 1px #339933;"></td><tr><td>Номер синдиката:</td><td><input id="scan_synd_id" ' +
		'type="text" size="5" maxlength="6" value="" style="border: solid 1px #339933;"> ' +
		'<span style="font-size: 11px;">(без #)</span></td><tr><td colspan="2" style="padding-top: 10px;">' +
		'<input id="scan_chksound" type="checkbox" style="margin: 0;"><label for="scan_chksound"> Проигрывать звук при:' +
		'</label></td><tr><td colspan="2">входе <select id="scan_sel1" style="border: solid 1px #339933;" ' +
		'disabled></select> <input type="button" id="scan_listen1" value="»" disabled> выходе ' +
		'<select id="scan_sel2" style="border: solid 1px #339933;" disabled></select> <input type="button" ' +
		'id="scan_listen2" value="»" disabled></td><tr><td colspan="2" style="padding-top: 10px;">' +
		'<input id="scan_chkallert" type="checkbox" style="margin: 0;"><label for="scan_chkallert"> ' +
		'Выдавать сообщение</label><img id="img_load" style="margin-left: 10px; display: none;" src="' +
		img_loading + '"></td><tr><td colspan="2" style="padding-top: 10px; text-align: center;">' +
		'<input type="button" id="scan_save" value="Принять"> <input type="button" id="scan_reset" value="Сброс"> ' +
		'<input type="button" id="scan_checknow" value="Узнать сейчас"></td><tr><td id="td_link" colspan="2" ' +
		'style="padding-top: 10px; text-align: center; display: none;"></td></table>';
	doc.body.appendChild(settingsWin);

	//обработчик кнопки открытия/закрытия настроек
	settingsBut.addEventListener('click', showHideMenu, false);

	var txtNik = getObj('scan_nik');
	var txtSynd = getObj('scan_synd_id');
	var chkSound = getObj('scan_chksound');
	var sel1 = getObj('scan_sel1');
	var sel2 = getObj('scan_sel2');
	var listen1 = getObj('scan_listen1');
	var listen2 = getObj('scan_listen2');
	var chkAllert = getObj('scan_chkallert');
	var butSave = getObj('scan_save');
	var butReset = getObj('scan_reset');
	var butCheckNow = getObj('scan_checknow');
	var img_load = getObj('img_load');
	var td_link = getObj('td_link');

	//заполняем select'ы
	createSelect(sel1);
	createSelect(sel2);

	//ник перса и синд
	var nik = getData(0);
	if (nik != '0') {
		txtNik.value = nik;
		txtSynd.value = getData(1);
	}

	//списки выбора звуков
	sel1.options[+getData(4)].selected = true;
	sel2.options[+getData(5)].selected = true;
	sel1.addEventListener('change', changeSelect, false);
	sel2.addEventListener('change', changeSelect, false);

	//чекбокс звук
	chkSound.addEventListener('click', chkSoundClick, false);
	if (getData(2) == '1') chkSound.click();

	//кнопки слушать звук
	listen1.addEventListener('click', listenSound, false);
	listen2.addEventListener('click', listenSound, false);

	//чекбокс сообщение
	chkAllert.addEventListener('click', function() {
		var data = this.checked ? '1' : '0';
		setData(3, data);
	}, false);
	if (getData(3) == '1') chkAllert.click();

	butSave.addEventListener('click', saveData, false);
	butReset.addEventListener('click', function() {
		if (!confirm('Сбросить данные?')) return;
		setData(0, '0');
		setData(1, '0');
		setData(6, '0');
		setData(7, '0');
		txtNik.value = '';
		txtSynd.value = '';
		showHideLink();
	}, false);

	butCheckNow.addEventListener('click', function() {if (getData(0) != '0') scan(1);}, false);

	showHideLink();
	if (getData(0) != '0' && (chkSound.checked || chkAllert.checked)) scan();

}());
