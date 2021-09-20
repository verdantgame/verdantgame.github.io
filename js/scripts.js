// If device is touch capable, use touch as the trigger, otherwise the user is using a desktop computer so use click
var touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
touchEvent == 'touchstart' ? $('#container').addClass('touchDevice') : $('#container').addClass('nonTouchDevice');

// for (const [key, value] of Object.entries(myObject)) {
// }

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
let currentView = '';
let newView = '';

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
    checkScreenWidth();
    generateModalButtonNums();
    $('#loaderLayer').fadeIn('fast');

    // <!-- UNCOMMENT WHEN GOING LIVE!!! -->

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


function setupDrawPiles(){
    // create and shuffle plant card draw pile array
    allPlantCards = shuffle(plantCards);
    // console.log(`allPlantCards`, allPlantCards);

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
    // console.log(`allRoomCards`, allRoomCards);

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

    // console.log(`allItemTokens`, allItemTokens);

    setupInitialCardsAndItems();
}

function togglePotScoringLayerVisibility(mode) {
    // console.log(`mode = "${mode}"`);
    $('#viewPotScoringBtn').addClass('disableInteraction');
    $('#replaceMarketItemsBtn').addClass('disableInteraction');
    $('#chooseAnyMarketCardItemBtn').addClass('disableInteraction');
    if(mode == 'show') {
        // console.log(`mode = 'show'`);
        $('#viewPotScoringBtn').children('p').html('Hide Pot<br>scoring info');
        $('#viewPotScoringBtn').addClass('hidePotScoringLayer').removeClass('showPotScoringLayer');
        $('.plantPotContainer.hideScoring').addClass('showScoring').removeClass('hideScoring');
        animateElem($('#potScoringInfoContainer'), 'collapsed');
        animateElem($('#marketCardColumns'), 'expanded');
    } else if(mode == 'hide') {
        // console.log(`mode = 'hide'`);
        $('#viewPotScoringBtn').children('p').html('Show Pot<br>scoring info');
        $('#viewPotScoringBtn').addClass('showPotScoringLayer').removeClass('hidePotScoringLayer');
        $('.plantPotContainer.showScoring').addClass('hideScoring').removeClass('showScoring');
        animateElem($('#potScoringInfoContainer'), 'expanded');
        animateElem($('#marketCardColumns'), 'collapsed');
    }
    setTimeout(function(){
        // console.log(`togglePotScoringLayerVisibility - setTimeout(function(){}, 700)`);
        $('#viewPotScoringBtn').removeClass('disableInteraction');
        $('#replaceMarketItemsBtn').removeClass('disableInteraction');
        $('#chooseAnyMarketCardItemBtn').removeClass('disableInteraction');
    }, 700);
}

$(document).on(touchEvent, '#startGame', function(){
	$('.layer').fadeOut();
    setTimeout(function(){
        // console.log(` '#startGame' - setTimeout(function(){}, 400)`);
        $('body').addClass('gameView');
        $('#gameLayer').fadeIn();
        setTimeout(function(){
            // console.log(` '#startGame' - setTimeout(function(){}, 400)`);
            initMarketInterval = setInterval(initMarketFunc, 200);    
        }, 400);
    }, 400);

    $('#gameLayer #gameSectionsParent .collapsed ion-icon[name="expand"]').show();
});

function initMarketFunc(){
    let marketItemClasses = ['.plantPotOverlay', '.cardsAndItemContainer .marketPlantCardOverlay', '.cardsAndItemContainer .marketItemOverlay', '.cardsAndItemContainer .marketRoomCardOverlay'];
    // console.log(`.marketColumn[column="${currentColumn}"] ${marketItemClasses[currentMarketItem]}`);
    $(`.marketColumn[column="${currentColumn}"] ${marketItemClasses[currentMarketItem]}`).removeClass('startingPos');
    currentColumn--;
    // console.log(`currentColumn = ${currentColumn}`);
    if(currentColumn == -1 && (currentMarketItem + 1) < marketItemClasses.length) {
        // console.log(`currentColumn == -1 && (currentMarketItem + 1) < marketItemClasses.length`);
        currentColumn = 3;
        currentMarketItem++;
        clearInterval(initMarketInterval);
        setTimeout(function(){
            // console.log(`initMarketFunc - setTimeout(function(){}, 250)`);
            initMarketInterval = setInterval(initMarketFunc, 200);
        }, 250)
    } else if(currentColumn == -1 && (currentMarketItem + 1) == marketItemClasses.length) {
        // console.log(`currentColumn == -1 && (currentMarketItem + 1) == marketItemClasses.length`);
        clearInterval(initMarketInterval);
        currentColumn = 3;
        currentMarketItem = 0;
        setTimeout(function(){
            // console.log(`initMarketFunc - setTimeout(function(){}, 1000)`);
            initMarketFlipCardsInterval = setInterval(flipInitMarketCards, 300);    
        }, 1000);
    }
}

function flipInitMarketCards() {
    let marketFlipCardClasses = ['.cardsAndItemContainer .flip-plant .flip-card-inner', '.cardsAndItemContainer .flip-room .flip-card-inner'];
    // console.log(`.marketColumn[column="${currentColumn}"] ${marketFlipCardClasses[currentMarketItem]}`);
    $(`.marketColumn[column="${currentColumn}"] ${marketFlipCardClasses[currentMarketItem]}`).css('transform', 'rotateY(180deg) translate3d(0, 0, 1px)'); 
    currentColumn--;
    // console.log(`currentColumn = ${currentColumn}`);
    // console.log(`marketFlipCardClasses.length = ${marketFlipCardClasses.length}`);
    // console.log(`currentMarketItem = ${currentMarketItem}`);
    if(currentColumn == -1 && (currentMarketItem + 1) < marketFlipCardClasses.length) {
        // console.log(`currentColumn == -1 && (currentMarketItem + 1) < marketFlipCardClasses.length`);
        currentColumn = 3;
        currentMarketItem++;
    } else if(currentColumn == -1 && (currentMarketItem + 1) == marketFlipCardClasses.length) {
        // console.log(`currentColumn == -1 && (currentMarketItem + 1) == marketFlipCardClasses.length`);
        clearInterval(initMarketFlipCardsInterval);
        setTimeout(function(){
            // console.log(`flipInitMarketCards - setTimeout(function(){}, 550)`);
            isolateFlipCardContents();
            setTimeout(function(){
                // console.log(`flipInitMarketCards - setTimeout(function(){}, 300)`);
                initPlayersHome();
            }, 300);
        }, 550);
    }
}

function isolateFlipCardContents() {
    $('.cardsAndItemContainer .flip-plant .flip-card-inner .flip-card-back .cardContainer').each(function(){
        let columnNum = $(this).closest('.marketColumn').attr('column');
        // console.log(`columnNum = ${columnNum}`);
        $(this).prependTo(`.marketColumn[column="${columnNum}"] .cardsAndItemContainer .marketPlantCardOverlay`);
    });

    $('.cardsAndItemContainer .flip-room .flip-card-inner .flip-card-back .cardContainer').each(function(){
        let columnNum = $(this).closest('.marketColumn').attr('column');
        // console.log(`columnNum = ${columnNum}`);
        $(this).appendTo(`.marketColumn[column="${columnNum}"] .cardsAndItemContainer .marketRoomCardOverlay`);
    });
    
    $('.flip-card').remove();
    setTimeout(function(){
        // console.log(`isolateFlipCardContents - setTimeout(function(){}, 20)`);
        $('.initBoxShadow').removeClass('initBoxShadow');
    }, 20);
}

function initPlayersHome() {

    let initPlayersHomeTimeout = 0;

    $('.startingPosAnimate').removeClass('startingPosAnimate');

    swapActiveMainSection();

    if(!$('#container').hasClass('desktopView')) initPlayersHomeTimeout = 800;

    // console.log(`initPlayersHomeTimeout = ${initPlayersHomeTimeout}`);
    setTimeout(function(){
        // console.log(`initPlayersHome - setTimeout(function(){}, ${initPlayersHomeTimeout})`);
        chooseStartingPlayerCards();
    }, initPlayersHomeTimeout);
    
    setTimeout(function(){
        // console.log(`initPlayersHome - setTimeout(function(){}, ${initPlayersHomeTimeout + 200})`);
        animateElem($('#playerInfoContainer #cardToPlace .flip-plant'), 'tableauStartingPos');
        animateElem($('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room'), 'tableauStartingPos');
    }, (initPlayersHomeTimeout + 200));

    setTimeout(function(){
        // console.log(`initPlayersHome - setTimeout(function(){}, ${initPlayersHomeTimeout + 2500})`);
        $('#playerInfoContainer #cardToPlace .flip-plant .flip-card-inner').css('transform', 'rotateY(180deg) translate3d(0, 0, 1px)'); 
        $('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room .flip-card-inner').css('transform', 'rotateY(180deg) translate3d(0, 0, 1px)'); 
    }, (initPlayersHomeTimeout + 2500)); 

    setTimeout(function(){
        // console.log(`initPlayersHome - setTimeout(function(){}, ${initPlayersHomeTimeout + 3050})`);
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

    // console.log(`generateCard(thisCard, cardType, mode, thisSection)`);
    // console.log(`generateCard(${thisCard}, ${cardType}, ${mode}, ${thisSection})`);

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

                    <div data-animation-group="${thisSection}" class="${mode == 'market' ? `newCardContainer ` : ``}cardContainer expanded initBoxShadow" cardtype="${cardType}"${cardType == 'plant' ? ` data-lighting-num="${thisCard.lighting.length}"` : ``}`;
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

    // console.log(`generateItem(thisItem, mode)`);
    // console.log(`generateItem(${thisItem}, ${mode})`);

    // itemDetails[0] = itemsNurture
    // itemDetails[1] = trowel

    let itemDetails = thisItem.split('_');
    let thisItemHTML = `
        <div data-animation-group="market" item-type="${itemDetails[0] == 'itemsNurture' ? `nurture` : `normal`}" item-name="${itemDetails[1]}" class="${mode == 'market' ? `newItemToken ` : `animatingElem mediumTransition `}itemToken expanded" >
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

$(document).on(touchEvent,'#replaceMarketItemsBtn',function(){
    let greenThumbActionCriteria = checkPlayersGreenThumbAmount();
    if(!greenThumbActionCriteria) {
        greenThumbAmountStatus('insufficientNum');
    } else {
        setupGreenThumbAction('replaceMarketItems');
    }
});

$(document).on(touchEvent,'#chooseAnyMarketCardItemBtn',function(){
    let greenThumbActionCriteria = checkPlayersGreenThumbAmount();
    if(!greenThumbActionCriteria) {
        greenThumbAmountStatus('insufficientNum');
    } else {
        setupGreenThumbAction('chooseAnyCardItem');
    }
});

$(document).on(touchEvent,'#addOneVerdancyToPlantBtn',function(){
    let greenThumbActionCriteria = checkPlayersGreenThumbAmount();
    if(!greenThumbActionCriteria) {
        greenThumbAmountStatus('insufficientNum');
    } else {
        $('.activePlacement').addClass('inactivePlacement').removeClass('activePlacement')
        $(this).addClass('disableInteraction');
        $('#useItemBtnContainer .useItemsBtn').addClass('disableInteraction');
        $('#swapItemsBtnContainer .swapItemsBtn').addClass('disableInteraction');
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
        $('#swapItemsBtnContainer .swapItemsBtn').attr('disabled', 'disabled');
        // console.log(`'#useItemBtnContainer .useItemsBtn'`);

        nurtureItemMapRecipients('plant', 'addOneVerdancy');

        // addOneVerdancyPotentialTarget

    }
}

$(document).on(touchEvent,'#addOneVerdancyOption #cancelAddOneVerdancyAction',function(){
    // console.log(`#cancelNurtureItemAction.button`);

    toggleMapVerdancy('hide');

    $('#verdancyVisibilityContainer').removeClass('disableInteraction');
    $('.verdancyPulseAnimation').removeClass('verdancyPulseAnimation');
    animateElem($('#mapContainer #addOneVerdancyOption'), 'hideAddOneVerdancyOption');
    
    $('.previewAddOneVerdancyImg.previewNurtureItemIcon.lockedInIcon').fadeOut();

    setTimeout(function(){

        $('#addOneVerdancyToPlantBtn').removeClass('disableInteraction');
        $('#useItemBtnContainer .useItemsBtn').removeClass('disableInteraction');
        $('#swapItemsBtnContainer .swapItemsBtn').removeClass('disableInteraction');

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
            // console.log(`$('#chosenItemContainer .itemToken.inactivePlacement').length`);
            $('#chosenItemContainer .itemToken.inactivePlacement').attr('style', '');
            $('#chosenItemContainer .itemToken.inactivePlacement').addClass('activePlacement').removeClass('inactivePlacement');
            checkChosenItemType();
        } else {
            // console.log(`!$('#chosenItemContainer .itemToken.inactivePlacement').length`);
            $('#undoNextRoundBtnContainer #undoAction').removeAttr('disabled');
            activateNextRoundBtn();
        }
        
    }, 400);
    
});


$(document).on('mouseenter','#mapContainer .mapTileContainer.potentialNurtureItemTarget.addOneVerdancyPotentialTarget',function(){
    // console.log(`'mouseenter','#mapContainer .mapTileContainer.potentialNurtureItemTarget.addOneVerdancyPotentialTarget'`);
    $(this).append(`
        <img class="previewAddOneVerdancyImg previewNurtureItemIcon" src="img/itemsNurture/addOneVerdancy-icon.png" />
    `);
});

$(document).on('mouseleave','#mapContainer .mapTileContainer.potentialNurtureItemTarget.addOneVerdancyPotentialTarget',function(){
    // console.log(`'mouseleave','#mapContainer .mapTileContainer.potentialNurtureItemTarget.addOneVerdancyPotentialTarget'`);
    $('.potentialNurtureItemTarget .previewAddOneVerdancyImg:not(.lockedInIcon)').remove();
});

$(document).on(touchEvent,'#mapContainer .mapTileContainer.potentialNurtureItemTarget.addOneVerdancyPotentialTarget',function(){    
    // console.log(`#mapContainer .mapTileContainer.potentialNurtureItemTarget.addOneVerdancyPotentialTarget`);

    $('.verdancyPulseAnimation').removeClass('verdancyPulseAnimation');

    $('.mapTileContainer.addOneVerdancyPreviewAction .previewAddOneVerdancyImg.lockedInIcon').remove();
    $('.addOneVerdancyPreviewAction').addClass('addOneVerdancyPotentialTarget').removeClass('addOneVerdancyPreviewAction');

    $(this).addClass('addOneVerdancyPreviewAction').removeClass('addOneVerdancyPotentialTarget');
    $('.mapTileContainer.addOneVerdancyPreviewAction .previewAddOneVerdancyImg').addClass('lockedInIcon');

    previewNurtureItemVerdancy($(this), 1);
    $('#addOneVerdancyOption #confirmAddOneVerdancyAction').removeAttr('disabled');
});


$(document).on(touchEvent,'#addOneVerdancyOption #confirmAddOneVerdancyAction',function(){
    // console.log('addOneVerdancyOption #confirmAddOneVerdancyAction');   

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
            // console.log(`newCompletedVerdancy = ${newCompletedVerdancy}`);
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
            auditSwapItemBtnText('swapItems');
        }
    }, 3200);


    // if($('#cardToPlace .cardContainer.inactivePlacement').length) {
    //     $('#cardToPlace .cardContainer.inactivePlacement').addClass('activePlacement').removeClass('inactivePlacement');
    //     showPotentialCardPlacements();
    // } else if($('#chosenItemContainer .itemToken.inactivePlacement').length) {
    //     // console.log(`$('#chosenItemContainer .itemToken.inactivePlacement').length`);
    //     $('#chosenItemContainer .itemToken.inactivePlacement').attr('style', '');
    //     $('#chosenItemContainer .itemToken.inactivePlacement').addClass('activePlacement').removeClass('inactivePlacement');
    //     checkChosenItemType();
    // } else {
    //     // console.log(`!$('#chosenItemContainer .itemToken.inactivePlacement').length`);
    //     $('#undoNextRoundBtnContainer #undoAction').removeAttr('disabled');
    //     activateNextRoundBtn();
    // }

});

function checkPlayersGreenThumbAmount() {
    let greenThumbAmount = parseInt($('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').text());
    if(greenThumbAmount >= 2) {
        return true;
    } else if(greenThumbAmount < 2) {
        return false;
    }
}

function greenThumbAmountStatus(mode) {
    
    if(mode == 'insufficientNum') {
        // show green thumb amount is not enough for any green thump action
        $('#infoBarStats #greenThumbsAmountContainer').addClass('insufficient-green-thumbs');
        $('.greenThumbActionBtn').addClass('disableInteraction');
        setTimeout(function(){
            $('.insufficient-green-thumbs').removeClass('insufficient-green-thumbs');
            $('.greenThumbActionBtn').removeClass('disableInteraction');
        }, 1600);
        
    } else if(mode == 'actionDeduction') {
        // show green thumb amount being reduced by 2

        let currentGreenThumbAmount = parseInt($('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').text());
        let newGreenThumbAmount = currentGreenThumbAmount - 2;

        $('#infoBarStats #greenThumbsAmountContainer #greenThumbsUpdateInfo').addClass('subtractVal');
        $('#infoBarStats #greenThumbsAmountContainer #greenThumbsUpdateInfo').html('2');
        $('#infoBarStats #greenThumbsAmountContainer #greenThumbsUpdateInfo').fadeIn();

        setTimeout(function(){
            $('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').fadeOut();
        }, 1000);

        setTimeout(function(){
            $('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').html(newGreenThumbAmount)
            $('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').fadeIn();
        }, 1400);

        setTimeout(function(){
            $('#infoBarStats #greenThumbsAmountContainer #greenThumbsUpdateInfo').fadeOut();
        }, 2000);

        setTimeout(function(){
            $('.subtractVal').removeClass('subtractVal');
        }, 2400);

    }
    

    // blink green thumb amount in and out and highlight in red to show that the player does not have enough green thumbs to carry out the action!
}


$(document).on(touchEvent,'#cancelReplaceMarketItemsAction',function(){
    $('#marketSection').removeClass('replaceMarketItemsGreenThumbAction marketGreenThumbAction');
    $('.potentialItemToReplace').removeClass('potentialItemToReplace');
    $('#replaceMarketItemsInstructionsAndBtns #confirmReplaceMarketItemsAction').attr('disabled', 'disabled');
});

$(document).on(touchEvent,'#gameSectionsParent[current-phase="market-selection"] .gameSection.replaceMarketItemsGreenThumbAction .gameSectionContent > #marketCardColumns .marketColumn .marketItemOverlay:not(.potentialItemToReplace)',function(){
    // console.log(`'#gameSectionsParent[current-phase="market-selection"] .gameSectionContent > #marketCardColumns .marketColumn.activeColumn .cardContainer.potentialMarketCardChoice`);
    $(this).addClass('potentialItemToReplace');
    $('#replaceMarketItemsInstructionsAndBtns #confirmReplaceMarketItemsAction').removeAttr('disabled');
});

