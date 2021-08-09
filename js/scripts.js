// If device is touch capable, use touch as the trigger, otherwise the user is using a desktop computer so use click
var touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

var allPlantCards = [];
var allRoomCards = [];
var allItemTokens = [];
var allPlantPots = [];

var initialPlantCards = [];
var initialRoomCards = [];
var initialItemTokens = [];
var initialPlantPots = [];

let changeOfView = false;
let currentView = '';
let newView = '';

$(window).resize(function() {
    checkScreenWidth();
});

function checkScreenWidth(){
    changeOfView = false;
	var windowSize = $(window).width();

	if(windowSize <= 539) {
		if(currentView != 'mobileView') {
			changeOfView = true;
			newView = 'mobileView';
		}
	} else if(windowSize > 539) {
		if(currentView != 'wideScreenView') {
			changeOfView = true;
			newView = 'wideScreenView';
		}
	}

	if(changeOfView) {
        $('body > #container').removeClass('mobileView wideScreenView').addClass(newView);
        currentView = newView;
	}
}

function initFuncs(){
    checkScreenWidth();
    setupDrawPiles();
    initiateMap();
}

function setupDrawPiles(){
    // create and shuffle plant card draw pile array
    allPlantCards = shuffle(plantCards);

    // create and shuffle room card draw pile array
    let initRoomCards = [];
    for (const [key, value] of Object.entries(roomCards)) {
        for (let i = 0; i < value.length; i++) {
            let thisRoomCard = {
                'cardType': 'room',
                'plantType': key,
                'img': key,
                'lighting': value[i],
                'item': 'none'
            }
            initRoomCards.push(thisRoomCard);
        }
    }

    allRoomCards = shuffle(initRoomCards);

    // create and shuffle item tokens draw pile array

    // var plantTypes = ['flowering', 'foliage', 'succulent', 'unusual', 'vining'];

    let initItemTokens = [];
    for (const [key, value] of Object.entries(itemsAndNurtureItems)) {
        for (let i = 0; i < value.length; i++) {
            if(key == 'items') {
                for (let j = 0; j < plantTypes.length; j++) {
                    initItemTokens.push(`${key}_${plantTypes[j]}-${itemsAndNurtureItems[key][i]}`);
                }
            } else if(key == 'itemsNurture') {
                for (let j = 0; j < 15; j++) {
                    initItemTokens.push(`${key}_${itemsAndNurtureItems[key][i]}`);
                }
            }
            
        }
    }

    // create and shuffle available plant pots

    let plantPots = ['concrete', 'wood', 'porcelain'];
    for (let i = 0; i < plantPots.length; i++) {
        for (let j = 0; j < 15; j++) {
            let randNum = Math.floor(Math.random() * 3);
            allPlantPots.push(`${plantPots[i]}-${randNum}`);
        }
    }
    
    allItemTokens = shuffle(initItemTokens);

    // console.log(`allPlantCards: `, allPlantCards);
    // console.log(`allRoomCards: `, allRoomCards);
    // console.log(`allItemTokens: `, allItemTokens);
    // console.log(`allPlantPots: `, allPlantPots);

    setupInitialCardsAndItems();

}

