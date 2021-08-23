// If device is touch capable, use touch as the trigger, otherwise the user is using a desktop computer so use click
var touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
touchEvent == 'touchstart' ? $('#container').addClass('touchDevice') : $('#container').addClass('nonTouchDevice');

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

function preloadImgsCallback(){
    $('#loaderLayer').fadeOut();
    $('#setupLayer').fadeIn();      
    checkScreenWidth();
    setupDrawPiles();
    initiateMap();  
}

$(document).ready(function(){
    generateModalButtonNums();
})

$(window).resize(function() {
    checkScreenWidth();
});

$(document).on(touchEvent,'.gameSection.collapsed',function(){
    swapActiveMainSection();
}); 


$(document).on(touchEvent,'.closeModalTrigger',function(){
	$('.modal.is-active').removeClass('is-active');
});

$(document).on(touchEvent,'#maximizeScreenIcon',function(){
	$(this).hide();
    $('#minimizeScreenIcon').show();
    openFullscreen();
});

$(document).on(touchEvent,'#minimizeScreenIcon',function(){
	$(this).hide();
    $('#maximizeScreenIcon').show();
    closeFullscreen()
});

// $(document).on(touchEvent,'.modal.is-active .modal-background.closableModalBackground',function(){
// 	$('.modal.is-active').removeClass('is-active');
// });

$(document).on(touchEvent,'#placeFirstPlantCardBtn',function(){
    $('#tableauSection .gameSectionContent #homeContentContainer #playerInfoContainer #cardToPlace .cardContainer').addClass('activeCard');
    generatePossibleMapPlacements();
});

$(document).on('mouseenter','#mapContainer.expanded .mapTileContainer.potentialPlacement.activePotentialPlacement:not(.temporaryPlacement)',function(){
    if(!lockMap) {
        // the .potentialPlacement class has been previously add to every card container on the map to show the player where they can place the newly chosen tile on the map

        $(this).addClass('cardPlacementPreview');

        // target the currently hovered over tile
        var thisTile = $(this);

        // the tile+token pairing that had previously been clicked has the .chosenTokenTileContainer class assigned to it
        // targeting the .tileContainer child, a copy of all of the tile information is now created on the map card that the user is currently hovering over
        $('.cardContainer.activeCard').clone().appendTo(thisTile);

        // copying all of the tile contents also copies over the yellow border into the map - which we don't need as the user can easily tell what card has just ben generated, so we can immediately delete this element from the newly generated tile html in the map
        // $('#mapContainer.expanded .mapTileContainer.potentialPlacement .tileContainer .selectedTileOutline').remove();
    }
});

$(document).on('mouseleave','#mapContainer.expanded .mapTileContainer.potentialPlacement.activePotentialPlacement.cardPlacementPreview:not(.temporaryPlacement)',function(){    
    if(!lockMap) {
        // once the user leaves a map card that is a potential placement, the tile that is currently being previewed is deleted
        $(this).removeClass('cardPlacementPreview');
        $('#mapContainer.expanded .mapTileContainer.potentialPlacement:not(.temporaryPlacement) .cardContainer').remove();
    }
});

$(document).on(touchEvent,'#mapContainer.expanded .mapTileContainer.potentialPlacement.activePotentialPlacement:not(.temporaryPlacement)',function(){    
    if(!lockMap) {
        lockMap = true;
        if($('#mapContainer.expanded .mapTileContainer.potentialPlacement:not(.temporaryPlacement) .cardContainer').length) {
            $('#mapContainer.expanded .mapTileContainer.potentialPlacement:not(.temporaryPlacement) .cardContainer').remove();
        }

        $('.cardPlacementPreview').removeClass('cardPlacementPreview');

        var targID = $(this).attr('id');      

        $('#mapContainer.expanded .mapTileContainer.potentialPlacement.temporaryPlacement').addClass('activePotentialPlacement').removeClass('temporaryPlacement');
        $(this).removeClass('activePotentialPlacement').addClass('temporaryPlacement');

        temporarilyLockMap(1000);
        
        $('.cardContainer.activeCard').parentToAnimate($('#' + targID), 1000);

        setTimeout(function(){
        	lockMap = false;
            // checkLightingMatches()
        }, 1100)

        // setTimeout(function(){
        // 	$('#mapContainer #placedCardOptions').addClass('showOptions');
        // 	$('.mobileCardPlacementOptions.inactiveCardOptions').addClass('activeCardOptions').removeClass('inactiveCardOptions');
        // }, 300)
    }
	
})

