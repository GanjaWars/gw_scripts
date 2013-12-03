// ==UserScript==
// @name			Rent and Sale
// @namespace		using namespace std;
// @description		При передаче предмета в аренду окно передачи выделяется голубым. Если предмет продается или передается в постоянное пользование, то красным. Так же если указана нулевая цена, выводится сообщение с подтверждением продолжения операции.
// @include			http://www.ganjawars.ru/home.senditem.php*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function(){
//------------------------------------------------------------------------------
	function changeColor(color) {
		tr.firstElementChild.style.background = color;
		tr.lastElementChild.style.background = color;
	}
//------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;

	var tr = doc.getElementsByTagName('tr');
	for (var i = 0; i < tr.length; i++) {
		if (/не передавать/i.test(tr[i].innerHTML)) {
			tr = tr[i];
			break;
		}
	}

	if (tr.length) return;

	var radio = [];
	var inp = tr.getElementsByTagName('input');
	for (i = 0; i < inp.length; i++) {
		if (inp[i].type == 'radio') {
			radio[radio.length] = inp[i];
		}
	}

	radio[0].addEventListener('click', function() {changeColor('#E0EEE0');}, false);
	radio[1].addEventListener('click', function() {changeColor('#FB8F8F');}, false);
	if (radio[2]) radio[2].addEventListener('click', function() {changeColor('#95CCF6');}, false);

	var scrpt = doc.createElement('script');
	scrpt.innerHTML = 'function checkPrice() {'+
		'if (document.getElementsByName("sendprice")[0].value == "0") {' +
			'if (!confirm("Указана цена 0 Гб !!! Продолжить?")) return false;' +
		'}' +
		'return true;}';
	doc.getElementsByTagName('head')[0].appendChild(scrpt);

	var frm = doc.getElementsByTagName('form');
	for (i = 0; i < frm.length; i++) {
		var act = frm[i].action;
		if (act && /home\.senditem\.php/.test(act)) {
			frm[i].setAttribute('onsubmit', 'return checkPrice();');
			break;
		}
	}

}());
