let scriptsLoaded = 0;
let imgsPreloaded = false;

let scriptsURL = [
    'js/data.js',
    'js/animations.js',
    'js/scripts.js',
    'js/image-preloader.js'
];

let checkLoadingStatusInterval;

$(document).ready(function(){
    checkLoadingStatusInterval = setInterval(checkLoadedState, 100);
    for (let i = 0; i < scriptsURL.length; i++) {
        loadScript(scriptsURL[i], scriptLoadTally);
    }
})

function loadScript(url, callback) {
    var body = document.getElementsByTagName('body')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    body.appendChild(script);
}

function scriptLoadTally() {
    scriptsLoaded++;
}

function preloadImgsCallback(){
    imgsPreloaded = true;
}

function checkLoadedState(){
    if (scriptsLoaded == scriptsURL.length && imgsPreloaded == true) {
        clearInterval(checkLoadingStatusInterval); 
        $('#loaderLayer').fadeOut();
        $('#setupLayer').fadeIn();  
        checkScreenWidth();
        setupDrawPiles();
        initiateMap();  
    }
}