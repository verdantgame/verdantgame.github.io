// If device is touch capable, use touch as the trigger, otherwise the user is using a desktop computer so use click
var touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
touchEvent == 'touchstart' ? $('#container').addClass('touchDevice') : $('#container').addClass('nonTouchDevice');

// for (const [key, value] of Object.entries(myObject)) {
// }

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

let startingPlacement = true;

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
    checkScreenWidth();
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

$(document).on(touchEvent, '#frontPageGameInstructionsButton', function(){
	openInNewTab(rulesURL);
});


$(document).on(touchEvent, '#viewPotScoringBtn', function(){
    if($('#viewPotScoringBtn').hasClass('showPotScoringLayer')) {
        togglePotScoringLayerVisibility('show');
    } else if($('#viewPotScoringBtn').hasClass('hidePotScoringLayer')) {
        togglePotScoringLayerVisibility('hide');
    }
});

function togglePotScoringLayerVisibility(mode) {
    $('#viewPotScoringBtn').addClass('disableInteraction');
    $('#replaceMarketItemsBtn').addClass('disableInteraction');
    $('#chooseAnyCardItemBtn').addClass('disableInteraction');
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
        $('#chooseAnyCardItemBtn').removeClass('disableInteraction');
    }, 700);
}

$(document).on(touchEvent, '#startGame', function(){
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
        $('#tableauSection .gameSectionContent #homeContentContainer #playerInfoContainer #cardToPlace .cardContainer').addClass('activeCard');
        $('#placeFirstCardModal').addClass('is-active');
        generatePossibleMapPlacements();
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
    $('#mapContainer #mapHiddenOverlay #row-2-column-4').attr('placed-item', 'none');
}

$(document).on(touchEvent, '#placeFirstPlantCardBtn', function(){
    $('#viewPotScoringBtn').removeAttr('disabled');
    $('.mapTileContainer.potentialPlacement').append('<div class="actionRequiredContainer"><div class="actionRequiredAnimation"></div>');
});

$(document).on(touchEvent, '#showScoringRemindersBtn', function(){
    $('#scoringReminderModal').addClass('is-active');
});

$(window).resize(function() {
    checkScreenWidth();
});

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
        for (let j = 0; j < 4; j++) {
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

	let initialMarketHTML = '';

	// again, since there are 4 combinations of tiles+tokens container, the below loop is actioned 4 times
	for (let k = 0; k < 4; k++) {
		// the below code generates the HTML to store information for each tile and token combination and then inserts it into the DOM

        var splitPlantPot = initialPlantPots[k].split('-');

        // splitPlantPot[0] = concrete / wood / ceramic

		initialMarketHTML += `
            <div class="marketColumn" column="${k}">
                <div data-pot-type="${splitPlantPot[0]}" class="plantPotContainer expanded hideScoring startingPos startingPosAnimate">
                    <img class="plantPot" src="img/pots/${initialPlantPots[k]}.png" alt="" />
                    <img class="plantPotScoring" src="img/pots/${splitPlantPot[0]}.png" alt="" />
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
            <div data-pot-discard-slot="${i}" class="potDiscardSlot"></div>
        `;
    }

    potScoringHTML += `
        </div>
    `;

    $('#marketSection .gameSectionContent #potScoringInfoContainer').append(potScoringHTML);

}


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
                    <div data-animation-group="${thisSection}" class="cardContainer expanded initBoxShadow" cardtype="${cardType}"${cardType == 'plant' ? ` data-lighting-num="${thisCard.lighting.length}"` : ``}`;
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
            </div>
        </div>
    </div>
    `;

	// return the HTML so that whenever the function is called, will now be a placeholder for the above HTML
	return thisCardHTML;
}

