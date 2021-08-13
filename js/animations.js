let animations = {
    market: {
        'widthHeight':[
            '#marketSection',
            '#marketTitleContainer.titleContainer',
            '#marketSection .inactive',
            '#marketSection .inactive ion-icon[name="expand"]'
        ],
        'position':[
            '#marketSection'
        ]
    },
    marketColumn: {
        'widthHeight':[
            '.plantPotContainer',
            '.itemToken',
            '.cardsAndItemContainer .cardContainer[type="plant"]',
            '.cardsAndItemContainer .cardContainer[type="plant"] .plant',
            '.cardsAndItemContainer .cardContainer[type="plant"] .plantBanner',
            '.cardsAndItemContainer .cardContainer[type="plant"] .plantSymbol',
            '.cardsAndItemContainer .cardContainer[type="plant"] .plantVerdancy',
            '.cardsAndItemContainer .cardContainer[type="plant"] .plantVPs',
            '.cardsAndItemContainer .cardContainer[type="plant"] .lightingIcon',
            '.cardsAndItemContainer .cardContainer[type="room"]',
            '.cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-top',
            '.cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-right',
            '.cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-bottom',
            '.cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-left',
            '.cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-top .lightingIcon',
            '.cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-right .lightingIcon',
            '.cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-bottom .lightingIcon',
            '.cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-left .lightingIcon'
        ],
        'position':[
            '.cardsAndItemContainer .cardContainer[type="plant"] .plantBanner',
            '.cardsAndItemContainer .cardContainer[type="plant"] .plantSymbol',
            '.cardsAndItemContainer .cardContainer[type="plant"] .plantVerdancy',
            '.cardsAndItemContainer .cardContainer[type="plant"] .plantVPs',
            '.cardsAndItemContainer .cardContainer[type="plant"] .lightingIcon',
            '.cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-top',
            '.cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-right',
            '.cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-bottom',
            '.cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-left'
        ]
    },
    tableau: {
        'widthHeight':[
            '#tableauSection',
            '#tableauSection #playerTableauTitleContainer',
            '#tableauSection #homeContentContainer',
            '#tableauSection #playerInfoContainer',
            '#tableauSection #playerInfoContainer .playerInfoTitle',
            '#tableauSection .inactive',
            '#tableauSection .inactive ion-icon[name="expand"]',
            '#tableauSection #cardToPlace',
            '#tableauSection #chosenCardBackground',
            '#tableauSection .itemContainer',
            '#tableauSection .playerInfoTitle',
            '#tableauSection #swapItemsBtn',
            '#tableauSection #mapContainer',
            '#tableauSection #mapZoomControls',
            '#tableauSection #mapNavControls'
        ],
        'position':[
            '#tableauSection',
            '#tableauSection #cardToPlace',
            '#tableauSection #chosenCardBackground',
            '#tableauSection .itemContainer',
            '#tableauSection #mapContainer',
            '#tableauSection #mapZoomControls',
            '#tableauSection #mapNavControls'
        ]
    }
};


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
    'expanded': {
        'start': 'collapsed',
        'finish': 'expanded',
        'transition': 'medium' // .7s
    },
    'collapsed': {
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

let animationMode = '';

function positionAnimation(elem, mode) {
    var collapsed = elem[0].getBoundingClientRect();
    $(elem).addClass('animatingElem');
    $(elem).removeClass(animationClasses[mode].start);
    $(elem).addClass(animationClasses[mode].finish);
    var expanded = elem[0].getBoundingClientRect();
    var invertedTop = collapsed.top - expanded.top;
    var invertedLeft = collapsed.left - expanded.left;
    $(elem).css('transform-origin', 'top left');
    $(elem).css('transform', `translate(${invertedLeft}px, ${invertedTop}px)`);
    requestAnimationFrame(function(){
        $(elem).addClass(`${animationClasses[mode].transition}Transition`);
        $(elem).css('transform', '');
    });
}


function widthHeightAnimation(elem, mode) {
    $(elem).addClass('animatingElem');  
    $(elem).removeClass(animationClasses[mode].start);
    $(elem).addClass(animationClasses[mode].finish);
    $(elem).addClass(`${animationClasses[mode].transition}Transition`); 
}

function swapActiveMainSection(){

    let marketState = '';
    let tableauState = '';

    if($('#marketSection').hasClass('expanded')) {
        marketState = 'collapsed';
        tableauState = 'expanded';
    } else if($('#tableauSection').hasClass('expanded')) {
        marketState = 'expanded';
        tableauState = 'collapsed';
    }

    // Market Animation Styles:
    
    for (let i = 0; i < animations.market.widthHeight.length; i++) {
        widthHeightAnimation($(animations.market.widthHeight[i]), marketState);
    }
    for (let i = 0; i < animations.market.position.length; i++) {
        positionAnimation($(animations.market.position[i]), marketState);
    }

    // Market Column Animation Styles:

    for (let i = 0; i < animations.marketColumn.widthHeight.length; i++) {
        for (let j = 0; j < 4; j++) {
            widthHeightAnimation($(`#marketSection .marketColumn[column="${j}"]  ${animations.marketColumn.widthHeight[i]}`), marketState);
        }
    }

    for (let i = 0; i < animations.marketColumn.position.length; i++) {
        for (let j = 0; j < 4; j++) {
            positionAnimation($(`#marketSection .marketColumn[column="${j}"]  ${animations.marketColumn.position[i]}`), marketState);
        }
    }

    // Tableau Animation Styles:

    for (let j = 0; j < animations.tableau.widthHeight.length; j++) {
        widthHeightAnimation($(animations.tableau.widthHeight[j]), tableauState);
    }

    for (let j = 0; j < animations.tableau.position.length; j++) {
        positionAnimation($(animations.tableau.position[j]), tableauState);
    }

}

let startingPotCount = 0;
function animateStartingPot(thisPot) {
    var collapsed = thisPot[0].getBoundingClientRect();
    thisPot[0].classList.add('animatingElem');
    thisPot[0].classList.remove('startingPos');
    thisPot[0].classList.add('expanded');
    var expanded = thisPot[0].getBoundingClientRect();
    var invertedTop = collapsed.top - expanded.top;
    var invertedLeft = collapsed.left - expanded.left;
    thisPot[0].style.transformOrigin = 'top left';
    thisPot[0].style.transform = `
        translate(${invertedLeft}px, ${invertedTop}px)
    `; 
    requestAnimationFrame(function(){
        thisPot[0].classList.add('longTransition'); 
        thisPot[0].style.transform = '';
    });

    startingPotCount++;

    if(startingPotCount == 4) {

        // var transition = document.querySelectorAll(".longTransition.animatingElem");
        // transition.classList.remove('longTransition');
        // transition.classList.remove('animatingElem');

        // Apply to all starting pot elements:

        // setTimeout(function(){
        //     thisPot[0].style.transformOrigin = '';
        //     thisPot[0].classList.remove('longTransition');
        //     thisPot[0].classList.remove('animatingElem');
        // }, 1000);

    }
}

let startingPlantCardCount = 0;
function animateStartingPlantCard(thisPlant) {
    var collapsed = thisPlant[0].getBoundingClientRect();
    thisPlant[0].classList.add('animatingElem');
    thisPlant[0].classList.remove('startingPos');
    thisPlant[0].classList.add('expanded');
    var expanded = thisPlant[0].getBoundingClientRect();
    var invertedTop = collapsed.top - expanded.top;
    var invertedLeft = collapsed.left - expanded.left;
    thisPlant[0].style.transformOrigin = 'top left';
    thisPlant[0].style.transform = `
        translate(${invertedLeft}px, ${invertedTop}px)
    `; 
    requestAnimationFrame(function(){
        thisPlant[0].classList.add('longTransition'); 
        thisPlant[0].style.transform = '';
    });

    startingPlantCardCount++;

    if(startingPlantCardCount == 4) {
        // Apply to all starting PlantCard elements:

        // setTimeout(function(){
        //     thisPlant[0].style.transformOrigin = '';
        //     thisPlant[0].classList.remove('longTransition');
        //     thisPlant[0].classList.remove('animatingElem');
        // }, 1000);

    }
}

let startingItemTokenCount = 0;
function animateStartingItemToken(thisItem) {
    var collapsed = thisItem[0].getBoundingClientRect();
    thisItem[0].classList.add('animatingElem');
    thisItem[0].classList.remove('startingPos');
    thisItem[0].classList.add('expanded');
    var expanded = thisItem[0].getBoundingClientRect();
    var invertedTop = collapsed.top - expanded.top;
    var invertedLeft = collapsed.left - expanded.left;
    thisItem[0].style.transformOrigin = 'top left';
    thisItem[0].style.transform = `
        translate(${invertedLeft}px, ${invertedTop}px)
    `; 
    requestAnimationFrame(function(){
        thisItem[0].classList.add('longTransition'); 
        thisItem[0].style.transform = '';
    });

    startingItemTokenCount++;

    if(startingItemTokenCount == 4) {
        // Apply to all starting ItemToken elements:

        // setTimeout(function(){
        //     thisItem[0].style.transformOrigin = '';
        //     thisItem[0].classList.remove('longTransition');
        //     thisItem[0].classList.remove('animatingElem');
        // }, 1000);

    }
}

let startingRoomCardCount = 0;
function animateStartingRoomCard(thisRoom) {
    var collapsed = thisRoom[0].getBoundingClientRect();
    thisRoom[0].classList.add('animatingElem');
    thisRoom[0].classList.remove('startingPos');
    thisRoom[0].classList.add('expanded');
    var expanded = thisRoom[0].getBoundingClientRect();
    var invertedTop = collapsed.top - expanded.top;
    var invertedLeft = collapsed.left - expanded.left;
    thisRoom[0].style.transformOrigin = 'top left';
    thisRoom[0].style.transform = `
        translate(${invertedLeft}px, ${invertedTop}px)
    `; 
    requestAnimationFrame(function(){
        thisRoom[0].classList.add('longTransition'); 
        thisRoom[0].style.transform = '';
    });

    startingRoomCardCount++;

    if(startingRoomCardCount == 4) {
        // Apply to all starting RoomCard elements:

        // setTimeout(function(){
        //     thisRoom[0].style.transformOrigin = '';
        //     thisRoom[0].classList.remove('longTransition');
        //     thisRoom[0].classList.remove('animatingElem');
        // }, 1000);

    }
}

function resetAnimationClasses(){
    $('.animatingElem').removeClass('animatingElem quickTransition shortTransition mediumTransition longTransition');
}
