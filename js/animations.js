let animationMode = '';

let animationQueue = [];

let animationCounters = {
    'market-allAnimations': 0,
    'market-position': 0,
    'tableau-allAnimations': 0,
    'tableau-position': 0
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

    initAnimationQueue('market', 'allAnimations', marketState);
    initAnimationQueue('market', 'position', marketState);
    initAnimationQueue('tableau', 'allAnimations', tableauState);
    initAnimationQueue('tableau', 'position', tableauState);
    
    setTimeout(function(){
        resetAnimationClasses();
    }, 710);
}

function initAnimationQueue(thisCategory, thisFunc, thisMode){
    animationCounters[`${thisCategory}-${thisFunc}`] = 0;
    while (animationCounters[`${thisCategory}-${thisFunc}`] < animations[thisCategory][thisFunc].length) {
        var elem = `'${animations[thisCategory][thisFunc][animationCounters[`${thisCategory}-${thisFunc}`]]}'`;
        eval(`${thisFunc}Animation('${thisCategory}', $(${elem}), '${thisMode}')`);
        animationCounters[`${thisCategory}-${thisFunc}`]++;
    }
}

function allAnimationsAnimation(category, elem, mode) {
    for (let i = 0; i < elem.length; i++) {
        elem[i].classList.add('animatingElem');
        elem[i].classList.remove(animationClasses[mode].start);
        elem[i].classList.add(animationClasses[mode].finish);
        elem[i].classList.add(`${animationClasses[mode].transition}Transition`);
    }
}

function positionAnimation(category, elem, mode) {
    for (let i = 0; i < elem.length; i++) {
        elem[i].classList.remove('animatingElem');
        elem[i].classList.remove(animationClasses[mode].finish);
        elem[i].classList.add(animationClasses[mode].start);
        var startPos = elem[i].getBoundingClientRect();
        let transformAttr = $(elem[i]).css('transform');
        elem[i].classList.add('animatingElem');
        elem[i].classList.add(animationClasses[mode].finish);
        elem[i].classList.remove(animationClasses[mode].start);
        var endPos = elem[i].getBoundingClientRect();
        var invertedTop = startPos.top - endPos.top; // 18px
        var invertedLeft = startPos.left - endPos.left; // 29.5px
        elem[i].style.transformOrigin = 'top left';
        elem[i].style.transform = `
            translate(${invertedLeft}px, ${invertedTop}px) ${transformAttr != 'none' ? `scale(${getScaleNum(transformAttr)})` : ``}
        `;
        requestAnimationFrame(function(){
            elem[i].classList.add(`${animationClasses[mode].transition}Transition`);
            elem[i].style.transform = ``; 
        })
    }
}

function getScaleNum(transformAttr) {
    let splitOne = transformAttr.split('(');
    let thisScale = splitOne[1].split(',');
    return thisScale[0];
}

function animateStartingPot(thisPot) {
    var startPos = thisPot[0].getBoundingClientRect();
    thisPot[0].classList.add('animatingElem');
    thisPot[0].classList.remove('startingPos');
    thisPot[0].classList.add('expanded');
    var endPos = thisPot[0].getBoundingClientRect();
    var invertedTop = startPos.top - endPos.top;
    var invertedLeft = startPos.left - endPos.left;  
    thisPot[0].style.transformOrigin = 'top left';
    thisPot[0].style.transform = `
        translate(${invertedLeft}px, ${invertedTop}px)
    `; 
    requestAnimationFrame(function(){
        thisPot[0].classList.add('longTransition'); 
        thisPot[0].style.transform = ``; 
    });
}

function animateStartingPlantCard(thisPlant) {
    var startPos = thisPlant[0].getBoundingClientRect();
    thisPlant[0].classList.add('animatingElem');
    thisPlant[0].classList.add('expanded');
    thisPlant[0].classList.remove('startingPos');
    var endPos = thisPlant[0].getBoundingClientRect();
    var invertedTop = startPos.top - endPos.top;
    var invertedLeft = startPos.left - endPos.left;  
    thisPlant[0].style.transformOrigin = 'top left';
    thisPlant[0].style.transform = `
        translate(${invertedLeft}px, ${invertedTop}px)
    `; 
    requestAnimationFrame(function(){
        thisPlant[0].classList.add('longTransition'); 
        thisPlant[0].style.transform = ``;   
    });
}

function animateStartingItemToken(thisItem) {
    var startPos = thisItem[0].getBoundingClientRect();
    thisItem[0].classList.add('animatingElem');
    thisItem[0].classList.add('expanded');
    thisItem[0].classList.remove('startingPos');
    var endPos = thisItem[0].getBoundingClientRect();
    var invertedTop = startPos.top - endPos.top;
    var invertedLeft = startPos.left - endPos.left;  
    thisItem[0].style.transformOrigin = 'top left';
    thisItem[0].style.transform = `
        translate(${invertedLeft}px, ${invertedTop}px)
    `; 
    requestAnimationFrame(function(){
        thisItem[0].classList.add('longTransition'); 
        thisItem[0].style.transform = ``; 
    });
}

function animateStartingRoomCard(thisRoom) {
    var startPos = thisRoom[0].getBoundingClientRect();
    thisRoom[0].classList.add('animatingElem');
    thisRoom[0].classList.add('expanded');
    thisRoom[0].classList.remove('startingPos');
    var endPos = thisRoom[0].getBoundingClientRect();
    var invertedTop = startPos.top - endPos.top;
    var invertedLeft = startPos.left - endPos.left;  
    thisRoom[0].style.transformOrigin = 'top left';
    thisRoom[0].style.transform = `
        translate(${invertedLeft}px, ${invertedTop}px)
    `; 
    requestAnimationFrame(function(){
        thisRoom[0].classList.add('longTransition'); 
        thisRoom[0].style.transform = ``; 
    });
}

function resetAnimationClasses(){
    // $('.animatingElem').css('transform-origin', '');
    $('.animatingElem').removeClass('animatingElem quickTransition shortTransition mediumTransition longTransition veryLongTransition');
}
