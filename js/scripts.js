// If device is touch capable, use touch as the trigger, otherwise the user is using a desktop computer so use click
var touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
touchEvent == 'touchstart' ? $('#container').addClass('touchDevice') : $('#container').addClass('nonTouchDevice');

var turnsRemaining = 13;

var allPlantCards = [];
var allRoomCards = [];
var allItemTokens = [];
var allPlantPots = [];

var initialPlantCards = [];
var initialRoomCards = [];
var initialItemTokens = [];
var initialPlantPots = [];


let changeOfView = false;
let currentView = 'desktopView';
let newView = 'desktopView';

let startingPlacement = true;
let completedPlantsThisTurn = [];

let oppositeType = {
    'plant': 'room',
    'room': 'plant'
}

let oppositePos = {
    'top': 'bottom',
    'right': 'left',
    'bottom': 'top',
    'left': 'right'
}

let mapVerdancyVisible = false;

$(document).ready(function(){
    checkIOS();
    // checkScreenWidth();
    generateModalButtonNums();
    $('#loaderLayer').fadeIn('fast');

    setTimeout(function(){
        $.getScript("js/image-preloader.js");
    }, 210);
})

function preloadImgsCallback(){
    $('#loaderLayer').fadeOut();
    setTimeout(function(){
        $('#setupLayer').fadeIn();
        setupDrawPiles();
        initiateMap();  
    }, 400);
};

function checkIOS() {
    if (/iPad|iPhone|iPod/.test(navigator.platform)) {
        $('#container').addClass('iosDevice');
    }
}

var rulesURL = 'files/rules.pdf';

$(document).on(touchEvent, '.showFullInstructionsButton.button', function(){
	openInNewTab(rulesURL);
});

$(document).on(touchEvent, '#viewPotScoringBtn:not([disabled])', function(){
    if($('#viewPotScoringBtn').hasClass('showPotScoringLayer')) {
        togglePotScoringLayerVisibility('show');
    } else if($('#viewPotScoringBtn').hasClass('hidePotScoringLayer')) {
        togglePotScoringLayerVisibility('hide');
    }
});

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
            // if(key == 'itemsNurture') {
            //     for (let j = 0; j < 15; j++) {
            //         initItemTokens.push(`${key}_${itemsAndNurtureItems[key][i]}`);
            //     }
            // }
        }
    }

    let plantPots = ['concrete', 'wood', 'porcelain'];
    for (let i = 0; i < plantPots.length; i++) {
        for (let j = 0; j < 4; j++) {
            let randNum = Math.floor(Math.random() * 3);
            allPlantPots.push(`${plantPots[i]}-${randNum}`);
        }
    }
    
    allItemTokens = shuffle(initItemTokens);
    

    setupInitialCardsAndItems();
}

function togglePotScoringLayerVisibility(mode) {    
    $('#viewPotScoringBtn').addClass('disableInteraction');
    $('#replaceMarketItemsBtn').addClass('disableInteraction');
    $('#chooseAnyMarketCardItemBtn').addClass('disableInteraction');
    if(mode == 'show') {        
        $('#viewPotScoringBtn').children('p').html('Hide Pot<br>scoring info');
        $('#viewPotScoringBtn').addClass('hidePotScoringLayer').removeClass('showPotScoringLayer');
        $('.plantPotContainer.hideScoring').addClass('showScoring').removeClass('hideScoring');
        animateElem($('#potScoringInfoContainer'), 'collapsed');
        animateElem($('#marketCardColumns'), 'expanded');
    } else if(mode == 'hide') {        
        $('#viewPotScoringBtn').children('p').html('Show Pot<br>scoring info');
        $('#viewPotScoringBtn').addClass('showPotScoringLayer').removeClass('hidePotScoringLayer');
        $('.plantPotContainer.showScoring').addClass('hideScoring').removeClass('showScoring');
        animateElem($('#potScoringInfoContainer'), 'expanded');
        animateElem($('#marketCardColumns'), 'collapsed');
    }
    setTimeout(function(){        
        $('#viewPotScoringBtn').removeClass('disableInteraction');
        $('#replaceMarketItemsBtn').removeClass('disableInteraction');
        $('#chooseAnyMarketCardItemBtn').removeClass('disableInteraction');
    }, 700);
}

$(document).on(touchEvent, '#startGame', function(){
    $('#keyboardKeysModal').addClass('is-active');
});

$(document).on(touchEvent, '#commenceGame', function(){
	$('.layer').fadeOut();
    setTimeout(function(){        
        $('body').addClass('gameView');
        $('#gameLayer').fadeIn();
        setTimeout(function(){            
            initMarketInterval = setInterval(initMarketFunc, 200);    
        }, 400);
    }, 400);

    $('#gameLayer #gameSectionsParent .collapsed ion-icon[name="expand"]').show();
});

function initMarketFunc(){
    let marketItemClasses = ['.plantPotOverlay', '.cardsAndItemContainer .marketPlantCardOverlay', '.cardsAndItemContainer .marketItemOverlay', '.cardsAndItemContainer .marketRoomCardOverlay'];    
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
        $(this).prependTo(`.marketColumn[column="${columnNum}"] .cardsAndItemContainer .marketPlantCardOverlay`);
    });

    $('.cardsAndItemContainer .flip-room .flip-card-inner .flip-card-back .cardContainer').each(function(){
        let columnNum = $(this).closest('.marketColumn').attr('column');        
        $(this).appendTo(`.marketColumn[column="${columnNum}"] .cardsAndItemContainer .marketRoomCardOverlay`);
    });
    
    $('.flip-card').remove();
    setTimeout(function(){        
        $('.initBoxShadow').removeClass('initBoxShadow');
    }, 20);
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
        $('#tableauSection .gameSectionContent #homeContentContainer #playerInfoContainer #cardToPlace .cardContainer').addClass('activePlacement');
        $('#viewPotScoringBtn').removeAttr('disabled');
        $('#placeFirstCardModal').addClass('is-active');
    }, (initPlayersHomeTimeout + 3050)); 
}

$(document).on(touchEvent, '#placeFirstPlantCardBtn', function(){
    showPossibleMapPlacements('card');
    lockMap = false;    
});

function chooseStartingPlayerCards() {
    let startingPlant = allPlantCards.splice(0, 1);
    let startingRoom = allRoomCards.splice(0, 1);


    let startingPlantHTML = generateCard(startingPlant[0], 'plant', 'init', 'tableau');
    let startingRoomHTML = generateCard(startingRoom[0], 'room', 'init', 'tableau');

    $('#playerInfoContainer #cardToPlace').append(startingPlantHTML);
    $('#playerInfoContainer #cardToPlace').attr('cardtype', 'plant');
    $('#playerInfoContainer #cardToPlace').attr('plant-pot', 'none');
    
    $('#mapContainer #mapHiddenOverlay #row-2-column-4').append(startingRoomHTML);
    $('#mapContainer #mapHiddenOverlay #row-2-column-4').attr('cardtype', 'room');
    $('#mapContainer #mapHiddenOverlay #row-2-column-4').attr('placed-item', 'none');
}

$(document).on(touchEvent, '#showScoringRemindersBtn', function(){
    $('#scoringReminderModal').addClass('is-active');
});

$(document).on(touchEvent, '#scoringRemindersFinalScoreBtn', function(){
    $('#scoringReminderModal').addClass('is-active');
});



// $(window).resize(function() {
//     checkScreenWidth();
// });

$(document).on(touchEvent,'#swapSectionsIcon:not(.initSetup)',function(){
    swapActiveMainSection();
}); 

$(document).on(touchEvent,'.closeModalTrigger',function(){
	$('.modal.is-active').removeClass('is-active');
});

$(document).on(touchEvent,'.modal.is-active .modal-background.closableModalBackground',function(){
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
    closeFullscreen();
});

function generateModalButtonNums() {
    $('.modal').each(function(){
        let buttonNum = $(this).find('.button:not(.delete.closeModalTrigger)');
        $(this).find('.modal-content').attr('btns', buttonNum.length);
    });
}

// function checkScreenWidth(){
//     changeOfView = false;
// 	var windowSize = $(window).width();

// 	if(windowSize > 1239) {
// 		if(currentView != 'desktopView') {
//             $('body > #container').removeClass('mobileView tabletView').addClass('desktopView');
// 			changeOfView = true;
// 			newView = 'desktopView';
// 		}
// 	} else if(windowSize > 539) {
// 		if(currentView != 'tabletView') {
//             $('body > #container').removeClass('mobileView desktopView').addClass('tabletView');
// 			changeOfView = true;
// 			newView = 'tabletView';
// 		}
// 	} else if(windowSize <= 539) {
// 		if(currentView != 'mobileView') {
//             $('body > #container').removeClass('tabletView desktopView').addClass('mobileView');
// 			changeOfView = true;
// 			newView = 'mobileView';
// 		}
// 	}
// 	if(changeOfView) currentView = newView;
// }

