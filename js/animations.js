*:fullscreen
*:-ms-fullscreen,
*:-webkit-full-screen,
*:-moz-full-screen {
   overflow: auto!important;
}

:root {
    --animate-duration: 5s;
}

.button[disabled] {
    background-color: #ababab!important;
}

#container.desktopView .desktopElement,
#container.tabletView .tabletElement,
#container.mobileView .mobileElement {
    display:block!important;
}

#container.desktopView .tabletElement,
#container.desktopView .mobileElement,
#container.tabletView .desktopElement,
#container.tabletView .mobileElement,
#container.mobileView .desktopElement,
#container.mobileView .tabletElement {
    display: none;
}

html {
    overflow-y: hidden!important;
    min-width: auto!important;
    /* width: 100%;
    height: 100%;
    overflow: hidden; */
}

body {
    width: 100%;
    margin: 0 auto;
    box-sizing: content-box;
    /* line-height: 0; */
    /* width: 100%;
    height: 100%;
    overflow-y: scroll;
    padding-right: 17px;
    box-sizing: content-box; */
}

#container.desktopView {
    max-width: 1250px;
}

#container.tabletView {
    max-width: 539px;
    height: 1040px;
}

#container.mobileView {
    max-width: 539px;
}

#maximizeScreenIcon {
    display: none;
}

#container.desktopView #maximizeScreenIcon,
#container.desktopView #minimizeScreenIcon,
#container.tabletView #maximizeScreenIcon,
#container.tabletView #minimizeScreenIcon {
    display:none!important;
}

#container #minimizeScreenIcon {
    display:none;
}

p {
    line-height: 23px;
}

.layer {
    display: none;
    position: absolute;
    top: 0px;
    width: 100%;
}

.modal {
    justify-content: unset!important;
}

.modal.notificationModal .modal-content {
    top: 15%;
    width: 330px;
}

.modal .modal-content .delete.closeModalTrigger.smallCloseCross {
    padding: 1px!important;
}

.modal .modal-content .delete.closeModalTrigger.mediumCloseCross {
    padding: 5px!important;
}

.modal .modal-content .delete.closeModalTrigger.largeCloseCross {
    padding: 9px!important;
}

#scoringReminderModal.modal.notificationModal .modal-content {
    top: 2%;
    width: 530px;
}

#scoringReminderModal.modal.notificationModal .modal-content #scoringAidImg {
    width: 370px;
    display: block;
    margin: 0 auto;
}

.modal.notificationModal .modal-content[btns="1"] .button:not(.delete.closeModalTrigger) {
    display: block;
    margin: 20px auto 0px;
    padding: 0px 30px;
}

.collapsed {
    user-select: none;
}

.clear {
    clear:both;
}  

.animatingElem.quickTransitionAll {
    transition: all 0.2s ease-in-out!important;
}

.animatingElem.shortTransitionAll {
    transition: all 0.5s ease-in-out!important;
}

.animatingElem.mediumTransitionAll {
    transition: all 0.7s ease-in-out!important;
}

.animatingElem.longTransitionAll {
    transition: all 1.0s ease-in-out!important;
}

.animatingElem.veryLongTransitionAll {
    transition: all 1.8s ease-in-out!important;
}

.animatingElem.quickTransition {
    transition: height 0.2s ease-in-out, width 0.2s ease-in-out, opacity 0.2s ease-in-out, background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.animatingElem.shortTransition {
    transition: height 0.5s ease-in-out, width 0.5s ease-in-out, opacity 0.5s ease-in-out, background-color 0.5s ease-in-out, transform 0.5s ease-in-out;
}

.animatingElem.mediumTransition {
    transition: height 0.7s ease-in-out, width 0.7s ease-in-out, opacity 0.7s ease-in-out, background-color 0.7s ease-in-out, transform 0.7s ease-in-out;
}

.animatingElem.longTransition {
    transition: height 1.0s ease-in-out, width 1.0s ease-in-out, opacity 1.0s ease-in-out, background-color 1.0s ease-in-out, transform 1.0s ease-in-out;
}

.animatingElem.veryLongTransition {
    transition: height 1.8s ease-in-out, width 1.8s ease-in-out, opacity 1.8s ease-in-out, background-color 1.8s ease-in-out, transform 1.8s ease-in-out;
}

/* .collapsed {
	user-select: none;
} */

#container {
    margin: 0 auto;
    position: relative;
}

#container #mainVerdantTitle {
    display: block;
    text-align: center;
    margin: 10px 0px 8px;
}

#container #mainVerdantTitle img {
    width: 240px;
    margin-bottom: 0px;
    margin-left: 13px;
}

.gameLayerElement {
    display:none;
}

/* 
    __                      __ _              
   / /   ____   ____ _ ____/ /(_)____   ____ _
  / /   / __ \ / __ `// __  // // __ \ / __ `/
 / /___/ /_/ // /_/ // /_/ // // / / // /_/ / 
/_____/\____/ \__,_/ \__,_//_//_/ /_/ \__, /  
    __                               /____/   
   / /   ____ _ __  __ ___   _____            
  / /   / __ `// / / // _ \ / ___/            
 / /___/ /_/ // /_/ //  __// /                
/_____/\__,_/ \__, / \___//_/ 
             /____/                           

*Desktop*
*Static Styles*
            
*/

#loaderLayer {
    display: none;
    padding-top: 0px;
    height: 80vh;
}

#loaderLayer .loader-parent {
    padding: 0px;
    display: block;
    color: #e5e5e4;
    font-family: Helvetica;
    font-size: 1em;
    font-weight: 400;
    line-height: 1.5;
    position: absolute;
    top: 35%;
    left: 50%;
}

#loaderLayer .loader-parent .loader-container {
    max-width: 960px;
    flex-grow: 1;
    margin: 0 auto;
    position: relative;
    width: auto;
}

#loaderLayer .loader-parent .loader-container .loader-wrapper {
    position: absolute;
    top: 0px;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 1;
    z-index: 1;
    transition: opacity .3s;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
}

#loaderLayer .loader-parent .loader-container .loader-wrapper .loading-message {
    font-weight: bold;
    color: #3eaf56;
    font-size: 22px;
}

#loaderLayer .loader-parent .loader-container .loader-wrapper .loader.is-loading {
    height: 180px;
    width: 180px;
    opacity: 1;
    z-index: 1;
    -webkit-animation: spinAround 1s infinite linear;
    animation: spinAround 1s infinite linear;
    border: 4px solid #3eaf56;
    border-radius: 290486px;
    border-right-color: transparent;
    border-top-color: transparent;
    content: "";
    display: block;
    position: absolute;
}

@-webkit-keyframes spinAround {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(359deg);
    }
}

@keyframes spinAround {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(359deg);
    }
}

/*                                                                       
 ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______
/_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____/
 _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _    
(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)   
                   _____        __                   __                                                  
      __/|_       / ___/ ___   / /_ __  __ ____     / /   ____ _ __  __ ___   _____           
     |    /       \__ \ / _ \ / __// / / // __ \   / /   / __ `// / / // _ \ / ___/        
    /_ __|       ___/ //  __// /_ / /_/ // /_/ /  / /___/ /_/ // /_/ //  __// /            
     |/         /____/ \___/ \__/ \__,_// .___/  /_____/\__,_/ \__, / \___//_/
                                       /_/                    /____/                                     
 _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _       
(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)      
 ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______       
/_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____/       

*Desktop*
*Static Styles*
*/

#setupLayer .subtitle {
    font-style: italic;
    text-align: center;
    width: 440px;
    margin: 11px auto 15px;
    font-size: 16px;
    line-height: 22px;
}

#setupLayer #homepageButtonContainer {
    width: 340px;
    margin: 16px auto 20px;
}

#setupLayer #homepageButtonContainer .button {
    display: block;
    margin: 0px 14px;
    width: 105px;
    height: 28px;
}

#container.tabletView #setupLayer #homepageButtonContainer .button,
#container.mobileView #setupLayer #homepageButtonContainer .button {
    width: 95px;
    height: 26px;
}

#setupLayer #demoDisclaimer {
    width: 93%;
    max-width: 740px;
    margin: 0px auto 0px;
}

#setupLayer #demoDisclaimer .message-body p {
    margin-bottom: 13px;
}
     
/*                                                                                                  
 ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______
/_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____/
 _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _    
(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)   
                     ______                           __                                                 
        __/|_       / ____/____ _ ____ ___   ___     / /   ____ _ __  __ ___   _____       __/|_         
       |    /      / / __ / __ `// __ `__ \ / _ \   / /   / __ `// / / // _ \ / ___/      |    /         
      /_ __|      / /_/ // /_/ // / / / / //  __/  / /___/ /_/ // /_/ //  __// /         /_ __|          
       |/         \____/ \__,_//_/ /_/ /_/ \___/  /_____/\__,_/ \__, / \___//_/           |/        
                                                               /____/                                    
 _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _       
(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)      
 ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______       
/_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____/       

*Desktop*
*Static Styles*
*/


/* 
  ______                 ____        ____     
 /_  __/____   ____     /  _/____   / __/____ 
  / /  / __ \ / __ \    / / / __ \ / /_ / __ \
 / /  / /_/ // /_/ /  _/ / / / / // __// /_/ /
/_/   \____// .___/  /___//_/ /_//_/   \____/ 
    ____   /_/                                
   / __ ) ____ _ _____                        
  / __  |/ __ `// ___/                        
 / /_/ // /_/ // /                            
/_____/ \__,_//_/ 

*Desktop*
*Static Styles*
*/


#gameLayer #topInfoBar {
    display: block;
    width: 752px;
    margin: 10px auto 5px;
    padding: 5px 0px;
    border-radius: 9px;
    height: 73px;
}

#container.tabletView #gameLayer #topInfoBar {
    width: 100%;
    margin: 7px auto 3px;
    padding: 5px 0px;
    border-radius: 9px;
    height: 49px;
    position: relative;
    z-index: 1;
}

#container #gameLayer #topInfoBar #secondaryVerdantTitle {
    margin-bottom: 0px;
    float: left;
    width: 236px;
}

#container.tabletView #gameLayer #topInfoBar #secondaryVerdantTitle {
    width: 150px;
    margin-left: 15px;
}

#gameLayer #topInfoBar #infoBarStats {
    width: 204px;
    float: left;
    margin: 12px 0px 0px 60px;
    font-size: 20px;
}

#container.tabletView #gameLayer #topInfoBar #infoBarStats {
    width: 166px;
    margin: 1px 0px 0px 41px;
    font-size: 16px;
    line-height: 23px;
}

#gameLayer #topInfoBar #infoBarStats .infoBarStatContainer {
    margin-bottom: 4px;
}

#container.tabletView #gameLayer #topInfoBar #infoBarStats .infoBarStatContainer {
    margin-bottom: 0px;
}

#gameLayer #topInfoBar #infoBarStats .infoBarStatContainer .infoBarStatTitle {
    width: 169px;
    float: left;
    text-align: center;
}

#container.tabletView #gameLayer #topInfoBar #infoBarStats .infoBarStatContainer .infoBarStatTitle {
    width: 133px;
    margin-right: 0px;
}

#gameLayer #topInfoBar #infoBarStats .infoBarStatContainer .infoBarStatData {
    width: 32px;
    float: right;
    text-align: center;
    font-weight: bold;
}

#container.tabletView #gameLayer #topInfoBar #infoBarStats .infoBarStatContainer .infoBarStatData {
    width: 28px;
}

#gameLayer #topInfoBar #showScoringRemindersBtn {
    font-size: 18px;
    margin: 15px 0px 0px 79px;
    padding: 0px 38px;
}

#container.tabletView #gameLayer #topInfoBar #showScoringRemindersBtn {
    font-size: 15px;
    margin: 5px 0px 0px 46px;
    padding: 0px 26px;
}

#container.desktopView #swapSectionsIcon {
    display: none;
}

#container.tabletView #swapSectionsIcon,
#container.mobileView #swapSectionsIcon {
    font-size: 43px;
    width: 43px;
    height: 43px;
    position: absolute;
    top: 209px;
    left: 232px;
    z-index: 11;
    color: #003722;
    background-color: #05c15f;
    border-radius: 50%;
    cursor: pointer;
    cursor: hand;
    box-shadow: 0px 0px 5px 2px #424242;
}

#container.tabletView #swapSectionsIcon.expanded,
#container.mobileView #swapSectionsIcon.expanded {
    top: 209px;
}

#container.tabletView #swapSectionsIcon.collapsed,
#container.mobileView #swapSectionsIcon.collapsed {
    top: 519px;
}

#container #swapSectionsIcon ion-icon[name="arrow-up-circle-outline"] {
    transition: transform .7s ease-in-out;
    position: absolute;
    top: 0px;
    left: 0px;
    transform: rotate(180deg);
}

#container #swapSectionsIcon.expanded ion-icon[name="arrow-up-circle-outline"] {
    transform: rotate(180deg);
}

#container #swapSectionsIcon.collapsed ion-icon[name="arrow-up-circle-outline"] {
    transform: rotate(0deg);
}



/*    
    __  ___        _                            
   /  |/  /____ _ (_)____                       
  / /|_/ // __ `// // __ \                      
 / /  / // /_/ // // / / /                      
/_/  /_/ \__,_//_//_/ /_/                       
   _____              __   _                    
  / ___/ ___   _____ / /_ (_)____   ____   _____
  \__ \ / _ \ / ___// __// // __ \ / __ \ / ___/
 ___/ //  __// /__ / /_ / // /_/ // / / /(__  ) 
/____/ \___/ \___/ \__//_/ \____//_/ /_//____/

*Desktop*
*Static Styles*         
*/

#gameLayer #gameSectionsParent {
    position: relative;
    margin: 0 auto;
    width: 95%;
}

#container.desktopView #gameLayer #gameSectionsParent .gameSection {
    position: unset;
    width: 100%;
    height: 550px;
    margin: 0px 0px;
    float: left;
    overflow: hidden;
}

#container.tabletView #gameLayer #gameSectionsParent .gameSection,
#container.mobileView #gameLayer #gameSectionsParent .gameSection {
    position: absolute;
    width: 100%;
    overflow: hidden;
}

#gameLayer .gameSection.initSetup {
    overflow:hidden;
}

#container .gameSectionContainerOuterOverlay {
    overflow: hidden;
    position: absolute;
    border-bottom-color: rgb(65, 167, 66);
    border-bottom-style: solid;
    border-bottom-width: 2px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
}

#container .gameSectionContainerOuterOverlay.collapsed {
    z-index: 0;
}

#container .gameSectionContainerOuterOverlay.expanded {
    z-index: 1;
}

#tableauContainerInnerOverlay.gameSectionContainerInnerOverlay {
    width: 657px;
}

#marketContainerInnerOverlay.gameSectionContainerInnerOverlay {
    width: 505px;
}

#container.tabletView #marketContainerInnerOverlay.gameSectionContainerInnerOverlay {
    width: 511px;
}