$(document).on(touchEvent,'#gameSectionsParent[current-phase="market-selection"] .gameSection.replaceMarketItemsGreenThumbAction .gameSectionContent > #marketCardColumns .marketColumn .marketItemOverlay.potentialItemToReplace',function(){
    // console.log(`'#gameSectionsParent[current-phase="market-selection"] .gameSectionContent > #marketCardColumns .marketColumn.activeColumn .cardContainer.potentialMarketCardChoice`);
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


// $(`.gameSectionContent > #marketCardColumns .marketColumn[column="${currentChosenColumn}"]`).addClass('potentialChosenColumn');
// $(`.gameSectionContent > #marketCardColumns .marketColumn[column="${currentChosenColumn}"] .market${capitalizeFirstLetter(currentChosenCardType)}CardOverlay .cardContainer[cardtype="${currentChosenCardType}"]`).addClass('potentialMarketCardChoice');
// $(`.gameSectionContent > #marketCardColumns .marketColumn[column="${currentChosenColumn}"] .market${capitalizeFirstLetter(currentChosenCardType)}CardOverlay`).addClass('potentialCardOverlayParent');
// $(`.gameSectionContent > #marketCardColumns .marketColumn[column="${currentChosenColumn}"] .marketItemOverlay .itemToken`).addClass('potentialMarketItemChoice');
// $(`.gameSectionContent > #marketCardColumns .marketColumn[column="${currentChosenColumn}"] .marketItemOverlay`).addClass('potentialItemOverlayParent');


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



// $(document).on(touchEvent,'#confirmChosenColumnContainer.marketActionContainer .btnContainer #confirmColumnChoice',function(){
//     // console.log(`'#confirmChosenColumnContainer.marketActionContainer .btnContainer #confirmColumnChoice'`);
//     processChosenAndItems();

//     let potentialCardType = $('.marketCardOverlay.potentialCardOverlayParent .cardContainer').attr('cardtype');
//     let validCardPlacements = checkPotentialCardPlacements(potentialCardType, 'marketCardSelection');

//     if(!validCardPlacements) {
//         $(`#${potentialCardType}PlacementsExhaustedModal`).addClass('is-active');
//     } else {
//         $('#confirmChosenColumnContainer.marketActionContainer').fadeOut();
//         $('#marketInactiveOverlay').fadeOut();
//         processChosenAndItems()
//     }
// });




$(document).on('mouseenter','#marketSection.gameSection .marketColumn .cardsAndItemContainer .marketItemOverlay .itemToken .nurtureItemExplanation',function(){
    $(this).closest('.marketColumn').addClass('raisedColumn');
});

$(document).on('mouseleave','#marketSection.gameSection .marketColumn .cardsAndItemContainer .marketItemOverlay .itemToken .nurtureItemExplanation',function(){
    $('.raisedColumn').removeClass('raisedColumn');
});


$(document).on('mouseenter',' #gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn .cardContainer',function(){
    // console.log(`'mouseenter','#gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn .cardContainer`);

    $(this).addClass('potentialMarketCardChoice');
    $(this).parent().addClass('potentialCardOverlayParent');
    $(this).closest('.marketColumn').addClass('activeColumn');

    setTimeout(function(){
        // console.log(`'mouseenter','#gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn .cardContainer' - setTimeout(function(){}, 10)`);
        $('.marketColumn.activeColumn .cardsAndItemContainer .marketItemOverlay .itemToken').addClass('potentialMarketItemChoice');
        $('.marketColumn.activeColumn .cardsAndItemContainer .marketItemOverlay').addClass('potentialItemOverlayParent');
    }, 10);

    setTimeout(function(){
        // console.log(`'mouseenter','#gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn .cardContainer' - setTimeout(function(){}, 20)`);
        let tempGreenThumb = `
            <div class="potentialGreenThumbContainer">
                <p class="plusGreenThumbText">+</p>
                <img class="potentialGreenThumb" src="img/thumbs/${Math.floor(Math.random() * 5)}.png">
            </div>
        `;
        $('.marketColumn.activeColumn .cardsAndItemContainer .marketCardOverlay:not(.potentialCardOverlayParent) .cardContainer').append(tempGreenThumb);
    }, 20);

    setTimeout(function(){
        // console.log(`'mouseenter','#gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn .cardContainer' - setTimeout(function(){}, 30)`);
        $('.marketColumn.activeColumn .cardsAndItemContainer .marketCardOverlay:not(.potentialCardOverlayParent) .cardContainer .potentialGreenThumbContainer').addClass('showPotentialGreenThumb');
    }, 30);
    
});

$(document).on('mouseleave','#gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn.activeColumn .cardContainer',function(){
    // console.log(`'mouseleave','#gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn.activeColumn .cardContainer`);

    resetPotentialMarketSelections();
    $('.activeColumn').removeClass('activeColumn');
    $('#gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn:not(.activeColumn) .cardContainer .potentialGreenThumbContainer.showPotentialGreenThumb').removeClass('showPotentialGreenThumb');
    setTimeout(function(){
        // console.log(`'mouseleave','#gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn.activeColumn .cardContainer - setTimeout(function(){}, 300)`);
        $('#gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn:not(.activeColumn) .cardContainer .potentialGreenThumbContainer').remove();
    }, 300);
});

function resetPotentialMarketSelections(){
    // console.log(`resetPotentialMarketSelections()`);

    $('.potentialMarketCardChoice').removeClass('potentialMarketCardChoice');
    $('.potentialCardOverlayParent').removeClass('potentialCardOverlayParent');
    $('.potentialMarketItemChoice').removeClass('potentialMarketItemChoice');
    $('.potentialItemOverlayParent').removeClass('potentialItemOverlayParent');
}

var currentChosenColumn = '';
var currentChosenCardType = '';

$(document).on(touchEvent,'#gameSectionsParent[current-phase="market-selection"] .gameSection:not(.marketGreenThumbAction) .gameSectionContent > #marketCardColumns .marketColumn.activeColumn .cardContainer.potentialMarketCardChoice',function(){
    // console.log(`'#gameSectionsParent[current-phase="market-selection"] .gameSectionContent > #marketCardColumns .marketColumn.activeColumn .cardContainer.potentialMarketCardChoice`);

    $('.potentialGreenThumbContainer.showPotentialGreenThumb').removeClass('showPotentialGreenThumb');
    setTimeout(function(){
        // console.log(`'#gameSectionsParent[current-phase="market-selection"] .gameSectionContent > #marketCardColumns .marketColumn.activeColumn .cardContainer.potentialMarketCardChoice - setTimeout(function(){}, 300)`);
        $('.potentialGreenThumbContainer').remove();
    }, 300);

    $('.marketColumn.activeColumn').addClass('potentialChosenColumn').removeClass('activeColumn');

    currentChosenColumn = $('.marketColumn.potentialChosenColumn').attr('column')
    currentChosenCardType = $(this).attr('cardtype');

    // console.log(`currentChosenColumn = ${currentChosenColumn}`);
    // console.log(`currentChosenCardType = ${currentChosenCardType}`);

    $('.gameSectionContent > #marketCardColumns').clone().appendTo('#confirmChosenColumnContainer #columnToConfirm');
    $('#confirmChosenColumnContainer #columnToConfirm #marketCardColumns').attr('id', 'marketCardColumnsToConfirm');

    $('#confirmChosenColumnContainer.marketActionContainer').attr('view-column', currentChosenColumn);
    $('#confirmChosenColumnContainer.marketActionContainer').attr('view-category', currentChosenCardType);

    $('#confirmChosenColumnContainer.marketActionContainer').fadeIn();
    $('#marketInactiveOverlay').fadeIn();

});


$(document).on(touchEvent,'#confirmChosenColumnContainer.marketActionContainer .zoomedColumnNavArrow',function(){  
    // console.log(`'#confirmChosenColumnContainer.marketActionContainer .zoomedColumnNavArrow'`);

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
    // console.log(`'#confirmChosenColumnContainer.marketActionContainer .btnContainer #cancelColumnChoice'`);

    closeConfirmChosenColumnContainer();
});

$(document).on(touchEvent,'#marketInactiveOverlay',function(){    
    // console.log(`'#marketInactiveOverlay'`);

    closeConfirmChosenColumnContainer();
});

$(document).on(touchEvent,'#confirmChosenColumnContainer.marketActionContainer .delete.closeMarketActionTrigger',function(){    
    // console.log(`'#confirmChosenColumnContainer.marketActionContainer .delete.closeMarketActionTrigger'`);

    closeConfirmChosenColumnContainer();
});

function closeConfirmChosenColumnContainer(){
    // console.log(`closeConfirmChosenColumnContainer()`);

    $('#confirmChosenColumnContainer.marketActionContainer').fadeOut();
    $('#marketInactiveOverlay').fadeOut();
    $('.potentialChosenColumn').removeClass('potentialChosenColumn');
    resetPotentialMarketSelections();
    setTimeout(function(){
        // console.log(`closeConfirmChosenColumnContainer() - setTimeout(function(){}, 400)`);
        $('#confirmChosenColumnContainer #columnToConfirm').html('');
    }, 400);
}

let currentRoundActionLog = [];

$(document).on(touchEvent,'#confirmChosenColumnContainer.marketActionContainer .btnContainer #confirmColumnChoice',function(){
    // console.log(`'#confirmChosenColumnContainer.marketActionContainer .btnContainer #confirmColumnChoice'`);
    // processChosenAndItems();

    let potentialCardType = $('.marketCardOverlay.potentialCardOverlayParent .cardContainer').attr('cardtype');
    let validCardPlacements = checkPotentialCardPlacements(potentialCardType, 'marketCardSelection');

    if(!validCardPlacements) {
        $(`#${potentialCardType}PlacementsExhaustedModal`).addClass('is-active');
    } else {
        $('#confirmChosenColumnContainer.marketActionContainer').fadeOut();
        $('#marketInactiveOverlay').fadeOut();
        processChosenAndItems()
    }
});

function processChosenAndItems(){

    let potentialCardType = $('.marketCardOverlay.potentialCardOverlayParent .cardContainer').attr('cardtype');
    let validCardPlacements = checkPotentialCardPlacements(potentialCardType, 'marketCardSelection');

    if(!validCardPlacements) {
        $(`#${potentialCardType}PlacementsExhaustedModal`).addClass('is-active');
    } else {

        currentRoundActionLog = ['market-selection'];

        $('.potentialChosenColumn').addClass('lockedInColumn').removeClass('potentialChosenColumn');
        $('.potentialMarketCardChoice').addClass('chosenMarketCard').removeClass('potentialMarketCardChoice');
        $('.potentialCardOverlayParent').addClass('lockedInCardOverlay').removeClass('potentialCardOverlayParent');
        $('.potentialMarketItemChoice').addClass('chosenMarketItem').removeClass('potentialMarketItemChoice');
        $('.potentialItemOverlayParent').addClass('lockedInItemOverlay').removeClass('potentialItemOverlayParent');

        $('#gameSectionsParent').attr('current-phase', 'card-item-placement');
        $('.greenThumbActionBtn.marketActionButton').attr('disabled', 'disabled');

        // $('#confirmChosenColumnContainer.marketActionContainer').fadeOut();
        // $('#marketInactiveOverlay').fadeOut();

        let chosenCardsGreenThumbs = parseInt($('.lockedInCardOverlay .cardContainer .newGreenThumbMasterContainer').attr('total-green-thumbs'));
        let currentGreenThumbs = parseInt($('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').html());
        let newGreenThumbAmount = chosenCardsGreenThumbs + currentGreenThumbs;

        // console.log(`chosenCardsGreenThumbs = ${chosenCardsGreenThumbs}`);
        // console.log(`currentGreenThumbs = ${currentGreenThumbs}`);
        // console.log(`newGreenThumbAmount = ${newGreenThumbAmount}`);

        let extraTimeout = 0;
        
        if(chosenCardsGreenThumbs > 0) {
            extraTimeout = 2550;
            // console.log(`chosenCardsGreenThumbs > 0`);
            // $(`.lockedInCardOverlay .greenThumbMarketContainer`).fadeOut();

            setTimeout(function(){
                if($(`.lockedInCardOverlay .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).length) {
                    $(`.lockedInCardOverlay .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).parentToAnimate($('#greenThumbsAmountContainer #greenThumbsEndPoint'), 1300);
                }
        
                if($(`.lockedInCardOverlay .newGreenThumbParentContainer[green-thumb-container="2"] .newGreenThumbContainer`).length) {
                    $(`.lockedInCardOverlay .newGreenThumbParentContainer[green-thumb-container="2"] .newGreenThumbContainer`).parentToAnimate($('#greenThumbsAmountContainer #greenThumbsEndPoint'), 1300);
                }
            }, 200);

            setTimeout(function(){
                // console.log(`'processChosenAndItems() FUNCTION' - setTimeout(function(){}, 450)`);
                $('#infoBarStats #greenThumbsAmountContainer #greenThumbsEndPoint').html('');
                $('#infoBarStats #greenThumbsAmountContainer #greenThumbsAmountInfo').html(newGreenThumbAmount);
                $('#infoBarStats #greenThumbsAmountContainer #greenThumbsUpdateInfo').addClass('addVal').html(chosenCardsGreenThumbs);
                $('#infoBarStats #greenThumbsAmountContainer #greenThumbsUpdateInfo').fadeIn();
            }, 1550);

            setTimeout(function(){
                // console.log(`'processChosenAndItems() FUNCTION' - setTimeout(function(){}, 2000)`);
                // $(`.lockedInCardOverlay .cardContainer .greenThumbMarketContainer`).remove();
                $('#infoBarStats #greenThumbsAmountContainer #greenThumbsUpdateInfo').fadeOut();
            }, 2550);

            setTimeout(function(){
                $('.addVal').removeClass('addVal');
            }, 3000);
        }

        let oppositeCardGreenThumbs = parseInt($('.marketColumn.lockedInColumn .cardsAndItemContainer .marketCardOverlay:not(.lockedInCardOverlay) .cardContainer .newGreenThumbMasterContainer').attr('total-green-thumbs'));
        // console.log(`oppositeCardGreenThumbs = ${oppositeCardGreenThumbs}`);
        oppositeCardGreenThumbs++;
        // console.log(`oppositeCardGreenThumbs = ${oppositeCardGreenThumbs}`);

        setTimeout(function(){
            // console.log(`'processChosenAndItems() FUNCTION' - setTimeout(function(){}, 400)`);

            let randomThumb = Math.floor(Math.random() * 5);
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
            // console.log(`oppositeCardGreenThumbs > 2`);
            extraTimeout = extraTimeout + 2000;

            setTimeout(function(){
                // console.log(`'processChosenAndItems() FUNCTION' - setTimeout(function(){}, 710)`);
                $('.marketColumn.lockedInColumn .cardsAndItemContainer .marketCardOverlay:not(.lockedInCardOverlay) .cardContainer .newGreenThumbMasterContainer').addClass('removeAllGreenThumbs');
            }, 710);

            setTimeout(function(){
                // console.log(`'processChosenAndItems() FUNCTION' - setTimeout(function(){}, 1020)`);
                $('.marketColumn.lockedInColumn .cardsAndItemContainer .marketCardOverlay:not(.lockedInCardOverlay) .cardContainer .newGreenThumbMasterContainer .newGreenThumbContainer').fadeOut();
            }, 1720);

            setTimeout(function(){
                // console.log(`'processChosenAndItems() FUNCTION' - setTimeout(function(){}, 1330)`);
                $('.marketColumn.lockedInColumn .cardsAndItemContainer .marketCardOverlay:not(.lockedInCardOverlay) .cardContainer .newGreenThumbMasterContainer .newGreenThumbContainer').remove();
                $('.marketColumn.lockedInColumn .cardsAndItemContainer .marketCardOverlay:not(.lockedInCardOverlay) .cardContainer .newGreenThumbMasterContainer').attr('total-green-thumbs', '0');
            }, 2030);

        }

        setTimeout(function(){
            // console.log(`'processChosenAndItems() FUNCTION' - setTimeout(function(){}, ${extraTimeout +  2000})`);
            
            $('.newGreenThumbContainer.new-green-thumb-animation').removeClass('new-green-thumb-animation');
            
            swapActiveMainSection();
            $('#confirmChosenColumnContainer #columnToConfirm').html('');
            $('.cardContainer.chosenMarketCard').parentToAnimate($('#tableauSection #homeContentContainer #playerInfoContainer #cardToPlace'), 1000);
            $('.itemToken.chosenMarketItem').parentToAnimate($('#tableauSection #homeContentContainer #playerInfoContainer #chosenItemParentContainer #chosenItemContainer'), 1000);
        }, extraTimeout + 2000);

        setTimeout(function(){
            // console.log(`'processChosenAndItems() FUNCTION' - setTimeout(function(){}, ${extraTimeout +  2350})`);
            animateElem($('#tableauSection #undoNextRoundBtnContainer'), 'showRoundEndOptions');
        }, extraTimeout +  2350);

        setTimeout(function(){
            // console.log(`'processChosenAndItems() FUNCTION' - setTimeout(function(){}, ${extraTimeout +  3350})`);
            $('#undoNextRoundBtnContainer #undoAction').removeAttr('disabled');

            $('#cardToPlace .cardContainer').attr('style', '');
            $('#cardToPlace .cardContainer').addClass('activePlacement');

            $('#chosenItemContainer .itemToken').attr('style', '');
            $('#chosenItemContainer .itemToken').addClass('inactivePlacement');
            
            $('#addOneVerdancyToPlantBtn').removeAttr('disabled');

            showPotentialCardPlacements();
        }, extraTimeout +  3350);
    }
}

$(document).on(touchEvent,'#undoNextRoundBtnContainer #undoAction.button',function(){
    // console.log(`'#undoNextRoundBtnContainer #undoAction.button'`);


    var undoAction = currentRoundActionLog.pop();
    // console.log(`undoAction = ${undoAction}`);
    setTimeout(function(){
        // console.log(`'#undoNextRoundBtnContainer #undoAction.button' - setTimeout(function(){}, 10)`);
        auditSwapItemBtnText('swapItems');
    }, 10);

    if(undoAction == 'market-selection') {
        // console.log(`undoAction == 'market-selection'`);
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
            // console.log(`'#undoNextRoundBtnContainer #undoAction.button' - setTimeout(function(){}, 50)`);
            $('.mapTileContainer.activePotentialCardPlacement').removeClass('activePotentialCardPlacement');
            $('.mapTileContainer.activePotentialItemPlacement').removeClass('activePotentialItemPlacement');
        }, 50);

        setTimeout(function(){
            // console.log(`'#undoNextRoundBtnContainer #undoAction.button' - setTimeout(function(){}, 800)`);
            $('.mapTileContainer.potentialCardPlacement').removeClass('potentialCardPlacement');
            $('.mapTileContainer.potentialItemPlacement').removeClass('potentialItemPlacement');
        }, 800);

        setTimeout(function(){
            // console.log(`'#undoNextRoundBtnContainer #undoAction.button' - setTimeout(function(){}, 850)`);
            $('.mapTileContainer.animatingElem.mediumTransitionAll').removeClass('animatingElem mediumTransitionAll');
            $('.mapTileContainer.animatingElem.mediumTransitionAll').removeClass('animatingElem mediumTransitionAll');
        }, 850);
        
        animateElem($('#tableauSection #undoNextRoundBtnContainer'), 'hideRoundEndOptions');

        setTimeout(function(){
            // console.log(`'#undoNextRoundBtnContainer #undoAction.button' - setTimeout(function(){}, 1010)`);
            $('.lockedInColumn').removeClass('lockedInColumn');
            $('.chosenMarketCard').removeClass('chosenMarketCard');
            $('.lockedInCardOverlay').removeClass('lockedInCardOverlay');
            $('.chosenMarketItem').removeClass('chosenMarketItem');
            $('.lockedInItemOverlay').removeClass('lockedInItemOverlay');

            $('#gameSectionsParent').attr('current-phase', 'market-selection');
        }, 1010);

        $('#useItemBtnContainer .useItemsBtn').attr('disabled', 'disabled');
        $('#useItemBtnContainer').removeClass('showUseItemsBtn');
        $('#useItemBtnContainer .useItemsBtn').removeAttr('item-to-use');

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

    // console.log(`$(document).keydown(function(e)`);
    // console.log(`e = `, e);
    // console.log(`e.which = ${e.which}`);

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
    // console.log(`'mouseenter','#mapContainer .mapTileContainer.potentialCardPlacement.activePotentialCardPlacement:not(.temporaryCardPlacement)`);

    if(!lockMap) {
        // console.log(`!lockMap`);
        $(this).addClass('cardPlacementPreview');
        var thisMapTile = $(this);
        $('.cardContainer.activePlacement').clone().appendTo(thisMapTile);
    }
});

$(document).on('mouseleave','#mapContainer .mapTileContainer.potentialCardPlacement.activePotentialCardPlacement.cardPlacementPreview:not(.temporaryCardPlacement)',function(){    
    // console.log(`'mouseleave','#mapContainer .mapTileContainer.potentialCardPlacement.activePotentialCardPlacement.cardPlacementPreview:not(.temporaryCardPlacement)'`);

    if(!lockMap) {
        // console.log(`!lockMap`);
        $(this).removeClass('cardPlacementPreview');
        $('#mapContainer .mapTileContainer.potentialCardPlacement:not(.temporaryCardPlacement) .cardContainer').remove();
    }
});

$(document).on(touchEvent,'#mapContainer .mapTileContainer.potentialCardPlacement.activePotentialCardPlacement:not(.temporaryCardPlacement)',function(){    
    // console.log(`'#mapContainer .mapTileContainer.potentialCardPlacement.activePotentialCardPlacement:not(.temporaryCardPlacement)'`);
    
    if(!lockMap) {
        // console.log(`!lockMap`);
        $('#undoNextRoundBtnContainer #undoAction').attr('disabled', 'disabled');
        lockMap = true;
        toggleMapVerdancy('hide');
        if($('#mapContainer .mapTileContainer.potentialCardPlacement:not(.temporaryCardPlacement) .cardContainer').length) {
            // console.log(`if $('#mapContainer .mapTileContainer.potentialCardPlacement:not(.temporaryCardPlacement) .cardContainer').length`);
            $('#mapContainer .mapTileContainer.potentialCardPlacement:not(.temporaryCardPlacement) .cardContainer').remove();
        }
        $('.cardPlacementPreview').removeClass('cardPlacementPreview');
        var targID = $(this).attr('id');
        $('#mapContainer .mapTileContainer.potentialCardPlacement.temporaryCardPlacement').addClass('activePotentialCardPlacement').removeClass('temporaryCardPlacement');
        temporarilyLockMap(1000);

        $('.cardContainer.activePlacement').parentToAnimate($(`#${targID}`), 1000);

        setTimeout(function(){
            // console.log(`'#mapContainer .mapTileContainer.potentialCardPlacement.activePotentialCardPlacement:not(.temporaryCardPlacement) - setTimeout(function(){}, 450)`);
            animateElem($('#mapContainer #placedCardOptions'), 'showCardOptions');
        }, 450)

        setTimeout(function(){
            // console.log(`'#mapContainer .mapTileContainer.potentialCardPlacement.activePotentialCardPlacement:not(.temporaryCardPlacement) - setTimeout(function(){}, 950)`);
            $(`#${targID}`).removeClass('activePotentialCardPlacement').addClass('temporaryCardPlacement');
            if(startingPlacement) {
                // console.log(`startingPlacement`);
                if($('#verdancyVisibilityContainer.disableVerdancyVisibility').length) {
                    // console.log(`$('#verdancyVisibilityContainer.disableVerdancyVisibility').length`);
                    $('#verdancyVisibilityContainer.disableVerdancyVisibility').removeClass('disableVerdancyVisibility');
                }
            }
        }, 950);
        
    }
});

$(document).on(touchEvent,'#cancelCardPlacement.button',function(){
    // console.log(`'#cancelCardPlacement.button'`);

    animateElem($('#mapContainer #placedCardOptions'), 'hideCardOptions');
    $('.cardContainer.activePlacement').parentToAnimate($('#playerInfoContainer #cardToPlace'), 1000);
    resetPotentialMapPlacements('resetCardToPlace');
    if(startingPlacement) {
        $('#verdancyVisibilityContainer').addClass('disableVerdancyVisibility');
    }
    setTimeout(function(){
        // console.log(`'#cancelCardPlacement.button' - setTimeout(function(){}, 1000)`);
        $('#undoNextRoundBtnContainer #undoAction').removeAttr('disabled');
    }, 1000);
});


$(document).on(touchEvent,'#confirmCardPlacement.button',function(){
// console.log(`'#confirmCardPlacement.button'`);

    lockMap = true;

    currentRoundActionLog.push('card-placement');

    if($('#viewPotScoringBtn').hasClass('hidePotScoringLayer')) {
        // console.log(`$('#viewPotScoringBtn').hasClass('hidePotScoringLayer')`);
        togglePotScoringLayerVisibility('hide');
    }

    let placedMapID = $('.mapTileContainer.temporaryCardPlacement').attr('id');
    let placedCardType = $('.mapTileContainer.temporaryCardPlacement .cardContainer').attr('cardtype');

    let placedCardRow = $('.mapTileContainer.temporaryCardPlacement').data('map-row');
    let placedCardColumn = $('.mapTileContainer.temporaryCardPlacement').data('map-column');

    // console.log(`placedMapID = ${placedMapID}`);
    // console.log(`placedCardType = ${placedCardType}`);
    // console.log(`placedCardRow = ${placedCardRow}`);
    // console.log(`placedCardColumn = ${placedCardColumn}`);

    if(placedCardType == 'room') {
        // console.log(`placedCardType == 'room'`);
        $(`#${placedMapID}`).attr('cardtype', 'room');
        $(`#${placedMapID}`).attr('placed-item', 'none');
    } else {
        // console.log(`placedCardType != 'room'`);
        $(`#${placedMapID}`).attr('cardtype', 'plant');
        $(`#${placedMapID}`).attr('plant-pot', 'none');
    }

    checkLightingMatches(`#${placedMapID}`);
    animateElem($('#mapContainer #placedCardOptions'), 'hideCardOptions');

    $('.mapTileContainer.potentialCardPlacement').addClass('animatingElem mediumTransitionAll');

    setTimeout(function(){
        // console.log(`#confirmCardPlacement.button - setTimeout(function(){}, 50)`);
        $('.mapTileContainer.activePotentialCardPlacement').removeClass('activePotentialCardPlacement');
    }, 50);

    setTimeout(function(){
        // console.log(`#confirmCardPlacement.button - setTimeout(function(){}, 300)`);
        if(!startingPlacement) {
            // console.log(`if !startingPlacement`);
            $('.mapTileContainer.temporaryCardPlacement').addClass('confirmedCardPlacement');
            $('.mapTileContainer.temporaryCardPlacement .cardContainer.activePlacement').addClass('placedCard').removeClass('activePlacement');
        }
        $('.mapTileContainer.temporaryCardPlacement').removeClass('temporaryCardPlacement');

    }, 300);

    setTimeout(function(){
        // console.log(`#confirmCardPlacement.button - setTimeout(function(){}, 800)`);
        $('.mapTileContainer.animatingElem.mediumTransitionAll').removeClass('animatingElem mediumTransitionAll');
    }, 800);

    setTimeout(function(){
        // console.log(`#confirmCardPlacement.button - setTimeout(function(){}, 850)`);
        $('.mapTileContainer.potentialCardPlacement').removeClass('potentialCardPlacement');
        updatePlayersTableauLimits(placedCardRow, placedCardColumn);
    }, 850);
});

let lightingMatches = [];
let showLightingMatchesInterval;
let lightingMatchCount = 0;

function checkLightingMatches(mapID) {
    // console.log(`checkLightingMatches(mapID)`);

    // console.log(`mapID = ${mapID}`);

    lightingMatches = [];
    lightingMatchCount = 0;
    var $card = $(`${mapID} .cardContainer.activePlacement`);
    var cardType = $card.attr('cardtype');
    var thisRow = $card.closest('.mapTileContainer').data('map-row');
    var thisColumn =  $card.closest('.mapTileContainer').data('map-column');

    // console.log(`$card = ${$card}`);
    // console.log(`cardType = ${cardType}`);
    // console.log(`thisRow = ${thisRow}`);
    // console.log(`thisColumn = ${thisColumn}`);

    var plantCardID = '';

    let allNeighbours = findMapNeighbours(parseInt(thisRow), parseInt(thisColumn), oppositeType[cardType], true);

    if(cardType == 'plant') {
        plantCardID = mapID;

        let plantLightingNum = parseInt($card.data('lighting-num'));
        let plantLightingData = $card.data('lighting-types');

        // console.log(`plantLightingNum = ${plantLightingNum}`);
        // console.log(`plantLightingData = ${plantLightingData}`);
        
        let allPlantLighting = [];

        if(plantLightingNum > 1) {
            // console.log(`if plantLightingNum > 1`);
            let splitLightingData = plantLightingData.split(' ');
            // console.log(`splitLightingData`, splitLightingData);
            allPlantLighting.push(...splitLightingData);
        } else if(plantLightingNum == 1){
            // console.log(`plantLightingNum == 1`);
            allPlantLighting.push(plantLightingData);
        }

        // console.log(`allNeighbours`, allNeighbours);
        // console.log(`allPlantLighting`, allPlantLighting);

        for (const [key, value] of Object.entries(allNeighbours)) {

            // console.log(`key = ${key}`);
            // console.log(`value = ${value}`);

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
        // console.log(`cardType == 'room'`);

        // console.log(`allNeighbours`, allNeighbours);

        for (const [key, value] of Object.entries(allNeighbours)) {

            // console.log(`key = ${key}`);
            // console.log(`value = ${value}`);

            let cardPlantPotInfo = $(`${key}.mapTileContainer`).attr('plant-pot');
            // console.log(`cardPlantPotInfo = ${cardPlantPotInfo}`);

            if (typeof cardPlantPotInfo !== typeof undefined && cardPlantPotInfo !== false) {
                if(cardPlantPotInfo != 'none') {
                    continue;
                }
            }

            let touchingLightingIcon = $card.data(`lighting-${value}`);

            let plantLightingNum = parseInt($(`${key}.mapTileContainer .cardContainer`).data('lighting-num'));
            let plantLightingData = $(`${key}.mapTileContainer .cardContainer`).data('lighting-types');

            // console.log(`plantLightingNum = ${plantLightingNum}`);
            // console.log(`plantLightingData = ${plantLightingData}`);

            let allPlantLighting = [];

            if(plantLightingNum > 1) {
                // console.log(`plantLightingNum > 1`);
                let splitLightingData = plantLightingData.split(' ');
                allPlantLighting.push(...splitLightingData);

                // console.log(`splitLightingData`, splitLightingData);

            } else if(plantLightingNum == 1){
                // console.log(`plantLightingNum == 1`);
                allPlantLighting.push(plantLightingData);
            }

            // console.log(`allPlantLighting`, allPlantLighting);

            if(allPlantLighting.indexOf(touchingLightingIcon) !== -1) {
                // console.log(`allPlantLighting.indexOf(touchingLightingIcon) !== -1`);
                lightingMatches.push(
                    [
                        `${mapID}.mapTileContainer .cardContainer .lightingIconContainer-${value} .lightingIcon`, // room = [0] index
                        `${key}.mapTileContainer .cardContainer .verdancyIconsAndVPLayer .verdancyLightingIcon[data-lighting-type="${touchingLightingIcon}"]` // plant = [1] index
                    ]
                );
            }
        };
    }

    // console.log(`lightingMatches = ${lightingMatches}`);

    if(lightingMatches.length !== 0) {
        // console.log(`lightingMatches.length != 0`);
        toggleMapVerdancy('hide');
        setTimeout(function(){  
            // console.log(`checkLightingMatches(mapID) - setTimeout(function(){}, 10)`);
            for (let i = 0; i < lightingMatches.length; i++) {
                let thisPlantCard = lightingMatches[i][1];
                let splitPlantCard = thisPlantCard.split(' ');

                // console.log(`thisPlantCard = ${thisPlantCard}`);
                // console.log(`splitPlantCard`, splitPlantCard);                
                // console.log(`${splitPlantCard[0]} ${splitPlantCard[1]} ${splitPlantCard[2]}`);

                $(`${splitPlantCard[0]} ${splitPlantCard[1]} ${splitPlantCard[2]}`).addClass('showIndividualVerdancyLayer');
            }
        }, 10);
        setTimeout(function(){
            // console.log(`checkLightingMatches(mapID) - setTimeout(function(){}, 720)`);
            showLightingMatchesFunc();
        }, 720);
    } else {
        // console.log(`lightingMatches.length == 0`);
        if(startingPlacement) {
            // console.log(`if startingPlacement`);
            startFirstRound();
        } else {
            // console.log(`!startingPlacement`);
            toggleMapVerdancy('hide');
            $('.showIndividualVerdancyLayer').removeClass('showIndividualVerdancyLayer');
            if($('#chosenItemContainer .itemToken.inactivePlacement').length) {
                // console.log(`$('#chosenItemContainer .itemToken.inactivePlacement').length`);
                $('#chosenItemContainer .itemToken.inactivePlacement').attr('style', '');
                $('#chosenItemContainer .itemToken.inactivePlacement').addClass('activePlacement').removeClass('inactivePlacement');
                checkChosenItemType();
            } else {
                // console.log(`!$('#chosenItemContainer .itemToken.inactivePlacement').length`);
                $('#undoNextRoundBtnContainer #undoAction').removeAttr('disabled');
                activateNextRoundBtn();
            }
        }
    }
}

function showLightingMatchesFunc() {

    completedPlantsThisTurn = [];

    // console.log(`showLightingMatchesFunc()`);
    
    // lightingMatches[0] = room
    // lightingMatches[1] = plant

    // console.log(`lightingMatchCount = ${lightingMatchCount}`);

    let splitPlantCardID = lightingMatches[lightingMatchCount][1].split(' ');
    let plantCardID = splitPlantCardID[0];
    let splitRoomCardID = lightingMatches[lightingMatchCount][0].split(' ');
    let lightingSymbolPos = splitRoomCardID[2].split('-');

    // console.log(`splitPlantCardID`, splitPlantCardID);
    // console.log(`plantCardID = ${plantCardID}`);
    // console.log(`splitRoomCardID`, splitRoomCardID);
    // console.log(`lightingSymbolPos = ${lightingSymbolPos}`);

    // console.log(`${lightingMatches[lightingMatchCount][0]}`);
    // console.log(`${lightingMatches[lightingMatchCount][1]}`);

    $(`${lightingMatches[lightingMatchCount][0]}`).attr('style', `transform-origin: ${lightingSymbolPos[1]}`);
    $(`${lightingMatches[lightingMatchCount][1]}`).attr('style', '');

    $(`${lightingMatches[lightingMatchCount][0]}`).addClass('matchedLighting');
    $(`${lightingMatches[lightingMatchCount][1]}`).addClass('matchedLighting');

    setTimeout(function(){
        // console.log(`showLightingMatchesFunc() - setTimeout(function(){}, 410)`);
        $(`${lightingMatches[lightingMatchCount][0]}.matchedLighting`).addClass('matchedLightingAnimation');
        $(`${lightingMatches[lightingMatchCount][1]}.matchedLighting`).addClass('matchedLightingAnimation');
    }, 410);

    setTimeout(function(){
        // console.log(`showLightingMatchesFunc() - setTimeout(function(){}, 1310)`);
        // let currentVerdancy = $(`${plantCardID}`).addClass('confirmedVerdancyAddition');
        let currentVerdancy = $(`${plantCardID} .cardContainer .verdancyIconsAndVPLayer`).attr('verdancy-completed');

        // console.log(`${plantCardID} .cardContainer .verdancyIconsAndVPLayer .verdancyIconContainer[data-verdancy-icon-num="${currentVerdancy}"]`);
        $(`${plantCardID} .cardContainer .verdancyIconsAndVPLayer .verdancyIconContainer[data-verdancy-icon-num="${currentVerdancy}"]`).addClass('completeVerdancy').removeClass('incompleteVerdancy');

        // console.log(`currentVerdancy = ${currentVerdancy}`);
        currentVerdancy++;
        // console.log(`currentVerdancy = ${currentVerdancy}`);

        // console.log(`${plantCardID} .cardContainer .verdancyIconsAndVPLayer`);
        $(`${plantCardID} .cardContainer .verdancyIconsAndVPLayer`).attr('verdancy-completed', currentVerdancy);
    }, 1310);

    setTimeout(function(){
        // console.log(`showLightingMatchesFunc() - setTimeout(function(){}, 1720)`);
        $(`${lightingMatches[lightingMatchCount][0]}.matchedLighting.matchedLightingAnimation`).removeClass('matchedLightingAnimation');
        $(`${lightingMatches[lightingMatchCount][1]}.matchedLighting.matchedLightingAnimation`).removeClass('matchedLightingAnimation');
    }, 1720);

    setTimeout(function(){
        // console.log(`showLightingMatchesFunc() - setTimeout(function(){}, 2420)`);
        $(`${lightingMatches[lightingMatchCount][0]}.matchedLighting`).removeClass('matchedLighting');
        $(`${lightingMatches[lightingMatchCount][1]}.matchedLighting`).removeClass('matchedLighting');

        lightingMatchCount++;

        // console.log(`lightingMatchCount = ${lightingMatchCount}`);
        // console.log(`lightingMatches.length = ${lightingMatches.length}`);

        // console.log(`lightingMatches`, lightingMatches);

        if(lightingMatchCount < lightingMatches.length) {
            // console.log(`if lightingMatchCount < lightingMatches.length`);
            setTimeout(function(){
                // console.log(`showLightingMatchesFunc() - setTimeout(function(){}, 300)`);
                showLightingMatchesFunc();
            }, 300);
        } else {
            // console.log(`if lightingMatchCount >= lightingMatches.length`);
            if(startingPlacement) {
                // console.log(`if startingPlacement`);
                startFirstRound();
            } else {
                // console.log(`if !startingPlacement`);

                completedPlantsThisTurn = checkForCompletedPlants();

                let nextStageTimeout = 0;
                if(completedPlantsThisTurn.length != 0) {
                    $('.showIndividualVerdancyLayer').removeClass('showIndividualVerdancyLayer');
                    gainPlantPots();
                } else {
                    $('.showIndividualVerdancyLayer').removeClass('showIndividualVerdancyLayer');
                    if($('#chosenItemContainer .itemToken.inactivePlacement').length) {
                        // console.log(`$('#chosenItemContainer .itemToken.inactivePlacement').length`);
                        $('#chosenItemContainer .itemToken.inactivePlacement').attr('style', '');
                        $('#chosenItemContainer .itemToken.inactivePlacement').addClass('activePlacement').removeClass('inactivePlacement');
                        checkChosenItemType();
                    } else {
                        // console.log(`!$('#chosenItemContainer .itemToken.inactivePlacement').length`);
                        $('#undoNextRoundBtnContainer #undoAction').removeAttr('disabled');
                        activateNextRoundBtn();
                    }
                }
            }
        };
    }, 2420);
}


function checkForCompletedPlants() {
    // console.log(`checkForCompletedPlants() func`);
    let completedPlants = [];
    $(`#mapHiddenOverlay .mapTileContainer[cardtype="plant"][plant-pot="none"] .cardContainer .verdancyIconsAndVPLayer`).each(function(){
        let thisID = $(this).closest('.mapTileContainer').attr('id');
        // console.log(`thisID = ${thisID}`);
        // console.log(`$(this).attr('verdancy-icons') = ${$(this).attr('verdancy-icons')}`);
        // console.log(`$(this).attr('verdancy-completed') = ${$(this).attr('verdancy-completed')}`);
        if($(this).attr('verdancy-completed') >= $(this).attr('verdancy-icons')) {
            $(this).closest('.mapTileContainer').addClass('pendingPlantPot');
            // console.log(`thisID = ${thisID}`);
            completedPlants.push(thisID);
        }
    });
    // console.log(`completedPlants`, completedPlants);
    return completedPlants;
}

function gainPlantPots() {
    // console.log(`gainPlantPots() func`);

    toggleMapVerdancy('hide');

    setTimeout(function(){

        let completedPotTickHTML = `
            <div class="completedPotTickContainer completed-plant-tick-animation">
                <img class="completedTickImg" src="img/tick4.png" alt="" />
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
            // console.log(`currentActivePotNum = ${currentActivePotNum}`);

            while(!nextActivePotTrigger) {
                // console.log(`currentActivePotNum = ${currentActivePotNum}`);
                if($(`.availableScoringPlantPot[plant-pot-priority="${currentActivePotNum}"] .plantPotContainer`).length) {
                    // console.log(`$('.availableScoringPlantPot[plant-pot-priority="${currentActivePotNum}"] .plantPotContainer').length == true`);
                    nextActivePotTrigger = true;
                } else {
                    currentActivePotNum++;
                }
                if(currentActivePotNum == 10) break;
            }

            let plantPotType = $(`.availableScoringPlantPot[plant-pot-priority="${currentActivePotNum}"] .plantPotContainer`).data('pot-type');

            $(`#${completedPlantsThisTurn[i]}`).attr('plant-pot', plantPotType);
            // console.log(`plantPotType = ${plantPotType}`);

            let verdancyLayerPlantPointsIcon = `
                <img class="completedVerdancyIcon verdancyLayerImg" src="img/completed-verdancy.png" />
            `;

            $(`#${completedPlantsThisTurn[i]} .verdancyIconsAndVPLayer`).append(verdancyLayerPlantPointsIcon);

            let verdancyLayerPotPoints = `
                <div class="plantPotContainer">
                    <img class="plantPotScoring" src="img/pots/${plantPotType}.png" alt="" />
                </div>
            `;
        
            // console.log('verdancyLayerPotPoints', verdancyLayerPotPoints);
        
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
        auditSwapItemBtnText('swapItems');

        // console.log(`$('#potDiscardPile .potDiscardSlot .plantPotContainer').length = ${$('#potDiscardPile .potDiscardSlot .plantPotContainer').length}`);
        // console.log(`$('#potDiscardPile .potDiscardSlot[data-pot-discard-slot="0"] .plantPotContainer').length = ${$('#potDiscardPile .potDiscardSlot[data-pot-discard-slot="0"] .plantPotContainer').length}`);

        if($('#potDiscardPile .potDiscardSlot .plantPotContainer').length > 0 && !$('#potDiscardPile .potDiscardSlot[data-pot-discard-slot="0"] .plantPotContainer').length) {
            // console.log(`!$('#potDiscardPile .potDiscardSlot[data-pot-discard-slot="0"]').length`);
            removeDiscardPotSpaces(completedPlantsThisTurn.length);
            updateDiscardPotTotal();
        }
        $('.pendingPlantPot').removeClass('pendingPlantPot');
    }, 5500);

}

function removeDiscardPotSpaces(amountOfPots) {
    // console.log(`removeDiscardPotSpaces(${amountOfPots}) func`);

    let amountToShiftPotsUp = 0;

    if($(`#potDiscardPile .potDiscardSlot.availableScoringPlantPot[plant-pot-priority="${amountOfPots}"] .plantPotContainer`).length) {

        // console.log(`$('#potDiscardPile .potDiscardSlot.availableScoringPlantPot[plant-pot-priority="${amountOfPots}"] .plantPotContainer').length = ${$(`#potDiscardPile .potDiscardSlot.availableScoringPlantPot[plant-pot-priority="${amountOfPots}"] .plantPotContainer`).length}`);
        amountToShiftPotsUp = amountOfPots - 1;

    } else if($(`#potDiscardPile .potDiscardSlot.availableScoringPlantPot[plant-pot-priority="${amountOfPots + 1}"] .plantPotContainer`).length) {
        // console.log(`$('#potDiscardPile .potDiscardSlot.availableScoringPlantPot[plant-pot-priority="${amountOfPots + 1}"] .plantPotContainer').length = ${$(`#potDiscardPile .potDiscardSlot.availableScoringPlantPot[plant-pot-priority="${amountOfPots + 1}"] .plantPotContainer`).length}`);
        amountToShiftPotsUp = amountOfPots;
    }

    // console.log(`amountToShiftPotsUp = ${amountToShiftPotsUp}`);
    
    $(`#potDiscardPile .potDiscardSlot.availableScoringPlantPot .plantPotContainer`).each(function(){
        let currentPos = $(this).closest('.potDiscardSlot').data('pot-discard-slot');
        // console.log(`currentPos = ${currentPos}`);

        let newPos = currentPos - amountToShiftPotsUp;
        // console.log(`newPos = ${newPos}`);

        $(this).appendTo(`#potDiscardPile .potDiscardSlot.availableScoringPlantPot[data-pot-discard-slot="${newPos}"]`);
        // console.log(`$(this).appendTo('.potDiscardSlot.availableScoringPlantPot[data-pot-discard-slot="${newPos}"]')`);
    });
}

function updateDiscardPotTotal(){
    let discardPotsNum = $(`#potDiscardPile .potDiscardSlot .plantPotContainer`).length;
    $('#potScoringInfoContainer').attr('discarded-pots', discardPotsNum);
}

function activateNextRoundBtn(){
    // console.log(`activateNextRoundBtn()`);
    
    var nextRoundDisabled = $('#undoNextRoundBtnContainer #nextRound').attr('disabled');
    // console.log(`nextRoundDisabled = ${nextRoundDisabled}`);

    if (typeof nextRoundDisabled !== typeof undefined && nextRoundDisabled !== false) {
        // console.log(`typeof nextRoundDisabled !== typeof undefined && nextRoundDisabled !== false`);
        $('#undoNextRoundBtnContainer #nextRound').removeAttr('disabled');
        $('#undoNextRoundBtnContainer #nextRound').addClass('next-round-animation');
    
        setTimeout(function(){
            // console.log(`activateNextRoundBtn() - setTimeout(function(){}, 2500)`);
            $('#undoNextRoundBtnContainer #nextRound').removeClass('next-round-animation');
        }, 2500);
    }
}

$(document).on(touchEvent,'#undoNextRoundBtnContainer #nextRound',function(){

    lockMap = true;

    // console.log(`'#undoNextRoundBtnContainer #nextRound'`);

    if($(this).hasClass('finalScoring')) {
        finalScoringProcess();
    }

    $('#undoNextRoundBtnContainer #nextRound').attr('disabled', 'disabled');
    $('#addOneVerdancyToPlantBtn').attr('disabled', 'disabled');
    
    $('.confirmedCardPlacement').removeClass('confirmedCardPlacement');
    $('.chosenMarketCard').removeClass('chosenMarketCard');
    $('.placedCard').removeClass('placedCard');
    $('.temporaryItemPlacement').removeClass('temporaryItemPlacement');
    $('.confirmedItemPlacement').removeClass('confirmedItemPlacement');

    $('.activePlacement').removeClass('activePlacement');
    $('.inactivePlacement').removeClass('inactivePlacement');

    $('.chosenMarketItem').removeClass('chosenMarketItem');
    $('.placedItem').removeClass('placedItem');

    $('.chosenMarketCard').removeClass('chosenMarketCard');
    $('.placedCard').removeClass('placedCard');

    $('#useItemBtnContainer .useItemsBtn').attr('disabled', 'disabled');
    $('#useItemBtnContainer').removeClass('showUseItemsBtn');
    $('#swapItemsBtnContainer .swapItemsBtn').attr('disabled', 'disabled');
    
    let marketColumnsNum = $('#marketCardColumns .marketColumn:not(.hiddenColumn)').length;

    let marketElementsLeft = {
        '.marketPlantCardOverlay .cardContainer': [],
        '.marketItemOverlay .itemToken': [],
        '.marketRoomCardOverlay .cardContainer': []
    };

    for (const [key, value] of Object.entries(marketElementsLeft)) {
        for (let i = marketColumnsNum - 1; i >= 0; i--) {
            if($(`.marketColumn[column="${i}"] .cardsAndItemContainer ${key}`).length) {
                // console.log(`$(.marketColumn[column="${i}"] .cardsAndItemContainer ${key}).length`);
                marketElementsLeft[key].push(i);
            }
        }
    };

    $('#viewPotScoringBtn').attr('disabled', 'disabled');
    animateElem($('#tableauSection #undoNextRoundBtnContainer'), 'hideRoundEndOptions');

    let nextRoundProcessTimeout = 10;

    if($('#viewPotScoringBtn').hasClass('hidePotScoringLayer')) {
        // console.log(`$('#viewPotScoringBtn').hasClass('hidePotScoringLayer')`);
        togglePotScoringLayerVisibility('hide');
        nextRoundProcessTimeout = 710;
    };

    setTimeout(function(){
        // console.log(`'#undoNextRoundBtnContainer #nextRound' - setTimeout(function(){}, ${nextRoundProcessTimeout})`);
        swapActiveMainSection();
    }, nextRoundProcessTimeout);


    let endPlant = marketElementsLeft['.marketPlantCardOverlay .cardContainer'][0];
    let secondToLastPlant = marketElementsLeft['.marketPlantCardOverlay .cardContainer'][1];
    let endPlantGreenThumbs = parseInt($(`.marketColumn[column="${endPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs'));
    let clearSecondToLastPlantGreenThumbLimit = false;

    let endRoom = marketElementsLeft['.marketRoomCardOverlay .cardContainer'][0];
    let secondToLastRoom = marketElementsLeft['.marketRoomCardOverlay .cardContainer'][1];
    let endRoomGreenThumbs = parseInt($(`.marketColumn[column="${endRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs'));

    // console.log(`endPlant = ${endPlant}`);
    // console.log(`secondToLastPlant = ${secondToLastPlant}`);
    // console.log(`endPlantGreenThumbs = ${endPlantGreenThumbs}`);
    
    // console.log(`endRoom = ${endRoom}`);
    // console.log(`secondToLastRoom = ${secondToLastRoom}`);
    // console.log(`endRoomGreenThumbs = ${endRoomGreenThumbs}`);

    if(endPlantGreenThumbs > 0 || endRoomGreenThumbs > 0) {
        nextRoundProcessTimeout = nextRoundProcessTimeout + 900;
    }
    
    if(endPlantGreenThumbs > 0) {
        // console.log(`if endPlantGreenThumbs > 0`);

        let secondToLastPlantGreenThumbs = parseInt($(`.marketColumn[column="${secondToLastPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs'));
        let newSecondToLastPlantGreenThumbs = endPlantGreenThumbs + secondToLastPlantGreenThumbs;
        $(`.marketColumn[column="${secondToLastPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs', newSecondToLastPlantGreenThumbs);

        // console.log(`secondToLastPlantGreenThumbs = ${secondToLastPlantGreenThumbs}`);        
        // console.log(`newSecondToLastPlantGreenThumbs = ${newSecondToLastPlantGreenThumbs}`);

        if(endPlantGreenThumbs == 1) {

            $(`.marketColumn[column="${endPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${secondToLastPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${secondToLastPlantGreenThumbs + 1}"]`), 1000);

        } else if(endPlantGreenThumbs == 2){

            $(`.marketColumn[column="${endPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${secondToLastPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${secondToLastPlantGreenThumbs + 1}"]`), 1000);

            $(`.marketColumn[column="${endPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="2"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${secondToLastPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${secondToLastPlantGreenThumbs + 2}"]`), 1000);

        } else if(endPlantGreenThumbs == 3) {

            $(`.marketColumn[column="${endPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${secondToLastPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${secondToLastPlantGreenThumbs + 1}"]`), 1000);

            $(`.marketColumn[column="${endPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="2"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${secondToLastPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${secondToLastPlantGreenThumbs + 2}"]`), 1000);

            $(`.marketColumn[column="${endPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="3"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${secondToLastPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${secondToLastPlantGreenThumbs + 3}"]`), 1000);
            
        }

        if(newSecondToLastPlantGreenThumbs >= 3) {
            nextRoundProcessTimeout = nextRoundProcessTimeout + 1500;

            setTimeout(function(){
                $(`.marketColumn[column="${secondToLastPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer`).addClass(`removeAllGreenThumbs`);
                
            }, 1000);

            setTimeout(function(){
                $(`.marketColumn[column="${secondToLastPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbContainer`).fadeOut();
            }, 2300);

            setTimeout(function(){
                $(`.marketColumn[column="${secondToLastPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbContainer`).remove();
                $(`.marketColumn[column="${secondToLastPlant}"] .marketPlantCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs', '0');
            }, 3300);

            setTimeout(function(){
                $(`.removeAllGreenThumbs`).removeClass(`removeAllGreenThumbs`);
            }, 3500);
        }
        
    } // GREEN THUMB IF STATEMENT END

    if(endRoomGreenThumbs > 0) {
        
        let secondToLastRoomGreenThumbs = parseInt($(`.marketColumn[column="${secondToLastRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs'));
        let newSecondToLastRoomGreenThumbs = endRoomGreenThumbs + secondToLastRoomGreenThumbs;
        $(`.marketColumn[column="${secondToLastRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs', newSecondToLastRoomGreenThumbs);

        // console.log(`if endRoomGreenThumbs > 0`);
        // console.log(`secondToLastRoomGreenThumbs = ${secondToLastRoomGreenThumbs}`); // 0
        // console.log(`newSecondToLastRoomGreenThumbs = ${newSecondToLastRoomGreenThumbs}`); // 2

        if(endRoomGreenThumbs == 1) {

            $(`.marketColumn[column="${endRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${secondToLastRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${secondToLastRoomGreenThumbs + 1}"]`), 1000);

        } else if(endRoomGreenThumbs == 2){

            $(`.marketColumn[column="${endRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${secondToLastRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${secondToLastRoomGreenThumbs + 1}"]`), 1000);

            $(`.marketColumn[column="${endRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="2"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${secondToLastRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${secondToLastRoomGreenThumbs + 2}"]`), 1000);

        } else if(endRoomGreenThumbs == 3) {

            $(`.marketColumn[column="${endRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="1"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${secondToLastRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${secondToLastRoomGreenThumbs + 1}"]`), 1000);

            $(`.marketColumn[column="${endRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="2"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${secondToLastRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${secondToLastRoomGreenThumbs + 2}"]`), 1000);

            $(`.marketColumn[column="${endRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="3"] .newGreenThumbContainer`).parentToAnimate($(`.marketColumn[column="${secondToLastRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbParentContainer[green-thumb-container="${secondToLastRoomGreenThumbs + 3}"]`), 1000);

        }

        if(newSecondToLastRoomGreenThumbs >= 3) {

            nextRoundProcessTimeout = nextRoundProcessTimeout + 1500;

            setTimeout(function(){
                $(`.marketColumn[column="${secondToLastRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer`).addClass(`removeAllGreenThumbs`);
            }, 1000);

            setTimeout(function(){
                $(`.marketColumn[column="${secondToLastRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbContainer`).fadeOut();
            }, 2300);

            setTimeout(function(){
                $(`.marketColumn[column="${secondToLastRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer .newGreenThumbContainer`).remove();
                $(`.marketColumn[column="${secondToLastRoom}"] .marketRoomCardOverlay .cardContainer .newGreenThumbMasterContainer`).attr('total-green-thumbs', '0');
            }, 2800);

            setTimeout(function(){
                $(`.removeAllGreenThumbs`).removeClass(`removeAllGreenThumbs`);
            }, 3000);
        }

        

    } // GREEN THUMB IF STATEMENT END
    

    setTimeout(function(){
        for (const [key, value] of Object.entries(marketElementsLeft)) {
            $(`.marketColumn[column="${value[0]}"] .cardsAndItemContainer ${key}`).attr('style', '');
            $(`.marketColumn[column="${value[0]}"] .cardsAndItemContainer ${key}`).addClass('remove-market-cards-and-item-alt');
        };

    }, 710 + nextRoundProcessTimeout);

    setTimeout(function(){
        // console.log(`'#undoNextRoundBtnContainer #nextRound' - setTimeout(function(){}, ${nextRoundProcessTimeout})`);
        $('.remove-market-cards-and-item-alt').remove();

        let plantsRequiredColumns = [];
        let roomsRequiredColumns = [];

        if($('.marketColumn.lockedInColumn .cardsAndItemContainer .lockedInCardOverlay').hasClass('marketPlantCardOverlay')) {
            // console.log(`if $('.marketColumn.lockedInColumn .cardsAndItemContainer .lockedInCardOverlay').hasClass('marketPlantCardOverlay')`);
            // 1 ROOM + 2 PLANTS TO BE REPLACED!
            plantsRequiredColumns.push('0', '1');
            roomsRequiredColumns.push('0');
        } else if($('.marketColumn.lockedInColumn .cardsAndItemContainer .lockedInCardOverlay').hasClass('marketRoomCardOverlay')) {
            // console.log(`if $('.marketColumn.lockedInColumn .cardsAndItemContainer .lockedInCardOverlay').hasClass('marketRoomCardOverlay')`);
            // 2 ROOMS + 1 PLANT TO BE REPLACED!
            plantsRequiredColumns.push('0');
            roomsRequiredColumns.push('0', '1');
        }

        for (let i = 1; i >= 0; i--) {

            if(plantsRequiredColumns.indexOf(i.toString()) !== -1) {
                // console.log(`plantsRequiredColumns.indexOf(i.toString()) !== -1`);
                let thisPlantCard = allPlantCards.splice(0, 1);                
                let thisPlantCardHTML = generateCard(thisPlantCard[0], 'plant', 'market', 'market');           
                
                // console.log(`thisPlantCard = ${thisPlantCard}`);
                // // console.log(`thisPlantCardHTML = ${thisPlantCardHTML}`);
                // console.log(`.marketColumn[column="${i}"] .cardsAndItemContainer .marketPlantCardOverlay`);

                $(`.marketColumn[column="${i}"] .cardsAndItemContainer .marketPlantCardOverlay`).append(thisPlantCardHTML);
                $(`.marketColumn[column="${i}"] .cardsAndItemContainer .marketPlantCardOverlay .newCardContainer`).addClass('twoColumnOffset startingPosAnimate startingPos');
            }

            let thisItemToken = allItemTokens.splice(0, 1);            
            let thisItemTokenHTML = generateItem(thisItemToken[0], 'market');            

            // console.log(`thisItemToken = ${thisItemToken}`);
            // // console.log(`thisItemTokenHTML = ${thisItemTokenHTML}`);

            // console.log(`.marketColumn[column="${i}"] .cardsAndItemContainer .marketItemOverlay`);

            $(`.marketColumn[column="${i}"] .cardsAndItemContainer .marketItemOverlay`).append(thisItemTokenHTML);
            $(`.marketColumn[column="${i}"] .cardsAndItemContainer .marketItemOverlay .newItemToken`).addClass('twoColumnOffset startingPosAnimate startingPos');

            if(roomsRequiredColumns.indexOf(i.toString()) !== -1) {
                // console.log(`roomsRequiredColumns.indexOf(i.toString()) !== -1`);
                let thisRoomCard = allRoomCards.splice(0, 1);                
                let thisRoomCardHTML = generateCard(thisRoomCard[0], 'room', 'market', 'market');      
                
                // console.log(`thisRoomCard = ${thisRoomCard}`);
                // // console.log(`thisRoomCardHTML = ${thisRoomCardHTML}`);

                // console.log(`.marketColumn[column="${i}"] .cardsAndItemContainer .marketRoomCardOverlay`);

                $(`.marketColumn[column="${i}"] .cardsAndItemContainer .marketRoomCardOverlay`).append(thisRoomCardHTML);
                $(`.marketColumn[column="${i}"] .cardsAndItemContainer .marketRoomCardOverlay .newCardContainer`).addClass('twoColumnOffset startingPosAnimate startingPos');
            }

        }

        let columnOneItemDestination = [];

        if($(`.marketColumn[column="1"] .cardsAndItemContainer .marketItemOverlay .itemToken:not(.newItemToken)`).length) {
            // console.log(`if $(.marketColumn[column="1"] .cardsAndItemContainer .marketItemOverlay .itemToken:not(.newItemToken)).length`);
            if($(`.marketColumn[column="2"] .cardsAndItemContainer .marketItemOverlay .itemToken:not(.newItemToken)`).length) {
                // console.log(`$(.marketColumn[column="2"] .cardsAndItemContainer .marketItemOverlay .itemToken:not(.newItemToken)).length`);
                columnOneItemDestination.push('one', '2');
            } else if($(`.marketColumn[column="0"] .cardsAndItemContainer .marketItemOverlay .itemToken:not(.newItemToken)`).length) {
                // console.log(`$(.marketColumn[column="0"] .cardsAndItemContainer .marketItemOverlay .itemToken:not(.newItemToken)).length`);
                columnOneItemDestination.push('two', '3');
            }
        }

        if($(`.marketColumn[column="2"] .cardsAndItemContainer .marketItemOverlay .itemToken:not(.newItemToken)`).length) {
            // console.log(`if $(.marketColumn[column="2"] .cardsAndItemContainer .marketItemOverlay .itemToken:not(.newItemToken)).length`);
            $(`.marketColumn[column="2"] .cardsAndItemContainer .marketItemOverlay .itemToken:not(.newItemToken)`).addClass(`newItemToken oneColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="3"] .cardsAndItemContainer .marketItemOverlay`);
        }

        if($(`.marketColumn[column="1"] .cardsAndItemContainer .marketItemOverlay .itemToken:not(.newItemToken)`).length) {
            // console.log(`if $(.marketColumn[column="1"] .cardsAndItemContainer .marketItemOverlay .itemToken:not(.newItemToken)).length`);
            $(`.marketColumn[column="1"] .cardsAndItemContainer .marketItemOverlay .itemToken:not(.newItemToken)`).addClass(`newItemToken ${columnOneItemDestination[0]}ColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="${columnOneItemDestination[1]}"] .cardsAndItemContainer .marketItemOverlay`);
        }

        if($(`.marketColumn[column="0"] .cardsAndItemContainer .marketItemOverlay .itemToken:not(.newItemToken)`).length) {
            // console.log(`if $(.marketColumn[column="0"] .cardsAndItemContainer .marketItemOverlay .itemToken:not(.newItemToken)).length`);
            $(`.marketColumn[column="0"] .cardsAndItemContainer .marketItemOverlay .itemToken:not(.newItemToken)`).addClass(`newItemToken twoColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="2"] .cardsAndItemContainer .marketItemOverlay`);
        }

        // console.log(`plantsRequiredColumns.length = ${plantsRequiredColumns.length}`);
        // console.log(`roomsRequiredColumns.length = ${roomsRequiredColumns.length}`);

        if(plantsRequiredColumns.length > roomsRequiredColumns.length) {
            // console.log(`if plantsRequiredColumns.length > roomsRequiredColumns.length`);
            // 2 empty slots in plant row
            // 1 empty slot in room row

            let columnOneCardDestination = [];

            if($(`.marketColumn[column="1"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)`).length) {
                // console.log(`$(.marketColumn[column="1"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)).length`);
                if($(`.marketColumn[column="2"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)`).length) {
                    // console.log(`$(.marketColumn[column="2"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)).length`);
                    columnOneCardDestination.push('one', '2');
                } else if($(`.marketColumn[column="0"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)`).length) {
                    // console.log(`$(.marketColumn[column="0"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)).length`);
                    columnOneCardDestination.push('two', '3');
                }
            }

            if($(`.marketColumn[column="2"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)`).length) {
                // console.log(`$(.marketColumn[column="2"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)).length`);
                $(`.marketColumn[column="2"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)`).addClass(`newCardContainer oneColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="3"] .cardsAndItemContainer .marketPlantCardOverlay`);
            }

            if($(`.marketColumn[column="1"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)`).length) {
                // console.log(`$(.marketColumn[column="1"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)).length`);
                $(`.marketColumn[column="1"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)`).addClass(`newCardContainer ${columnOneCardDestination[0]}ColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="${columnOneCardDestination[1]}"] .cardsAndItemContainer .marketPlantCardOverlay`);
            }

            if($(`.marketColumn[column="0"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)`).length) {
                // console.log(`$(.marketColumn[column="0"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)).length`);
                $(`.marketColumn[column="0"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)`).addClass(`newCardContainer twoColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="2"] .cardsAndItemContainer .marketPlantCardOverlay`);
            }

            $(`.marketColumn[column="2"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)`).addClass(`newCardContainer oneColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="3"] .cardsAndItemContainer .marketRoomCardOverlay`);
            $(`.marketColumn[column="1"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)`).addClass(`newCardContainer oneColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="2"] .cardsAndItemContainer .marketRoomCardOverlay`);
            $(`.marketColumn[column="0"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)`).addClass(`newCardContainer oneColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="1"] .cardsAndItemContainer .marketRoomCardOverlay`);

        } else if(plantsRequiredColumns.length < roomsRequiredColumns.length) {
            // console.log(`if plantsRequiredColumns.length < roomsRequiredColumns.length`);
            // 1 empty slot in plant row
            // 2 empty slots in room row

            let columnOneCardDestination = [];

            if($(`.marketColumn[column="1"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)`).length) {
                // console.log(`$(.marketColumn[column="1"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)).length`);
                if($(`.marketColumn[column="2"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)`).length) {
                    // console.log(`$(.marketColumn[column="2"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)).length`);
                    columnOneCardDestination.push('one', '2');
                } else if($(`.marketColumn[column="0"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)`).length) {
                    // console.log(`$(.marketColumn[column="0"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)).length`);
                    columnOneCardDestination.push('two', '3');
                }
            }

            if($(`.marketColumn[column="2"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)`).length) {
                // console.log(`$(.marketColumn[column="2"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)).length`);
                $(`.marketColumn[column="2"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)`).addClass(`newCardContainer oneColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="3"] .cardsAndItemContainer .marketRoomCardOverlay`);
            }

            if($(`.marketColumn[column="1"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)`).length) {
                // console.log(`$(.marketColumn[column="1"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)).length`);
                $(`.marketColumn[column="1"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)`).addClass(`newCardContainer ${columnOneCardDestination[0]}ColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="${columnOneCardDestination[1]}"] .cardsAndItemContainer .marketRoomCardOverlay`);
            }

            if($(`.marketColumn[column="0"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)`).length) {
                // console.log(`$(.marketColumn[column="0"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)).length`);
                $(`.marketColumn[column="0"] .cardsAndItemContainer .marketRoomCardOverlay .cardContainer:not(.newCardContainer)`).addClass(`newCardContainer twoColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="2"] .cardsAndItemContainer .marketRoomCardOverlay`);
            }

            $(`.marketColumn[column="2"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)`).addClass(`newCardContainer oneColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="3"] .cardsAndItemContainer .marketPlantCardOverlay`);
            $(`.marketColumn[column="1"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)`).addClass(`newCardContainer oneColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="2"] .cardsAndItemContainer .marketPlantCardOverlay`);
            $(`.marketColumn[column="0"] .cardsAndItemContainer .marketPlantCardOverlay .cardContainer:not(.newCardContainer)`).addClass(`newCardContainer oneColumnOffset startingPosAnimate startingPos`).appendTo(`.marketColumn[column="1"] .cardsAndItemContainer .marketPlantCardOverlay`);
        }

        setTimeout(function(){
            // console.log(`'#undoNextRoundBtnContainer #nextRound' - setTimeout(function(){}, ${2400 + nextRoundProcessTimeout})`);
            $('.startingPos').removeClass('startingPos');
        }, 50);

    }, 2400 + nextRoundProcessTimeout);


    setTimeout(function(){
        // console.log(`'#undoNextRoundBtnContainer #nextRound' - setTimeout(function(){}, ${4000 + nextRoundProcessTimeout})`);
        togglePotScoringLayerVisibility('show');
    }, 4000 + nextRoundProcessTimeout);


    setTimeout(function(){
        // console.log(`'#undoNextRoundBtnContainer #nextRound' - setTimeout(function(){}, ${4000 + nextRoundProcessTimeout})`);
        togglePotScoringLayerVisibility('show');
           
        let discardPilePots = $(`#potDiscardPile .potDiscardSlot .plantPotContainer`).length;
        let drawPilePots = $(`#potDrawPile .potDrawSlot .plantPotContainer`).length;

        // console.log(`discardPilePots = ${discardPilePots}`);
        // console.log(`drawPilePots = ${drawPilePots}`);

        let emptyFourthColumnPot = false; 
        if(!$(`#marketCardColumns .marketColumn[column="3"] .plantPotOverlay .plantPotContainer:not(.newPlantPot)`).length) emptyFourthColumnPot = true;
        // console.log(`emptyFourthColumnPot = ${emptyFourthColumnPot}`);

        if(discardPilePots > 0 && !emptyFourthColumnPot) {
            // console.log(`if discardPilePots > 0 && !emptyFourthColumnPot`);
            for (let i = discardPilePots - 1; i >= 0; i--) {
                if($(`#potDiscardPile .potDiscardSlot[data-pot-discard-slot="${i}"] .plantPotContainer:not(.newPlantPot)`).length) {
                    // console.log(`$(#potDiscardPile .potDiscardSlot[data-pot-discard-slot="${i}"] .plantPotContainer:not(.newPlantPot)).length`);
                    $(`#potDiscardPile .potDiscardSlot[data-pot-discard-slot="${i}"] .plantPotContainer:not(.newPlantPot)`).addClass(`newPlantPot discardPileOffset startingPosAnimate startingPos`).appendTo(`#potDiscardPile .potDiscardSlot[data-pot-discard-slot="${(i + 1)}"]`);
                }
            }
        }

        if(!emptyFourthColumnPot) {
            // console.log(`if !emptyFourthColumnPot`);
            // console.log(`if $(#marketCardColumns .marketColumn[column="3"] .plantPotOverlay .plantPotContainer:not(.newPlantPot)).length`);
            $(`#marketCardColumns .marketColumn[column="3"] .plantPotOverlay .plantPotContainer:not(.newPlantPot)`).addClass(`newPlantPot discardPileOffset startingPosAnimate startingPos`).appendTo(`#potDiscardPile .potDiscardSlot[data-pot-discard-slot="0"]`);
        }
        
        $(`#marketCardColumns .marketColumn[column="2"] .plantPotOverlay .plantPotContainer:not(.newPlantPot)`).addClass(`newPlantPot mainPotColumnOffset startingPosAnimate startingPos`).appendTo(`#marketCardColumns .marketColumn[column="3"] .plantPotOverlay`);
        $(`#marketCardColumns .marketColumn[column="1"] .plantPotOverlay .plantPotContainer:not(.newPlantPot)`).addClass(`newPlantPot mainPotColumnOffset startingPosAnimate startingPos`).appendTo(`#marketCardColumns .marketColumn[column="2"] .plantPotOverlay`);
        $(`#marketCardColumns .marketColumn[column="0"] .plantPotOverlay .plantPotContainer:not(.newPlantPot)`).addClass(`newPlantPot mainPotColumnOffset startingPosAnimate startingPos`).appendTo(`#marketCardColumns .marketColumn[column="1"] .plantPotOverlay`);

        $(`#potDrawPile .potDrawSlot[data-pot-draw-slot="0"] .plantPotContainer:not(.newPlantPot)`).addClass(`newPlantPot drawPileOffset startingPosAnimate startingPos`).appendTo(`#marketCardColumns .marketColumn[column="0"] .plantPotOverlay`);

        if(drawPilePots > 1) {
            // console.log(`if drawPilePots > 1`);
            for (let i = 1; i < drawPilePots; i++) {
                if($(`#potDrawPile .potDrawSlot[data-pot-draw-slot="${i}"] .plantPotContainer:not(.newPlantPot)`).length) {
                    // console.log(`$(#potDrawPile .potDrawSlot[data-pot-draw-slot="${i}"] .plantPotContainer:not(.newPlantPot)).length`);
                    $(`#potDrawPile .potDrawSlot[data-pot-draw-slot="${i}"] .plantPotContainer:not(.newPlantPot)`).addClass(`newPlantPot drawPileOffset startingPosAnimate startingPos`).appendTo(`#potDrawPile .potDrawSlot[data-pot-draw-slot="${(i - 1)}"]`);
                }
            }
        }

        setTimeout(function(){
            // console.log(`'#undoNextRoundBtnContainer #nextRound' - setTimeout(function(){}, ${1000})`);
            $('.startingPos').removeClass('startingPos');
        }, 300);

    }, 4700 + nextRoundProcessTimeout);

    setTimeout(function(){
        // console.log(`'#undoNextRoundBtnContainer #nextRound' - setTimeout(function(){}, ${7100 + nextRoundProcessTimeout})`);
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

        togglePotScoringLayerVisibility('hide');
        $('#gameSectionsParent').attr('current-phase', 'market-selection');
        
        $('#turnsRemainingContainer #turnsRemainingInfo.infoBarStatData').fadeOut('slow');
        
    }, 7100 + nextRoundProcessTimeout);

    setTimeout(function(){
        // console.log(`'#undoNextRoundBtnContainer #nextRound' - setTimeout(function(){}, ${7700 + nextRoundProcessTimeout})`);
        turnsRemaining--;
        // console.log(`turnsRemaining = ${turnsRemaining}`);

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

        $('#gameSectionsParent').attr('turns-left', turnsRemaining);
        $('#turnsRemainingContainer #turnsRemainingInfo.infoBarStatData').html(turnsRemaining);
        $('#turnsRemainingContainer #turnsRemainingInfo.infoBarStatData').fadeIn();
    }, 7700 + nextRoundProcessTimeout);

    setTimeout(function(){
        // console.log(`'#undoNextRoundBtnContainer #nextRound' - setTimeout(function(){}, ${8700 + nextRoundProcessTimeout})`);
        let actionRequiredHTML = `
            <div class="actionRequiredContainer">
                <div class="actionRequiredAnimation"></div>
            </div>
        `;
        $('#marketCardColumns .marketColumn .cardsAndItemContainer .cardContainer').append(actionRequiredHTML);
        updateDiscardPotTotal();
        lockMap = false;
    }, 8700 + nextRoundProcessTimeout);

    setTimeout(function(){
        // console.log(`'#undoNextRoundBtnContainer #nextRound' - setTimeout(function(){}, ${10050 + nextRoundProcessTimeout})`);
        $('#marketCardColumns .marketColumn .cardsAndItemContainer .cardContainer .actionRequiredContainer').remove();
    }, 10050 + nextRoundProcessTimeout);

});

function checkChosenItemType(){
    // console.log(`checkChosenItemType()`);

    let itemType = $('.itemToken.activePlacement').attr('item-type');
    // console.log(`itemType = ${itemType}`);

    if(itemType == 'normal') {
        // console.log(`itemType == 'normal'`);
        showPossibleMapPlacements('item');
    } else if(itemType == 'nurture') {
        // console.log(`itemType == 'nurture'`);
        let itemName = $('.itemToken.activePlacement').attr('item-name');
        // console.log(`itemName = ${itemName}`);
        resetPotentialMapPlacements('resetAll');
        
        $('#useItemBtnContainer').addClass('showUseItemsBtn');
        $('#useItemBtnContainer .useItemsBtn').removeAttr('disabled');
        $('#useItemBtnContainer .useItemsBtn').attr('item-to-use', itemName);

        let actionRequiredHTML = `
            <div class="actionRequiredContainer">
                <div class="actionRequiredAnimation"></div>
            </div>
        `;
        $('#useItemBtnContainer').append(actionRequiredHTML);

        setTimeout(function(){
            $('#useItemBtnContainer .actionRequiredContainer').remove();
        }, 1700);

    }

    auditSwapItemBtnText('swapItems');
}


$(document).on(touchEvent,'#useItemBtnContainer .useItemsBtn',function(){    

    toggleMapVerdancy('show');
    $('#verdancyVisibilityContainer').addClass('disableInteraction');
    $('#swapItemsBtnContainer .swapItemsBtn').attr('disabled', 'disabled');

    // console.log(`'#useItemBtnContainer .useItemsBtn'`);

    let thisNurtureItem = $(this).attr('item-to-use');
    if(thisNurtureItem == 'watering-can') thisNurtureItem = 'wateringCan';

    // console.log(`thisNurtureItem = ${thisNurtureItem}`);

    // console.log(`$(#${thisNurtureItem}-instructions).addClass('showInstructions')`);

    $(`#${thisNurtureItem}-instructions`).addClass('showInstructions');
    $('#confirmNurtureItemAction.button').attr('nurture-item-action', thisNurtureItem);

    animateElem($('#mapContainer #nurtureItemOptions'), 'showNurtureItemOptions');

    // function fertilizerInitFunc()
    // function trowelInitFunc()
    // function wateringCanInitFunc()

    eval(`${thisNurtureItem}InitFunc()`);

});

$(document).on(touchEvent,'#cancelNurtureItemAction.button',function(){    
    // console.log(`#cancelNurtureItemAction.button`);

    $('#swapItemsBtnContainer .swapItemsBtn').removeAttr('disabled');

    toggleMapVerdancy('hide');
    $('#verdancyVisibilityContainer').removeClass('disableInteraction');
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
    // console.log(`fertilizerInitFunc()`);
    nurtureItemMapRecipients('plant', 'fertilizer');
}

$(document).on('mouseenter','#mapContainer .mapTileContainer.potentialNurtureItemTarget.fertilizerPotentialTarget',function(){
    // console.log(`'mouseenter','#mapContainer .mapTileContainer.potentialNurtureItemTarget.fertilizerPotentialTarget'`);
    $(this).append(`
        <img class="previewNurtureItemIcon fertilizerItemIcon" src="img/itemsNurture/fertilizer-icon.png" />
    `);
});

$(document).on('mouseleave','#mapContainer .mapTileContainer.potentialNurtureItemTarget.fertilizerPotentialTarget',function(){
    // console.log(`'mouseleave','#mapContainer .mapTileContainer.potentialNurtureItemTarget.fertilizerPotentialTarget'`);
    $('.potentialNurtureItemTarget .fertilizerItemIcon:not(.lockedInIcon)').remove();
});

$(document).on(touchEvent,'#mapContainer .mapTileContainer.potentialNurtureItemTarget.fertilizerPotentialTarget',function(){    
    // console.log(`#mapContainer .mapTileContainer.potentialNurtureItemTarget.fertilizerPotentialTarget`);

    $('.verdancyPulseAnimation').removeClass('verdancyPulseAnimation');

    $('.mapTileContainer.fertilizerPreviewAction .fertilizerItemIcon.lockedInIcon').remove();
    $('.fertilizerPreviewAction').addClass('fertilizerPotentialTarget').removeClass('fertilizerPreviewAction');

    $(this).addClass('fertilizerPreviewAction').removeClass('fertilizerPotentialTarget');
    $('.mapTileContainer.fertilizerPreviewAction .fertilizerItemIcon').addClass('lockedInIcon');

    previewNurtureItemVerdancy($(this), 3);
    $('#nurtureItemOptions #confirmNurtureItemAction').removeAttr('disabled');
});


$(document).on(touchEvent,'#nurtureItemOptions #confirmNurtureItemAction[nurture-item-action="fertilizer"]',function(){
    // console.log('#nurtureItemOptions #confirmNurtureItemAction func()');

    finalizeNurtureItemVerdancy();
    animateElem($('#mapContainer #nurtureItemOptions'), 'hideNurtureItemOptions');

    $('#useItemBtnContainer.showUseItemsBtn').removeClass('showUseItemsBtn');
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
    }, 1900);
    
});

let totalPotentialCardsForTrowelAction = 0;
let plantsCardsSelectedForTrowelAction = 0;

function trowelInitFunc() {

    totalPotentialCardsForTrowelAction = 0;
    plantsCardsSelectedForTrowelAction = 0;

    // console.log(`trowelInitFunc()`);
    nurtureItemMapRecipients('plant', 'trowel');

    totalPotentialCardsForTrowelAction = $('#mapContainer .mapTileContainer.potentialNurtureItemTarget.trowelPotentialTarget').length;

    // console.log(`totalPotentialCardsForTrowelAction = ${totalPotentialCardsForTrowelAction}`);
}


$(document).on('mouseenter','#mapContainer .mapTileContainer.potentialNurtureItemTarget.trowelPotentialTarget',function(){
    // console.log(`'mouseenter','#mapContainer .mapTileContainer.potentialNurtureItemTarget.trowelPotentialTarget'`);
    $(this).append(`
        <img class="previewNurtureItemIcon trowelItemIcon" src="img/itemsNurture/trowel-icon.png" />
    `);
});

$(document).on('mouseleave','#mapContainer .mapTileContainer.potentialNurtureItemTarget.trowelPotentialTarget',function(){
    // console.log(`'mouseleave','#mapContainer .mapTileContainer.potentialNurtureItemTarget.trowelPotentialTarget'`);
    $('.potentialNurtureItemTarget .trowelItemIcon:not(.lockedInIcon)').remove();
});

$(document).on(touchEvent,'#mapContainer .mapTileContainer.potentialNurtureItemTarget.trowelPotentialTarget',function(){    
    // console.log(`#mapContainer .mapTileContainer.potentialNurtureItemTarget.trowelPotentialTarget`);

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
    // console.log('#nurtureItemOptions #confirmNurtureItemAction func()');
    finalizeNurtureItemVerdancy();
    animateElem($('#mapContainer #nurtureItemOptions'), 'hideNurtureItemOptions');
    $('#useItemBtnContainer.showUseItemsBtn').removeClass('showUseItemsBtn');
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
    }, 1900);
});

// WATERING CAN

function wateringCanInitFunc() {
    // console.log(`wateringCanInitFunc()`);
    nurtureItemMapRecipients('room', 'wateringCan');
    $('.mapTileContainer.potentialNurtureItemTarget').addClass('wateringCanPotentialTarget');
}

$(document).on('mouseenter','#mapContainer .mapTileContainer.potentialNurtureItemTarget.wateringCanPotentialTarget',function(){
    // console.log(`'mouseenter','#mapContainer .mapTileContainer.potentialNurtureItemTarget.wateringCanPotentialTarget'`);
    $(this).append(`
        <img class="previewNurtureItemIcon wateringCanItemIcon" src="img/itemsNurture/watering-can-icon.png" />
    `);
});

$(document).on('mouseleave','#mapContainer .mapTileContainer.potentialNurtureItemTarget.wateringCanPotentialTarget',function(){
    // console.log(`'mouseleave','#mapContainer .mapTileContainer.potentialNurtureItemTarget.wateringCanPotentialTarget'`);
    $('.potentialNurtureItemTarget .previewNurtureItemIcon:not(.lockedInIcon)').remove();
});

$(document).on(touchEvent,'#mapContainer .mapTileContainer.potentialNurtureItemTarget.wateringCanPotentialTarget',function(){    
    // console.log(`#mapContainer .mapTileContainer.potentialNurtureItemTarget.wateringCanPotentialTarget`);

    $('.verdancyPulseAnimation').removeClass('verdancyPulseAnimation');
    $('.mapTileContainer.potentialNurtureItemTarget .wateringCanItemIcon.lockedInIcon').remove();

    $('.wateringCanPreviewAction').addClass('wateringCanPotentialTarget').removeClass('wateringCanPreviewAction');

    $(this).addClass('wateringCanPreviewAction').removeClass('wateringCanPotentialTarget');
    $('.mapTileContainer.potentialNurtureItemTarget.wateringCanPreviewAction .wateringCanItemIcon').addClass('lockedInIcon');

    let thisRow = $(this).data('map-row');
    let thisColumn = $(this).data('map-column');

    // console.log(`thisRow = ${thisRow}`);
    // console.log(`thisColumn = ${thisColumn}`);

    let mapNeighbours = findMapNeighbours(thisRow, thisColumn, 'plant', true);
    if(JSON.stringify(mapNeighbours) !== '{}') {
        // console.log(`JSON.stringify(mapNeighbours) !== '{}'`);
        for (const [key, value] of Object.entries(mapNeighbours)) {
            // console.log(`key = ${key}`);
            // console.log(`value = ${value}`);
            $(`${key}`).addClass('wateringCanNurtureItemRecipient');
            previewNurtureItemVerdancy($(`${key}`), 1);
        }
    }

    $('#nurtureItemOptions #confirmNurtureItemAction').removeAttr('disabled');

});

$(document).on(touchEvent,'#nurtureItemOptions #confirmNurtureItemAction[nurture-item-action="wateringCan"]',function(){
    // console.log('#nurtureItemOptions #confirmNurtureItemAction func()');

    finalizeNurtureItemVerdancy();
    animateElem($('#mapContainer #nurtureItemOptions'), 'hideNurtureItemOptions');
    $('#useItemBtnContainer.showUseItemsBtn').removeClass('showUseItemsBtn');
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
    }, 1900);

});


function nurtureItemMapRecipients(cardTypeToActivate, actionType) {
    // console.log(`nurtureItemMapRecipients(${cardTypeToActivate}, ${actionType})`);

    $('.mapTileContainer').each(function(){
        let placedCardType = $(this).attr('cardtype');
        // console.log(`placedCardType = ${placedCardType}`);
        if (typeof placedCardType !== 'undefined' && placedCardType !== false) {
            if($(this).attr('cardtype') == 'plant') {
                if($(this).attr('plant-pot') != 'none') {
                    return true;
                }
            }
            if(placedCardType == cardTypeToActivate) {
                if(actionType == 'wateringCan') {
                    // console.log(`placedCardType == cardTypeToActivate`);
                    $(this).addClass(`potentialNurtureItemTarget ${actionType}PotentialTarget`);
                } else {
                    let totalVerdancy = $(this).find('.verdancyIconsAndVPLayer').attr('verdancy-icons');
                    let currentVerdancy = $(this).find('.verdancyIconsAndVPLayer').attr('verdancy-completed');

                    // console.log(`totalVerdancy = ${totalVerdancy}`);
                    // console.log(`currentVerdancy = ${currentVerdancy}`);

                    if(currentVerdancy < totalVerdancy) {
                        $(this).addClass(`potentialNurtureItemTarget ${actionType}PotentialTarget`);
                    }
                }
            }
        }
    });

    setTimeout(function(){
        // console.log(`'nurtureItemMapRecipients(${cardTypeToActivate}, ${actionType})' - setTimeout(function(){}, 400)`);
        let actionRequiredHTML = `
            <div class="actionRequiredContainer">
                <div class="actionRequiredAnimation"></div>
            </div>
        `;

        $('.mapTileContainer.potentialNurtureItemTarget .cardContainer').append(actionRequiredHTML);
    }, 400);


    setTimeout(function(){
        // console.log(`'nurtureItemMapRecipients(${cardTypeToActivate}, ${actionType})' - setTimeout(function(){}, 2550)`);
        $('.mapTileContainer.potentialNurtureItemTarget .cardContainer .actionRequiredContainer').remove();
    }, 2550);
    
}

function previewNurtureItemVerdancy(thisCard, verdancyToAdd) {
    // console.log(`previewNurtureItemVerdancy(${thisCard}, ${verdancyToAdd})`);
    let verdancyInfo = $(thisCard).find('.verdancyIconsAndVPLayer');
    let totalVerdancy = $(verdancyInfo).attr('verdancy-icons');
    let currentVerdancy = $(verdancyInfo).attr('verdancy-completed');

    // console.log(`verdancyInfo = ${verdancyInfo}`);
    // console.log(`totalVerdancy = ${totalVerdancy}`);
    // console.log(`currentVerdancy = ${currentVerdancy}`);

    let verdancyAddedNum = 0;
    while(currentVerdancy < totalVerdancy) {
        $(verdancyInfo).find(`.verdancyIconContainer[data-verdancy-icon-num="${currentVerdancy}"] .verdancyIconPosContainer .completeVerdancyIcon`).addClass('verdancyPulseAnimation');
        currentVerdancy++;
        verdancyAddedNum++;
        // console.log(`currentVerdancy = ${currentVerdancy}`);
        // console.log(`verdancyAddedNum = ${verdancyAddedNum}`);
        if (verdancyAddedNum == verdancyToAdd) break;
    }
}


function finalizeNurtureItemVerdancy() {
    // console.log('finalizeNurtureItemVerdancy()');

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
            // console.log(`newCompletedVerdancy = ${newCompletedVerdancy}`);
            $(this).attr('verdancy-completed', newCompletedVerdancy);
        });
    }, 800);

    setTimeout(function(){
        completedPlantsThisTurn = checkForCompletedPlants();
        if(completedPlantsThisTurn.length != 0) {
            gainPlantPots();
        } else {
            auditSwapItemBtnText('swapItems');
        }
    }, 1950);

}

