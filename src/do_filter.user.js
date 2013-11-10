// ==UserScript==
// @name			DO Filter
// @namespace		using namespace std;
// @description		Быстрый поиск предметов на ДО при введении их названия в текстовое поле.
// @include			http://www.ganjawars.ru/market.php*
// @include			http://www.ganjawars.ru/market-p.php*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {
//--------------------------------------------------------------------------------------------------
	function find() {
		for (i = 0; i < selects.length; i++) {
			//если текстовое поле пустое(стерто BackSpase'ом), то вернем списки в начальное состояние
			if (!this.value) {
				selects[i].options[1].selected = true;
				setHref(selects[i]);
				continue;
			}

			//выбираем пустой option
			selects[i].options[0].selected = true;
			//прокручиваем все option ищем совпадения
			for (var j = 0; j < selects[i].options.length; j++) {
				if (~selects[i].options[j].innerHTML.toLowerCase().indexOf(this.value.toLowerCase())) {
					selects[i].options[j].selected = true;
				}
			}

			setHref(selects[i]);
		}
	}
//--------------------------------------------------------------------------------------------------
	function setHref(sel) {
		var a = sel.parentNode.lastElementChild;
		for (var i = 0; i < sel.options.length; i++) {
			if (sel.options[i].selected) {
				var itemId = sel.options[i].value;
				if (itemId != '#') {
					a.href = 'http://www.ganjawars.ru/item.php?item_id=' + itemId;
					a.setAttribute('target', '_blank');
				} else {
					a.href = itemId;
					a.removeAttribute('target');
				}
				break;
			}
		}
	}
//--------------------------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;

	var selects = doc.getElementsByName('item_id');
	if (!selects.length || !selects[0].options) return;

	for (var i = 0; i < selects.length; i++) {
		//одинаковая длина у всех списков
		selects[i].setAttribute('style', 'width: 210px;');

		//добавим пустой елемент в select
		var opt =  doc.createElement('option');
		opt.innerHTML = '&nbsp';
		opt.setAttribute('value', '#');
		selects[i].insertBefore(opt, selects[i].firstElementChild);
		//выделен первый option (не пустой)
		selects[i].options[1].selected = true;

		//добавим ссылки на предметы после селектов
		var a = doc.createElement('a');
		a.innerHTML = '[?]';
		a.setAttribute('title', 'Страница описания предмета');
		a.setAttribute('style', 'margin-left: 2px; color: #808080; text-decoration: none;');
		selects[i].parentNode.appendChild(a);

		//обработчик 'onchange' списка выбора
		selects[i].addEventListener('change', function(sel) {
			return function() {setHref(sel);}
		}(selects[i]), false);

		//устанавливаем атрибут href ссылки
		setHref(selects[i]);
	}

	//вставляем текстовое поле ввода
	var div = doc.createElement('div');
	div.innerHTML = '<span style="color: #0000FF; font-weight: bold;">Найти предмет:</span> ' +
		'<input id="txtFilter" type="text" size="40" style="margin-bottom: 10px;">';
	var target = doc.getElementsByTagName('center')[0];
	target.insertBefore(div, target.firstChild);

	var txt = doc.getElementById('txtFilter');
	txt.addEventListener('input', find, false);
	txt.focus();

}());