.gameSectionContainerInnerOverlay {
    width: 99.2%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    border-right-color: rgb(65, 167, 66);
    border-right-style: solid;
    border-right-width: 2px;
    border-left-color: rgb(65, 167, 66);
    border-left-style: solid;
    border-left-width: 2px;
    border-top-color: rgb(65, 167, 66);
    border-top-style: solid;
    border-top-width: 2px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
}

#container.desktopView #gameLayer #marketContainerOuterOverlay.gameSectionContainerOuterOverlay {
    width: 509px;
    height: 550px;
    left: 0px;
}

#container.desktopView #gameLayer #tableauContainerOuterOverlay.gameSectionContainerOuterOverlay {
    width: 661px;
    height: 550px;
    right: 0px;
}

#container.tabletView #gameLayer .gameSectionContainerOuterOverlay,
#container.tabletView #gameLayer .gameSectionContainerInnerOverlay {
    left: 0px;
}

#container.desktopView #gameLayer .gameSectionContainerOuterOverlay {
    top: 10px;
}

#gameLayer .bgOverlay,
#gameLayer .gameSectionBg {
    width: 108%;
    max-width: 108%;
    position: absolute;
    top: -2%;
    left: -4%;
}

#gameLayer .bgOverlay {
    opacity: .5;
    z-index: -8;
    background-color: #bcffc4;
    height: 104%;
}

#gameLayer .gameSectionBg {
    opacity: .6;
    z-index: -9;
    border-radius: 10px;
}

#gameLayer .gameSectionContent {
    position: relative;
    height: 100%;
}
 
#container.touchDevice #gameSectionsParent .gameSection .inactive,
#container.nonTouchDevice.desktopView #gameSectionsParent .gameSection .inactive,
#container.nonTouchDevice:not(.desktopView) #gameSectionsParent .gameSection .inactive.expanded {
    display:none;
}

#container.nonTouchDevice:not(.desktopView) #gameSectionsParent .gameSection .inactive.collapsed {
    display: block;
    background-color: #0f0f0ffa;
    width: 100%;
    height: 100%;
    border-radius: 0px;
    position: absolute;
    z-index: 10;
    opacity: 0;
}

#container.nonTouchDevice:not(.desktopView) #gameSectionsParent .gameSection:not(.initSetup):hover .inactive.collapsed {
    cursor: hand;
    cursor: pointer;
    opacity: 0.5;
}

#container.nonTouchDevice:not(.desktopView) #gameSectionsParent .gameSection .inactive.collapsed ion-icon[name="expand"] {
    font-weight: bold;
    position: absolute;
    color: #FFF;
    opacity: 0;
}

#container.nonTouchDevice:not(.desktopView) #marketSection .inactive.collapsed ion-icon[name="expand"] {
    font-size: 65px;
    top: 71px;
    left: 224px;
}

#container.nonTouchDevice:not(.desktopView) #gameSectionsParent .gameSection:not(.initSetup):hover .inactive.collapsed ion-icon[name="expand"] {
    opacity: 1;
}

#gameLayer .titleContainer {
    height: 34px;
    position: absolute;
    top: 11px;
    left: 31px;
    border-bottom: 1px solid #003823;
}

#container.tabletView #gameLayer .titleContainer {
    height: 31px;
    left: 35px;
}

#gameLayer .titleContainer .title {
    font-family: 'DM Serif Display', serif;
    color: #003722;
    font-weight: 300;
    font-size: 27px;
    border-bottom: 2px solid #003823;
}

#container.tabletView #gameLayer .titleContainer .title {
    font-size: 25px;
}

/*                                                                                        
 ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______
/_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____/
 _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _    
(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)   
                       __  ___              __          __                          
          __/|_       /  |/  /____ _ _____ / /__ ___   / /_       __/|_             
         |    /      / /|_/ // __ `// ___// //_// _ \ / __/      |    /             
        /_ __|      / /  / // /_/ // /   / ,<  /  __// /_       /_ __|              
         |/        /_/  /_/ \__,_//_/   /_/|_| \___/ \__/        |/                 
 _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _       
(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)      
 ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______       
/_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____/       

*Desktop*
*Static Styles*
*/

#marketSection {
    height: 530px;
    position:absolute;
    top: 0px;
    width:100%;
}   

#marketSection.collapsed,
#marketSection.expandAnimation {
    overflow: hidden;
}

#container.tabletView #marketContainerOuterOverlay {
    height: 530px;
    width: 515px;
}

#marketContainerInnerOverlay {
    position: absolute;
    right: 0px;
    overflow: hidden;
    border-top-color: rgb(65, 167, 66);
    border-top-style: solid;
    border-top-width: 2px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
}

#container.desktopView #marketContainerInnerOverlay.gameSectionContainerInnerOverlay {
    width: 505px;
}

#container.tabletView #marketContainerOuterOverlay.expanded {
    top: 5px;
}

#container.tabletView #marketContainerOuterOverlay.collapsed {
    top: -311px;
    /* z-index: 0; */
}

#container.tabletView #marketContainerInnerOverlay.expanded {
    top: 0px;
}

#container.tabletView #marketContainerInnerOverlay.collapsed {
    top: 312px;
}

#marketSection .gameSectionContent {
    top: 0px;
}

#container.tabletView #marketSection .gameSectionContent.expanded {
    top: 0px;
}

#container.tabletView #marketSection .gameSectionContent.collapsed {
    top: -101px;
}

#marketSection #marketCardColumns { 
    position: absolute;
    top: 75px;
    left: 24px;
}

#container.tabletView #marketSection #marketCardColumns { 
    top: 59px;
    left: 20px;
}

#marketSection .marketColumn {
    width: 105px;
    float: left;
    margin: 0px 0px 0px 16px;
}

/* #container.desktopView #marketSection .marketColumn {
    height: 450px;
}

#container.desktopView #marketSection .marketColumn:hover {
    height: 450px;
} */

/* 
    ____          __ 
   / __ \ ____   / /_
  / /_/ // __ \ / __/
 / ____// /_/ // /_  
/_/     \____/ \__/

*Desktop*
*Static Styles*            
*/

#marketSection .marketColumn .plantPotContainer {
    width: 55px;
    height: 49px;
    margin: 0px auto 0px;
    display: block;
    left: 0px;
    position: relative;
    opacity: 1;
}

#marketSection .marketColumn .plantPotContainer.expanded {
    left: 0px;
}

#container.desktopView #marketSection .marketColumn .plantPotContainer.expanded.startingPosAnimate,
#container.tabletView #marketSection .marketColumn .plantPotContainer.expanded.startingPosAnimate {
    transition: left 1.0s ease-in-out;
    left: 0px;
}

#container.desktopView #marketSection .marketColumn .plantPotContainer.expanded.startingPosAnimate.startingPos,
#container.tabletView #marketSection .marketColumn .plantPotContainer.expanded.startingPosAnimate.startingPos {
    left: -500px;
}


/* 
   ______                  __               
  / ____/____ _ _____ ____/ /_____       __ 
 / /    / __ `// ___// __  // ___/    __/ /_
/ /___ / /_/ // /   / /_/ /(__  )    /_  __/
\____/ \__,_//_/    \__,_//____/      /_/   
    ____ __                                 
   /  _// /_ ___   ____ ___   _____         
   / / / __// _ \ / __ `__ \ / ___/         
 _/ / / /_ /  __// / / / / /(__  )          
/___/ \__/ \___//_/ /_/ /_//____/ 

*Desktop*
*Static Styles*                                                                                                                   
*/

#marketSection .marketColumn .cardsAndItemContainer {
    height: 400px;
    transform: scale(1);
    position:relative;
    z-index: 0;
    cursor:hand;
    cursor:pointer;
    top:0px;
    opacity: 1;
}

#container.desktopView #marketSection .marketColumn.activeColumn .cardsAndItemContainer {
    transition: all .2s ease-in-out;
    transform: scale(1.35);
    top: -50px;
    z-index: 2;
}

#container.desktopView #marketSection .marketColumn.deactivedColumn .cardsAndItemContainer {
    transition: all .2s ease-in-out;
    transform: scale(1);
    top:0px;
    z-index: 2;
}

#marketSection #marketCardColumns.activeColumnView .marketColumn:not(.activeColumn) .cardsAndItemContainer {
    opacity: .5;
}

#marketSection .marketColumn:first-child {
    margin: 0px 0px 0px 0px;
}

/* 
    ____ __                     
   /  _// /_ ___   ____ ___     
   / / / __// _ \ / __ `__ \    
 _/ / / /_ /  __// / / / / /    
/___/ \__/ \___//_/ /_/ /_/     
  ______        __              
 /_  __/____   / /__ ___   ____ 
  / /  / __ \ / //_// _ \ / __ \
 / /  / /_/ // ,<  /  __// / / /
/_/   \____//_/|_| \___//_/ /_/ 

*Desktop*
*Static Styles*                       
*/

#marketSection .marketColumn .itemToken {
    width: 46px;
    position: absolute;
    top: 174px;
    left: 30px;
}

#container.tabletView #marketSection .marketColumn .itemToken.expanded {
    top: 174px;
    left: 30px;
}

#container.tabletView #marketSection .marketColumn .itemToken.collapsed {
    top: 74px;
    left: 30px;
}

#container.desktopView #marketSection .marketColumn .itemToken.expanded.startingPosAnimate,
#container.tabletView #marketSection .marketColumn .itemToken.expanded.startingPosAnimate {
    transition: left 1.0s ease-in-out;
}

#container.desktopView #marketSection .marketColumn .itemToken.expanded.startingPosAnimate,
#container.tabletView #marketSection .marketColumn .itemToken.expanded.startingPosAnimate {
    top: 174px;
    left: 30px;
}

#container.desktopView #marketSection .marketColumn .itemToken.expanded.startingPosAnimate.startingPos,
#container.tabletView #marketSection .marketColumn .itemToken.expanded.startingPosAnimate.startingPos {
    top: 174px;
    left: -500px;
}

/* 
    __  ___              __          __ 
   /  |/  /____ _ _____ / /__ ___   / /_
  / /|_/ // __ `// ___// //_// _ \ / __/
 / /  / // /_/ // /   / ,<  /  __// /_  
/_/  /_/ \__,_//_/   /_/|_| \___/ \__/  
   ______                  __           
  / ____/____ _ _____ ____/ /_____      
 / /    / __ `// ___// __  // ___/      
/ /___ / /_/ // /   / /_/ /(__  )       
\____/ \__,_//_/    \__,_//____/ 

*Desktop*
*Static Styles*                            
*/

#marketSection .marketColumn .cardsAndItemContainer .cardContainer,
#marketSection .marketColumn .cardsAndItemContainer .backOfCardContainer {
    left: 0px;
}

#marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"],
#marketSection .marketColumn .cardsAndItemContainer .flip-plant,
#marketSection .marketColumn .cardsAndItemContainer .flip-plant .backOfCardContainer,
#marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"],
#marketSection .marketColumn .cardsAndItemContainer .flip-room,
#marketSection .marketColumn .cardsAndItemContainer .flip-room .backOfCardContainer {
    position: absolute;
    width: 105px;
    height: 164px;
}

#marketSection.desktopView .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-plant .flip-card-inner .flip-card-back .cardContainer[type="plant"],
#marketSection.desktopView .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room .flip-card-inner .flip-card-back .cardContainer[type="room"],
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-plant .flip-card-inner .flip-card-back .cardContainer[type="plant"].expanded,
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room .flip-card-inner .flip-card-back .cardContainer[type="room"].expanded,
#marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-plant .flip-card-inner .flip-card-front .backOfCardContainer,
#marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room .flip-card-inner .flip-card-front .backOfCardContainer {
    background-color: #f7efda;
    top: 0px;
}

#marketSection .marketColumn .cardsAndItemContainer > .cardContainer[type="plant"] {
    top: 0px;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"].expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"].expanded {
    top: 0px;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"].collapsed {
    top: -99px;
}

#marketSection .marketColumn .cardsAndItemContainer > .cardContainer[type="room"] {
    top: 235px;
}   

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"].expanded {
    top: 235px;
}   

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"].collapsed {
    top: 29px;
}
 
/*       
   ______                  __      
  / ____/____ _ _____ ____/ /      
 / /    / __ `// ___// __  /       
/ /___ / /_/ // /   / /_/ /        
\____/ \__,_//_/    \__,_/         
   _____  __          __           
  / ___/ / /_ __  __ / /___   _____
  \__ \ / __// / / // // _ \ / ___/
 ___/ // /_ / /_/ // //  __/(__  ) 
/____/ \__/ \__, //_/ \___//____/  
           /____/                  

*Desktop*
*Static Styles*                    
*/

.cardContainer,
.backOfCardContainer {
    position: absolute;
    z-index: 2;
    height: 164px;
    width: 105px;
}

/* .cardContainer {
    background-color: #f7efda;
} */

