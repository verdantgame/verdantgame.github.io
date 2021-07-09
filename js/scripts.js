// If device is touch capable, use touch as the trigger, otherwise the user is using a desktop computer so use click
var touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

function initFuncs(){
    setupCarousel();
}

function setupCarousel(){
    let carouselRaw = [
        {   
            'id': 'g',
            'config': [5, 3, 3],
            'order': [0, 1, 2],
            'pos': 0
        },{
            'id': 'p',
            'config': [4, 4, 4, 4, 4],
            'order': [0, 1, 2, 3, 4],
            'pos': 0
        }
    ];

    for (let i = 0; i < carouselRaw.length; i++) {
        shuffle(carouselRaw[i]['order']);
    }

    let masterIndex = 0;
    let carouselData = [];

    while (carouselData.length < 17) {
        let thisIndex = carouselRaw[masterIndex]['pos'];
        let thisRange = carouselRaw[masterIndex]['config'][carouselRaw[masterIndex]['order'][thisIndex]];
        let uniqueCombo = false;
        while (!uniqueCombo) {
            let randNum = Math.floor(Math.random() * thisRange);
            let thisCombo = `${carouselRaw[masterIndex]['id']}-${carouselRaw[masterIndex]['order'][thisIndex]}-${randNum}`;
            if(carouselData.indexOf(thisCombo) == -1) {		
                carouselData.push(thisCombo);
                uniqueCombo = true;
            }
        }
        carouselRaw[masterIndex]['pos'] == carouselRaw[masterIndex]['config'].length - 1 ? carouselRaw[masterIndex]['pos'] = 0 : carouselRaw[masterIndex]['pos']++;

        masterIndex == 0 ? masterIndex = 1 : masterIndex = 0;

    }

    let carouselHTML = '';

    for (let i = 0; i < carouselData.length; i++) {
        carouselHTML += `
            <div class="slideshow-slide">
                <img src="img/demo-carousel/${carouselData[i]}.jpg">
            </div>
        `;
    }

    $('.slideshow-block > .slideshow-animation').html(carouselHTML);
    setTimeout(function(){
        initSmoothScrolling('.slideshow-block','smoothscroll');
    }, 10);
}

function initSmoothScrolling(container,animation){
    /*
    * @param {String} container Class or ID of the animation container
    * @param {String} animation Name of the animation, e.g. smoothscroll
    */
    var sliderWidth = 0;	
    var slidesNumber = $(container+'>div>div').length;
    var sliderHeight = $(container + '>div>div:first-of-type').outerHeight(false);
    var slideWidth = $(container + '>div>div:first-of-type').outerWidth(false);
    var totalAnimationWidth = slideWidth * slidesNumber;
    let containerWidth = $(container).width();
    // detect number of visible slides
    var slidesVisible = containerWidth / slideWidth;	
    var maxSlidesVisible = Math.ceil(slidesVisible);

    // count slides to determine animation speed
    var speed = slidesNumber*2;
    // append the tail	
    $(container+'>div>div').slice(0,maxSlidesVisible).clone().appendTo($(container+'>div'));	

    // Detect the slider width with appended tail
    $(container+'>div>div').each(function(){
        sliderWidth += $(this).outerWidth(false);
    });

    // set slider dimensions
    $(container+'>div').css({'width':sliderWidth,'height':sliderHeight});

    //   Insert styles to html
    $("<style type='text/css'>@keyframes "+animation+" { 0% { margin-left: 0px; } 100% { margin-left: -"+totalAnimationWidth+"px; } } "+container+">div>div:first-child { -webkit-animation: "+animation+" "+speed+"s linear infinite; -moz-animation: "+animation+" "+speed+"s linear infinite; -ms-animation: "+animation+" "+speed+"s linear infinite; -o-animation: "+animation+" "+speed+"s linear infinite; animation: "+animation+" "+speed+"s linear infinite; }</style>").appendTo("head");	
}

$(document).on(touchEvent, '#frontPageGameInstructionsButton', function(){
	openInNewTab(rulesURL);
});

$(document).on(touchEvent, '#startGame', function(){
	$('body').addClass('gameView');
	$('.layer').hide();
	$('#gameLayer').show();
});


function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === what) {
            count++;
        }
    }
    return count;
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function openInNewTab(url) {
	var win = window.open(url, '_blank');
	win.focus();
  }

function returnDuplicates(arr, arr2) {
    var ret = [];
    for(var i in arr) {   
        if(arr2.indexOf(arr[i]) > -1){
            ret.push(arr[i]);
        }
    }
    return ret.toString();
};


function allPossibleCases(arr) {
	if (arr.length === 0) {
		return [];
	} else if (arr.length ===1) {
		return arr[0];
	} else {
		var result = [];
		var allCasesOfRest = allPossibleCases(arr.slice(1));  // recur with the rest of array
		for (var c in allCasesOfRest) {
			for (var i = 0; i < arr[0].length; i++) {
				result.push(`${arr[0][i]} ${allCasesOfRest[c]}`);
			}
		}
		return result;
	}
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
  
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
  
	  // Pick a remaining element...
	  randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex -= 1;
  
	  // And swap it with the current element.
	  temporaryValue = array[currentIndex];
	  array[currentIndex] = array[randomIndex];
	  array[randomIndex] = temporaryValue;
	}
  
	return array;
}