function generateItem(thisItem, mode) {

    // itemDetails[0] = itemsNurture
    // itemDetails[1] = trowel

    let itemDetails = thisItem.split('_');
    let thisItemHTML = `
        <div data-animation-group="market" item-type="${itemDetails[0] == 'itemsNurture' ? `nurture` : `normal`}" class="itemToken expanded${mode == 'init' ? ` startingPos startingPosAnimate` : ``}" >
            <img src="img/${itemDetails[0]}/${itemDetails[1]}.png" />
        ${itemDetails[0] == 'itemsNurture' ? `
            <div class="nurtureItemExplanation has-tooltip-success has-tooltip-bottom has-tooltip-multiline" data-tooltip="${nurtureItemsExplanation[itemDetails[1]]}">
                <ion-icon name="help-circle-outline"></ion-icon>
            </div>` : ``} 
        </div>
    `;
	// return the HTML so that whenever the function is called, will now be a placeholder for the above HTML
	return thisItemHTML;
}

$(document).on('mouseenter','#marketSection.gameSection #marketCardColumns .marketColumn',function(){
	$(this).addClass('activeColumn');
});

$(document).on('mouseleave','#marketSection.gameSection #marketCardColumns .marketColumn',function(){
	$('.activeColumn').removeClass('activeColumn');
});

$(document).on('mouseenter','#gameSectionsParent[current-phase="market-selection"] #marketSection.gameSection .gameSectionContent > #marketCardColumns .marketColumn .cardsAndItemContainer .cardContainer',function(){
    $(this).addClass('potentialMarketCardChoice');
    setTimeout(function(){
        $('.marketColumn.activeColumn .cardsAndItemContainer .itemToken').addClass('potentialMarketItemChoice')
    }, 10);
});

$(document).on('mouseleave','#gameSectionsParent[current-phase="market-selection"] #marketSection.gameSection .gameSectionContent > #marketCardColumns .marketColumn .cardsAndItemContainer .cardContainer',function(){
    $('.potentialMarketCardChoice').removeClass('potentialMarketCardChoice');
    $('.potentialMarketItemChoice').removeClass('potentialMarketItemChoice');
});

$(document).on(touchEvent,'#gameSectionsParent[current-phase="market-selection"] #marketSection.gameSection .gameSectionContent > #marketCardColumns .marketColumn .cardsAndItemContainer .cardContainer.potentialMarketCardChoice',function(){

    $('#marketCardColumns .marketColumn .actionRequiredContainer').remove();

    $('.potentialMarketCardChoice').addClass('lockedInPotentialMarketCardChoice').removeClass('potentialMarketCardChoice');
    $('.potentialMarketItemChoice').addClass('lockedInPotentialMarketItemChoice').removeClass('potentialMarketItemChoice');

    var chosenColumn = $('.marketColumn.activeColumn').attr('column')
    var chosenCardType = $(this).attr('cardtype');

    $('#gameSectionsParent[current-phase="market-selection"] #marketSection.gameSection .gameSectionContent > #marketCardColumns').clone().appendTo('#confirmChosenColumnContainer #columnToConfirm');

    $('#confirmChosenColumnContainer #columnToConfirm #marketCardColumns').attr('id', 'marketCardColumnsToConfirm');

    $('#confirmChosenColumnContainer.marketActionContainer').attr('view-column', chosenColumn);
    $('#confirmChosenColumnContainer.marketActionContainer').attr('view-category', chosenCardType);

    $('#confirmChosenColumnContainer.marketActionContainer').fadeIn();
    $('#marketInactiveOverlay').fadeIn();

});