$(document).on('mouseenter','#mapContainer .mapTileContainer.potentialItemPlacement.activePotentialItemPlacement:not(.temporaryItemPlacement)',function(){
    // console.log(`'mouseenter','#mapContainer .mapTileContainer.potentialItemPlacement.activePotentialItemPlacement:not(.temporaryItemPlacement)'`);

    if(!lockMap) {
        // console.log(`!lockMap`);
        $(this).addClass('itemPlacementPreview');
        var thisItemTokenContainer = $(this).find('.roomCardItemContainer');
        $('.itemToken.activePlacement').clone().removeClass('activePlacement').appendTo(thisItemTokenContainer);
    }
});

$(document).on('mouseleave','#mapContainer .mapTileContainer.potentialItemPlacement.activePotentialItemPlacement.itemPlacementPreview:not(.temporaryItemPlacement)',function(){
    // console.log(`'mouseleave','#mapContainer .mapTileContainer.potentialItemPlacement.activePotentialItemPlacement.itemPlacementPreview:not(.temporaryItemPlacement)'`);

    if(!lockMap) {
        // console.log(`!lockMap`);
        $('#mapContainer .mapTileContainer.itemPlacementPreview .itemToken').remove();
        $('#mapContainer .mapTileContainer.itemPlacementPreview').removeClass('itemPlacementPreview');
    }
});

