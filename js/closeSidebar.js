function closeSidebar() {
  var raketeSidebar = document.getElementById("raketeSidebar");
  if (raketeSidebar) {  
    raketeSidebar.parentNode.removeChild(raketeSidebar);
    document.body.style.paddingRight = "0px";
  }
}