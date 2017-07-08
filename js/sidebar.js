chrome.runtime.onMessage.addListener(function(text, sender, sendResponse) 
{
  // Only inject sidebar if it does not already exist
  var raketeSidebar = document.getElementById("raketeSidebar");

  if (!raketeSidebar) {
    console.log("Making new sidebar!!!");    
    raketeSidebar = document.createElement("div");
    raketeSidebar.id = "raketeSidebar";
    document.body.style.paddingRight = "250px";

    raketeSidebar.setAttribute("style", [
      'background-color: white;',
      'width: 250px;',
      'height: 100%;',
      'position: fixed;',
      'top: 0px;',
      'right: 0px;',
      'z-index: 9999;'].join(' ')
    );
    document.body.appendChild(raketeSidebar);
  }


  // inject twitter bootstrap if not already injected
  if (!document.getElementById("tw-bs-link")) {
    // inject custom bootstrap in 'style.min.css' into document
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id = 'tw-bs-link';
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('css/style.min.css');
    link.media = 'all';
    head.appendChild(link);

    // make rakete sidebar use bootstrap
    raketeSidebar.className = "tw-bs";
  }

  if (!document.getElementById("closeRakete")) {
    // add javascript function for close button
    var script = document.createElement('script');
    script.src = chrome.runtime.getURL('js/closeSidebar.js');
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);

    // add button
    var closeButtonDiv = document.createElement("div");
    closeButtonDiv.innerHTML = '<button type="button" class="close" id="closeRakete" aria-label="Close" onClick="closeSidebar()">'
                               + '<span aria-hidden="true">&times;</span>'
                               + '</button>';
    raketeSidebar.appendChild(closeButtonDiv);

  }

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