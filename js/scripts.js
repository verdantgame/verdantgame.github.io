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
let currentIframeView = '';
let newIframeView = '';

$(window).resize(function() {
    checkScreenWidth();
});

function checkScreenWidth(){
    changeOfView = false;
	var windowSize = $(window).width();

	if(windowSize <= 539) {
		if(currentIframeView != 'mobileView') {
			changeOfView = true;
			newIframeView = 'mobileView';
		}
	} else if(windowSize > 539) {
		if(currentIframeView != 'wideScreenView') {
			changeOfView = true;
			newIframeView = 'wideScreenView';
		}
	}

	if(changeOfView) {
        $('body > #container').removeClass('mobileView wideScreenView').addClass(newIframeView);
        currentIframeView = newIframeView;
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

    console.log(`allPlantCards: `, allPlantCards);
    console.log(`allRoomCards: `, allRoomCards);
    console.log(`allItemTokens: `, allItemTokens);
    console.log(`allPlantPots: `, allPlantPots);

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

let mapData = [];
let mapLoopLimit = 0;
var mapRowsColumnsIndexes = {
	rows: {},
	columns: {}
};

function initiateMap() {

	let numRows = 5;
	let numColumns = 9;

	// mapData = []
	let i;
	let j;
	let k;
	let l;

	// loop through all rows
	for (i = 0, j = 0; i < numRows; i++) {

		mapRowsColumnsIndexes.rows['row' + j] = i;

		// j = 0 ROW START
		// i < 5 ROW DURATION (11 rows)
		// end result = rows = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
		mapData[i] = [];
		// loop through all the children of the currently targetted row - which represents the columns
		for (k = 0, l = 0; k < numColumns; k++) {

			mapRowsColumnsIndexes.columns['column' + l] = k;

			// l = 14 COLUMNS START
			// k < 12 COLUMNS DURATION (12 columns)
			// end result = columns = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
			mapData[i][k] = {
				// every map hex is blank to start with
				row: j,
				column: l,
				placedCard: false,
                placedItem: false
			}
			l++;
		}
		j++;
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
            <div class="zoomOptions">
                <!--img zoomType="zoomIn" class="zoomIn zoomOption inactiveZoom" src="img/zoomIn-inactive.png" /-->
                <!--img zoomType="zoomOut" class="zoomOut zoomOption activeZoom" src="img/zoomOut.png" /-->
            </div>
            <div class="mapNavigation">
                <!--img class="navBackground" src="img/woodCircle.png" /-->
                <!--img direction="up" class="upArrow navArrow" src="img/arrow.png" /-->
                <!--img direction="right" class="rightArrow navArrow" src="img/arrow.png" /-->
                <!--img direction="down" class="downArrow navArrow" src="img/arrow.png" /-->
                <!--img direction="left" class="leftArrow navArrow" src="img/arrow.png" /-->
            </div>

            <div id="placedTileOptions">
                <!--button id="cancelTilePlacement" class="button is-danger">Cancel</button-->
                <!--button id="confirmTilePlacement" class="button is-success">Confirm</button-->
            </div>
    `;
	// the map is generated and all the exisiting information has been replaced
	$('#homeContentContainer #mapContainer').html(mapHTML);
}

$(document).on('mouseenter','#marketSection.gameSection:not(.expandAnimation):not(.initSetup) #marketCardColumns .marketColumn .cardsAndItemContainer',function(){
	$(this).closest('.marketColumn').addClass('activeColumn');
    $(this).closest('#marketCardColumns').addClass('activeColumnView');
});

$(document).on('mouseleave','#marketSection.gameSection:not(.expandAnimation):not(.initSetup) #marketCardColumns .marketColumn .cardsAndItemContainer',function(){
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

$(document).on(touchEvent, '#startGame', function(){
	$('body').addClass('gameView');
	$('.layer').fadeOut();
    setTimeout(function(){
        $('#gameLayer').fadeIn();
        setTimeout(function(){
            initMarketInterval = setInterval(initMarketFunc, 350);    
        }, 400);
    }, 400);
	
    $('#gameLayer #gameSectionsParent .minimized ion-icon[name="expand"]').show();
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
            initMarketInterval = setInterval(initMarketFunc, 350);
        }, 350)
    } else if(currentColumn == -1 && (currentMarketItem + 1) == marketItemClasses.length) {
        clearInterval(initMarketInterval);
        currentColumn = 3;
        currentMarketItem = 0;
        setTimeout(function(){
            initMarketFlipCardsInterval = setInterval(flipInitMarketCards, 350);    
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
                initPlayersHome();
            }, 300);

        }, 550);
    }
}

function initPlayersHome() {
    $('#marketSection').addClass('minimized').removeClass('expanded');
    $('#tableauSection').addClass('expanded').removeClass('minimized');

    // target the next tile information in the allTiles array
    // splicing the first item removes it from the array and transfers the information into the "thisTile" variable

    let startingPlant = allPlantCards.splice(0, 1);
    let startingRoom = allRoomCards.splice(0, 1);

    let startingPlantHTML = generateCard(startingPlant[0], 'plant', 'init');
    let startingRoomHTML = generateCard(startingRoom[0], 'room', 'init');

    $('#playerInfoContainer #cardToPlace').append(startingPlantHTML);
    $('#mapContainer #mapHiddenOverlay #row-2-column-4').append(startingRoomHTML);

    setTimeout(function(){
        $('#playerInfoContainer #cardToPlace .flip-plant.startingPos').removeClass('startingPos')
        $('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room.startingPos').removeClass('startingPos')
    }, 1000);

    setTimeout(function(){
        $('#playerInfoContainer #cardToPlace .flip-plant .flip-card-inner').css('transform', 'rotateY(180deg) translate3d(0, 0, 1px)'); 
        $('#mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room .flip-card-inner').css('transform', 'rotateY(180deg) translate3d(0, 0, 1px)'); 
    }, 3500);

    setTimeout(function(){
        $('#homeContentContainer #playerInfoContainer #cardToPlace .flip-plant .flip-card-inner .flip-card-back .cardContainer').prependTo('#homeContentContainer #playerInfoContainer #cardToPlace');
        $('#homeContentContainer #playerInfoContainer #cardToPlace .flip-plant').remove();
        $('#homeContentContainer #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room .flip-card-inner .flip-card-back .cardContainer').prependTo('#homeContentContainer #mapContainer #mapHiddenOverlay #row-2-column-4');
        $('#homeContentContainer #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room').remove();
        $('.initSetup').removeClass('initSetup'); 
    }, 4050);
}

// $(document).on(touchEvent, '#backToStart', function(){
// 	$('.gameView').removeClass('gameView');
// 	$('.layer').hide();
// 	$('#setupLayer').show();
// });

$(document).on(touchEvent, '#gameLayer #gameSectionsParent .minimized:not(.initSetup)', function(){
    $('#gameLayer #gameSectionsParent .expanded').addClass('minimized').removeClass('expanded');
    $(this).addClass('expanded expandAnimation').removeClass('minimized');
    setTimeout(function(){
        $('.expanded.expandAnimation').removeClass('expandAnimation');
    }, 800)
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