$(document).on(touchEvent,'#mapContainer .mapTileContainer.potentialItemPlacement.activePotentialItemPlacement:not(.temporaryItemPlacement)',function(){    
    // console.log(`'#mapContainer .mapTileContainer.potentialItemPlacement.activePotentialItemPlacement:not(.temporaryItemPlacement)'`);

    if(!lockMap) {
        // console.log(`!lockMap`);
        $('#swapItemsBtnContainer .swapItemsBtn').attr('disabled', 'disabled');
        temporarilyLockMap(1000);
        $('#undoNextRoundBtnContainer #undoAction').attr('disabled', 'disabled');
        if($('#mapContainer .mapTileContainer.potentialItemPlacement:not(.temporaryItemPlacement) .roomCardItemContainer .itemToken').length) {
            // console.log(`if $('#mapContainer .mapTileContainer.potentialItemPlacement:not(.temporaryItemPlacement) .roomCardItemContainer .itemToken').length`);
            $('#mapContainer .mapTileContainer.potentialItemPlacement:not(.temporaryItemPlacement) .roomCardItemContainer .itemToken').remove();
        }

        var targID = $(this).attr('id');

        // console.log(`targID = ${targID}`);

        $('.itemToken.activePlacement').parentToAnimate($(`#${targID} .roomCardItemContainer`), 1000);
        
        if($('#mapContainer .mapTileContainer.temporaryItemPlacement').length) {
            // console.log(`if $('#mapContainer .mapTileContainer.temporaryItemPlacement').length`);
            $('#mapContainer .mapTileContainer.temporaryItemPlacement').addClass('activePotentialItemPlacement').removeClass('temporaryItemPlacement');
        }

        $('.itemPlacementPreview').removeClass('itemPlacementPreview');

        setTimeout(function(){
            // console.log(`'#mapContainer .mapTileContainer.potentialItemPlacement.activePotentialItemPlacement:not(.temporaryItemPlacement)' - setTimeout(function(){}, 450)`);
            animateElem($('#mapContainer #placedItemOptions'), 'showItemOptions');
        }, 450);

        setTimeout(function(){
            // console.log(`'#mapContainer .mapTileContainer.potentialItemPlacement.activePotentialItemPlacement:not(.temporaryItemPlacement)' - setTimeout(function(){}, 950)`);
            $(`#${targID}`).removeClass('activePotentialItemPlacement').addClass('temporaryItemPlacement');
        }, 950);
        
    }
});

