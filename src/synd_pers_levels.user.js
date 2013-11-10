// ==UserScript==
// @name			Synd Pers Levels
// @namespace		using namespace std;
// @description		На страницах онлайна и состава синдиката, при нажатии на кнопку, выводит остров, боевой и синдовый уровни бойцов, а так же процент выздоровления персонажа.
// @include			http://www.ganjawars.ru/syndicate.php?id=*
// @license			MIT
// @version			1.3
// @author			MyRequiem
// ==/UserScript==

(function() {
//----------------------------------------------------------------------------
	function ajaxQuery(url, onsuccess, onfailure) {
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open('GET', url, true);
		xmlHttpRequest.send(null);

		var timeout = setTimeout(function() {
			xmlHttpRequest.abort();
			alert('Synd Online Levels: Сервер не отвечает...');
		}, 10000);

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
//----------------------------------------------------------------------------
	function getUrlInfo(obj) {
		var a = obj.getElementsByTagName('a');
		return /info\.php\?id=/.test(a[0].href) ? a[0].href : a[1].href;
	}
//----------------------------------------------------------------------------
	function getLevels(str) {
		if (/Технический персонаж<\/font> \d+ \(\d+\)/i.test(str)) return false;

		var mass = ['', '', '', '']; //боевой, синдовый уровни, процент выздоровления, остров

		//Остров
		var area = /Район:<\/b> <a[^>]+>([^<]+)/.exec(str)[1];
		mass[3] = /Ejection Point|Overlord Point/i.test(area) ? '[Аут]' : /\[[A-Z]\]/.exec(area)[0];

		//боевой
		mass[0] = /Боевой:<\/td>.*<td>[^>]+><b>(\d+)/.exec(str)[1];

		//синдовый
		if (/<b>Основной синдикат:<\/b> #\d+ <a/i.test(str)) {
			mass[1] = /\[[^<]*<b>(\d+)<\/b>[^\(]*\(\d+\)[^\]]\]/.exec(str)[1];
		} else {
			mass[1]='Нет основы';
		}

		//добавим нули перед уровнями, если они состоят из одной цифры
		for (var i = 0; i < 2; i++) {
			if (mass[i].length == 1) mass[i] = '0' + mass[i];
			mass[i] = '[' + mass[i] + ']';
		}

		//HP
		var hp = /\[(-?)(\d+)\s\/\s(\d+)\]/.exec(str);
		//если есть символ '-', значит кильнули
		if (hp[1]) {
			mass[2] = '<span style="color: #FF0000;">[Кильнули]</span>';
			return mass;
		}

		var now = +hp[2];
		var max = +hp[3];
		mass[2] = '[' + Math.round(now * 100 / max) + '%]';

		return mass;
	}
//----------------------------------------------------------------------------
	function showLevels(levels) {
		if (!levels) {
			target.innerHTML = '<span style="font-weight: bold;">Tex</span> ' + target.innerHTML;
		} else {
			target.innerHTML = '<span style="font-weight: bold;"><span style="color: #A59403;">' + levels[3] +
				'</span><span style="color: #FF0000;">' + levels[0] + '</span><span style="color: #0000FF;">' +
				levels[1] + '</span><span style="color: #008000;">' + levels[2] + '</span></span>' + target.innerHTML;
		}
	}
//----------------------------------------------------------------------------
	function go(ind) {
		//если уже есть выведенные данные, то удаляем их
		target = /page=online/.test(loc) ? tr[ind].lastElementChild.previousElementSibling : tr[ind].lastElementChild;
		if (target.firstChild.nodeType != 3) target.removeChild(target.firstChild);

		ajaxQuery(getUrlInfo(tr[ind]),  function(xml) {
			showLevels(getLevels(xml.responseText));
			ind++;
			if (ind < tr.length) {
				root.setTimeout(function() {go(ind)}, 1000);
			} else {
				link.removeAttribute('id');
			}
		},
		function() {
			alert('Synd Online Levels: Ошибка ответа сервера...');
		});
	}
//----------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var loc = root.location.href;
	var target;

	if (!/page=online/.test(loc) && !/page=members/.test(loc)) return;

	//берем все записи из таблицы с бойцами
	var tr;
	var tables = doc.getElementsByTagName('table');
	for (var i = 0; i < tables.length; i++) {
		if (tables[i].getAttribute('width') == '600' && !tables[i].getAttribute('bgcolor')) {
			tr = tables[i].getElementsByTagName('tr');
			break;
		}
	}

	//кнопка
	var link = doc.createElement('img');
	link.setAttribute('style', 'cursor: pointer; vertical-align: bottom; border: 0;');
	link.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%04gAMA%00%00%B1%8F%0B%FCa%05%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%1AtEXtSoftware%00Paint.NET%20v3.5.100%F4r%A1%00%00%02%95IDAT8Om%91%DDK%93a%18%C6%EF%E9%D4%E6Gjb%EArN%E7GA'B%11AE%1D%14%14%1D%16t%90%1Du%26%04J%FF%40Dt(%18d%3A%5DKS%9B%1FYc%D3%B1%E5%9C%5B%04%9DxP%E1%81%E9l%9A%DFs%DB%FB%3E%9Eu%D4u%CDe%09%DD%F0%E3%7Dv%DF%BF%EB%B9_%F6%8Ad%AA.%A4%A4~V%157%86%D5%F5%A6%F0%9E%F3Td%2F%06~e%88%B1%C7%19%1D%BA%87%AA%26%A8%1B%AC3%CA%86%C1%13%5BH%ED%D4%87T%14%A2%A7aV9%08%CF%ECqF%87.3%E9K*%03%BA%98%3F%E8%96%EAi%FD%B9%25%A8'j%82j%A8vF%DD%84%5C%87%AD'%9A%22%7B%D5%B6YU%CF%1Egt%E82%C3%AC%1C%F7%EB%A6%0A%BF%DEV%E9%D7%E3U%01%BD%1F%C3*l%ACl%8A%A8%F6%93%115%05%028%3Fn%08%ABF%CC%CCt%E82%C3%AC%94Li%A7K%7D%DA%D7c%3E-P%E6%D3l%D5%D3%AA%D4%12T%9D%D6%A0J%D4%86%D48%18%C49%8E%ED.%CB%B4%AA%A0C%97%19f%A5%C0%9Bj)%F4j%C9%22%AF%D6Z%3C%A9%E5%96%FB%F5Z%F0%09%B7%BB%F1%8AV%3C%AD%F8%1D%00%0B%A0%89%0E%5Df%98%95%5Cw%AA%23%CF%9DZ%00W%0A%BD))%F1i%C5%E0.6%5C%C6%A6%1C%93'u%0F%FDh%D1d%CAstR3%D3%A1%9B%C9tH%D6Dr%14%CC%81%B3%FCS!%1A%40%0E%C86L%24%AEf%BFK%AE%1A%DF'%E7r%DD%C9k%F9%9E%94%91%0E%DDLfTdl%B7%17%7C%91%B1%F8%F9C%DF%D6%B5m%92%91%9D%B0%8C%C4%BFa%DE%2Co%13%FB%9F%8DE7%9D%D9%B5%8B%B8%B6%1F%82-y%B3uG%867%B3%0E%A4%E1%AD%7C%19%DAt%80G%B8%E8o%98%0E%5Df%5C%DB%ED%02%E1%A2%0Cm%AC%CB%E0F%8F%BC%5E%2F%3B%B8%A0%2Ff%12%E7%CASq%AC%3C%90%BEX%F6A%9F%0E%DD%C1%8D5d%2F%08B%E52%B0%D6%2F%FD%3F%B7%40%8B8W%F7%B7%F5D%ADb%8F~%C63%20%3D%CB%05%E9%1Egt%E8%0E%AC%BD%92%01d%D3M%E7%EA9y%B9%F2%11%EC%8A%23v_%FA~%98%C5%BE%7CD%BA%16%2F%813%D2%BB%9C%97%EEqF%87.3%7F%96a%60%84p%03%04!%C7%11%1E%C7%E66p%3BC%5B%BA%C7%19%1D%BA%CC%1C*%FB%B2%11R3%02%9D%D2%BD4%0Fv%C0F%06%9E%E71%7B%96v%E8%FE%B7%BA%A3%06%88%25%F2b%B1%19%AF~K%BA%BE%B7%EE%833%7B%DDK%A5B%E7%9F%FA%0D%B0%9E%C7%C1%DC3%95%F7%00%00%00%00IEND%AEB%60%82";
	link.addEventListener('click', function() {
		if (this.id) return;
		this.setAttribute('id', 'img');
		go(1);
	}, false);

	var a = doc.getElementsByTagName('a');
	for (i = 0; i < a.length; i++) {
		if (a[i].innerHTML == 'Кто онлайн') {
			a[i].parentNode.insertBefore(link, a[i].nextSibling);
			a[i].parentNode.insertBefore(doc.createTextNode(' | '), a[i].nextElementSibling);
			break;
		}
	}

}());
