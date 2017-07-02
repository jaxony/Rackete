var script = document.createElement('script');
script.src = 'jquery-3.2.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var contextMenuItem = {
  "id": "searchWord",
  "title": "Search Word",
  "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function(clickData, tab){
  if (clickData.menuItemId == "searchWord" && clickData.selectionText && tab) 
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
      
      var i, j;
      var text = [];
      for (i=0; i<content_rows.length; i++) {
        text.push($(content_rows[i]).find('td').filter(function() {
          return this.className.match('td7nl')
        }));
        //console.log(text[text.length-1]);
        for (j=0; j<2; j++) {
          text[text.length-1][j] = ($(text[text.length-1][j]).find('a'))[0].innerText;
        }
        console.log(text[text.length-1]);
      }
      //console.log(text);

      // var code = [
      //   'var raketeSidebar = document.createElement("div");',
      //   'document.body.style.paddingRight = 350px;',
      //   'raketeSidebar.setAttribute("style", "'
      //     + 'background-color: red; '
      //     + 'width: 350px; '
      //     + 'height: 100%; '
      //     + 'position: fixed; '
      //     + 'right: 0px; '
      //     + 'top: 0px; '
      //     + 'z-index: 9999; '
      //     + '");',
      //     'document.body.appendChild(raketeSidebar);'
      // ].join('\n');

      /* Create the code to be injected */
      var code = [
          'var d = document.createElement("div");',
          'document.body.style.paddingRight = "350px";',
          'd.setAttribute("style", "'
              + 'background-color: blue; '
              + 'width: 350px; '
              + 'height: 100%; '
              + 'position: fixed; '
              + 'top: 0px; '
              + 'right: 0px; '
              + 'z-index: 9999; '
              + '");',
          'document.body.appendChild(d);'
      ].join("\n");

      /* Inject the code into the current tab */
      chrome.tabs.executeScript(tab.id, { code: code });

    }); 
  }
});