function setupInitialCardsAndItems() {

	// since there are 4 tiles to be generated, the below loop is actioned 4 times
	for (let i = 0; i < 4; i++) {
		// the first tile is spliced and stored in the "thisTile" variable
		let thisPlantCard = allPlantCards.splice(0, 1);
        let thisRoomCard = allRoomCards.splice(0, 1);
        let thisItemToken = allItemTokens.splice(0, 1);
        let thisPlantPot = allPlantPots.splice(0, 1);

		// finally push the tile information into the "initialTiles" variable which will eventually hold the information for all 4 initial tiles to be displayed

        initialPlantCards.push(thisPlantCard[0]);
        initialItemTokens.push(thisItemToken[0]);
        initialRoomCards.push(thisRoomCard[0]);
        initialPlantPots.push(thisPlantPot[0]);
	}

	let initialMarketHTML = '';

	// again, since there are 4 combinations of tiles+tokens container, the below loop is actioned 4 times
	for (let k = 0; k < 4; k++) {
		// the below code generates the HTML to store information for each tile and token combination and then inserts it into the DOM
		initialMarketHTML += `
            <div class="marketColumn" column="${k}">
                <div class="plantPotContainer startingPos">
                    <img class="plantPot" src="img/pots/${initialPlantPots[k]}.png" alt="" />
                </div>
                <div class="cardsAndItemContainer">
                    ${generateCard(initialPlantCards[k], 'plant', 'init')}
                    ${generateItem(initialItemTokens[k], 'init')}
                    ${generateCard(initialRoomCards[k], 'room', 'init')}
                </div>
            </div>
        `;
	}

	$('#marketCardColumns').append(initialMarketHTML);

}

$(document).on('mouseenter','#container.wideScreenView #marketSection.gameSection:not(.expandAnimation):not(.initSetup) #marketCardColumns .marketColumn .cardsAndItemContainer',function(){
	$(this).closest('.marketColumn').addClass('activeColumn');
    $(this).closest('#marketCardColumns').addClass('activeColumnView');
});

$(document).on('mouseleave','#container.wideScreenView #marketSection.gameSection:not(.expandAnimation):not(.initSetup) #marketCardColumns .marketColumn .cardsAndItemContainer',function(){
	$('.activeColumn').addClass('deactivedColumn').removeClass('activeColumn');
    $('.activeColumnView').removeClass('activeColumnView');
    setTimeout(function(){
        $('.deactivedColumn').removeClass('deactivedColumn');
    }, 200);
});

$(document).on(touchEvent,'#container.mobileView #marketSection.gameSection:not(.expandAnimation):not(.initSetup) #marketCardColumns .marketColumn .cardsAndItemContainer',function(){
	$(this).closest('.marketColumn').addClass('activeColumn');
    $(this).closest('#marketCardColumns').addClass('activeColumnView');
});

$(document).on(touchEvent,'#container.mobileView #marketSection.gameSection:not(.expandAnimation):not(.initSetup) #marketCardColumns .marketColumn .cardsAndItemContainer',function(){
	$('.activeColumn').addClass('deactivedColumn').removeClass('activeColumn');
    $('.activeColumnView').removeClass('activeColumnView');
    setTimeout(function(){
        $('.deactivedColumn').removeClass('deactivedColumn');
    }, 100);
});

function generateCard(thisCard, cardType, mode) {
	var thisCardHTML = `
        <div class="flip-card flip-back flip-${cardType}${mode == 'init' ? ` startingPos` : ``}">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <div class="backOfCardContainer">
                        <img class="${cardType}Back" src="img/${cardType}s/back.jpg" alt="" />
                    </div>
                </div>
                <div class="flip-card-back">
                    <div class="cardContainer" type="${cardType}"${cardType == 'plant' ? ` lighting="${thisCard.lighting.length}"` : ``}>
                        <img class="${cardType}" src="img/${cardType}s/${thisCard.img}.jpg" alt="" />
                        ${cardType == 'plant' ? `
                            <img class="plantBanner" src="img/plants/icons/banners/${thisCard.plantType}.png" alt="" />
                            <img class="plantSymbol" src="img/plants/icons/symbols/${thisCard.plantType}.png" alt="" />
                            <img class="plantVerdancy" src="img/plants/icons/verdancy/${thisCard.verdancyRequired}.png" alt="" />
                            <img class="plantVPs" src="img/plants/icons/vp/${thisCard.vps}.png" alt="" />
                        ` : ``}
    `;

    for (let i = 0; i < thisCard.lighting.length; i++) {
        thisCardHTML += `
            ${cardType == 'room' ? `<div class="lightingIconContainer" lighting-container="${i}">` : ``}
                <img class="lightingIcon" src="img/lighting/${thisCard.lighting[i]}.png" lighting-icon="${i}" alt="" />
            ${cardType == 'room' ? `</div>` : ``}
        `;
    }

    thisCardHTML += `
                    </div>
                </div>
            </div>
        </div>
    `;

	// return the HTML so that whenever the function is called, will now be a placeholder for the above HTML
	return thisCardHTML;
}

