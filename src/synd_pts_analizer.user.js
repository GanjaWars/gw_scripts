// ==UserScript==
// @name			Synd PTS Analizer
// @namespace		using namespace std;
// @description		Анализ расхода PTS (кнопка на странице онлайна любого синдиката).
// @include			http://www.ganjawars.ru/syndicate.php?id=*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {
//--------------------------------------------------------------------------------------------------
	function ajaxQuery(url, onsuccess, onfailure) {
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open('GET', url, true);
		xmlHttpRequest.send(null);

		var timeout = setTimeout(function() {
			xmlHttpRequest.abort();
			alert('Synd PTS Analizer: Сервер не отвечает...');
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
		}
	}
//--------------------------------------------------------------------------------------------------
	function getPagesData(ind){
		getObj('analizePTS_counter').innerHTML = '(' +  (ind + 1) + ')';
		url = 'http://www.ganjawars.ru/syndicate.log.php?id=' + syndID + '&ptslog=1&page_id=' + ind;
		ajaxQuery(url, function(xml) {
			spanContent.innerHTML = xml.responseText;

			var lines = [];
			var nobrs = spanContent.getElementsByTagName('nobr');
			for (var i = 0; i < nobrs.length; i++) {
				if (/\d+\.\d+\.\d+/.test(nobrs[i].innerHTML)) {
					lines[lines.length] = nobrs[i].lastChild.textContent;
				}
			}

			var reg, rez, obj;
			for (i = 0; i < lines.length; i++) {
				var str = lines[i].replace(/^\s*/, '');
				reg = /(.*) купил.* за (\d+) PTS/i;
				if (reg.test(str)) {
					rez = reg.exec(str);
					obj = getObjRers(rez[1]);
					if (/чип/i.test(str)) {
						addData(obj, 'chip', +rez[2]);
					} else {
						addData(obj, 'gren', +rez[2]);
					}
					continue;
				}

				reg = /выдал значок персонажу (.*) \((\d+) PTS/i;
				if (reg.test(str)) {
					rez = reg.exec(str);
					obj = getObjRers(rez[1]);
					addData(obj, 'sign', +rez[2]);
					continue;
				}

				reg = /Продлено звание для (.*) за (\d+) PTS/i;
				if (reg.test(str)) {
					rez = reg.exec(str);
					obj = getObjRers(rez[1]);
					addData(obj, 'rank', +rez[2]);
					continue;
				}

				reg = /выдал звание .* персонажу (.*) \((\d+) PTS/i;
				if (reg.test(str)) {
					rez = reg.exec(str);
					obj = getObjRers(rez[1]);
					addData(obj, 'rank', +rez[2]);
				}
			}

			if (ind > 0) {
				root.setTimeout(function() {getPagesData(--ind);}, 1000);
			} else {
				sort();
			}
		}, function() {
			alert('Synd PTS Analizer: ошибка ответа сервера...');
			getObj('loadingPTS_span').style.visibility = 'hidden';
			getObj('analizePTS_txt').disabled = false;
			getObj('analizePTS_go').disabled = false;
		});
	}
//--------------------------------------------------------------------------------------------------
	function getObjRers(nik) {
		for (var i = 0; i < Pers.length; i++) {
			if (Pers[i].name == nik) return Pers[i];
		}

		return Pers[Pers.length] = {name: nik, gren: 0, chip: 0, sign: 0, rank: 0, all: 0};
	}
//--------------------------------------------------------------------------------------------------
	function addData(obj, prop, val) {
		obj[prop] += val;
		obj.all += val;
		switch (prop) {
			case 'gren': {allGren += val; break;}
			case 'chip': {allChip += val; break;}
			case 'sign': {allSign += val; break;}
			case 'rank': allRank += val;
		}
		ALL += val;
	}
//--------------------------------------------------------------------------------------------------
	function outRezult(id) {
		table.removeAttribute('class');
		table.setAttribute('style', 'border-collapse: collapse; background: #D0EED0;');

		var str = '<tr style="font-weight: bold;">' +
			'<td class="wb1">Персонаж</td>' +
			'<td class="wb1"><img id="gren" style="cursor: pointer; margin: 2px;" src="' + img_gren + '"></td>' +
			'<td class="wb1"><img id="chip" style="cursor: pointer; margin: 2px;" src="' + img_chip + '"></td>' +
			'<td class="wb1"><img id="rank" style="cursor: pointer; margin: 2px;" src="http://images.ganjawars.ru/img/rank5.gif"></td>' +
			'<td class="wb1"><img id="sign" style="cursor: pointer; margin: 2px;" src="http://images.ganjawars.ru/img/synds/' + syndID + '.gif"></td>' +
			'<td class="wb1"><span id="all" style="color: #008000; cursor: pointer;">Всего</span></td>';

		for (var i = 0; i < Pers.length; i++) {
			str += '<tr><td class="wb2"><a target="_blank" href="http://www.ganjawars.ru/search.php?key=' + Pers[i].name +
			'" style="text-decoration: none;">' + Pers[i].name + '</td><td class="wb1">' + Pers[i].gren + '</td>' +
			'<td class="wb1">' + Pers[i].chip + '</td><td class="wb1">' + Pers[i].rank + '</td>' +
			'<td class="wb1">' + Pers[i].sign + '</td><td class="wb1" style="color :#008000;">' + Pers[i].all + '</td>';
		}

		str += '<tr style="font-weight: bold;"><td class="wb1" style="color: #0000FF;">Всего</td>' +
			'<td class="wb1" style="color: #0000FF;">' + allGren + '</td><td class="wb1" style="color: #0000FF;">' +
			allChip + '</td><td class="wb1" style="color: #0000FF;">' + allRank +
			'</td><td class="wb1" style="color: #0000FF;">' + allSign + '</td><td class="wb1" style="color: #FF0000;">' +
			ALL + '</td>';
		table.innerHTML = str;

		getObj(id).parentNode.style.background = '#A0EEA0';

		getObj('gren').addEventListener('click', function() {sort(this.id);}, false);
		getObj('chip').addEventListener('click', function() {sort(this.id);}, false);
		getObj('rank').addEventListener('click', function() {sort(this.id);}, false);
		getObj('sign').addEventListener('click', function() {sort(this.id);}, false);
		getObj('all').addEventListener('click', function() {sort(this.id);}, false);
	}
//--------------------------------------------------------------------------------------------------
	function sort(prop) {
		prop = prop || 'all';

		var buff;
		for (var j = 0; j < Pers.length - 1; j++) {
			for (var k = 0; k < Pers.length - 1; k++) {
				if (Pers[k + 1][prop] > Pers[k][prop]) {
					buff = Pers[k];
					Pers[k] = Pers[k + 1];
					Pers[k + 1] = buff;
				}
			}
		}

		outRezult(prop);
	}
//--------------------------------------------------------------------------------------------------
	function getObj(id) {return doc.getElementById(id);}
//--------------------------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	if (!/page=online/.test(root.location.href)) return;
	var doc = root.document;
	var spanContent = doc.createElement('span');
	var img_loading = "data:image/gif,GIF89a%0D%00%0D%00%A5%00%004%9E4%A4%EE%A4d%CEd%D4%F6%D4%84%E6%84%BC%EA%BC%5C%BE%5C%84%CE%84D%AED%EC%FE%EC%9C%FE%9C%E4%FA%E4%BC%FE%BCD%A6D%7C%DE%7C%8C%D6%8C%AC%FE%AC%D4%FE%D4%8C%F6%8CL%B6L%3C%A6%3Ct%D2t%CC%F2%CC%7C%C6%7C%FC%FE%FC%CC%FE%CC%94%DA%94%B4%FA%B4%3C%A2%3C%B4%F6%B4l%D6l%DC%FA%DC%8C%EE%8C%C4%EA%C4%5C%C6%5C%8C%D2%8CL%B2L%F4%FE%F4%A4%FE%A4%E4%FE%E4%C4%FE%C4L%AAL%7C%E2%7C%8C%DA%8C%DC%FE%DC%94%FA%94T%BAT%B4%FE%B4%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%FF%0BNETSCAPE2.0%03%01%00%00%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%00%06_%40%980tIQN%98%92PX%1A!%1A%1C%40%04C%5D%3EH%A4ChQ%A2V-%06Wa)%F4bV%06%0Dy%E9%AD%08%06%EB2%D5%E3Y%C4a%5D%8C%C3%F1%B9%E7%03*%1D~I%11%20%12%11k%09%8AB%1B-%0A('%8A'%2C%91L%0C%26%10%2F%0C(%19%94JK%2C(%9A%9D%09KA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%854%9E4%9C%DE%9Cd%CEd%DC%F2%DC%9C%FE%9Cd%CAdL%B2L%7C%E6%7C%BC%FE%BC%EC%FE%ECD%AAD%C4%E6%C4%8C%D2%8C%D4%FA%D4%AC%FA%AC%5C%BE%5C%8C%F2%8C%CC%F6%CC%E4%FE%E4D%A6D%9C%E6%9Ct%DEt%7C%C2%7CT%BAT%FC%FE%FCL%AEL%C4%EE%C4%84%E2%84%DC%FE%DC%B4%FE%B4%3C%A2%3Cl%D2l%A4%FE%A4T%B6T%8C%EE%8C%C4%FE%C4%F4%FE%F4D%AED%94%DA%94%D4%FE%D4%AC%FE%AC%5C%C2%5C%94%FA%94%CC%FE%CC%A4%E6%A4%84%CA%84%CC%EE%CC%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06a%C0%97%D0%D5%0A)2%96%84PH2%5D%0C%8A%89%07%C0%C1%2CM%A9%0B%C35X%200%E0W%A3P%D0%2C%85%600%E5%C3%3A%2F%D3%87%CA%C0%CD%04o%0EJ%3A%09%0C%11q%E8%2Fi%0E*%08%80i%1C%04%04%7Fg%7Ba%08(('%12%24%09%95%7BL%23%1D%08%23%2B%1C%12%09%24n%12'%2B%9D%9FKA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%85%3C%9E%3C%A4%EA%A4l%D2l%D4%FA%D4%7C%C6%7C%C4%EA%C4L%B6L%84%EE%84%EC%FE%EC%8C%D6%8C%BC%FE%BC%5C%C2%5C%A4%FE%A4D%AAD%E4%FE%E4t%DEt%D4%FE%D4%C4%F2%C4%9C%FE%9Cd%CAd%3C%A6%3C%AC%EE%ACT%B6T%94%F2%94%FC%FE%FC%94%DE%94%CC%FE%CCd%C2d%B4%FE%B4%3C%A2%3C%A4%EE%A4t%DAt%DC%F6%DC%8C%CE%8C%CC%EA%CC%F4%FE%F4%C4%FE%C4%AC%FE%ACL%B2L%7C%E6%7C%DC%FE%DC%CC%F2%CCT%BAT%94%F6%94%9C%E2%9Cd%C6d%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06c%40%970%95X%98%2C%04%91P8b%B5%16%16S%A3%01%08-%03%82IF%04%12%11%00%0D%8Ck%F0%F9%14%96B%0D%063%F2%9C*%E8%E5%1As9%80%E2%C2%F9j%E5%C0%BBFk%12%12(~s%0A%0C%24%85k(%25%1C%7Dh%80k.%1A%1C%24(%08%23%99sL%10%24%1A%10%97%91q%08((%0E%0E%99KA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%854%9E4%AC%DE%AC%D4%F2%D4l%D6l%9C%FE%9Cd%C2d%BC%FE%BC%EC%FE%EC%84%EE%84L%B2L%D4%FE%D4%AC%F2%AC%84%CE%84%CC%EE%CC%84%E6%84%AC%FA%AC%9C%E6%9Cd%CEd%CC%F6%CC%5C%BE%5C%E4%FE%E4%B4%FA%B4D%AAD%DC%F6%DC%7C%E2%7C%FC%FE%FC%94%FE%94%DC%FA%DC%8C%CA%8C%A4%E6%A4%3C%A2%3C%D4%F6%D4t%DAt%A4%FE%A4d%C6d%C4%FE%C4%F4%FE%F4%8C%F2%8CT%B6T%94%DE%94%AC%FE%ACl%CEl%CC%FE%CC%5C%C2%5C%B4%FE%B4%DC%FE%DC%8C%CE%8C%A4%EA%A4%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06c%40%98%F0sJ%AD%0A%8C%86PHz%0D%22%A2I%22aq%91%84%0B%0C%A8%D3%D84%18%16%0F%07%A6%408%24Ka%C0%03%D8TJ%95%F4%12%82%C9%104%1493%93%09%85%0Ez0%24%7C((yz%7C%19%23%2C%0A%81%89%14%06%23%87K%89%19d**%14%24%9B%95L-%0A-%9A%83%7Cr%07%07%A2%A4BA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%854%9E4%9C%EA%9Cl%D6l%D4%F6%D4T%BET%C4%E6%C4%84%EA%84%EC%FE%ECL%AEL%9C%FE%9C%8C%D2%8C%E4%FA%E4%BC%FE%BCl%CElD%A6D%7C%E6%7C%D4%FE%D4%94%FA%94T%B6T%AC%F6%AC%B4%E2%B4%7C%DA%7Cd%CEd%CC%EE%CC%FC%FE%FCT%B2T%94%D6%94%CC%FE%CC%AC%FE%AC%3C%A2%3Ct%DEt%D4%FA%D4%5C%C6%5C%8C%F2%8C%F4%FE%F4L%B2L%8C%D6%8C%E4%FE%E4%C4%FE%C4%7C%C6%7CD%AAD%DC%FE%DC%94%FE%94%AC%EE%AC%CC%F2%CC%B4%FE%B4%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06d%40%97%F0%13%A8X%1A%24%96P(%9A%18%3C%82%06%88%20%D1%88%84%AD%90a5%18%5C4%23%94%C6%95JD6K!%05%E5%B80%12%8C%F4%F2%D49q8%25%B9%B0%00%C8%B4Z%07z.%22-%25%0C%0C%81z%22%18%18%10%26)%82%8C%18%07%1B%10%89K%92%18.%25)%25%81%8B%99L%25%9E%A0%92r%22%A5%8CKA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%854%9E4%9C%DE%9Cl%D2l%D4%F2%D4d%CAd%9C%FE%9C%7C%E6%7CT%B6T%EC%FE%EC%BC%FE%BC%84%CE%84%D4%FA%D4L%AEL%AC%F6%AC%E4%FA%E4%94%F6%94D%AED%BC%EA%BCt%DEt%5C%C2%5C%94%DA%94%DC%FA%DC%AC%FE%ACD%A6D%8C%EA%8C%FC%FE%FC%CC%FE%CCT%B2T%CC%EE%CC%7C%DA%7C%94%E2%94%3C%A2%3C%D4%F6%D4%84%CA%84%A4%FE%A4T%BAT%F4%FE%F4%C4%FE%C4%D4%FE%D4L%B2L%B4%FA%B4%E4%FE%E4%94%FA%94%C4%EA%C4%5C%C6%5C%94%DE%94%DC%FE%DC%B4%FE%B4%8C%EE%8C%7C%DE%7C%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06d%40%99%D0%D50%C4%3A%9E%81PHJ%3C%60F%01%81%10%20%09K%05%15j%E1%00%B5%26%23%8A%2C%25%12%99%96%C2%C8%E9%C4)%BD4%E8%A5%02%12*%25Rq%E1%EA%B2)%95%10y2%03%1F%17%1A%1A%80y%0B%00%0C)%26xy%19%8E%08))Vh%19%98%192%08%08%24%24%19%9E%99%9AL%9F%A2%98q%A5%A2KA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%854%9E4%9C%DE%9C%D4%F2%D4l%CEl%9C%FA%9C%5C%BA%5C%7C%E6%7C%EC%FE%EC%BC%FE%BCL%B2L%BC%EE%BC%D4%FA%D4%8C%D2%8C%AC%FE%AC%7C%C6%7C%94%F6%94%3C%A6%3Cl%D6ld%CAd%8C%EA%8C%CC%EA%CC%E4%FE%E4%A4%EE%A4%A4%FE%A4%5C%C2%5C%FC%FE%FC%CC%FE%CCT%BAT%C4%EA%C4%DC%FE%DC%3C%A2%3C%A4%E6%A4%DC%F6%DCl%D2l%9C%FE%9C%5C%BE%5C%84%EE%84%F4%FE%F4%C4%FE%C4T%B2T%D4%FE%D4%8C%D6%8C%B4%FE%B4D%AADt%DAt%8C%EE%8C%C4%EE%C4%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06d%C0%97%B0%A3%22%B4%26%16%81PX2%5DD%0F%92%81%15%F9%94%84%1A%D5%05%D1%A9%2C%3E%03I%E0UA%A8*K%A1%023%12%A0L%A8%F42%B5a%A04%07%B9%D0%95(%A0%3AWz%20%2B%09%15%80z%2F%0A%1E'%07%8D%88%0E%1E%0E%25y%19r%19!%00%14%2F%25%19%9D%25%9C%9D%19yB%A1%A5%9D%96%A6%95BA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%85%3C%A2%3C%AC%DE%ACl%D2l%D4%F6%D4l%CAl%AC%F2%ACT%BAT%84%EE%84%C4%F2%C4%EC%FE%EC%94%D6%94L%B2L%C4%EA%C4%E4%FE%E4%84%CA%84%A4%FE%A4d%CAdD%AAD%7C%E2%7C%D4%FE%D4d%BEd%9C%FA%9C%BC%FE%BCD%A6D%AC%EA%AC%5C%C2%5C%FC%FE%FC%8C%CE%8C%B4%FE%B4%CC%FE%CC%3C%A6%3Ct%DAt%DC%F6%DCl%CEl%AC%F6%AC%5C%BE%5C%8C%F6%8C%F4%FE%F4%94%DE%94%CC%EE%CC%84%CE%84%AC%FE%AC%7C%E6%7C%DC%FE%DC%9C%FE%9C%C4%FE%C4%AC%EE%AC%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06b%C0%97%B0%D1J%B1*%A2%95PX%9Ap%8C%2C%D2A%E5*%09W%16Kg%95X%15%24%1F%CC%2B%D1i5%96B%84%204XM%CEh%A1%09%A2hp%E3%C2S%86%D0HX%F1%20%06%06%25%09xi%0B%23%25%1A%1A%86%0E%11%0E%8A%8Bq%01%00%17'%2F%8B%8B%25%91%00%00%0EK%99%A1)%0A%7FB%A1%99KA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%85%3C%9E%3C%A4%EA%A4t%D6t%D4%FE%D4l%CAl%B4%F2%B4%84%EA%84T%B6T%CC%F2%CC%8C%D6%8C%EC%FE%ECD%AAD%7C%DE%7C%84%CE%84%A4%FE%A4%BC%FE%BC%CC%EA%CC%E4%FE%E4%8C%F6%8Cd%C6d%B4%FA%B4%CC%FA%CC%3C%A6%3C%84%D2%84%DC%FA%DC%7C%C6%7C%9C%E6%9C%FC%FE%FCL%B2L%3C%A2%3C%B4%E2%B4%7C%D6%7Cl%CEl%8C%F2%8C%5C%BE%5C%94%D2%94%F4%FE%F4L%AEL%7C%E2%7C%8C%CE%8C%AC%FE%AC%C4%FE%C4%CC%EE%CC%94%FE%94d%CAd%B4%FE%B4%CC%FE%CC%DC%FE%DC%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06e%40%98P%E1z%A0P%8F%97PHz%A5%1E-%87c%25%A1%90%84%91%81k%10Q%BCZ!C%01%D6%1C(%96%C2%8A%89a%EE%A2%97%1A%81F%A1%B8%BEa%08%D6%87%B4%B9%0B1%2C%2C%1B%83~*%22%04%83%7Dw%17%1C%09%89%8AK%1E%0B%1C%080%8F%24%24%11%19%16%0B%23K%8F%1B!%00%1D'vB%8F%0A%0D%10KA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%854%9E4%B4%E6%B4d%CEd%D4%F2%D4%C4%EA%C4%84%E6%84%7C%C6%7CL%B6L%94%D6%94%EC%FE%EC%9C%FE%9CD%AED%D4%FA%D4%BC%FE%BCt%DAt%AC%F6%AC%E4%FA%E4%8C%F6%8C%5C%C6%5C%84%E2%84D%A6D%7C%D6%7C%CC%F2%CC%5C%BE%5C%FC%FE%FCL%AEL%DC%FE%DC%CC%FE%CC%AC%FE%AC%3C%A2%3C%AC%F2%ACl%D6l%CC%EE%CC%8C%EE%8C%84%CA%84T%BAT%94%DA%94%F4%FE%F4%A4%FE%A4%D4%FE%D4%C4%FE%C4%7C%DE%7C%E4%FE%E4%94%FA%94%94%DE%94L%B2L%B4%FE%B4%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06d%C0%970%A1A5%1A(%95PXR%9D6F%97%C9%D4(%0DU%1AU%22%A1B)V%8D%E1v)%3CEB%1A%CC%CBJ%16%3E%0A%1E%0C%86%DDf8%26r%3AY%F5q%C8%D5m%2F%16%02%15%7F%81%2F%24%12%2C%7F%80K%01%23%17%03%2F%8C%25%10%04%22-%07%24K%7F%1B%00%1D%14%0B%08zr'%1D%19%06%20KA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%854%9E4%9C%DE%9Cl%CEl%D4%F6%D4%9C%FE%9CT%B6T%84%E6%84%EC%FE%EC%BC%FE%BCD%AAD%BC%EA%BCt%C2t%84%CE%84%E4%FE%E4%AC%FE%AC%5C%C2%5C%94%F2%94%A4%E6%A4%D4%FE%D4L%B2LD%A6D%A4%E2%A4t%DEt%5C%BE%5C%8C%EE%8C%FC%FE%FC%CC%FE%CCL%AEL%CC%EE%CC%B4%FA%B4%3C%A2%3C%9C%E2%9Cl%D6l%DC%F6%DC%A4%FE%A4T%BAT%84%EA%84%F4%FE%F4%C4%FE%C4D%AED%C4%EA%C4%8C%D2%8Cd%CAd%94%FA%94%DC%FE%DC%B4%FE%B4%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06b%40%97%B0%D4%60i4%92%86pIlH4%26DKS%1A%96%0EX%A2%C6!2%B92%E0%E5R%22%22%B0%C0%19%F1%B2%B5%EA%A0%D5B%09%06%02%AE%C2%1B%06%D2%1B%AE%B1%18%F6j%1F%02%11hib%0A*%02%03_%60%08(!()%23%0F%1FK%19%12%00%1E%14'%13%23%01vB%07%0B%1B%14%05%0C%1CKA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%85%3C%9E%3C%A4%E6%A4l%D2l%D4%F2%D4d%C2d%C4%EA%C4%84%EE%84%EC%FE%ECL%B2L%A4%FE%A4%D4%FA%D4%BC%FE%BC%8C%D6%8C%7C%C6%7C%94%FA%94%5C%C2%5C%E4%FE%E4%3C%A6%3C%A4%EE%A4t%DEt%C4%F2%C4T%BAT%DC%FA%DCd%CAd%CC%EA%CC%94%F2%94%FC%FE%FCT%B6T%B4%FE%B4%CC%FE%CC%84%C6%84%3C%A2%3C%AC%EA%ACt%DAt%DC%F6%DCd%C6d%F4%FE%F4L%B6L%AC%FE%AC%D4%FE%D4%C4%FE%C4%94%DA%94%9C%FE%9CD%AAD%AC%F2%AC%7C%E6%7C%DC%FE%DC%CC%EE%CC%94%F6%94%84%CA%84%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06b%40%99PF%82%B8%8E%87%A1PC%3A%1C%5C%A7%0E%EADZj4%C4%E6%09%C5%E9%10%AFX%A5%8Bc%82%80%95CTbqF%CB%5C%AA%C4%B5%EA%86%C0%1Cm%F4%C9%90%C9%2B%25-%2C%60%0Ah%14!!%162%1A%11%001%18%22%2F)%17%02%01C%1E%1F%11%2B%08%15%0F%0F%01tB%05%0D%1B%08%04%0C%03CA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%854%9E4%9C%E6%9C%D4%F6%D4l%CEl%BC%E2%BCd%C2d%84%EA%84%9C%FE%9CL%B2L%EC%FE%EC%84%CE%84%C4%F6%C4%B4%F6%B4%E4%FE%E4t%DEt%BC%FE%BCD%AAD%D4%FE%D4%84%C6%84%5C%BE%5C%AC%FE%AC%AC%EE%AC%C4%EA%C4%8C%F6%8C%FC%FE%FC%94%DE%94%7C%DE%7C%CC%FE%CC%3C%A2%3C%A4%E6%A4%DC%F6%DCt%D6td%C6d%8C%EE%8C%A4%FE%A4T%B6T%F4%FE%F4%8C%CE%8C%CC%F2%CC%B4%FA%B4%C4%FE%C4D%AED%DC%FE%DC%84%CA%84%5C%C2%5C%B4%FE%B4%CC%EE%CC%7C%E2%7C%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06e%40%98%90%84!%91%12%0D%92p%89ib%90%AA%88J%09s%16%8D%8D%C8F%05%236%97%C2%06%EA%D1p%82%97%9B%D6%C6%7C%865(%AD%26%F5%9C8%88%D8g%95%1D%A3%E9%B4a%14%17'%02%00%1C%04g%0B%06!%5C%12%1C%10%25.%1E%26%01%0E%1A%0CB%09%2B%10%08%23%2C%20%03%1F%15s0%16%0A%2C%2C%03%19%02KA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%854%9E4%A4%EA%A4%D4%F6%D4l%CEl%BC%E6%BC%84%E6%84t%BEtL%B6L%EC%FE%EC%84%CE%84%BC%FE%BC%9C%FE%9C%E4%FA%E4D%AAD%CC%EE%CC%B4%F6%B4%D4%FE%D4%7C%DA%7C%8C%F2%8C%5C%C6%5C%94%D6%94D%A6D%CC%EA%CC%5C%BE%5C%FC%FE%FC%8C%D6%8C%CC%FE%CC%AC%FE%AC%3C%A2%3C%AC%EE%AC%DC%FA%DCt%D6t%C4%EA%C4%84%EE%84%84%CA%84T%BAT%F4%FE%F4%8C%D2%8C%C4%FE%C4%A4%FE%A4%E4%FE%E4L%AEL%CC%F2%CC%DC%FE%DC%7C%DE%7C%94%FA%94%B4%FE%B4%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06d%C0%97%90%84)bH%24%A1%D2X%24!P%88%E4%8By%7C%91P%2B%94%D5%A8%14%22%20%1A%04%B7%2B%5C%99%20c2JaZ)%A4d%84%CB%95%E2X%C8%E5%8D%CB%C0%11%E1_%0A'%0A%20%15%0D%04d%1A-%0BZ%09)%07%14*%0C%02%01%12%12%0AC%25%23%17%13%03%1F%2C%05%0Fp%2F%0E%19%03%03%2C%01%02JA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%854%9E4%9C%E2%9Cl%D6l%D4%F6%D4%C4%EA%C4T%BET%8C%EA%8C%EC%FE%EC%8C%D2%8CD%AED%9C%FE%9C%E4%FA%E4%BC%FE%BC%AC%F6%AC%7C%C6%7C%84%E6%84%D4%FE%D4d%CEd%94%FA%94T%B6T%AC%FE%ACD%A6D%7C%DE%7C%CC%F2%CCd%C6d%FC%FE%FC%94%DA%94L%AEL%CC%FE%CC%3C%A2%3C%DC%F6%DC%CC%EE%CC%5C%C2%5C%8C%F2%8C%F4%FE%F4%8C%D6%8C%A4%FE%A4%E4%FE%E4%C4%FE%C4%B4%FA%B4%94%E2%94%DC%FE%DC%94%FE%94%B4%FE%B4%7C%E2%7CL%B2L%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06b%40%97P%94)%16E%C2%A4q%99A%0A%99%C4%CCa%EA%8Af%92%C3R%E9P%82%5C%B1%C2R%AA%94%00%94%C0%C2%03%07%D2%E9x%D0%AE%83%89%B3%A9%7C%E0%25%86%C9%91%40%C09%2B%1C%04-%13%04%60%10%24%14g%1A%05%20%01%03%0B)'*%0A%26C%1A%20%11%02%16%2C!%12%26NB%03%1A%9C%06%0D)IA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%854%9E4%9C%E2%9Cl%D2l%D4%F6%D4%C4%E6%C4t%BEt%7C%E6%7C%EC%FE%ECL%B2L%9C%FA%9C%84%CE%84%E4%F6%E4%BC%FE%BCD%AED%8C%F2%8C%AC%FE%ACt%DEt%D4%FE%D4%84%CA%84%3C%A6%3C%C4%F2%C4d%C6d%8C%EA%8C%FC%FE%FC%5C%C2%5C%A4%FE%A4%94%DA%94%CC%FE%CC%3C%A2%3C%A4%EA%A4l%D6l%D4%FA%D4%F4%FE%F4T%BAT%9C%FE%9C%E4%FE%E4%C4%FE%C4L%AEL%94%FA%94%B4%FE%B4%7C%DE%7C%DC%FE%DC%CC%EE%CCd%CAd%8C%EE%8C%94%DE%94%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06a%40%97%10t)%16A%C2%A4qYL%1E%96D%23%92%00%40%5D%92%C2%EB%01T%E0H%B0%CE%C3%A14Q%81%87%A3T%A3%B18%BB%0E%91T%A8d%3E%1F6%11EH%E3%8E%90R*%18%18%14%60)%0C%0C%07.-%2B%02%1D%1Fi%0C%0F%0F%11C%01%1E(%06%2C%26%22%19%1BHI%03%1D%16%2C%09'%23IA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%85%3C%9E%3C%A4%E6%A4l%D2l%D4%F2%D4%AC%F6%ACl%CEl%84%EE%84%EC%FE%EC%CC%F2%CCT%BAT%8C%DA%8C%D4%FA%D4D%AAD%C4%EA%C4%BC%FE%BC%E4%FA%E4%7C%E2%7C%B4%FE%B4%84%C6%84%9C%FA%9CD%A6D%AC%EE%AC%A4%FE%A4%FC%FE%FC%5C%C2%5C%9C%E2%9C%DC%FE%DC%CC%FE%CC%3C%A2%3C%B4%E2%B4t%DAt%7C%C6%7C%94%F6%94%F4%FE%F4%CC%F6%CC%94%D6%94%D4%FE%D4L%B2L%CC%EE%CC%C4%FE%C4%E4%FE%E4%7C%E6%7C%8C%CE%8C%9C%FE%9C%AC%FE%ACd%C6d%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06b%40%970t)%16C%C2%E1(bl%26%3F%00%CE%B1yq58%9CFrh%FC0T%DB%E41Q2%85%93%A1P%22%F18%BBB%A8C%0B%83p%874(E%2B%E3%D6%90P%08%05%02%22a(%1B%1B%07.%19%1E%10%04%1A%07%1A%1B%0E%0E%1AC%15)%06%20%2B%16%2C%11%24HI%1A%04%13%2B%2C'(IA%00!%F9%04%08%09%00%00%00%2C%00%00%00%00%0D%00%0D%00%854%9E4%A4%EA%A4t%D2t%D4%F2%D4d%C6d%BC%E6%BC%84%EA%84%EC%FE%ECL%B2L%9C%FE%9C%94%D6%94%D4%FA%D4%BC%FE%BCD%AAD%7C%DE%7C%84%C6%84%B4%F6%B4%E4%FA%E4%8C%F6%8CD%A6D%84%D2%84%C4%EE%C4%FC%FE%FC%5C%BE%5C%DC%FE%DC%CC%FE%CC%84%CE%84%AC%FE%AC%3C%A2%3C%AC%F2%ACt%D6t%D4%F6%D4l%CEl%C4%EA%C4%8C%F2%8C%F4%FE%F4T%B6T%A4%FE%A4%94%E2%94%D4%FE%D4%C4%FE%C4L%AEL%7C%E2%7C%84%CA%84%E4%FE%E4%94%FE%94%B4%FE%B4%F5%FF%F5%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%06a%C0%970%A4%19Y%8E%23%A1p%B4%E2%00%12%C7%A8R3%E1%3C%0E%C6%A8%E5UA%A4%0AJ%A1VCR%84%95Q%C2ep%5E%1E%09%04L%FBe%1C%81%40%9F%F9%08k%F2%04%E6%07%2C%07%0B%0E*%19g%07'%18I%1D%06%22.%82%2C'%19'%2CK%1D%12%09%09%1B.%0C(%8Ba%18%0C%1B%9C'%07JA%00%3B";
	var img_gren = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0D%00%00%00%19%08%02%00%00%00e%CE3%A6%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%04gAMA%00%00%B1%8F%0B%FCa%05%00%00%00%20cHRM%00%00z%26%00%00%80%84%00%00%FA%00%00%00%80%E8%00%00u0%00%00%EA%60%00%00%3A%98%00%00%17p%9C%BAQ%3C%00%00%00%1AtEXtSoftware%00Paint.NET%20v3.5.100%F4r%A1%00%00%03%7FIDAT8Oc%BC%F0%EE%02%03%18%3C%BD%F5%82G%80%E7%D5%F3g%17%8E%9D%FB%F1%F5%9B%86%81%96%91%BD%093%2B%0BD%96%01%A8%0E%82f%2CY0y%E1%24C%3D%1D%5DM-%03%3D%03%13C%E3%C8%88%88%E5%3B%97Ad%A1%EAN%3D%3D%3Dw%C5%12%3Bk%1B%3D-M%5DM%0D%0D5UueUWW%CF%CD%A76%A3%A8%3Bt%F3%E8%9EK%07%FA%A6OJ%88M%8B%0A%8B33%B6036%F7%F3%F3%DDwu%1FB%DD%E9g%A7%8F%DD%3F~%E2%E1%C9%EA%86%86%CA%F2%C6%C2%FC%0A33%2B)i%19Q%09%B1%AD%E7%B7%22%D4%AD%DA%B3%A2%B2%B6%26%B7%24%2B%3B%B3%B0%AE%BA%25%2B%B3%D8%C7%3B%40NNQLLr%C9%E6%85%A7%9F%9D%82%BAo%CA%A2%A9.%EE%AE6%EE%A6E%05%15%D5U%8D%E1%A1Q%11%A9%C1%B6%1E%DAf%F6j~%C16A!.%7D%B3%DAA%FE8%FF%F6%7CYW%9E%A7%BF%5BiIuIq%AD%BB%B7%8Bg%BC%B9M%B0%B6%85%B7%8A%BE%A3%9C%B2%9EXrv4%D4%BFs%D6N%C9%2B%C8-.%AC(*%AC%B4%F7%B2v%892%B6%0B%D6%B5%F0T%D5%B5%93V%D0%11%A9%ED(%85%AA%9B%B8%A0--%3D%B3%20%BF47%BB%B0%BE%BD*%22%CF%B3kzmnMlisfFi%CC%A6%E3kA%EAN%3D%3D%19%93%1E%90%94%98%9E%9FW%12%19%11%DD%D0S%9EZ%116ia%FB%EC%15%7Ds%D7L%EA%98Z%BD%E7%D2N%90%BA%ED%E76%A7dGG%84%C7ff%E4%FB%F8%FB%D5t%15%3AE%197N(%8D%CD%F5%CF%AE%8AI%C9%0E%D9we%0FH%DD%D2m%F3%3C%7D%9D%03%FD%C3bb%12%03%22%7D%A7.%EC%F6KvX%BDm%F1%B4E%9D%A9%C5!M%3D%C5%D0p%99%3C%BF3%22%3A%2C%20%20%2C0%20%CC%C9%CB.%24%C3%D31%CC8%AE(%C4%3F%C9%3E%20%CE1%3C%CA%0B%AA%AEeb%95%93%B3k%80_%88%B7W%40TJx%E3%A4%9A%D9%CB%26O_%D2%5D%DB%5B%5C%D4%94%5E%DDX%04UW%D1%98%E7%EC%E8%E6%EB%13%E8%EE%EE%9D%5B%96%D22%A9.%BB%3A%D1%3F%C1%D1)%D0%D4%D2Y%AFeB5T%5DV~%82%8B%B3%87%B3%B3%A7%9D%BD%FD%C4y%FD%2B%B6%ACX%BB%7DED%86%B7%BE%9D%A2%A5%93%DE%A4y%5DPu%AD%BD%95.%AE%EE%1E%EE%BE%CE%AE.95%E9Y%95)QYA%CEA%16%96n%3Avn%C6%EB%0E%AD%04%A9%03%06%5EjA%9CK%90%8DK%80cHb%40Vej%7C%5EX%40%BCGd%86OJqX%5Ey%EC%9EK%3B%40%EAv%9E%DB%EA%EAkk%E3i%E2%18%60%19%98%E0%99X%18%1B%9A%E2%EB%1Ef%1F%99%11%10%93%1D%19%18%E9%7D%FC%C1Q%90%BAuG%D6%D8%BA%9A%989%EBY%7B%1A%BA%87%D9%85%A5%F9yD%D8%DB%FA%98%98%BB%EA%9B%D8i%87E%F9%40%D3%DF%E4%05%FD%E6%0E%FA%86v%EAf.%BA%8E%01%16%9E%11%F66%5EF%A6%CE%DA%86v%1A%FAV%EAY%05%89Pu%DD%D3%5B%8D%AC%B5u%ADT%0D%EC%D4m%BDM%EC%7CLM%9C%B5%F5lT%B5%CD%95%F5%CCTk%DB%CA%A1%EA%CE%3C%3F%D5%D6W%E1%E0e%ACg%ABj%E7mn%ED%09bh%99%2B%A9%1B%2B%E8%99%AA%F6%CF%E8%40%C9Gg_%9CZ%B9g~%D7%94%9A%B2%B6%9C%94%C2%88%F4%B2%D8%92%BA%F4e%9B%E7%9C%7Bu%16%A2%0E%00%0C3%CB%20%A6%5C%D8%ED%00%00%00%00IEND%AEB%60%82";
	var img_chip = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%14%00%00%00%14%08%02%00%00%00%02%EB%8AZ%00%00%00%04gAMA%00%00%B1%8F%0B%FCa%05%00%00%00%1AtEXtSoftware%00Paint.NET%20v3.5.100%F4r%A1%00%00%04%0CIDAT8OU%D2%FBOZW%1C%00%F0%EB%1A%F7C%F7%FF%2C%D9~%13%D0%ADJ%ED%0FV%1B%B3i%DD2S%ED~X7K%13_%1Du%D9%23%A8m%C7%FB%223%A2%B4(%20%A2%13EA%10%E1%A2%80r%11%05%95%FB%E0%3Ex%5CPk%7D-%E9~%18%3B%17%9A%25%FB%9EO%BE9%DFs%EF7'9%E7T%CD%CC%9A%3E%F9%F8%D3%EA%0F%ABoT%DF(UA%10Tz%F7%F7%BB%7FJ%A5%9B%1F%DD%84%AA%C0%80J%1F%94%40*%01%A0%AC%AA*%F1k%10%FF%09La%9D%8E%A2h2%85%B18%C1%92%24%B0%15%08x%DCn%96aX%86%E5%81%C8%B0%FB%20%12%FB%D9%5C%96%2Bpy%8E%03%93%E3%ABcH%A7%833%20%D0X1%14%E2%85%C3%94%CF%87%AD%AD%15wv%0A%3BQ.%1A%E5P4%87F%0F%7C%BE%A4o%23%B3%1B%CB%C4w%E9%C4%3EE%92%DCY%01%EC%0C%83M%B8p%F8%3A%80%94%05x%08%F2%17%82%5C%23%C1%2B%04%B9%0A%06%2F%11%A4%E2%22%08%04%B9%60%90%C1R%C5%B3%22%A4%83a%96%A6%F3H%E0%D2%E5%BAr%BB%FFs%BD%B6v%ED%E1%5D%F1%3C%15%D7%5E%CF%D5%BA%B7%B8%EEe%0E%0F%F9f-%0C'%E2%7B%98%C3q%F1%E7%E2%C5%E2%7B%97%A0%5C%5C%3C%5DX(%CE%CF%9F%2F%3A.%1DK%97K%15%CB%17%CBKy%A73%15C%F3%A7yH%ADQ%AF%7B%3C%DB%06%C3%B9%D9%C2%B3%94Y%ADgf35%3F%7F%B8%B2zb%9B%3B%B7%CE%9E%CF%026%9E%CDF%5B%AD%C8%CA%0A%9D%A3!%18%86%89T%8A%B2%DB%CF%26%0D%C0%DB%C9%C9%8A%D3%89%09%7Ca%01%F5%FB%0B%AFMo%A7%A6%CA%8C%3C%A3%911%99%A2%3E%1F%95%A3%F8%ABb)%8A%9D%B5%9D%AA%D4o%D4%AAS%95%AA%A0P%E4%15%CA%8C%5C%BEoz%1DZ%5D%A5%60m%5E%A9%2C%A8%94'%1A%D5%1B%8D%1A%A0%C7%FF%88o%F8q%96(%9Fv%9AbM%D3%C7%C3%C3'2%19'%93%ED)%94%5B%FA%B1M%FD%18b%B5%06%5C%EE%D0%84!%A2%D7%C74%DA%CC%E8%F3%93%91%91%93%91aR.%0F9W%12x%A2%D2%9Cf%0C%86%E23%E9%B1T%9A%95%FE%B8%A5%D58gf%00%D7%FC%82k%D9%E94%5B%9C%D33%DE%F1%F1%F4%2F%3F%17%A5R%00%FB%F57%9Fmn%F7%00%E5%9B%192M%EB%C6%B8'O%0A%12%09%C0%F4%F6%92%FD%FDX_%DF%E6%CB%DF%1DFcB%FA%8C%E8%EBO%F7%F6%E6%CB%3Fp%12%C9%D1%D3%A7%5E%B39%96%88%82%7B%D6%12GG%D8%F3%17%B9%87%DFr%DD%C0%C3%7C%19%DB%D5%15%FCi%C8%AE%1B%C3%1F%7D%9F%EF%EA%CEuu%BF%CF%0F%BA%92%3D%3F%ACLM%C5%12(%A4%D1%A8%D6%DDn%A4%A7'%DB%D1%91%BB%7F%1F%C8%02%ED%EDL%7B%5BP%F2xN%26%C3%3A%3BA%09%E4%DA%DA%B2%EDm%20%C7%BB%1E%CCi4(h%86%B5%9A%3D4%1A%1F%18%60%EF%DD%CB%B4%B4dZ%9A%01%B6%99w%F8%C5%97%BB_%7DM%81%F5%E6%BB%00%7B%17h%CA45%25%3B%BF%D9%98%9ENbI%FEy2%24%81%0F%0D1w%1A%99%DB%B7%FFG%2Cf%C5b%86%D7%C0k(%AB%AFOvt%84%ED%F6%14%85A%F0%18%CC%10%04%3E0H%D5%D5Q%B5%B5%B4%A8%8E%16%89(%40(%E4%B3HD%8B%84%B4P%40%0B%85%B4%40H%D7%08(AM%B2%B55b%B7ct%AAr%DAd%AA%7F%80%10%08pAMJ%24%3C%12%89%0Ejk%F7%3F%FFl%EF%D6%ADx%7DCL%2C%8E6%DE%09%8B%C5%A1%C6%C6%ED%96%E6Hk%EB%E6w%8F%B6%1C%0E%8C%C6%20%DD%98%8EJ%93%A8%C5%12%19%1D%0D%BF%7C%11R%C8%ED%83%83%C6%C7%12%9FJ%E5Q)%5Dj%D5%AAV%BB%AA%D7%DB%E4%8A9%8D%DAk%B1%F8%ECv%FF%B23%14%DC%22%B3%04%F4j%FA%15EQ8%86%93D%9A%20H%0C%C7%C3%91%ED%0D%BF%3F%8AF%C3%910%88%C8N%24%BA%1B%8D%ED%A1%F1%83%F8%11y%88%B1)%2C%83%E1y%3Cs%9D%FD%17%3A%1E%2C%25%97Qc%9B%00%00%00%00IEND%AEB%60%82";
	var syndID = /id=(\d+)/.exec(root.location.href)[1];
	var Pers = [];
	var allGren, allChip, allSign, allRank, ALL;

	//css-ботва
	var style = doc.createElement('style');
	style.innerHTML = '.wb1 {text-align:center; padding-left:3px; border: 1px #339933 solid;} ' +
		'.wb2 {padding-left:3px; padding-right:3px; border: 1px #339933 solid;}';
	doc.getElementsByTagName('head')[0].appendChild(style);

	//прикручиваем ссылку "Анализ PTS" на странице синдиката
	var table;	//таблица в которую будем выводить данные
	var a = doc.getElementsByTagName('a');
	for (var i = 0; i < a.length; i++) {
		if(/Расход PTS/.test(a[i].innerHTML)) {
			var target = a[i].parentNode;
			if (target.lastElementChild.nodeName == 'BR') target.removeChild(target.lastElementChild);
			var pts = doc.createElement('a');
			pts.id = 'show_analizePTS_panel';
			pts.setAttribute('style', 'text-decoration:none;');
			pts.href = '#';
			pts.innerHTML = 'Анализ PTS';
			target.appendChild(doc.createTextNode(' | '));
			target.appendChild(pts);
			continue;
		}
		if (a[i].innerHTML == 'Кто онлайн') {
			table = a[i].parentNode.nextElementSibling.nextElementSibling;
			break;
		}
	}

	getObj('show_analizePTS_panel').addEventListener('click', function() {
		if (getObj('analizePTS_txt')) return;
		table.setAttribute('class', 'wb');
		table.removeAttribute('style');
		table.innerHTML = '<tr><td style="text-align: center;">Номер страницы протокола синдиката: ' +
			'<input id="analizePTS_txt" type="text" size="3" maxlength="3" value="1"> ' +
			'<input type=button id="analizePTS_go" value=">>">' +
			'<span id="loadingPTS_span" style="margin-left: 10px; visibility: hidden;">' +
			'<img src="' + img_loading + '"><span id="analizePTS_counter" style="color: #0000FF; margin-left: 10px;">' +
			'</span></span></td>';

		getObj('analizePTS_go').addEventListener('click', function() {
			var page = +getObj('analizePTS_txt').value;
			if (isNaN(page) || page <= 0) {
				alert('Не верно введен номер страницы');
				return;
			}

			getObj('loadingPTS_span').style.visibility = 'visible';
			getObj('analizePTS_txt').disabled = true;
			this.disabled = true;
			Pers.length = 0;
			allGren = allChip = allSign = allRank = ALL = 0;
			getPagesData(--page);
		}, false);
	}, false);

}());
