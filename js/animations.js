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
        lockMap = true;
    } else if(sectionStates.market == 'expanded') {
        sectionStates.market = 'collapsed';
        sectionStates.tableau = 'expanded';
        setTimeout(function(){
            lockMap = false;
        }, 710);
    }
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
            // $(elem).parent().one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
            //     elem[0].classList.remove(`${animationClasses[mode].transition}Transition`);
            //     elem[0].classList.remove('animatingElem');
            // });
        }); 

    }

}