.cardContainerOverlay {
    width: 100%;
    height: 100%;
    position: absolute;
    top:0px;
    background-color: #f7efda;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .cardContainerOverlay.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .cardContainerOverlay.expanded,
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .cardContainerOverlay.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .cardContainerOverlay.expanded {
    top:0px;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .cardContainerOverlay.collapsed,
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .cardContainerOverlay.collapsed {
    top:100px;
}

.cardContainer,
.flip-card {
    border-radius: 6px;
    overflow: hidden;
}

.flip-card {
    display:block;
    background-color: transparent;
    height: 164px;
    perspective: 1000px;
    overflow: hidden;
    position: relative;
}


.flip-card-inner {
    position: relative;
    width: 100%;
    overflow: visible !important;
    transition: transform 0.9s;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    /* box-shadow: 0px 0px 10px #AAA; */
}

.flip-card-front, .flip-card-back {
    z-index: 0;
    position: absolute;
    width: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
}

.flip-card-back {
    transform: rotateY(180deg) translate3d(0, 0, 1px);
    -webkit-transform: rotateY(180deg) translate3d(0, 0, 1px);
    -moz-transform: rotateY(180deg) translate3d(0, 0, 1px);
}

.notransition {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -o-transition: none !important;
    transition: none !important;
}

/* 
   ______                  __      
  / ____/____ _ _____ ____/ /      
 / /    / __ `// ___// __  /       
/ /___ / /_/ // /   / /_/ /        
\____/ \__,_//_/    \__,_/         
   _____  __          __           
  / ___/ / /_ __  __ / /___   _____
  \__ \ / __// / / // // _ \ / ___/
 ___/ // /_ / /_/ // //  __/(__  ) 
/____/ \__/ \__, //_/ \___//____/
           /____/                  

*Desktop*
*Static Styles*
*/

/* 
    ____   __               __ 
   / __ \ / /____ _ ____   / /_
  / /_/ // // __ `// __ \ / __/
 / ____// // /_/ // / / // /_  
/_/    /_/ \__,_//_/ /_/ \__/ 

*Desktop*
*Static Styles*
*/

#marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-plant {
    left: 0px;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-plant.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-plant.expanded {
    left: 0px;
}

#container.desktopView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-plant.expanded.startingPosAnimate,
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-plant.expanded.startingPosAnimate {
    transition: left 1.0s ease-in-out;
    left: 0px;
}

#container.desktopView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-plant.expanded.startingPosAnimate.startingPos,
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-plant.expanded.startingPosAnimate.startingPos {
    left: -500px;
}

.cardContainer[type="plant"] .plant {
    opacity: 1;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plant.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plant.expanded {
    opacity: 1;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plant.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plant.collapsed {
    opacity: .15;
}

.cardContainer[type="plant"] .plantImgContainer > .plantImg,
.cardContainer[type="plant"] .lightingIconContainer > .lightingIcon {
    display:block;
    margin:0 auto;
}

.cardContainer[type="plant"] .plantBannerContainer {
    position: absolute;
    width: 31%;
    left: -4.5%;
    top: 0%;
    height: 26%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantBannerContainer.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantBannerContainer.expanded {
    left: -4.5%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantBannerContainer.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantBannerContainer.collapsed {
    left: -23.5%;
}

.cardContainer[type="plant"] .plantBannerContainer > .plantBanner {
    width: 68%;
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantBannerContainer > .plantBanner.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantBannerContainer > .plantBanner.expanded {
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantBannerContainer > .plantBanner.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantBannerContainer > .plantBanner.collapsed {
    transform: scale(2);
}

.cardContainer[type="plant"] .plantSymbolContainer {
    position: absolute;
    top: 4.5%;
    left: 1.5%;
    width: 18.5%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantSymbolContainer.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantSymbolContainer.expanded {
    left: 1.5%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantSymbolContainer.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantSymbolContainer.collapsed {
    left: -18.5%;
}

.cardContainer[type="plant"] .plantVerdancyContainer {
    position: absolute;
    top: 1%;
    left: 72%;
    width: 30%;
    height: 18%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVerdancyContainer.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVerdancyContainer.expanded {
    left: 72%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVerdancyContainer.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVerdancyContainer.collapsed {
    left: 66%;
}

.cardContainer[type="plant"] .plantVerdancyContainer > .plantVerdancy {
    width: 68%;
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVerdancyContainer > .plantVerdancy.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVerdancyContainer > .plantVerdancy.expanded {
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVerdancyContainer > .plantVerdancy.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVerdancyContainer > .plantVerdancy.collapsed {
    transform:scale(1.3);
}

.cardContainer[type="plant"] .plantVPsContainer {
    position: absolute;
    top: 13.5%;
    left: 74%;
    width: 29%;
    height: 18%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVPsContainer.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVPsContainer.expanded {
    top: 13.5%;
    left: 74%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVPsContainer.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVPsContainer.collapsed {
    top: 20.5%;
    left: 66%;
}

.cardContainer[type="plant"] .plantVPsContainer > .plantVPs {
    width: 68%;
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVPsContainer > .plantVPs.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVPsContainer > .plantVPs.expanded {
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVPsContainer > .plantVPs.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .plantVPsContainer > .plantVPs.collapsed {
    transform:scale(1.3);
}

.cardContainer[type="plant"] .lightingIconContainer {
    position: absolute;
    width: 22%;
    height: 12%;
}

.cardContainer[type="plant"] .lightingIconContainer > .lightingIcon {
    width: 68%;
}

/* 1x Lighting */
.cardContainer[type="plant"][data-lighting-num="1"] .lightingIconContainer-one {
    top: 1%;
    left: 39%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="1"] .lightingIconContainer-one.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="1"] .lightingIconContainer-one.expanded {
    top: 1%;
    left: 39%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="1"] .lightingIconContainer-one.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="1"] .lightingIconContainer-one.collapsed {
    top: 12%;
    left: 36%;
}

.cardContainer[type="plant"][data-lighting-num="1"] .lightingIconContainer-one > .lightingIcon-one {
    width: 68%;
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="1"] .lightingIconContainer-one > .lightingIcon-one.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="1"] .lightingIconContainer-one > .lightingIcon-one.expanded {
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="1"] .lightingIconContainer-one > .lightingIcon-one.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="1"] .lightingIconContainer-one > .lightingIcon-one.collapsed {
    transform:scale(1.3);
}

/* 2x Lighting */
.cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-one {
    top: 1%;
    left: 32%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-one.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-one.expanded {
    top: 1%;
    left: 32%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-one.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-one.collapsed {
    top: 5%;
    left: 36%;
}

.cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-one > .lightingIcon-one {
    width: 68%;
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-one > .lightingIcon-one.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-one > .lightingIcon-one.expanded {
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-one > .lightingIcon-one.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-one > .lightingIcon-one.collapsed {
    transform:scale(1.3);
}

.cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-two {
    top: 1%;
    left: 47%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-two.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-two.expanded {
    top: 1%;
    left: 47%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-two.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-two.collapsed {
    top: 19%;
    left: 36%;
}

.cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-two > .lightingIcon-two {
    width: 68%;
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-two > .lightingIcon-two.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-two > .lightingIcon-two.expanded {
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-two > .lightingIcon-two.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="2"] .lightingIconContainer-two > .lightingIcon-two.collapsed {
    transform:scale(1.3);
}

/* 3x Lighting */
.cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-one {
    top: 1%;
    left: 24%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-one.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-one.expanded {
    top: 1%;
    left: 24%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-one.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-one.collapsed {
    top: 1%;
    left: 36%;
}

.cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-one > .lightingIcon-one {
    width: 68%;
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-one > .lightingIcon-one.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-one > .lightingIcon-one.expanded {
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-one > .lightingIcon-one.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-one > .lightingIcon-one.collapsed {
    transform:scale(1.3);
}

.cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-two {
    top: 1%;
    left: 39%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-two.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-two.expanded {
    top: 1%;
    left: 39%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-two.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-two.collapsed {
    top: 14%;
    left: 36%;
}

.cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-two > .lightingIcon-two {
    width: 68%;
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-two > .lightingIcon-two.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-two > .lightingIcon-two.expanded {
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-two > .lightingIcon-two.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-two > .lightingIcon-two.collapsed {
    transform:scale(1.3);
}

.cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-three {
    top: 1%;
    left: 54%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-three.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-three.expanded {
    top: 1%;
    left: 54%;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-three.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-three.collapsed {
    top: 26%;
    left: 36%;
}

.cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-three > .lightingIcon-three {
    width: 68%;
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-three > .lightingIcon-three.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-three > .lightingIcon-three.expanded {
    transform:scale(1);
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-three > .lightingIcon-three.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"][data-lighting-num="3"] .lightingIconContainer-three > .lightingIcon-three.collapsed {
    transform:scale(1.3);
}


.cardContainer .lightingIconContainer > .lightingIcon.matchedLighting,
.cardContainer .verdancyIconsAndVPLayer > .verdancyLightingIcon.matchedLighting {
    transition: all .5s ease-in-out!important;
    background-color: #e9ff00;
    border-radius: 50%;
    transform: scale(1);
}

.cardContainer .lightingIconContainer > .lightingIcon.matchedLighting.matchedLightingAnimation,
.cardContainer .verdancyIconsAndVPLayer > .verdancyLightingIcon.matchedLighting.matchedLightingAnimation {
    transform: scale(1.4);
}

.verdancyIconsAndVPLayer {
    opacity: 0;
    padding-top: 0.5vw;
    background-color: #f7efdaed;
    position: absolute;
    left: 0vw;
    top: 0vw;
    height: 96%;
    width: 100%;
    z-index: 99;
    transition: opacity .5s ease-in-out;
}

#tableauSection #mapContainer #mapHiddenOverlay:not(.showVerdancyLayer) .mapTileContainer .cardContainer .verdancyIconsAndVPLayer {
    opacity: 0;
}

#tableauSection #mapContainer #mapHiddenOverlay.showVerdancyLayer .mapTileContainer:not(.cardPlacementPreview) .cardContainer .verdancyIconsAndVPLayer,
#tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer:not(.cardPlacementPreview) .cardContainer .verdancyIconsAndVPLayer.showIndividualVerdancyLayer {
    opacity: 1;
}

.cardContainer[type="plant"] .verdancyIconsAndVPLayer .verdancyLayerImg {
    position: absolute;
}

.cardContainer[type="plant"] .verdancyIconsAndVPLayer .verdancyLayerBadge {
    width: 32%;
    left: 14%;
    top: 1%;
}

.cardContainer[type="plant"] .verdancyIconsAndVPLayer .vpReminderIcon {
    width: 33%;
    top: 1%;
    left: 53%;
}

.cardContainer[type="plant"] .verdancyIconsAndVPLayer .verdancyLightingIcon {
    /* transition: all .7s ease-in-out; */
    position: absolute;
    width: 21%;
}

.cardContainer[type="plant"][data-lighting-num="1"] .verdancyIconsAndVPLayer .verdancyLightingIcon-one {
    top: 22.5%;
    left: 39.2%;
}

.cardContainer[type="plant"][data-lighting-num="2"] .verdancyIconsAndVPLayer .verdancyLightingIcon-one {
    top: 22.5%;
    left: 26.2%;
}

.cardContainer[type="plant"][data-lighting-num="2"] .verdancyIconsAndVPLayer .verdancyLightingIcon-two {
    top: 22.5%;
    left: 52.2%;
}

.cardContainer[type="plant"][data-lighting-num="3"] .verdancyIconsAndVPLayer .verdancyLightingIcon-one {
    top: 22.5%;
    left: 11.2%;
}

.cardContainer[type="plant"][data-lighting-num="3"] .verdancyIconsAndVPLayer .verdancyLightingIcon-two {
    top: 22.5%;
    left: 39.2%;
}

.cardContainer[type="plant"][data-lighting-num="3"] .verdancyIconsAndVPLayer .verdancyLightingIcon-three {
    top: 22.5%;
    left: 66.7%;
}

.cardContainer[type="plant"] .verdancyIconsAndVPLayer .verdancyIconsParentContainer {
    width: 105%;
    height: 64%;
    position: absolute;
    top: 38%;
    left: 0%;
}

.cardContainer[type="plant"] .verdancyIconsAndVPLayer .verdancyIconsParentContainer .verdancyIconContainer {
    width: 23.6%;
    height: 34%;
    float: left;
    margin: 0% 0% 0% 6.5%;
}

.cardContainer[type="plant"] .verdancyIconsAndVPLayer .verdancyIconsParentContainer .verdancyIconContainer .verdancyIconPosContainer {
    width: 100%;
    height: 100%;
    position: relative;
}

.cardContainer[type="plant"] .verdancyIconsAndVPLayer .verdancyIconsParentContainer .verdancyIconContainer .verdancyIcon {
    transition: opacity .3s ease-in-out;
    opacity: 0;
    position:absolute;
    top:0vw;
    left:0vw;
}

.cardContainer[type="plant"] .verdancyIconsAndVPLayer .verdancyIconsParentContainer .verdancyIconContainer.incompleteVerdancy .verdancyIcon.incompleteVerdancyIcon,
.cardContainer[type="plant"] .verdancyIconsAndVPLayer .verdancyIconsParentContainer .verdancyIconContainer.completeVerdancy .verdancyIcon.completeVerdancyIcon {
    opacity: 1;
}

.cardContainer[type="plant"] .verdancyIconsAndVPLayer[verdancy-icons="4"] .verdancyIconsParentContainer .verdancyIconContainer:last-child,
.cardContainer[type="plant"] .verdancyIconsAndVPLayer[verdancy-icons="7"] .verdancyIconsParentContainer .verdancyIconContainer:last-child {
    margin: 0% 0% 1% 36%;
}

.cardContainer[type="plant"] .verdancyIconsAndVPLayer[verdancy-icons="5"] .verdancyIconsParentContainer .verdancyIconContainer:nth-child(4),
.cardContainer[type="plant"] .verdancyIconsAndVPLayer[verdancy-icons="8"] .verdancyIconsParentContainer .verdancyIconContainer:nth-child(7) {
    margin: 0% 0% 1% 22%;
}


/* 
    ____                         
   / __ \ ____   ____   ____ ___ 
  / /_/ // __ \ / __ \ / __ `__ \
 / _, _// /_/ // /_/ // / / / / /
/_/ |_| \____/ \____//_/ /_/ /_/ 
   ______                  __    
  / ____/____ _ _____ ____/ /    
 / /    / __ `// ___// __  /     
/ /___ / /_/ // /   / /_/ /      
\____/ \__,_//_/    \__,_/

*Desktop*
*Static Styles*                          
*/


#marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room {
    top: 235px;
    left: 0px;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room.expanded {
    left: 0px;
}

#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room.expanded {
    top: 235px;
}

#container.desktopView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room.expanded.startingPosAnimate,
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room.expanded.startingPosAnimate {
    transition: left 1.0s ease-in-out;
}

#container.desktopView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room.expanded.startingPosAnimate,
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room.expanded.startingPosAnimate {
    top: 235px;
    left: 0px;
}

#container.desktopView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room.expanded.startingPosAnimate.startingPos,
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room.expanded.startingPosAnimate.startingPos {
    top: 235px;
    left: -500px;
}

/* #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"].collapsed {
    height: 70px;
} */

.cardContainer[type="room"] .room,
.flip-room .roomBack {
    top: 0px;
    left: 0px;
    height: 100%;
    position: absolute;
}


/* 
    __     _         __     __   _                      
   / /    (_)____ _ / /_   / /_ (_)____   ____ _        
  / /    / // __ `// __ \ / __// // __ \ / __ `/        
 / /___ / // /_/ // / / // /_ / // / / // /_/ /         
/_____//_/ \__, //_/ /_/ \__//_//_/ /_/ \__, /          
   ______ /____/        __          _  /____/           
  / ____/____   ____   / /_ ____ _ (_)____   ___   _____
 / /    / __ \ / __ \ / __// __ `// // __ \ / _ \ / ___/
/ /___ / /_/ // / / // /_ / /_/ // // / / //  __// /    
\____/ \____//_/ /_/ \__/ \__,_//_//_/ /_/ \___//_/

*Desktop*
*Static Styles*                                                                                                    
*/

.cardContainer[type="room"] .lightingIconContainer {
    position: absolute;
    background-color: #f7efda;
}

/* Top  */
.cardContainer[type="room"] .lightingIconContainer-top {
    width: 17%;
    height: 13%;
    top: -1%;
    left: 38%;
    padding: 0% 3% 3% 3%;
    border-bottom-right-radius: 50%;
    border-bottom-left-radius: 50%;
}

/* Top  */
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-top.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-top.expanded {
    top: -1%;
    left: 38%;
}

/* Top Lighting Container */
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-top.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-top.collapsed {
    top: 0%;
    left: 39%;
}

/* Right */
.cardContainer[type="room"] .lightingIconContainer-right {
    width: 16%;
    height: 11.4%;
    top: 44%;
    left: 81%;
    padding: 0% 0% 3% 3%;
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
}

/* Right */
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-right.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-right.expanded {
    top: 44%;
}

/* Right Lighting Container */
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-right.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-right.collapsed {
    top: 15%;
}

/* Bottom */
.cardContainer[type="room"] .lightingIconContainer-bottom {
    width: 17%;
    height: 13%;
    padding: 2% 3% 0% 3%;
    bottom: -1%;
    left: 39%;
    border-top-left-radius: 50%;
    border-top-right-radius: 50%;
}

/* Bottom */
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-bottom.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-bottom.expanded {
    bottom: -1%;
}

/* Bottom Lighting Container */
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-bottom.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-bottom.collapsed {
    bottom: 59%;
}

/* Left */
.cardContainer[type="room"] .lightingIconContainer-left {
    width: 16%;
    height: 12%;
    padding: 0.5% 2% 0% 0%;
    top: 43%;
    left: 1%;
    border-bottom-right-radius: 50%;
    border-top-right-radius: 50%;
}

/* Left */
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-left.expanded,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-left.expanded {
    top: 43%;
}

/* Left Lighting Container */
#container.tabletView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-left.collapsed,
#container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .lightingIconContainer-left.collapsed {
    top: 15%;
}

/* 
    __     _         __     __   _              
   / /    (_)____ _ / /_   / /_ (_)____   ____ _
  / /    / // __ `// __ \ / __// // __ \ / __ `/
 / /___ / // /_/ // / / // /_ / // / / // /_/ / 
/_____//_/ \__, //_/ /_/ \__//_//_/ /_/ \__, /  
          /____/                       /____/   
   _____                    __            __    
  / ___/ __  __ ____ ___   / /_   ____   / /    
  \__ \ / / / // __ `__ \ / __ \ / __ \ / /     
 ___/ // /_/ // / / / / // /_/ // /_/ // /      
/____/ \__, //_/ /_/ /_//_.___/ \____//_/
      /____/                         
*/

.cardContainer[type="room"] .lightingIconContainer .lightingIcon {
    width: 100%;
}

.cardContainer[type="room"] .lightingIconContainer-top .lightingIcon {
    margin-top: 14%;
    margin-right: 0%;
    margin-bottom: 0%;
    margin-left: 0%;
}

.cardContainer[type="room"] .lightingIconContainer-right .lightingIcon {
    margin-top: 1%;
    margin-right: 0%;
    margin-bottom: 0%;
    margin-left: 0%;
}

.cardContainer[type="room"] .lightingIconContainer-bottom .lightingIcon {
    margin-top: 0%;
    margin-right: 0%;
    margin-bottom: 0%;
    margin-left: 0%;
}

.cardContainer[type="room"] .lightingIconContainer-left .lightingIcon {
    margin-top: 5%;
    margin-right: 0%;
    margin-bottom: 0%;
    margin-left: 0%;
}

/*                                                                           
 ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______
/_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____/
 _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _    
(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)   
                   ______        __     __                                          
      __/|_       /_  __/____ _ / /_   / /___   ____ _ __  __       __/|_           
     |    /        / /  / __ `// __ \ / // _ \ / __ `// / / /      |    /           
    /_ __|        / /  / /_/ // /_/ // //  __// /_/ // /_/ /      /_ __|            
     |/          /_/   \__,_//_.___//_/ \___/ \__,_/ \__,_/        |/  
 _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _       
(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)      
 ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______       
/_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____/       

*/
#tableauSection {
    top: 0px;
    height: 550px;
}

#container.tabletView #tableauSection {
    top: 0px;
    height: 557px;
}

#container.tabletView #tableauSection.expanded  {
    top: 0px;
    height: 557px;
}

#container.tabletView #tableauSection.collapsed {
    top: 0px;
    height: 557px;
}

#tableauSection .gameSectionContent {
    top: 0px;
}

#container.tabletView #tableauSection .gameSectionContent.collapsed {
    top: -55px;
}

#container.desktopView #tableauContainerInnerOverlay {
    width: 657px;
}

#container.tabletView #tableauContainerOuterOverlay,
#container.tabletView #tableauContainerInnerOverlay {
    height: 557px;
    width: 515px;
}

#container.tabletView #tableauContainerOuterOverlay.expanded,
#container.mobileView #tableauContainerOuterOverlay.expanded {
    top: 231px;
}

#container.tabletView #tableauContainerOuterOverlay.collapsed {
    top: 347px;
}

#container.tabletView #tableauContainerInnerOverlay,
#container.mobileView #tableauContainerInnerOverlay {
    width: 99.2%;
}

#container.tabletView #tableauContainerInnerOverlay.expanded,
#container.mobileView #tableauContainerInnerOverlay.expanded {
    top: 0px;
}

#container.tabletView #tableauContainerInnerOverlay.collapsed {
    top: 200px;
}

#container.tabletView #tableauSection .gameSectionOverlayParent.expanded {
    top: 520px;
}

#container.tabletView #tableauSection .gameSectionOverlayParent.collapsed {
    top: 235px;
}

#tableauSection .inactive.collapsed ion-icon[name="expand"] {
    font-size: 65px;
    top: 85px;
    left: 224px;
}

#container #tableauSection #homeContentContainer {
    margin: 0 auto;
    position: relative;
    width: 100%;
    height: 481px;
    top: 60px;
}

#container.tabletView #tableauSection #homeContentContainer {
    width: 99%;
    height: 486px;
    top: 65px;
}

#container.tabletView #tableauSection #homeContentContainer.expanded {
    top: 65px;
}

#container.tabletView #tableauSection #homeContentContainer.collapsed {
    top: 69px;
}

#tableauSection #playerInfoContainer {
    overflow: hidden;
    float: left;
    position: relative;
}

#container.desktopView #tableauSection #playerInfoContainer {
    width: 129px;
    height: 480px;
    margin-left: 5px;
}

#container.tabletView #tableauSection #playerInfoContainer,
#container.mobileView #tableauSection #playerInfoContainer {
    width: 135px;
    height: 480px;
}


#tableauSection #playerInfoContainer .playerInfoTitle {
    font-style: italic;
    font-weight: bold;
    position: absolute;
    top: 26%;
    z-index: 2;
    color: #3aa5729e;
    font-size: 16px;
    width: 100%;
    line-height: 20px;
    opacity: 1;
}

#container.tabletView #tableauSection #playerInfoContainer .playerInfoTitle {
    top: 30%;
    font-size: 14px;
    line-height: 15px;
    opacity: 1;
}

#container.tabletView #tableauSection #playerInfoContainer .playerInfoTitle.expanded,
#container.mobileView #tableauSection #playerInfoContainer .playerInfoTitle.expanded {
    opacity: 1;
}

#container.tabletView #tableauSection #playerInfoContainer .playerInfoTitle.collapsed,
#container.mobileView #tableauSection #playerInfoContainer .playerInfoTitle.collapsed {
    opacity: 0;
}

/* 
   ______                  __   ______     
  / ____/____ _ _____ ____/ /  /_  __/____ 
 / /    / __ `// ___// __  /    / /  / __ \
/ /___ / /_/ // /   / /_/ /    / /  / /_/ /
\____/ \__,_//_/    \__,_/    /_/   \____/ 
    ____   __                              
   / __ \ / /____ _ _____ ___              
  / /_/ // // __ `// ___// _ \             
 / ____// // /_/ // /__ /  __/             
/_/    /_/ \__,_/ \___/ \___/
                                     
*/

#tableauSection #playerInfoContainer #cardToPlace {
    position: absolute;
    width: 105px;
    height: 173px;
    top: 0px;
}