$(document).on(touchEvent,'#confirmChosenColumnContainer.marketActionContainer .zoomedColumnNavArrow',function(){    

    $('.lockedInPotentialMarketCardChoice').removeClass('lockedInPotentialMarketCardChoice');
    $('.lockedInPotentialMarketItemChoice').removeClass('lockedInPotentialMarketItemChoice');
    $('.activeColumn').removeClass('activeColumn');

    var direction = $(this).attr('arrow-direction');
    var currentColumn = $('#confirmChosenColumnContainer').attr('view-column');
    if(direction == 'left') {
        currentColumn--;
        $('#confirmChosenColumnContainer').attr('view-column', currentColumn);
    } else if(direction == 'right') {
        currentColumn++;
        $('#confirmChosenColumnContainer').attr('view-column', currentColumn);
    } else if(direction == 'up') {
        $('#confirmChosenColumnContainer').attr('view-category', 'plant');
    } else if(direction == 'down') {
        $('#confirmChosenColumnContainer').attr('view-category', 'room');
    }

    var currentCardTypeChosen = $('#confirmChosenColumnContainer').attr('view-category');

    $(`.gameSectionContent > #marketCardColumns .marketColumn[column="${currentColumn}"]`).addClass('activeColumn');

    $(`.gameSectionContent > #marketCardColumns .marketColumn[column="${currentColumn}"] .cardsAndItemContainer .itemToken`).addClass('lockedInPotentialMarketItemChoice');
    $(`.gameSectionContent > #marketCardColumns .marketColumn[column="${currentColumn}"] .cardsAndItemContainer .cardContainer[cardtype="${currentCardTypeChosen}"]`).addClass('lockedInPotentialMarketCardChoice');    
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
    $('.lockedInPotentialMarketCardChoice').removeClass('lockedInPotentialMarketCardChoice');
    $('.lockedInPotentialMarketItemChoice').removeClass('lockedInPotentialMarketItemChoice');
    $('.activeColumn').removeClass('activeColumn');

    setTimeout(function(){
        $('#confirmChosenColumnContainer #columnToConfirm').html('');
    }, 400);
}

$(document).on(touchEvent,'#confirmChosenColumnContainer.marketActionContainer .btnContainer #confirmColumnChoice',function(){

    $('#gameSectionsParent').attr('current-phase', 'card-item-placement');

    $('.greenThumbActionBtn.marketActionButton').attr('disabled', 'disabled');

    $('.lockedInPotentialMarketCardChoice').addClass('chosenMarketCardChoice').removeClass('lockedInPotentialMarketCardChoice');
    $('.lockedInPotentialMarketItemChoice').addClass('chosenMarketItemChoice').removeClass('lockedInPotentialMarketItemChoice');

    $('#confirmChosenColumnContainer.marketActionContainer').fadeOut();
    $('#marketInactiveOverlay').fadeOut();

    setTimeout(function(){
        swapActiveMainSection();
        $('#confirmChosenColumnContainer #columnToConfirm').html('');
        $('.gameSectionContent > #marketCardColumns .marketColumn .cardsAndItemContainer .cardContainer.chosenMarketCardChoice').parentToAnimate($('#tableauSection #homeContentContainer #playerInfoContainer #cardToPlace'), 1000);
        $('.gameSectionContent > #marketCardColumns .marketColumn .cardsAndItemContainer .itemToken.chosenMarketItemChoice').parentToAnimate($('#tableauSection #homeContentContainer #playerInfoContainer #chosenItemParentContainer #chosenItemContainer'), 1000);
    }, 700);

    setTimeout(function(){
        $('#cardToPlace .cardContainer').attr('style', '');
        $('#cardToPlace .cardContainer').addClass('activeCard').removeClass('chosenMarketCardChoice');
        generatePossibleMapPlacements();
    }, 1750);
});

let lightingContainerPositions = ['top', 'right', 'bottom', 'left'];
let lightingSymbolNumbers = ['one', 'two', 'three'];

let initMarketInterval;
let initMarketFlipCardsInterval;

let currentColumn = 3;
let currentMarketItem = 0;


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
                '13': {
                    'vertical': '70',
                    'horizontal': '80'
                },
                '12': {
                    'vertical': '70',
                    'horizontal': '80'
                },
                '11': {
                    'vertical': '65',
                    'horizontal': '75'
                },
                '10': {
                    'vertical': '65',
                    'horizontal': '75'
                },
                '9': {
                    'vertical': '60',
                    'horizontal': '70'
                },
                '8': {
                    'vertical': '60',
                    'horizontal': '70'
                },
                '7': {
                    'vertical': '55',
                    'horizontal': '65'
                },
                '6': {
                    'vertical': '55',
                    'horizontal': '65'
                },
                '5': {
                    'vertical': '45',
                    'horizontal': '55'
                },
                '4': {
                    'vertical': '45',
                    'horizontal': '55'
                },
            },
			'unit': 'px'
		},
        'tabletView': {
            'zoomIncs': {
                '13': {
                    'vertical': '70',
                    'horizontal': '80'
                },
                '12': {
                    'vertical': '70',
                    'horizontal': '80'
                },
                '11': {
                    'vertical': '65',
                    'horizontal': '75'
                },
                '10': {
                    'vertical': '65',
                    'horizontal': '75'
                },
                '9': {
                    'vertical': '60',
                    'horizontal': '70'
                },
                '8': {
                    'vertical': '60',
                    'horizontal': '70'
                },
                '7': {
                    'vertical': '55',
                    'horizontal': '65'
                },
                '6': {
                    'vertical': '55',
                    'horizontal': '65'
                },
                '5': {
                    'vertical': '45',
                    'horizontal': '55'
                },
                '4': {
                    'vertical': '45',
                    'horizontal': '55'
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
			xCardsVisible: 6, // horizontal
			yCardsVisible: 6  // vertical
		},
        '12': {
			xCardsVisible: 6, // horizontal
			yCardsVisible: 6  // vertical
		},
        '11': {
			xCardsVisible: 6, // horizontal
			yCardsVisible: 6  // vertical
		},
        '10': {
			xCardsVisible: 6, // horizontal
			yCardsVisible: 6  // vertical
		},
        '9': {
			xCardsVisible: 8, // horizontal
			yCardsVisible: 6  // vertical
		},
        '8': {
			xCardsVisible: 8, // horizontal
			yCardsVisible: 6  // vertical
		},
		'7': {
			xCardsVisible: 8, // horizontal
			yCardsVisible: 8  // vertical
		},
        '6': {
			xCardsVisible: 8, // horizontal
			yCardsVisible: 8  // vertical
		},
		'5': {
			xCardsVisible: 10, // horizontal
			yCardsVisible: 8  // vertical
		},
        '4': {
			xCardsVisible: 10, // horizontal
			yCardsVisible: 8  // vertical
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

$(document).on('mouseenter','#mapContainer .mapTileContainer.potentialPlacement.activePotentialPlacement:not(.temporaryPlacement)',function(){
    if(!lockMap) {
        $(this).addClass('cardPlacementPreview');
        var thisMapTile = $(this);
        $('.cardContainer.activeCard').clone().appendTo(thisMapTile);
    }
});

$(document).on('mouseleave','#mapContainer .mapTileContainer.potentialPlacement.activePotentialPlacement.cardPlacementPreview:not(.temporaryPlacement)',function(){    
    if(!lockMap) {
        $(this).removeClass('cardPlacementPreview');
        $('#mapContainer .mapTileContainer.potentialPlacement:not(.temporaryPlacement) .cardContainer').remove();
    }
});

$(document).on(touchEvent,'#mapContainer .mapTileContainer.potentialPlacement.activePotentialPlacement:not(.temporaryPlacement)',function(){    
    if(!lockMap) {
        $('.mapTileContainer .actionRequiredContainer').remove();
        lockMap = true;
        toggleMapVerdancy('hide');
        if($('#mapContainer .mapTileContainer.potentialPlacement:not(.temporaryPlacement) .cardContainer').length) {
            $('#mapContainer .mapTileContainer.potentialPlacement:not(.temporaryPlacement) .cardContainer').remove();
        }
        $('.cardPlacementPreview').removeClass('cardPlacementPreview');
        var targID = $(this).attr('id');
        $('#mapContainer .mapTileContainer.potentialPlacement.temporaryPlacement').addClass('activePotentialPlacement').removeClass('temporaryPlacement');
        temporarilyLockMap(1000);

        setTimeout(function(){
            animateElem($('#mapContainer #placedCardOptions'), 'showCardOptions');
        }, 450)

        setTimeout(function(){
            $(`#${targID}`).removeClass('activePotentialPlacement').addClass('temporaryPlacement');
            if(startingPlacement) {
                if($('#verdancyVisibilityContainer.disableVerdancyVisibility').length) {
                    $('#verdancyVisibilityContainer.disableVerdancyVisibility').removeClass('disableVerdancyVisibility');
                }
            }
        }, 950)
        $('.cardContainer.activeCard').parentToAnimate($(`#${targID}`), 1000);
    }
});

$(document).on(touchEvent,'#cancelCardPlacement.button',function(){
    animateElem($('#mapContainer #placedCardOptions'), 'hideCardOptions');
    cancelCardPlacementFunc();
    if(startingPlacement) {
        $('#verdancyVisibilityContainer').addClass('disableVerdancyVisibility');
    }
});

function cancelCardPlacementFunc(){
    $('.cardContainer.activeCard').parentToAnimate($('#playerInfoContainer #cardToPlace'), 1000);
    resetMapPlacements('resetCardToPlace');
}

$(document).on(touchEvent,'#confirmCardPlacement.button',function(){

    if($('#viewPotScoringBtn').hasClass('hidePotScoringLayer')) {
        togglePotScoringLayerVisibility('hide');
    }

    let placedMapID = $('.mapTileContainer.temporaryPlacement').attr('id');
    let placedCardType = $('.mapTileContainer.temporaryPlacement .cardContainer').attr('cardtype');

    checkLightingMatches(`#${placedMapID}`);
    $('.mapTileContainer.potentialPlacement.activePotentialPlacement').removeClass('activePotentialPlacement');

    if(placedCardType == 'room') {
        $(`#${placedMapID}`).attr('cardtype', 'room');
        $(`#${placedMapID}`).attr('placed-item', 'none');
    }

    animateElem($('#mapContainer #placedCardOptions'), 'hideCardOptions');
    setTimeout(function(){
        $('.mapTileContainer.potentialPlacement').removeClass('potentialPlacement');
        $('.mapTileContainer.temporaryPlacement').removeClass('temporaryPlacement');
    }, 300);
    
});

let lightingMatches = [];
let showLightingMatchesInterval;
let lightingMatchCount = 0;

function checkLightingMatches(mapID) {
    lightingMatches = [];
    lightingMatchCount = 0;
    var $card = $(`${mapID} .cardContainer.activeCard`);
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
        };

    } else if(cardType == 'room') {

        for (const [key, value] of Object.entries(allNeighbours)) {

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
            setTimeout(function(){
                chosenItemToPlaceOrStore();
            }, 500);
        }
    }
}

function chosenItemToPlaceOrStore(){

    $('#tableauSection #homeContentContainer #playerInfoContainer #chosenItemParentContainer #chosenItemContainer .itemToken').attr('style', '');
    $('#tableauSection #homeContentContainer #playerInfoContainer #chosenItemParentContainer #chosenItemContainer .itemToken').addClass('activeItem');
    $('#swapItemsBtnContainer .swapItemsBtn').removeAttr('disabled');

    let itemType = $('#tableauSection #homeContentContainer #playerInfoContainer #chosenItemParentContainer #chosenItemContainer .itemToken').attr('item-type');

    if(itemType == 'normal') {

        setTimeout(function(){
            $('.mapTileContainer[cardtype="room"][placed-item="none"]').addClass('potentialItemPlacement');
        }, 500);

        setTimeout(function(){
            $('.mapTileContainer.potentialItemPlacement').addClass('activePotentialItemPlacement');
        }, 510);

        setTimeout(function(){
            let actionRequiredHTML = '<div class="actionRequiredContainer"><div class="actionRequiredAnimation"></div></div>';
            $('.mapTileContainer.potentialItemPlacement .cardContainer[cardtype="room"] .roomCardItemContainer').append(actionRequiredHTML);
        }, 1000);

        setTimeout(function(){
            $('.mapTileContainer.potentialItemPlacement .cardContainer[cardtype="room"] .roomCardItemContainer .actionRequiredContainer').remove();
        }, 2000);
    } else if(itemType == 'nurture') {
        $('#swapItemsBtnContainer .useItemsBtn').removeAttr('disabled');
    }
}

$(document).on('mouseenter','#mapContainer .mapTileContainer.potentialItemPlacement.activePotentialItemPlacement:not(.temporaryItemPlacement)',function(){
    if(!lockMap) {
        $(this).addClass('itemPlacementPreview');
        var thisItemTokenContainer = $(this).find('.roomCardItemContainer');
        $('.itemToken.activeItem').clone().appendTo(thisItemTokenContainer);
    }
});

$(document).on('mouseleave','#mapContainer .mapTileContainer.potentialItemPlacement.activePotentialItemPlacement.itemPlacementPreview:not(.temporaryItemPlacement)',function(){    
    if(!lockMap) {
        $(this).removeClass('itemPlacementPreview');
        $('#mapContainer .mapTileContainer.potentialItemPlacement:not(.temporaryItemPlacement) .roomCardItemContainer .itemToken.activeItem').remove();
    }
});

$(document).on(touchEvent,'#mapContainer .mapTileContainer.potentialItemPlacement.activePotentialItemPlacement.itemPlacementPreview',function(){    
    if(!lockMap) {
        lockMap = true;

        $('#swapItemsBtnContainer .swapItemsBtn').attr('disabled', 'disabled');
        
        $('#mapContainer .mapTileContainer.potentialItemPlacement.temporaryItemPlacement').addClass('activePotentialItemPlacement').removeClass('temporaryItemPlacement');

        if($('#mapContainer .mapTileContainer.potentialItemPlacement:not(.temporaryItemPlacement) .roomCardItemContainer .itemToken.activeItem').length) {
            $('#mapContainer .mapTileContainer.potentialItemPlacement:not(.temporaryItemPlacement) .roomCardItemContainer .itemToken.activeItem').remove();
        }

        $('.itemPlacementPreview').removeClass('itemPlacementPreview');
        var targID = $(this).attr('id');
        $('#mapContainer .mapTileContainer.potentialItemPlacement.temporaryItemPlacement').addClass('activePotentialItemPlacement').removeClass('temporaryItemPlacement');
        temporarilyLockMap(1000);

        setTimeout(function(){
            animateElem($('#mapContainer #placedItemOptions'), 'showItemOptions');
        }, 450)

        setTimeout(function(){
            $(`#${targID}`).removeClass('activePotentialItemPlacement').addClass('temporaryItemPlacement');
        }, 950)

        $('.itemToken.activeItem').parentToAnimate($(`#${targID} .roomCardItemContainer`), 1000);
    }
});



$(document).on(touchEvent,'#cancelItemPlacement.button',function(){
    animateElem($('#mapContainer #placedItemOptions'), 'hideItemOptions');
    cancelItemPlacementFunc();
    $('#swapItemsBtnContainer .swapItemsBtn').removeAttr('disabled');
});

function cancelItemPlacementFunc(){
    $('.itemToken.activeItem').parentToAnimate($('#tableauSection #homeContentContainer #playerInfoContainer #chosenItemParentContainer #chosenItemContainer'), 1000);
    resetMapPlacements('resetItemToPlace');
}


$(document).on(touchEvent,'#confirmItemPlacement.button',function(){

    if($('#viewPotScoringBtn').hasClass('hidePotScoringLayer')) {
        togglePotScoringLayerVisibility('hide');
    }

    let placedMapID = $('.mapTileContainer.temporaryPlacement').attr('id');
    let placedItemType = $('.mapTileContainer.temporaryPlacement .ItemContainer').attr('Itemtype');

    checkLightingMatches(`#${placedMapID}`);
    $('.mapTileContainer.potentialPlacement.activePotentialPlacement').removeClass('activePotentialPlacement');

    if(placedItemType == 'room') {
        $(`#${placedMapID}`).attr('Itemtype', 'room');
        $(`#${placedMapID}`).attr('placed-item', 'none');
    }

    animateElem($('#mapContainer #placedItemOptions'), 'hideItemOptions');
    setTimeout(function(){
        $('.mapTileContainer.potentialPlacement').removeClass('potentialPlacement');
    }, 300);
    
});


$(document).on(touchEvent,'#swapItemsBtnContainer .swapItemsBtn',function(){

    $('#swapItemsBtnContainer .swapItemsBtn').addClass('disableInteraction');
    $('#swapItemsBtnContainer .useItemsBtn').addClass('disableInteraction');

    $('.activeItem').removeClass('activeItem');

    if($('#chosenItemParentContainer #chosenItemContainer .itemToken:not(.swapAnimation)').length) {
        $('#chosenItemParentContainer #chosenItemContainer .itemToken').addClass('swapAnimation');
        $('#chosenItemParentContainer #chosenItemContainer .itemToken').parentToAnimate($('#storedItemParentContainer #storedItemContainer'), 1000);
    }

    if($('#storedItemParentContainer #storedItemContainer .itemToken:not(.swapAnimation)').length) {
        $('#storedItemParentContainer #storedItemContainer .itemToken').addClass('swapAnimation');
        $('#storedItemParentContainer #storedItemContainer .itemToken').parentToAnimate($('#chosenItemParentContainer #chosenItemContainer'), 1000);
    }

    setTimeout(function(){
        $('.swapAnimation').removeClass('swapAnimation');
        $('#swapItemsBtnContainer .swapItemsBtn.disableInteraction').removeClass('disableInteraction');
        $('#swapItemsBtnContainer .useItemsBtn.disableInteraction').removeClass('disableInteraction');

        if($('#chosenItemParentContainer #chosenItemContainer .itemToken').length) {
            $('#chosenItemParentContainer #chosenItemContainer .itemToken').addClass('activeItem');
        }

    }, 1100);

});


function startFirstRound() {
    startingPlacement = false;
    resetMapPlacements('nextRound');
    setTimeout(function(){
        swapActiveMainSection();
    }, 600);
    setTimeout(function(){
        $('#startFirstTurnModal').addClass('is-active');
        $('#gameSectionsParent').attr('current-phase', 'market-selection');

        $('#replaceMarketItemsBtn').removeAttr('disabled');
        $('#chooseAnyCardItemBtn').removeAttr('disabled');
    }, 1400);
};

$(document).on(touchEvent,'#startFirstTurnBtn',function(){    
    let actionRequiredHTML = '<div class="actionRequiredContainer"><div class="actionRequiredAnimation"></div></div>';
    $('#marketCardColumns .marketColumn .cardsAndItemContainer .cardContainer').append(actionRequiredHTML);
});

function resetMapPlacements(mode) {
    // mode = resetItemToPlace
    toggleMapVerdancy('hide');
    $('.verdancyIconsAndVPLayer.showIndividualVerdancyLayer').removeClass('showIndividualVerdancyLayer');

    if(mode == 'nextRound') {
        let placedCardType = $('.mapTileContainer .cardContainer.activeCard').attr('cardtype');
        let mapElID = $('.mapTileContainer .cardContainer.activeCard').closest('.mapTileContainer').attr('id');
        $(`#${mapElID}`).attr('cardtype', placedCardType);
        $('.mapTileContainer .cardContainer.activeCard').removeClass('activeCard');
        $('.mapTileContainer.temporaryPlacement').removeClass('temporaryPlacement');
    } else if(mode == 'resetCardToPlace'){
        $('.mapTileContainer.temporaryPlacement').addClass('activePotentialPlacement').removeClass('temporaryPlacement');
    } else if(mode == 'resetItemToPlace'){
        $('.mapTileContainer.temporaryItemPlacement').addClass('activePotentialItemPlacement').removeClass('temporaryItemPlacement');
    }
}

function showLightingMatchesFunc() {

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
                toggleMapVerdancy('hide');
                $('.showIndividualVerdancyLayer').removeClass('showIndividualVerdancyLayer');
                chosenItemToPlaceOrStore();
            }
        }
    }, 2420);
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

    $('#mapContainer .mapTileContainer.potentialPlacement.cardPlacementPreview:not(.temporaryPlacement) .cardContainer').remove();
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

    // let endTopPos = mapMoveAmount.cardPos.top * mapMoveAmount.view[currentView].zoomIncs[zoomLevel].vertical;
    // let endLeftPos = mapMoveAmount.cardPos.left * mapMoveAmount.view[currentView].zoomIncs[zoomLevel].horizontal;

    // animateMap(startTopPos, startLeftPos, endTopPos, endLeftPos);

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

