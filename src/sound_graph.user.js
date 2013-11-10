// ==UserScript==
// @name			Sound Graph
// @namespace		using namespace std;
// @description		Проигрывает звук при начале графического боя.
// @include			http://bfield0.ganjawars.ru/go.php?bid=*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {

	//НАСТРОЙКИ
	var sound_graph = 4;	//номер звука
	//КОНЕЦ НАСТРОЕК

//------------------------------------------------------------------------------
	function playSound(sound) {
		var fl = doc.getElementById('graph_flashcontent');
		if (!fl) {
			fl = doc.createElement('div');
			fl.id = 'graph_flashcontent';
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
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	var doc = root.document;

	playSound(sound_graph);

}());