#container.desktopView  #tableauSection #playerInfoContainer #cardToPlace {
    left: 10px;
}

#container.mobileView #tableauSection #playerInfoContainer #cardToPlace {
    left: 16px;
}

#container.tabletView #tableauSection #playerInfoContainer #cardToPlace {
    top: 6px;
    left: 11px;
}

#container.tabletView #tableauSection #playerInfoContainer #cardToPlace.expanded {
    top: 6px;
    left: 11px;
}

#container.tabletView #tableauSection #playerInfoContainer #cardToPlace.collapsed {
    top: 6px;
    left: 11px;
}

#tableauSection #playerInfoContainer #cardToPlace > .flip-plant,
#tableauSection #playerInfoContainer #cardToPlace > .cardContainer {
    top: 3px;
    left: 0px;
    overflow: hidden;
}

#container.tabletView #tableauSection #playerInfoContainer #cardToPlace .flip-plant.expanded {
    top: 31px;
    left: 0px;
}

#container.desktopView #tableauSection #playerInfoContainer #cardToPlace .flip-plant.expanded.startingPosAnimate,
#container.tabletView #tableauSection #playerInfoContainer #cardToPlace .flip-plant.expanded.startingPosAnimate {
    transition: left 1.6s ease-in-out, top 1.6s ease-in-out;
}

#container.desktopView #tableauSection #playerInfoContainer #cardToPlace .flip-plant.expanded.startingPosAnimate,
#container.tabletView #tableauSection #playerInfoContainer #cardToPlace .flip-plant.expanded.startingPosAnimate {
    top: 3px;
    left: 0px;
    z-index:4;
}

#container.desktopView #tableauSection #playerInfoContainer #cardToPlace .flip-plant.expanded.startingPosAnimate.startingPos,
#container.tabletView #tableauSection #playerInfoContainer #cardToPlace .flip-plant.expanded.startingPosAnimate.startingPos {
    left: 150px;
    top: -270px;
}

#tableauSection #playerInfoContainer #cardToPlace #chosenCardBackground {
    position: absolute;
    width: 104%;
    max-width: 104%;
    top: 0px;
    left: -2px;
}


/* 
    ____ __                                                   
   /  _// /_ ___   ____ ___                                   
   / / / __// _ \ / __ `__ \                                  
 _/ / / /_ /  __// / / / / /                                  
/___/ \__/ \___//_/ /_/ /_/                                   
   ______               __          _                         
  / ____/____   ____   / /_ ____ _ (_)____   ___   _____ _____
 / /    / __ \ / __ \ / __// __ `// // __ \ / _ \ / ___// ___/
/ /___ / /_/ // / / // /_ / /_/ // // / / //  __// /   (__  ) 
\____/ \____//_/ /_/ \__/ \__,_//_//_/ /_/ \___//_/   /____/ 

*Desktop*
*Static Styles*
*/

#tableauSection #playerInfoContainer .itemContainer {
    width: 81px;
    height: 80px;
    position: absolute;
    left: 13px;
    overflow: hidden;
}

#container.tabletView #tableauSection #playerInfoContainer .itemContainer {
    width: 71px;
    height: 70px;
}

/* CHOSEN ITEM CONTAINER */

#tableauSection #playerInfoContainer #chosenItemContainer.itemContainer {
    top: 192px;
    left: 22px;
}

#container.tabletView #tableauSection #playerInfoContainer #chosenItemContainer.itemContainer {
    top: 192px;
    left: 28px;
}

#container.tabletView #tableauSection #playerInfoContainer #chosenItemContainer.itemContainer.expanded {
    top: 192px;
    left: 28px;
}

#container.tabletView #tableauSection #playerInfoContainer #chosenItemContainer.itemContainer.collapsed {
    top: 190px;
    left: 33px;
}

/* STORED ITEM CONTAINER */

#tableauSection #playerInfoContainer #storedItemContainer.itemContainer {
    top: 360px;
    left: 22px;
}

#container.tabletView #tableauSection #playerInfoContainer #storedItemContainer.itemContainer {
    top: 340px;
    left: 28px;
}

#container.tabletView #tableauSection #playerInfoContainer #storedItemContainer.itemContainer.expanded {
    top: 340px;
    left: 28px;
}

#container.tabletView #tableauSection #playerInfoContainer #storedItemContainer.itemContainer.collapsed {
    top: 263px;
    left: 33px;
}

#tableauSection #playerInfoContainer .itemContainer .itemBackground {
    width: 75%;
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    transform: scale(1.3);
    transform-origin: left top;
}

#container.tabletView #tableauSection #playerInfoContainer .itemContainer .itemBackground,
#container.mobileView #tableauSection #playerInfoContainer .itemContainer .itemBackground {
    width: 78%;
}

#container.tabletView #tableauSection #playerInfoContainer .itemContainer .itemBackground.expanded,
#container.mobileView #tableauSection #playerInfoContainer .itemContainer .itemBackground.expanded {
    transform: scale(1.3);
}

#container.tabletView #tableauSection #playerInfoContainer .itemContainer .itemBackground.collapsed,
#container.mobileView #tableauSection #playerInfoContainer .itemContainer .itemBackground.collapsed {
    transform: scale(1.1);
}

#tableauSection #playerInfoContainer .storageIcon {
    transform-origin: left top;
    display: block;
    position: absolute;
    z-index: 2;
    color: #125d16;
}

#container.desktopView #tableauSection #playerInfoContainer .storageIcon {
    top: 421px;
    left: 80px;
    font-size: 27px;
}

#container.tabletView #tableauSection #playerInfoContainer .storageIcon {
    top: 395px;
    left: 77px;
    font-size: 25px;
}

#container.tabletView #tableauSection #playerInfoContainer .storageIcon.expanded {
    top: 395px;
}

#container.tabletView #tableauSection #playerInfoContainer .storageIcon.collapsed {
    top: 309px;
}


/* 
   _____                           ____ __                        
  / ___/_      __ ____ _ ____     /  _// /_ ___   ____ ___   _____
  \__ \| | /| / // __ `// __ \    / / / __// _ \ / __ `__ \ / ___/
 ___/ /| |/ |/ // /_/ // /_/ /  _/ / / /_ /  __// / / / / /(__  ) 
/____/ |__/|__/ \__,_// .___/  /___/ \__/ \___//_/ /_/ /_//____/  
                     /_/                                          
    ____          __   __                                         
   / __ ) __  __ / /_ / /_ ____   ____                            
  / __  |/ / / // __// __// __ \ / __ \                           
 / /_/ // /_/ // /_ / /_ / /_/ // / / /                           
/_____/ \__,_/ \__/ \__/ \____//_/ /_/

*Desktop*
*Static Styles*                                                                 
*/

/* 
#container.mobileView #tableauSection #playerInfoContainer #swapItemsBtnContainer {
    width: 8.5vw;
    height: 9vw;
    top: 15.2vw;
    left: 80.2vw;
    opacity: 1;
}

#container.mobileView #tableauSection #playerInfoContainer #swapItemsBtnContainer.expanded {
    opacity: 1;
}

#container.mobileView #tableauSection #playerInfoContainer #swapItemsBtnContainer.collapsed {
    opacity: 0;
}

#container.mobileView #tableauSection #playerInfoContainer #swapItemsBtnContainer .swapItemsBtn {
    height: 93%;
    width: 97%;
    font-size: 7.3vw;
    line-height: 3.1vw;
}
 */


