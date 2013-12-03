// ==UserScript==
// @name             Stairway To Heaven [Led Zeppelin]
// @namespace        http://www.heymexa.ru/
// @description      При передаче предмета показывает список ваших объявлений.
// @include          http://www.ganjawars.ru/home.senditem.php*
// @version          1.0
// @author           W_or_M
// ==/UserScript==

// писал этот скрипт под Led Zeppelin
// кто "нуб и опозорилсо" и не знает кто такие втыкает сюда http://ru.wikipedia.org/wiki/Led_Zeppelin

(function() {

var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

function getXmlHttp(){
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
}


function ajax(url, onload) {

    var xmlhttp = getXmlHttp();
    xmlhttp.open('GET', url, true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200) {
                onload(xmlhttp);
            }
        }
    };
    xmlhttp.send(null);

}

// индикатор загрузки
function showLoader() {

    // индикатор
    var div = root.document.createElement('div');
    div.id = 'loader';
    with (div.style) {

        width = '100%';
        height = '20px';
        backgroundImage = 'url("http://worm.vline.ru/gw/img/ajax2.gif")';
        backgroundPosition = 'center';
        backgroundRepeat = 'no-repeat';

    }
    root.document.body.appendChild(div);

}

// убрать нафик его
function hideLoader() {

    var loader = root.document.getElementById('loader');
    if (loader != null) {

        loader.parentNode.removeChild(loader);

    }

}

if (root.location.href.indexOf('http://www.ganjawars.ru/home.senditem.php') >= 0) {

    showLoader();

    ajax('http://www.ganjawars.ru/market-l.php', function(req) {

        // здесь хранить будем
        var div = root.document.createElement('div');
        div.innerHTML = req.responseText;

        // ищем таблицу
        var font = div.getElementsByTagName('font');
        for (var i = 0, l = font.length; i < l; i++) {

            if (font[i].innerHTML == 'Ваши объявления') {

                var table = font[i].parentNode.parentNode.parentNode.parentNode.parentNode;

                break;

            }

        }

        if (typeof table != 'undefined') {

            hideLoader();
			table.setAttribute('style', 'margin-top: 10px;');
            root.document.body.appendChild(table);

        }

    });

}

})();