$(document).on(touchEvent,'#cancelItemPlacement.button',function(){
    // console.log(`'#cancelItemPlacement.button'`);

    animateElem($('#mapContainer #placedItemOptions'), 'hideItemOptions');
    $('.itemToken.activePlacement').parentToAnimate($('#tableauSection #homeContentContainer #playerInfoContainer #chosenItemParentContainer #chosenItemContainer'), 1000);
    resetPotentialMapPlacements('resetItemToPlace');

    setTimeout(function(){
        // console.log(`'#cancelItemPlacement.button' - setTimeout(function(){}, 1000)`);
        $('#undoNextRoundBtnContainer #undoAction').removeAttr('disabled');
    }, 1000);

    setTimeout(function(){
        // console.log(`'#cancelItemPlacement.button' - setTimeout(function(){}, 1050)`);
        auditSwapItemBtnText('swapItems');
    }, 1050);
    
});


$(document).on(touchEvent,'#confirmItemPlacement.button',function(){
    // console.log(`'#confirmItemPlacement.button'`);

    
    currentRoundActionLog.push('item-placement');

    // if($('#viewPotScoringBtn').hasClass('hidePotScoringLayer')) togglePotScoringLayerVisibility('hide');

    let placedMapID = $('.mapTileContainer.temporaryItemPlacement').attr('id');
    let placedItemName = $('.mapTileContainer.temporaryItemPlacement .cardContainer .roomCardItemContainer .itemToken').attr('item-name');

    $(`#${placedMapID} .cardContainer .roomCardItemContainer .itemToken`).addClass('placedItem').removeClass('activePlacement');
    $(`#${placedMapID}`).attr('placed-item', placedItemName);

    // console.log(`placedMapID = ${placedMapID}`);
    // console.log(`placedItemName = ${placedItemName}`);
    // console.log(`#${placedMapID} .cardContainer .roomCardItemContainer .itemToken`);

    animateElem($('#mapContainer #placedItemOptions'), 'hideItemOptions');

    setTimeout(function(){
        // console.log(`'#confirmItemPlacement.button' - setTimeout(function(){}, 50)`);
        $('.mapTileContainer.potentialItemPlacement.temporaryItemPlacement').addClass('confirmedItemPlacement').removeClass('temporaryItemPlacement"');
    }, 50);

    setTimeout(function(){
        // console.log(`'#confirmItemPlacement.button' - setTimeout(function(){}, 60)`);
        resetPotentialMapPlacements('resetAll');
    }, 60);

    setTimeout(function(){
        // console.log(`'#confirmItemPlacement.button' - setTimeout(function(){}, 900)`);
        auditSwapItemBtnText('swapItems');
    }, 900);
});