#tableauSection #playerInfoContainer #swapItemsBtnContainer {
    position: absolute;
    width: 45px;
    height: 58px;
    top: 273px;
    left: 43px;
    overflow: hidden;
    opacity: 1;
}

#tableauSection #playerInfoContainer #swapItemsBtnContainer.expanded {
    opacity: 1;
}

#tableauSection #playerInfoContainer #swapItemsBtnContainer.collapsed {
    opacity: 0;
}

#tableauSection #playerInfoContainer #swapItemsBtnContainer .swapItemsBtn {
    display: none;
    position: absolute;
    top: 0px;
    left: 0px;
    height: 93%;
    width: 97%;
    font-size: 34px;
    line-height: 16px;
    padding: 0px 0px;
}

#tableauSection #playerInfoContainer #swapItemsBtnContainer .swapItemsBtn.activeBtn {
    display:block;
}

#tableauSection #playerInfoContainer #swapItemsBtnContainer .swapItemsBtn[disabled] {
    opacity: .9;
}

/* 
    __  ___                                             
   /  |/  /____ _ ____                                  
  / /|_/ // __ `// __ \                                 
 / /  / // /_/ // /_/ /                                 
/_/  /_/ \__,_// .___/                                  
   ______     /_/       __          _                   
  / ____/____   ____   / /_ ____ _ (_)____   ___   _____
 / /    / __ \ / __ \ / __// __ `// // __ \ / _ \ / ___/
/ /___ / /_/ // / / // /_ / /_/ // // / / //  __// /    
\____/ \____//_/ /_/ \__/ \__,_//_//_/ /_/ \___//_/
    
*Desktop*
*Static Styles*                                          
*/

#tableauSection #homeContentContainer #mapContainerOuterOverlay {
    width: 370px;
    height: 480px;
    overflow: hidden;
    position: absolute;
    z-index: 3;
    top: 0px;
    right: 3px;
    border-bottom-color: rgb(65, 167, 66);
    border-bottom-style: solid;
    border-bottom-width: 2px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
}

#container.desktopView #tableauSection #homeContentContainer #mapContainerOuterOverlay {
    width: 504px;
    height: 470px;
    right: 16px;
}

#container.tabletView #tableauSection #homeContentContainer #mapContainerOuterOverlay.expanded,
#container.mobileView #tableauSection #homeContentContainer #mapContainerOuterOverlay.expanded {
    top: 0px;
}

#container.tabletView #tableauSection #homeContentContainer #mapContainerOuterOverlay.collapsed {
    top: -147px;
}

#tableauSection #homeContentContainer #mapContainerInnerOverlay {
    width: 500px;
    height: 470px;
    position: absolute;
    top: 0px;
    right: 0px;
    overflow: hidden;
    border-right-color: rgb(65, 167, 66);
    border-right-style: solid;
    border-right-width: 2px;
    border-left-color: rgb(65, 167, 66);
    border-left-style: solid;
    border-left-width: 2px;
    border-top-color: rgb(65, 167, 66);
    border-top-style: solid;
    border-top-width: 2px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
}

#container.tabletView #tableauSection #homeContentContainer #mapContainerInnerOverlay {
    width: 370px;
    height: 480px;
}

#container.tabletView #tableauSection #homeContentContainer #mapContainerInnerOverlay,
#container.mobileView #tableauSection #homeContentContainer #mapContainerInnerOverlay {
    width: 366px;
}

#container.tabletView #tableauSection #homeContentContainer #mapContainerInnerOverlay.expanded,
#container.mobileView #tableauSection #homeContentContainer #mapContainerInnerOverlay.expanded {
    top: 0px;
}

#container.tabletView #tableauSection #homeContentContainer #mapContainerInnerOverlay.collapsed {
    top: 149px;
}

#tableauSection #mapContainerOverlay {
    position: relative;
}

#tableauSection #mapContainer {
    width: 504px;
    height: 470px;
    background-color: #f7f7f752;
    background-image: url(../img/bg2.jpg);
    background-size: cover;
    background-position-y: center;
    background-position-x: center;
    position: absolute;
    overflow: hidden;
    border-radius: 7px;
    top: 0px;
    right: -2px;
}

#container.tabletView #tableauSection #mapContainer {
    width: 369px;
    height: 480px;
}

#container.tabletView #tableauSection #mapContainer.expanded {
    top: 0px;
    right: -2px;
}

#container.tabletView #tableauSection #mapContainer.collapsed {
    top: -122px;
    right: -2px;
}

#tableauSection #mapContainer #mapHiddenOverlay {
    position: relative;
    transform-origin: 50% 50%;
    margin-left: -314px;
    margin-top: -201px;
    top: 0px;
    left: 0px;
    width: 1010px;
    height: 873px;
    transform: scale(.9);
    transition: top .2s ease-in-out, left .2s ease-in-out, transform .2s ease-in-out;
}

#container.desktopView #tableauSection #mapContainer #mapHiddenOverlay {
    margin-left: -250px;
}

#tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer {
    height: 166px;
    width: 105px;
    margin: 3px;
    float: left;
    position: relative;
}

#tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer,
#tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer .cardContainer {
    transition: box-shadow .1s ease-in-out background-color .1s ease-in-out;
    box-shadow: 0px 0px 8px transparent;
}

#tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer.potentialPlacement.temporaryPlacement,
#tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer.potentialPlacement.temporaryPlacement .cardContainer  {
    box-shadow: 0px 0px 4px 2px #e1ff00;
}

#tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer.potentialPlacement {
    background-color: transparent;
    box-shadow: 0px 0px 8px transparent;
    border-radius: 6px;
}

#tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer.potentialPlacement.activePotentialPlacement {
    background-color: #00ff244a;
    box-shadow: 0px 0px 8px #424242;
    cursor: hand;
    cursor: pointer;
}

#tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer.potentialPlacement.activePotentialPlacement.cardPlacementPreview {
    background-color: #f7efda;
}

#tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer.potentialPlacement.activePotentialPlacement .cardContainer {
    opacity: .5;
}

#tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer .cardContainer,
#tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer .backOfCardContainer {
    position: relative;
    height: 164px;
}

#container.tabletView #tableauSection #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room.expanded,
#container.mobileView #tableauSection #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room.expanded {
    top: 0px;
    left: 0px;
}

#container.desktopView #tableauSection #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room.expanded.startingPosAnimate,
#container.tabletView #tableauSection #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room.expanded.startingPosAnimate {
    transition: left 1.6s ease-in-out, top 1.6s ease-in-out;
    top: 0px;
    left: 0px;
}

#container.desktopView #tableauSection #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room.expanded.startingPosAnimate.startingPos,
#container.tabletView #tableauSection #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room.expanded.startingPosAnimate.startingPos {
    top: -510px;
    left: -110px;
}


/* 
    ____   __                        __       ______                  __        
   / __ \ / /____ _ _____ ___   ____/ /      / ____/____ _ _____ ____/ /        
  / /_/ // // __ `// ___// _ \ / __  /      / /    / __ `// ___// __  /         
 / ____// // /_/ // /__ /  __// /_/ /      / /___ / /_/ // /   / /_/ /          
/_/    /_/ \__,_/ \___/ \___/ \__,_/       \____/ \__,_//_/    \__,_/           
   ____          __   _                            ____                       __
  / __ \ ____   / /_ (_)____   ____   _____       / __ \ ____ _ ____   ___   / /
 / / / // __ \ / __// // __ \ / __ \ / ___/      / /_/ // __ `// __ \ / _ \ / / 
/ /_/ // /_/ // /_ / // /_/ // / / /(__  )      / ____// /_/ // / / //  __// /  
\____// .___/ \__//_/ \____//_/ /_//____/      /_/     \__,_//_/ /_/ \___//_/   
     /_/                                                                        
*/


#tableauSection #mapContainer #placedCardOptions {
    width: 100%;
    height: 58px;
    padding: 3px 0px 0px 38px;
    position: absolute;
    z-index: 14;
    bottom: 0px;
    left: 0px;
    background-color: #00000096;
    transition: all .7s ease-in-out;
}

#container.tabletView #tableauSection #mapContainer #placedCardOptions {
    height: 48px;
    padding: 2px 0px 0px 9px;
    position: absolute;
}

#tableauSection #mapContainer #placedCardOptions.expanded {
    bottom: 0px;
}

#tableauSection #mapContainer #placedCardOptions.collapsed,
#tableauSection.collapsed #mapContainer.collapsed #placedCardOptions.expanded {
    bottom: -62px;
}

#tableauSection #mapContainer #placedCardOptions .button {
    float: left;
    margin: 5px 17px;
    font-size: 15px;
    width: 116px;
    padding: 0px 10px;
}

#container.tabletView #tableauSection #mapContainer #placedCardOptions .button {
    margin: 5px 8px;
    font-size: 13px;
    width: 80px;
    height: 20px;
    padding: 6px 10px;
}

#tableauSection #mapContainer #placedCardOptions .button .icon ion-icon {
    height: 22px;
    width: 23px;
}

/* 
 _    __                 __                          
| |  / /___   _____ ____/ /____ _ ____   _____ __  __
| | / // _ \ / ___// __  // __ `// __ \ / ___// / / /
| |/ //  __// /   / /_/ // /_/ // / / // /__ / /_/ / 
|___/ \___//_/    \__,_/ \__,_//_/ /_/ \___/ \__, /  
    ____                       _            /____/__ 
   / __ \ ___   ____ _ __  __ (_)_____ ___   ____/ / 
  / /_/ // _ \ / __ `// / / // // ___// _ \ / __  /  
 / _, _//  __// /_/ // /_/ // // /   /  __// /_/ /   
/_/ |_| \___/ \__, / \__,_//_//_/    \___/ \__,_/    
                /_/                                  
 */

 #mapContainer #verdancyVisibilityContainer {
    width: 50px;
    height: 56px;
    position: absolute;
    top: 5px;
    right: 8px;
    z-index: 1;
}

#container.tabletView #tableauSection #verdancyVisibilityContainer #verdancyVisibilityContainerOverlay,
#container.mobileView #tableauSection #verdancyVisibilityContainer #verdancyVisibilityContainerOverlay {
    transform-origin: right top;
    transform: scale(1);
    width:100%;
    height:100%;
}

#container.tabletView #tableauSection #verdancyVisibilityContainer #verdancyVisibilityContainerOverlay.expanded,
#container.mobileView #tableauSection #verdancyVisibilityContainer #verdancyVisibilityContainerOverlay.expanded {
    transform: scale(1);
}

#container.tabletView #tableauSection #verdancyVisibilityContainer #verdancyVisibilityContainerOverlay.collapsed,
#container.mobileView #tableauSection #verdancyVisibilityContainer #verdancyVisibilityContainerOverlay.collapsed {
    transform: scale(.8);
}

#container.tabletView #mapContainer #verdancyVisibilityContainer.expanded {
    top: 5px;
}


#container.tabletView #mapContainer #verdancyVisibilityContainer.collapsed {
    top: 125px;
}


#mapContainer #verdancyVisibilityContainer:not(.disableVerdancyVisibility) {
    cursor: hand;
    cursor: pointer;
}

#mapContainer #verdancyVisibilityContainer.disableVerdancyVisibility {
    cursor: not-allowed;
}

#mapContainer #verdancyVisibilityContainer .verdancyVisibilityImg {
    position: absolute;
}

#mapContainer #verdancyVisibilityContainer .verdancyVisibilityImg.verdancyMainImgInactive {
    transition: opacity .3s ease-in-out;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 7;
    opacity: 0;
}

#mapContainer #verdancyVisibilityContainer.disableVerdancyVisibility .verdancyVisibilityImg.verdancyMainImgInactive {
    opacity: 1;
}

#mapContainer #verdancyVisibilityContainer .verdancyVisibilityImg.verdancyMainImg {
    top: 0px;
    left: 0px;
    z-index: 6;
}

#mapContainer #verdancyVisibilityContainer .verdancyVisibilityImg.verdancyShadowImg {
    top: 2px;
    left: 2px;
    z-index: 5;
}

#mapContainer #verdancyVisibilityContainer .showHideVerdancyIconContainer {
    position: absolute;
    top: 11px;
    left: 11px;
    z-index: 15;
}

#mapContainer #verdancyVisibilityContainer.showVerdancy #showVerdancyIconContainer.showHideVerdancyIconContainer,
#mapContainer #verdancyVisibilityContainer.hideVerdancy #hideVerdancyIconContainer.showHideVerdancyIconContainer {
    display: block;
}

#mapContainer #verdancyVisibilityContainer.showVerdancy #hideVerdancyIconContainer.showHideVerdancyIconContainer,
#mapContainer #verdancyVisibilityContainer.hideVerdancy #showVerdancyIconContainer.showHideVerdancyIconContainer {
    display: none;
}

#mapContainer #verdancyVisibilityContainer .showHideVerdancyIconContainer .verdancyVisibilityIcon {
    position: absolute;
    top: 0px;
    left: 0px;
}

#mapContainer #verdancyVisibilityContainer .showHideVerdancyIconContainer .verdancyVisibilityIcon.verdancyIconMain {
    transition: color .3s ease-in-out;
    font-size: 27px;
    color: #125d16;
    z-index: 9;
}

#mapContainer #verdancyVisibilityContainer .showHideVerdancyIconContainer .verdancyVisibilityIcon.verdancyIconShadow {
    font-size: 29px;
    color: #2f2f2f;
    z-index: 8;
}

#mapContainer #verdancyVisibilityContainer.disableVerdancyVisibility .showHideVerdancyIconContainer .verdancyVisibilityIcon.verdancyIconMain {
    color: #9b9b9b;
}

/* 
 _____                         
/__  /  ____   ____   ____ ___ 
  / /  / __ \ / __ \ / __ `__ \
 / /__/ /_/ // /_/ // / / / / /
/____/\____/ \____//_/ /_/ /_/

*Desktop*
*Static Styles*                 
*/

#tableauSection #mapZoomControls {
    position: absolute;
    top: 5px;
    left: 6px;
    width: 107px;
    height: 48px;
    z-index: 15;
    opacity: 1;
}

#container.tabletView #tableauSection #mapZoomControls {
    width: 114px;
    height: 48px;
    top: 5px;
}

#container.tabletView #tableauSection #mapZoomControls.expanded {
    width: 114px;
    height: 48px;
    top: 5px;
}

#container.tabletView #tableauSection #mapZoomControls.collapsed {
    width: 114px;
    height: 48px;
    top: 126px;
}

#container.tabletView #tableauSection #mapZoomControls #mapZoomControlsOverlay,
#container.mobileView #tableauSection #mapZoomControls #mapZoomControlsOverlay {
    transform-origin: left top;
    transform: scale(1);
    width:100%;
    height:100%;
}

#container.tabletView #tableauSection #mapZoomControls #mapZoomControlsOverlay.expanded,
#container.mobileView #tableauSection #mapZoomControls #mapZoomControlsOverlay.expanded {
    transform: scale(1);
}

