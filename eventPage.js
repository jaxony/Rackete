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

function parseDictCC(data) {
  // parse the DOM (data) for dictionary entries.
  // Returns an array of [English, German] array entries.

  var text = [];

  // scrape content table
  var content_table =  $($.parseHTML(data)).filter("#maincontent").find('table');
  
  // scrape definition rows
  var content_rows = $(content_table[2]).find('tbody').find('tr').filter(function() {
    return this.id.match(/tr[0-9]+/)
  });

  console.log("Found " + content_rows.length + " translations.");
  
  var i, j;
  for (i=0; i<content_rows.length; i++) {
    // first add relevant DOM objects to `text` array
    text.push($(content_rows[i]).find('td').filter(function() {
      // <td> tags with class 'td7nl' contain dictionary entries
      return this.className.match('td7nl')
    }));
    
    // now parse the DOM object for innerText, 
    // and replace object with string (dictionary entries)
    for (j=0; j<2; j++) {
      // index 0 is the English, entry 1 is the German entry
      text[text.length-1][j] = parseDictCCEntry(text[text.length-1][j]);
      console.log(text[text.length-1]);
    }
  }
  console.log('Finished parsing DictCC.');
  return text;
}

function getData(url, parse) {
  // get the page content using AJAX

  return new Promise((resolve, reject) => {
    $.get(url)
    .done((data) => {
      console.log('Success: got data from ' + url);
      resolve(data); // resolve the promise if data is retrieved
    })
    .fail((xhr, status, err) => {
      console.log('Failed to get data from ' + url);
      reject(status + err.message);
    });
  });
}

function parseLinguee(data) {
  var text = [];
  console.log('Finished parsing Linguee.');
  return text;
}

function displayEntries(url_dictcc, url_linguee, tabId) {
  
  // have a getData generic function that $.gets the url content,
  // and then if success, apply the callback parseDictCC on the data 
  // returned.
  Promise.all([
    getData(url_dictcc),
    getData(url_linguee)
  ])
  .then((datas) => {
    return [parseDictCC(datas[0]), parseLinguee(datas[1])]
  })
  .then((entries) => {
    chrome.tabs.executeScript(
      tabId, 
      { file: "js/sidebar.js" }, 
      chrome.tabs.sendMessage(tabId, entries)
    );
  })
  .catch((error) => {
    console.log('Woops! ' + error.message);
  });

  // $.when(
  //   // wait for AJAX to scrape the two webpages
  //   getDictCcEntries(url_dictcc),
  //   getLingueeEntries(url_linguee)

  // ).then(function(dictcc_entries, linguee_entries) {
  //   // inject sidebar into active tab
  //   // use Chrome message API to pass entry arrays to js/sidebar.js
  //   console.log('Executing script after AJAX');
  //   chrome.tabs.executeScript(tabId, { file: "js/sidebar.js" }, function() {
  //     chrome.tabs.sendMessage(tabId, dictcc_entries);
  //   });
  // });
}

chrome.contextMenus.onClicked.addListener(function(clickData, tab) {
  if (clickData.menuItemId == "searchWord" && clickData.selectionText && tab) 
  {
    var query = clickData.selectionText;
    var url_dictcc = "http://www.dict.cc/?s=" + query;
    var url_linguee = "https://www.linguee.com/english-german/search?query=" + query;

    displayEntries(url_dictcc, url_linguee, tab.id);
  }
});

