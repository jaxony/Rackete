var script = document.createElement('script');
script.src = 'jquery-3.2.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var contextMenuItem = {
  "id": "searchWord",
  "title": "Search Word",
  "contexts": ["selection"]
};

function getMethods(obj)
{
  var res = [];
  for(var m in obj) {
    if(typeof obj[m] == "function") {
      res.push(m)
    }
  }
  return res;
}

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function(clickData){
  if (clickData.menuItemId == "searchWord" && clickData.selectionText) 
  {
    var query = clickData.selectionText;
    var url_dictcc = "http://www.dict.cc/?s=" + query;
    var url_linguee = "https://www.linguee.com/english-german/search?query=" + query;
    var parsed_html = null;

    // use AJAX to get HTML of dictionary query
    $.get(url_dictcc, function(data, status){
      // scrape content table
      var content_table =  $($.parseHTML(data)).filter("#maincontent").find('table');
      // scrape definition rows
      var content_rows = $(content_table[2]).find('tbody').find('tr').filter(function() {
        return this.id.match(/tr[0-9]+/)
      });

      console.log("Found " + content_rows.length + " translations.");
      
      var i;
      var text = []
      console.log(typeof content_rows[0]);
      for (i=0; i<content_rows.length; i++) {
        text.push($(content_rows[i]).find('td').filter(function() {
          return this.className.match('td7nl')
        })[0].innerText);
      }
      console.log(text);
    }); 
  }
});