function checkLightingMatches() {
    // search 4 neighbours
    // see if any have a placed card
    // 
}

function generateModalButtonNums() {
    $('.modal').each(function(){
        let buttonNum = $(this).find('.button:not(.delete.closeModalTrigger)');
        $(this).children('.modal-content').attr('btns', buttonNum.length);
    });
}

function checkScreenWidth(){
    changeOfView = false;
	var windowSize = $(window).width();

	if(windowSize > 1239) {
		if(currentView != 'desktopView') {
            $('body > #container').removeClass('mobileView tabletView').addClass('desktopView');
			changeOfView = true;
			newView = 'desktopView';
		}
	} else if(windowSize > 539) {
		if(currentView != 'tabletView') {
            $('body > #container').removeClass('mobileView desktopView').addClass('tabletView');
			changeOfView = true;
			newView = 'tabletView';
		}
	} else if(windowSize <= 539) {
		if(currentView != 'mobileView') {
            $('body > #container').removeClass('tabletView desktopView').addClass('mobileView');
			changeOfView = true;
			newView = 'mobileView';
		}
	}

	if(changeOfView) currentView = newView;
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

    let plantPots = ['concrete', 'wood', 'porcelain'];
    for (let i = 0; i < plantPots.length; i++) {
        for (let j = 0; j < 15; j++) {
            let randNum = Math.floor(Math.random() * 3);
            allPlantPots.push(`${plantPots[i]}-${randNum}`);
        }
    }
    
    allItemTokens = shuffle(initItemTokens);

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
                <div class="plantPotContainer expanded startingPos startingPosAnimate">
                    <img class="plantPot" src="img/pots/${initialPlantPots[k]}.png" alt="" />
                </div>
                <div class="cardsAndItemContainer">
                    ${generateCard(initialPlantCards[k], 'plant', 'init', 'market')}
                    ${generateItem(initialItemTokens[k], 'init')}
                    ${generateCard(initialRoomCards[k], 'room', 'init', 'market')}
                </div>
            </div>
        `;
	}

	$('#marketCardColumns').append(initialMarketHTML);

}

$(document).on('mouseenter','#container.wideScreenView #marketSection.gameSection:not(.animatingElem):not(.initSetup) #marketCardColumns .marketColumn .cardsAndItemContainer',function(){
	$(this).closest('.marketColumn').addClass('activeColumn');
    $(this).closest('#marketCardColumns').addClass('activeColumnView');
});

$(document).on('mouseleave','#container.wideScreenView #marketSection.gameSection:not(.animatingElem):not(.initSetup) #marketCardColumns .marketColumn .cardsAndItemContainer',function(){
	$('.activeColumn').addClass('deactivedColumn').removeClass('activeColumn');
    $('.activeColumnView').removeClass('activeColumnView');
    setTimeout(function(){
        $('.deactivedColumn').removeClass('deactivedColumn');
    }, 200);
});

$(document).on(touchEvent,'#container.mobileView #marketSection.gameSection:not(.animatingElem):not(.initSetup) #marketCardColumns .marketColumn .cardsAndItemContainer',function(){
	$(this).closest('.marketColumn').addClass('activeColumn');
    $(this).closest('#marketCardColumns').addClass('activeColumnView');
});

$(document).on(touchEvent,'#container.mobileView #marketSection.gameSection:not(.animatingElem):not(.initSetup) #marketCardColumns .marketColumn .cardsAndItemContainer',function(){
	$('.activeColumn').addClass('deactivedColumn').removeClass('activeColumn');
    $('.activeColumnView').removeClass('activeColumnView');
    setTimeout(function(){
        $('.deactivedColumn').removeClass('deactivedColumn');
    }, 100);
});

let lightingContainerPositions = ['top', 'right', 'bottom', 'left'];
let lightingSymbolNumbers = ['one', 'two', 'three'];

function generateCard(thisCard, cardType, mode, thisSection) {
	var thisCardHTML = `
        <div data-animation-group="${thisSection}" class="flip-card flip-back flip-${cardType} expanded${mode == 'init' ? ` startingPos startingPosAnimate` : ``}">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <div class="backOfCardContainer">
                        <img class="${cardType}Back" src="img/${cardType}s/back.jpg" alt="" />
                    </div>
                </div>
                <div class="flip-card-back">
                    <div data-animation-group="${thisSection}" class="cardContainer expanded" type="${cardType}"${cardType == 'plant' ? ` lighting-num="${thisCard.lighting.length}"` : ``}`;
                    if(cardType == 'plant') {
                        thisCardHTML += ` lighting-types="`;
                        for (let i = 0; i < thisCard.lighting.length; i++) {
                            thisCardHTML += `${i != 0 ? ` ` : ``}${thisCard.lighting[i]}`;
                        }
                        thisCardHTML += `">`;
                    } else if(cardType == 'room') {
                        for (let i = 0; i < thisCard.lighting.length; i++) {
                            thisCardHTML += ` lighting-${lightingContainerPositions[i]}="${thisCard.lighting[i]}"`;
                        }
                        thisCardHTML += `>`;
                    }
                    
                    thisCardHTML += `<div data-animation-group="${thisSection}" class="cardContainerOverlay expanded">
                            <img data-animation-group="${thisSection}" class="${cardType} expanded animatingElem mediumTransition" src="img/${cardType}s/${thisCard.img}.jpg" alt="" style="transform-origin: left top;" />
                            ${cardType == 'plant' ? `
                            <div data-animation-group="${thisSection}" class="plantBannerContainer plantImgContainer expanded">
                                <img data-animation-group="${thisSection}" class="plantBanner plantImg expanded animatingElem mediumTransition" src="img/plants/icons/banners/${thisCard.plantType}.png" alt="" style="transform-origin: left top;" />
                            </div>
                            <div data-animation-group="${thisSection}" class="plantSymbolContainer plantImgContainer expanded">
                                <img data-animation-group="${thisSection}" class="plantSymbol plantImg expanded animatingElem mediumTransition" src="img/plants/icons/symbols/${thisCard.plantType}.png" alt="" style="transform-origin: left top;" />
                            </div>
                            <div data-animation-group="${thisSection}" class="plantVerdancyContainer plantImgContainer expanded">
                                <img data-animation-group="${thisSection}" class="plantVerdancy plantImg expanded animatingElem mediumTransition" src="img/plants/icons/verdancy/${thisCard.verdancyRequired}.png" style="transform-origin: left top;" alt="" />
                            </div>
                            <div data-animation-group="${thisSection}" class="plantVPsContainer plantImgContainer expanded">
                                <img data-animation-group="${thisSection}" class="plantVPs plantImg expanded animatingElem mediumTransition" src="img/plants/icons/vp/${thisCard.vps}.png" alt="" style="transform-origin: left top;" />
                            </div>
                            ` : ``}
                            
    `;

    for (let i = 0; i < thisCard.lighting.length; i++) {
        thisCardHTML += `
            <div data-animation-group="${thisSection}" class="lightingIconContainer lightingIconContainer-${cardType == 'room' ? `${lightingContainerPositions[i]}` : `${lightingSymbolNumbers[i]}`} expanded" >
                <img data-animation-group="${thisSection}" class="lightingIcon${cardType == 'plant' ? ` lightingIcon-${lightingSymbolNumbers[i]}` : ``} expanded animatingElem mediumTransition" src="img/lighting/${thisCard.lighting[i]}.png" alt="" style="transform-origin: left top;" />
            </div>
        `;
    }
    
    thisCardHTML += `
                    </div>
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
    let thisItemHTML = `<img data-animation-group="market" class="itemToken expanded${mode == 'init' ? ` startingPos startingPosAnimate` : ``}" src="img/${itemDetails[0]}/${itemDetails[1]}.png" />`
	// return the HTML so that whenever the function is called, will now be a placeholder for the above HTML
	return thisItemHTML;
}

var rulesURL = 'files/rules.pdf';

$(document).on(touchEvent, '#frontPageGameInstructionsButton', function(){
	openInNewTab(rulesURL);
});

let initMarketInterval;
let initMarketFlipCardsInterval;

$(document).on(touchEvent, '#startGame', function(){
	$('body').addClass('gameView');
	$('.layer').fadeOut();
    // if($('#container').hasClass('mobileView')) $('#mainVerdantTitle').fadeOut();
    setTimeout(function(){
        // if($('#container').hasClass('mobileView')) $('#secondaryVerdantTitle').show();
        $('#gameLayer').fadeIn();
        setTimeout(function(){
            initMarketInterval = setInterval(initMarketFunc, 200);    
        }, 400);
    }, 400);
	
    $('#gameLayer #gameSectionsParent .collapsed ion-icon[name="expand"]').show();
});


let currentColumn = 3;
let currentMarketItem = 0;

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

    let initPlayersHomeTimeout = 0;

    $('.startingPosAnimate').removeClass('startingPosAnimate');

    swapActiveMainSection();

    if(!$('#container').hasClass('desktopView')) initPlayersHomeTimeout = 800;

    setTimeout(function(){
        chooseStartingPlayerCards();
    }, initPlayersHomeTimeout);

    setTimeout(function(){
        animateElem($('#playerInfoContainer #cardToPlace .flip-plant'), 'tableauStartingPos');
        animateElem($('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room'), 'tableauStartingPos');
    }, (initPlayersHomeTimeout + 200));

    setTimeout(function(){
        $('#playerInfoContainer #cardToPlace .flip-plant .flip-card-inner').css('transform', 'rotateY(180deg) translate3d(0, 0, 1px)'); 
        $('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room .flip-card-inner').css('transform', 'rotateY(180deg) translate3d(0, 0, 1px)'); 
    }, (initPlayersHomeTimeout + 2500)); 

    setTimeout(function(){
        $('#homeContentContainer #playerInfoContainer #cardToPlace .flip-plant .flip-card-inner .flip-card-back .cardContainer').appendTo('#homeContentContainer #playerInfoContainer #cardToPlace');
        $('#homeContentContainer #playerInfoContainer #cardToPlace .flip-plant').remove();
        $('#homeContentContainer #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room .flip-card-inner .flip-card-back .cardContainer').appendTo('#homeContentContainer #mapContainer #mapHiddenOverlay #row-2-column-4');
        $('#homeContentContainer #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room').remove();
        $('.initSetup').removeClass('initSetup');
        $('#placeFirstCardModal').addClass('is-active');
    }, (initPlayersHomeTimeout + 3050)); 
}

function chooseStartingPlayerCards() {
    let startingPlant = allPlantCards.splice(0, 1);
    let startingRoom = allRoomCards.splice(0, 1);

    let startingPlantHTML = generateCard(startingPlant[0], 'plant', 'init', 'tableau');
    let startingRoomHTML = generateCard(startingRoom[0], 'room', 'init', 'tableau');

    $('#playerInfoContainer #cardToPlace').append(startingPlantHTML);
    $('#playerInfoContainer #cardToPlace').attr('cardtype', 'plant');
    
    $('#mapContainer #mapHiddenOverlay #row-2-column-4').append(startingRoomHTML);
    $('#mapContainer #mapHiddenOverlay #row-2-column-4').attr('cardtype', 'room');
}

// $(document).on(touchEvent, '#gameLayer #gameSectionsParent .collapsed:not(.initSetup)', function(){

//     let thisID = $(this).attr('id');

//     $('#gameLayer #gameSectionsParent .expanded').addClass('collapsed').removeClass('expanded');
//     $(this).addClass('expanded expandAnimation').removeClass('collapsed');

//     if(thisID != 'tableauSection') {
        


//     setTimeout(function(){
//         $('.expanded.expandAnimation').removeClass('expandAnimation');
//         if(thisID == 'tableauSection') lockMap = false
//     }, 700)

    

// });

let lockMap = false;

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
		'desktopView': {
            'zoomIncs': {
                '11': {
                    'vertical': '61.5',
                    'horizontal': '59'
                },
                '9': {
                    'vertical': '75.5',
                    'horizontal': '96'
                },
                '7': {
                    'vertical': '58.5',
                    'horizontal': '75'
                },
                '5': {
                    'vertical': '42',
                    'horizontal': '37.5'
                },
            },
			'unit': 'px'
		},
        'tabletView': {
            'zoomIncs': {
                '11': {
                    'vertical': '61.5',
                    'horizontal': '59'
                },
                '9': {
                    'vertical': '75.5',
                    'horizontal': '96'
                },
                '7': {
                    'vertical': '58.5',
                    'horizontal': '75'
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
                    'horizontal': '19'
                },
                '7': {
                    'vertical': '11.75',
                    'horizontal': '15'
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
	var mapHTML = `<div id="mapHiddenOverlay" style="transform: scale(0.9);">`;
	for (let i = 0; i < mapData.length; i++) {
		for (let j = 0; j < mapData[i].length; j++) {
			mapHTML += `<div data-map-row="${mapData[i][j].row}" data-map-column="${mapData[i][j].column}" id="row-${mapData[i][j].row}-column-${mapData[i][j].column}" class="mapTileContainer"></div>`;
		}
	}
    mapHTML += `
        </div>
    `;
	// the map is generated and all the exisiting information has been replaced
	$('#homeContentContainer #mapContainer').append(mapHTML);
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

function temporarilyLockMap(timePeriod) {
	lockMap = true;
	setTimeout(function(){
		lockMap = false;
	}, timePeriod);
}


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

function generatePossibleMapPlacements(){
    let cardTypeToPlace = $('#tableauSection .gameSectionContent #homeContentContainer #playerInfoContainer #cardToPlace').attr('cardtype');
    showPotentialPlacements(cardTypeToPlace);
}

let validCardTypeNeighbours = {
    'plant': 'room',
    'room': 'plant'
}

let validNeighbourIDs = [];

// data-map-row="${mapData[i][j].row}"
// data-map-column="${mapData[i][j].column}"

function showPotentialPlacements(currentCardType) {
    validNeighbourIDs = [];
    $('.mapTileContainer').each(function(){
        let placedCardType = $(this).attr('cardtype');
        if (typeof placedCardType !== 'undefined' && placedCardType !== false) {
            if(placedCardType == validCardTypeNeighbours[currentCardType]) checkSurroundingValidPlacements($(this));
        }
    });

    let uniquePlacementIDs = validNeighbourIDs.filter(onlyUnique);

    for (let i = 0; i < uniquePlacementIDs.length; i++) {
        $(`#${uniquePlacementIDs[i]}`).addClass('potentialPlacement activePotentialPlacement');
    }
}