$(document).on(touchEvent,'#swapItemsBtnContainer .swapItemsBtn',function(){

    $('.activePlacement').addClass('inactivePlacement').removeClass('activePlacement');

    // console.log(`'#swapItemsBtnContainer .swapItemsBtn'`);

    $('#undoNextRoundBtnContainer #nextRound').attr('disabled', 'disabled');
    $('#swapItemsBtnContainer .swapItemsBtn').attr('disabled', 'disabled');
    $('#useItemBtnContainer .useItemsBtn').attr('disabled', 'disabled');
    $('#useItemBtnContainer').removeClass('showUseItemsBtn');

    if($('#chosenItemParentContainer #chosenItemContainer .itemToken:not(.swapAnimation)').length) {
        // console.log(`$('#chosenItemParentContainer #chosenItemContainer .itemToken:not(.swapAnimation)').length`);
        $('#chosenItemParentContainer #chosenItemContainer .itemToken:not(.swapAnimation)').addClass('swapAnimation').parentToAnimate($('#storedItemParentContainer #storedItemContainer'), 1000);
    }

    if($('#storedItemParentContainer #storedItemContainer .itemToken:not(.swapAnimation)').length) {
        // console.log(`$('#storedItemParentContainer #storedItemContainer .itemToken:not(.swapAnimation)').length`);
        $('#storedItemParentContainer #storedItemContainer .itemToken:not(.swapAnimation)').addClass('swapAnimation').parentToAnimate($('#chosenItemParentContainer #chosenItemContainer'), 1000);
    }

    setTimeout(function(){
        // console.log(`'#swapItemsBtnContainer .swapItemsBtn' - setTimeout(function(){}, 1100)`);
        auditSwapItemBtnText('swapItems');
        $('.swapAnimation').removeClass('swapAnimation');
        lockMap = false;
    }, 1100);

});

