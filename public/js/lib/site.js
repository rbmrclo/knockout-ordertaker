function setDynamicCss() {
  var content = document.getElementById('content');
  var windowHeight = window.innerHeight;
  content.style.minHeight = resizeHeight(windowHeight) + "px";
}

function resizeHeight(height){
  return (height * .85)
}

setDynamicCss();