#container.tabletView #tableauSection #mapZoomControls #mapZoomControlsOverlay.collapsed,
#container.mobileView #tableauSection #mapZoomControls #mapZoomControlsOverlay.collapsed {
    transform: scale(.8);
}

#tableauSection #mapZoomControls .zoomIcon {
    position: absolute;
    top: 0px;
    width: 39px;
}

#container.desktopView #tableauSection #mapZoomControls .zoomIcon {
    width: 47px;
}

#container.tabletView #tableauSection #mapZoomControls .zoomIcon {
    width: 46px;
}

#tableauSection #mapZoomControls .zoomIcon.inactiveZoom {
    opacity: .4;
}

#tableauSection #mapZoomControls .zoomIcon.activeZoom {
    cursor:hand;
    cursor:pointer;
}

/* Zoom Out Icon */

#tableauSection #mapZoomControls .zoomOutIcon {
    left: 0px;
}

/* Zoom In Icon */

#tableauSection #mapZoomControls .zoomInIcon {
    left: 50px;
}

#container.tabletView #tableauSection #mapZoomControls .zoomInIcon {
    left: 66px;
}

#container.desktopView #tableauSection #mapZoomControls .zoomInIcon {
    left: 60px;
}

/* 
    _   __               _                __   _             
   / | / /____ _ _   __ (_)____ _ ____ _ / /_ (_)____   ____ 
  /  |/ // __ `/| | / // // __ `// __ `// __// // __ \ / __ \
 / /|  // /_/ / | |/ // // /_/ // /_/ // /_ / // /_/ // / / /
/_/ |_/ \__,_/  |___//_/ \__, / \__,_/ \__//_/ \____//_/ /_/ 
                        /____/                                 
                        
*Desktop*
*Static Styles*
*/

#tableauSection #mapNavControls {
    width: 110px;
    height: 110px;
    position: absolute;
    z-index: 15;
    bottom: 3px;
    right: 3px;
}

#container.tabletView #tableauSection #mapNavControls {
    width: 119px;
    height: 119px;
}

#container.tabletView #tableauSection #mapNavControls.expanded {
    bottom: 3px;
}

#container.tabletView #tableauSection #mapNavControls.collapsed {
    bottom: 29px;
}

#container.tabletView #tableauSection #mapNavControls #mapNavControlsOverlay,
#container.mobileView #tableauSection #mapNavControls #mapNavControlsOverlay {
    transform-origin: right bottom!important;
    transform: scale(1);
    width:100%;
    height:100%;
}

#container.tabletView #tableauSection #mapNavControls #mapNavControlsOverlay.expanded,
#container.mobileView #tableauSection #mapNavControls #mapNavControlsOverlay.expanded {
    transform: scale(1);
}

#container.tabletView #tableauSection #mapNavControls #mapNavControlsOverlay.collapsed,
#container.mobileView #tableauSection #mapNavControls #mapNavControlsOverlay.collapsed {
    transform: scale(.8);
}

#tableauSection #mapNavControls #mapNavBackground {
    position: absolute;
    top: 0px;
    right: 0px;
}

/*
    ___                                     
   /   |   _____ _____ ____  _      __ _____
  / /| |  / ___// ___// __ \| | /| / // ___/
 / ___ | / /   / /   / /_/ /| |/ |/ /(__  ) 
/_/  |_|/_/   /_/    \____/ |__/|__//____/ 

*Desktop*
*Static Styles*                                                          
*/

#tableauSection #mapNavControls .arrowImg {
    position: absolute;
    width: 34px;
    cursor:hand;
    cursor:pointer;
}


#container.desktopView #tableauSection #mapNavControls .arrowImg {
    width: 40px;
}

/* Up */
#container.desktopView #tableauSection #mapNavControls #upArrow.arrowImg {
    top: 8px;
    right: 34px;
}
/* Right */
#container.desktopView #tableauSection #mapNavControls #rightArrow.arrowImg {
    top: 40px;
    right: 3px;
}
/* Down */
#container.desktopView #tableauSection #mapNavControls #downArrow.arrowImg {
    top: 73px;
    right: 36px;
}
/* Left */
#container.desktopView #tableauSection #mapNavControls #leftArrow.arrowImg {
    top: 37px;
    right: 67px;
}

#container.tabletView #tableauSection #mapNavControls .arrowImg {
    width: 40px;
}

/* Up */
#container.tabletView #tableauSection #mapNavControls #upArrow.arrowImg {
    top: 9px;
    right: 38px;
}
/* Right */
#container.tabletView #tableauSection #mapNavControls #rightArrow.arrowImg {
    top: 45px;
    right: 3px;
}
/* Down */
#container.tabletView #tableauSection #mapNavControls #downArrow.arrowImg {
    top: 80px;
    right: 41px;
}
/* Left */
#container.tabletView #tableauSection #mapNavControls #leftArrow.arrowImg {
    top: 43px;
    right: 75px;
}

/* Up */
#tableauSection #mapNavControls #upArrow.arrowImg {
    transform: rotate(270deg);
}

/* Right */
#tableauSection #mapNavControls #rightArrow.arrowImg {
    transform: rotate(0deg);
}

/* Down */
#tableauSection #mapNavControls #downArrow.arrowImg {
    transform: rotate(90deg);
}

/* Left */
#tableauSection #mapNavControls #leftArrow.arrowImg {
    transform: rotate(180deg);
}

/* Up Arrow */
#tableauSection #mapNavControls #upArrow.arrowImg.activeArrow {    
	-webkit-transform: rotate(270deg) translateX(2px);
	transform: rotate(270deg) translateX(2px);
}

/* Right Arrow */
#tableauSection #mapNavControls #rightArrow.arrowImg.activeArrow {    
	-webkit-transform: rotate(0deg) translateX(2px);
	transform: rotate(0deg) translateX(2px);
}

/* Down Arrow */
#tableauSection #mapNavControls #downArrow.arrowImg.activeArrow {    
	-webkit-transform: rotate(90deg) translateX(2px);
	transform: rotate(90deg) translateX(2px);
}

/* Left Arrow */
#tableauSection #mapNavControls #leftArrow.arrowImg.activeArrow {    
	-webkit-transform: rotate(180deg) translateX(2px);
	transform: rotate(180deg) translateX(2px);  
} 