function generatePossibleMapPlacements(){
    let cardTypeToPlace = $('#tableauSection .gameSectionContent #homeContentContainer #playerInfoContainer #cardToPlace .cardContainer').attr('cardtype');
    showPotentialPlacements(cardTypeToPlace);
}

let validNeighbourIDs = [];
let mapNeighbours = [];

function showPotentialPlacements(currentCardType) {
    validNeighbourIDs = [];
    $('.mapTileContainer').each(function(){
        let placedCardType = $(this).attr('cardtype');
        if (typeof placedCardType !== 'undefined' && placedCardType !== false) {
            if(placedCardType == oppositeType[currentCardType]) {
                mapNeighbours = [];
                mapNeighbours = findMapNeighbours($(this).data('map-row'), $(this).data('map-column'), 'empty', false);
                if(mapNeighbours.length != 0) validNeighbourIDs.push(...mapNeighbours);
            }
        }
    });

    let uniquePlacementIDs = validNeighbourIDs.filter(onlyUnique);

    for (let i = 0; i < uniquePlacementIDs.length; i++) {
        $(`${uniquePlacementIDs[i]}`).addClass('animatingElem mediumTransitionAll');
    }

    setTimeout(function(){
        for (let i = 0; i < uniquePlacementIDs.length; i++) {
            $(`${uniquePlacementIDs[i]}`).addClass('potentialPlacement');
        }
    }, 10);

    setTimeout(function(){
        for (let i = 0; i < uniquePlacementIDs.length; i++) {
            $(`${uniquePlacementIDs[i]}`).addClass('activePotentialPlacement');
        }
    }, 20);

    setTimeout(function(){
        for (let i = 0; i < uniquePlacementIDs.length; i++) {
            $(`${uniquePlacementIDs[i]}`).removeClass('animatingElem mediumTransitionAll');
        }
    }, 800);
}

function findMapNeighbours(thisRow, thisColumn, criteria, returnPositions){

    let allMapNeighbours = [
        `#row-${thisRow - 1}-column-${thisColumn}`, // top
        `#row-${thisRow}-column-${thisColumn + 1}`, // right
        `#row-${thisRow + 1}-column-${thisColumn}`, // bottom
        `#row-${thisRow}-column-${thisColumn - 1}` // left
    ];

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
                    validMapNeighbours.push(allMapNeighbours[i]);
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