function auditSwapItemBtnText(mode) {

    $('#addOneVerdancyToPlantBtn').removeClass('disableInteraction');
    $('#useItemBtnContainer .useItemsBtn').removeClass('disableInteraction');
    $('#swapItemsBtnContainer .swapItemsBtn').removeClass('disableInteraction');

    // console.log(`auditSwapItemBtnText(mode)`);
    // console.log(`mode = ${mode}`);

    if($('#chosenItemParentContainer #chosenItemContainer .itemToken').length && $('#storedItemParentContainer #storedItemContainer .itemToken').length) {
        // console.log(`$('#chosenItemParentContainer #chosenItemContainer .itemToken').length && $('#storedItemParentContainer #storedItemContainer .itemToken').length`);

        $('#swapItemsBtnContainer .swapItemsBtn').removeAttr('disabled');
        $('#swapItemsBtnContainer .swapItemsBtn').html('Swap Items <span>&#8597;</span>');
        $('#undoNextRoundBtnContainer #nextRound').attr('disabled', 'disabled');

        if(mode == 'swapItems') {
            // console.log(`if mode == 'swapItems'`);
            if(!$('#chosenItemParentContainer #chosenItemContainer .itemToken').hasClass('activePlacement')) {
                // console.log(`!$('#chosenItemParentContainer #chosenItemContainer .itemToken').hasClass('activePlacement')`);
                $('.activePlacement').addClass('inactivePlacement').removeClass('activePlacement');
                $('#chosenItemParentContainer #chosenItemContainer .itemToken').addClass('activePlacement').removeClass('inactivePlacement');
                checkChosenItemType();
            }
        }
        
    } else if($('#chosenItemParentContainer #chosenItemContainer .itemToken').length && !$('#storedItemParentContainer #storedItemContainer .itemToken').length) {
        // console.log(`$('#chosenItemParentContainer #chosenItemContainer .itemToken').length && !$('#storedItemParentContainer #storedItemContainer .itemToken').length`);

        $('#swapItemsBtnContainer .swapItemsBtn').removeAttr('disabled');
        $('#swapItemsBtnContainer .swapItemsBtn').html('Store Item <span>&#8595;</span>');
        $('#undoNextRoundBtnContainer #nextRound').attr('disabled', 'disabled');

        if(mode == 'swapItems') {
            // console.log(`if mode == 'swapItems'`);
            if(!$('#chosenItemParentContainer #chosenItemContainer .itemToken').hasClass('activePlacement')) {
                // console.log(`!$('#chosenItemParentContainer #chosenItemContainer .itemToken').hasClass('activePlacement')`);
                $('.activePlacement').addClass('inactivePlacement').removeClass('activePlacement');
                $('#chosenItemParentContainer #chosenItemContainer .itemToken').attr('style', '');
                $('#chosenItemParentContainer #chosenItemContainer .itemToken').addClass('activePlacement').removeClass('inactivePlacement');
                checkChosenItemType();
            }
        }

    } else if(!$('#chosenItemParentContainer #chosenItemContainer .itemToken').length && $('#storedItemParentContainer #storedItemContainer .itemToken').length) {
        // console.log(`!$('#chosenItemParentContainer #chosenItemContainer .itemToken').length && $('#storedItemParentContainer #storedItemContainer .itemToken').length`);

        $('#swapItemsBtnContainer .swapItemsBtn').removeAttr('disabled');
        $('#swapItemsBtnContainer .swapItemsBtn').html('Retrieve Item <span>&#8593;</span>');

        if($('#storedItemParentContainer #storedItemContainer .itemToken').hasClass('activePlacement')) {
            $('#storedItemParentContainer #storedItemContainer .itemToken').attr('style', '');
            $('#storedItemParentContainer #storedItemContainer .itemToken').addClass('inactivePlacement').removeClass('activePlacement');
        }

        if(mode == 'swapItems') {
            // console.log(`if mode == 'swapItems'`);
            resetPotentialMapPlacements('resetAll');
            activateNextRoundBtn();
        }

    } else if(!$('#chosenItemParentContainer #chosenItemContainer .itemToken').length && !$('#storedItemParentContainer #storedItemContainer .itemToken').length) {
        // console.log(`!$('#chosenItemParentContainer #chosenItemContainer .itemToken').length && !$('#storedItemParentContainer #storedItemContainer .itemToken').length`);

        if(mode == 'swapItems') {
            // console.log(`if mode == 'swapItems'`);
            $('#swapItemsBtnContainer .swapItemsBtn').attr('disabled', 'disabled');

            resetPotentialMapPlacements('resetAll');
            activateNextRoundBtn();
        }
    }
}

function startFirstRound() {
    // console.log(`startFirstRound()`);
    startingPlacement = false;

    resetPotentialMapPlacements('nextRound');
    setTimeout(function(){
        // console.log(`startFirstRound() - setTimeout(function(){}, 600)`);
        swapActiveMainSection();
    }, 600);
    setTimeout(function(){
        // console.log(`startFirstRound() - setTimeout(function(){}, 1400)`);
        $('#startFirstTurnModal').addClass('is-active');
        $('#gameSectionsParent').attr('current-phase', 'market-selection');

        $('#replaceMarketItemsBtn').removeAttr('disabled');
        $('#chooseAnyMarketCardItemBtn').removeAttr('disabled');
    }, 1400);
};

$(document).on(touchEvent,'#startFirstTurnBtn',function(){    
    // console.log(`'#startFirstTurnBtn'`);

    let actionRequiredHTML = `
        <div class="actionRequiredContainer">
            <div class="actionRequiredAnimation"></div>
        </div>
    `;

    $('#marketCardColumns .marketColumn .cardsAndItemContainer .cardContainer').append(actionRequiredHTML);

    setTimeout(function(){
        // console.log(`'#startFirstTurnBtn' - setTimeout(function(){}, 2150)`);
        $('#marketCardColumns .marketColumn .cardsAndItemContainer .cardContainer .actionRequiredContainer').remove();
    }, 2150);

});

function resetPotentialMapPlacements(mode) {
    // console.log(`resetPotentialMapPlacements(${mode})`);

    toggleMapVerdancy('hide');
    $('.verdancyIconsAndVPLayer.showIndividualVerdancyLayer').removeClass('showIndividualVerdancyLayer');

   if(mode == 'resetCardToPlace'){
        // console.log(`mode == 'resetCardToPlace'`);
        $('.mapTileContainer.temporaryCardPlacement').addClass('activePotentialCardPlacement').removeClass('temporaryCardPlacement');

    } else if(mode == 'resetItemToPlace'){
        // console.log(`mode == 'resetItemToPlace'`);
        $('.mapTileContainer.temporaryItemPlacement').addClass('activePotentialItemPlacement').removeClass('temporaryItemPlacement');

    } else if(mode == 'resetAll'){
        // console.log(`mode == 'resetAll'`);
        if($('.mapTileContainer.potentialCardPlacement').length) {
            // console.log(`if $('.mapTileContainer.potentialCardPlacement').length`);
            $('.mapTileContainer.potentialCardPlacement').addClass('animatingElem mediumTransitionAll');
            setTimeout(function(){
                // console.log(`resetPotentialMapPlacements(mode) - setTimeout(function(){}, 50)`);
                $('.mapTileContainer.activePotentialCardPlacement').removeClass('activePotentialCardPlacement');
            }, 50);
            setTimeout(function(){
                // console.log(`resetPotentialMapPlacements(mode) - setTimeout(function(){}, 800)`);
                $('.mapTileContainer.animatingElem.mediumTransitionAll').removeClass('animatingElem mediumTransitionAll');
            }, 800);
            setTimeout(function(){
                // console.log(`resetPotentialMapPlacements(mode) - setTimeout(function(){}, 850)`);
                $('.mapTileContainer.potentialCardPlacement').removeClass('potentialCardPlacement');
            }, 850);

        }

        if($('.mapTileContainer.potentialItemPlacement').length) {
            // console.log(`if IF STATEMENT`);
            $('.mapTileContainer.potentialItemPlacement.activePotentialItemPlacement .roomCardItemContainer').addClass('animatingElem mediumTransitionAll');
            setTimeout(function(){
                // console.log(`resetPotentialMapPlacements(mode) - setTimeout(function(){}, 50)`);
                $('.mapTileContainer.potentialItemPlacement.activePotentialItemPlacement').removeClass('activePotentialItemPlacement');
            }, 50);
            setTimeout(function(){
                // console.log(`resetPotentialMapPlacements(mode) - setTimeout(function(){}, 800)`);
                $('.mapTileContainer.potentialItemPlacement .roomCardItemContainer.animatingElem.mediumTransitionAll').removeClass('animatingElem mediumTransitionAll');
            }, 800);

            setTimeout(function(){
                // console.log(`resetPotentialMapPlacements(mode) - setTimeout(function(){}, 850)`);
                $('.mapTileContainer.potentialItemPlacement').removeClass('potentialItemPlacement');
            }, 850);

        }

    } else if(mode == 'nextRound') {
        // console.log(`mode == 'nextRound'`);
        finalizeMapPlacement('card');
    }
}

function finalizeMapPlacement(mode) {
    // console.log(`finalizeMapPlacement(${mode})`);

    if(mode =='card') {
        // console.log(`mode =='card'`);
        let placedCardType = $('.mapTileContainer .cardContainer.activePlacement').attr('cardtype');
        let mapElID = $('.mapTileContainer .cardContainer.activePlacement').closest('.mapTileContainer').attr('id');
        $(`#${mapElID}`).attr('cardtype', placedCardType);

        let thisRow = $(`#${mapElID}`).data('map-row'); //data-map-row
        let thisColumn = $(`#${mapElID}`).data('map-column'); //data-map-column

        updatePlayersTableauLimits(thisRow, thisColumn);

        // console.log(`placedCardType = ${placedCardType}`);
        // console.log(`mapElID = ${mapElID}`);

        $('.mapTileContainer .cardContainer.activePlacement').removeClass('activePlacement');
        $('.mapTileContainer.temporaryCardPlacement').removeClass('temporaryCardPlacement');

        $('.mapTileContainer.activePotentialCardPlacement').addClass('animatingElem mediumTransitionAll');

        setTimeout(function(){
            // console.log(`finalizeMapPlacement(mode) - setTimeout(function(){}, 50)`);
            $('.mapTileContainer.activePotentialCardPlacement').removeClass('activePotentialCardPlacement');
        }, 50);
        
        setTimeout(function(){
            // console.log(`finalizeMapPlacement(mode) - setTimeout(function(){}, 800)`);
            $('.mapTileContainer.animatingElem.mediumTransitionAll').removeClass('animatingElem mediumTransitionAll');
        }, 800);

        setTimeout(function(){
            // console.log(`finalizeMapPlacement(mode) - setTimeout(function(){}, 850)`);
            $('.mapTileContainer.potentialCardPlacement').removeClass('potentialCardPlacement');
        }, 850);
    }
}

function updatePlayersTableauLimits(cardRow, cardColumn) {
    // console.log(`updatePlayersTableauLimits(${cardRow}, ${cardColumn}) func`);

    let columnRowChanges = false;

    // console.log(`placedCardsRange.rows.low = ${placedCardsRange.rows.low}`);
    // console.log(`cardRow = ${cardRow}`);
    if(cardRow < placedCardsRange.rows.low) {
        // console.log(`!CHANGE DETECTED!`);
        // console.log(`cardRow < placedCardsRange.rows.low`);
        placedCardsRange.rows.low = cardRow;
        columnRowChanges = 'row';
    }
    
    // console.log(`placedCardsRange.rows.high = ${placedCardsRange.rows.high}`);
    // console.log(`cardRow = ${cardRow}`);
    if(cardRow > placedCardsRange.rows.high) {
        // console.log(`!CHANGE DETECTED!`);
        // console.log(`cardRow > placedCardsRange.rows.high`);
        placedCardsRange.rows.high = cardRow;
        columnRowChanges = 'row';
    }

    // console.log(`placedCardsRange.columns.low = ${placedCardsRange.columns.low}`);
    // console.log(`cardColumn = ${cardColumn}`);
    if(cardColumn < placedCardsRange.columns.low) {
        // console.log(`!CHANGE DETECTED!`);
        // console.log(`cardColumn < placedCardsRange.columns.low`);
        placedCardsRange.columns.low = cardColumn;
        columnRowChanges = 'column';
    }

    // console.log(`placedCardsRange.columns.high = ${placedCardsRange.columns.high}`);
    // console.log(`cardColumn = ${cardColumn}`);
    if(cardColumn > placedCardsRange.columns.high) {
        // console.log(`!CHANGE DETECTED!`);
        // console.log(`cardColumn > placedCardsRange.columns.high`);
        placedCardsRange.columns.high = cardColumn;
        columnRowChanges = 'column';
    }

    // console.log(`columnRowChanges = ${columnRowChanges}`);

    if(columnRowChanges == 'row' || columnRowChanges == 'column') {
        checkPlayersTableauLimits(columnRowChanges);
    } 

}

function checkPlayersTableauLimits(limitToChange) {
    // console.log(`checkPlayersTableauLimits(${limitToChange}) func`);

    if(limitToChange == 'row') {
        // console.log(`placedCardsRange.rows.high = ${placedCardsRange.rows.high}`);
        // console.log(`placedCardsRange.rows.low = ${placedCardsRange.rows.low}`);
    
        // console.log(`placedCardsRange.rows.currentRange (OLD) = ${placedCardsRange.rows.currentRange}`);
        placedCardsRange.rows.currentRange = (placedCardsRange.rows.high - placedCardsRange.rows.low) + 1;
        // console.log(`placedCardsRange.rows.currentRange (NEW) = ${placedCardsRange.rows.currentRange}`);
    
        // console.log(`placedCardsRange.rows.limit = ${placedCardsRange.rows.limit}`);
        if(placedCardsRange.rows.currentRange >= placedCardsRange.rows.limit) placedCardsRange.rows.locked = true;
    } else if(limitToChange == 'column') {
        // console.log(`placedCardsRange.columns.high = ${placedCardsRange.columns.high}`);
        // console.log(`placedCardsRange.columns.low = ${placedCardsRange.columns.low}`);
    
        // console.log(`placedCardsRange.columns.currentRange (OLD) = ${placedCardsRange.columns.currentRange}`);
        placedCardsRange.columns.currentRange = (placedCardsRange.columns.high - placedCardsRange.columns.low) + 1;
        // console.log(`placedCardsRange.columns.currentRange (NEW) = ${placedCardsRange.columns.currentRange}`);
    
        // console.log(`placedCardsRange.columns.limit = ${placedCardsRange.columns.limit}`);
        if(placedCardsRange.columns.currentRange >= placedCardsRange.columns.limit) placedCardsRange.columns.locked = true;
    }



}

$(document).on(touchEvent,'#mapContainer #verdancyVisibilityContainer:not(.disableVerdancyVisibility)',function(){    
    // console.log(`'#mapContainer #verdancyVisibilityContainer:not(.disableVerdancyVisibility)`);
    toggleMapVerdancy('none');
});

function toggleMapVerdancy(mode) {
    // console.log(`toggleMapVerdancy(${mode})`);
    // console.log(`mapVerdancyVisible = ${mapVerdancyVisible}`);

    if(mode != 'none') {
        // console.log(`mode != 'none'`);
        if(mode == 'show') {
            // console.log(`if mode == 'show'`);
            mapVerdancyVisible = true
        } else if(mode == 'hide') {
            // console.log(`if mode == 'hide'`);
            mapVerdancyVisible = false
        }
        // console.log(`mapVerdancyVisible = ${mapVerdancyVisible}`);
    } else {
        // console.log(`mode == 'none'`);
        !mapVerdancyVisible ? mapVerdancyVisible = true : mapVerdancyVisible = false;
    }

    // console.log(`mapVerdancyVisible = ${mapVerdancyVisible}`);

    if(mapVerdancyVisible) {
        // console.log(`mapVerdancyVisible`);
        $('#verdancyVisibilityContainer').addClass('hideVerdancy').removeClass('showVerdancy');
        $('#mapHiddenOverlay').addClass('showVerdancyLayer');
    } else if(!mapVerdancyVisible) {
        // console.log(`!mapVerdancyVisible`);
        $('#verdancyVisibilityContainer').addClass('showVerdancy').removeClass('hideVerdancy');
        $('#mapHiddenOverlay').removeClass('showVerdancyLayer');
    }
}

function temporarilyLockMap(timePeriod) {
    // console.log(`temporarilyLockMap(${timePeriod})`);

	lockMap = true;
    $('#mapContainer').addClass('mapLocked');
	setTimeout(function(){
        // console.log(`temporarilyLockMap(timePeriod) - setTimeout(function(){}, ${timePeriod})`);
        $('#mapContainer').removeClass('mapLocked');
		lockMap = false;
	}, timePeriod);
}

function processMapMovement(thisDirection){
    // console.log(`processMapMovement(${thisDirection})`);

    $('#mapContainer .mapTileContainer.potentialCardPlacement.cardPlacementPreview:not(.temporaryCardPlacement) .cardContainer').remove();
    $('.cardPlacementPreview').removeClass('cardPlacementPreview');

	if(thisDirection == 'up' || thisDirection == 'down') {	
        // console.log(`thisDirection == 'up' || thisDirection == 'down'`);
		if(thisDirection == 'up') {
            // console.log(`if thisDirection == 'up'`);
			mapMoveAmount.cardPos.top++;
		} else if(thisDirection == 'down') {	
            // console.log(`thisDirection == 'down'`);
			mapMoveAmount.cardPos.top--;
		}
		// checkMapLimits('vertical', thisDirection, mapMoveAmount.cardPos.top);
        checkMapLimits();
		updateMapPosition('vertical');
	}

	if(thisDirection == 'left' || thisDirection == 'right') {
        // console.log(`thisDirection == 'left' || thisDirection == 'right'`);	
		if(thisDirection == 'left') {
            // console.log(`if thisDirection == 'left'`);
			mapMoveAmount.cardPos.left++;
		} else if(thisDirection == 'right') {	
            // console.log(`thisDirection == 'right'`);
			mapMoveAmount.cardPos.left--;
		}
		// checkMapLimits('horizontal', thisDirection, mapMoveAmount.cardPos.left);
        checkMapLimits();
		updateMapPosition('horizontal');
	}

	$(`#mapNavControls #${thisDirection}Arrow`).addClass('activeArrow');
	setTimeout(function(){
        // console.log(`processMapMovement(${thisDirection}) - setTimeout(function(){}, 100)`);
		$('.activeArrow').removeClass('activeArrow');
	}, 100);
}