function generateItem(thisItem, mode) {
    let itemDetails = thisItem.split('_');
    let thisItemHTML = `<img class="itemToken${mode == 'init' ? ` startingPos` : ``}" src="img/${itemDetails[0]}/${itemDetails[1]}.png" />`
	// return the HTML so that whenever the function is called, will now be a placeholder for the above HTML
	return thisItemHTML;
}

function initSlideshow(container, animation){
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

var rulesURL = 'files/rules.pdf';

$(document).on(touchEvent, '#frontPageGameInstructionsButton', function(){
	openInNewTab(rulesURL);
});

let initMarketInterval;
let initMarketFlipCardsInterval;

// $(document).on(touchEvent, '#startGame', function(){
//     quickMarketSetup();
// });

$(document).on(touchEvent, '#startGame', function(){
	$('body').addClass('gameView');
	$('.layer').fadeOut();
    setTimeout(function(){
        $('#gameLayer').fadeIn();
        setTimeout(function(){
            initMarketInterval = setInterval(initMarketFunc, 200);    
        }, 400);
    }, 400);
	
    $('#gameLayer #gameSectionsParent .minimized ion-icon[name="expand"]').show();
});

let currentColumn = 3;
let currentMarketItem = 0;

function quickMarketSetup() {
    $('body').addClass('gameView');
	$('#setupLayer.layer').hide();
    $('#gameLayer.layer').show();
    $('#gameLayer #gameSectionsParent .minimized ion-icon[name="expand"]').show();
    $('.startingPos').addClass('notransition');
    $('.startingPos').removeClass('startingPos');
    $('.notransition')[0].offsetHeight;
    $('.notransition').removeClass('notransition');
    $('.flip-card-inner').addClass('notransition');
    $('.flip-card-inner').css('transform', 'rotateY(180deg) translate3d(0, 0, 1px)');
    $('.flip-card-inner')[0].offsetHeight;
    $('.flip-card-inner').removeClass('notransition');
    isolateFlipCardContents();
    $('#marketSection').addClass('notransition');
    $('#tableauSection').addClass('notransition');
    $('#marketSection').addClass('minimized').removeClass('expanded');
    $('#tableauSection').addClass('expanded').removeClass('minimized');
    $('#marketSection')[0].offsetHeight;
    $('#tableauSection')[0].offsetHeight;
    $('#marketSection').removeClass('notransition');
    $('#tableauSection').removeClass('notransition');
    chooseStartingPlayerCards();
    $('#playerInfoContainer #cardToPlace .flip-plant.startingPos').addClass('notransition');
    $('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room.startingPos').addClass('notransition');
    $('#playerInfoContainer #cardToPlace .flip-plant.startingPos').removeClass('startingPos')
    $('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room.startingPos').removeClass('startingPos')
    $('#playerInfoContainer #cardToPlace .flip-plant')[0].offsetHeight;
    $('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room')[0].offsetHeight;
    $('#playerInfoContainer #cardToPlace .flip-plant').removeClass('notransition');
    $('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room').removeClass('notransition');
    $('#playerInfoContainer #cardToPlace .flip-plant .flip-card-inner').addClass('notransition');
    $('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room .flip-card-inner').addClass('notransition');
    $('#playerInfoContainer #cardToPlace .flip-plant .flip-card-inner').css('transform', 'rotateY(180deg) translate3d(0, 0, 1px)'); 
    $('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room .flip-card-inner').css('transform', 'rotateY(180deg) translate3d(0, 0, 1px)'); 
    $('#playerInfoContainer #cardToPlace .flip-plant .flip-card-inner')[0].offsetHeight;
    $('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room .flip-card-inner')[0].offsetHeight;
    $('#playerInfoContainer #cardToPlace .flip-plant .flip-card-inner').removeClass('notransition');
    $('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room .flip-card-inner').removeClass('notransition');
    $('#homeContentContainer #playerInfoContainer #cardToPlace .flip-plant .flip-card-inner .flip-card-back .cardContainer').appendTo('#homeContentContainer #playerInfoContainer #cardToPlace');
    $('#homeContentContainer #playerInfoContainer #cardToPlace .flip-plant').remove();
    $('#homeContentContainer #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room .flip-card-inner .flip-card-back .cardContainer').appendTo('#homeContentContainer #mapContainer #mapHiddenOverlay #row-2-column-4');
    $('#homeContentContainer #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room').remove();
    $('.initSetup').removeClass('initSetup'); 
}

function initMarketFunc(){
    let marketItemClasses = ['.plantPotContainer', '.cardsAndItemContainer .flip-plant', '.cardsAndItemContainer .itemToken', '.cardsAndItemContainer .flip-room'];
    $(`.marketColumn[column="${currentColumn}"] ${marketItemClasses[currentMarketItem]}`).removeClass('startingPos');
    currentColumn--;
    if(currentColumn == -1 && (currentMarketItem + 1) < marketItemClasses.length) {
        currentColumn = 3;
        currentMarketItem++;
        clearInterval(initMarketInterval);
        setTimeout(function(){
            initMarketInterval = setInterval(initMarketFunc, 200);
        }, 250)
    } else if(currentColumn == -1 && (currentMarketItem + 1) == marketItemClasses.length) {
        clearInterval(initMarketInterval);
        currentColumn = 3;
        currentMarketItem = 0;
        setTimeout(function(){
            initMarketFlipCardsInterval = setInterval(flipInitMarketCards, 300);    
        }, 1000);
    }
}

function flipInitMarketCards() {
    let marketFlipCardClasses = ['.cardsAndItemContainer .flip-plant .flip-card-inner', '.cardsAndItemContainer .flip-room .flip-card-inner'];
    $(`.marketColumn[column="${currentColumn}"] ${marketFlipCardClasses[currentMarketItem]}`).css('transform', 'rotateY(180deg) translate3d(0, 0, 1px)'); 
    currentColumn--;
    if(currentColumn == -1 && (currentMarketItem + 1) < marketFlipCardClasses.length) {
        currentColumn = 3;
        currentMarketItem++;
    } else if(currentColumn == -1 && (currentMarketItem + 1) == marketFlipCardClasses.length) {
        clearInterval(initMarketFlipCardsInterval);
        setTimeout(function(){
            isolateFlipCardContents();
            setTimeout(function(){
                initPlayersHome();
            }, 300);

        }, 550);
    }
}

function isolateFlipCardContents() {
    $('.cardsAndItemContainer .flip-plant .flip-card-inner .flip-card-back .cardContainer').each(function(){
        let columnNum = $(this).closest('.marketColumn').attr('column');
        $(this).prependTo(`.marketColumn[column="${columnNum}"] .cardsAndItemContainer`);
    });

    $('.cardsAndItemContainer .flip-room .flip-card-inner .flip-card-back .cardContainer').each(function(){
        let columnNum = $(this).closest('.marketColumn').attr('column');
        $(this).appendTo(`.marketColumn[column="${columnNum}"] .cardsAndItemContainer`);
    });
    
    $('.flip-card').remove();
}

function initPlayersHome() {
    $('#marketSection').addClass('minimized').removeClass('expanded');
    $('#tableauSection').addClass('expanded expandAnimation').removeClass('minimized');

    setTimeout(function(){
        $('#tableauSection').removeClass('expandAnimation');
    }, 700);

    // target the next tile information in the allTiles array
    // splicing the first item removes it from the array and transfers the information into the "thisTile" variable

    chooseStartingPlayerCards();

    setTimeout(function(){
        $('#playerInfoContainer #cardToPlace .flip-plant.startingPos').removeClass('startingPos')
        $('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room.startingPos').removeClass('startingPos')
    }, 1000);

    setTimeout(function(){
        $('#playerInfoContainer #cardToPlace .flip-plant .flip-card-inner').css('transform', 'rotateY(180deg) translate3d(0, 0, 1px)'); 
        $('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room .flip-card-inner').css('transform', 'rotateY(180deg) translate3d(0, 0, 1px)'); 
    }, 3300);

    setTimeout(function(){
        $('#homeContentContainer #playerInfoContainer #cardToPlace .flip-plant .flip-card-inner .flip-card-back .cardContainer').appendTo('#homeContentContainer #playerInfoContainer #cardToPlace');
        $('#homeContentContainer #playerInfoContainer #cardToPlace .flip-plant').remove();
        $('#homeContentContainer #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room .flip-card-inner .flip-card-back .cardContainer').appendTo('#homeContentContainer #mapContainer #mapHiddenOverlay #row-2-column-4');
        $('#homeContentContainer #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room').remove();
        $('.initSetup').removeClass('initSetup'); 
    }, 3850);
}

function chooseStartingPlayerCards() {
    let startingPlant = allPlantCards.splice(0, 1);
    let startingRoom = allRoomCards.splice(0, 1);

    let startingPlantHTML = generateCard(startingPlant[0], 'plant', 'init');
    let startingRoomHTML = generateCard(startingRoom[0], 'room', 'init');

    $('#playerInfoContainer #cardToPlace').append(startingPlantHTML);
    $('#mapContainer #mapHiddenOverlay #row-2-column-4').append(startingRoomHTML);
}

$(document).on(touchEvent, '#gameLayer #gameSectionsParent .minimized:not(.initSetup)', function(){

    let thisID = $(this).attr('id');

    $('#gameLayer #gameSectionsParent .expanded').addClass('minimized').removeClass('expanded');
    $(this).addClass('expanded expandAnimation').removeClass('minimized');
    setTimeout(function(){
        $('.expanded.expandAnimation').removeClass('expandAnimation');
    }, 700)

    thisID != 'tableauSection' ? lockMap = true : lockMap = false;

});

let allDirections = ['up', 'down', 'left', 'right'];

let mapData = [];
let mapLoopLimit = 0;
var mapRowsColumnsIndexes = {
	rows: {},
	columns: {}
};


var mapMoveAmount = {
	'cardPos': {
		'top': 0,
		'left': 0
	},
	'view':{
		'wideScreenView': {
            'zoomIncs': {
                '11': {
                    'vertical': '61.5',
                    'horizontal': '59'
                },
                '9': {
                    'vertical': '75.5',
                    'horizontal': '48'
                },
                '7': {
                    'vertical': '58.5',
                    'horizontal': '37.5'
                },
                '5': {
                    'vertical': '42',
                    'horizontal': '37.5'
                },
            },
			'unit': 'px'
		},
		'mobileView': {
            'zoomIncs': {
                '11': {
                    'vertical': '18.5',
                    'horizontal': '11.5'
                },
                '9': {
                    'vertical': '15',
                    'horizontal': '9.5'
                },
                '7': {
                    'vertical': '11.75',
                    'horizontal': '7.5'
                },
                '5': {
                    'vertical': '16.8',
                    'horizontal': '10.7'
                },		
			},
			'unit': 'vw'
		}
	}
}

var mapStats = {
    'centerRow': 2,
	'centerColumn': 4,
	'viewableTileLimits': {
        up: 0,
        down: 0,
        left: 0,
        right: 0
	},
	'zoomStats': {
		'11': {
			xCardsVisible: 6, // horizontal
			yCardsVisible: 6  // vertical
		},
        '9': {
			xCardsVisible: 8, // horizontal
			yCardsVisible: 6  // vertical
		},
		'7': {
			xCardsVisible: 8, // horizontal
			yCardsVisible: 8  // vertical
		},
		'5': {
			xCardsVisible: 10, // horizontal
			yCardsVisible: 8  // vertical
		}
	},
	'directionStatus': {
		up: 'unlocked',
		down: 'unlocked',
		left: 'unlocked',
		right: 'unlocked'
	}
}

var zoomLevel = 9;
var lockFunction = false;
var lockMap = false;

// how big the generated map is
// up-down = 0-4 limits
// left-right = 0-8 limits
var mapLimits = {
	up: 0,
	down: 4,
	left: 0,
	right: 8
}

var mapRowRange = mapLimits.down - mapLimits.up + 1; // 5 rows
var mapColumnRange = mapLimits.right - mapLimits.left + 1; // 9 columns

function initiateMap() {

	// loop through all rows
	for (i = 0; i < mapRowRange; i++) {
		mapData[i] = [];
		for (j = 0; j < mapColumnRange; j++) {
			mapData[i][j] = {
				row: i,
				column: j,
				placedCard: false,
                placedItem: false
			}
		}
	}

	// now that the starting template for the map has been creatd (as well as the starting tile information), the map is generated
	generateMap();
}

function generateMap() {
	// the map HTML script
	var mapHTML = `<div id="mapHiddenOverlay">`;
	for (let i = 0; i < mapData.length; i++) {
		for (let j = 0; j < mapData[i].length; j++) {
			mapHTML += `<div id="row-${mapData[i][j].row}-column-${mapData[i][j].column}" class="mapTileContainer row-${mapData[i][j].row} column-${mapData[i][j].column}"></div>`;
		}
	}
    mapHTML += `
        </div>
    `;
	// the map is generated and all the exisiting information has been replaced
	$('#homeContentContainer #mapContainer').html(mapHTML);
    calculateViewableCardLimits();
}

function calculateViewableCardLimits() {
    let verticalLimit = Math.floor(mapStats.zoomStats[zoomLevel].yCardsVisible / 2) // left + right
    mapStats.viewableTileLimits.up = mapMoveAmount.cardPos.top + verticalLimit;
    mapStats.viewableTileLimits.down = mapMoveAmount.cardPos.top - verticalLimit;
    let horizontalLimit = Math.floor(mapStats.zoomStats[zoomLevel].xCardsVisible / 2) // left + right
    mapStats.viewableTileLimits.left = mapMoveAmount.cardPos.left + horizontalLimit;
    mapStats.viewableTileLimits.right = mapMoveAmount.cardPos.left - horizontalLimit;
}


$(document).keydown(function(e){

	if(!lockMap) {
		lockMap = true;
		setTimeout(function(){
			lockMap = false;
		}, 220);

        if (e.which == 37 || e.which == 65) { 
			if(mapStats.directionStatus.left == 'unlocked') {
				processMapMovement('left');
				return false;
			}
		 } else if (e.which == 38 || e.which == 87) { 
			if(mapStats.directionStatus.up == 'unlocked') {
				processMapMovement('up');
				return false;
			}
		 } else if (e.which == 39 || e.which == 68) { 
			if(mapStats.directionStatus.right == 'unlocked') {
				processMapMovement('right');
				return false;
			}
		 } else if (e.which == 40 || e.which == 83) { 
			if(mapStats.directionStatus.down == 'unlocked') {
				processMapMovement('down');
				return false;
			}
		 } else if (e.which == 9) { 
			e.preventDefault();
		 }
	}
    
});

$(document).on(touchEvent,'#mapNavControls .arrowImg',function(){
	let thisDirection = $(this).data('direction');
	processMapMovement(thisDirection);
});


function processMapMovement(thisDirection){

	if(thisDirection == 'up' || thisDirection == 'down') {	
		if(thisDirection == 'up') {
			mapMoveAmount.cardPos.top++;
		} else if(thisDirection == 'down') {	
			mapMoveAmount.cardPos.top--;
		}
		// checkMapLimits('vertical', thisDirection, mapMoveAmount.cardPos.top);
        checkMapLimits();
		updateMapPosition('vertical');
	}

	if(thisDirection == 'left' || thisDirection == 'right') {	
		if(thisDirection == 'left') {
			mapMoveAmount.cardPos.left++;
		} else if(thisDirection == 'right') {	
			mapMoveAmount.cardPos.left--;
		}
		// checkMapLimits('horizontal', thisDirection, mapMoveAmount.cardPos.left);
        checkMapLimits();
		updateMapPosition('horizontal');
	}

	$(`#mapNavControls #${thisDirection}Arrow`).addClass('activeArrow');
	setTimeout(function(){
		$('.activeArrow').removeClass('activeArrow');
	}, 100);

}

// mapStats = {
// 	'viewableTileLimits': {
// 		up: 0,
// 		down: 0,
// 		left: 0,
// 		right: 0
//  }
//}

function checkMapLimits(){
    for (let i = 0; i < allDirections.length; i++) {
        if(allDirections[i] == 'up' || allDirections[i] == 'down') {
            if(mapMoveAmount.cardPos.top == mapStats.viewableTileLimits[allDirections[i]]) {
                mapStats.directionStatus[allDirections[i]] = 'mapLimit-locked';
                $(`#mapNavControls #${allDirections[i]}Arrow`).hide();
            } else {
                mapStats.directionStatus[allDirections[i]] = 'unlocked';
                $(`#mapNavControls #${[allDirections[i]]}Arrow`).show();
            }
        } else if(allDirections[i] == 'left' || allDirections[i] == 'right') {
            if(mapMoveAmount.cardPos.left == mapStats.viewableTileLimits[allDirections[i]]) {
                $(`#mapNavControls #${allDirections[i]}Arrow`).hide();
                mapStats.directionStatus[allDirections[i]] = 'mapLimit-locked';
            } else {
                mapStats.directionStatus[allDirections[i]] = 'unlocked';
                $(`#mapNavControls #${[allDirections[i]]}Arrow`).show();
            }
        }
        
    }
}


$(document).on(touchEvent,'#mapZoomControls .zoomIcon.activeZoom',function(){

	if(!lockFunction) {

		lockFunction = true;

		setTimeout(function(){
			lockFunction = false;
		}, 220);

		let zoomInLimit = 11;
		let zoomOutLimit = 5;

		let zoomOption = $(this).data('zoom-mode');

		zoomOption == 'zoomIn' ? zoomLevel = zoomLevel + 2 : zoomLevel = zoomLevel - 2;

		if(zoomLevel == zoomInLimit) {
			$('#mapZoomControls .zoomInIcon').removeClass('activeZoom').addClass('inactiveZoom');
			$('#mapZoomControls .zoomInIcon').attr('src', 'img/map/zoomIn-inactive.png')
		} else if(zoomLevel == zoomOutLimit) {
			$('#mapZoomControls .zoomOutIcon').attr('src', 'img/map/zoomOut-inactive.png')
			$('#mapZoomControls .zoomOutIcon').removeClass('activeZoom').addClass('inactiveZoom');
		} else {
			if(zoomLevel < zoomInLimit) {
				if($('#mapZoomControls .zoomInIcon').hasClass('inactiveZoom')) {
					$('#mapZoomControls .zoomInIcon').removeClass('inactiveZoom').addClass('activeZoom');
					$('#mapZoomControls .zoomInIcon').attr('src', 'img/map/zoomIn.png')
				}
			}
			if(zoomLevel > zoomOutLimit) {
				if($('#mapZoomControls .zoomOutIcon').hasClass('inactiveZoom')) {
					$('#mapZoomControls .zoomOutIcon').removeClass('inactiveZoom').addClass('activeZoom');
					$('#mapZoomControls .zoomOutIcon').attr('src', 'img/map/zoomOut.png')
				}
			}

		}

		checkMapLimits();
		setZoom(zoomLevel, document.getElementById("mapHiddenOverlay"));

	}
});

function setZoom(newZoom, el) {

	let transformOriginPercentages = '';

	if(currentView == 'wideScreenView') {
		transformOriginPercentages = '50% 50%';
	} else if(currentView == 'mobileView') {
		transformOriginPercentages = '50% 50%';
	}

	let zoomScale = Number(newZoom)/10;

	var p = ["webkit", "moz", "ms", "o"],
	s = "scale(" + zoomScale + ")"
	
	for (var i = 0; i < p.length; i++) {
		el.style[p[i] + "Transform"] = s;
		el.style[p[i] + "TransformOrigin"] = transformOriginPercentages;
	}

	el.style["transform"] = s;
	el.style["transformOrigin"] = transformOriginPercentages;

	calculateViewableCardLimits();
}

function updateMapPosition(moveDirection) {
	if(moveDirection == 'horizontal') {
		let newLeftPosNum = (mapMoveAmount.cardPos.left * mapMoveAmount.view[currentView].zoomIncs[zoomLevel].horizontal);
		let newLeftPos = newLeftPosNum + mapMoveAmount.view[currentView].unit;
		$('#mapContainer #mapHiddenOverlay').css('left', newLeftPos);
	} else if(moveDirection == 'vertical') {
		let newTopPosNum = (mapMoveAmount.cardPos.top * mapMoveAmount.view[currentView].zoomIncs[zoomLevel].vertical);
		let newTopPos = newTopPosNum + mapMoveAmount.view[currentView].unit;
		$('#mapContainer #mapHiddenOverlay').css('top', newTopPos);
	}
}

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


// Carousel HTML:
// <p class="has-text-centered"><strong><em>Sample of extra cards available with the final game:</em></strong></p>
// <div class="slideshow-block">
//     <div class="slideshow-animation"></div>
// </div>


// function setupCarousel(){
//     let carouselRaw = [
//         {   
//             'id': 'g',
//             'config': [5, 3, 3],
//             'order': [0, 1, 2],
//             'pos': 0
//         },{
//             'id': 'p',
//             'config': [4, 4, 4, 4, 4],
//             'order': [0, 1, 2, 3, 4],
//             'pos': 0
//         }
//     ];

//     for (let i = 0; i < carouselRaw.length; i++) {
//         shuffle(carouselRaw[i]['order']);
//     }

//     let masterIndex = 0;
//     let carouselData = [];

//     while (carouselData.length < 17) {
//         let thisIndex = carouselRaw[masterIndex]['pos'];
//         let thisRange = carouselRaw[masterIndex]['config'][carouselRaw[masterIndex]['order'][thisIndex]];
//         let uniqueCombo = false;
//         while (!uniqueCombo) {
//             let randNum = Math.floor(Math.random() * thisRange);
//             let thisCombo = `${carouselRaw[masterIndex]['id']}-${carouselRaw[masterIndex]['order'][thisIndex]}-${randNum}`;
//             if(carouselData.indexOf(thisCombo) == -1) {		
//                 carouselData.push(thisCombo);
//                 uniqueCombo = true;
//             }
//         }
//         carouselRaw[masterIndex]['pos'] == carouselRaw[masterIndex]['config'].length - 1 ? carouselRaw[masterIndex]['pos'] = 0 : carouselRaw[masterIndex]['pos']++;

//         masterIndex == 0 ? masterIndex = 1 : masterIndex = 0;

//     }

//     let carouselHTML = '';

//     for (let i = 0; i < carouselData.length; i++) {
//         carouselHTML += `
//             <div class="slideshow-slide">
//                 <img src="img/demo-carousel/${carouselData[i]}.jpg">
//             </div>
//         `;
//     }

//     $('.slideshow-block > .slideshow-animation').html(carouselHTML);
//     setTimeout(function(){
//         initSlideshow('.slideshow-block','smoothscroll');
//     }, 100);
// }
