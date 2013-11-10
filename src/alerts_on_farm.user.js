// ==UserScript==
// @name			Alerts On The Farm
// @namespace		using namespace std;
// @description		Звуковое оповещение на ферме(поливать, собирать).
// @include			http://www.ganjawars.ru/ferma.php*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {
//--------------------------------------------------------------------------------------------------
	function BadValueError(name, message) {
		this.name = name;
		this.message = message;
	}
//--------------------------------------------------------------------------------------------------
	function checkInput1(value) {
		if (value == '') {
			throw new BadValueError('BadValue', 'Отсутствует значение таймаута');
		}
	}
//--------------------------------------------------------------------------------------------------
	function checkInput2(value) {
		if (isNaN(+value)) {
			throw new BadValueError('BadValue', 'Не верное значение таймаута');
		}
	}
//--------------------------------------------------------------------------------------------------
	function checkInput3(value) {
		if ((+value) < 5) {
			throw new BadValueError('BadValue', 'Значение таймаута должно быть больше 4 сек');
		}
	}
//--------------------------------------------------------------------------------------------------
	function getObj(id) {return doc.getElementById(id);}
//--------------------------------------------------------------------------------------------------
	function playSound(sound) {
		if (!sound || sound == '0') return;
		var fl = doc.getElementById('f1_flashcontent');
		if (!fl) {
			fl = doc.createElement('div');
			fl.id = 'f1_flashcontent';
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
//--------------------------------------------------------------------------------------------------
	function createSelect(id, flag) {
		var select = doc.createElement('select');
		select.setAttribute('style', 'margin-right: 10px; margin-bottom: 5px;');
		select.id = id;
		if (!flag) {
			var optNothing = doc.createElement('option');
			optNothing.value = '0';
			optNothing.innerHTML = 'Без звука';
			select.appendChild(optNothing);
		}

		for (var i = 1; i <= 30; i++) {
			var opt = doc.createElement('option');
			opt.value = i;
			opt.innerHTML = i;
			select.appendChild(opt);
		}

		return select;
	}
//--------------------------------------------------------------------------------------------------
	function showHideMenu(e) {
		if (divSettings.style.visibility == 'visible') {
			divSettings.style.visibility = 'hidden';
			return;
		}

		var data = st.getItem('alertsFarm').split('|');
		getObj('sel1').options[+data[0]].selected = true;
		getObj('sel2').options[+data[1]].selected = true;
		getObj('sel3').options[0].selected = true;
		getObj('inp').value = data[3];

		if (+data[2]) {
			getObj('chk').checked = true;
			getObj('inp').disabled = false;
		} else {
			getObj('chk').checked = false;
			getObj('inp').disabled = true;
		}

		e = e || root.event;
		divSettings.style.left = e.pageX - 110;
		divSettings.style.top = e.pageY + 20;
		divSettings.style.visibility = 'visible';
	}
//--------------------------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var st = root.localStorage;

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiem рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'Alerts On The Farm:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	/*
	localStorage
	 0 - звук при поливе
	 1 - звук при сборе
	 2 - повторять/не повторять звук
	 3 - таймаут повтора
	*/
	if (!st.getItem('alertsFarm')) st.setItem('alertsFarm', '0|0|0|30');

	//меню настроек
	var divSettings = doc.createElement('div');
	divSettings.setAttribute('style', 'position: absolute; visibility: hidden; top: 0; left: 0; padding: 10px; border: 1px solid #056A0C; background: #DDECDE;');
	divSettings.innerHTML = '<div style="text-align: center; color: #0000ff; margin-bottom: 10px; border: 1px solid #000000;">Звуки</div>';
	divSettings.appendChild(createSelect('sel1'));
	divSettings.innerHTML += 'Пора поливать<br>';
	divSettings.appendChild(createSelect('sel2'));
	divSettings.innerHTML += 'Пора собирать<br>';
	divSettings.innerHTML += '<hr style="opacity: 0.2;">';
	divSettings.appendChild(createSelect('sel3', true));
	divSettings.innerHTML += '<input style="border: 1px solid #000000;" type="button" id="listen" value="Прослушать">' +
		'<hr style="opacity: 0.2;"><input type="checkbox" id="chk"> повторять каждые ' +
		'<input type="text" id="inp" size="2" maxlength="3"> сек. <div style="text-align: center; margin-top: 15px;">' +
		'<input style="border: 1px solid #0000ff;" type="button" id="accept" value="Принять">&nbsp;&nbsp;&nbsp;&nbsp;' +
		'<input style="border: 1px solid #ff0000;" type="button" id="close" value="Закрыть"></div>';
	doc.body.appendChild(divSettings);

	//кнопа настроек
	var linkSettings = doc.createElement('a');
	linkSettings.setAttribute('style', 'color: #0000ff; cursor: pointer; padding-left: 20px;');
	linkSettings.innerHTML = 'Настройки';
	var b = doc.getElementsByTagName('b');
	for (i = 0; i < b.length; i++) {
		if (b[i].innerHTML == 'Ваша ферма') {
			b[i].parentNode.parentNode.parentNode.appendChild(linkSettings);
			break;
		}
	}

	//handlers
	linkSettings.addEventListener('click', showHideMenu, false);
	getObj('listen').addEventListener('click', function() {playSound(getObj('sel3').value);}, false);
	getObj('chk').addEventListener('click', function() {getObj('inp').disabled = !this.checked;}, false);
	getObj('close').addEventListener('click', function() {divSettings.style.visibility = 'hidden';}, false);
	getObj('accept').addEventListener('click', function() {
			var flag = getObj('chk').checked;
			var inpValue = getObj('inp').value;

			//проверка правильности ввода таймаута
			if (flag) {
				try {
					checkInput1(inpValue);
					checkInput2(inpValue);
					checkInput3(inpValue);
				} catch(e) {
					alert(e.name + ': ' + e.message);
					return;
				}
			}

			var str = getObj('sel1').value + '|' + getObj('sel2').value + '|';
			str += flag ? '1|' : '0|';
			str += inpValue;
			st.setItem('alertsFarm', str);
			root.location.reload();
		}, false);

	//оповещения
	var target, action;
	var a = doc.getElementsByTagName('a');
	for (var i = 0; i < a.length; i++) {
		if (/ferma\.php\?x=/.test(a[i].href) && (/полить/.test(a[i].innerHTML) || /собрать/.test(a[i].innerHTML))) {
			action = /полить/.test(a[i].innerHTML) ? 0 : 1;
			target = a[i].parentNode;
		}
	}

	var reg = /\(через\s(\d+)/;
	if (!target || !reg.test(target.innerHTML)) return;

	var time = +reg.exec(target.innerHTML)[1];

	var data = st.getItem('alertsFarm').split('|');
	var sound = action ? data[1] : data[0];
	var tm = +data[3] * 1000;

	root.setTimeout(function() {
		playSound(sound);
		if (+data[2]) {
			root.setInterval(function() {playSound(sound);}, tm);
		}
	}, time * 60 * 1000);

}());