@media screen and (max-width: 539px) {

    .desktopElement,
    .tabletElement {
        display:none;
    }

    .mobileElement {
        display:block;
    }

/* @media screen and (max-width: 1222px) { */

    /*                                                                                         
     ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______
    /_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____/
     _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _    
    (_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)   
                       __  ___        __     _  __         _____  __          __                             
          __/|_       /  |/  /____   / /_   (_)/ /___     / ___/ / /_ __  __ / /___   _____       __/|_      
         |    /      / /|_/ // __ \ / __ \ / // // _ \    \__ \ / __// / / // // _ \ / ___/      |    /      
        /_ __|      / /  / // /_/ // /_/ // // //  __/   ___/ // /_ / /_/ // //  __/(__  )      /_ __|       
         |/        /_/  /_/ \____//_.___//_//_/ \___/   /____/ \__/ \__, //_/ \___//____/        |/          
                                                                   /____/                                    
     _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _       
    (_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)      
     ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______       
    /_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____/       

    *Mobile*
    */

    .modal.notificationModal .modal-content {
        top: 11%;
        width: 61vw;
    }

    #scoringReminderModal.modal.notificationModal .modal-content {
        top: 2%;
        width: 84vw;
    }

    #scoringReminderModal.modal.notificationModal .modal-content #scoringAidImg {
        width: 62vw;
    }

    .modal .modal-content .delete.closeModalTrigger.smallCloseCross {
        padding: .6vw!important;
    }
    
    .modal .modal-content .delete.closeModalTrigger.mediumCloseCross {
        padding: 1.3vw!important;
    }
    
    .modal .modal-content .delete.closeModalTrigger.largeCloseCross {
        padding: 2vw!important;
    }
    
    #container.mobileView p {
        line-height: 4.3vw;
    }

    #container.mobileView #mainVerdantTitle {
        text-align: center;
        margin: 3vw 0vw;
    }

    #container.mobileView #mainVerdantTitle img {
        width: 52vw;
        margin-bottom: 0vw;
        margin-left: 0vw;
    }

    #container.mobileView #maximizeScreenIcon {
        display:none;
    }

    body.gameView #container.mobileView #maximizeScreenIcon {
        display:block;
    }

    body.gameView #container.mobileView #maximizeScreenIcon,
    body.gameView #container.mobileView #minimizeScreenIcon {
        position: absolute;
        top: 2.5vw;
        right: 3vw;
        font-size: 7vw;
        cursor: hand;
        cursor: pointer;
    }

    #container.mobileView #setupLayer.layer {
        top: 0vw;
    }

    #container.desktopView #maximizeScreenIcon,
    #container.tabletView #maximizeScreenIcon {
        display:none;
    }


    /* 
        __                      __ _              
       / /   ____   ____ _ ____/ /(_)____   ____ _
      / /   / __ \ / __ `// __  // // __ \ / __ `/
     / /___/ /_/ // /_/ // /_/ // // / / // /_/ / 
    /_____/\____/ \__,_/ \__,_//_//_/ /_/ \__, /  
        __                               /____/   
       / /   ____ _ __  __ ___   _____            
      / /   / __ `// / / // _ \ / ___/            
     / /___/ /_/ // /_/ //  __// /                
    /_____/\__,_/ \__, / \___//_/ 
                 /____/                           
                
    *Mobile*
    */

    #container.mobileView #loaderLayer {
        top: 0vw;
        height: 50vh;
    }

    #container.mobileView #loaderLayer .loader-parent .loader-container .loader-wrapper .loading-message {
        font-size: 4.5vw;
    }

    #container.mobileView #loaderLayer .loader-parent .loader-container .loader-wrapper .loader.is-loading {
        height: 38vw;
        width: 38vw;
    }

    #container.mobileView #setupLayer {
        height: 211vw;
    }

    /* 
       _____        __                
      / ___/ ___   / /_ __  __ ____   
      \__ \ / _ \ / __// / / // __ \  
     ___/ //  __// /_ / /_/ // /_/ /  
    /____/ \___/ \__/ \__,_// .___/   
        __                 /_/        
       / /   ____ _ __  __ ___   _____
      / /   / __ `// / / // _ \ / ___/
     / /___/ /_/ // /_/ //  __// /    
    /_____/\__,_/ \__, / \___//_/ 
                 /____/               
                 
    *Mobile*
    */

    #container.mobileView #setupLayer .subtitle {
        width: 68vw;
        margin: 0vw auto 0vw;
        font-size: 3.5vw;
        line-height: 4.5vw;
    }

    #container.mobileView #setupLayer #homepageButtonContainer {
        margin: 5vw auto 6vw;
        width: 71vw;
    }

    #container.mobileView #setupLayer #homepageButtonContainer .button {
        margin: 0vw 2vw;
        width: 23vw;
        height: 6vw;
        font-size: 3.5vw;
    }

    #container.mobileView #setupLayer #demoDisclaimer {
        width: 93%;
    }

    #container.mobileView #setupLayer #demoDisclaimer .message-body {
        padding: 4vw 7vw 2vw 6vw;
        border-radius: 1vw;
        border-width: 0vw 0vw 0vw 1vw;
    }

    #container.mobileView #setupLayer #demoDisclaimer .message-body p {
        font-size: 3.5vw;
        line-height: 4.9vw;
        margin-bottom: 3vw;
    }

    /* 
       ______                         
      / ____/____ _ ____ ___   ___    
     / / __ / __ `// __ `__ \ / _ \   
    / /_/ // /_/ // / / / / //  __/   
    \____/ \__,_//_/ /_/ /_/ \___/    
        __                            
       / /   ____ _ __  __ ___   _____
      / /   / __ `// / / // _ \ / ___/
     / /___/ /_/ // /_/ //  __// /    
    /_____/\__,_/ \__, / \___//_/ 
                 /____/               
                 
    *Mobile*
    */

    #container.mobileView #gameLayer.layer {
        top: 0vw;
    }

    #container.mobileView #gameLayer #topInfoBar {
        width: 100vw;
        height: 10vw;
        border: 0vw solid transparent;
        margin: 0vw auto 0vw;
        padding: 1vw 0vw 0vw;
        border-radius: 1.2vw;
        position: absolute;
        top: 0vw;
        left: 0vw;
        z-index: 1;
    }

    #container.mobileView #gameLayer #topInfoBar #secondaryVerdantTitle {
        text-align: left;
        margin: 0vw 0vw 0vw 3vw;
        width: 30vw;
        float: left;
    }

    #container.mobileView #gameLayer #topInfoBar #secondaryVerdantTitle img {
        width: 30vw;
    }

    #gameLayer #topInfoBar #infoBarStats {
        width: 28vw;
        float: left;
        margin: .5vw 0vw 0vw 3vw;
        font-size: 3vw;
        line-height: 2.3vw;
    }

    #container.mobileView #gameLayer #topInfoBar #infoBarStats .infoBarStatContainer {
        margin-bottom: 0vw;
        height: 4vw;
    }

    #container.mobileView #gameLayer #topInfoBar #infoBarStats .infoBarStatContainer .infoBarStatTitle {
        width: 24vw;
        float: left;
        text-align: right;
    }

    #container.mobileView #gameLayer #topInfoBar #infoBarStats .infoBarStatContainer .infoBarStatData {
        width: 4vw;
        float: right;
        text-align: center;
        font-weight: bold;
    }

    #container.mobileView #gameLayer #topInfoBar #showScoringRemindersBtn {
        font-size: 2.7vw;
        margin: 1.4vw 0vw 0vw 5vw;
        padding: 0vw 4vw;
    }

    #container.mobileView #gameLayer #gameSectionsParent {
        width: 96%;
        top: 12vw;
    }

    #container.mobileView #gameLayer .gameSectionOverlayParent .gameSectionOverlayBorder.outerBorder {
        border-bottom-width: .187vw;
        border-bottom-right-radius: .55vw;
        border-bottom-left-radius: .55vw;
        border-right-style: solid;
        border-right-width: .187vw;
        border-left-width: .187vw;
        padding: .187vw;
        height: 3.34vw;
    }

    #container.mobileView #gameLayer .gameSectionOverlayParent .gameSectionOverlayBorder.innerBorder {
        border-bottom-width: .374vw;
        border-bottom-right-radius: .55vw;
        border-bottom-left-radius: .55vw;
        border-right-width: .374vw;
        border-left-width: .374vw;
        height: 2.79vw;
    }

    #container.mobileView #gameLayer #gameSectionsParent .gameSection .gameSectionBg {
        opacity: 0.6;
        position: absolute;
        top: -2%;
        left: -2%;
        width: 153%;
        max-width: 153%;
        z-index: -9;
        border-radius: 3vw;
    }

    /* #container.mobileView #gameLayer #gameSectionsParent .gameSection .gameSectionContent {
        padding-top: 1.8vw;
    } */

    #container.mobileView #gameLayer .titleContainer {
        top: 2.2vw;
        left: 5vw;
        height: 5vw;
        border-bottom: .2vw solid #003823;
    }

    #container.mobileView #gameLayer #marketTitleContainer.titleContainer {
        width: 17vw;
    }

    #container.mobileView #gameLayer #playerTableauTitleContainer.titleContainer {
        width: 15vw;
    }

    #container.mobileView #gameLayer .titleContainer .title {
        font-size: 5vw;
    }

    #container.mobileView #swapSectionsIcon, #container.mobileView #swapSectionsIcon {
        font-size: 8vw;
        width: 8vw;
        height: 8vw;
        top: 39.4vw;
        left: 44vw;
        box-shadow: 0vw 0vw 0.6vw 0.6vw #424242;
    }

    #container.mobileView #swapSectionsIcon, #container.mobileView #swapSectionsIcon.expanded {
        top: 39.4vw;
    }

    #container.mobileView #swapSectionsIcon, #container.mobileView #swapSectionsIcon.collapsed {
        top: 97vw;
    }
    
    
    /* 
        __  ___              __          __ 
       /  |/  /____ _ _____ / /__ ___   / /_
      / /|_/ // __ `// ___// //_// _ \ / __/
     / /  / // /_/ // /   / ,<  /  __// /_  
    /_/  /_/ \__,_//_/   /_/|_| \___/ \__/ 
                                            
    *Mobile*
    */

    #container.mobileView #marketContainerOuterOverlay {
        height: 100vw;
        width: 96vw;
        left: 0vw;
    }
    
    #container.mobileView #marketContainerOuterOverlay.expanded {
        top: 0vw;
    }

    #container.mobileView #marketContainerOuterOverlay.collapsed {
        top: -57.5vw;
    }

    #container.mobileView #marketContainerInnerOverlay {
        width: 95.2vw;
    }

    #container.mobileView #marketContainerInnerOverlay.expanded {
        top: 0vw;
    }

    #container.mobileView #marketContainerInnerOverlay.collapsed {
        top: 57.5vw;
    }

    #container.mobileView #marketSection {
        height: 102vw;
        top: 0vw;
    }

    #container.mobileView #marketSection .gameSectionContent {
        top: 0vw;
    }

    #container.mobileView #marketSection .gameSectionContent.expanded {
        top: 0vw;
    }

    #container.mobileView #marketSection .gameSectionContent.collapsed {
        top: -18vw;
    }
    
    #container.mobileView #marketSection #marketCardColumns {
        padding: 0vw 0vw 0vw 0vw;
        top: 10vw;
        left: 1.5vw;
    }

    #container.mobileView #marketSection .marketColumn:first-child {
        margin: 0vw 0vw 0vw 0vw;
    }

    #container.mobileView #marketSection .marketColumn {
        width: 20.5vw;
        margin: 0vw 0vw 0vw 3.3vw;
    }

    #marketSection .marketColumn .cardsAndItemContainer {
        height: 77vw;
    }

    /* 
        ____          __ 
       / __ \ ____   / /_
      / /_/ // __ \ / __/
     / ____// /_/ // /_  
    /_/     \____/ \__/
    
    *Mobile*
    */


    #container.mobileView #marketSection .marketColumn .plantPotContainer {
        transition: left 1.0s ease-in-out;
        width: 10.3vw;
        height: 9.1vw;
    }

    #container.mobileView #marketSection .marketColumn .plantPotContainer.expanded.startingPos {
        transition: left 1.0s ease-in-out;
        left: 0vw;
    }

    #container.mobileView #marketSection .marketColumn .plantPotContainer.expanded.startingPos.startingPosAnimate {
        left: -98vw;
    }

    /* 
       ______                  __               
      / ____/____ _ _____ ____/ /_____       __ 
     / /    / __ `// ___// __  // ___/    __/ /_
    / /___ / /_/ // /   / /_/ /(__  )    /_  __/
    \____/ \__,_//_/    \__,_//____/      /_/   
        ____ __                                 
       /  _// /_ ___   ____ ___   _____         
       / / / __// _ \ / __ `__ \ / ___/         
     _/ / / /_ /  __// / / / / /(__  )          
    /___/ \__/ \___//_/ /_/ /_//____/ 
    
    *Mobile*
    *Static Styles*                                                                                                                   
    */


    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"],
    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .flip-plant,
    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .flip-plant .backOfCardContainer,
    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"],
    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .flip-room,
    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .flip-room .backOfCardContainer {
        height: 32.1vw;
        width: 20.5vw;
        transform: scale(1);
    }

    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .cardContainerOverlay.collapsed,
    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .cardContainerOverlay.collapsed {
        top: 20vw;
    }

    /*
        ____   __               __          
       / __ \ / /____ _ ____   / /_         
      / /_/ // // __ `// __ \ / __/         
     / ____// // /_/ // / / // /_           
    /_/    /_/ \__,_//_/ /_/ \__/           
       ______                  __           
      / ____/____ _ _____ ____/ /           
     / /    / __ `// ___// __  /            
    / /___ / /_/ // /   / /_/ /             
    \____/ \__,_//_/    \__,_/ 
                                                             
    *Mobile*
    */

    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-plant.expanded {
        left: 0vw;
    }

    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-plant.expanded.startingPosAnimate {
        transition: left 1.0s ease-in-out;
        left: 0vw;
    }

    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-plant.expanded.startingPosAnimate.startingPos {
        left: -98vw;
    }

    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"].collapsed {
        top: -20vw;
    }

    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="plant"] .cardContainerOverlay.collapsed {
        top: 20vw;
    }

    /* 
        __  ___              __          __ 
       /  |/  /____ _ _____ / /__ ___   / /_
      / /|_/ // __ `// ___// //_// _ \ / __/
     / /  / // /_/ // /   / ,<  /  __// /_  
    /_/  /_/ \__,_//_/   /_/|_| \___/ \__/  
        ____ __                             
       /  _// /_ ___   ____ ___             
       / / / __// _ \ / __ `__ \            
     _/ / / /_ /  __// / / / / /            
    /___/ \__/ \___//_/ /_/ /_/ 
                                            
    *Mobile*
    */

    #container.mobileView #marketSection .marketColumn .itemToken {
        width: 9vw;
        top: 34vw;
        left: 5.85vw;
    }

    #container.mobileView #marketSection .marketColumn .itemToken.expanded {
        top: 34vw;
        left: 5.85vw;
    }

    #container.mobileView #marketSection .marketColumn .itemToken.expanded.startingPosAnimate {
        transition: left 1.0s ease-in-out;
        top: 34vw;
        left: 5.85vw;
    }


    #container.mobileView #marketSection .marketColumn .itemToken.expanded.startingPosAnimate.startingPos {
        top: 34vw;
        left: -100vw;
    }

    #container.mobileView #marketSection .marketColumn .itemToken.collapsed {
        top: 13.8vw;
        left: 5.85vw;
    }
    
    /* 
        ____                         
       / __ \ ____   ____   ____ ___ 
      / /_/ // __ \ / __ \ / __ `__ \
     / _, _// /_/ // /_/ // / / / / /
    /_/ |_| \____/ \____//_/ /_/ /_/ 
       ______                  __    
      / ____/____ _ _____ ____/ /    
     / /    / __ `// ___// __  /     
    / /___ / /_/ // /   / /_/ /      
    \____/ \__,_//_/    \__,_/ 
                                    
    *Mobile*
    */

    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer > .cardContainer[type="room"].expanded {
        top: 45vw;
    }

    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer > .cardContainer[type="room"].collapsed {
        top: 4.5vw;
    }

    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .cardContainer[type="room"] .cardContainerOverlay.collapsed {
        top: 20vw;
    }

    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room.expanded {
        top: 45vw;
        left: 0vw;
    }
    
    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room.expanded.startingPosAnimate {
        transition: left 1.0s ease-in-out;
        top: 45vw;
        left: 0vw;
    }
    

    #container.mobileView #marketSection .marketColumn .cardsAndItemContainer .flip-card.flip-back.flip-room.expanded.startingPosAnimate.startingPos {
        top: 45vw;
        left: -98vw;
    }

    #container.mobileView .cardContainer[type="room"],
    #container.mobileView .flip-room,
    #container.mobileView .flip-room .backOfCardContainer {
        height: 32.1vw;
        width: 20.5vw;
    }


    /* 
        ______ __ _              
       / ____// /(_)____         
      / /_   / // // __ \        
     / __/  / // // /_/ /        
    /_/    /_//_// .___/         
       ______   /_/            __
      / ____/____ _ _____ ____/ /
     / /    / __ `// ___// __  / 
    / /___ / /_/ // /   / /_/ /  
    \____/ \__,_//_/    \__,_/ 
                                 
    *Mobile*
    */

    #container.mobileView .flip-card {
        height: 32.1vw;
        width: 20.5vw;
    }

    #container.mobileView .cardContainer,
    #container.mobileView .flip-card {
        border-radius: 1.2vw;
    }

    #container.mobileView .cardContainer,
    #container.mobileView .backOfCardContainer {
        height: 32.1vw;
        width: 20.5vw;
    }

    /*                                                                                     
     ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______
    /_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____/
     _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _    
    (_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)   
                       ______        __     __                                          
            __/|_     /_  __/____ _ / /_   / /___   ____ _ __  __       __/|_           
           |    /      / /  / __ `// __ \ / // _ \ / __ `// / / /      |    /           
          /_ __|      / /  / /_/ // /_/ // //  __// /_/ // /_/ /      /_ __|            
           |/        /_/   \__,_//_.___//_/ \___/ \__,_/ \__,_/        |/               
                                    
     _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _  _       
    (_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)      
     ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______       
    /_____//_____//_____//_____//_____//_____//_____//_____//_____//_____//_____/       
    
    *Mobile*
    */

    #container.mobileView #tableauContainerOuterOverlay,
    #container.mobileView #tableauContainerInnerOverlay,
    #container.mobileView #tableauSection,
    #container.mobileView #tableauSection .gameSectionContent {
        height: 146vw;
        width: 96vw;
    }

    #container.mobileView #tableauContainerOuterOverlay {
        width: 96vw;
    }

    #container.mobileView #tableauContainerInnerOverlay {
        width: 95vw;
    }



    

    #container.mobileView #tableauSection,
    #container.mobileView #tableauSection .gameSectionContent {
        top: 0vw;
    }

    #container.mobileView #tableauContainerOuterOverlay {
        top: 44.5vw;
    }

    #container.mobileView #tableauContainerOuterOverlay.expanded {
        top: 44.5vw;
    }

    #container.mobileView #tableauContainerOuterOverlay.collapsed {
        top: 28vw;
    }

    #container.mobileView #tableauContainerInnerOverlay {
        top: 0vw;
    }

    #container.mobileView #tableauContainerInnerOverlay.expanded {
        top: 0vw;
    }

    #container.mobileView #tableauContainerInnerOverlay.collapsed {
        top: 74vw;
    }

    #container.mobileView #tableauSection .gameSectionContent.expanded {
        top: 0vw;
    }

    #container.mobileView #tableauSection .gameSectionContent.collapsed {
        top: -8.8vw;
    }

    #container.mobileView #tableauSection .gameSectionBorder {
        height: 124.5vw;
    }

    #container.mobileView #tableauSection .gameSectionOverlayParent {
        top: 103vw;
    }

    #container.mobileView #tableauSection .gameSectionOverlayParent.expanded {
        top: 103vw;
    }

    #container.mobileView #tableauSection .gameSectionOverlayParent.collapsed {
        top: 48vw;
    }

    #container.mobileView #tableauSection #homeContentContainer {
        height: 142.5vw;
        top: 2.1vw;
    }

    #container.mobileView #tableauSection #homeContentContainer.expanded {
        top: 2.1vw;
    }

    #container.mobileView #tableauSection #homeContentContainer.collapsed {
        top: 1vw;
    }

    #container.mobileView #tableauSection #playerInfoContainer {
        width: 96vw;
        height: 40vw;
        margin-right: 0vw;
        position: absolute;
        top: 0vw;
        left: 0vw;
    }

    #container.mobileView #tableauSection #playerInfoContainer.expanded {
        top: 0vw;
    }

    #container.mobileView #tableauSection #playerInfoContainer.collapsed {
        top: 11vw;
    }

    #container.mobileView #tableauSection #playerInfoContainer #cardToPlace {
        top: -0.4vw;
        left: 49.8vw;
        width: 25.3vw;
        height: 40vw;
    }

    #container.mobileView #tableauSection #playerInfoContainer .playerInfoTitle {
        top: 21%;
        font-size: 3.1vw;
        line-height: 3.8vw;
        opacity: 1;
    }