function updateMapPosition(moveDirection) {
    // console.log(`updateMapPosition(${moveDirection})`);

	if(moveDirection == 'horizontal') {
        // console.log(`moveDirection == 'horizontal'`);
		let newLeftPosNum = (mapMoveAmount.cardPos.left * mapMoveAmount.view[currentView].zoomIncs[zoomLevel].horizontal);
		let newLeftPos = newLeftPosNum + mapMoveAmount.view[currentView].unit;
		$('#mapContainer #mapHiddenOverlay').css('left', newLeftPos);
        // animateMap(startTop, startLeft, endTop, endLeft);
	} else if(moveDirection == 'vertical') {
        // console.log(`moveDirection == 'vertical'`);
		let newTopPosNum = (mapMoveAmount.cardPos.top * mapMoveAmount.view[currentView].zoomIncs[zoomLevel].vertical);
		let newTopPos = newTopPosNum + mapMoveAmount.view[currentView].unit;
		$('#mapContainer #mapHiddenOverlay').css('top', newTopPos);
        // animateMap(startTop, startLeft, endTop, endLeft);
	}
}

function checkMapLimits(){
    // console.log(`checkMapLimits()`);
    
    for (let i = 0; i < allDirections.length; i++) {
        if(allDirections[i] == 'up' || allDirections[i] == 'down') {
            // console.log(`if allDirections[i] == 'up' || allDirections[i] == 'down'`);
            if(mapMoveAmount.cardPos.top == mapStats.viewableTileLimits[allDirections[i]]) {
                // console.log(`mapMoveAmount.cardPos.top == mapStats.viewableTileLimits[allDirections[i]]`);
                mapStats.directionStatus[allDirections[i]] = 'mapLimit-locked';
                $(`#mapNavControls #${allDirections[i]}Arrow`).hide();
            } else {
                // console.log(`mapMoveAmount.cardPos.top != mapStats.viewableTileLimits[allDirections[i]]`);
                mapStats.directionStatus[allDirections[i]] = 'unlocked';
                $(`#mapNavControls #${[allDirections[i]]}Arrow`).show();
            }
        } else if(allDirections[i] == 'left' || allDirections[i] == 'right') {
            // console.log(`if allDirections[i] == 'left' || allDirections[i] == 'right'`);
            if(mapMoveAmount.cardPos.left == mapStats.viewableTileLimits[allDirections[i]]) {
                // console.log(`mapMoveAmount.cardPos.left == mapStats.viewableTileLimits[allDirections[i]]`);
                $(`#mapNavControls #${allDirections[i]}Arrow`).hide();
                mapStats.directionStatus[allDirections[i]] = 'mapLimit-locked';
            } else {
                // console.log(`mapMoveAmount.cardPos.left != mapStats.viewableTileLimits[allDirections[i]]`);
                mapStats.directionStatus[allDirections[i]] = 'unlocked';
                $(`#mapNavControls #${[allDirections[i]]}Arrow`).show();
            }
        }
    }
}

$(document).on(touchEvent,'#mapZoomControls .zoomIcon.activeZoom',function(){
    // console.log(`'#mapZoomControls .zoomIcon.activeZoom'`);


	if(!lockFunction) {
        // console.log(`!lockFunction`);
		lockFunction = true;
		setTimeout(function(){
            // console.log(`FUNC - setTimeout(function(){}, 220)`);
			lockFunction = false;
		}, 220);
		let zoomOption = $(this).data('zoom-mode');
		configureNewZoom(zoomOption)
	}
});

function configureNewZoom(zoomMode) {

    $('#mapContainer .mapTileContainer.potentialCardPlacement.cardPlacementPreview:not(.temporaryCardPlacement) .cardContainer').remove();
    $('.cardPlacementPreview').removeClass('cardPlacementPreview');

    // console.log(`configureNewZoom(${zoomMode})`);

    let zoomInLimit = 13;
	let zoomOutLimit = 4;

    zoomMode == 'zoomIn' ? zoomLevel++ : zoomLevel--;

    // console.log(`zoomInLimit = ${zoomInLimit}`);
    // console.log(`zoomOutLimit = ${zoomOutLimit}`);
    // console.log(`zoomMode = ${zoomMode}`);
    // console.log(`zoomLevel = ${zoomLevel}`);

    if(zoomLevel == zoomInLimit) {
        // console.log(`zoomLevel == zoomInLimit`);
        $('#mapZoomControls .zoomInIcon').removeClass('activeZoom').addClass('inactiveZoom');
        $('#mapZoomControls .zoomInIcon').attr('src', 'img/map/zoomIn-inactive.png')
    } else if(zoomLevel == zoomOutLimit) {
        // console.log(`zoomLevel == zoomOutLimit`);
        $('#mapZoomControls .zoomOutIcon').attr('src', 'img/map/zoomOut-inactive.png')
        $('#mapZoomControls .zoomOutIcon').removeClass('activeZoom').addClass('inactiveZoom');
    } else {
        if(zoomLevel < zoomInLimit) {
            // console.log(`if zoomLevel < zoomInLimit`);
            if($('#mapZoomControls .zoomInIcon').hasClass('inactiveZoom')) {
                // console.log(`$('#mapZoomControls .zoomInIcon').hasClass('inactiveZoom')`);
                $('#mapZoomControls .zoomInIcon').removeClass('inactiveZoom').addClass('activeZoom');
                $('#mapZoomControls .zoomInIcon').attr('src', 'img/map/zoomIn.png')
            }
        }
        if(zoomLevel > zoomOutLimit) {
            // console.log(`if zoomLevel > zoomOutLimit`);
            if($('#mapZoomControls .zoomOutIcon').hasClass('inactiveZoom')) {
                // console.log(`$('#mapZoomControls .zoomOutIcon').hasClass('inactiveZoom')`);
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
    // console.log(`setZoom(${newZoom}, ${el})`);


	let transformOriginPercentages = '';

	if(currentView == 'desktopView') {
        // console.log(`currentView == 'desktopView'`);
		transformOriginPercentages = '50% 50%';
	} else if(currentView == 'mobileView') {
        // console.log(`currentView == 'mobileView'`);
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
    // console.log(`showPossibleMapPlacements(${type})`);

    let showPlacementsTimeout = 10;

    if(type == 'card' && !$('.potentialCardPlacement').length) {
        // console.log(`type == 'card' && !$('.potentialCardPlacement').length`);
        if($('.potentialItemPlacement').length) {
            // console.log(`if $('.potentialItemPlacement').length`);
            resetPotentialMapPlacements('resetAll');
            showPlacementsTimeout = 810;
        }

        setTimeout(function(){
            // console.log(`showPossibleMapPlacements(${type}) - setTimeout(function(){}, ${showPlacementsTimeout})`);
            let cardTypeToPlace = $('.cardContainer.activePlacement').attr('cardtype');
            // console.log(`cardTypeToPlace = ${cardTypeToPlace}`);
            checkPotentialCardPlacements(cardTypeToPlace, 'showPossibleMapPlacements');
            showPotentialCardPlacements();
        }, showPlacementsTimeout);

        
    } else if(type == 'item' && !$('.potentialItemPlacement').length) {
        // console.log(`type == 'item' && !$('.potentialItemPlacement').length`);
        if($('.potentialCardPlacement').length) {
            // console.log(`if $('.potentialCardPlacement').length`);
            resetPotentialMapPlacements('resetAll');
            showPlacementsTimeout = 810;
        }

        setTimeout(function(){
            // console.log(`showPossibleMapPlacements(${type}) - setTimeout(function(){}, ${0 + showPlacementsTimeout})`);
            $('.mapTileContainer[cardtype="room"][placed-item="none"]').addClass('potentialItemPlacement');
        }, 0 + showPlacementsTimeout);

        setTimeout(function(){
            // console.log(`showPossibleMapPlacements(${type}) - setTimeout(function(){}, ${10 + showPlacementsTimeout})`);
            $('.mapTileContainer.potentialItemPlacement .roomCardItemContainer').addClass('animatingElem mediumTransitionAll');
        }, 10 + showPlacementsTimeout);

        setTimeout(function(){
            // console.log(`showPossibleMapPlacements(${type}) - setTimeout(function(){}, ${20 + showPlacementsTimeout})`);
            $('.mapTileContainer.potentialItemPlacement').addClass('activePotentialItemPlacement');
        }, 20 + showPlacementsTimeout);

        setTimeout(function(){
            // console.log(`showPossibleMapPlacements(${type}) - setTimeout(function(){}, ${100 + showPlacementsTimeout})`);
            let actionRequiredHTML = `
                <div class="actionRequiredContainer">
                    <div class="actionRequiredAnimation"></div>
                </div>
            `;

            $('.mapTileContainer.potentialItemPlacement.activePotentialItemPlacement .roomCardItemContainer').append(actionRequiredHTML);
        }, 100 + showPlacementsTimeout);

        setTimeout(function(){
            // console.log(`showPossibleMapPlacements(${type}) - setTimeout(function(){}, ${800 + showPlacementsTimeout})`);
            $('.mapTileContainer.potentialItemPlacement.activePotentialItemPlacement .roomCardItemContainer.animatingElem.mediumTransitionAll').removeClass('animatingElem mediumTransitionAll');
            lockMap = false;
        }, 800 + showPlacementsTimeout);

        setTimeout(function(){
            // console.log(`showPossibleMapPlacements(${type}) - setTimeout(function(){}, ${2250 + showPlacementsTimeout})`);
            $('.mapTileContainer.potentialItemPlacement.activePotentialItemPlacement .roomCardItemContainer .actionRequiredContainer').remove();
        }, 2250 + showPlacementsTimeout);
    }
}

let validNeighbourIDs = [];
let mapNeighbours = [];

function checkPotentialCardPlacements(currentCardType, mode) {

    // mode = marketCardSelection
    // mode = showPossibleMapPlacements

    // console.log(`checkPotentialCardPlacements(${currentCardType}, ${mode})`);

    validNeighbourIDs = [];
    $('.mapTileContainer').each(function(){
        let placedCardType = $(this).attr('cardtype');
        if (typeof placedCardType !== 'undefined' && placedCardType !== false) {
            if(placedCardType == oppositeType[currentCardType]) {
                // console.log(`placedCardType == oppositeType[currentCardType]`);
                // console.log(`${placedCardType} == oppositeType[${currentCardType}]`);
                mapNeighbours = [];
                mapNeighbours = findMapNeighbours($(this).data('map-row'), $(this).data('map-column'), 'empty', false);
                if(mapNeighbours.length != 0) {
                    validNeighbourIDs.push(...mapNeighbours);
                }
            }
        }
    });

    if(mapNeighbours.length == 0) {
        return false;
    } else {
        // For the validation to take place before picking a card from the market, there just needs to be any value in 'mapNeighbours' for the code to know there's at least one valid placement for the cardtype picked

        // console.log(`mapNeighbours`, mapNeighbours);
        let uniquePlacementIDs = validNeighbourIDs.filter(onlyUnique);
        // console.log(`uniquePlacementIDs`, uniquePlacementIDs);
        // // console.log(`uniquePlacementIDs: `, uniquePlacementIDs);
        for (let i = 0; i < uniquePlacementIDs.length; i++) {
            $(`${uniquePlacementIDs[i]}`).addClass('pendingPotentialCardPlacement');
        }

        return true;
    }

}

function showPotentialCardPlacements(){

    $('.mapTileContainer.pendingPotentialCardPlacement').addClass('animatingElem mediumTransitionAll').removeClass('pendingPotentialCardPlacement');
    
    setTimeout(function(){
        // console.log(`showPotentialCardPlacements() - setTimeout(function(){}, 10)`);
        $('.mapTileContainer.animatingElem.mediumTransitionAll').addClass('potentialCardPlacement');
    }, 10);

    setTimeout(function(){
        // console.log(`showPotentialCardPlacements() - setTimeout(function(){}, 20)`);
        $('.mapTileContainer.animatingElem.mediumTransitionAll.potentialCardPlacement').addClass('activePotentialCardPlacement');
    }, 20);

    setTimeout(function(){
        // console.log(`showPotentialCardPlacements() - setTimeout(function(){}, 100)`);
        let actionRequiredHTML = `
            <div class="actionRequiredContainer">
                <div class="actionRequiredAnimation"></div>
            </div>
        `;

        $('.mapTileContainer.animatingElem.mediumTransitionAll.potentialCardPlacement.activePotentialCardPlacement').append(actionRequiredHTML);
    }, 100);

    setTimeout(function(){
        // console.log(`showPotentialCardPlacements() - setTimeout(function(){}, 800)`);
        $('.mapTileContainer.animatingElem.mediumTransitionAll.potentialCardPlacement.activePotentialCardPlacement').removeClass('animatingElem mediumTransitionAll');
    }, 800);

    setTimeout(function(){
        // console.log(`showPotentialCardPlacements() - setTimeout(function(){}, 2250)`);
        $('.mapTileContainer.potentialCardPlacement.activePotentialCardPlacement .actionRequiredContainer').remove();
    }, 2250);
}

function findMapNeighbours(thisRow, thisColumn, criteria, returnPositions){
    // console.log(`findMapNeighbours(${thisRow}, ${thisColumn}, ${criteria}, ${returnPositions})`);
    
    // placedCardsRange.rows.currentRange = placedCardsRange.rows.high - placedCardsRange.rows.low;
    // placedCardsRange.columns.currentRange = placedCardsRange.columns.high - placedCardsRange.columns.low;

    // if(placedCardsRange.rows.currentRange >= placedCardsRange.rows.limit) placedCardsRange.rows.locked = true;
    // if(placedCardsRange.columns.currentRange >= placedCardsRange.columns.limit) placedCardsRange.columns.locked = true;

    // console.log('placedCardsRange', placedCardsRange);

    let allMapNeighbours = [];

    // console.log(`thisRow = ${thisRow}`);
    // console.log(`placedCardsRange.rows.low = ${placedCardsRange.rows.low}`);
    // console.log(`placedCardsRange.rows.high = ${placedCardsRange.rows.high}`);

    // console.log(`thisColumn = ${thisColumn}`);
    // console.log(`placedCardsRange.columns.low = ${placedCardsRange.columns.low}`);
    // console.log(`placedCardsRange.columns.high = ${placedCardsRange.columns.high}`);

    // let lightingContainerPositions = ['top', 'right', 'bottom', 'left'];

    if(criteria == 'empty') {
        // console.log(`if criteria == 'empty'`);
        
        if(placedCardsRange.rows.locked) {
            // console.log(`if placedCardsRange.rows.locked`);
            if((thisRow - 1) >= placedCardsRange.rows.low) {
                // console.log(`if thisRow >= placedCardsRange.rows.low`);
                allMapNeighbours.push(`#row-${thisRow - 1}-column-${thisColumn}`);
            }
        } else {
            // console.log(`if !placedCardsRange.rows.locked`);
            allMapNeighbours.push(`#row-${thisRow - 1}-column-${thisColumn}`);
        }
    
        if(placedCardsRange.columns.locked) {
            // console.log(`if placedCardsRange.columns.locked`);
            if ((thisColumn + 1) <= placedCardsRange.columns.high) {
                // console.log(`if thisColumn <= placedCardsRange.columns.high`);
                allMapNeighbours.push(`#row-${thisRow}-column-${thisColumn + 1}`);
            }
        } else {
            // console.log(`if !placedCardsRange.columns.locked`);
            allMapNeighbours.push(`#row-${thisRow}-column-${thisColumn + 1}`);
        }
    
        if(placedCardsRange.rows.locked) {
            // console.log(`if placedCardsRange.rows.locked`);
            if ((thisRow + 1) <= placedCardsRange.rows.high) {
                // console.log(`if thisRow <= placedCardsRange.rows.high`);
                allMapNeighbours.push(`#row-${thisRow + 1}-column-${thisColumn}`);
            }
        } else {
            // console.log(`if !placedCardsRange.rows.locked`);
            allMapNeighbours.push(`#row-${thisRow + 1}-column-${thisColumn}`);
        }
    
        if(placedCardsRange.columns.locked) {
            // console.log(`if placedCardsRange.columns.locked`);
            if((thisColumn - 1) >= placedCardsRange.columns.low) {
                // console.log(`if thisColumn >= placedCardsRange.columns.low`);
                allMapNeighbours.push(`#row-${thisRow}-column-${thisColumn - 1}`);
            }
        } else {
            // console.log(`if !placedCardsRange.columns.locked`);
            allMapNeighbours.push(`#row-${thisRow}-column-${thisColumn - 1}`);
        }
    } else {
        // console.log(`if criteria != 'empty'`);
        allMapNeighbours.push(`#row-${thisRow - 1}-column-${thisColumn}`);
        allMapNeighbours.push(`#row-${thisRow}-column-${thisColumn + 1}`);
        allMapNeighbours.push(`#row-${thisRow + 1}-column-${thisColumn}`);
        allMapNeighbours.push(`#row-${thisRow}-column-${thisColumn - 1}`);
    }

    // console.log(`allMapNeighbours`, allMapNeighbours);

    if(!returnPositions) {
        // console.log(`!returnPositions`);
        let validMapNeighbours = [];

        for (let i = 0; i < allMapNeighbours.length; i++) {
    
            if($(`${allMapNeighbours[i]}`).length) {
                // console.log(`$(${allMapNeighbours[i]}).length`);
                let thisAttr = $(`${allMapNeighbours[i]}`).attr('cardtype');

                // console.log(`thisAttr = ${thisAttr}`);
    
                if (criteria == 'empty') {
                    // console.log(`criteria == 'empty'`);
                    if (typeof thisAttr === 'undefined' || thisAttr === false) {
                        // console.log(`typeof thisAttr === 'undefined' || thisAttr === false`);
                        validMapNeighbours.push(allMapNeighbours[i]);
                    };
                } else if(thisAttr == criteria){
                    // console.log(`thisAttr == criteria`);
                    if(criteria == 'plant') {
                        // console.log(`criteria == 'plant'`);
                        // console.log($(`${allMapNeighbours[i]}`).attr('plant-pot'));
                        if($(`${allMapNeighbours[i]}`).attr('plant-pot') != 'none') {
                            // console.log(`${allMapNeighbours[i]}').attr('plant-pot') != 'none'`);
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
        // console.log(`returnPositions`);
        let validMapNeighbours = {};
        for (let i = 0; i < allMapNeighbours.length; i++) {
            if($(`${allMapNeighbours[i]}`).length) {
                // console.log(`$(${allMapNeighbours[i]}).length`);
                let thisAttr = $(`${allMapNeighbours[i]}`).attr('cardtype');
                if (criteria == 'empty') {
                    // console.log(`criteria == 'empty'`);
                    if (typeof thisAttr === 'undefined' || thisAttr === false) {
                        // console.log(`typeof thisAttr === 'undefined' || thisAttr === false`);
                        validMapNeighbours[`${allMapNeighbours[i]}`] = lightingContainerPositions[i];
                    };
                } else if(thisAttr == criteria){
                    // console.log(`thisAttr == criteria`);
                    validMapNeighbours[`${allMapNeighbours[i]}`] = lightingContainerPositions[i];
                } 
            }
        }
        // console.log(`validMapNeighbours`, validMapNeighbours);
        return validMapNeighbours;
    }
}

function finalScoringProcess() {
    alert('Start Final Scoring Process');
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
