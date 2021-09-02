<!DOCTYPE html>
<html>

<meta name="viewport" content="width=device-width, initial-scale=1">

<head>

	<title>Verdant</title>

	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma-extensions@4.0.0/dist/css/bulma-extensions.min.css">

	<link rel="stylesheet" type="text/css" href="css/styles.css">

	<!-- Favicon code -->
	<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
	<link rel="manifest" href="site.webmanifest">
	<link rel="mask-icon" href="safari-pinned-tab.svg" color="#5bbad5">
	<meta name="msapplication-TileColor" content="#da532c">
	<meta name="theme-color" content="#ffffff">


	<!-- Font for Titles -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Serif+Text&display=swap" rel="stylesheet">

	<!-- Font for Matching Lighting Types -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">

	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-F576KC8537"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() { dataLayer.push(arguments); }
		gtag('js', new Date());

		gtag('config', 'G-F576KC8537');
	</script>

</head>

<body>
	<div id="full-bg"></div>
	<div id="container">

		<div id="loaderLayer" class="layer">
			<div class="loader-parent">
				<div class="loader-container">
					<div class="loader-wrapper">
						<p class="loading-message">Loading</p>
						<div class="loader is-loading"></div>
					</div>
				</div>
			</div>
		</div>

		<div id="setupLayer" class="layer">

			<p id="mainVerdantTitle" class="title">
				<img src="img/title.png" title="Verdant Title" alt="Verdant Title" />
			</p>

			<p class="subtitle is-6">Verdant is a puzzly spatial card and token drafting game about houseplant collection and care, for 1-5 players, ages 10+.</p>

			<div id="homepageButtonContainer" class="buttons">
				<button id="frontPageGameInstructionsButton" class="button is-info" title="Instructions Button">Instructions</button>
				<button id="startGame" class="button is-success startCommenceButton" title="Start Game">Start Game</button>
			</div>

			<article id="demoDisclaimer" class="message is-success">
				<div class="message-body">
					<p>Hi!</p>
					<p>Welcome to the Verdant online demo! This is a browser-based version of the game that is intended to allow you to test out the experience of playing Verdant! The demo is an introductory game to give you a small sampling of the content from the full game. The final board game will have more than double the number of unique plant cards and feature dozens of end game scoring cards that can be mixed and matched to create nearly endless different puzzles!</p>
					<p>In order to learn the game, please click on the links to access the PDF rulebook and rules/playthrough videos of the game.</p>
					<p>We hope you enjoy the demo! If you liked what you played, you can make a pledge to receive a physical copy of the game <strong>for just $29!</strong> Please spread the word about the demo, challenge your friends to see who can create the most verdant home, and share your results on social media!</p>
					<p>#VerdantGame @flatoutgames</p>
					<p>Thank you!<br />
						The Flatout Games Verdant CoLab<br />
						Molly, Shawn, Robb, Dylan, Joseph, Kevin, and Aaron</p>
				</div>
			</article>

		</div>

		<div id="gameLayer" class="layer">

			<div id="topInfoBar">
				<p id="secondaryVerdantTitle" class="title">
					<img src="img/title.png" alt="Verdant Title">
				</p>

				<div id="infoBarStats">

					<div id="turnsRemainingContainer" class="infoBarStatContainer">
						<p id="turnsRemainingTitle" class="infoBarStatTitle">Turns Remaining:</p>
						<p id="turnsRemainingInfo" class="infoBarStatData">13</p>
						<div class="clear"></div>
					</div>

					<div id="greenThumbsAmountContainer" class="infoBarStatContainer">
						<p id="greenThumbsAmountTitle" class="infoBarStatTitle">Green Thumbs:</p>
						<p id="greenThumbsAmountInfo" class="infoBarStatData">2</p>
						<div class="clear"></div>
					</div>

				</div>

				<button id="showScoringRemindersBtn" class="button is-warning">Scoring</button>

				<ion-icon id="maximizeScreenIcon" name="expand" role="img" class="hydrated md gameLayerElement gameLayer-mobileElement" aria-label="expand"></ion-icon>
				<ion-icon id="minimizeScreenIcon" name="contract" role="img" class="hydrated md gameLayerElement gameLayer-mobileElement" aria-label="contract"></ion-icon>

			</div>

			<div id="gameSectionsParent">

				<div data-animation-group="market" id="marketContainerOuterOverlay" class="expanded gameSectionContainerOuterOverlay gameSectionContainerOverlay">
					<div data-animation-group="market" id="marketContainerInnerOverlay" class="expanded gameSectionContainerInnerOverlay gameSectionContainerOverlay">
						<div data-animation-group="market" id="marketSection" class="gameSection expanded initSetup animatingElem mediumTransition" style="transform-origin: left top;">
							<div class="bgOverlay"></div>
							<img class="gameSectionBg" src="img/bg.jpg" alt="">
							<div data-animation-group="market" class="gameSectionContent expanded">
								<div id="marketTitleContainer" class="titleContainer">
									<p id="marketTitle" class="title is-3 has-text-centered">Market</p>
								</div>
								<div id="marketCardColumns"></div>
							</div>
						</div>
					</div>
				</div>

				<div data-animation-group="tableau" id="swapSectionsIcon" class="collapsed initSetup">
					<ion-icon name="arrow-up-circle-outline" role="img" class="md hydrated" aria-label="arrow up circle outline"></ion-icon>
				</div>

				<div data-animation-group="tableau" id="tableauContainerOuterOverlay" class="collapsed gameSectionContainerOuterOverlay gameSectionContainerOverlay">
					<div data-animation-group="tableau" id="tableauContainerInnerOverlay" class="collapsed gameSectionContainerInnerOverlay gameSectionContainerOverlay">
						<div data-animation-group="tableau" id="tableauSection" class="gameSection initSetup">
							<div class="bgOverlay"></div>
							<img class="gameSectionBg" src="img/bg.jpg" alt="">
							<div data-animation-group="tableau" class="gameSectionContent collapsed">
								<div id="playerTableauTitleContainer" class="titleContainer">
									<p id="playerTableauTitle" class="title is-3 has-text-centered">Home</p>
								</div>
								<div data-animation-group="tableau" id="homeContentContainer" class="collapsed">
									<div data-animation-group="tableau" id="playerInfoContainer" class="animatingElem mediumTransition collapsed" style="transform-origin: left top;">

										<div data-animation-group="tableau" id="cardToPlace" class="collapsed">
											<p data-animation-group="tableau" class="playerInfoTitle collapsed has-text-centered">Card to<br />place</p>
											<img data-animation-group="tableau" id="chosenCardBackground" class="collapsed" src="img/card-storage.png">
										</div>

										<div data-animation-group="tableau" id="chosenItemContainer" class="itemContainer collapsed">
											<p data-animation-group="tableau" class="playerInfoTitle collapsed has-text-centered">Chosen<br />Item</p>
											<img data-animation-group="tableau" id="chosenItemBackground" class="itemBackground collapsed" src="img/item-storage.png">
										</div>

										<div data-animation-group="tableau" id="swapItemsBtnContainer" class="animatingElem mediumTransition collapsed" title="Swap Items" style="transform-origin: left top;">

											<button data-animation-group="tableau" data-swap-type="chosen-to-stored" class="button is-primary swapItemsBtn animatingElem mediumTransition expanded activeBtn" title="Swap Items" disabled="">
												<ion-icon name="arrow-down-outline"></ion-icon>
											</button>

											<button data-animation-group="tableau" data-swap-type="stored-to-chosen" class="button is-primary swapItemsBtn animatingElem mediumTransition expanded" title="Swap Items" disabled="">
												<ion-icon name="arrow-up-outline"></ion-icon>
											</button>

											<button data-animation-group="tableau" data-swap-type="both-items" class="button is-primary swapItemsBtn animatingElem mediumTransition expanded" title="Swap Items" disabled="">
												<ion-icon name="swap-vertical-outline"></ion-icon>
											</button>
										</div>

										<ion-icon data-animation-group="tableau" name="archive" class="storageIcon collapsed"></ion-icon>

										<div data-animation-group="tableau" id="storedItemContainer" class="itemContainer collapsed">
											<p data-animation-group="tableau" class="playerInfoTitle collapsed has-text-centered">Stored<br />Item</p>
											<img data-animation-group="tableau" id="storedItemBackground" class="itemBackground collapsed" src="img/item-storage.png">
										</div>

									</div>

									<div data-animation-group="tableau" id="mapContainerOuterOverlay" class="collapsed">
										<div data-animation-group="tableau" id="mapContainerInnerOverlay" class="collapsed">
											<div data-animation-group="tableau" id="mapContainer" class="collapsed">

												<div data-animation-group="tableau" id="verdancyVisibilityContainer" class="collapsed showVerdancy disableVerdancyVisibility">

													<div data-animation-group="tableau" id="verdancyVisibilityContainerOverlay" class="collapsed animatingElem mediumTransition">

														<img class="verdancyVisibilityImg verdancyMainImgInactive" src="img/verdancy-inactive2.png" alt="">
														<img class="verdancyVisibilityImg verdancyMainImg" src="img/verdancy-active.png" alt="">
														<img class="verdancyVisibilityImg verdancyShadowImg" src="img/verdancy-shadow.png" alt="">

														<div id="showVerdancyIconContainer" class="showHideVerdancyIconContainer">
															<ion-icon name="eye-outline" class="verdancyIconMain showVerdancyIcon verdancyVisibilityIcon md hydrated" role="img" aria-label="eye outline"></ion-icon>
															<ion-icon name="eye-outline" class="verdancyIconShadow showVerdancyIcon verdancyVisibilityIcon md hydrated" role="img" aria-label="eye outline"></ion-icon>
														</div>

														<div id="hideVerdancyIconContainer" class="showHideVerdancyIconContainer">
															<ion-icon name="eye-off-outline" class="verdancyIconMain hideVerdancyIcon verdancyVisibilityIcon md hydrated" role="img" aria-label="eye off outline"></ion-icon>
															<ion-icon name="eye-off-outline" class="verdancyIconShadow hideVerdancyIcon verdancyVisibilityIcon md hydrated" role="img" aria-label="eye off outline"></ion-icon>
														</div>

													</div>

												</div>

												<div data-animation-group="tableau" id="mapZoomControls" class="collapsed">
													<div data-animation-group="tableau" id="mapZoomControlsOverlay" class="collapsed animatingElem mediumTransition">
														<img data-zoom-mode="zoomOut" class="zoomIcon zoomOutIcon activeZoom" src="img/map/zoomOut.png" />
														<img data-zoom-mode="zoomIn" class="zoomIcon zoomInIcon activeZoom" src="img/map/zoomIn.png" />
													</div>
												</div>

												<div data-animation-group="tableau" id="mapNavControls" class="animatingElem mediumTransition collapsed" style="transform-origin: left top;">
													<div data-animation-group="tableau" id="mapNavControlsOverlay" class="collapsed animatingElem mediumTransition">
														<img id="mapNavBackground" src="img/map/woodCircle.png" />
														<img data-direction="up" id="upArrow" class="arrowImg" src="img/map/arrow.png" />
														<img data-direction="right" id="rightArrow" class="arrowImg" src="img/map/arrow.png" />
														<img data-direction="down" id="downArrow" class="arrowImg" src="img/map/arrow.png" />
														<img data-direction="left" id="leftArrow" class="arrowImg" src="img/map/arrow.png" />
													</div>
												</div>

												<div id="placedCardOptions" class="collapsed">

													<button id="cancelCardPlacement" class="button is-danger">
														<span>Cancel</span>
														<span class="icon">
															<ion-icon name="close-circle" role="img" class="md hydrated" aria-label="close circle"></ion-icon>
														</span>
													</button>

													<button id="confirmCardPlacement" class="button is-success">
														<span>Confirm</span>
														<span class="icon">
															<ion-icon name="checkmark-circle" role="img" class="md hydrated" aria-label="checkmark circle"></ion-icon>
														</span>
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="placeFirstCardModal" class="modal notificationModal">
		<div class="modal-background"></div>
		<div class="modal-content">
			<div class="notification">
				<button class="delete closeModalTrigger smallCloseCross" aria-label="close" title="Close button image"></button>
				<p class="has-text-centered">Choose the position of your starting plant card.</p>
				<button id="placeFirstPlantCardBtn" class="button is-danger closeModalTrigger button-is-centered" title="Close modal button">Close</button>
			</div>
		</div>
	</div>

	<div id="startFirstTurnModal" class="modal notificationModal">
		<div class="modal-background"></div>
		<div class="modal-content">
			<div class="notification">
				<button class="delete closeModalTrigger smallCloseCross" aria-label="close" title="Close button image"></button>
				<p class="has-text-centered">Now choose a card and item from the market to place in your home.</p>
				<button id="startFirstTurnBtn" class="button is-danger closeModalTrigger button-is-centered" title="Close modal button">Close</button>
			</div>
		</div>
	</div>

	<div id="scoringReminderModal" class="modal notificationModal">
		<div class="modal-background"></div>
		<div class="modal-content">
			<div class="notification">
				<button class="delete closeModalTrigger largeCloseCross" aria-label="close" title="Close button image"></button>
				<img id="scoringAidImg" src="img/scoring-aid.jpg" />
				<button id="scoringReminderBtn" class="button is-danger closeModalTrigger button-is-centered" title="Close modal button">Close</button>
			</div>
		</div>
	</div>

	<script type="module" src="https://unpkg.com/ionicons@5.0.0/dist/ionicons/ionicons.esm.js"></script>
	<script nomodule="" src="https://unpkg.com/ionicons@5.0.0/dist/ionicons/ionicons.js"></script>
	<script defer src="https://cdn.jsdelivr.net/npm/bulma-extensions@4.0.0/dist/js/bulma-extensions.min.js"></script>
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script type="text/javascript" src="js/data.js"></script>
	<script type="text/javascript" src="js/animations.js"></script>
	<script type="text/javascript" src="js/scripts.js"></script>

</body>

</html>
