// ==UserScript==
// @name             Item2Market [GW] 
// @namespace        http://www.heymexa.ru/
// @description      Дополнительные ссылки в рюкзаке. "Продать/Сдать" предмет на доске объявлений. + Возможность быстрой починки предметов
// @include          http://www.ganjawars.ru/items.php*
// @version          1.01
// @author           W_or_M
// ==/UserScript==

function item2market(transport) {
    
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
    xmlhttp.open('GET', url, false);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200) {
                onload(xmlhttp);
            }
        }
    };
    xmlhttp.send(null);
    
}

function getRepairLink(anchor, id) {
    
    ajax('http://www.ganjawars.ru/workshop.php', function(req) {
        
        var div = root.document.createElement('div');
        div.innerHTML = req.responseText;
        
        var a = div.getElementsByTagName('a');
        for (var i = 0, l = a.length; i < l; i++) {
            
            var re = new RegExp('repair='+ id +'&md5m=', 'i');
            if (re.test(a[i].href)) {
                
                anchor.href = a[i].href;
                break;
                
            }
            
        }
        
    })
    
}
       
    
    // ищем предметы с возможностью передачи
    var a = root.document.getElementById('itemsbody').getElementsByTagName('a');
    for (i = 0; i < a.length; i++) {
        
        var id = /http:\/\/www\.ganjawars\.ru\/home\.senditem\.php\?item=(\d+)&item_tag=(.*)&iuid=\d+/i.exec(a[i].href);
        if (id != null) {
            
            item_id = id[1];
            id      = id[2];
            
            // починка
            var aa = a[i].parentNode.previousSibling.getElementsByTagName('a');
            for (k = 0; k < aa.length; k++) {
                
                if (aa[k].innerHTML == 'чинить') {
                    
                    getRepairLink(aa[k], item_id);
                    var url = aa[k].href;
                    
                    aa[k].onclick = function() {
                        
                        ajax(url, function(req) {
                            
                            // а предметик то, отремонтирован успешно
                            if (req.responseText.indexOf('Предмет успешно отремонтирован!') >= 0) {}
                            
                            root.location.href = 'http://www.ganjawars.ru/items.php';
                            
                        });
                        
                        
                        return false;
                        
                    }
                    
                }
                
            }
            
            // объявление
            var li = root.document.createElement('li');
            li.innerHTML = 'Объявление: <a href="http://www.ganjawars.ru/market-p.php?stage=2&item_id='+ id +'&action_id=1">Продать</a> | <a href="http://www.ganjawars.ru/market-p.php?stage=2&item_id='+ id +'&action_id=3">Сдать</a>';
            a[i].parentNode.parentNode.insertBefore(li, a[i].parentNode);
            
            i += 2;
            
        }
        
    }

}

var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;


(function() {

// на странице предметов
if (root.location.href.indexOf('http://www.ganjawars.ru/items.php') >= 0) {
    
    item2market();
    
    postdo = function(url) {
        
        new Ajax.Updater('itemsbody', url, {onComplete:item2market});
        return false;
        
    };
    
}


})();