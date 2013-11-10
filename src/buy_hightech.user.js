// ==UserScript==
// @name			Buy HighTech
// @namespace		using namespace std;
// @description		В HighTech магазине добавляет ссылки "Продать" и "Купить" для каждого предмета, при нажатии на которые, выводится форма подачи объявления на ДО для данного предмета.
// @include			http://www.ganjawars.ru/shopc.php*
// @include			http://www.ganjawars.ru/market-p.php?stage=2&item_id=*
// @license			MIT
// @version			1.0
// @author			Идея: mrXaram, кодинг: MyRequiem
// ==/UserScript==

(function() {
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var loc = doc.location.href;
	var td = doc.getElementsByTagName('td');

	if (/ganjawars\.ru\/shopc\.php/.test(loc)) {
		var tables;
		for (var i = 0; i < td.length; i++) {
			if (td[i].getAttribute('width') == '100%' && td[i].getAttribute('valign') == 'top') {
				tables = td[i].getElementsByTagName('table');
				break;
			}
		}

		for (i = 0; i < tables.length; i++) {
			var target = tables[i].firstElementChild.firstElementChild.nextElementSibling.firstElementChild;
			var id = /id=(.+)$/.exec(target.firstElementChild.href)[1];
			target = target.nextElementSibling;
			var price = /(\d+) EUN/.exec(target.innerHTML)[1];
			var strength = /Прочность:<\/b> (\d+)/i.exec(target.innerHTML)[1];

			target = target.lastElementChild.nodeName == 'LI' ? target.lastElementChild : target;
			target.removeChild(target.lastElementChild);
			target.innerHTML += '<span style="font-weight: bold;"> Создать объявление: </span>' +
				'<a target="_blank" style="color: #0000FF; " ' +
				'href="http://www.ganjawars.ru/market-p.php?stage=2&item_id=' + id + '&action_id=2&p=' + price +
				'&s=' + strength + '">[Купить]</a> <a target="_blank" style="color: #FF0000;" ' +
				'href="http://www.ganjawars.ru/market-p.php?stage=2&item_id=' + id + '&action_id=1&p=' + price +
				'&s=' + strength + '">[Продать]</a>';
		}
		return;
	}

	//на странице подачи объявлений
	var param = /&p=(\d+)&s=(\d+)$/.exec(loc);
	if (!param) return;

	for (i = 0; i < td.length; i++) {
		if (td[i].innerHTML == 'Предмет:') {
			td[i].nextElementSibling.innerHTML += ' <span style="color: #0000FF;">(Стоимость в магазине: ' +
			param[1] + ' EUN)</span>';
			break;
		}
	}

	//остров любой
	doc.getElementsByName('island')[0].value = '-1';

	//если продаем, то прочность максимальная, если покупаем, то минимальная
	var dur1 = doc.getElementsByName('durability1')[0];
	var dur2 = doc.getElementsByName('durability2')[0];
	if (/action_id=1/.test(loc)) {
		dur1.value = param[2];
		dur2.value = param[2];
	} else {
		dur1.value = '0';
		dur2.value = '1';
	}

	doc.getElementsByName('date_len')[0].value = '3';

}());
