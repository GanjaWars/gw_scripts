// ==UserScript==
// @name			Not give cannabis leaf
// @namespace		using namespace std;
// @description		На страницах игры заменяет "звездочку" на наш любимый листик.
// @include			*ganjawars*
// @include			http://www.ganjafoto.ru*
// @license			MIT
// @version			1.0
// @author			MyRequiem
// ==/UserScript==

(function() {
//------------------------------------------------------------------------------
	function changeFavicon() {
		if (!head) return;
		var links = head.getElementsByTagName('link');
		for (var i = 0; i < links.length; i++) {
			if (/icon/.test(links[i].getAttribute('rel'))) {
				head.removeChild(links[i]);
			}
		}

		var link = doc.createElement('link');
		link.setAttribute('type','image/x-icon');
		link.setAttribute('rel', 'shortcut icon');
		link.setAttribute('href', fav);
		head.appendChild(link);
	}
//------------------------------------------------------------------------------
	function changeIcons() {
		var imgs = doc.getElementsByTagName('img');
		for (var i = 0; i < imgs.length; i++) {
			var source = imgs[i].getAttribute('src');
			if (/images\.ganjawars\.ru\/i\/gon\.gif/.test(source) || /info\.online\.php\?id=/.test(source)) {
				imgs[i].setAttribute('src', l_green);
			} else if (/images\.ganjawars\.ru\/i\/goff\.gif/.test(source)) {
				imgs[i].setAttribute('src', l_grey);
			}
		}
	}
//------------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var head = doc.getElementsByTagName('head');
	head = head ? head[0] : 0;

	//фавикон, листик зеленый (онлайн), листик серый (оффлайн)
	var fav = "data:image/x-icon,%00%00%01%00%01%00%10%10%00%00%01%00%18%00h%03%00%00%16%00%00%00(%00%00%00%10%00%00%00%20%00%00%00%01%00%18%00%00%00%00%00%40%03%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00t%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABu%F0%FF%F0%5D%89iR%8A%5B%1D%5D%1F%A2%C3%A5%A2%C3%A5%F0%FF%F0t%AD%81%F0%FF%F0%A2%C3%A59yC.n%3EL%7CP%F0%FF%F0t%ABut%ABu%F0%FF%F0%F0%FF%F0%CB%E1%D0%87%BA%8FO%92Y%A2%C3%A5%A2%C3%A59%91P%A2%C3%A5.%7DAr%AE%7B%CB%E6%D1%F0%FF%F0%F0%FF%F0t%ABut%ABu%F0%FF%F0%F0%FF%F0%E6%F2%E5%A2%C3%A5I%8BU7%7D%3EK%9E%5D_%B1j%85%C2%85Z%9Ed2z%40d%9DpR%84%5B%F0%FF%F0t%ABut%ABu%F0%FF%F0%99%BF%A0F%8AM%25m.%3EzFA%85JP%9C%5E%5D%A0d%5B%9Bfo%AAzt%A6%7D7~K%17c'(n8t%ABut%ABu%24l00z%3B%2Fn4c%A1k%5D%A0h2xCt%ABuM%8FZ%3D%84N5%7CD%F0%FF%F0%F0%FF%F0%F0%FF%F0%9C%CB%9Ct%ABut%ABu%5E%9DeJ%8ES%F0%FF%F0%F0%FF%F01x%3EZ%93d%A3%C9%A40n%3CK%88Q%2Bv4O%8B%5B%F0%FF%F0%F0%FF%F0%F0%FF%F0t%ABut%ABu%F0%FF%F0%F0%FF%F0%F0%FF%F0Z%91%5D%25r2%96%BB%95%BD%E6%C0%23l%2C%89%B0%84j%A0%7B%14f%1Fv%95u%F0%FF%F0%F0%FF%F0t%ABut%ABu%F0%FF%F0%F0%FF%F0T%8FX%26v1%5D%92d%F0%FF%F0%A9%D5%AD%1Am%2B%96%BD%9B%AA%C7%B8%17l*%3B%80G%F0%FF%F0%F0%FF%F0t%ABut%ABu%F0%FF%F0%F0%FF%F0%3E%89I*s7%F0%FF%F0%F0%FF%F0y%B3%83%23p%2Fg%A6s%F0%FF%F0%81%AE%8F%25n3D%8AN%F0%FF%F0t%ABut%ABu%F0%FF%F0%85%B9%8D%26q0%83%B2%88%F0%FF%F0%F0%FF%F0%88%BC%94%26o%2Fg%A9r%F0%FF%F0%F0%FF%F0%93%BF%98%14h*%F0%FF%F0t%ABut%ABu%E6%F7%E5U%90%5C%5B%9Ai%F0%FF%F0%F0%FF%F0%F0%FF%F0%B3%DC%B3%23i%2B%86%BB%95%F0%FF%F0%F0%FF%F0%F0%FF%F0m%A3%7C%89%B9%8Dt%ABut%ABu%DD%FF%DCp%A6t%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F0%20m(%A0%D0%A7%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F0t%ABut%ABu%C9%EC%D2%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F04z%3B%CB%DD%CD%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F0t%ABut%ABu%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F0g%A7q%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F0%F0%FF%F0t%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABut%ABu%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00";
	var l_green = "data:image/gif,GIF89a%19%00%17%00%F7%00%00%00%00%00%1BN%1B%1BX%1B%25N%1B%25b%1B%2Fb%1B%2Fm%1B%25w%1B%2Fb%25%2Fm%25%2Fw%25%2Fw%2F9m%259m%2F9w%259w%2F9w9Dw%25Fp(Dw%2FDw9DmDDwDNwDNwN9%81%2F9%819D%81%2FD%819D%8B9N%819O%829N%979D%81DN%81DN%81NN%8BDN%97DX%81DX%8BDX%8BNX%97DX%97NX%97Xb%8BXb%97Xg%9BXm%97Xm%8Bbm%97bb%A0Nb%ABNi%A0Zb%A1bm%A1bm%A1mm%B5bw%ABmw%ABww%B5m%7F%B1o%81%ABw%81%B5w%8B%B5w%81%C0w%8B%C0w%81%AB%81%81%B5%81%8B%B5%81%8B%B5%8B%8B%C0%81%8B%C0%8B%8B%CA%8B%97%C0%8B%97%C0%A1%A1%C0%97%A1%C4%96%AB%C0%97%AB%D4%97%A1%C0%A1%A1%CA%A1%AB%CA%AB%AB%D4%A1%AB%D4%AB%AB%DE%AB%B5%CA%AB%B5%D4%AB%B5%DE%AB%B5%D4%B5%C0%DE%C0%CA%DE%CA%CA%E9%CA%CA%F3%C0%CA%F3%CA%CA%FD%CA%D6%E7%CE%D4%E9%CA%D6%E7%D6%D4%E9%D4%D6%EF%D6%D6%EF%DE%DE%E7%D6%DE%EF%DE%D4%F3%D4%D4%FD%D4%DE%FF%DE%DE%EF%E7%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%F9%04%01%00%00%FF%00%2C%00%00%00%00%19%00%17%00%00%08%FF%00%FF%09%1CHP%A0%94%82%08%13%16%E4%D2B%A1C%84%3E%1E%3C%24%08F%E1%8A%06%13%07z%D1%91P%83%83-%19%056%F0Q0%0D%84%07W%0A%9A%B1%82p%CC%8A%09D%08vi%F0%A0I%C1%13%1C%11%269%89e%A0%95%07%0F%8C%0C%3C3%C1%80%C3%0D%1D(%0CL%024%87%40-%0D%14%D8px%83%C3%83%18j%FEMq%F0%E0%87%C0%08%0E%94%3E%7C%D0%01%C1%94%7Fg%B8%3E)c%22C%82%25%13%8B%40%D8%10%E2%1F%1A%A0J%9A8X%80!%E1%90!%20%FF%91a%C1%A1A%944%0D%20%DC%18%E1%80%81C%0A%078%08%11(%C2%81%08(%17%26%88p%FB%E4!%0A%A0%16%7C%EC%101%E1H%8D%13-%18%F4%18%D8%05%0A%90%20T%08%F6H%00T%04%0A%0E*Z%A8%F00U%CB%0B%06%06%08%14%20%81p%CB%C5%C4%24d%EC%A81%E4%0A%0A%03%C1%11%BCx(%26%07%DD%143p%20%E9%F0%00E%8F*%13%B9%10SiA%82C%09%10'6xPq%25%CCD%18%04%04%24X%11D%C6%07%19%12%22%3Ch%E0%C1%C9%97%84E%C0%D0B%11%03%8D%60%01%0D2%B80%40%0B%22%0C%10%40%05%08%15A%20A%18%C0%20%10%0F%FF%E4p%03ZK%C4%B0aH%021!P%16%05%B9'P%40%00%3B";
	var l_grey = "data:image/gif,GIF89a%19%00%17%00%E6%00%00%FF%FF%FF%FF%FF%FD%FF%FF%F7%FD%FF%FD%FD%FF%F3%FD%FF%E9%F7%FF%FF%F7%FF%F7%F7%FF%EF%F7%F7%F7%F3%FF%FD%F3%FF%F3%F3%FF%E9%EF%FF%F7%EF%FF%EF%EF%FF%E7%EF%F7%EF%E9%FF%E9%E9%FF%DE%E9%FD%E9%E9%FD%DE%E7%FF%E7%E7%F7%E7%E7%F7%DE%E7%EF%E7%DE%FF%DE%DE%EF%E7%DE%EF%DE%DE%E7%DE%DE%E7%D6%D7%D7%D7%D2%D2%D2%C9%C9%C9%C4%C4%C4%C0%C0%C0%BF%BF%BF%BB%BB%BB%B8%B8%B8%B7%B7%B7%B3%B3%B3%B2%B2%B2%AE%AE%AE%A6%A6%A6%A5%A5%A5%A1%A1%A1%9D%9D%9D%99%99%99%95%95%95%90%90%90%8F%8F%8F%8B%8B%8B%87%87%87%83%83%83~~~zzzvvvrrrmmmiiieeeddd%60%60%60___%5C%5C%5C%5B%5B%5BWWWSSSRRRNNNJJJFFFBBBAAA%3D%3D%3D999555000%2C%2C%2C%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%F9%04%01%00%00%0E%00%2C%00%00%00%00%19%00%17%00%00%07%FF%80%0E%82%83%84%82-%85%88%89%85%26%3C%8A%8E%885F%8F%84%26%8A%3CG%93%83%236%89DH%95%99%0BG5%85%19EF%2B%84%06%1B%2C%88%23%3CF4%84%24GF0%84%01A%9C%882%A7*%83%2CFF3%83%22FJ%8EECE%832%C27%82(GH9%8E8DF%3A%1A%00%2CHF%A4%0EHH%CC%8FFCJ%2C%00%22%DE%2F%1DBEI%B7%8F3EEB%18!%C200%DEB%8944%40%8D%F0A%E4H%0B%10G%8A%E0%08%82%24I%B2%24Djx%F8%20%04%89%10%17%D8%DE%25y%F1%08%88%B0%886%84%18%91%91%23%08%8F%24%BB%1C%90p%010%D5%20%1BI%84%09%01B%A4%07%8F%1EDr%7C%40qR%C9%92%25ATR%BA%940%C8%0E%1B9h%AC%00%A2%C4%A7%92F%8EH%DC%B0%F7C%C7%8D%18C%8C%00%B1q%E8%91%09%1A%3C%82%10%F9%11%24H%91%9A%2BHL%E2%B1%84I%12%1E40v%10%D9%91%C4%DB%11%22.JX%E2AL%90%D8j%3A%9A%F0%10%D2%A4%09%B9IB%A0%3A%E0p%03%87%03%110t8%CE%84(%05%A1%0Bj%05%05%02%00%3B";

	var DATA = '';
	if (/tmp\/panelcontainer/.test(root.location.href)) {	//для страницы-контейнера GW-панели
		root.setInterval(function() {
			var data;
			if ((data = doc.getElementById('bytes')) && (data = data.innerHTML) != DATA) {
				DATA = data;
				changeFavicon();
			}
		}, 500);
	} else {
		changeFavicon();
		changeIcons();
	}

}());