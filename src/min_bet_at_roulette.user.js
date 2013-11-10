// ==UserScript==
// @name		    Minimal bet at roulette
// @namespace		using namespace std;
// @description		Показывает числа, на которые поставлено меньше всего Гб в данный момент на странице рулетки. Количество выводимых чисел определяется пользователем.
// @include			http://www.ganjawars.ru/roulette.php
// @license			MIT
// @version			1.1
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
			alert('Minimal bet at roulette: Сервер не отвечает...');
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
//--------------------------------------------------------------------------------------------------
	function start() {
		ajaxQuery('http://www.ganjawars.ru/rouinfo.php?id=0', function(xml) {
			spanContent.innerHTML = xml.responseText;
			//если нет ни одной ставки
			if (/Доход казино: <b>0\$<\/b>/.test(spanContent.innerHTML)) {
				divresult.innerHTML = '<span style="color: #FF0000;">Ставок пока нет</span>';
				return;
			}

			var tr;
			var center = spanContent.getElementsByTagName('center');
			for (var i = 0; i < center.length; i++) {
				if (center[i].innerHTML == 'Все ставки:') {
					tr = center[i].nextElementSibling.getElementsByTagName('tr');
					break;
				}
			}

			var bets = []; //массив чисел и суммарных ставок на них
			for(i = 0; i < 36; i++) bets[i] = [i, 0];
			for(i = 0; i < tr.length; i++) {
				var num = /Число (\d+)/.exec(tr[i].innerHTML);
				if (!num) continue;
				num = +num[1];
				var stavka = /\$(\d+,?\d*)/.exec(tr[i].firstElementChild.innerHTML);
				stavka = +stavka[1].replace(',', '');
				bets[num - 1][1] += stavka;
			}

			bets.sort(function(a, b) {
				if (a[1] > b[1]) return 1;
				else if(a[1] < b[1]) return -1;
				else return 0;
			});

			var str = '<table style="border: #339933 solid 1px;">';
			chk = doc.getElementById('chknull').checked;
			for (i = 0, j = 0; i < 36; i++) {
				if (j == count) break;
				if (!chk && !bets[i][1]) continue;
				str += '<tr><td>Число:</td><td style="text-align: right; color: #0000FF;">' + (bets[i][0] + 1) +
					'</td><td>Ставка:</td><td style="color: #FF0000;">$' + bets[i][1] + '</td>';
				j++;
			}
			str += '</table>';

			divresult.innerHTML = str;
		},
		function() {
			alert('Minimal bet at roulette: Ошибка ответа сервера...');
		});
	}
//--------------------------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var spanContent = doc.createElement('span');

	var td = doc.getElementsByTagName('td');
	for (i = 0; i < td.length; i++) {
		if (td[i].getAttribute('valign') == 'top'  && /^&nbsp;Максимальная сумма/i.test(td[i].innerHTML)) {
			td[i].innerHTML += '<div style="background: #D0EED0; margin-top: 5px; ' +
				'padding: 5px; text-align: center;"><span style="color: #0000FF">Показать минимальные ставки</span>' +
				'<br>Вывести <input type="text" id="inptext" value="5" size="2" maxlength="2"> чисел ' +
				'<input type="button" id="but" value=">>" /><br><input type=checkbox id="chknull" checked /> ' +
				'<label for="chknull">Числа, на которые еще не ставили</label></div>' +
				'<div id="result" style="visibility: hidden; text-align: center; background-color:#D0EED0; ' +
				'padding: 5px;"></div>';
			break;
		}
	}

	var count;
	var divresult = doc.getElementById('result');

	doc.getElementById('but').addEventListener('click', function() {
		count = +doc.getElementById('inptext').value;
		if(isNaN(count) || (count < 1)  || (count > 36)) {
			alert('Неверно введено число');
			return;
		}
		divresult.style.visibility = 'visible';
		divresult.innerHTML = 'Загрузка...';
		start();
	}, false);

}());
