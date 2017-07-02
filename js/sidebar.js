
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
      'background-color: blue;',
      'width: 350px;',
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

  var table = [
    '<table class="table table-hover">',
    '<thead>', 
    '<tr>',
    '<th>Firstname</th>',
    '<th>Lastname</th>',
    '<th>Email</th>',
    '</tr>',
    '</thead>'
  ].join('\n');
  console.log(table);
  raketeSidebar.innerHTML = table;


});