
chrome.runtime.onMessage.addListener(function(text, sender, sendResponse) 
{
  // Only inject sidebar if it does not already exist
  var raketeSidebar = document.getElementById("raketeSidebar");

  if (!raketeSidebar) {
    console.log("Making new sidebar!!!");    
    raketeSidebar = document.createElement("div");
    raketeSidebar.id = "raketeSidebar";
    document.body.style.paddingRight = "350px";

    raketeSidebar.setAttribute("style", [
      'background-color: white;',
      'width: 250px;',
      'height: 100%;',
      'position: fixed;',
      'top: 0px;',
      'right: 0px;',
      'z-index: 9999;'].join('\n')
    );
    document.body.appendChild(raketeSidebar);
  }
  console.log("@@@@@@@@@@");
  // inject bootstrap
  var cssId = 'bootstrap';
  if (!document.getElementById(cssId))
  {
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('css/bootstrap.min.css');
    link.media = 'all';
    head.appendChild(link);
  }
  console.log("$$$$$$$$$$");
  // delete existing tables

  // make new table
  // console.log(typeof text);
  // console.log(text);
  // console.log(sender);
  // console.log(sendResponse);

  console.log(text);


  // make table for dict cc results
  var table = document.getElementById('dictcc');
  var tbody;
  if (!table) { // first time opening Rakete
    table = document.createElement('table');
    table.id = 'dictcc';
    table.classList.add('table', 'table-hover');

    // make table header upon creation
    var header = table.createTHead();
    header.innerHTML = '<tr>'
      + '<th>English</th>'
      + '<th>German</th>'
      +'</tr>';

    // make body upon creation 
    tbody = document.createElement('tbody');
    table.appendChild(tbody);

    // style the table
    table.setAttribute("style", [
      'padding: 10px'
      ].join('\n')
    );
    
    // add table to sidebar
    raketeSidebar.appendChild(table);

  } else { // searching for another word with Rakete open already
    // remove the table's existing body entries
    tbody = document.getElementById('dictcc').getElementsByTagName('tbody')[0];
    console.log(tbody);
    tbody.innerHTML = '';
  }

  // populate the table with new entries
  var numRows = Math.min(5, text.length);
  for (var i=0; i<numRows; i++) {
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');

    var text1 = document.createTextNode(text[i][0]);
    var text2 = document.createTextNode(text[i][1]);

    td1.appendChild(text1);
    td2.appendChild(text2);
    tr.appendChild(td1);
    tr.appendChild(td2);

    tbody.appendChild(tr);
  }
});