/* 

    #container.mobileView #tableauSection #playerInfoContainer .playerInfoTitle.mobileElement {
        bottom: 45%;
        top: auto;
        z-index: 2;
        color: #3aa572d1;
        font-size: 3vw;
        height: 4.5vw;
        width: 79%;
        left: 11%;
        line-height: 3.2vw;
        opacity: 1;
    }

    #container.mobileView #tableauSection #playerInfoContainer .playerInfoTitle.mobileElement.expanded {
        opacity: 1;
    }

    #container.mobileView #tableauSection #playerInfoContainer .playerInfoTitle.mobileElement.collapsed {
        opacity: 0;
    } */

    #container.mobileView #tableauSection #playerInfoContainer #cardToPlace .flip-plant.expanded {
        transform-origin: left top;
        top: 1vw;
        left: .5vw;
        z-index: 3;
    }
    
    #container.mobileView #tableauSection #playerInfoContainer #cardToPlace .flip-plant.expanded.startingPosAnimate {
        transition: left 1.6s ease-in-out, top 1.6s ease-in-out;
        top: 1.1vw;
        left: .5vw;
    }
    
    #container.mobileView #tableauSection #playerInfoContainer #cardToPlace .flip-plant.expanded.startingPosAnimate.startingPos {
        top: -49.1vw;
        left: -29.5vw;
    }

    #container.mobileView #tableauSection #playerInfoContainer #cardToPlace #chosenCardBackground {
        top: 0vw;
        width: 102%;
        max-width: 102%;
        left: -0.2vw;
    }

    #container.mobileView #tableauSection #playerInfoContainer #cardToPlace #chosenCardBackground.expanded {
        top: 0vw;
        width: 100%;
        max-width: 100%;
        left: -0.2vw;
    }

    #container.mobileView #tableauSection #playerInfoContainer #cardToPlace #chosenCardBackground.collapsed {
        top: 5.9vw;
        width: 102%;
        max-width: 102%;
        left: -0.2vw;
    }

    #container.mobileView #tableauSection #playerInfoContainer #cardToPlace > .flip-plant,
    #container.mobileView #tableauSection #playerInfoContainer #cardToPlace > .cardContainer {
        transform-origin: left top;
        height: 32.1vw;
        width: 20.5vw;
        transform: scale(1.17);
        top: 1.1vw;
        left: 0.5vw;
    }

    #container.mobileView #tableauSection #playerInfoContainer .itemContainer {
        width: 14.2vw;
        height: 14.7vw;
        z-index: 0;
    }

    /* #container.mobileView #tableauSection #playerInfoContainer .itemContainer.expanded {
        width: 14.2vw;
        height: 14.7vw;
    }

    #container.mobileView #tableauSection #playerInfoContainer .itemContainer.collapsed {
        width: 14.2vw;
        height: 14.7vw;
    } */

    #container.mobileView #tableauSection #playerInfoContainer #chosenItemContainer.itemContainer,
    #container.mobileView #tableauSection #playerInfoContainer #chosenItemContainer.itemContainer {
        top: 0.2vw;
        left: 77.3vw;
    }

    #container.mobileView #tableauSection #playerInfoContainer #chosenItemContainer.itemContainer.expanded {
        top: 0.2vw;
        left: 77.3vw;
    }
    
    #container.mobileView #tableauSection #playerInfoContainer #chosenItemContainer.itemContainer.collapsed {
        top: 0.2vw;
        left: 77.3vw;
    }

    #container.mobileView #tableauSection #playerInfoContainer #storedItemContainer.itemContainer {
        top: 24.4vw;
        left: 77.3vw;
    }
    
    #container.mobileView #tableauSection #playerInfoContainer #storedItemContainer.itemContainer.expanded {
        top: 24.4vw;
        left: 77.3vw;
    }

    #container.mobileView #tableauSection #playerInfoContainer #storedItemContainer.itemContainer.collapsed {
        top: 24.4vw;
        left: 77.3vw;
    }

    #container.mobileView #tableauSection #playerInfoContainer .itemContainer .itemBackground {
        top: 0vw;
        left: 0vw;
        width: 100%;
        transform: scale(1);
    }

    #container.mobileView #tableauSection #playerInfoContainer .itemContainer .itemBackground.expanded {
        top: 0vw;
        left: 0vw;
        width: 100%;
        transform: scale(1);
    }

    #container.mobileView #tableauSection #playerInfoContainer .itemContainer .itemBackground.collapsed {
        top: 0vw;
        left: 0vw;
        width: 100%;
        transform: scale(1);
    }

    #container.mobileView #tableauSection #playerInfoContainer .storageIcon {
        position: absolute;
        top: 35vw;
        left: 88.4vw;
        font-size: 5.2vw;
        z-index: 3;
        opacity: 1;
        color: #0a704e;
    }

    #container.mobileView #tableauSection #playerInfoContainer .storageIcon.expanded {
        opacity: 1;
    }

    #container.mobileView #tableauSection #playerInfoContainer .storageIcon.collapsed {
        opacity: 0;
    }

    #container.mobileView #tableauSection #playerInfoContainer #swapItemsBtnContainer {
        width: 8.5vw;
        height: 9vw;
        top: 15.2vw;
        left: 80.2vw;
        opacity: 1;
    }

    #container.mobileView #tableauSection #playerInfoContainer #swapItemsBtnContainer.expanded {
        opacity: 1;
    }

    #container.mobileView #tableauSection #playerInfoContainer #swapItemsBtnContainer.collapsed {
        opacity: 0;
    }

    #container.mobileView #tableauSection #playerInfoContainer #swapItemsBtnContainer .swapItemsBtn {
        height: 93%;
        width: 97%;
        font-size: 7.3vw;
        line-height: 3.1vw;
    }

    /* 
        __  ___            
       /  |/  /____ _ ____ 
      / /|_/ // __ `// __ \
     / /  / // /_/ // /_/ /
    /_/  /_/ \__,_// .___/ 
                  /_/      
                  
    *Mobile*
    */

    #container.mobileView #tableauSection #homeContentContainer #mapContainerOuterOverlay {
        width: 93.2vw;
        height: 101vw;
        top: 40.6vw;
        right: 1.9vw;
        border-bottom-width: .5vw;
        border-bottom-right-radius: 2vw;
        border-bottom-left-radius: 2vw;
    }
    
    #container.mobileView #tableauSection #homeContentContainer #mapContainerOuterOverlay.expanded {
        top: 40.6vw;
    }
    
    #container.mobileView #tableauSection #homeContentContainer #mapContainerOuterOverlay.collapsed {
        top: -23vw;
    }
    
    #container.mobileView #tableauSection #homeContentContainer #mapContainerInnerOverlay {
        width: 92.3vw;
        height: 100%;
        border-right-width: .5vw;
        border-left-width: .5vw;
        border-top-width: .5vw;
        border-top-right-radius: 2vw;
        border-top-left-radius: 2vw;
    }
    
    #container.mobileView #tableauSection #homeContentContainer #mapContainerInnerOverlay.expanded {
        top: 0vw;
    }
    
    #container.mobileView #tableauSection #homeContentContainer #mapContainerInnerOverlay.collapsed {
        top: 31.7vw;
    }
    
    #container.mobileView #tableauSection #mapContainerOverlay {
        position: relative;
    }
    
    #container.mobileView #tableauSection #mapContainer {
        width: 100%;
        height: 100%;
        top: 0vw;
        right: 0vw;
    }
    
    #container.mobileView #tableauSection #mapContainer.expanded {
        top: 0vw;
        right: 0vw;
    }
    
    #container.mobileView #tableauSection #mapContainer.collapsed {
        top: -17vw;
        right: 0vw;
    }

    #container.mobileView #tableauSection #mapContainer #mapHiddenOverlay {
        top: -37vw;
        left: -62.5vw;
        width: 195vw;
        height: 151vw;
    }

    #container.mobileView #tableauSection #mapContainer #mapHiddenOverlay {
        margin-left: -51.7vw;
        margin-top: -38vw;
        top: 0vw;
        left: 0vw;
        width: 201.5vw;
        height: 169vw;
        transform: scale(.9);
    }

    #container.mobileView #tableauSection #mapContainer #mapHiddenOverlay.expanded {
        margin-left: -61vw;
        margin-top: -43vw;
    }

    #container.mobileView #tableauSection #mapContainer #mapHiddenOverlay.collapsed {
        margin-left: -61.5vw;
        margin-top: -59vw;
        top: 0vw;
        left: 0vw;
        width: 192vw;
        height: 169vw;
        transform: scale(.9);
    }

    #container.mobileView #tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer {
        height: 33.3vw;
        width: 20.9vw;
        margin: .5vw;
        padding: .2vw;
    }

    #container.mobileView #tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer.potentialPlacement.activePotentialPlacement {
        border-radius: 1.2vw;
    }

    #container.mobileView #tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer.collapsed {
        height: 33.3vw;
        width: 20.9vw;
        margin: .5vw;
        padding: .2vw;
    }

    #container.mobileView #tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer .cardContainer,
    #container.mobileView #tableauSection #mapContainer #mapHiddenOverlay .mapTileContainer .backOfCardContainer {
        height: 33.3vw;
    }

    #container.mobileView #tableauSection #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room.startingPosAnimate {
        transition: left 1.6s ease-in-out, top 1.6s ease-in-out;
        top: 0vw;
        left: 0vw;
    }

    #container.mobileView #tableauSection #mapContainer #mapHiddenOverlay #row-2-column-4 .flip-room.startingPosAnimate.startingPos {
        top: -93vw;
        left: -21vw;
    }
        
    /* 
        ____   __                        __       ______                  __        
    / __ \ / /____ _ _____ ___   ____/ /      / ____/____ _ _____ ____/ /        
    / /_/ // // __ `// ___// _ \ / __  /      / /    / __ `// ___// __  /         
    / ____// // /_/ // /__ /  __// /_/ /      / /___ / /_/ // /   / /_/ /          
    /_/    /_/ \__,_/ \___/ \___/ \__,_/       \____/ \__,_//_/    \__,_/           
    ____          __   _                            ____                       __
    / __ \ ____   / /_ (_)____   ____   _____       / __ \ ____ _ ____   ___   / /
    / / / // __ \ / __// // __ \ / __ \ / ___/      / /_/ // __ `// __ \ / _ \ / / 
    / /_/ // /_/ // /_ / // /_/ // / / /(__  )      / ____// /_/ // / / //  __// /  
    \____// .___/ \__//_/ \____//_/ /_//____/      /_/     \__,_//_/ /_/ \___//_/   
        /_/                                                                        
    */


    #tableauSection #mapContainer #placedCardOptions {
        height: 9.8vw;
        padding: 1.2vw 0.2vw 1.4vw 3vw;
        z-index: 14;
        bottom: 0vw;
        left: 0vw;
    }

    #tableauSection #mapContainer #placedCardOptions.expanded {
        bottom: 0vw;
    }

    #tableauSection #mapContainer #placedCardOptions.collapsed {
        bottom: -14vw;
    }

    #tableauSection #mapContainer #placedCardOptions .button {
        margin: .5vw 2.5vw;
        font-size: 3.1vw;
        width: 18vw;
        padding: 0.4vw 2vw;
        height: 7vw;
    }

    #tableauSection #mapContainer #placedCardOptions .button .icon ion-icon {
        width: 5vw;
        height: 5vw;
    }

    /* 
    _    __                 __                          
    | |  / /___   _____ ____/ /____ _ ____   _____ __  __
    | | / // _ \ / ___// __  // __ `// __ \ / ___// / / /
    | |/ //  __// /   / /_/ // /_/ // / / // /__ / /_/ / 
    |___/ \___//_/    \__,_/ \__,_//_/ /_/ \___/ \__, /  
        ____                       _            /____/__ 
    / __ \ ___   ____ _ __  __ (_)_____ ___   ____/ / 
    / /_/ // _ \ / __ `// / / // // ___// _ \ / __  /  
    / _, _//  __// /_/ // /_/ // // /   /  __// /_/ /   
    /_/ |_| \___/ \__, / \__,_//_//_/    \___/ \__,_/    
                    /_/                                  
    */

    #mapContainer #verdancyVisibilityContainer {
        width: 10vw;
        height: 11.5vw;
        top: 1vw;
        right: 2vw;
    }

    #mapContainer #verdancyVisibilityContainer.expanded {
        top: 1vw;
    }

    #mapContainer #verdancyVisibilityContainer.collapsed {
        top: 18vw;
    }

    #mapContainer #verdancyVisibilityContainer .verdancyVisibilityImg.verdancyMainImgInactive {
        top: 0vw;
        left: 0vw;
    }

    #mapContainer #verdancyVisibilityContainer .verdancyVisibilityImg.verdancyMainImg {
        top: 0vw;
        left: 0vw;
    }

    #mapContainer #verdancyVisibilityContainer .verdancyVisibilityImg.verdancyShadowImg {
        top: 0.4vw;
        left: 0.2vw;
    }

    #mapContainer #verdancyVisibilityContainer .showHideVerdancyIconContainer {
        top: 1.8vw;
        left: 2vw;
    }

    #mapContainer #verdancyVisibilityContainer .showHideVerdancyIconContainer .verdancyVisibilityIcon {
        top: 0vw;
        left: 0vw;
    }

    #mapContainer #verdancyVisibilityContainer .showHideVerdancyIconContainer .verdancyVisibilityIcon.verdancyIconMain {
        font-size: 6vw;
    }

    #mapContainer #verdancyVisibilityContainer .showHideVerdancyIconContainer .verdancyVisibilityIcon.verdancyIconShadow {
        font-size: 6.2vw;
    }

    #mapContainer #verdancyVisibilityContainer.disableVerdancyVisibility .showHideVerdancyIconContainer .verdancyVisibilityIcon.verdancyIconMain {
        color: #9b9b9b;
    }

    /* 
     _____                         
    /__  /  ____   ____   ____ ___ 
      / /  / __ \ / __ \ / __ `__ \
     / /__/ /_/ // /_/ // / / / / /
    /____/\____/ \____//_/ /_/ /_/ 
    
    *Mobile*
    */

    #container.mobileView #tableauSection #mapZoomControls {
        top: 1.5vw;
        left: 1vw;
        width: 23vw;
        height: 10vw;
    }

    #container.mobileView #tableauSection #mapZoomControls.expanded {
        top: 1.5vw;
    }

    #container.mobileView #tableauSection #mapZoomControls.collapsed {
        top: 17.5vw;
    }

    #container.mobileView #tableauSection #mapZoomControls .zoomIcon {
        width: 10vw;
    }

    #container.mobileView #tableauSection #mapZoomControls .zoomIcon.zoomOutIcon {
        top: 0vw;
        left: 0vw;
    }

    #container.mobileView #tableauSection #mapZoomControls .zoomIcon.zoomInIcon {
        top: 0vw;
        left: 13vw;
    }

    /* 
        _   __               _                __   _             
       / | / /____ _ _   __ (_)____ _ ____ _ / /_ (_)____   ____ 
      /  |/ // __ `/| | / // // __ `// __ `// __// // __ \ / __ \
     / /|  // /_/ / | |/ // // /_/ // /_/ // /_ / // /_/ // / / /
    /_/ |_/ \__,_/  |___//_/ \__, / \__,_/ \__//_/ \____//_/ /_/ 
                            /____/                               
                            
    *Mobile*
    */

    #container.mobileView #tableauSection #mapNavControls {
        bottom: .5vw;
        right: .5vw;
        width: 26vw;
        height: 26vw;
        opacity: 1;
    }

    #container.mobileView #tableauSection #homeContentContainer #mapNavControls.expanded {
        bottom: .5vw;
    }

    #container.mobileView #tableauSection #homeContentContainer #mapNavControls.collapsed {
        bottom: 15.5vw;
    }

    #container.mobileView #tableauSection #mapNavControls #mapNavBackground {
        top: 0vw;
        right: 0vw;
    }

    /* 
        ___                                     
       /   |   _____ _____ ____  _      __ _____
      / /| |  / ___// ___// __ \| | /| / // ___/
     / ___ | / /   / /   / /_/ /| |/ |/ /(__  ) 
    /_/  |_|/_/   /_/    \____/ |__/|__//____/  
    
    *Mobile*                        
    */

    #container.mobileView #tableauSection #mapNavControls .arrowImg {
        width: 9vw;
    }

    /* Up Arrow */
    #container.mobileView #tableauSection #mapNavControls #upArrow.arrowImg {
        top: 1.9vw;
        right: 8.4vw;
    }

    /* Right Arrow */
    #container.mobileView #tableauSection #mapNavControls #rightArrow.arrowImg {
        top: 9.6vw;
        right: 1.3vw;
    }

    /* Down Arrow */
    #container.mobileView #tableauSection #mapNavControls #downArrow.arrowImg {
        top: 17.6vw;
        right: 9.1vw;
    }

    /* Left Arrow */
    #container.mobileView #tableauSection #mapNavControls #leftArrow.arrowImg {
        top: 9.2vw;
        right: 16.1vw;
    }


}
