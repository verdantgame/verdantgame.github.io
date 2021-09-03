let animationMode = '';

let animationClasses = {
    'marketStartingPos': {
        'start': 'startingPos',
        'finish': 'expanded',
        'transition': 'long' // 1s
    },
    'tableauStartingPos': {
        'start': 'startingPos',
        'finish': 'expanded',
        'transition': 'veryLong' // 1.8s
    },
    'collapsed': {
        'start': 'collapsed',
        'finish': 'expanded',
        'transition': 'medium' // .7s
    },
    'expanded': {
        'start': 'expanded',
        'finish': 'collapsed',
        'transition': 'medium' // .7s
    },
    'showCardOptions': {
        'start': 'collapsed',
        'finish': 'expanded',
        'transition': 'quick' // .2s
    },
    'hideCardOptions': {
        'start': 'expanded',
        'finish': 'collapsed',
        'transition': 'quick' // .2s
    }
}

let animationLength = {
    'quick': 200,
    'short': 500,
    'medium': 700,
    'long': 1000
}

let sectionStates = {
    'market': 'expanded',
    'tableau': 'collapsed',
}

function swapActiveMainSection(){

    $('.gameSectionOverlayParent').removeClass('animatingElem quickTransition shortTransition mediumTransition longTransition');
    $('#tableauSection').removeClass('animatingElem quickTransition shortTransition mediumTransition longTransition');
    $('#playerInfoContainer #mapContainer').removeClass('animatingElem quickTransition shortTransition mediumTransition longTransition');

    for (const [thisSection, thisState] of Object.entries(sectionStates)) {
        $(`[data-animation-group="${thisSection}"]`).each(function(){
            animateElem($(this), thisState);
        });
    }

    if(sectionStates.tableau == 'expanded') {
        sectionStates.tableau = 'collapsed';
        sectionStates.market = 'expanded';
        
    } else if(sectionStates.market == 'expanded') {
        sectionStates.market = 'collapsed';
        sectionStates.tableau = 'expanded';
    }

    temporarilyLockMap(700);

    // lockMap = true;
    // setTimeout(function(){
    //     lockMap = false;
    // }, 710);

}

function animateElem(elem, mode) {

    elem[0].style.transformOrigin = 'top left';
    
    let startTopPos = $(elem).position().top;
    let startLeftPos = $(elem).position().left;

    elem[0].classList.add('animatingElem');
    elem[0].classList.add(animationClasses[mode].finish);
    elem[0].classList.remove(animationClasses[mode].start);

    let endTopPos = $(elem).position().top;
    let endLeftPos = $(elem).position().left;

    if(startTopPos != endTopPos || startLeftPos != endLeftPos) {

        var invertedTop = startTopPos - endTopPos;
        var invertedLeft = startLeftPos - endLeftPos;
        
        elem[0].style.transform = `
            translate(${invertedLeft}px, ${invertedTop}px)
        `;

        requestAnimationFrame(function(){
            elem[0].classList.add(`${animationClasses[mode].transition}Transition`);
            elem[0].style.transform = '';
            $(elem).parent().one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
                elem[0].style.transformOrigin = '';
                elem[0].classList.remove(`${animationClasses[mode].transition}Transition`);
                elem[0].classList.remove('animatingElem');
            });
        }); 

    } else {
        requestAnimationFrame(function(){
            elem[0].classList.add(`${animationClasses[mode].transition}Transition`);
        }); 

    }

}

function animateMap(startTop, startLeft, endTop, endLeft) {

    var currentTransform = $('#mapHiddenOverlay').css('transform');
    var splitTransform = currentTransform.split('(');
    var zoomAmount = splitTransform[1].split(',');

    console.log(`transform: scale(${zoomAmount[0]})`);

    $('#mapHiddenOverlay').css({
        'top': endTop,
        'left': endLeft
    });
    var invertedTop = startTop - endTop;
    var invertedLeft = startLeft - endLeft;
    var invertedTransform =  `translate(${invertedLeft}px, ${invertedTop}px) scale(${zoomAmount[0]})`;
    $('#mapHiddenOverlay').css('transform', invertedTransform);
    requestAnimationFrame(function(){
        $('#mapHiddenOverlay').css('transform', `scale(${zoomAmount[0]})`);
    }); 
}

jQuery.fn.extend({
    // Modified and Updated by MLM
    // Origin: Davy8 (http://stackoverflow.com/a/5212193/796832)
    parentToAnimate: function(newParent, duration) {

        $(this).removeClass('animatingElem mediumTransition');

		var $element = $(this);
        var $oldParent = $element.parent()
        
		newParent = $(newParent); // Allow passing in either a JQuery object or selector
		var oldOffset = $element.offset();
        $(this).appendTo(newParent);
        var newOffset = $element.offset();

		var temp = $element.clone().appendTo('body');

		if($element[0].className.indexOf("activeCard") >= 0) {

			let mapZoomScale = Number(zoomLevel)/10;
            let cardToPlaceScale = 1;

            if($('#container').hasClass('mobileView')) cardToPlaceScale = 1.17;

			let startWidth = 0;
			let startHeight = 0;
			let endWidth = 0;
			let endHeight = 0;

			let startOpacity = 1;
			let endOpacity = 1;

            let zIndex = 1000;

			if(newParent[0].offsetParent.id == 'mapHiddenOverlay') {

                if($oldParent[0].className == 'mapTileContainer potentialPlacement activePotentialPlacement') {
                    startWidth = $element[0].offsetWidth * mapZoomScale;
                    startHeight = $element[0].offsetHeight * mapZoomScale;
                } else {
                    startWidth = $element[0].offsetWidth * cardToPlaceScale;
				    startHeight = $element[0].offsetHeight * cardToPlaceScale;
                }      
				
				endWidth = $element[0].offsetWidth * mapZoomScale;
				endHeight = $element[0].offsetHeight * mapZoomScale;

                zIndex = 10;

			} else if(newParent[0].offsetParent.id == 'playerInfoContainer' || newParent[0].offsetParent.id == 'homeContentContainer') {
				startWidth = $element[0].offsetWidth * mapZoomScale;
                startHeight = $element[0].offsetHeight * mapZoomScale;
				
				endWidth = $element[0].offsetWidth * cardToPlaceScale;
				endHeight = $element[0].offsetHeight * cardToPlaceScale;

                zIndex = 10;
			}
            
			temp.css({
                'width': startWidth,
				'height': startHeight,
				'position': 'absolute',
                'top': oldOffset.top,
				'left': oldOffset.left,
				'opacity': startOpacity,
				'zIndex': zIndex
			});
			
			$element.hide();

			temp.animate({
				'width': endWidth,
				'height': endHeight,
                'top': newOffset.top,
				'left': newOffset.left,
				'opacity': endOpacity,
				'zIndex': zIndex
			}, duration, function() {
				$element.show();
				temp.remove();
			});
		}

    }
});
