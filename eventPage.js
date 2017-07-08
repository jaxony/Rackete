var script = document.createElement('script');
script.src = 'js/jquery-3.2.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var contextMenuItem = {
  "id": "searchWord",
  "title": "Search Word",
  "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenuItem);

function parseDictCCEntry(entry) {
  // given a HTML DOM <td> object in dict.cc of class 'td7nl',
  // get the innerText of its children attribute tags, and
  // add the words to an array.
  //
  // Return a concatenated string of innerText of <a> 
  // within <td class='td7nl'>.
  var entryWords = [];
  var entryAttributes = $(entry).find('a').filter('a');
  
  for (var i=0; i<entryAttributes.length; i++) {
    entryWords.push(entryAttributes[i].innerText);
  }
  return entryWords.join(' ');
}

chrome.contextMenus.onClicked.addListener(function(clickData, tab) {
  if (clickData.menuItemId == "searchWord" && clickData.selectionText && tab) 
  {
    var query = clickData.selectionText;
    var url_dictcc = "http://www.dict.cc/?s=" + query;
    var url_linguee = "https://www.linguee.com/english-german/search?query=" + query;
    var parsed_html = null;

    // use AJAX to get HTML of dictionary query
    $.get(url_dictcc, function(data, status) {
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
        for (j=0; j<2; j++) { // index 0 is the English entry, entry 1 is the German entry
          // number of words in the entry
          console.log(text[text.length-1][j]);
          text[text.length-1][j] = parseDictCCEntry(text[text.length-1][j]);
          //text[text.length-1][j] = ($(text[text.length-1][j]).find('a'))[0].innerText;
        }
        console.log(text[text.length-1]);
      }

      // inject code into active tab
      chrome.tabs.executeScript(tab.id, { file: "js/sidebar.js" }, function() {
        chrome.tabs.sendMessage(tab.id, text);
      });
    }); 
  }
});

