// ==UserScript==
// @name			WorkPostGrenadesBroken
// @namespace		using namespace std;
// @description		Окончание работы, осталось времени работать, пришла почта, нет гранаты, имеются сломанные вещи. На все события оповещения звуковые и визуальные.
// @include			http://www.ganjawars.ru/me/*
// @include			http://www.ganjawars.ru/warlog.php?bid=*
// @include			http://www.ganjawars.ru/statlist.php?r=oil*
// @include			http://www.ganjawars.ru/warlist.php*
// @include			http://www.ganjawars.ru/wargroup.php*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {

	var soundSms = 10;	//звук при получени почты либо посылки (0 - без звука)
	var soundWork = 15;	//звук при окончании работы (0 - без звука)

//------------------------------------------------------------------------------
	function playSound(sound) {
		if (!sound) return;
		var fl = doc.getElementById('work_flashcontent');
		if (!fl) {
			fl = doc.createElement('div');
			fl.id = 'work_flashcontent';
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
	function ajaxQuery(url, onsuccess, onfailure) {
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open('GET', url, true);
		xmlHttpRequest.send(null);

		var timeout = setTimeout(function() {
			xmlHttpRequest.abort();
			//alert('WorkPostGrenadesBroken: Превышено время ожидания ответа сервера...');
		}, 10000);

		xmlHttpRequest.onreadystatechange = function () {
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
	function getData(ind) {return st.getItem('WorkPostGrenadesBroken').split('|')[ind];}
//------------------------------------------------------------------------------
	function setData(ind, value) {
		var temp = st.getItem('WorkPostGrenadesBroken').split('|');
		temp[ind] = value;
		st.setItem('WorkPostGrenadesBroken', temp.join('|'));
	}

//------------------------------------------------------------------------------
	function start() {
		ajaxQuery('http://www.ganjawars.ru/me/', function(req) {
			var testSms, testGrenades, testBroken;
			divContent.innerHTML = req.responseText;
			var content;

			//если в пути
			if (/Вы находитесь в пути из/.test(divContent.innerHTML)) {
				span.innerHTML = '<span style="color: #0000FF;">[вы в пути]</span>';
				root.setTimeout(function() {start();}, 30000);
				return;
			}

			//если в бою
			if (/Идёт бой \/\//.test(divContent.getElementsByTagName('title')[0].innerHTML)) {
				span.innerHTML = '<span style="color: #0000FF;">[вы в бою]</span>';
				root.setTimeout(function() {start();}, 30000);
				return;
			}

			//проверка на новое письмо или посылку
			var divs = divContent.getElementsByTagName('div');
			for (var i = 0; i < divs.length; i++) {
				if (divs[i].getAttribute('align') == 'center') {
					content = divs[i].innerHTML;
					var sms = /\/i\/sms\.gif/.test(content);
					var woodbox = /\/i\/woodbox\.gif/.test(content);
					if (sms || woodbox) {
						if (sms) {
							testSms = 1;
						} else {
							testSms = 2;
						}

						if (getData(0) == '0') {
							setData(0, '1');
							playSound(soundSms);
						}
					} else {
						setData(0, '0');
					}
					break;
				}
			}

			var linkObj, items; //ссылка на объект, где работаем или работали в последний раз, и ссылки на одетые предметы
			var td = divContent.getElementsByTagName('td');
			for (i = 0; i < td.length; i++) {
				//ищем ссылку на объект
				if (!linkObj && td[i].getAttribute('bgcolor') == '#f0fff0' && td[i].getAttribute('style') == 'font-size:8pt') {
					content = td[i].innerHTML;
					var links = td[i].getElementsByTagName('a');
					linkObj = /object\.php\?id=/.test(links[0].href) ? links[0].href : links[1].href;
				}
				//поиск ссылок на одетые предметы
				if (td[i].getAttribute('bgcolor') == '#f0fff0' && td[i].getAttribute('valign') == 'bottom') {
					items = td[i].getElementsByTagName('a');
					break;
				}
			}

			var time;
			if (/[Вы сможете устроиться на|осталось][^\d]*\d+ минут/i.test(content)) {
				time = +/(\d+) минут/i.exec(content)[1];
				time = (!time) ? 1 : time;
			} else if (/Последний раз вы работали/i.test(content)) {
				time = 0;
			} else if (/Вы работаете на/i.test(content)) {
				time = 1;
			}

			//проверка на сломанные вещи в рюкзаке
			var a = divContent.getElementsByTagName('a');
			for (i = 0; i < a.length; i++) {
				if (/Требуется ремонт/.test(a[i].innerHTML)) {
					testBroken = true;
					break;
				}
			}

			//проверка на грену
			if (items && items.length) {
				for (i = 0; i < items.length; i++) {
					if (testGrenades) break;
					for (var j = 0; j < grenades.length; j++) {
						if (~items[i].href.indexOf(grenades[j])) {
							testGrenades = true;
							break;
						}
					}
				}
			}

			if (time > 0) {
				span.innerHTML = '[<span style="color: #0000FF">' + time + '</span> мин <a href="' + linkObj +
					'"><img src=' + factoryImg + '></a>]';
				span.innerHTML += addContent(testSms, testGrenades, testBroken);
				setData(1, '0');
				root.setTimeout(function() {start();}, 90000);
			} else if (time == 0) {
				span.innerHTML = '[<a href="' + linkObj + '"><img src=' + factoryImg_red + '></a>]';
				span.innerHTML += addContent(testSms, testGrenades, testBroken);
				if (getData(1) == '0') {
					setData(1, '1');
					playSound(soundWork);
				}
				root.setTimeout(function() {start();}, 30000);
			}
		},
		function() {
			span.innerHTML = '[Ошибка ответа сервера...]';
			root.setTimeout(function() {start();}, 30000);
		});
	}
//------------------------------------------------------------------------------
	function addContent(mess, gren, broken) {
		var str = '';
		if (mess == 1) {
			str += ' [<a href="http://www.ganjawars.ru/sms.php"><img src=' + smsImg + '></a>]';
		} else if (mess == 2) {
			str += ' [<a href="http://www.ganjawars.ru/items.php"><img src=' + woodboxImg + '></a>]';
		}

		if (!gren) str += ' [<a href="http://www.ganjawars.ru/items.php"><span style="color: #FF0000; ' +
			'font-weight: bold;">Грена</span></a>]';
		if (broken) str += ' [<a href="http://www.ganjawars.ru/workshop.php"><span style="color: #FF0000; ' +
			'font-weight: bold;">Слом</span></a>]';
		return str;
	}
//------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var st = root.localStorage;

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiеm рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'WorkPostGrenadesBroken:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	// localStorage: [0] - звук при получении почты, [1] - звук при окончании работы
	if (!st.getItem('WorkPostGrenadesBroken')) st.setItem('WorkPostGrenadesBroken', '0|0');

	var doc = root.document;
	var divContent = doc.createElement('div');
	//картинки
	var factoryImg = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%12%00%00%00%10%08%02%00%00%00%94d%B8%0B%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%1AtEXtSoftware%00Paint.NET%20v3.5.100%F4r%A1%00%00%00eIDAT8Oc%7C%F6%FF9%03%D1%40j%AA%04P%ED%B3%EC%17%0C%40m%C4%23%86)%FF%81%08d%13%F1z%40%AA%07Z%1B%DC%01%C8%8E%C1%C5%06%F9%0D%A2%01%E1n%24.%B28%8AJd%3D%24%B0IP%8A%EC%0A4g%40%5C%02%8F%1546%C2%0EJ%B5%91%E6ZJm%C3%E5%1Fdq%2C~%23%D3%91%24i%03%00%B2%A8%3AX%1A%E5U7%00%00%00%00IEND%AEB%60%82";
	var factoryImg_red = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%12%00%00%00%10%08%02%00%00%00%94d%B8%0B%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%1AtEXtSoftware%00Paint.NET%20v3.5.100%F4r%A1%00%00%00%60IDAT8Oc%7C%F6%FF9%03%D1%40%92W%13%A8%F6%F9%E7%EB%0C%40m%C4%A3%FF%3C%02%40%04%B2%89x%3D%40%95%03%AE%0D%EE%00d%C7%E0b%83%FC%06%D1%00%D7%86%CCE%16GV%C9%80U%11AA%8A%B5%C1c%02%123%10%84%C6%86%BB%02a%1B%99%DA%08%FA%07Y%01%C5%B6%D1%D7%91%24%F9%0D%00%E0%18%F1)%06%A0%BA%A1%00%00%00%00IEND%AEB%60%82";
	var smsImg = "data:image/gif,GIF87a%12%00%0B%00%B3%00%00%FF%FF%FF%CC%CC%CCgf%00fffF%D5F%406%00%2B%A8%2B%26%8D%26%25%CB%25%1C%BC%1C%0Dk%0D%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%2C%00%00%00%00%12%00%0B%00%00%0430%C8I%AB%04%C1%E8%CD%BB%19%D9%20z%06%81%24%CA%97%91%9B%22%08%87%CA%B6E%11%83%B3%A6%24%A8%FC%89%C0Q%07%97%1B%AE%82A%0F%B1%B8%19%00%90Ph%04%00%3B";
	var woodboxImg = "data:image/gif,GIF89a%0B%00%0B%00%E6%02%00%FF%E6%B1%C5%8CC%FF%FF%FF%D0%9Db%F5%D6%A4%CB%BB%A1%FB%FF%F9%A2w%5C%CA%BC%A1%F9%CC%91%A2x%5D%F8%CB%92%AB%A1%8B%F9%F9%FA%F2%C6%91%EA%C0%91%EB%C2%96%81wc%84vg%BC%BB%B6%BE%A8%92%B6%9F%89%DD%AAs%DB%ABv%9A%7Bc%DC%ADq%FD%FF%FF%AF%A3%9C%CB%9Fa%ED%BF%8A%A9%A1%99%CC%96R%ED%EE%ED%EF%EB%E1%CB%99Z%D5%C2%98%BC%B9%B0%ED%D0%A0%FE%FF%F9%CE%A4d%F8%DE%AD%B1%A8%A8%F7%D8%AE%F6%CE%9A%F3%F6%F8%E8%CB%8F%B6%86%40%EF%C7%98%FB%D9%A5%F1%FF%F7%8CbC%93%80%5E%BD%839%84yf%99uV%A7%9F%9A%AF%82A%F0%ED%F3%88~r%FB%F8%FF%ED%CD%99%BA%AD%91%F4%D5%A9%A5%9C%98%D4%9BV%AC%A6%A1%C8%90S%AF%A2%A2%F9%DE%B8%B6%83F%F6%F7%F6%EB%BC~%8D%88w%B8%A3%8E%E7%C2%A1%F0%F0%F0%F2%EE%E8%E9%F0%E9%EC%BE%90%8DuZ%CD%B4%8F%C6%AD%89%94y%60%EF%C6%9B%F8%FD%FF%A6%9F%96%F1%C6%95%83wj%AC%88Z%CA%96%5D%F5%F3%F6%A9%A5%9E%ACxA%D4%BE%96%F3%D4%A4%D1%AF%81%F3%C7%83%FB%D7%A3%F7%D1%9F%FB%D7%99%7Bvn%FA%FF%FF%E7%C0%9A%EA%BD%8C%F5%FD%FF%ED%CA%9A%FA%FE%F1%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%F9%04%01%00%00%02%00%2C%00%00%00%00%0B%00%0B%00%00%07s%80%02%82%029)d%24F%83%02!%5B%3D_%3C%23%0C%13%2CZC%14Q-%60Gc%25%08%1EH%5D%0E%0FgSJ%2F%1DN%0A%11%00%00%2BV%10f%16B%176W%3E%0B%00('%01%40%1F%01R%12%ACi*8%03%01%01%19%075%04%09%000.%01%03%22%1C2%3APb%5Ea4%03YX37K%1BI%05DE%5C%18UM%83LA%15O%3F%20%83%81%00%3B";

	//массив гранат
	var grenades = ['id=anm14','id=m34ph','id=rgd','id=old_rgd5','id=grenade_f1', 'id=lights','id=rkg3','id=mdn',
		'id=rgo','id=rgn','id=emp_ir','id=fg3','id=emp_s','id=m67','id=m3','id=hg78','id=hg84','id=fg6',
		'id=grenade_dg1','id=fg5','id=molotov','id=hellsbreath','id=napalm','id=fg7','id=ghtb', '9y_tort',
		'2013_snowball','2014_'];

	var nobr = doc.getElementsByTagName('nobr')[0];
	//костыль для хрома против срабатывания на ауте
	if (/GPS:/.test(nobr.innerHTML)) return;
	nobr.appendChild(doc.createTextNode(' | '));
	var span = doc.createElement('span');
	nobr.appendChild(span);

	start();

}());