function setupInitialCardsAndItems() {

	// since there are 4 tiles to be generated, the below loop is actioned 4 times
	for (let i = 0; i < 4; i++) {
		// the first tile is spliced and stored in the "thisMapTile" variable
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

	let initialMarketHTML = ``;

	// again, since there are 4 combinations of tiles+tokens container, the below loop is actioned 4 times
	for (let k = 0; k < 4; k++) {
		// the below code generates the HTML to store information for each tile and token combination and then inserts it into the DOM
        
        var splitPlantPot = initialPlantPots[k].split('-');

        // splitPlantPot[0] = concrete / wood / ceramic

		initialMarketHTML += `
            <div class="marketColumn" column="${k}">
                <div class="plantPotOverlay expanded hideScoring startingPos startingPosAnimate${k == 3 ? ` availableScoringPlantPot` : ``}" ${k == 3 ? `plant-pot-priority="0"` : ``}>
                    <div data-pot-type="${splitPlantPot[0]}" class="plantPotContainer expanded hideScoring startingPos startingPosAnimate">
                        <img class="plantPot" src="img/pots/${initialPlantPots[k]}.png" alt="" />
                        <img class="plantPotScoring" src="img/pots/${splitPlantPot[0]}.png" alt="" />
                    </div>
                </div>
                <div class="cardsAndItemContainer">
                    <div data-animation-group="market" class="marketPlantCardOverlay marketCardOverlay expanded startingPos startingPosAnimate">
                        ${generateCard(initialPlantCards[k], 'plant', 'init', 'market')}
                    </div>
                    <div data-animation-group="market" class="marketItemOverlay expanded startingPos startingPosAnimate">
                        ${generateItem(initialItemTokens[k], 'init')}
                    </div>
                    <div data-animation-group="market" class="marketRoomCardOverlay marketCardOverlay expanded startingPos startingPosAnimate">
                        ${generateCard(initialRoomCards[k], 'room', 'init', 'market')}
                    </div>
                </div>
            </div>
        `;
	}

	$('#marketCardColumns').append(initialMarketHTML);

    let potScoringHTML = `
            <div id="potDrawPile">
    `;

    for (let i = 0; i < allPlantPots.length; i++) {
        let splitPotType = allPlantPots[i].split('-');

        potScoringHTML += `
            <div data-pot-draw-slot="${i}" class="potDrawSlot">
                <div data-pot-type="${splitPotType[0]}" class="plantPotContainer expanded hideScoring startingPos startingPosAnimate">
                    <img class="plantPot" src="img/pots/${allPlantPots[i]}.png" alt="" />
                    <img class="plantPotScoring" src="img/pots/${splitPotType[0]}.png" alt="" />
                </div>
            </div>
        `;
    }

    potScoringHTML += `
            </div>
            <div id="firstActivePotInfo"></div>
            <div id="potDiscardPile">
    `;

    for (let i = 0; i < 12; i++) {
        potScoringHTML += `
            <div data-pot-discard-slot="${i}" class="potDiscardSlot availableScoringPlantPot" plant-pot-priority="${i + 1}"></div>
        `;
    }

    potScoringHTML += `
        </div>
    `;

    $('#marketSection .gameSectionContent #potScoringInfoContainer').append(potScoringHTML);

}


function generateCard(thisCard, cardType, mode, thisSection) {
        

    // 0:
    //     cardType: "plant"
    //     id: "livingStone"
    //     img: "unusual-4"
    //     lighting: ['full']
    //     name: "Living Stone"
    //     plantType: "unusual"
    //     verdancyRequired: 3
    //     vps: 3


    // 0:
    //     cardType: "room"
    //     img: "foliage"
    //     item: "none"
    //     lighting: (4) ['half', 'full', 'full', 'none']

    

    // 'flowering': [  // lighting key = ['top', 'right', 'bottom', 'left']
    //     ['half', 'full', 'half', 'none'], // flowering-room-0

	var thisCardHTML = `
        ${mode == 'init' ? `
            <div data-animation-group="${thisSection}" class="flip-card flip-back flip-${cardType} expanded${thisSection == 'tableau' ? ` startingPos startingPosAnimate` : ``}">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <div class="backOfCardContainer">
                                <img class="${cardType}Back" src="img/${cardType}s/back.jpg" alt="" />
                            </div>
                        </div>
                        <div class="flip-card-back">
        ` : ``}

                    <div data-animation-group="${thisSection}" class="${mode == 'market' ? `newCardContainer ` : ``}cardContainer expanded initBoxShadow" cardtype="${cardType}"${cardType == 'plant' ? ` plant-vps="${thisCard.vps}" plant-type="${thisCard.plantType}" data-lighting-num="${thisCard.lighting.length}"` : ` room-type="${thisCard.img}"`}`;
                    if(cardType == 'plant') {
                        thisCardHTML += ` data-lighting-types="`;
                        for (let i = 0; i < thisCard.lighting.length; i++) {
                            thisCardHTML += `${i != 0 ? ` ` : ``}${thisCard.lighting[i]}`;
                        }
                        thisCardHTML += `">`;
                    } else if(cardType == 'room') {
                        for (let i = 0; i < thisCard.lighting.length; i++) {
                            thisCardHTML += ` data-lighting-${lightingContainerPositions[i]}="${thisCard.lighting[i]}"`;
                        }
                        thisCardHTML += `>`;
                    }

                    thisCardHTML += `
                        <div class="hiddenBlackOverlay"></div>
                        <div class="newGreenThumbMasterContainer" total-green-thumbs="0">
                            <div class="newGreenThumbParentContainer" green-thumb-container="1"></div>
                            <div class="newGreenThumbParentContainer" green-thumb-container="2"></div>
                            <div class="newGreenThumbParentContainer" green-thumb-container="3"></div>
                            <div class="newGreenThumbParentContainer" green-thumb-container="4"></div>
                        </div>
                    `;

                    if(cardType == 'plant') {
                        thisCardHTML += `
                            <div class="verdancyIconsAndVPLayer" verdancy-icons="${thisCard.verdancyRequired}" verdancy-completed="0">
                                <img class="verdancyLayerBadge verdancyLayerImg" src="img/plants/icons/badges/${thisCard.plantType}.png" alt="" />
                                <img class="vpReminderIcon verdancyLayerImg" src="img/plants/icons/vp/${thisCard.vps}.png" />
                            `;

                            for (let i = 0; i < thisCard.lighting.length; i++) {
                                thisCardHTML += `
                                    <img data-lighting-type="${thisCard.lighting[i]}" class="verdancyLightingIcon verdancyLightingIcon-${lightingSymbolNumbers[i]}" src="img/lighting/${thisCard.lighting[i]}.png" />
                                `;
                            }

                            thisCardHTML += `
                                <div class="verdancyIconsParentContainer">
                            `;
                        for (let i = 0; i < thisCard.verdancyRequired; i++) {
                            thisCardHTML += `
                                <div class="verdancyIconContainer incompleteVerdancy" data-verdancy-icon-num="${i}">
                                    <div class="verdancyIconPosContainer">
                                        <img class="verdancyIcon incompleteVerdancyIcon" src="img/verdancy-inactive.png" />
                                        <img class="verdancyIcon completeVerdancyIcon" src="img/verdancy-active.png" />
                                    </div> 
                                </div>
                            `;
                        }
                        thisCardHTML += `
                                </div>
                            </div>
                        `;
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
                            <div data-animation-group="${thisSection}" class="earnedPlantPotContainer plantImgContainer expanded"></div>
                        ` : `
                            <div class="roomCardItemContainer"></div>
                        `}
    `;

    for (let i = 0; i < thisCard.lighting.length; i++) {
        thisCardHTML += `
            <div data-animation-group="${thisSection}" data-lighting-type="${thisCard.lighting[i]}" class="lightingIconContainer lightingIconContainer-${cardType == 'room' ? `${lightingContainerPositions[i]}` : `${lightingSymbolNumbers[i]}`} expanded">
                <img data-animation-group="${thisSection}" class="lightingIcon${cardType == 'plant' ? ` lightingIcon-${lightingSymbolNumbers[i]}` : ``} expanded animatingElem mediumTransition" src="img/lighting/${thisCard.lighting[i]}.png" alt="" style="transform-origin: left top;" />
            </div>
        `;
    }
    
    thisCardHTML += `
                    </div>
                </div>
            
    ${mode == 'init' ? `
                </div>
            </div>
        </div>
    ` : ``}
    `;

	// return the HTML so that whenever the function is called, will now be a placeholder for the above HTML
	return thisCardHTML;
}

function generateItem(thisItem, mode) {
        

    // itemDetails[0] = itemsNurture
    // itemDetails[1] = trowel

    // 0: "itemsNurture_trowel"
    // 1: "items_flowering-cat"

    let itemDetails = thisItem.split('_');
    let itemRoom = '';
    let itemName = '';

    if(itemDetails[0] == 'items') {
        let normalItemSplit = itemDetails[1].split('-');
        itemRoom = normalItemSplit[0];
        itemName = normalItemSplit[1];
    }

    let thisItemHTML = `
        <div data-animation-group="market" item-type="${itemDetails[0] == 'itemsNurture' ? `nurture` : `normal`}" item-name="${itemDetails[1]}"${itemDetails[0] == 'items' ? ` matching-room="${itemRoom}" furniture-pet-name="${itemName}"` : ``} class="${mode == 'market' ? `newItemToken ` : `animatingElem mediumTransition `}itemToken expanded" >
            <div class="hiddenBlackOverlay inactiveBlackOverlay"></div>
            <img src="img/${itemDetails[0]}/${itemDetails[1]}.png" />
        ${itemDetails[0] == 'itemsNurture' ? `
            <div class="nurtureItemExplanation has-tooltip-success has-tooltip-bottom has-tooltip-multiline" data-tooltip="${nurtureItemsExplanation[itemDetails[1]]}">
                <ion-icon name="help-circle-outline"></ion-icon>
            </div>` : ``} 
        </div>
    `;

	return thisItemHTML;
}

// $(document).on(touchEvent,'#replaceMarketItemsBtn', function(){

$(document).on(touchEvent,'#replaceMarketItemsBtn:not([disabled])',function(){
    let greenThumbActionCriteria = checkPlayersGreenThumbAmount();
    if(!greenThumbActionCriteria) {
        greenThumbAmountStatus('insufficientNum');
    } else {
        setupGreenThumbAction('replaceMarketItems');
    }
});

$(document).on(touchEvent,'#chooseAnyMarketCardItemBtn:not([disabled])',function(){
    let greenThumbActionCriteria = checkPlayersGreenThumbAmount();
    if(!greenThumbActionCriteria) {
        greenThumbAmountStatus('insufficientNum');
    } else {
        setupGreenThumbAction('chooseAnyCardItem');
    }
});

$(document).on(touchEvent,'#addOneVerdancyToPlantBtn:not([disabled])',function(){
    let greenThumbActionCriteria = checkPlayersGreenThumbAmount();
    if(!greenThumbActionCriteria) {
        greenThumbAmountStatus('insufficientNum');
    } else {
        $('.activePlacement').addClass('inactivePlacement').removeClass('activePlacement')
        $(this).addClass('disableInteraction');
        $('#playerInfoContainer #useItemsBtn').addClass('disableInteraction');
        $('#playerInfoContainer #swapItemsBtn').addClass('disableInteraction');
        $('.mapTileContainer.potentialCardPlacement').addClass('pendingPotentialCardPlacement');
        $('#undoNextRoundBtnContainer #nextRound').attr('disabled', 'disabled');
        resetPotentialMapPlacements('resetAll');
        setupGreenThumbAction('addOneVerdancy');
    }
});

function setupGreenThumbAction(thisAction) {
    if(thisAction == 'replaceMarketItems' || thisAction == 'chooseAnyCardItem') {
        $('#marketSection.gameSection').addClass(`${thisAction}GreenThumbAction marketGreenThumbAction`);
    } else if(thisAction == 'addOneVerdancy') {
        animateElem($('#mapContainer #addOneVerdancyOption'), 'showAddOneVerdancyOption');
        toggleMapVerdancy('show');
        $('#verdancyVisibilityContainer').addClass('disableInteraction');
        $('#playerInfoContainer #swapItemsBtn').attr('disabled', 'disabled');        
        $('#playerInfoContainer #discardItemsBtn').attr('disabled', 'disabled');
        nurtureItemMapRecipients('plant', 'addOneVerdancy');

        // addOneVerdancyPotentialTarget

    }
}

$(document).on(touchEvent,'#addOneVerdancyOption #cancelAddOneVerdancyAction',function(){    

    toggleMapVerdancy('hide');

    $('#verdancyVisibilityContainer').removeClass('disableInteraction');
    $('.verdancyPulseAnimation').removeClass('verdancyPulseAnimation');
    animateElem($('#mapContainer #addOneVerdancyOption'), 'hideAddOneVerdancyOption');
    
    $('.previewAddOneVerdancyImg.previewNurtureItemIcon.lockedInIcon').fadeOut();

    setTimeout(function(){

        $('#playerInfoContainer #addOneVerdancyToPlantBtn').removeClass('disableInteraction');
        $('#playerInfoContainer #useItemsBtn').removeClass('disableInteraction');
        $('#playerInfoContainer #swapItemsBtn').removeClass('disableInteraction');

        $('#cancelAddOneVerdancyAction.button').attr('disabled', 'disabled');
        $('#confirmAddOneVerdancyAction.button').attr('disabled', 'disabled');

        $('.previewAddOneVerdancyPotentialTarget').removeClass('previewAddOneVerdancyPotentialTarget');
        $('.addOneVerdancyPotentialTarget').removeClass('addOneVerdancyPotentialTarget');
        $('.potentialNurtureItemTarget').removeClass('potentialNurtureItemTarget');
        $('.addOneVerdancyPreviewAction').removeClass('addOneVerdancyPreviewAction');

        $('.previewAddOneVerdancyImg.previewNurtureItemIcon.lockedInIcon').remove();
        $('.nurtureItemInstructions.showInstructions').removeClass('showInstructions');
        $('#cancelAddOneVerdancyAction.button').removeAttr('disabled');

        if($('#cardToPlace .cardContainer.inactivePlacement').length) {
            $('#cardToPlace .cardContainer.inactivePlacement').addClass('activePlacement').removeClass('inactivePlacement');
            showPotentialCardPlacements();
        } else if($('#chosenItemContainer .itemToken.inactivePlacement').length) {            
            $('#chosenItemContainer .itemToken.inactivePlacement').attr('style', '');
            $('#chosenItemContainer .itemToken.inactivePlacement').addClass('activePlacement').removeClass('inactivePlacement');
            roundState('roundCheck');
            roundState('roundCheck');
        } else {            
            $('#undoNextRoundBtnContainer #undoAction').removeAttr('disabled');
            activateNextRoundBtn();
        }
        
    }, 400);
    
});


$(document).on('mouseenter','#mapContainer .mapTileContainer.potentialNurtureItemTarget.addOneVerdancyPotentialTarget',function(){    
    $(this).append(`
        <img class="previewAddOneVerdancyImg previewNurtureItemIcon" src="img/itemsNurture/addOneVerdancy-icon.png" />
    `);
});

$(document).on('mouseleave','#mapContainer .mapTileContainer.potentialNurtureItemTarget.addOneVerdancyPotentialTarget',function(){    
    $('.potentialNurtureItemTarget .previewAddOneVerdancyImg:not(.lockedInIcon)').remove();
});

$(document).on(touchEvent,'#mapContainer .mapTileContainer.potentialNurtureItemTarget.addOneVerdancyPotentialTarget',function(){        

    $('.verdancyPulseAnimation').removeClass('verdancyPulseAnimation');

    $('.mapTileContainer.addOneVerdancyPreviewAction .previewAddOneVerdancyImg.lockedInIcon').remove();
    $('.addOneVerdancyPreviewAction').addClass('addOneVerdancyPotentialTarget').removeClass('addOneVerdancyPreviewAction');

    $(this).addClass('addOneVerdancyPreviewAction').removeClass('addOneVerdancyPotentialTarget');
    $('.mapTileContainer.addOneVerdancyPreviewAction .previewAddOneVerdancyImg').addClass('lockedInIcon');

    previewNurtureItemVerdancy($(this), 1);
    $('#addOneVerdancyOption #confirmAddOneVerdancyAction').removeAttr('disabled');
});


$(document).on(touchEvent,'#addOneVerdancyOption #confirmAddOneVerdancyAction',function(){    

    $('#cancelAddOneVerdancyAction.button').attr('disabled', 'disabled');
    $('#confirmAddOneVerdancyAction.button').attr('disabled', 'disabled');

    animateElem($('#mapContainer #addOneVerdancyOption'), 'hideAddOneVerdancyOption');

    $('.previewAddOneVerdancyImg.previewNurtureItemIcon.lockedInIcon').fadeOut();

    $('.verdancyPulseAnimation').each(function(){
        $(this).closest('.verdancyIconContainer').addClass('tempVerdancyMarker');
        $(this).removeClass('verdancyPulseAnimation');
    });

    setTimeout(function(){
        $('.tempVerdancyMarker').addClass('completeVerdancy').removeClass('incompleteVerdancy tempVerdancyMarker');
        $('.previewAddOneVerdancyImg.previewNurtureItemIcon.lockedInIcon').remove();
        $('.potentialNurtureItemTarget').removeClass('potentialNurtureItemTarget');
        $('.previewAddOneVerdancyPotentialTarget').removeClass('previewAddOneVerdancyPotentialTarget');
        $('.addOneVerdancyPreviewAction').removeClass('addOneVerdancyPreviewAction');
        $('.addOneVerdancyPotentialTarget').removeClass('addOneVerdancyPotentialTarget');
        $('#mapContainer #addOneVerdancyOption #confirmAddOneVerdancyAction').attr('disabled', 'disabled');

        $('#cancelAddOneVerdancyAction.button').removeAttr('disabled');
    }, 400);

    setTimeout(function(){
        $('.mapTileContainer[cardtype="plant"][plant-pot="none"] .cardContainer .verdancyIconsAndVPLayer').each(function(){
            let newCompletedVerdancy = $(this).find('.verdancyIconContainer.completeVerdancy').length;            
            $(this).attr('verdancy-completed', newCompletedVerdancy);
        });
        greenThumbAmountStatus('actionDeduction');
    }, 800);

    setTimeout(function(){
        toggleMapVerdancy('hide');
        $('#verdancyVisibilityContainer').removeClass('disableInteraction');
        completedPlantsThisTurn = checkForCompletedPlants();
        if(completedPlantsThisTurn.length != 0) {
            gainPlantPots();
        } else {
            roundState('roundCheck');
        }
    }, 3200);

});

function checkPlayersGreenThumbAmount() {
    let greenThumbAmount = parseInt($('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').text());
    if(greenThumbAmount >= 2) {
        return true;
    } else if(greenThumbAmount < 2) {
        return false;
    }
}

function endTurnGreenThumbMaxEnforced() {
    let greenThumbAmount = parseInt($('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').text());
    if(greenThumbAmount > 5) {
        greenThumbAmountStatus('endTurnDeduction');
    }
}

function greenThumbAmountStatus(mode) {
    
    if(mode == 'insufficientNum') {
        // show green thumb amount is not enough for any green thump action
        $('#infoBarStats #greenThumbsAmountContainer').addClass('infoChange');
        $('#infoBarStats #greenThumbsAmountContainer').addClass('insufficient-green-thumbs');
        $('.greenThumbActionBtn').addClass('disableInteraction');
        setTimeout(function(){
            $('.insufficient-green-thumbs').removeClass('insufficient-green-thumbs');
            $('.greenThumbActionBtn').removeClass('disableInteraction');
            $('#infoBarStats #greenThumbsAmountContainer').removeClass('infoChange');
        }, 1600);
        
    } else if(mode == 'actionDeduction') {
        // show green thumb amount being reduced by 2
        animateGreenThumbRemoval(2);
    } else if(mode == 'endTurnDeduction') {
        // show green thumb amount being reduced by 2
        let greenThumbAmount = parseInt($('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').text());
        let greenThumbDifToRemove = greenThumbAmount - 5;
        animateGreenThumbRemoval(greenThumbDifToRemove);
    }
    
    // blink green thumb amount in and out and highlight in red to show that the player does not have enough green thumbs to carry out the action!
}

function animateGreenThumbRemoval(removalAmount){
    let currentGreenThumbAmount = parseInt($('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').text());
    let newGreenThumbAmount = currentGreenThumbAmount - removalAmount;

    $('#infoBarStats #greenThumbsAmountContainer').addClass('infoChange');

    setTimeout(function(){
        $('#infoBarStats #greenThumbsAmountContainer #greenThumbsUpdateInfo').addClass('subtractVal');
        $('#infoBarStats #greenThumbsAmountContainer #greenThumbsUpdateInfo').html(removalAmount);
        $('#infoBarStats #greenThumbsAmountContainer #greenThumbsUpdateInfo').fadeIn();
    }, 500);

    setTimeout(function(){
        $('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').fadeOut();
    }, 1500);

    setTimeout(function(){
        $('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').html(newGreenThumbAmount)
        $('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').fadeIn();
    }, 1900);

    setTimeout(function(){
        $('#infoBarStats #greenThumbsAmountContainer').removeClass('infoChange');
        $('#infoBarStats #greenThumbsAmountContainer #greenThumbsUpdateInfo').fadeOut();
    }, 2500);

    setTimeout(function(){
        $('#infoBarStats #greenThumbsAmountContainer #greenThumbsUpdateInfo.subtractVal').removeClass('subtractVal');
    }, 2900);
}


$(document).on(touchEvent,'#cancelReplaceMarketItemsAction',function(){
    $('#marketSection').removeClass('replaceMarketItemsGreenThumbAction marketGreenThumbAction');
    $('.potentialItemToReplace').removeClass('potentialItemToReplace');
    $('#replaceMarketItemsInstructionsAndBtns #confirmReplaceMarketItemsAction').attr('disabled', 'disabled');
});

$(document).on(touchEvent,'#gameSectionsParent[current-phase="market-selection"] .gameSection.replaceMarketItemsGreenThumbAction .gameSectionContent > #marketCardColumns .marketColumn .marketItemOverlay:not(.potentialItemToReplace)',function(){    
    $(this).addClass('potentialItemToReplace');
    $('#replaceMarketItemsInstructionsAndBtns #confirmReplaceMarketItemsAction').removeAttr('disabled');
});

$(document).on(touchEvent,'#gameSectionsParent[current-phase="market-selection"] .gameSection.replaceMarketItemsGreenThumbAction .gameSectionContent > #marketCardColumns .marketColumn .marketItemOverlay.potentialItemToReplace',function(){    
    $(this).removeClass('potentialItemToReplace');

    if(!$('.marketItemOverlay.potentialItemToReplace').length) {
        $('#replaceMarketItemsInstructionsAndBtns #confirmReplaceMarketItemsAction').attr('disabled', 'disabled');
    }

});

$(document).on(touchEvent,'#gameSectionsParent[current-phase="market-selection"] #marketSection.replaceMarketItemsGreenThumbAction.marketGreenThumbAction .gameSectionContent #replaceMarketItemsInstructionsAndBtns #confirmReplaceMarketItemsAction',function(){
    
    $('.potentialItemToReplace').addClass('lockedInItemToReplace')

    $('#replaceMarketItemsInstructionsAndBtns #cancelReplaceMarketItemsAction').attr('disabled', 'disabled');
    $('#replaceMarketItemsInstructionsAndBtns #confirmReplaceMarketItemsAction').attr('disabled', 'disabled');

    let itemsToPutBackInBag = [];

    setTimeout(function(){
        $(`.marketItemOverlay.lockedInItemToReplace .itemToken`).each(function(){
            let thisItemType = $(this).attr('item-type');
            let thisItemName = $(this).attr('item-name');

            if(thisItemType == 'nurture') {
                itemsToPutBackInBag.push(`itemsNurture_${thisItemName}`);
            } else if(thisItemType == 'normal') {
                itemsToPutBackInBag.push(`items_${thisItemName}`);
            }

            let newItemToken = allItemTokens.splice(0, 1); 
            let newItemTokenHTML = generateItem(newItemToken[0], 'replaceItemsAction');

            $(this).parent().html(newItemTokenHTML);

        });
    }, 600);

    setTimeout(function(){
        $('.potentialItemToReplace').removeClass('potentialItemToReplace');
        $('.lockedInItemToReplace').removeClass('lockedInItemToReplace');
        allItemTokens.push(...itemsToPutBackInBag)
    }, 800);

    setTimeout(function(){
        $('#marketSection').removeClass('replaceMarketItemsGreenThumbAction marketGreenThumbAction');
        $('#replaceMarketItemsInstructionsAndBtns #cancelReplaceMarketItemsAction').removeAttr('disabled');
        greenThumbAmountStatus('actionDeduction');
    }, 1300);

});

$(document).on(touchEvent,'#cancelChooseAnyMarketCardItemAction',function(){
    $('#marketSection').removeClass('chooseAnyCardItemGreenThumbAction marketGreenThumbAction');
    $('#chooseAnyMarketCardItemBtnInstructionsAndBtns #cancelChooseAnyMarketCardItemAction').removeAttr('disabled');
    $('#chooseAnyMarketCardItemBtnInstructionsAndBtns #confirmChooseAnyMarketCardItemAction').attr('disabled', 'disabled');
    $('.cardItemComboCardChosen').removeClass('cardItemComboCardChosen');
    $('.potentialCardItemComboCard').removeClass('potentialCardItemComboCard');
    $('.cardItemComboItemChosen').removeClass('cardItemComboItemChosen');
    $('.potentialCardItemComboItem').removeClass('potentialCardItemComboItem');
});

$(document).on(touchEvent,'#gameSectionsParent[current-phase="market-selection"] #marketSection.gameSection.chooseAnyCardItemGreenThumbAction .gameSectionContent > #marketCardColumns .marketColumn .cardsAndItemContainer .marketCardOverlay:not(.potentialCardItemComboCard)',function(){
    $('.potentialCardItemComboCard').removeClass('potentialCardItemComboCard');
    $(this).addClass('potentialCardItemComboCard');
    $(this).closest('#marketCardColumns').addClass('cardItemComboCardChosen');

    if($('.potentialCardItemComboItem').length) {
        $('#chooseAnyMarketCardItemBtnInstructionsAndBtns #confirmChooseAnyMarketCardItemAction').removeAttr('disabled');
    } else {
        $('#chooseAnyMarketCardItemBtnInstructionsAndBtns #confirmChooseAnyMarketCardItemAction').attr('disabled', 'disabled');
    }
});

$(document).on(touchEvent,'#gameSectionsParent[current-phase="market-selection"] #marketSection.gameSection.chooseAnyCardItemGreenThumbAction .gameSectionContent > #marketCardColumns .marketColumn .cardsAndItemContainer .marketItemOverlay:not(.potentialCardItemComboItem)',function(){
    $('.potentialCardItemComboItem').removeClass('potentialCardItemComboItem');
    $(this).addClass('potentialCardItemComboItem');
    $(this).closest('#marketCardColumns').addClass('cardItemComboItemChosen');

    if($('.potentialCardItemComboCard').length) {
        $('#chooseAnyMarketCardItemBtnInstructionsAndBtns #confirmChooseAnyMarketCardItemAction').removeAttr('disabled');
    } else {
        $('#chooseAnyMarketCardItemBtnInstructionsAndBtns #confirmChooseAnyMarketCardItemAction').attr('disabled', 'disabled');
    }
});


$(document).on(touchEvent,'#confirmChooseAnyMarketCardItemAction',function(){

    $('#chooseAnyMarketCardItemBtnInstructionsAndBtns #confirmChooseAnyMarketCardItemAction').attr('disabled', 'disabled');
    $('#cancelChooseAnyMarketCardItemAction #confirmChooseAnyMarketCardItemAction').attr('disabled', 'disabled');
    
    let potentialCardType = $('.potentialCardItemComboCard .cardContainer').attr('cardtype');
    let validCardPlacements = checkPotentialCardPlacements(potentialCardType, 'marketCardSelection');
    
    if(!validCardPlacements) {
        $(`#${potentialCardType}PlacementsExhaustedModal`).addClass('is-active');
    } else {
        greenThumbAmountStatus('actionDeduction');
        setTimeout(function(){
            $('.potentialCardItemComboCard').closest('.marketColumn').addClass('potentialChosenColumn');
            $('.potentialCardItemComboCard').addClass('potentialCardOverlayParent');
            $('.potentialCardItemComboCard .cardContainer').addClass('potentialMarketCardChoice');
        
            $('.potentialCardItemComboItem').addClass('potentialItemOverlayParent');
            $('.potentialCardItemComboItem .itemToken').addClass('potentialMarketItemChoice');
        
            $('.potentialCardItemComboCard').removeClass('potentialCardItemComboCard');
            $('.potentialCardItemComboItem').removeClass('potentialCardItemComboItem');
            $('.cardItemComboCardChosen').removeClass('cardItemComboCardChosen');
            $('.cardItemComboItemChosen').removeClass('cardItemComboItemChosen');
        
            $('#marketSection').removeClass('chooseAnyCardItemGreenThumbAction marketGreenThumbAction');
            $('#chooseAnyMarketCardItemBtnInstructionsAndBtns #cancelChooseAnyMarketCardItemAction').removeAttr('disabled');
            
            processChosenAndItems();
        }, 2400);
    }

});


$(document).on('mouseenter','#marketSection.gameSection .marketColumn .cardsAndItemContainer .marketItemOverlay .itemToken .nurtureItemExplanation',function(){
    $(this).closest('.marketColumn').addClass('raisedColumn');
});

$(document).on('mouseleave','#marketSection.gameSection .marketColumn .cardsAndItemContainer .marketItemOverlay .itemToken .nurtureItemExplanation',function(){
    $('.raisedColumn').removeClass('raisedColumn');
});

$(document).on('mouseenter',' #gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn .cardContainer',function(){    

    $(this).addClass('potentialMarketCardChoice');
    $(this).parent().addClass('potentialCardOverlayParent');
    $(this).closest('.marketColumn').addClass('activeColumn');

    setTimeout(function(){        
        $('.marketColumn.activeColumn .cardsAndItemContainer .marketItemOverlay .itemToken').addClass('potentialMarketItemChoice');
        $('.marketColumn.activeColumn .cardsAndItemContainer .marketItemOverlay').addClass('potentialItemOverlayParent');
    }, 10);

    setTimeout(function(){        
        let tempGreenThumb = `
            <div class="potentialGreenThumbContainer">
                <p class="plusGreenThumbText">+</p>
                <img class="potentialGreenThumb" src="img/thumbs/${Math.floor(Math.random() * 5)}.png">
            </div>
        `;
        $('.marketColumn.activeColumn .cardsAndItemContainer .marketCardOverlay:not(.potentialCardOverlayParent) .cardContainer').append(tempGreenThumb);
    }, 20);

    setTimeout(function(){        
        $('.marketColumn.activeColumn .cardsAndItemContainer .marketCardOverlay:not(.potentialCardOverlayParent) .cardContainer .potentialGreenThumbContainer').addClass('showPotentialGreenThumb');
    }, 30);
    
});

$(document).on('mouseleave','#gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn.activeColumn .cardContainer',function(){    

    resetPotentialMarketSelections();
    $('.activeColumn').removeClass('activeColumn');
    $('#gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn:not(.activeColumn) .cardContainer .potentialGreenThumbContainer.showPotentialGreenThumb').removeClass('showPotentialGreenThumb');
    setTimeout(function(){        
        $('#gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn:not(.activeColumn) .cardContainer .potentialGreenThumbContainer').remove();
    }, 300);
});

function resetPotentialMarketSelections(){    

    $('.potentialMarketCardChoice').removeClass('potentialMarketCardChoice');
    $('.potentialCardOverlayParent').removeClass('potentialCardOverlayParent');
    $('.potentialMarketItemChoice').removeClass('potentialMarketItemChoice');
    $('.potentialItemOverlayParent').removeClass('potentialItemOverlayParent');
}

var currentChosenColumn = '';
var currentChosenCardType = '';

$(document).on(touchEvent,'#gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn.activeColumn .cardContainer.potentialMarketCardChoice',function(){    

    $('.potentialGreenThumbContainer.showPotentialGreenThumb').removeClass('showPotentialGreenThumb');
    setTimeout(function(){        
        $('.potentialGreenThumbContainer').remove();
    }, 300);

    $('.marketColumn.activeColumn').addClass('potentialChosenColumn').removeClass('activeColumn');

    currentChosenColumn = $('.marketColumn.potentialChosenColumn').attr('column')
    currentChosenCardType = $(this).attr('cardtype');
        

    $('.gameSectionContent > #marketCardColumns').clone().appendTo('#confirmChosenColumnContainer #columnToConfirm');
    $('#confirmChosenColumnContainer #columnToConfirm #marketCardColumns').attr('id', 'marketCardColumnsToConfirm');

    $('#confirmChosenColumnContainer.marketActionContainer').attr('view-column', currentChosenColumn);
    $('#confirmChosenColumnContainer.marketActionContainer').attr('view-category', currentChosenCardType);

    $('#confirmChosenColumnContainer.marketActionContainer').fadeIn();
    $('#marketInactiveOverlay').fadeIn();

});


$(document).on(touchEvent,'#confirmChosenColumnContainer.marketActionContainer .zoomedColumnNavArrow',function(){      

    resetPotentialMarketSelections();
    $('.potentialChosenColumn').removeClass('potentialChosenColumn');

    var direction = $(this).attr('arrow-direction');
    
    if(direction == 'left') {
        currentChosenColumn--;
        $('#confirmChosenColumnContainer').attr('view-column', currentChosenColumn);
    } else if(direction == 'right') {
        currentChosenColumn++;
        $('#confirmChosenColumnContainer').attr('view-column', currentChosenColumn);
    } else if(direction == 'up') {
        $('#confirmChosenColumnContainer').attr('view-category', 'plant');
        currentChosenCardType = 'plant';
    } else if(direction == 'down') {
        $('#confirmChosenColumnContainer').attr('view-category', 'room');
        currentChosenCardType = 'room';
    }
     
    $(`.gameSectionContent > #marketCardColumns .marketColumn[column="${currentChosenColumn}"]`).addClass('potentialChosenColumn');
    $(`.gameSectionContent > #marketCardColumns .marketColumn[column="${currentChosenColumn}"] .market${capitalizeFirstLetter(currentChosenCardType)}CardOverlay .cardContainer[cardtype="${currentChosenCardType}"]`).addClass('potentialMarketCardChoice');
    $(`.gameSectionContent > #marketCardColumns .marketColumn[column="${currentChosenColumn}"] .market${capitalizeFirstLetter(currentChosenCardType)}CardOverlay`).addClass('potentialCardOverlayParent');
    $(`.gameSectionContent > #marketCardColumns .marketColumn[column="${currentChosenColumn}"] .marketItemOverlay .itemToken`).addClass('potentialMarketItemChoice');
    $(`.gameSectionContent > #marketCardColumns .marketColumn[column="${currentChosenColumn}"] .marketItemOverlay`).addClass('potentialItemOverlayParent');
    
});

$(document).on(touchEvent,'#confirmChosenColumnContainer.marketActionContainer .btnContainer #cancelColumnChoice',function(){       

    closeConfirmChosenColumnContainer();
});

$(document).on(touchEvent,'#marketInactiveOverlay',function(){        

    closeConfirmChosenColumnContainer();
});

$(document).on(touchEvent,'#confirmChosenColumnContainer.marketActionContainer .delete.closeMarketActionTrigger',function(){        

    closeConfirmChosenColumnContainer();
});

function closeConfirmChosenColumnContainer(){    

    $('#confirmChosenColumnContainer.marketActionContainer').fadeOut();
    $('#marketInactiveOverlay').fadeOut();
    $('.potentialChosenColumn').removeClass('potentialChosenColumn');
    resetPotentialMarketSelections();
    setTimeout(function(){        
        $('#confirmChosenColumnContainer #columnToConfirm').html('');
    }, 400);
}

let currentRoundActionLog = [];

$(document).on(touchEvent,'#confirmChosenColumnContainer.marketActionContainer .btnContainer #confirmColumnChoice',function(){    

    let potentialCardType = $('.marketCardOverlay.potentialCardOverlayParent .cardContainer').attr('cardtype');
    let validCardPlacements = checkPotentialCardPlacements(potentialCardType, 'marketCardSelection');

    if(!validCardPlacements) {
        $(`#${potentialCardType}PlacementsExhaustedModal`).addClass('is-active');
    } else {
        $('#confirmChosenColumnContainer.marketActionContainer').fadeOut();
        $('#marketInactiveOverlay').fadeOut();
        processChosenAndItems();
    }
});

function processChosenAndItems(){

    let potentialCardType = $('.marketCardOverlay.potentialCardOverlayParent .cardContainer').attr('cardtype');
    let validCardPlacements = checkPotentialCardPlacements(potentialCardType, 'marketCardSelection');

    if(!validCardPlacements) {
        console.log(`IF (!validCardPlacements)`);
        $(`#${potentialCardType}PlacementsExhaustedModal`).addClass('is-active');
    } else {
        console.log(`IF (validCardPlacements)`);

        currentRoundActionLog = ['market-selection'];

        $('.potentialChosenColumn').addClass('lockedInColumn').removeClass('potentialChosenColumn');
        $('.potentialMarketCardChoice').addClass('chosenMarketCard').removeClass('potentialMarketCardChoice');
        $('.potentialCardOverlayParent').addClass('lockedInCardOverlay').removeClass('potentialCardOverlayParent');
        $('.potentialMarketItemChoice').addClass('chosenMarketItem').removeClass('potentialMarketItemChoice');
        $('.potentialItemOverlayParent').addClass('lockedInItemOverlay').removeClass('potentialItemOverlayParent');

        $('#gameSectionsParent').attr('current-phase', 'card-item-placement');
        $('.greenThumbActionBtn.marketActionButton').attr('disabled', 'disabled');

        let chosenCardsGreenThumbs = parseInt($('.lockedInCardOverlay .cardContainer .newGreenThumbMasterContainer').attr('total-green-thumbs'));
        let currentGreenThumbs = parseInt($('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').html());
        let newGreenThumbAmount = chosenCardsGreenThumbs + currentGreenThumbs;
                        
        console.log(`chosenCardsGreenThumbs = ${chosenCardsGreenThumbs}`);
        console.log(`currentGreenThumbs = ${currentGreenThumbs}`);
        console.log(`newGreenThumbAmount = ${newGreenThumbAmount}`);

        let extraTimeout = 0;

        if(chosenCardsGreenThumbs > 0) {
            console.log(`IF (oppositeCardGreenThumbs > 0)`);
            extraTimeout = 2550;            

            setTimeout(function(){
                console.log(`IF (validCardPlacements && chosenCardsGreenThumbs > 0) setTimeout(function(){}, 200)`);
                if($(`.lockedInCardOverlay .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).length) {
                    console.log(`IF (validCardPlacements && chosenCardsGreenThumbs > 0 && $('.lockedInCardOverlay .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer').length)`);
                    $(`.lockedInCardOverlay .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).parentToAnimate($('#greenThumbsAmountContainer #greenThumbsEndPoint'), 1300);
                }
        
                if($(`.lockedInCardOverlay .newGreenThumbParentContainer[green-thumb-container="2"] .newGreenThumbContainer`).length) {
                    console.log(`IF (validCardPlacements && chosenCardsGreenThumbs > 0 && $('.lockedInCardOverlay .newGreenThumbParentContainer[green-thumb-container="2"] .newGreenThumbContainer').length)`);
                    $(`.lockedInCardOverlay .newGreenThumbParentContainer[green-thumb-container="2"] .newGreenThumbContainer`).parentToAnimate($('#greenThumbsAmountContainer #greenThumbsEndPoint'), 1300);
                }
            }, 200);

            setTimeout(function(){       
                console.log(`IF (chosenCardsGreenThumbs > 0) setTimeout(function(){}, 1050)`);         
                $('#infoBarStats #greenThumbsAmountContainer').addClass('infoChange')
            }, 1050);
            
            setTimeout(function(){                
                console.log(`IF (chosenCardsGreenThumbs > 0) setTimeout(function(){}, 1550)`);         
                $('#infoBarStats #greenThumbsAmountContainer #greenThumbsEndPoint').html('');
                $('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').html(newGreenThumbAmount);
                $('#infoBarStats #greenThumbsAmountContainer #greenThumbsUpdateInfo').addClass('addVal').html(chosenCardsGreenThumbs);
                $('#infoBarStats #greenThumbsAmountContainer #greenThumbsUpdateInfo').fadeIn();
            }, 1550);

            setTimeout(function(){
                console.log(`IF (chosenCardsGreenThumbs > 0) setTimeout(function(){}, 2550)`);                     
                // $(`.lockedInCardOverlay .cardContainer .greenThumbMarketContainer`).remove();
                $('#infoBarStats #greenThumbsAmountContainer #greenThumbsUpdateInfo').fadeOut();
                $('#infoBarStats #greenThumbsAmountContainer').removeClass('infoChange')
            }, 2550);

            setTimeout(function(){
                console.log(`IF (chosenCardsGreenThumbs > 0) setTimeout(function(){}, 3000)`);        
                $('.addVal').removeClass('addVal');
            }, 3000);
        }

        let oppositeCardGreenThumbs = parseInt($('.marketColumn.lockedInColumn .cardsAndItemContainer .marketCardOverlay:not(.lockedInCardOverlay) .cardContainer .newGreenThumbMasterContainer').attr('total-green-thumbs'));        
        oppositeCardGreenThumbs++;        

        console.log(`oppositeCardGreenThumbs = ${oppositeCardGreenThumbs}`);

        setTimeout(function(){            

            let randomThumb = Math.floor(Math.random() * 5);

            console.log(`randomThumb = ${randomThumb}`);

            let confirmedGreenThumbHTML = `
                <div class="newGreenThumbContainer new-green-thumb-animation">
                    <img class="greenThumb thumbImg" src="img/thumbs/${randomThumb}.png">
                    <img class="redThumb thumbImg" src="img/thumbs/${randomThumb}-X.png">
                </div>
            `;

            $(`.marketColumn.lockedInColumn .cardsAndItemContainer .marketCardOverlay:not(.lockedInCardOverlay) .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${oppositeCardGreenThumbs}"]`).append(confirmedGreenThumbHTML);
            $(`.marketColumn.lockedInColumn .cardsAndItemContainer .marketCardOverlay:not(.lockedInCardOverlay) .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs', oppositeCardGreenThumbs);
        }, extraTimeout + 400);

        if(oppositeCardGreenThumbs > 2) {            
            console.log(`IF (oppositeCardGreenThumbs > 2)`);

            extraTimeout = extraTimeout + 1000;

            setTimeout(function(){              
                console.log(`IF (oppositeCardGreenThumbs > 2) setTimeout(function(){}, extraTimeout + 710)`);     
                $('.marketColumn.lockedInColumn .cardsAndItemContainer .marketCardOverlay:not(.lockedInCardOverlay) .cardContainer .newGreenThumbMasterContainer').addClass('removeAllGreenThumbs');
            }, extraTimeout + 710);

            setTimeout(function(){      
                console.log(`IF (oppositeCardGreenThumbs > 2) setTimeout(function(){}, extraTimeout + 1720)`);               
                $('.marketColumn.lockedInColumn .cardsAndItemContainer .marketCardOverlay:not(.lockedInCardOverlay) .cardContainer .newGreenThumbMasterContainer .newGreenThumbContainer').fadeOut();
            }, extraTimeout + 1720);

            setTimeout(function(){                
                console.log(`IF (oppositeCardGreenThumbs > 2) setTimeout(function(){}, extraTimeout + 2030)`);     
                $('.marketColumn.lockedInColumn .cardsAndItemContainer .marketCardOverlay:not(.lockedInCardOverlay) .cardContainer .newGreenThumbMasterContainer .newGreenThumbContainer').remove();
                $('.marketColumn.lockedInColumn .cardsAndItemContainer .marketCardOverlay:not(.lockedInCardOverlay) .cardContainer .newGreenThumbMasterContainer').attr('total-green-thumbs', '0');
            }, extraTimeout + 2030);

        }

        console.log(`extraTimeout = ${extraTimeout}`);     

        setTimeout(function(){            
            console.log(`setTimeout(function(){}, ${extraTimeout} + 2500 = ${extraTimeout + 2500})`);     
            
            $('.newGreenThumbContainer.new-green-thumb-animation').removeClass('new-green-thumb-animation');
            
            swapActiveMainSection();
            $('#confirmChosenColumnContainer #columnToConfirm').html('');
            $('.cardContainer.chosenMarketCard').parentToAnimate($('#tableauSection #homeContentContainer #playerInfoContainer #cardToPlace'), 1000);
            $('.itemToken.chosenMarketItem').parentToAnimate($('#tableauSection #homeContentContainer #playerInfoContainer #chosenItemParentContainer #chosenItemContainer'), 1000);
        }, extraTimeout + 2500);

        setTimeout(function(){           
            console.log(`setTimeout(function(){}, ${extraTimeout} + 2850 = ${extraTimeout + 2850})`);      
            animateElem($('#tableauSection #undoNextRoundBtnContainer'), 'showRoundEndOptions');
        }, extraTimeout +  2850);

        setTimeout(function(){      
            console.log(`setTimeout(function(){}, ${extraTimeout} + 3850 = ${extraTimeout + 3850})`);           
            $('#undoNextRoundBtnContainer #undoAction').removeAttr('disabled');

            $('#cardToPlace .cardContainer').attr('style', '');
            $('#cardToPlace .cardContainer').addClass('activePlacement');

            $('#chosenItemContainer .itemToken').attr('style', '');
            $('#chosenItemContainer .itemToken').addClass('inactivePlacement');
            
            $('#playerInfoContainer #addOneVerdancyToPlantBtn').removeAttr('disabled');

            showPotentialCardPlacements();
        }, extraTimeout +  3850);
    }
}

$(document).on(touchEvent,'#undoNextRoundBtnContainer #undoAction.button',function(){    


    var undoAction = currentRoundActionLog.pop();    
    setTimeout(function(){        
        roundState('swapItems');
    }, 10);

    if(undoAction == 'market-selection') {        
        swapActiveMainSection();

        $('.activePlacement').removeClass('activePlacement');
        $('.inactivePlacement').removeClass('inactivePlacement');

        $('.cardContainer.chosenMarketCard').parentToAnimate($('.lockedInCardOverlay'), 1000);
        
        $('.itemToken.chosenMarketItem').parentToAnimate($('.lockedInItemOverlay'), 1000);

        if($('#chosenItemParentContainer #chosenItemContainer .itemToken:not(.chosenMarketItem)').length) {
            $('#chosenItemParentContainer #chosenItemContainer .itemToken').parentToAnimate($('#storedItemParentContainer #storedItemContainer'), 1000);
        }
        $('.mapTileContainer.activePotentialCardPlacement').addClass('animatingElem mediumTransitionAll');
        $('.mapTileContainer.activePotentialItemPlacement').addClass('animatingElem mediumTransitionAll');

        setTimeout(function(){            
            $('.mapTileContainer.activePotentialCardPlacement').removeClass('activePotentialCardPlacement');
            $('.mapTileContainer.activePotentialItemPlacement').removeClass('activePotentialItemPlacement');
        }, 50);

        setTimeout(function(){            
            $('.mapTileContainer.potentialCardPlacement').removeClass('potentialCardPlacement');
            $('.mapTileContainer.potentialItemPlacement').removeClass('potentialItemPlacement');
        }, 800);

        setTimeout(function(){            
            $('.mapTileContainer.animatingElem.mediumTransitionAll').removeClass('animatingElem mediumTransitionAll');
            $('.mapTileContainer.animatingElem.mediumTransitionAll').removeClass('animatingElem mediumTransitionAll');
        }, 850);
        
        animateElem($('#tableauSection #undoNextRoundBtnContainer'), 'hideRoundEndOptions');

        setTimeout(function(){            
            $('.lockedInColumn').removeClass('lockedInColumn');
            $('.chosenMarketCard').removeClass('chosenMarketCard');
            $('.lockedInCardOverlay').removeClass('lockedInCardOverlay');
            $('.chosenMarketItem').removeClass('chosenMarketItem');
            $('.lockedInItemOverlay').removeClass('lockedInItemOverlay');

            $('#gameSectionsParent').attr('current-phase', 'market-selection');
        }, 1010);

        $('#playerInfoContainer #useItemsBtn').attr('disabled', 'disabled');
        $('#playerInfoContainer').removeClass('nurtureItemActive');
        $('#playerInfoContainer #useItemsBtn').removeAttr('item-to-use');

    } else if(undoAction == 'card-placement') {
        
        $('.mapTileContainer.confirmedCardPlacement .cardContainer');

    } else if(undoAction == 'item-placement') {

        $('.mapTileContainer.confirmedCardPlacement .cardContainer');
    }
});



let lightingContainerPositions = ['top', 'right', 'bottom', 'left'];
let lightingSymbolNumbers = ['one', 'two', 'three'];

let initMarketInterval;
let initMarketFlipCardsInterval;

let currentColumn = 3;
let currentMarketItem = 0;


let lockMap = true;

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
                '13': {
                    'vertical': '45',
                    'horizontal': '55'
                },
                '12': {
                    'vertical': '45',
                    'horizontal': '55'
                },
                '11': {
                    'vertical': '40',
                    'horizontal': '50'
                },
                '10': {
                    'vertical': '40',
                    'horizontal': '50'
                },
                '9': {
                    'vertical': '35',
                    'horizontal': '45'
                },
                '8': {
                    'vertical': '35',
                    'horizontal': '45'
                },
                '7': {
                    'vertical': '30',
                    'horizontal': '40'
                },
                '6': {
                    'vertical': '30',
                    'horizontal': '40'
                },
                '5': {
                    'vertical': '20',
                    'horizontal': '25'
                },
                '4': {
                    'vertical': '20',
                    'horizontal': '25'
                },
            },
			'unit': 'px'
		},
        'tabletView': {
            'zoomIncs': {
                '13': {
                    'vertical': '60',
                    'horizontal': '70'
                },
                '12': {
                    'vertical': '60',
                    'horizontal': '70'
                },
                '11': {
                    'vertical': '55',
                    'horizontal': '65'
                },
                '10': {
                    'vertical': '55',
                    'horizontal': '65'
                },
                '9': {
                    'vertical': '50',
                    'horizontal': '60'
                },
                '8': {
                    'vertical': '50',
                    'horizontal': '60'
                },
                '7': {
                    'vertical': '45',
                    'horizontal': '55'
                },
                '6': {
                    'vertical': '45',
                    'horizontal': '55'
                },
                '5': {
                    'vertical': '35',
                    'horizontal': '45'
                },
                '4': {
                    'vertical': '35',
                    'horizontal': '45'
                },
            },
			'unit': 'px'
		},
		'mobileView': {
            'zoomIncs': {
                '13': {
                    'vertical': '21',
                    'horizontal': '21'
                },
                '12': {
                    'vertical': '21',
                    'horizontal': '21'
                },
                '11': {
                    'vertical': '19',
                    'horizontal': '19'
                },
                '10': {
                    'vertical': '19',
                    'horizontal': '19'
                },
                '9': {
                    'vertical': '17',
                    'horizontal': '17'
                },
                '8': {
                    'vertical': '17',
                    'horizontal': '17'
                },
                '7': {
                    'vertical': '15',
                    'horizontal': '15'
                },
                '6': {
                    'vertical': '15',
                    'horizontal': '15'
                },
                '5': {
                    'vertical': '13',
                    'horizontal': '13'
                },
                '4': {
                    'vertical': '13',
                    'horizontal': '13'
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
		'13': {
			xCardsVisible: 24, // horizontal
			yCardsVisible: 24  // vertical
		},
        '12': {
			xCardsVisible: 24, // horizontal
			yCardsVisible: 24  // vertical
		},
        '11': {
			xCardsVisible: 24, // horizontal
			yCardsVisible: 24  // vertical
		},
        '10': {
			xCardsVisible: 24, // horizontal
			yCardsVisible: 24  // vertical
		},
        '9': {
			xCardsVisible: 32, // horizontal
			yCardsVisible: 24  // vertical
		},
        '8': {
			xCardsVisible: 32, // horizontal
			yCardsVisible: 24  // vertical
		},
		'7': {
			xCardsVisible: 32, // horizontal
			yCardsVisible: 32  // vertical
		},
        '6': {
			xCardsVisible: 32, // horizontal
			yCardsVisible: 32  // vertical
		},
		'5': {
			xCardsVisible: 40, // horizontal
			yCardsVisible: 32  // vertical
		},
        '4': {
			xCardsVisible: 40, // horizontal
			yCardsVisible: 32  // vertical
		},
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


var placedCardsRange = {
    rows: {
        locked: false,
        currentRange: 1,
        limit: 3,
        low: 2,
        high: 2
    },
    columns: {
        locked: false,
        currentRange: 1,
        limit: 5,
        low: 4,
        high: 4
    }
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
	var mapHTML = `<div id="mapHiddenOverlay" animation-scale-amount=".9" style="transform: scale(0.9);">`;
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

        if (e.which == 81) { 
            if(zoomLevel < 13) {
                configureNewZoom('zoomIn');
                return false;
            }
        } else if (e.which == 69) { 
            if(zoomLevel > 4) {
                configureNewZoom('zoomOut');
                return false;
            }
		} else if (e.which == 37 || e.which == 65) { 
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

$(document).on('mouseenter','#mapContainer .mapTileContainer.potentialCardPlacement.activePotentialCardPlacement:not(.temporaryCardPlacement)',function(){    

    if(!lockMap) {        
        $(this).addClass('cardPlacementPreview');
        var thisMapTile = $(this);
        $('.cardContainer.activePlacement').clone().appendTo(thisMapTile);
    }
});

$(document).on('mouseleave','#mapContainer .mapTileContainer.potentialCardPlacement.activePotentialCardPlacement.cardPlacementPreview:not(.temporaryCardPlacement)',function(){        

    if(!lockMap) {        
        $(this).removeClass('cardPlacementPreview');
        $('#mapContainer .mapTileContainer.potentialCardPlacement:not(.temporaryCardPlacement) .cardContainer').remove();
    }
});

$(document).on(touchEvent,'#mapContainer .mapTileContainer.potentialCardPlacement.activePotentialCardPlacement:not(.temporaryCardPlacement)',function(){        
    
    if(!lockMap) {        
        $('#undoNextRoundBtnContainer #undoAction').attr('disabled', 'disabled');
        lockMap = true;        
        toggleMapVerdancy('hide');
        if($('#mapContainer .mapTileContainer.potentialCardPlacement:not(.temporaryCardPlacement) .cardContainer').length) {            
            $('#mapContainer .mapTileContainer.potentialCardPlacement:not(.temporaryCardPlacement) .cardContainer').remove();
        }
        $('.cardPlacementPreview').removeClass('cardPlacementPreview');
        var targID = $(this).attr('id');
        $('#mapContainer .mapTileContainer.potentialCardPlacement.temporaryCardPlacement').addClass('activePotentialCardPlacement').removeClass('temporaryCardPlacement');
        temporarilyLockMap(1000);        

        $('.cardContainer.activePlacement').parentToAnimate($(`#${targID}`), 1000);

        setTimeout(function(){            
            animateElem($('#mapContainer #placedCardOptions'), 'showCardOptions');
        }, 450)

        setTimeout(function(){            
            $(`#${targID}`).removeClass('activePotentialCardPlacement').addClass('temporaryCardPlacement');
            if(startingPlacement) {                
                if($('#verdancyVisibilityContainer.disableVerdancyVisibility').length) {                    
                    $('#verdancyVisibilityContainer.disableVerdancyVisibility').removeClass('disableVerdancyVisibility');
                }
            }
        }, 950);
        
    }
});

$(document).on(touchEvent,'#cancelCardPlacement.button',function(){    

    animateElem($('#mapContainer #placedCardOptions'), 'hideCardOptions');
    $('.cardContainer.activePlacement').parentToAnimate($('#playerInfoContainer #cardToPlace'), 1000);
    resetPotentialMapPlacements('resetCardToPlace');
    if(startingPlacement) {
        $('#verdancyVisibilityContainer').addClass('disableVerdancyVisibility');
    }
    setTimeout(function(){        
        $('#undoNextRoundBtnContainer #undoAction').removeAttr('disabled');
    }, 1000);
});


$(document).on(touchEvent,'#confirmCardPlacement.button',function(){

    lockMap = true;    

    currentRoundActionLog.push('card-placement');

    if($('#viewPotScoringBtn').hasClass('hidePotScoringLayer')) {        
        togglePotScoringLayerVisibility('hide');
    }

    let placedMapID = $('.mapTileContainer.temporaryCardPlacement').attr('id');
    let placedCardType = $('.mapTileContainer.temporaryCardPlacement .cardContainer').attr('cardtype');

    let placedCardRow = $('.mapTileContainer.temporaryCardPlacement').data('map-row');
    let placedCardColumn = $('.mapTileContainer.temporaryCardPlacement').data('map-column');
                

    if(placedCardType == 'room') {        
        $(`#${placedMapID}`).attr('cardtype', 'room');
        $(`#${placedMapID}`).attr('placed-item', 'none');
    } else {        
        $(`#${placedMapID}`).attr('cardtype', 'plant');
        $(`#${placedMapID}`).attr('plant-pot', 'none');
    }

    checkLightingMatches(`#${placedMapID}`);
    animateElem($('#mapContainer #placedCardOptions'), 'hideCardOptions');

    $('.mapTileContainer.potentialCardPlacement').addClass('animatingElem mediumTransitionAll');

    setTimeout(function(){        
        $('.mapTileContainer.activePotentialCardPlacement').removeClass('activePotentialCardPlacement');
    }, 50);

    setTimeout(function(){        
        if(!startingPlacement) {            
            $('.mapTileContainer.temporaryCardPlacement').addClass('confirmedCardPlacement');
            $('.mapTileContainer.temporaryCardPlacement .cardContainer.activePlacement').addClass('placedCard').removeClass('activePlacement');
        }
        $('.mapTileContainer.temporaryCardPlacement').removeClass('temporaryCardPlacement');

    }, 300);

    setTimeout(function(){        
        $('.mapTileContainer.animatingElem.mediumTransitionAll').removeClass('animatingElem mediumTransitionAll');
    }, 800);

    setTimeout(function(){        
        $('.mapTileContainer.potentialCardPlacement').removeClass('potentialCardPlacement');
        updatePlayersTableauLimits(placedCardRow, placedCardColumn);
    }, 850);
});

let lightingMatches = [];
let showLightingMatchesInterval;
let lightingMatchCount = 0;

function checkLightingMatches(mapID) {    
    

    lightingMatches = [];
    lightingMatchCount = 0;
    var $card = $(`${mapID} .cardContainer.activePlacement`);
    var cardType = $card.attr('cardtype');
    var thisRow = $card.closest('.mapTileContainer').data('map-row');
    var thisColumn =  $card.closest('.mapTileContainer').data('map-column');
                

    var plantCardID = '';

    let allNeighbours = findMapNeighbours(parseInt(thisRow), parseInt(thisColumn), oppositeType[cardType], true);

    if(cardType == 'plant') {
        plantCardID = mapID;

        let plantLightingNum = parseInt($card.data('lighting-num'));
        let plantLightingData = $card.data('lighting-types');
                
        
        let allPlantLighting = [];

        if(plantLightingNum > 1) {            
            let splitLightingData = plantLightingData.split(' ');            
            allPlantLighting.push(...splitLightingData);
        } else if(plantLightingNum == 1){            
            allPlantLighting.push(plantLightingData);
        }
                

        for (const [key, value] of Object.entries(allNeighbours)) {
                        

            let touchingLightingIcon = $(`${key}.mapTileContainer .cardContainer`).data(`lighting-${oppositePos[value]}`);
            if(allPlantLighting.indexOf(touchingLightingIcon) !== -1) {
                lightingMatches.push(
                    [
                        `${key}.mapTileContainer .cardContainer .lightingIconContainer-${oppositePos[value]} .lightingIcon`, // room = [0] index
                        `${mapID}.mapTileContainer .cardContainer .verdancyIconsAndVPLayer .verdancyLightingIcon[data-lighting-type="${touchingLightingIcon}"]` // plant = [1] index
                    ]
                );
            }
        }
    } else if(cardType == 'room') {        
        

        for (const [key, value] of Object.entries(allNeighbours)) {
                        

            let cardPlantPotInfo = $(`${key}.mapTileContainer`).attr('plant-pot');            

            if (typeof cardPlantPotInfo !== typeof undefined && cardPlantPotInfo !== false) {
                if(cardPlantPotInfo != 'none') {
                    continue;
                }
            }

            let touchingLightingIcon = $card.data(`lighting-${value}`);

            let plantLightingNum = parseInt($(`${key}.mapTileContainer .cardContainer`).data('lighting-num'));
            let plantLightingData = $(`${key}.mapTileContainer .cardContainer`).data('lighting-types');
                        

            let allPlantLighting = [];

            if(plantLightingNum > 1) {                
                let splitLightingData = plantLightingData.split(' ');
                allPlantLighting.push(...splitLightingData);
                

            } else if(plantLightingNum == 1){                
                allPlantLighting.push(plantLightingData);
            }
            

            if(allPlantLighting.indexOf(touchingLightingIcon) !== -1) {                
                lightingMatches.push(
                    [
                        `${mapID}.mapTileContainer .cardContainer .lightingIconContainer-${value} .lightingIcon`, // room = [0] index
                        `${key}.mapTileContainer .cardContainer .verdancyIconsAndVPLayer .verdancyLightingIcon[data-lighting-type="${touchingLightingIcon}"]` // plant = [1] index
                    ]
                );
            }
        };
    }
    

    if(lightingMatches.length !== 0) {        
        toggleMapVerdancy('hide');
        setTimeout(function(){              
            for (let i = 0; i < lightingMatches.length; i++) {
                let thisPlantCard = lightingMatches[i][1];
                let splitPlantCard = thisPlantCard.split(' ');
                                                

                $(`${splitPlantCard[0]} ${splitPlantCard[1]} ${splitPlantCard[2]}`).addClass('showIndividualVerdancyLayer');
            }
        }, 10);
        setTimeout(function(){            
            showLightingMatchesFunc();
        }, 720);
    } else {        
        if(startingPlacement) {            
            startFirstRound();
        } else {            
            toggleMapVerdancy('hide');
            $('.showIndividualVerdancyLayer').removeClass('showIndividualVerdancyLayer');
            if($('#chosenItemContainer .itemToken.inactivePlacement').length) {                
                $('#chosenItemContainer .itemToken.inactivePlacement').attr('style', '');
                $('#chosenItemContainer .itemToken.inactivePlacement').addClass('activePlacement').removeClass('inactivePlacement');
                roundState('roundCheck');
                roundState('roundCheck');
                lockMap = false;
            } else {                
                $('#undoNextRoundBtnContainer #undoAction').removeAttr('disabled');
                activateNextRoundBtn();
                lockMap = false;
            }
        }
    }
}

function showLightingMatchesFunc() {

    completedPlantsThisTurn = [];
    
    
    // lightingMatches[0] = room
    // lightingMatches[1] = plant
    

    let splitPlantCardID = lightingMatches[lightingMatchCount][1].split(' ');
    let plantCardID = splitPlantCardID[0];
    let splitRoomCardID = lightingMatches[lightingMatchCount][0].split(' ');
    let lightingSymbolPos = splitRoomCardID[2].split('-');
                
        

    $(`${lightingMatches[lightingMatchCount][0]}`).attr('style', `transform-origin: ${lightingSymbolPos[1]}`);
    $(`${lightingMatches[lightingMatchCount][1]}`).attr('style', '');

    $(`${lightingMatches[lightingMatchCount][0]}`).addClass('matchedLighting');
    $(`${lightingMatches[lightingMatchCount][1]}`).addClass('matchedLighting');

    setTimeout(function(){        
        $(`${lightingMatches[lightingMatchCount][0]}.matchedLighting`).addClass('matchedLightingAnimation');
        $(`${lightingMatches[lightingMatchCount][1]}.matchedLighting`).addClass('matchedLightingAnimation');
    }, 410);

    setTimeout(function(){        
        // let currentVerdancy = $(`${plantCardID}`).addClass('confirmedVerdancyAddition');
        let currentVerdancy = $(`${plantCardID} .cardContainer .verdancyIconsAndVPLayer`).attr('verdancy-completed');
        
        $(`${plantCardID} .cardContainer .verdancyIconsAndVPLayer .verdancyIconContainer[data-verdancy-icon-num="${currentVerdancy}"]`).addClass('completeVerdancy').removeClass('incompleteVerdancy');
        
        currentVerdancy++;        
        
        $(`${plantCardID} .cardContainer .verdancyIconsAndVPLayer`).attr('verdancy-completed', currentVerdancy);
    }, 1310);

    setTimeout(function(){        
        $(`${lightingMatches[lightingMatchCount][0]}.matchedLighting.matchedLightingAnimation`).removeClass('matchedLightingAnimation');
        $(`${lightingMatches[lightingMatchCount][1]}.matchedLighting.matchedLightingAnimation`).removeClass('matchedLightingAnimation');
    }, 1720);

    setTimeout(function(){        
        $(`${lightingMatches[lightingMatchCount][0]}.matchedLighting`).removeClass('matchedLighting');
        $(`${lightingMatches[lightingMatchCount][1]}.matchedLighting`).removeClass('matchedLighting');

        lightingMatchCount++;
                
        

        if(lightingMatchCount < lightingMatches.length) {            
            setTimeout(function(){                
                showLightingMatchesFunc();
            }, 300);
        } else {            
            if(startingPlacement) {                
                startFirstRound();
            } else {                

                completedPlantsThisTurn = checkForCompletedPlants();

                let nextStageTimeout = 0;
                if(completedPlantsThisTurn.length != 0) {
                    $('.showIndividualVerdancyLayer').removeClass('showIndividualVerdancyLayer');
                    gainPlantPots();
                } else {
                    $('.showIndividualVerdancyLayer').removeClass('showIndividualVerdancyLayer');
                    if($('#chosenItemContainer .itemToken.inactivePlacement').length) {                        
                        $('#chosenItemContainer .itemToken.inactivePlacement').attr('style', '');
                        $('#chosenItemContainer .itemToken.inactivePlacement').addClass('activePlacement').removeClass('inactivePlacement');
                        roundState('roundCheck');
                        roundState('roundCheck');
                        lockMap = false;
                    } else {                        
                        $('#undoNextRoundBtnContainer #undoAction').removeAttr('disabled');
                        activateNextRoundBtn();
                        lockMap = false;
                    }
                }
            }
        };
    }, 2420);
}


function checkForCompletedPlants() {    
    let completedPlants = [];
    $(`#mapHiddenOverlay .mapTileContainer[cardtype="plant"][plant-pot="none"] .cardContainer .verdancyIconsAndVPLayer`).each(function(){
        let thisID = $(this).closest('.mapTileContainer').attr('id');                        
        if($(this).attr('verdancy-completed') >= $(this).attr('verdancy-icons')) {
            $(this).closest('.mapTileContainer').addClass('pendingPlantPot');            
            completedPlants.push(thisID);
        }
    });    
    return completedPlants;
}

function gainPlantPots() {    

    toggleMapVerdancy('hide');

    setTimeout(function(){

        let completedPotTickHTML = `
            <div class="completedPotTickContainer completed-plant-tick-animation">
                <img class="completedTickImg" src="img/tick.png" alt="" />
            </div>
        `;

        $('#mapHiddenOverlay .mapTileContainer.pendingPlantPot').append(completedPotTickHTML);
    }, 700);

    setTimeout(function(){
        togglePotScoringLayerVisibility('show');
    }, 1500);

    setTimeout(function(){
        let currentActivePotNum = 0;
        let nextActivePotTrigger = false;
        
        for (let i = 0; i < completedPlantsThisTurn.length; i++) {
            nextActivePotTrigger = false;            

            while(!nextActivePotTrigger) {                
                if($(`.availableScoringPlantPot[plant-pot-priority="${currentActivePotNum}"] .plantPotContainer`).length) {                    
                    nextActivePotTrigger = true;
                } else {
                    currentActivePotNum++;
                }
                if(currentActivePotNum == 10) break;
            }

            let plantPotType = $(`.availableScoringPlantPot[plant-pot-priority="${currentActivePotNum}"] .plantPotContainer`).data('pot-type');

            $(`#${completedPlantsThisTurn[i]}`).attr('plant-pot', plantPotType);            

            let verdancyLayerPlantPointsIcon = `
                <img class="completedVerdancyIcon verdancyLayerImg" src="img/completed-verdancy.png" />
            `;

            $(`#${completedPlantsThisTurn[i]} .verdancyIconsAndVPLayer`).append(verdancyLayerPlantPointsIcon);

            let verdancyLayerPotPoints = `
                <div class="plantPotContainer">
                    <img class="plantPotScoring" src="img/pots/${plantPotType}.png" alt="" />
                </div>
            `;
                    
        
            $(`#${completedPlantsThisTurn[i]} .verdancyIconsParentContainer`).html(verdancyLayerPotPoints);

            $('.completedPotTickContainer.completed-plant-tick-animation').removeClass('completed-plant-tick-animation');
            setTimeout(function(){
                $('.completedPotTickContainer').fadeOut();
            }, 10);

            $(`.availableScoringPlantPot[plant-pot-priority="${currentActivePotNum}"] .plantPotContainer`).parentToAnimate(`#${completedPlantsThisTurn[i]} .earnedPlantPotContainer`, 1000);
        }
    }, 2500);

    setTimeout(function(){
        togglePotScoringLayerVisibility('hide');
    }, 4000);

    setTimeout(function(){
        $('.completedPotTickContainer').remove();
    }, 4500);

    setTimeout(function(){
        $('.mapTileContainer[cardtype="plant"]:not([plant-pot="none"]) .earnedPlantPotContainer .plantPotContainer .plantPotScoring').remove();
        $('.mapTileContainer[cardtype="plant"]:not([plant-pot="none"]) .earnedPlantPotContainer .plantPotContainer').removeClass('hideScoring showScoring');

        roundState('roundCheck');
                
        if($('#potDiscardPile .potDiscardSlot .plantPotContainer').length > 0 && !$('#potDiscardPile .potDiscardSlot[data-pot-discard-slot="0"] .plantPotContainer').length) {            
            removeDiscardPotSpaces(completedPlantsThisTurn.length);
            updateDiscardPotTotal();
        }
        $('.pendingPlantPot').removeClass('pendingPlantPot');
        lockMap = false;
    }, 5500);

}

function removeDiscardPotSpaces(amountOfPots) {    

    let amountToShiftPotsUp = 0;

    if($(`#potDiscardPile .potDiscardSlot.availableScoringPlantPot[plant-pot-priority="${amountOfPots}"] .plantPotContainer`).length) {
        
        amountToShiftPotsUp = amountOfPots - 1;

    } else if($(`#potDiscardPile .potDiscardSlot.availableScoringPlantPot[plant-pot-priority="${amountOfPots + 1}"] .plantPotContainer`).length) {        
        amountToShiftPotsUp = amountOfPots;
    }
    
    
    $(`#potDiscardPile .potDiscardSlot.availableScoringPlantPot .plantPotContainer`).each(function(){
        let currentPos = $(this).closest('.potDiscardSlot').data('pot-discard-slot');        

        let newPos = currentPos - amountToShiftPotsUp;        

        $(this).appendTo(`#potDiscardPile .potDiscardSlot.availableScoringPlantPot[data-pot-discard-slot="${newPos}"]`);        
    });
}

function updateDiscardPotTotal(){
    let discardPotsNum = $(`#potDiscardPile .potDiscardSlot .plantPotContainer`).length;
    $('#potScoringInfoContainer').attr('discarded-pots', discardPotsNum);
}

function activateNextRoundBtn(){    
    
    var nextRoundDisabled = $('#undoNextRoundBtnContainer #nextRound').attr('disabled');    

    if (typeof nextRoundDisabled !== typeof undefined && nextRoundDisabled !== false) {        
        $('#undoNextRoundBtnContainer #nextRound').removeAttr('disabled');
        $('#undoNextRoundBtnContainer #nextRound').addClass('next-round-animation');
    
        setTimeout(function(){            
            $('#undoNextRoundBtnContainer #nextRound').removeClass('next-round-animation');
        }, 2500);
    }
}

let leafCountdownInterval;

$(document).on(touchEvent,'#undoNextRoundBtnContainer #nextRound',function(){

    lockMap = true;    
    

    if($(this).hasClass('finalScoring')) {
        $('#finalScoringModal').addClass('is-active');
        leafCountdownInterval = setInterval(leafCountdownFunction, 120);
        return;
    }

    let replacementPlantCardColumns = [0];
    let replacementItemTokenColumns = [0];
    let replacementRoomCardColumns = [0];
    
    let cardTypeToReplace = '';

    let cardColumnToReplace = parseInt($('.lockedInCardOverlay').closest('.marketColumn').attr('column'));
    let itemColumnToReplace = parseInt($('.lockedInItemOverlay').closest('.marketColumn').attr('column'));
        

    if($('.lockedInCardOverlay').hasClass('marketPlantCardOverlay')) {        
        cardTypeToReplace = 'plant';
        if(cardColumnToReplace != 3) {                        
            replacementPlantCardColumns.push(cardColumnToReplace + 1);            
        }
    } else if($('.lockedInCardOverlay').hasClass('marketRoomCardOverlay')) {        
        cardTypeToReplace = 'room';
        if(cardColumnToReplace != 3) {                        
            replacementRoomCardColumns.push(cardColumnToReplace + 1);            
        }
    }

    if(itemColumnToReplace != 3) {                
        replacementItemTokenColumns.push(itemColumnToReplace + 1);        
    }

    let multipleMarketReplacementsTimeout = 0;

    if(replacementPlantCardColumns.length > 1 || replacementItemTokenColumns.length > 1 || replacementRoomCardColumns.length > 1) {
        multipleMarketReplacementsTimeout = 1550;
    }

    $('#undoNextRoundBtnContainer #nextRound').attr('disabled', 'disabled');
    $('#playerInfoContainer #addOneVerdancyToPlantBtn').attr('disabled', 'disabled');
    
    $('.confirmedCardPlacement').removeClass('confirmedCardPlacement');
    $('.chosenMarketCard').removeClass('chosenMarketCard');
    $('.placedCard').removeClass('placedCard');
    $('.temporaryItemPlacement').removeClass('temporaryItemPlacement');
    $('.confirmedItemPlacement').removeClass('confirmedItemPlacement');

    $('.activePlacement').removeClass('activePlacement');
    $('.inactivePlacement').removeClass('inactivePlacement');

    $('.chosenMarketCard').removeClass('chosenMarketCard');
    $('.placedCard').removeClass('placedCard');
    $('.chosenMarketItem').removeClass('chosenMarketItem');
    $('.placedItem').removeClass('placedItem');

    $('.nurtureItemActive').removeClass('nurtureItemActive');

    $('#playerInfoContainer #useItemsBtn').attr('disabled', 'disabled');
    $('#playerInfoContainer #discardItemsBtn').attr('disabled', 'disabled');
    $('#playerInfoContainer #swapItemsBtn').attr('disabled', 'disabled');
    
    let marketColumnsNum = $('#marketCardColumns .marketColumn:not(.hiddenColumn)').length;

    $('#viewPotScoringBtn').attr('disabled', 'disabled');
    animateElem($('#tableauSection #undoNextRoundBtnContainer'), 'hideRoundEndOptions');

    let nextRoundProcessTimeout = 10;

    if($('#viewPotScoringBtn').hasClass('hidePotScoringLayer')) {        
        togglePotScoringLayerVisibility('hide');
        nextRoundProcessTimeout = 710;
    };

    setTimeout(function(){        
        swapActiveMainSection();
    }, nextRoundProcessTimeout);


    let columnFourPlantGreenThumbs = '';
    let columnFourRoomGreenThumbs = '';

    let nextAvailableColumnPlant = '';
    let nextAvailableColumnPlantGreenThumbs = '';

    let nextAvailableColumnRoom = '';
    let nextAvailableColumnRoomGreenThumbs = '';

    if($(`.marketColumn[column="3"] .marketPlantCardOverlay .cardContainer`).length) {        
        columnFourPlantGreenThumbs = parseInt($(`.marketColumn[column="3"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs'));        
        if($(`.marketColumn[column="2"] .marketPlantCardOverlay .cardContainer`).length) {            
            nextAvailableColumnPlant = '2';
            nextAvailableColumnPlantGreenThumbs = parseInt($(`.marketColumn[column="2"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs'));                        
        } else if($(`.marketColumn[column="1"] .marketPlantCardOverlay .cardContainer`).length) {            
            nextAvailableColumnPlant = '1';
            nextAvailableColumnPlantGreenThumbs = parseInt($(`.marketColumn[column="1"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs'));                        
        } else if($(`.marketColumn[column="0"] .marketPlantCardOverlay .cardContainer`).length) {            
            nextAvailableColumnPlant = '0';
            nextAvailableColumnPlantGreenThumbs = parseInt($(`.marketColumn[column="0"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs'));                        
        }
    }

    if($(`.marketColumn[column="3"] .marketRoomCardOverlay .cardContainer`).length) {        
        columnFourRoomGreenThumbs = parseInt($(`.marketColumn[column="3"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs'));        
        if($(`.marketColumn[column="2"] .marketRoomCardOverlay .cardContainer`).length) {            
            nextAvailableColumnRoom = '2';
            nextAvailableColumnRoomGreenThumbs = parseInt($(`.marketColumn[column="2"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs'));                        
        } else if($(`.marketColumn[column="1"] .marketRoomCardOverlay .cardContainer`).length) {            
            nextAvailableColumnRoom = '1';
            nextAvailableColumnRoomGreenThumbs = parseInt($(`.marketColumn[column="1"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs'));                        
        } else if($(`.marketColumn[column="0"] .marketRoomCardOverlay .cardContainer`).length) {            
            nextAvailableColumnRoom = '0';
            nextAvailableColumnRoomGreenThumbs = parseInt($(`.marketColumn[column="0"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs'));                        
        }
    }
    
    let clearSecondToLastPlantGreenThumbLimit = false;

    if(columnFourPlantGreenThumbs > 0 || columnFourRoomGreenThumbs > 0) {        
        nextRoundProcessTimeout = nextRoundProcessTimeout + 900;
    }
    
    if(columnFourPlantGreenThumbs > 0) {        
        let newNextAvailableColumnPlantGreenThumbs = columnFourPlantGreenThumbs + nextAvailableColumnPlantGreenThumbs;
        

        $(`.marketColumn[column="${nextAvailableColumnPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer`)
        $(`.marketColumn[column="${nextAvailableColumnPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs', newNextAvailableColumnPlantGreenThumbs);

        if(columnFourPlantGreenThumbs == 1) {            
            $(`.marketColumn[column="3"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${nextAvailableColumnPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${nextAvailableColumnPlantGreenThumbs + 1}"]`), 1000);

        } else if(columnFourPlantGreenThumbs == 2){            
            $(`.marketColumn[column="3"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${nextAvailableColumnPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${nextAvailableColumnPlantGreenThumbs + 1}"]`), 1000);

            $(`.marketColumn[column="3"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="2"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${nextAvailableColumnPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${nextAvailableColumnPlantGreenThumbs + 2}"]`), 1000);

        } else if(columnFourPlantGreenThumbs == 3) {            
            $(`.marketColumn[column="3"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${nextAvailableColumnPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${nextAvailableColumnPlantGreenThumbs + 1}"]`), 1000);

            $(`.marketColumn[column="3"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="2"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${nextAvailableColumnPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${nextAvailableColumnPlantGreenThumbs + 2}"]`), 1000);

            $(`.marketColumn[column="3"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="3"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${nextAvailableColumnPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${nextAvailableColumnPlantGreenThumbs + 3}"]`), 1000);
            
        }

        if(newNextAvailableColumnPlantGreenThumbs >= 3) {            

            nextRoundProcessTimeout = nextRoundProcessTimeout + 1500;

            setTimeout(function(){
                $(`.marketColumn[column="${nextAvailableColumnPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer`).addClass(`removeAllGreenThumbs`);
            }, 1000);

            setTimeout(function(){
                $(`.marketColumn[column="${nextAvailableColumnPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbContainer`).fadeOut();
            }, 2300);

            setTimeout(function(){
                $(`.marketColumn[column="${nextAvailableColumnPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbContainer`).remove();
                $(`.marketColumn[column="${nextAvailableColumnPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs', '0');
            }, 3300);

            setTimeout(function(){
                $(`.removeAllGreenThumbs`).removeClass(`removeAllGreenThumbs`);
            }, 3500);
        }
        
    } // GREEN THUMB IF STATEMENT END

    if(columnFourRoomGreenThumbs > 0) {        
        let nextAvailableColumnRoomGreenThumbs = parseInt($(`.marketColumn[column="${nextAvailableColumnRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs'));
        let newNextAvailableColumnRoomGreenThumbs = columnFourRoomGreenThumbs + nextAvailableColumnRoomGreenThumbs;
                


        $(`.marketColumn[column="${nextAvailableColumnRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs', newNextAvailableColumnRoomGreenThumbs);

        if(columnFourRoomGreenThumbs == 1) {            
            $(`.marketColumn[column="3"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${nextAvailableColumnRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${nextAvailableColumnRoomGreenThumbs + 1}"]`), 1000);

        } else if(columnFourRoomGreenThumbs == 2){            
            $(`.marketColumn[column="3"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${nextAvailableColumnRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${nextAvailableColumnRoomGreenThumbs + 1}"]`), 1000);

            $(`.marketColumn[column="3"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="2"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${nextAvailableColumnRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${nextAvailableColumnRoomGreenThumbs + 2}"]`), 1000);

        } else if(columnFourRoomGreenThumbs == 3) {            
            $(`.marketColumn[column="3"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${nextAvailableColumnRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${nextAvailableColumnRoomGreenThumbs + 1}"]`), 1000);

            $(`.marketColumn[column="3"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="2"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${nextAvailableColumnRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${nextAvailableColumnRoomGreenThumbs + 2}"]`), 1000);

            $(`.marketColumn[column="3"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="3"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${nextAvailableColumnRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${nextAvailableColumnRoomGreenThumbs + 3}"]`), 1000);

        }

        if(newNextAvailableColumnRoomGreenThumbs >= 3) {            
            nextRoundProcessTimeout = nextRoundProcessTimeout + 500;

            setTimeout(function(){
                $(`.marketColumn[column="${nextAvailableColumnRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer`).addClass(`removeAllGreenThumbs`);
            }, 200);

            setTimeout(function(){
                $(`.marketColumn[column="${nextAvailableColumnRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbContainer`).fadeOut();
            }, 1500);

            setTimeout(function(){
                $(`.marketColumn[column="${nextAvailableColumnRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbContainer`).remove();
                $(`.marketColumn[column="${nextAvailableColumnRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs', '0');
            }, 2000);

            setTimeout(function(){
                $(`.removeAllGreenThumbs`).removeClass(`removeAllGreenThumbs`);
            }, 2200);
        }

    } // GREEN THUMB IF STATEMENT END
    

    setTimeout(function(){        
        // 1600ms -> remove-market-cards-and-item-alt
        if($(`.marketColumn[column="3"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer`).length) {
            $(`.marketColumn[column="3"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer`).attr('style', 'transform-origin: center;');
        }
    
        if($(`.marketColumn[column="3"] .cardsAndItemContainer .marketItemOverlay .itemToken`).length) {
            $(`.marketColumn[column="3"] .cardsAndItemContainer .marketItemOverlay .itemToken`).attr('style', 'transform-origin: center;');
        }
    
        if($(`.marketColumn[column="3"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer`).length) {
            $(`.marketColumn[column="3"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer`).attr('style', 'transform-origin: center;');
        }

        setTimeout(function(){
            if($(`.marketColumn[column="3"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer`).length) {
                $(`.marketColumn[column="3"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer`).addClass('remove-market-cards-and-item-alt');
            }
        
            if($(`.marketColumn[column="3"] .cardsAndItemContainer .marketItemOverlay .itemToken`).length) {
                $(`.marketColumn[column="3"] .cardsAndItemContainer .marketItemOverlay .itemToken`).addClass('remove-market-cards-and-item-alt');
            }
        
            if($(`.marketColumn[column="3"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer`).length) {
                $(`.marketColumn[column="3"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer`).addClass('remove-market-cards-and-item-alt');
            }
        }, 10);

    }, 670 + nextRoundProcessTimeout);

    setTimeout(function(){        
        $('.remove-market-cards-and-item-alt').remove();

        let plantsRequiredColumns = [];
        let roomsRequiredColumns = [];

        // Old code added replacement cards to destination column, but then offset them to their originating position
/*      let replacementPlantCardColumns = [0, 2];  
        let replacementItemTokenColumns = [0, 2];
        let replacementRoomCardColumns = [0];
*/
        // CODE BELOW FOR NEW CARD HTML!!!!!!!!!!!!

        let columnOffsetClasses = ['oneColumnOffset', 'twoColumnOffset', 'threeColumnOffset', 'fourColumnOffset'];

        for (let i = 0; i < replacementPlantCardColumns.length; i++) {
            let thisPlantCard = allPlantCards.splice(0, 1);
            
            let thisPlantCardHTML = generateCard(thisPlantCard[0], 'plant', 'market', 'market');
            $(`.marketColumn[column="${replacementPlantCardColumns[i]}"] .cardsAndItemContainer .marketPlantCardOverlay`).append(thisPlantCardHTML);
            $(`.marketColumn[column="${replacementPlantCardColumns[i]}"] .cardsAndItemContainer .marketPlantCardOverlay .newCardContainer`).addClass(`${columnOffsetClasses[replacementPlantCardColumns[i]]} startingPosAnimate startingPos`);
                                                            

        }

        for (let i = 0; i < replacementItemTokenColumns.length; i++) {
            let thisItemToken = allItemTokens.splice(0, 1);            
            let thisItemTokenHTML = generateItem(thisItemToken[0], 'market');            
            $(`.marketColumn[column="${replacementItemTokenColumns[i]}"] .cardsAndItemContainer .marketItemOverlay`).append(thisItemTokenHTML);
            $(`.marketColumn[column="${replacementItemTokenColumns[i]}"] .cardsAndItemContainer .marketItemOverlay .newItemToken`).addClass(`${columnOffsetClasses[replacementItemTokenColumns[i]]} startingPosAnimate startingPos`);

                                                            
        }

        for (let i = 0; i < replacementRoomCardColumns.length; i++) {
            let thisRoomCard = allRoomCards.splice(0, 1);                
            let thisRoomCardHTML = generateCard(thisRoomCard[0], 'room', 'market', 'market');   
            $(`.marketColumn[column="${replacementRoomCardColumns[i]}"] .cardsAndItemContainer .marketRoomCardOverlay`).append(thisRoomCardHTML);
            $(`.marketColumn[column="${replacementRoomCardColumns[i]}"] .cardsAndItemContainer .marketRoomCardOverlay .newCardContainer`).addClass(`${columnOffsetClasses[replacementRoomCardColumns[i]]} startingPosAnimate startingPos`);
                                                            
        }

        let columnShiftDetails = [
            ['.marketPlantCardOverlay', '.cardContainer', 'newCardContainer'],
            ['.marketItemOverlay', '.itemToken', 'newItemToken'],
            ['.marketRoomCardOverlay', '.cardContainer', 'newCardContainer']
        ]

        for (let i = 2; i >= 0; i--) {
            for (let j = 0; j < columnShiftDetails.length; j++) {
                if($(`.marketColumn[column="${i}"] .cardsAndItemContainer ${columnShiftDetails[j][0]} ${columnShiftDetails[j][1]}:not(.${columnShiftDetails[j][2]})`).length) {
                    $(`.marketColumn[column="${i}"] .cardsAndItemContainer ${columnShiftDetails[j][0]} ${columnShiftDetails[j][1]}:not(.${columnShiftDetails[j][2]})`).addClass(`${columnShiftDetails[j][2]} oneColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="${i + 1}"] .cardsAndItemContainer ${columnShiftDetails[j][0]}`);
                                                                                                    
                }
            }
        }

        setTimeout(function(){            
            $('.oneColumnOffset.startingPos').removeClass('startingPos');
        }, 50);

        setTimeout(function(){            
            $('.startingPos').removeClass('startingPos');
        }, 1550);

    }, 2500 + nextRoundProcessTimeout);

    setTimeout(function(){        
        togglePotScoringLayerVisibility('show');
    }, 4050 + nextRoundProcessTimeout + multipleMarketReplacementsTimeout);

    setTimeout(function(){        
           
        let discardPilePots = $(`#potDiscardPile .potDiscardSlot .plantPotContainer`).length;
        let drawPilePots = $(`#potDrawPile .potDrawSlot .plantPotContainer`).length;
                

        let emptyFourthColumnPot = false; 
        if(!$(`#marketCardColumns .marketColumn[column="3"] .plantPotOverlay .plantPotContainer:not(.newPlantPot)`).length) {            
            emptyFourthColumnPot = true;
        }        

        if(discardPilePots > 0 && !emptyFourthColumnPot) {            
            for (let i = discardPilePots - 1; i >= 0; i--) {
                if($(`#potDiscardPile .potDiscardSlot[data-pot-discard-slot="${i}"] .plantPotContainer:not(.newPlantPot)`).length) {                    
                    $(`#potDiscardPile .potDiscardSlot[data-pot-discard-slot="${i}"] .plantPotContainer:not(.newPlantPot)`).addClass(`newPlantPot discardPileOffset startingPosAnimate startingPos`).appendTo(`#potDiscardPile .potDiscardSlot[data-pot-discard-slot="${(i + 1)}"]`);
                }
            }
        }

        if(!emptyFourthColumnPot) {                        
            $(`#marketCardColumns .marketColumn[column="3"] .plantPotOverlay .plantPotContainer:not(.newPlantPot)`).addClass(`newPlantPot discardPileOffset startingPosAnimate startingPos`).appendTo(`#potDiscardPile .potDiscardSlot[data-pot-discard-slot="0"]`);
        }
        
        $(`#marketCardColumns .marketColumn[column="2"] .plantPotOverlay .plantPotContainer:not(.newPlantPot)`).addClass(`newPlantPot mainPotColumnOffset startingPosAnimate startingPos`).appendTo(`#marketCardColumns .marketColumn[column="3"] .plantPotOverlay`);
        $(`#marketCardColumns .marketColumn[column="1"] .plantPotOverlay .plantPotContainer:not(.newPlantPot)`).addClass(`newPlantPot mainPotColumnOffset startingPosAnimate startingPos`).appendTo(`#marketCardColumns .marketColumn[column="2"] .plantPotOverlay`);
        $(`#marketCardColumns .marketColumn[column="0"] .plantPotOverlay .plantPotContainer:not(.newPlantPot)`).addClass(`newPlantPot mainPotColumnOffset startingPosAnimate startingPos`).appendTo(`#marketCardColumns .marketColumn[column="1"] .plantPotOverlay`);

        $(`#potDrawPile .potDrawSlot[data-pot-draw-slot="0"] .plantPotContainer:not(.newPlantPot)`).addClass(`newPlantPot drawPileOffset startingPosAnimate startingPos`).appendTo(`#marketCardColumns .marketColumn[column="0"] .plantPotOverlay`);

        if(drawPilePots > 1) {            
            for (let i = 1; i < drawPilePots; i++) {
                if($(`#potDrawPile .potDrawSlot[data-pot-draw-slot="${i}"] .plantPotContainer:not(.newPlantPot)`).length) {                    
                    $(`#potDrawPile .potDrawSlot[data-pot-draw-slot="${i}"] .plantPotContainer:not(.newPlantPot)`).addClass(`newPlantPot drawPileOffset startingPosAnimate startingPos`).appendTo(`#potDrawPile .potDrawSlot[data-pot-draw-slot="${(i - 1)}"]`);
                }
            }
        }

        setTimeout(function(){            
            $('.startingPos').removeClass('startingPos');
        }, 300);

    }, 5300 + nextRoundProcessTimeout + multipleMarketReplacementsTimeout);

    // 6000 - trigger removing startingPos from pots

    setTimeout(function(){        
        $('.marketActionButton').removeAttr('disabled')
        $('.lockedInColumn').removeClass('lockedInColumn');
        $('.lockedInCardOverlay').removeClass('lockedInCardOverlay');
        $('.lockedInItemOverlay').removeClass('lockedInItemOverlay');

        $('.startingPosAnimate').removeClass('startingPosAnimate');

        $('.newCardContainer').removeClass('newCardContainer');
        $('.newItemToken').removeClass('newItemToken');
        $('.newPlantPot').removeClass('newPlantPot');

        $('.discardPileOffset').removeClass('discardPileOffset');
        $('.drawPileOffset').removeClass('drawPileOffset');

        $('.oneColumnOffset').removeClass('oneColumnOffset');
        $('.twoColumnOffset').removeClass('twoColumnOffset');
        $('.threeColumnOffset').removeClass('threeColumnOffset');
        $('.fourColumnOffset').removeClass('fourColumnOffset');

        togglePotScoringLayerVisibility('hide');
        $('#gameSectionsParent').attr('current-phase', 'market-selection');
        
    }, 7400 + nextRoundProcessTimeout + multipleMarketReplacementsTimeout);

    setTimeout(function(){        
        $('#infoBarStats #turnsRemainingContainer').addClass('infoChange');

        turnsRemaining--;        

        if(turnsRemaining == 1) {
            let finalScoringBtnHTML = `
                <span class="star-icon">
                    <ion-icon name="star" role="img" class="md hydrated" aria-label="star"></ion-icon>
                </span><span class="btnText">Final Scoring</span>
                <span class="star-icon">
                    <ion-icon name="star" role="img" class="md hydrated" aria-label="star"></ion-icon>
                </span>
            `;

            $('#undoNextRoundBtnContainer #nextRound').html(finalScoringBtnHTML);
            $('#undoNextRoundBtnContainer #nextRound').addClass('finalScoring');
        }

        endTurnGreenThumbMaxEnforced();

        $('#gameSectionsParent').attr('turns-left', turnsRemaining);
        $('#infoBarStats #turnsRemainingContainer #turnsRemainingUpdateInfo.infoBarUpdateData.subtractVal').fadeIn();


    }, 8400 + nextRoundProcessTimeout + multipleMarketReplacementsTimeout);

    setTimeout(function(){        
        $('#infoBarStats #turnsRemainingContainer #turnsRemainingInfo.infoBarStatData').html(turnsRemaining);
    }, 9500 + nextRoundProcessTimeout + multipleMarketReplacementsTimeout);

    setTimeout(function(){        

        $('#infoBarStats #turnsRemainingContainer').removeClass('infoChange');
        $('#infoBarStats #turnsRemainingContainer #turnsRemainingUpdateInfo.infoBarUpdateData.subtractVal').fadeOut();

    }, 9670 + nextRoundProcessTimeout + multipleMarketReplacementsTimeout);

    setTimeout(function(){        

        let actionRequiredHTML = `
            <div class="actionRequiredContainer">
                <div class="actionRequiredAnimation"></div>
            </div>
        `;
        $('#marketCardColumns .marketColumn .cardsAndItemContainer .cardContainer').append(actionRequiredHTML);
        updateDiscardPotTotal();
        lockMap = false;        
    }, 10370 + nextRoundProcessTimeout + multipleMarketReplacementsTimeout);

    setTimeout(function(){        
        $('#marketCardColumns .marketColumn .cardsAndItemContainer .cardContainer .actionRequiredContainer').remove();
    }, 11600 + nextRoundProcessTimeout + multipleMarketReplacementsTimeout);

});

// function roundState('roundCheck'){    
//     roundState('roundCheck');
//     showPossibleMapPlacements('item');
// }

// roundState('roundCheck');


$(document).on(touchEvent,'#playerInfoContainer #useItemsBtn:not([disabled])',function(){    

    toggleMapVerdancy('show');
    $('#verdancyVisibilityContainer').addClass('disableInteraction');

    $('#playerInfoContainer #addOneVerdancyToPlantBtn').addClass('disableInteraction');
    $('#playerInfoContainer #useItemsBtn').addClass('disableInteraction');

    $('#playerInfoContainer #swapItemsBtn').attr('disabled', 'disabled');
    $('#playerInfoContainer #discardItemsBtn').attr('disabled', 'disabled');
    
    let thisNurtureItem = $(this).attr('item-to-use');
    if(thisNurtureItem == 'watering-can') thisNurtureItem = 'wateringCan';
    
    $(`#${thisNurtureItem}-instructions`).addClass('showInstructions');
    $('#confirmNurtureItemAction.button').attr('nurture-item-action', thisNurtureItem);

    animateElem($('#mapContainer #nurtureItemOptions'), 'showNurtureItemOptions');

    // function fertilizerInitFunc()
    // function trowelInitFunc()
    // function wateringCanInitFunc()

    eval(`${thisNurtureItem}InitFunc()`);

});

$(document).on(touchEvent,'#cancelNurtureItemAction.button',function(){        

    $('#playerInfoContainer #swapItemsBtn').removeAttr('disabled');
    $('#playerInfoContainer #discardItemsBtn').removeAttr('disabled');

    toggleMapVerdancy('hide');
    $('#verdancyVisibilityContainer').removeClass('disableInteraction');

    $('#playerInfoContainer #addOneVerdancyToPlantBtn').removeClass('disableInteraction');
    $('#playerInfoContainer #useItemsBtn').removeClass('disableInteraction');

    $('.potentialNurtureItemTarget').removeClass('potentialNurtureItemTarget');
    $('.previewWateringCanNurtureItemAction').removeClass('previewWateringCanNurtureItemAction');

    $('.wateringCanPotentialTarget').removeClass('wateringCanPotentialTarget');
    $('.trowelPotentialTarget').removeClass('trowelPotentialTarget');
    $('.fertilizerPotentialTarget').removeClass('fertilizerPotentialTarget');

    $('.wateringCanNurtureItemRecipient').removeClass('wateringCanNurtureItemRecipient');

    $('.verdancyPulseAnimation').removeClass('verdancyPulseAnimation');
    animateElem($('#mapContainer #nurtureItemOptions'), 'hideNurtureItemOptions');

    if($('.previewNurtureItemIcon').length) $('.previewNurtureItemIcon').fadeOut();

    setTimeout(function(){
        if($('.previewNurtureItemIcon').length) $('.previewNurtureItemIcon').remove();
        $('.nurtureItemInstructions.showInstructions').removeClass('showInstructions');
        $('#confirmNurtureItemAction.button').attr('nurture-item-action', 'none');
        $('#confirmNurtureItemAction.button').attr('disabled', 'disabled');
    }, 400);
});


// FERTILIZER

function fertilizerInitFunc() {
    // Add 3 Verdancy to one plant    
    nurtureItemMapRecipients('plant', 'fertilizer');
}

$(document).on('mouseenter','#mapContainer .mapTileContainer.potentialNurtureItemTarget.fertilizerPotentialTarget',function(){    
    $(this).append(`
        <img class="previewNurtureItemIcon fertilizerItemIcon" src="img/itemsNurture/fertilizer-icon.png" />
    `);
});

$(document).on('mouseleave','#mapContainer .mapTileContainer.potentialNurtureItemTarget.fertilizerPotentialTarget',function(){    
    $('.potentialNurtureItemTarget .fertilizerItemIcon:not(.lockedInIcon)').remove();
});

$(document).on(touchEvent,'#mapContainer .mapTileContainer.potentialNurtureItemTarget.fertilizerPotentialTarget',function(){        

    $('.verdancyPulseAnimation').removeClass('verdancyPulseAnimation');

    $('.mapTileContainer.fertilizerPreviewAction .fertilizerItemIcon.lockedInIcon').remove();
    $('.fertilizerPreviewAction').addClass('fertilizerPotentialTarget').removeClass('fertilizerPreviewAction');

    $(this).addClass('fertilizerPreviewAction').removeClass('fertilizerPotentialTarget');
    $('.mapTileContainer.fertilizerPreviewAction .fertilizerItemIcon').addClass('lockedInIcon');

    previewNurtureItemVerdancy($(this), 3);
    $('#nurtureItemOptions #confirmNurtureItemAction').removeAttr('disabled');
});


$(document).on(touchEvent,'#nurtureItemOptions #confirmNurtureItemAction[nurture-item-action="fertilizer"]',function(){    

    finalizeNurtureItemVerdancy();
    animateElem($('#mapContainer #nurtureItemOptions'), 'hideNurtureItemOptions');

    $('#playerInfoContainer #useItemsBtn').attr('disabled', 'disabled');
    $('#chosenItemContainer.itemContainer .itemToken[item-type="nurture"]').fadeOut();
    $('.mapTileContainer .fertilizerItemIcon.lockedInIcon').fadeOut();

    setTimeout(function(){
        $('#nurtureItemOptions .showInstructions').removeClass('showInstructions');

        $('.fertilizerPreviewAction').removeClass('fertilizerPreviewAction');
        $('.fertilizerPotentialTarget').removeClass('fertilizerPotentialTarget');
        $('.potentialNurtureItemTarget').removeClass('potentialNurtureItemTarget');
        
        $('#chosenItemContainer.itemContainer .itemToken[item-type="nurture"]').remove();

        $('#mapContainer #nurtureItemOptions #confirmNurtureItemAction').attr('nurture-item-action', 'none');
        $('#mapContainer #nurtureItemOptions #confirmNurtureItemAction').attr('disabled', 'disabled');
    }, 1300);

    setTimeout(function(){
        toggleMapVerdancy('hide');
        $('#verdancyVisibilityContainer').removeClass('disableInteraction');
        $('.mapTileContainer .fertilizerItemIcon.lockedInIcon').remove();
        $('#playerInfoContainer #addOneVerdancyToPlantBtn').removeClass('disableInteraction');
        $('#playerInfoContainer #useItemsBtn').removeClass('disableInteraction');
    }, 1900);
    
});

let totalPotentialCardsForTrowelAction = 0;
let plantsCardsSelectedForTrowelAction = 0;

function trowelInitFunc() {

    totalPotentialCardsForTrowelAction = 0;
    plantsCardsSelectedForTrowelAction = 0;
    
    nurtureItemMapRecipients('plant', 'trowel');

    totalPotentialCardsForTrowelAction = $('#mapContainer .mapTileContainer.potentialNurtureItemTarget.trowelPotentialTarget').length;
    
}

$(document).on('mouseenter','#mapContainer .mapTileContainer.potentialNurtureItemTarget.trowelPotentialTarget',function(){    
    $(this).append(`
        <img class="previewNurtureItemIcon trowelItemIcon" src="img/itemsNurture/trowel-icon.png" />
    `);
});

$(document).on('mouseleave','#mapContainer .mapTileContainer.potentialNurtureItemTarget.trowelPotentialTarget',function(){    
    $('.potentialNurtureItemTarget .trowelItemIcon:not(.lockedInIcon)').remove();
});

$(document).on(touchEvent,'#mapContainer .mapTileContainer.potentialNurtureItemTarget.trowelPotentialTarget',function(){        

    $(this).addClass('trowelPreviewAction').removeClass('trowelPotentialTarget');
    $('.mapTileContainer.potentialNurtureItemTarget.trowelPreviewAction .trowelItemIcon').addClass('lockedInIcon');

    let plantCardsSelected = $('.mapTileContainer.potentialNurtureItemTarget.trowelPreviewAction').length;

    previewNurtureItemVerdancy($(this), 1);

    if(plantCardsSelected == totalPotentialCardsForTrowelAction || plantCardsSelected == 3) {
        $('#nurtureItemOptions #confirmNurtureItemAction').removeAttr('disabled');  
        $('#mapContainer .mapTileContainer.trowelPreviewAction').addClass('lockedInTrowelAction').removeClass('trowelPreviewAction');
    }

});

$(document).on(touchEvent,'#nurtureItemOptions #confirmNurtureItemAction[nurture-item-action="trowel"]',function(){    
    finalizeNurtureItemVerdancy();
    animateElem($('#mapContainer #nurtureItemOptions'), 'hideNurtureItemOptions');
    $('#playerInfoContainer #useItemsBtn').attr('disabled', 'disabled');
    
    $('#chosenItemContainer.itemContainer .itemToken[item-type="nurture"]').fadeOut();
    $('.mapTileContainer .trowelItemIcon.lockedInIcon').fadeOut();

    setTimeout(function(){
        $('#nurtureItemOptions .showInstructions').removeClass('showInstructions');
        $('.potentialNurtureItemTarget').removeClass('potentialNurtureItemTarget');
        $('.trowelPotentialTarget').removeClass('trowelPotentialTarget');
        $('.trowelNurtureItemRecipient').removeClass('trowelNurtureItemRecipient');
        $('#chosenItemContainer.itemContainer .itemToken[item-type="nurture"]').remove();
        $('.lockedInTrowelAction').removeClass('lockedInTrowelAction');

        $('#mapContainer #nurtureItemOptions #confirmNurtureItemAction').attr('nurture-item-action', 'none');
        $('#mapContainer #nurtureItemOptions #confirmNurtureItemAction').attr('disabled', 'disabled');
    }, 1300);

    setTimeout(function(){
        toggleMapVerdancy('hide');
        $('#verdancyVisibilityContainer').removeClass('disableInteraction');
        $('.mapTileContainer .trowelItemIcon.lockedInIcon').remove();
        $('#playerInfoContainer #addOneVerdancyToPlantBtn').removeClass('disableInteraction');
        $('#playerInfoContainer #useItemsBtn').removeClass('disableInteraction');
    }, 1900);
});

// WATERING CAN

function wateringCanInitFunc() {    
    nurtureItemMapRecipients('room', 'wateringCan');
    $('.mapTileContainer.potentialNurtureItemTarget').addClass('wateringCanPotentialTarget');
}

$(document).on('mouseenter','#mapContainer .mapTileContainer.potentialNurtureItemTarget.wateringCanPotentialTarget',function(){    
    $(this).append(`
        <img class="previewNurtureItemIcon wateringCanItemIcon" src="img/itemsNurture/watering-can-icon.png" />
    `);
});

$(document).on('mouseleave','#mapContainer .mapTileContainer.potentialNurtureItemTarget.wateringCanPotentialTarget',function(){    
    $('.potentialNurtureItemTarget .previewNurtureItemIcon:not(.lockedInIcon)').remove();
});

$(document).on(touchEvent,'#mapContainer .mapTileContainer.potentialNurtureItemTarget.wateringCanPotentialTarget',function(){        

    $('.verdancyPulseAnimation').removeClass('verdancyPulseAnimation');
    $('.mapTileContainer.potentialNurtureItemTarget .wateringCanItemIcon.lockedInIcon').remove();

    $('.wateringCanPreviewAction').addClass('wateringCanPotentialTarget').removeClass('wateringCanPreviewAction');

    $(this).addClass('wateringCanPreviewAction').removeClass('wateringCanPotentialTarget');
    $('.mapTileContainer.potentialNurtureItemTarget.wateringCanPreviewAction .wateringCanItemIcon').addClass('lockedInIcon');

    let thisRow = $(this).data('map-row');
    let thisColumn = $(this).data('map-column');
        

    let mapNeighbours = findMapNeighbours(thisRow, thisColumn, 'plant', true);
    if(JSON.stringify(mapNeighbours) !== '{}') {        
        for (const [key, value] of Object.entries(mapNeighbours)) {                        
            $(`${key}`).addClass('wateringCanNurtureItemRecipient');
            previewNurtureItemVerdancy($(`${key}`), 1);
        }
    }

    $('#nurtureItemOptions #confirmNurtureItemAction').removeAttr('disabled');

});

$(document).on(touchEvent,'#nurtureItemOptions #confirmNurtureItemAction[nurture-item-action="wateringCan"]',function(){    

    finalizeNurtureItemVerdancy();
    animateElem($('#mapContainer #nurtureItemOptions'), 'hideNurtureItemOptions');
    $('#playerInfoContainer #useItemsBtn').attr('disabled', 'disabled');
    $('#chosenItemContainer.itemContainer .itemToken[item-type="nurture"]').fadeOut();
    $('.mapTileContainer .previewNurtureItemIcon.lockedInIcon').fadeOut();
    $('.verdancyPulseAnimation').removeClass('verdancyPulseAnimation');

    setTimeout(function(){
        $('#nurtureItemOptions .showInstructions').removeClass('showInstructions');
        $('.potentialNurtureItemTarget').removeClass('potentialNurtureItemTarget');
        $('.wateringCanPotentialTarget').removeClass('wateringCanPotentialTarget');
        $('.wateringCanNurtureItemRecipient').removeClass('wateringCanNurtureItemRecipient');
        $('#chosenItemContainer.itemContainer .itemToken[item-type="nurture"]').remove();

        $('#mapContainer #nurtureItemOptions #confirmNurtureItemAction').attr('nurture-item-action', 'none');
        $('#mapContainer #nurtureItemOptions #confirmNurtureItemAction').attr('disabled', 'disabled');
    }, 1300);

    setTimeout(function(){
        toggleMapVerdancy('hide');
        $('#verdancyVisibilityContainer').removeClass('disableInteraction');
        $('.mapTileContainer .previewNurtureItemIcon.lockedInIcon').remove();
        $('#playerInfoContainer #addOneVerdancyToPlantBtn').removeClass('disableInteraction');
        $('#playerInfoContainer #useItemsBtn').removeClass('disableInteraction');
    }, 1900);

});


function nurtureItemMapRecipients(cardTypeToActivate, actionType) {    

    $('.mapTileContainer').each(function(){
        let placedCardType = $(this).attr('cardtype');        
        if (typeof placedCardType !== 'undefined' && placedCardType !== false) {
            if($(this).attr('cardtype') == 'plant') {
                if($(this).attr('plant-pot') != 'none') {
                    return true;
                }
            }
            if(placedCardType == cardTypeToActivate) {
                if(actionType == 'wateringCan') {                    
                    $(this).addClass(`potentialNurtureItemTarget ${actionType}PotentialTarget`);
                } else {
                    let totalVerdancy = $(this).find('.verdancyIconsAndVPLayer').attr('verdancy-icons');
                    let currentVerdancy = $(this).find('.verdancyIconsAndVPLayer').attr('verdancy-completed');
                                        

                    if(currentVerdancy < totalVerdancy) {
                        $(this).addClass(`potentialNurtureItemTarget ${actionType}PotentialTarget`);
                    }
                }
            }
        }
    });

    setTimeout(function(){        
        let actionRequiredHTML = `
            <div class="actionRequiredContainer">
                <div class="actionRequiredAnimation"></div>
            </div>
        `;

        $('.mapTileContainer.potentialNurtureItemTarget .cardContainer').append(actionRequiredHTML);
    }, 400);


    setTimeout(function(){        
        $('.mapTileContainer.potentialNurtureItemTarget .cardContainer .actionRequiredContainer').remove();
    }, 2550);
    
}

function previewNurtureItemVerdancy(thisCard, verdancyToAdd) {    
    let verdancyInfo = $(thisCard).find('.verdancyIconsAndVPLayer');
    let totalVerdancy = $(verdancyInfo).attr('verdancy-icons');
    let currentVerdancy = $(verdancyInfo).attr('verdancy-completed');
            

    let verdancyAddedNum = 0;
    while(currentVerdancy < totalVerdancy) {
        $(verdancyInfo).find(`.verdancyIconContainer[data-verdancy-icon-num="${currentVerdancy}"] .verdancyIconPosContainer .completeVerdancyIcon`).addClass('verdancyPulseAnimation');
        currentVerdancy++;
        verdancyAddedNum++;                
        if (verdancyAddedNum == verdancyToAdd) break;
    }
}


function finalizeNurtureItemVerdancy() {    

    $('.verdancyPulseAnimation').each(function(){
        $(this).closest('.verdancyIconContainer').addClass('tempVerdancyMarker');
        $(this).removeClass('verdancyPulseAnimation');
    });

    setTimeout(function(){
        $('.tempVerdancyMarker').addClass('completeVerdancy').removeClass('incompleteVerdancy tempVerdancyMarker');
    }, 400);

    setTimeout(function(){
        $('.mapTileContainer[cardtype="plant"][plant-pot="none"] .cardContainer .verdancyIconsAndVPLayer').each(function(){
            let newCompletedVerdancy = $(this).find('.verdancyIconContainer.completeVerdancy').length;            
            $(this).attr('verdancy-completed', newCompletedVerdancy);
        });
    }, 800);

    setTimeout(function(){
        completedPlantsThisTurn = checkForCompletedPlants();
        if(completedPlantsThisTurn.length != 0) {
            gainPlantPots();
        } else {
            roundState('roundCheck');
        }
    }, 1950);

}

$(document).on('mouseenter','#mapContainer .mapTileContainer.potentialItemPlacement.activePotentialItemPlacement:not(.temporaryItemPlacement)',function(){    

    if(!lockMap) {        
        $(this).addClass('itemPlacementPreview');
        var thisItemTokenContainer = $(this).find('.roomCardItemContainer');
        $('.itemToken.activePlacement').clone().removeClass('activePlacement').appendTo(thisItemTokenContainer);
    }
});

$(document).on('mouseleave','#mapContainer .mapTileContainer.potentialItemPlacement.activePotentialItemPlacement.itemPlacementPreview:not(.temporaryItemPlacement)',function(){    

    if(!lockMap) {        
        $('#mapContainer .mapTileContainer.itemPlacementPreview .itemToken').remove();
        $('#mapContainer .mapTileContainer.itemPlacementPreview').removeClass('itemPlacementPreview');
    }
});

$(document).on(touchEvent,'#mapContainer .mapTileContainer.potentialItemPlacement.activePotentialItemPlacement:not(.temporaryItemPlacement)',function(){        

    if(!lockMap) {        
        $('#playerInfoContainer #swapItemsBtn').attr('disabled', 'disabled');
        $('#playerInfoContainer #discardItemsBtn').attr('disabled', 'disabled');
        temporarilyLockMap(1000);        
        $('#undoNextRoundBtnContainer #undoAction').attr('disabled', 'disabled');
        if($('#mapContainer .mapTileContainer.potentialItemPlacement:not(.temporaryItemPlacement) .roomCardItemContainer .itemToken').length) {            
            $('#mapContainer .mapTileContainer.potentialItemPlacement:not(.temporaryItemPlacement) .roomCardItemContainer .itemToken').remove();
        }

        var targID = $(this).attr('id');
        

        $('.itemToken.activePlacement').parentToAnimate($(`#${targID} .roomCardItemContainer`), 1000);
        
        if($('#mapContainer .mapTileContainer.temporaryItemPlacement').length) {            
            $('#mapContainer .mapTileContainer.temporaryItemPlacement').addClass('activePotentialItemPlacement').removeClass('temporaryItemPlacement');
        }

        $('.itemPlacementPreview').removeClass('itemPlacementPreview');

        setTimeout(function(){            
            animateElem($('#mapContainer #placedItemOptions'), 'showItemOptions');
        }, 450);

        setTimeout(function(){            
            $(`#${targID}`).removeClass('activePotentialItemPlacement').addClass('temporaryItemPlacement');
        }, 950);
        
    }
});

$(document).on(touchEvent,'#cancelItemPlacement.button',function(){    

    animateElem($('#mapContainer #placedItemOptions'), 'hideItemOptions');
    $('.itemToken.activePlacement').parentToAnimate($('#tableauSection #homeContentContainer #playerInfoContainer #chosenItemParentContainer #chosenItemContainer'), 1000);
    resetPotentialMapPlacements('resetItemToPlace');

    setTimeout(function(){        
        $('#undoNextRoundBtnContainer #undoAction').removeAttr('disabled');
    }, 1000);

    setTimeout(function(){        
        roundState('roundCheck');
    }, 1050);
    
});


$(document).on(touchEvent,'#confirmItemPlacement.button',function(){    

    currentRoundActionLog.push('item-placement');

    // if($('#viewPotScoringBtn').hasClass('hidePotScoringLayer')) togglePotScoringLayerVisibility('hide');

    let placedMapID = $('.mapTileContainer.temporaryItemPlacement').attr('id');
    let placedItemName = $('.mapTileContainer.temporaryItemPlacement .cardContainer .roomCardItemContainer .itemToken').attr('item-name');

    $(`#${placedMapID} .cardContainer .roomCardItemContainer .itemToken`).addClass('placedItem').removeClass('activePlacement');
    $(`#${placedMapID}`).attr('placed-item', placedItemName);

    let splitItemName = placedItemName.split('-');
    $(`#${placedMapID}`).attr('item-room-type', splitItemName[0]);
    $(`#${placedMapID}`).attr('furniture-pet-name', splitItemName[1]);
            

    animateElem($('#mapContainer #placedItemOptions'), 'hideItemOptions');

    setTimeout(function(){        
        $('.mapTileContainer.potentialItemPlacement.temporaryItemPlacement').addClass('confirmedItemPlacement').removeClass('temporaryItemPlacement"');
    }, 50);

    setTimeout(function(){        
        resetPotentialMapPlacements('resetAll');
    }, 60);

    setTimeout(function(){        
        roundState('roundCheck');
    }, 900);
});

$(document).on(touchEvent,'#playerInfoContainer #discardItemsBtn:not([disabled])',function(){
    $('#discardItemModal .modal-content .notification .itemToDiscardPreview').html('');
    $('#chosenItemParentContainer #chosenItemContainer.itemContainer .itemToken img').clone().appendTo('#discardItemModal .modal-content .notification .itemToDiscardPreview');
    $('#discardItemModal').addClass('is-active');
});

$(document).on(touchEvent,'#discardItemModal #confirmItemDiscardBtn',function(){
    lockMap = true;     
    $('#startFirstTurnModal').removeClass('is-active');

    $('#playerInfoContainer #useItemsBtn').attr('disabled', 'disabled');
    $('#playerInfoContainer #discardItemsBtn').attr('disabled', 'disabled');
    $('#playerInfoContainer #swapItemsBtn').attr('disabled', 'disabled');
    $('#playerInfoContainer #addOneVerdancyToPlantBtn').addClass('disableInteraction');

    setTimeout(function(){
        $('#chosenItemParentContainer #chosenItemContainer .itemToken').removeClass('activePlacement');
        $('#chosenItemParentContainer #chosenItemContainer .itemToken').attr('style', '');
    }, 200);

    setTimeout(function(){
        $('#chosenItemParentContainer #chosenItemContainer .itemToken').addClass('remove-market-cards-and-item-alt');
    }, 600);

    setTimeout(function(){
        $('#chosenItemParentContainer #chosenItemContainer .itemToken').remove();
    }, 1900);

    setTimeout(function(){
        roundState('roundCheck');
        lockMap = false;  
    }, 2200);

});

$(document).on(touchEvent,'#playerInfoContainer #swapItemsBtn:not([disabled])',function(){
    roundState('swapItems');
});

let currentChosenItemType = '';
let currentStoredItemType = '';

function roundState(mode) {
    currentChosenItemType = '';    
    currentStoredItemType = '';    

    if($('#chosenItemParentContainer #chosenItemContainer .itemToken').length) {
        currentChosenItemType = $('#chosenItemContainer.itemContainer .itemToken').attr('item-type');        
    }

    if($('#storedItemParentContainer #storedItemContainer .itemToken').length) {        
        currentStoredItemType = $('#storedItemContainer.itemContainer .itemToken').attr('item-type');        
    }

    if(mode == 'swapItems') {
        $('.activePlacement').addClass('inactivePlacement').removeClass('activePlacement');
        lockMap = true;           
        $('#playerInfoContainer #addOneVerdancyToPlantBtn').addClass('disableInteraction');        
        $('#playerInfoContainer #swapItemsBtn').addClass('disableInteraction');        
        $('#playerInfoContainer #discardItemsBtn').addClass('disableInteraction');        
        $('#playerInfoContainer #useItemsBtn').addClass('disableInteraction');        

        if(currentChosenItemType != '') {
            $('#chosenItemParentContainer #chosenItemContainer .itemToken:not(.swapAnimation)').addClass('swapAnimation').parentToAnimate($('#storedItemParentContainer #storedItemContainer'), 1000);            
            
            if(currentChosenItemType == 'nurture' && currentStoredItemType != 'nurture') {
                $('#playerInfoContainer').removeClass('nurtureItemActive');                
                $('#playerInfoContainer #useItemsBtn').attr('disabled', 'disabled');                
            } else if(currentStoredItemType == '') {
                $('#playerInfoContainer').removeClass('nurtureItemActive');                
                $('#playerInfoContainer #discardItemsBtn').attr('disabled', 'disabled');                
                $('#playerInfoContainer #useItemsBtn').attr('disabled', 'disabled');                
                $('#undoNextRoundBtnContainer #nextRound').attr('disabled', 'disabled');                
                resetPotentialMapPlacements('resetAll');                
                setTimeout(function(){
                    activateNextRoundBtn();                    
                }, 1050);                
            }
        }

        if(currentStoredItemType != '') {        
            $('#storedItemParentContainer #storedItemContainer .itemToken:not(.swapAnimation)').addClass('swapAnimation').parentToAnimate($('#chosenItemParentContainer #chosenItemContainer'), 1000);            
            $('#undoNextRoundBtnContainer #nextRound').attr('disabled', 'disabled');            
            resetPotentialMapPlacements('resetAll');            
            if(currentStoredItemType == 'nurture') {
                resetPotentialMapPlacements('resetAll');                
                if(currentChosenItemType == 'nurture') {
                    $('#playerInfoContainer #useItemsBtn').addClass('disableInteraction');                    
                } else if(currentChosenItemType != 'nurture') {
                    $('#playerInfoContainer').addClass('nurtureItemActive');                    
                    $('#playerInfoContainer #useItemsBtn').removeAttr('disabled');                    
                }
            }
        };        

        swapBtnTextUpdate();  

        setTimeout(function(){
            $('.swapAnimation').removeClass('swapAnimation');
            if($('#chosenItemParentContainer #chosenItemContainer .itemToken').length) {
                if(!$('#chosenItemParentContainer #chosenItemContainer .itemToken').hasClass('activePlacement')) {
                    if($('.activePlacement').length) {
                        $('.activePlacement').addClass('inactivePlacement').removeClass('activePlacement');
                    }
                    $('#chosenItemParentContainer #chosenItemContainer .itemToken').hasClass('activePlacement')
                }
                chosenItemType = $('#chosenItemContainer.itemContainer .itemToken').attr('item-type');        
            }   
            lockMap = false;            
        }, 1005);        

    } else if(mode == 'roundCheck') {
        swapBtnTextUpdate();        
    }
}

let chosenItemType = '';
let storedItemType = '';

function swapBtnTextUpdate(){

    $('#playerInfoContainer #discardItemsBtn').attr('disabled', 'disabled');    
    $('#playerInfoContainer #swapItemsBtn').attr('disabled', 'disabled');    
    $('#playerInfoContainer #useItemsBtn').attr('disabled', 'disabled');    
    $('#playerInfoContainer').removeClass('nurtureItemActive');    
    
    chosenItemType = '';    
    storedItemType = '';    

    if($('#chosenItemParentContainer #chosenItemContainer .itemToken').length) {
        if(!$('#chosenItemParentContainer #chosenItemContainer .itemToken').hasClass('activePlacement')) {
            if($('.activePlacement').length) {
                $('.activePlacement').addClass('inactivePlacement').removeClass('activePlacement');
            }
            $('#chosenItemParentContainer #chosenItemContainer .itemToken').addClass('activePlacement')
        }
        chosenItemType = $('#chosenItemContainer.itemContainer .itemToken').attr('item-type');        
    }

    if($('#storedItemParentContainer #storedItemContainer .itemToken').length) {        
        storedItemType = $('#storedItemContainer.itemContainer .itemToken').attr('item-type');        
    }

    if(chosenItemType != '') {

        $('#playerInfoContainer #discardItemsBtn').removeAttr('disabled');        
        $('#playerInfoContainer #swapItemsBtn').removeAttr('disabled');        

        if(chosenItemType == 'nurture') {
            let itemName = $('#chosenItemContainer.itemContainer .itemToken').attr('item-name');
            $('#playerInfoContainer #useItemsBtn').attr('item-to-use', itemName);

            let nurtureActionRequiredTimeout = 0;
            if(!$('#playerInfoContainer').hasClass('nurtureItemActive')) {
                $('#playerInfoContainer').addClass('nurtureItemActive')
                nurtureActionRequiredTimeout = 500;
            }
            $('#playerInfoContainer #useItemsBtn').removeAttr('disabled');
            setTimeout(function(){
                let actionRequiredHTML = `
                    <div class="actionRequiredContainer">
                        <div class="actionRequiredAnimation"></div>
                    </div>
                `;
                $('#playerInfoContainer #useItemsBtn').append(actionRequiredHTML);
            }, nurtureActionRequiredTimeout + 50)
            setTimeout(function(){        
                $('#playerInfoContainer #useItemsBtn .actionRequiredContainer').remove();
            }, nurtureActionRequiredTimeout + 1450);
        } else {
            showPossibleMapPlacements('item');
        }

        if(storedItemType == 'normal' || storedItemType == 'nurture') {
            $('#playerInfoContainer #swapItemsBtn').html('Swap Items');            
        } else if(storedItemType == '') {
            $('#playerInfoContainer #swapItemsBtn').html('Store Item');            
        }
    } else {
        resetPotentialMapPlacements('resetAll');
        
        setTimeout(function(){
            activateNextRoundBtn();
        }, 800);

        if(storedItemType != '') {
            $('#playerInfoContainer #swapItemsBtn').removeAttr('disabled', 'disabled');            
            if(storedItemType == 'normal' || storedItemType == 'nurture') {
                $('#playerInfoContainer #swapItemsBtn').html('Retrieve Item');                
            }
        }
    }

    $('#playerInfoContainer #swapItemsBtn').removeClass('disableInteraction');    
    $('#playerInfoContainer #discardItemsBtn').removeClass('disableInteraction');    
    $('#playerInfoContainer #useItemsBtn').removeClass('disableInteraction');    
    $('#playerInfoContainer #addOneVerdancyToPlantBtn').removeClass('disableInteraction');      
}

function startFirstRound() {    
    startingPlacement = false;

    resetPotentialMapPlacements('nextRound');
    setTimeout(function(){        
        swapActiveMainSection();
    }, 600);
    setTimeout(function(){        
        $('#startFirstTurnModal').addClass('is-active');
        $('#gameSectionsParent').attr('current-phase', 'market-selection');

        $('#replaceMarketItemsBtn').removeAttr('disabled');
        $('#chooseAnyMarketCardItemBtn').removeAttr('disabled');
    }, 1400);
};

$(document).on(touchEvent,'#startFirstTurnBtn',function(){        

    let actionRequiredHTML = `
        <div class="actionRequiredContainer">
            <div class="actionRequiredAnimation"></div>
        </div>
    `;

    $('#marketCardColumns .marketColumn .cardsAndItemContainer .cardContainer').append(actionRequiredHTML);

    setTimeout(function(){
        lockMap = false;
    }, 500);

    setTimeout(function(){        
        $('#marketCardColumns .marketColumn .cardsAndItemContainer .cardContainer .actionRequiredContainer').remove();
    }, 2150);

});

function resetPotentialMapPlacements(mode) {    

    toggleMapVerdancy('hide');
    $('.verdancyIconsAndVPLayer.showIndividualVerdancyLayer').removeClass('showIndividualVerdancyLayer');

   if(mode == 'resetCardToPlace'){        
        $('.mapTileContainer.temporaryCardPlacement').addClass('activePotentialCardPlacement').removeClass('temporaryCardPlacement');

    } else if(mode == 'resetItemToPlace'){        
        $('.mapTileContainer.temporaryItemPlacement').addClass('activePotentialItemPlacement').removeClass('temporaryItemPlacement');

    } else if(mode == 'resetAll'){        
        if($('.mapTileContainer.potentialCardPlacement').length) {            
            $('.mapTileContainer.potentialCardPlacement').addClass('animatingElem mediumTransitionAll');
            setTimeout(function(){                
                $('.mapTileContainer.activePotentialCardPlacement').removeClass('activePotentialCardPlacement');
            }, 50);
            setTimeout(function(){                
                $('.mapTileContainer.animatingElem.mediumTransitionAll').removeClass('animatingElem mediumTransitionAll');
            }, 800);
            setTimeout(function(){                
                $('.mapTileContainer.potentialCardPlacement').removeClass('potentialCardPlacement');
            }, 850);

        }

        if($('.mapTileContainer.potentialItemPlacement').length) {            
            $('.mapTileContainer.potentialItemPlacement.activePotentialItemPlacement .roomCardItemContainer').addClass('animatingElem mediumTransitionAll');
            setTimeout(function(){                
                $('.mapTileContainer.potentialItemPlacement.activePotentialItemPlacement').removeClass('activePotentialItemPlacement');
            }, 50);
            setTimeout(function(){                
                $('.mapTileContainer.potentialItemPlacement .roomCardItemContainer.animatingElem.mediumTransitionAll').removeClass('animatingElem mediumTransitionAll');
            }, 800);

            setTimeout(function(){                
                $('.mapTileContainer.potentialItemPlacement').removeClass('potentialItemPlacement');
            }, 850);

        }

    } else if(mode == 'nextRound') {        
        finalizeMapPlacement('card');
    }
}

function finalizeMapPlacement(mode) {    

    if(mode =='card') {        
        let placedCardType = $('.mapTileContainer .cardContainer.activePlacement').attr('cardtype');
        let mapElID = $('.mapTileContainer .cardContainer.activePlacement').closest('.mapTileContainer').attr('id');
        $(`#${mapElID}`).attr('cardtype', placedCardType);

        let thisRow = $(`#${mapElID}`).data('map-row'); //data-map-row
        let thisColumn = $(`#${mapElID}`).data('map-column'); //data-map-column

        updatePlayersTableauLimits(thisRow, thisColumn);
                

        $('.mapTileContainer .cardContainer.activePlacement').removeClass('activePlacement');
        $('.mapTileContainer.temporaryCardPlacement').removeClass('temporaryCardPlacement');

        $('.mapTileContainer.activePotentialCardPlacement').addClass('animatingElem mediumTransitionAll');

        setTimeout(function(){            
            $('.mapTileContainer.activePotentialCardPlacement').removeClass('activePotentialCardPlacement');
        }, 50);
        
        setTimeout(function(){            
            $('.mapTileContainer.animatingElem.mediumTransitionAll').removeClass('animatingElem mediumTransitionAll');
        }, 800);

        setTimeout(function(){            
            $('.mapTileContainer.potentialCardPlacement').removeClass('potentialCardPlacement');
        }, 850);
    }
}

function updatePlayersTableauLimits(cardRow, cardColumn) {    

    let columnRowChanges = false;
    
    //          ${placedCardsRange.rows.locked ? `X` : ``}
    //          ${placedCardsRange.rows.low}
    //          ^
    //     ${placedCardsRange.columns.locked ? `X` : ``} ${placedCardsRange.columns.low} <   > ${placedCardsRange.columns.high} ${placedCardsRange.columns.locked ? `X` : ``}
    //          v
    //          ${placedCardsRange.rows.high}
    //          ${placedCardsRange.rows.locked ? `X` : ``}
    // `);
        
    if(cardRow < placedCardsRange.rows.low) {                
        placedCardsRange.rows.low = cardRow;
        columnRowChanges = 'row';
    }
            
    if(cardRow > placedCardsRange.rows.high) {                
        placedCardsRange.rows.high = cardRow;
        columnRowChanges = 'row';
    }
        
    if(cardColumn < placedCardsRange.columns.low) {                
        placedCardsRange.columns.low = cardColumn;
        columnRowChanges = 'column';
    }
        
    if(cardColumn > placedCardsRange.columns.high) {                
        placedCardsRange.columns.high = cardColumn;
        columnRowChanges = 'column';
    }
    

    if(columnRowChanges == 'row' || columnRowChanges == 'column') {
        checkPlayersTableauLimits(columnRowChanges);
    } 

}

function checkPlayersTableauLimits(limitToChange) {    

    if(limitToChange == 'row') {                
            
        placedCardsRange.rows.currentRange = (placedCardsRange.rows.high - placedCardsRange.rows.low) + 1;        
            
        if(placedCardsRange.rows.currentRange >= placedCardsRange.rows.limit) placedCardsRange.rows.locked = true;
    } else if(limitToChange == 'column') {                
            
        placedCardsRange.columns.currentRange = (placedCardsRange.columns.high - placedCardsRange.columns.low) + 1;        
            
        if(placedCardsRange.columns.currentRange >= placedCardsRange.columns.limit) placedCardsRange.columns.locked = true;
    }



}

$(document).on(touchEvent,'#mapContainer #verdancyVisibilityContainer:not(.disableVerdancyVisibility)',function(){        
    toggleMapVerdancy('none');
});

function toggleMapVerdancy(mode) {        

    if(mode != 'none') {        
        if(mode == 'show') {            
            mapVerdancyVisible = true
        } else if(mode == 'hide') {            
            mapVerdancyVisible = false
        }        
    } else {        
        !mapVerdancyVisible ? mapVerdancyVisible = true : mapVerdancyVisible = false;
    }
    

    if(mapVerdancyVisible) {        
        $('#verdancyVisibilityContainer').addClass('hideVerdancy').removeClass('showVerdancy');
        $('#mapHiddenOverlay').addClass('showVerdancyLayer');
    } else if(!mapVerdancyVisible) {        
        $('#verdancyVisibilityContainer').addClass('showVerdancy').removeClass('hideVerdancy');
        $('#mapHiddenOverlay').removeClass('showVerdancyLayer');
    }
}

function temporarilyLockMap(timePeriod) {    

	lockMap = true;    
    $('#mapContainer').addClass('mapLocked');
	setTimeout(function(){        
        $('#mapContainer').removeClass('mapLocked');
		lockMap = false;        
	}, timePeriod);
}

function processMapMovement(thisDirection){    

    $('#mapContainer .mapTileContainer.potentialCardPlacement.cardPlacementPreview:not(.temporaryCardPlacement) .cardContainer').remove();
    $('.cardPlacementPreview').removeClass('cardPlacementPreview');

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

function updateMapPosition(moveDirection) {    

	if(moveDirection == 'horizontal') {        
		let newLeftPosNum = (mapMoveAmount.cardPos.left * mapMoveAmount.view[currentView].zoomIncs[zoomLevel].horizontal);
		let newLeftPos = newLeftPosNum + mapMoveAmount.view[currentView].unit;
		$('#mapContainer #mapHiddenOverlay').css('left', newLeftPos);
        // animateMap(startTop, startLeft, endTop, endLeft);
	} else if(moveDirection == 'vertical') {        
		let newTopPosNum = (mapMoveAmount.cardPos.top * mapMoveAmount.view[currentView].zoomIncs[zoomLevel].vertical);
		let newTopPos = newTopPosNum + mapMoveAmount.view[currentView].unit;
		$('#mapContainer #mapHiddenOverlay').css('top', newTopPos);
        // animateMap(startTop, startLeft, endTop, endLeft);
	}
}

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
		let zoomOption = $(this).data('zoom-mode');
		configureNewZoom(zoomOption)
	}
});

function configureNewZoom(zoomMode) {

    $('#mapContainer .mapTileContainer.potentialCardPlacement.cardPlacementPreview:not(.temporaryCardPlacement) .cardContainer').remove();
    $('.cardPlacementPreview').removeClass('cardPlacementPreview');
    

    let zoomInLimit = 13;
	let zoomOutLimit = 4;

    zoomMode == 'zoomIn' ? zoomLevel++ : zoomLevel--;
                

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
    $('#mapHiddenOverlay').attr('animation-scale-amount', (zoomLevel / 10))
}

function setZoom(newZoom, el) {    


	let transformOriginPercentages = '';

	if(currentView == 'desktopView') {        
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

function showPossibleMapPlacements(type){    

    let showPlacementsTimeout = 10;

    if(type == 'card' && !$('.potentialCardPlacement').length) {        
        if($('.potentialItemPlacement').length) {            
            resetPotentialMapPlacements('resetAll');
            showPlacementsTimeout = 810;
        }

        setTimeout(function(){            
            let cardTypeToPlace = $('.cardContainer.activePlacement').attr('cardtype');            
            checkPotentialCardPlacements(cardTypeToPlace, 'showPossibleMapPlacements');
            showPotentialCardPlacements();
        }, showPlacementsTimeout);

        
    } else if(type == 'item' && !$('.potentialItemPlacement').length) {        
        if($('.potentialCardPlacement').length) {            
            resetPotentialMapPlacements('resetAll');
            showPlacementsTimeout = 810;
        }

        setTimeout(function(){            
            $('.mapTileContainer[cardtype="room"][placed-item="none"]').addClass('potentialItemPlacement');
        }, 0 + showPlacementsTimeout);

        setTimeout(function(){            
            $('.mapTileContainer.potentialItemPlacement .roomCardItemContainer').addClass('animatingElem mediumTransitionAll');
        }, 10 + showPlacementsTimeout);

        setTimeout(function(){            
            $('.mapTileContainer.potentialItemPlacement').addClass('activePotentialItemPlacement');
        }, 20 + showPlacementsTimeout);

        setTimeout(function(){            
            let actionRequiredHTML = `
                <div class="actionRequiredContainer">
                    <div class="actionRequiredAnimation"></div>
                </div>
            `;

            $('.mapTileContainer.potentialItemPlacement.activePotentialItemPlacement .roomCardItemContainer').append(actionRequiredHTML);
        }, 100 + showPlacementsTimeout);

        setTimeout(function(){            
            $('.mapTileContainer.potentialItemPlacement.activePotentialItemPlacement .roomCardItemContainer.animatingElem.mediumTransitionAll').removeClass('animatingElem mediumTransitionAll');
            lockMap = false;            
        }, 800 + showPlacementsTimeout);

        setTimeout(function(){            
            $('.mapTileContainer.potentialItemPlacement.activePotentialItemPlacement .roomCardItemContainer .actionRequiredContainer').remove();
        }, 2250 + showPlacementsTimeout);
    }
}

let validNeighbourIDs = [];
let mapNeighbours = [];

function checkPotentialCardPlacements(currentCardType, mode) {

    // mode = marketCardSelection
    // mode = showPossibleMapPlacements
    

    validNeighbourIDs = [];
    $('.mapTileContainer').each(function(){
        let placedCardType = $(this).attr('cardtype');
        if (typeof placedCardType !== 'undefined' && placedCardType !== false) {
            if(placedCardType == oppositeType[currentCardType]) {                                
                mapNeighbours = [];
                mapNeighbours = findMapNeighbours($(this).data('map-row'), $(this).data('map-column'), 'empty', false);
                if(mapNeighbours.length != 0) {
                    validNeighbourIDs.push(...mapNeighbours);
                }
            }
        }
    });

    if(validNeighbourIDs.length == 0) {
        return false;
    } else {        

        let uniquePlacementIDs = validNeighbourIDs.filter(onlyUnique);        
        for (let i = 0; i < uniquePlacementIDs.length; i++) {
            $(`${uniquePlacementIDs[i]}`).addClass('pendingPotentialCardPlacement');
        }

        return true;
    }

}

function showPotentialCardPlacements(){

    $('.mapTileContainer.pendingPotentialCardPlacement').addClass('animatingElem mediumTransitionAll').removeClass('pendingPotentialCardPlacement');
    
    setTimeout(function(){        
        $('.mapTileContainer.animatingElem.mediumTransitionAll').addClass('potentialCardPlacement');
    }, 10);

    setTimeout(function(){        
        $('.mapTileContainer.animatingElem.mediumTransitionAll.potentialCardPlacement').addClass('activePotentialCardPlacement');
    }, 20);

    setTimeout(function(){        
        let actionRequiredHTML = `
            <div class="actionRequiredContainer">
                <div class="actionRequiredAnimation"></div>
            </div>
        `;

        $('.mapTileContainer.animatingElem.mediumTransitionAll.potentialCardPlacement.activePotentialCardPlacement').append(actionRequiredHTML);
    }, 100);

    setTimeout(function(){        
        $('.mapTileContainer.animatingElem.mediumTransitionAll.potentialCardPlacement.activePotentialCardPlacement').removeClass('animatingElem mediumTransitionAll');
    }, 800);

    setTimeout(function(){        
        $('.mapTileContainer.potentialCardPlacement.activePotentialCardPlacement .actionRequiredContainer').remove();
    }, 2250);
}

function findMapNeighbours(thisRow, thisColumn, criteria, returnPositions){    
    
    // placedCardsRange.rows.currentRange = placedCardsRange.rows.high - placedCardsRange.rows.low;
    // placedCardsRange.columns.currentRange = placedCardsRange.columns.high - placedCardsRange.columns.low;

    // if(placedCardsRange.rows.currentRange >= placedCardsRange.rows.limit) placedCardsRange.rows.locked = true;
    // if(placedCardsRange.columns.currentRange >= placedCardsRange.columns.limit) placedCardsRange.columns.locked = true;
    

    let allMapNeighbours = [];
            
            

    // let lightingContainerPositions = ['top', 'right', 'bottom', 'left'];

    if(criteria == 'empty') {        
        
        if(placedCardsRange.rows.locked) {            
            if((thisRow - 1) >= placedCardsRange.rows.low) {                
                allMapNeighbours.push(`#row-${thisRow - 1}-column-${thisColumn}`);
            }
        } else {            
            allMapNeighbours.push(`#row-${thisRow - 1}-column-${thisColumn}`);
        }
    
        if(placedCardsRange.columns.locked) {            
            if ((thisColumn + 1) <= placedCardsRange.columns.high) {                
                allMapNeighbours.push(`#row-${thisRow}-column-${thisColumn + 1}`);
            }
        } else {            
            allMapNeighbours.push(`#row-${thisRow}-column-${thisColumn + 1}`);
        }
    
        if(placedCardsRange.rows.locked) {            
            if ((thisRow + 1) <= placedCardsRange.rows.high) {                
                allMapNeighbours.push(`#row-${thisRow + 1}-column-${thisColumn}`);
            }
        } else {            
            allMapNeighbours.push(`#row-${thisRow + 1}-column-${thisColumn}`);
        }
    
        if(placedCardsRange.columns.locked) {            
            if((thisColumn - 1) >= placedCardsRange.columns.low) {                
                allMapNeighbours.push(`#row-${thisRow}-column-${thisColumn - 1}`);
            }
        } else {            
            allMapNeighbours.push(`#row-${thisRow}-column-${thisColumn - 1}`);
        }
    } else {        
        allMapNeighbours.push(`#row-${thisRow - 1}-column-${thisColumn}`);
        allMapNeighbours.push(`#row-${thisRow}-column-${thisColumn + 1}`);
        allMapNeighbours.push(`#row-${thisRow + 1}-column-${thisColumn}`);
        allMapNeighbours.push(`#row-${thisRow}-column-${thisColumn - 1}`);
    }
    

    if(!returnPositions) {        
        let validMapNeighbours = [];

        for (let i = 0; i < allMapNeighbours.length; i++) {
    
            if($(`${allMapNeighbours[i]}`).length) {                
                let thisAttr = $(`${allMapNeighbours[i]}`).attr('cardtype');
                
    
                if (criteria == 'empty') {                    
                    if (typeof thisAttr === 'undefined' || thisAttr === false) {                        
                        validMapNeighbours.push(allMapNeighbours[i]);
                    };
                } else if(thisAttr == criteria){                    
                    if(criteria == 'plant') {                                                
                        if($(`${allMapNeighbours[i]}`).attr('plant-pot') != 'none') {                            
                            return true;
                        } else {
                            validMapNeighbours.push(allMapNeighbours[i]);
                        }
                    }
                } 
            }
        }        
        return validMapNeighbours;
    } else if(returnPositions){        
        let validMapNeighbours = {};
        for (let i = 0; i < allMapNeighbours.length; i++) {
            if($(`${allMapNeighbours[i]}`).length) {                
                let thisAttr = $(`${allMapNeighbours[i]}`).attr('cardtype');
                if (criteria == 'empty') {                    
                    if (typeof thisAttr === 'undefined' || thisAttr === false) {                        
                        validMapNeighbours[`${allMapNeighbours[i]}`] = lightingContainerPositions[i];
                    };
                } else if(thisAttr == criteria){                    
                    validMapNeighbours[`${allMapNeighbours[i]}`] = lightingContainerPositions[i];
                } 
            }
        }        
        return validMapNeighbours;
    }
}

let leafFadeAwayInterval;
let currentLeafWave = 0;

function leafCountdownFunction(){
    if($('#finalScoringModal .modal-content .notification #scoringCountdownTimer ion-icon[name="leaf-outline"]').length) {
        $('#finalScoringModal .modal-content .notification #scoringCountdownTimer ion-icon[name="leaf-outline"]').eq(0).attr('name', 'leaf');
    } else {
        clearInterval(leafCountdownInterval);

        $('#finalScoringModal .modal-content .notification #scoringCountdownTimer').fadeOut()

        setTimeout(function(){
            $('#finalScoringModal .modal-content .notification #enterNameAndFinalScoringBtn').fadeIn();
        }, 400);
        // setTimeout(function(){
        //     leafFadeAwayInterval = setInterval(leafFadeAwayFunction, 120);
        // }, 1000);
    }
}

// function leafFadeAwayFunction(){
//     $(`#scoringCountdownTimer ion-icon[name="leaf"][fade-out-wave="${currentLeafWave}"]`).remove();
//     // $(`#scoringCountdownTimer ion-icon[name="leaf"][fade-out-wave="${currentLeafWave}"]`).addClass('remove-end-game-leaf-animations');
//     currentLeafWave++;

//     if(currentLeafWave == 21) {
//         clearInterval(leafFadeAwayInterval);
//         finalScoringProcess()
//         setTimeout(function(){
//             $('#finalScoringModal .modal-content .notification #scoringCountdownTimer').remove();
//             $('#finalScoringModal .modal-content .notification #enterNameAndFinalScoringBtn').fadeIn();
//         }, 1500);
//     }

//     if($('#finalScoringModal .modal-content .notification #scoringCountdownTimer ion-icon[name="leaf-outline"]').length) {
//         $('#finalScoringModal .modal-content .notification #scoringCountdownTimer ion-icon[name="leaf-outline"]').eq(0).attr('name', 'leaf');
//     } else {
//         clearInterval(leafCountdownInterval);
//         finalScoringProcess();
        
//     }
// }

$(document).on(touchEvent, '#finalScoringModal .modal-content .notification #showFinalScore', function(){
    lockMap = true;
    $('#finalScoringModal').removeClass('is-active');
    $('.layer').fadeOut();

    let playersName = $('#finalScoringModal .modal-content .notification #enterNameAndFinalScoringBtn #playerNameInput').val();
    if(playersName != '') {
        $('#finalScore #fs-name').html(playersName);
    } else {
        $('#finalScore #fs-name').html('Player');
    }
    
    setTimeout(function(){
        finalScoringProcess();
        $('#scoringLayer.layer').fadeIn();
    }, 600);
});



function finalScoringProcess() {
   
    $('.mapTileContainer[cardtype]').clone().appendTo('#mapAndFinalScoreContainer #finalMap');

    $('#finalMap .mapTileContainer[cardtype="plant"][plant-pot="none"]').each(function(){
        let topCardLayer = $(this).find('.cardContainer');
        $(topCardLayer).append('<div class="finalScoringVerdancyEarned"></div>');
        let finalScoringVerdancyEarnedContainer = $(topCardLayer).find('.finalScoringVerdancyEarned');
        let verdancyEarnedNum = $(this).find('.completeVerdancy').length;
        $(finalScoringVerdancyEarnedContainer).attr('final-scoring-verdancy-amount', verdancyEarnedNum);
        $(this).find('.completeVerdancy').appendTo(finalScoringVerdancyEarnedContainer);
    });

    setupCarousel();
    finalScoringCalculation();
}

function finalScoringCalculation() {
    console.clear();

    let completedPlantsFinalVPs = 0;
    let leftOverVerdancyFinalVPs = 0;
    let potPointsFinalVPs = 0;
    let roomPointsFinalVPs = 0;
    let uniquePetsFurnitureFinalVPs = 0;
    let plantCollectorBonusFinalVPs = 0;
    let decoratorBonusFinalVPs = 0;

    $('#finalMap .mapTileContainer[cardtype="plant"]:not([plant-pot="none"]) .cardContainer').each(function(){
        let thisCompletedPlantVPs = parseInt($(this).attr('plant-vps'));
        completedPlantsFinalVPs = completedPlantsFinalVPs + thisCompletedPlantVPs;        
    });
    
    
    $('#fs-completedPlants').html(completedPlantsFinalVPs);

    // leftOverVerdancy total / 2 = VPs (rounded down) Math.floor



    let totalLeftOverVerdancy = 0;

    $('#finalMap .mapTileContainer[cardtype="plant"][plant-pot="none"] .cardContainer .finalScoringVerdancyEarned').each(function(){
        let thisCardLeftOverVerdancy = parseInt($(this).attr('final-scoring-verdancy-amount'));        
        totalLeftOverVerdancy = totalLeftOverVerdancy + thisCardLeftOverVerdancy;        
    });
    
    leftOverVerdancyFinalVPs = Math.floor(totalLeftOverVerdancy / 2);    
    $('#fs-leftOverVerdancy').html(leftOverVerdancyFinalVPs);


    let potPointsRange = ['terracotta', 'porcelain', 'wood', 'concrete']; // index = plant pot points

    $('#finalMap .mapTileContainer[cardtype="plant"]:not([plant-pot="none"])').each(function(){
        let thisPlantPotType = $(this).attr('plant-pot');                        
        potPointsFinalVPs = potPointsFinalVPs + potPointsRange.indexOf(thisPlantPotType);        
    });

    $('#fs-potPoints').html(potPointsFinalVPs);


    // roomPoints
    
    $('#finalMap .mapTileContainer[cardtype="room"]').each(function(){
        

        let thisRow = $(this).data('map-row');
        let thisColumn = $(this).data('map-column');
                

        let thisRoomType = $(this).find('.cardContainer').attr('room-type');
        let thisPlacedItemType = $(this).attr('item-room-type');
        let thisRoomMatchingPoints = 1;
                

        if (typeof thisPlacedItemType !== typeof undefined && thisPlacedItemType !== false) {
            if(thisRoomType == thisPlacedItemType) {                
                thisRoomMatchingPoints = 2;
            }
        }
        

        let roomAndPlantTypeMatches = 0;
    
        if($(`#row-${thisRow - 1}-column-${thisColumn}`).length) {            
            let firstNeighbourPlantType = $(`#row-${thisRow - 1}-column-${thisColumn} .cardContainer`).attr('plant-type');            
            if(firstNeighbourPlantType == thisRoomType) {                
                roomAndPlantTypeMatches++;
            }
        }
        
        if($(`#row-${thisRow}-column-${thisColumn + 1}`).length) {            
            let secondNeighbourPlantType = $(`#row-${thisRow}-column-${thisColumn + 1} .cardContainer`).attr('plant-type');            
            if(secondNeighbourPlantType == thisRoomType) {                
                roomAndPlantTypeMatches++;
            }
        }
        
        if($(`#row-${thisRow + 1}-column-${thisColumn}`).length) {            
            let thirdNeighbourPlantType = $(`#row-${thisRow + 1}-column-${thisColumn} .cardContainer`).attr('plant-type');            
            if(thirdNeighbourPlantType == thisRoomType) {                
                roomAndPlantTypeMatches++;
            }
        }
        
        if($(`#row-${thisRow}-column-${thisColumn - 1}`).length) {            
            let fourthNeighbourPlantType = $(`#row-${thisRow}-column-${thisColumn - 1} .cardContainer`).attr('plant-type');            
            if(fourthNeighbourPlantType == thisRoomType) {                
                roomAndPlantTypeMatches++;
            }
        }
        

        if(roomAndPlantTypeMatches != 0) {                        
            let totalMatchedRoomAndPlantsPoints = roomAndPlantTypeMatches * thisRoomMatchingPoints            
            roomPointsFinalVPs = roomPointsFinalVPs + totalMatchedRoomAndPlantsPoints;            
        }

    });
    

    $('#fs-roomPoints').html(roomPointsFinalVPs);


    // uniquePetsFurniture

    let uniqueFurnitureAndPetsScoringRange = [0, 1, 3, 6, 9, 12, 16, 20, 25];

    let allFurnitureAndPets = [];
    $('#finalMap .mapTileContainer[placed-item]:not([placed-item="none"])').each(function(){        
        allFurnitureAndPets.push($(this).attr('furniture-pet-name'));
    });

    let uniqueFurnitureAndPets = allFurnitureAndPets.filter(onlyUnique);            
    uniquePetsFurnitureFinalVPs = uniqueFurnitureAndPetsScoringRange[uniqueFurnitureAndPets.length];    

    $('#fs-uniquePetsFurniture').html(uniquePetsFurnitureFinalVPs);

    // plantCollectorBonus
    let allPlantTypes = [];

    $('#finalMap .mapTileContainer[cardtype="plant"] .cardContainer').each(function(){        
        allPlantTypes.push($(this).attr('plant-type'));
    });

    let uniquePlantTypes = allPlantTypes.filter(onlyUnique);
    uniquePlantTypes.length == 5 ? plantCollectorBonusFinalVPs = 3 : plantCollectorBonusFinalVPs = 0;
    $('#fs-plantCollectorBonus').html(plantCollectorBonusFinalVPs);


    // decoratorBonus
    let allRoomTypes = [];

    $('#finalMap .mapTileContainer[cardtype="room"] .cardContainer').each(function(){        
        allRoomTypes.push($(this).attr('room-type'));
    });

    let uniqueRoomTypes = allRoomTypes.filter(onlyUnique);
    uniqueRoomTypes.length == 5 ? decoratorBonusFinalVPs = 3 : decoratorBonusFinalVPs = 0;
    $('#fs-decoratorBonus').html(decoratorBonusFinalVPs);

    let finalScoreVPs = completedPlantsFinalVPs + leftOverVerdancyFinalVPs + potPointsFinalVPs + roomPointsFinalVPs + uniquePetsFurnitureFinalVPs + plantCollectorBonusFinalVPs + decoratorBonusFinalVPs;

    $('#fs-totalScore').html(finalScoreVPs);

    let scoringRanges = $('#scoringTable .scoreRangeLabel').length;

    for (let i = 0; i < scoringRanges; i++) {
        let thisLowRange = parseInt($(`#scoringTable .scoreRangeLabel[score-range-num="${i}"]`).data('low-range'));
        let thisHighRange = parseInt($(`#scoringTable .scoreRangeLabel[score-range-num="${i}"]`).data('high-range'));
        if(finalScoreVPs >= thisLowRange && finalScoreVPs <= thisHighRange) {
            $(`#scoringTable .scoreRangeLabel[score-range-num="${i}"]`).addClass('currentScoreRanking');
            break;
        }
    }
}

$(document).on(touchEvent, '#shareYourResults', function(){
    const finalScoreContainer = document.querySelector('#mapAndFinalScoreContainer');
	html2canvas(finalScoreContainer).then(function(canvas) {
        canvas.setAttribute("id", "verdant-final-score");
        document.body.appendChild(canvas);
        var link = document.createElement('a');
        link.download = 'verdant-score.png';
        link.href = document.getElementById('verdant-final-score').toDataURL();
        link.crossOrigin="anonymous";
        link.click();
    });
});

function initSlideshow(container, animation){
    /*
    * @param {String} container Class or ID of the animation container
    * @param {String} animation Name of the animation, e.g. smoothscroll
    */
    var sliderWidth = 0;	
    var slidesNumber = 22;
    var sliderHeight = 188;
    var slideWidth = 152;
    var totalAnimationWidth = 2093;
    let containerWidth = 258;
    // detect number of visible slides
    var slidesVisible = containerWidth / slideWidth;	
    var maxSlidesVisible = Math.ceil(slidesVisible);

    // count slides to determine animation speed
    var speed = slidesNumber*4;
    // append the tail	
    $(container+'>div>div').slice(0,maxSlidesVisible).clone().appendTo($(container+'>div'));	

    // set slider dimensions
    $(container+'>div').css({'width':'440px','height':sliderHeight});

    //   Insert styles to html
    $("<style type='text/css'>@keyframes "+animation+" { 0% { margin-left: 0px; } 100% { margin-left: -"+totalAnimationWidth+"px; } } "+container+">div>div:first-child { -webkit-animation: "+animation+" "+speed+"s linear infinite; -moz-animation: "+animation+" "+speed+"s linear infinite; -ms-animation: "+animation+" "+speed+"s linear infinite; -o-animation: "+animation+" "+speed+"s linear infinite; animation: "+animation+" "+speed+"s linear infinite; }</style>").appendTo("head");	
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

    $('#shareInstructions #shareInstructionsContent .slideshow-block > .slideshow-animation').html(carouselHTML);
    setTimeout(function(){
        initSlideshow('#shareInstructions #shareInstructionsContent .slideshow-block', 'smoothscroll');
    }, 100);
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function uncapitalizeFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1).toLowerCase();
}

// /* Get the documentElement (<html>) to display the page in fullscreen */
var elemOne = document.documentElement;
var elemTwo = document.body;

/* View in fullscreen */
function openFullscreen() {
    if(elemOne.requestFullScreen) {
        elemOne.requestFullScreen();
    } else if(elemOne.mozRequestFullScreen) {
        elemOne.mozRequestFullScreen();
    } else if(elemOne.webkitRequestFullScreen) {
        elemOne.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if(elemOne.msRequestFullscreen) {
        elemOne.msRequestFullscreen();
    } else if(elemTwo.requestFullScreen) {
        elemTwo.requestFullScreen();
    } else if(elemTwo.mozRequestFullScreen) {
        elemTwo.mozRequestFullScreen();
    } else if(elemTwo.webkitRequestFullScreen) {
        elemTwo.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if(elemTwo.msRequestFullscreen) {
        elemTwo.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen() {
    if(document.exitFullscreen) {
        document.exitFullscreen();
    } else if(document.mozExitFullscreen) {
        document.mozExitFullscreen();
    } else if(document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if(document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    } else if(document.cancelFullScreen) {
        document.cancelFullScreen();
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if(document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    } else if(document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}