function checkSurroundingValidPlacements(thisCard){
    let thisRow = parseInt(thisCard.data('map-row'));
    let thisColumn = parseInt(thisCard.data('map-column'));

    let testPlacements = [
        `#row-${thisRow - 1}-column-${thisColumn}`,
        `#row-${thisRow + 1}-column-${thisColumn}`,
        `#row-${thisRow}-column-${thisColumn - 1}`,
        `#row-${thisRow}-column-${thisColumn + 1}`
    ]

    for (let i = 0; i < testPlacements.length; i++) {
        let thisAttr = $(`${testPlacements[i]}`).attr('placedCardType');
        if (typeof thisAttr === 'undefined' || thisAttr === false) {
            validNeighbourIDs.push($(`${testPlacements[i]}`).attr('id'));
        };
    }
}


jQuery.fn.extend({
    // Modified and Updated by MLM
    // Origin: Davy8 (http://stackoverflow.com/a/5212193/796832)
    parentToAnimate: function(newParent, duration) {

		var $element = $(this);
        var $oldParent = $element.parent()

        

		newParent = $(newParent); // Allow passing in either a JQuery object or selector
		var oldOffset = $element.offset();
        $(this).appendTo(newParent);
        var newOffset = $element.offset();

		var temp = $element.clone().appendTo('body');

		if($element[0].className == 'cardContainer expanded activeCard') {

			let zoomScale = Number(zoomLevel)/10;

			let startWidth = 0;
			let startHeight = 0;
			let endWidth = 0;
			let endHeight = 0;

			let startOpacity = 0;
			let endOpacity = 0;

			
			if(newParent[0].offsetParent.id == 'mapHiddenOverlay') {

                if($oldParent[0].className == 'mapTileContainer potentialPlacement activePotentialPlacement') {
                    startWidth = $element[0].offsetWidth * zoomScale;
                    startHeight = $element[0].offsetHeight * zoomScale;
                } else {
                    startWidth = $element[0].offsetWidth;
				    startHeight = $element[0].offsetHeight;
                }      
				
				endWidth = $element[0].offsetWidth * zoomScale;
				endHeight = $element[0].offsetHeight * zoomScale;

				startOpacity = 1;
				endOpacity = 1;

			} else if(newParent[0].offsetParent.id == 'playerInfoContainer') {

				endWidth = $element[0].offsetWidth;
				endHeight = $element[0].offsetHeight;
				
				startWidth = endWidth * zoomScale;
				startHeight = endHeight * zoomScale;

				startOpacity = 1;
				endOpacity = 0.75;

			}
            
			temp.css({
                'width': startWidth,
				'height': startHeight,
				'position': 'absolute',
                'top': oldOffset.top,
				'left': oldOffset.left,
				'opacity': startOpacity,
				'zIndex': 1000
			});
			
			$element.hide();

			temp.animate({
				'width': endWidth,
				'height': endHeight,
                'top': newOffset.top,
				'left': newOffset.left,
				'opacity': endOpacity
			}, duration, function() {
				$element.show();
				temp.remove();
			});
		}

    }
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


/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}
