// ==UserScript==
// @name			Delete_SMS
// @namespace		using namespace std;
// @description		Добавляет сылку "Удалить отмеченные" вверху страниц входящих и исходящих сообщений.
// @include			http://www.ganjawars.ru/sms.php*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;

	//страница удаления сообщений
	if (/page=2/.test(root.location.href)) return;

	var a = doc.getElementsByTagName('a');
	for (var i = 0; i < a.length; i++) {
		if (a[i].innerHTML == 'Удаление') {
			a = a[i];
			break;
		}
	}

	var link = doc.createElement('a');
	link.href = '#';
	link.innerHTML = 'Удалить отмеченные';
	link.addEventListener('click', function() {
		//на странице входящих имя формы inbox, на исходящих - outbox
		var form = doc.forms.inbox ? doc.forms.inbox : doc.forms.outbox;
		form.submit();
	}, false);

	a.parentNode.appendChild(doc.createTextNode(' | '));
	a.parentNode.appendChild(link);

}());
