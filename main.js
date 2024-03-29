var mainObj = {
	location: 'menu',
	breathing: true,
	interrupt: false,
	ghostToggle: true,
	firstInShapes: true,
};
document.addEventListener("DOMContentLoaded", function() {
	mainObj.ghostToggle = JSON.parse(localStorage.getItem("Settings"))
	if (mainObj.ghostToggle == null) {
		mainObj.ghostToggle = true
	}
	var toReset = []
	// menu on load animation
	breathingShapes()

	const menuItems = document.querySelectorAll(".menu-items"); // all shapes that are in the menu
	const menuColors = ['fill:#BA94D1;', 'fill:#BCCEF8;', 'fill:#98A8F8;', 'fill:#81C6E8;', 'fill:#47B5FF;']

	function breathingShapes(time = 2500) {
		if (!mainObj.breathing) {
			return
		}
		breathingTimeOut = setTimeout(breatheIn, time)
		return breathingTimeOut
	}

	function breatheIn() {
		for (let i = 0; i < menuItems.length; i++) {

			setTimeout(function() {
				if (mainObj.interrupt) {
					return
				}
				menuItems[i].style.cssText = menuColors[i] + 'scale:105%;'
				setTimeout(function() {
					if (mainObj.interrupt) {
						return
					}
					menuItems[i].style.cssText = 'scale:100%; fill:white'
				}, 400)
			}, 200 * i + 100)
		}
		breathingTimeOut = breathingShapes()
	}

	const menuShapesAndText = document.querySelectorAll(".menu-items")
	const menuShapes = document.querySelectorAll(".menu-strokes");
	const menuAllItems = document.getElementById("all-menu-items")
	const menuDiv = document.getElementById("menu-div")
	if (mainObj.location == 'menu') {
		// hover effect in menu
		for (let i = 0; i < menuShapes.length; i++) {
			menuShapesAndText[i].addEventListener("mouseover", function() {
				if (!mainObj.interrupt) {
					mainObj.breathing = false
					clearTimeout(breathingTimeOut)
					menuAllItems.append(menuShapesAndText[i])
					timeout = setTimeout(() => {
						menuShapesAndText[i].style.cssText = 'scale: 110%;' + menuColors[i]
					}, 50);
				}
			})
			menuShapes[i].addEventListener("mouseout", function() {
				breathingShapes(1000)
				if (!mainObj.interrupt) {
					mainObj.breathing = true
					menuShapesAndText[i].style.cssText = 'scale: 100%; fill:white;'
					clearTimeout(timeout)
				}
			})
		}
	}

	const directions = {
		play: 'transform: translate(0, -400%);',
		options: 'transform: translate(-400%, 0);',
		controls: 'transform: translate(0%, 400%);',
		leaderboard: 'transform: translate(200%, 400%);',
		shapes: 'transform: translate(400%, 0%);'
	}
	var whatToMove = {
		playStroke: 'play',
		optionsStroke: 'options',
		controlsStroke: 'controls',
		leaderboardStroke: 'leaderboard',
		shapesStroke: 'shapes'
	}


	function loadMenu() {
		setTimeout(function() {
			for (let i = 0; i < toReset.length; i++) {
				toReset[i].style.cssText = ''
			}
			toReset = []
		}, 500)
		if (mainObj.location != 'menu') {
			mainObj.location.style.cssText = 'z-index:0;opacity:0;'
			mainObj.location = 'menu'

		};
		setTimeout(function() {
			menuDiv.style.cssText = 'z-index:1;opcity:1;'
			for (let i = 0; i < menuShapesAndText.length; i++) {
				menuShapesAndText[i].style.cssText = 'transform:translate(0,0)' + 'transition-duration: 500ms;' + 'transition-delay:' + i * 200 + 'ms; opacity:1;'
			}
		}, 300)
		setTimeout(function() {
			mainObj.breathing = true
			mainObj.interrupt = false
			breathingShapes()
		}, 1200)
	}

	document.addEventListener("click", function(e) {
		targetId = e.target.id
		if (mainObj.location == 'menu') {
			if (Object.keys(whatToMove).includes(targetId)) {
				mainObj.breathing = false
				mainObj.interrupt = true
				clearTimeout(breathingTimeOut)
				for (let j = 0; j < menuShapesAndText.length; j++) {
					if (menuShapesAndText[j].id != whatToMove[e.target.id]) {
						menuShapesAndText[j].style.cssText = directions[menuShapesAndText[j].id] + 'transition-delay: ' + j * 100 + 'ms; opacity:0;'

					} else if (menuShapesAndText[j].id == whatToMove[e.target.id]) {
						menuShapesAndText[j].style.cssText = 'scale:125%; transition-duration:100ms;'
						setTimeout(function() {
							menuShapesAndText[j].style.cssText = 'scale:0%; transition-duration:400ms;opacity:0;'
						}, 200)

					}
				}
			}
		}
		if (targetId == 'controlsStroke') {
			showControls()
		} else if (targetId === "menuReturnStroke" || targetId === "game-over-return-menu") {
			if (mainObj.location == controlsDiv) {
				leaveControls()
			} else {
				loadMenu()
			}
		} else if (targetId == 'optionsStroke') {
			DrawGhostToggle(mainObj.ghostToggle, 0)
			showOptions()
		} else if (targetId == 'toggle-button') {
			optionsToggle()
		} else if (targetId == 'leaderboardStroke') {
			showLeaderboard()
		} else if (targetId == 'shapesStroke') {
			showShapes()
		} else if (targetId == 'playStroke') {
			playGame()
		}
	})
	const controlsDiv = document.getElementById("controls-div")
	const controlsItems = document.querySelectorAll(".controls-items")
	function showControls() {
		mainObj.location = controlsDiv
		setTimeout(function() {
			controlsDiv.style.cssText = 'opacity: 1; background: linear-gradient(rgb(242, 255, 210), rgb(246, 237, 188));z-index:2;'
			for (let i = 0; i < controlsItems.length; i++) {
				controlsItems[i].style.cssText = 'stroke-dashoffset: 0; transition-delay:' + i * 200 + 'ms;opacity:1;'
			}
		}, 400)
	}
	function leaveControls() {
		for (let i = 0; i < controlsItems.length; i++) {
			controlsItems[i].style.cssText = 'stroke-dasharray:1000; stroke-dashoffset:1000; transition-duration:200ms;opacity:1;'
			toReset.push(controlsItems[i])
		}
		setTimeout(function() {
			loadMenu()
		}, 800)
	}

	const optionsDiv = document.getElementById("options-div")
	function showOptions() {
		mainObj.location = optionsDiv
		optionsDiv.style.cssText = 'opacity:1; z-index:2;'
	}

	const ghostToggle = document.getElementById("toggle-button")
	const ghost = document.getElementById("ghost-stroke")
	const toggleText = document.getElementById("click-me")

	function optionsToggle() {
		if (mainObj.ghostToggle) {
			mainObj.ghostToggle = false
			DrawGhostToggle(mainObj.ghostToggle)
		} else if (!mainObj.ghostToggle) {
			mainObj.ghostToggle = true
			DrawGhostToggle(mainObj.ghostToggle)
		}
		localStorage.setItem('Settings', JSON.stringify(mainObj.ghostToggle))
	}

	function DrawGhostToggle(bool, fast = 500) {
		if (!bool) {
			ghostToggle.style.cssText = 'fill:black;'
			ghost.style.cssText = 'stroke-dasharray:60; stroke-dashoffset:60; transition-delay:0; transition-duration:' + fast + 'ms;'
			toggleText.style.cssText = 'fill:white'
		} else if (bool) {
			ghostToggle.style.cssText = 'fill:white;'
			ghost.style.cssText = 'stroke-dasharray:60; stroke-dashoffset:0; transition-duration:' + fast + 'ms;'
			toggleText.style.cssText = 'fill:black'

		}
	}

	const leaderboardDiv = document.getElementById("leaderboard-div")
	const leaderboardItems = document.querySelectorAll(".leaderboard-items")
	function showLeaderboard() {
		mainObj.location = leaderboardDiv
		setTimeout(function() {
			leaderboardDiv.style.cssText = 'opacity:1; z-index:1;'
			for (let i = 0; i < leaderboardItems.length; i++) {
				leaderboardItems[i].style.cssText = 'opacity:1; transition-delay:' + i * 100 + 'ms;'
				toReset.push(leaderboardItems[i])
			}

		}, 700)
	}

	const shapesDiv = document.getElementById("shapes-div")
	const shapesSvg = document.getElementById("shapes-svg")
	const shapesSteps = document.querySelectorAll(".shapes-steps");
	const allShapesToSelectFrom = document.querySelectorAll(".shapes-shapeselector-shape")

	shapesSelectorObject = JSON.parse(localStorage.getItem("Selected shapes"))
	if (shapesSelectorObject === null) {
		shapesSelectorObject = {}
	};
	shapesGridObject = JSON.parse(localStorage.getItem("Shape grid"))
	if (shapesGridObject === null) {
		shapesGridObject = {}
	}

	playerMadeShapes = JSON.parse(localStorage.getItem("Players shapes list"))
	if (playerMadeShapes == null) {
		playerMadeShapes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	}
	playerMadeShapesMapped = JSON.parse(localStorage.getItem("Players shapes"))
	if (playerMadeShapesMapped === null) {
		playerMadeShapesMapped = [
			[
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			]
		]
	};

	var IgnoredShapes = JSON.parse(localStorage.getItem("Faded shapes"))
	if (IgnoredShapes === null) {
		IgnoredShapes = []
	}
	var colors = ['#76BA99', '#417261', '#9CAA89', '#3D3D37', '#8D9EFF', '#FB8B23', '#A9AF7E']

	function showShapes() {
		mainObj.location = shapesDiv
		shapesDiv.style.cssText = 'opacity:1; z-index: 2; transition-duration:600ms;'
		for (let i = 0; i < allShapesToSelectFrom.length; i++) {
			element = allShapesToSelectFrom[i]
			shapesSvgInformation = shapesSvg.getBoundingClientRect()
			shapesSvgwidth = shapesSvgInformation.width
			shapesSvgheight = shapesSvgInformation.height
			surroundingRect = element.getBoundingClientRect()
			cx = (surroundingRect.x - shapesSvgInformation.x + surroundingRect.width / 2)
			cy = (surroundingRect.y - shapesSvgInformation.y + surroundingRect.height / 2)
			element.setAttribute('transform-origin', (cx / shapesSvgwidth) * 100 + '% ' + (cy / shapesSvgheight) * 100 + '%')
		}
		for (let i = 0; i < (Object.keys(shapesSelectorObject).length); i++) {
			if (shapesSelectorObject[Object.keys(shapesSelectorObject)[i]]) {
				document.getElementById(Object.keys(shapesSelectorObject)[i]).style.cssText = 'opacity:0.45;transform-duration:0;'
				document.getElementById(Object.keys(shapesSelectorObject)[i]).setAttribute('transform', 'scale(0.8)')
			}
		}


		drawGridboards()
		shapesDiv.addEventListener("click", shapesEventHandler)
	}

	function drawGridboards() {
		for (let i = 0; i < (Object.keys(shapesGridObject).length); i++) {
			if (shapesGridObject[Object.keys(shapesGridObject)[i]]) {
				if (IgnoredShapes.length > 1) {
					document.getElementById(Object.keys(shapesGridObject)[i]).style.cssText = 'fill:' + colors[(IgnoredShapes[Math.floor((Object.keys(shapesGridObject)[i] - 1) / 16)]).split("-")[1] - 1] + ';'
				} else if (IgnoredShapes.length == 1) {
					if (Object.keys(shapesGridObject)[i] < 17) {
						document.getElementById(Object.keys(shapesGridObject)[i]).style.cssText = 'fill:' + colors[(IgnoredShapes[0]).split("-")[1] - 1] + ';'
					} else {
						document.getElementById(Object.keys(shapesGridObject)[i]).style.cssText = 'fill: #344D67;'
					}
				} else {
					document.getElementById(Object.keys(shapesGridObject)[i]).style.cssText = 'fill: #344D67;'
				}
			}
		}
	};

	function shapesEventHandler(event) {
		let targetId = event.target.id
		element = document.getElementById(targetId)
		if (targetId == 'menuReturnStroke') {
			shapesDiv.removeEventListener("click", shapesEventHandler)
		}
		if (mainObj.firstInShapes) {
			for (let i = 0; i < shapesSteps.length; i++) {
				shapesSteps[i].style.cssText = 'stroke-dasharray:600; stroke-dashoffset:600; transition-duration:200ms;'
				setTimeout(function() {
					shapesSteps[i].style.cssText = 'opacity:0;stroke-dasharray:600; stroke-dashoffset:600;'
				}, 500)
			}
			mainObj.firstInShapes = false
		}
		if (event.target.classList[0] == 'shapes-grid-rect') {
			if (!shapesGridObject[targetId]) {
				shapesGridObject[targetId] = true
				element.style.cssText = 'fill:#344D67;'
				playerMadeShapes[targetId - 1] = 1;
			} else if (shapesGridObject[targetId]) {
				playerMadeShapes[targetId - 1] = 0;
				shapesGridObject[targetId] = false
				element.style.cssText = 'fill:#D9D9D9;'
			}
			// maps the list to two 4x4 matrices
			for (let i = 0; i < 2; i++) {
				for (let j = 0; j < playerMadeShapes.slice(0, 16).length; j++) {
					playerMadeShapesMapped[i][Math.floor(j / 4)][Math.floor(j % 4)] = playerMadeShapes.slice(i * 16, (i + 1) * 16)[j]
				}
			}
			localStorage.setItem('Players shapes mapped', JSON.stringify(playerMadeShapesMapped))
		}
		else if (event.target.classList[0] == 'shapes-shapeselector-shape') {
			if (!shapesSelectorObject[targetId]) {
				fadeShape(targetId)
				IgnoredShapes.push(targetId)
			} else if (shapesSelectorObject[targetId]) {
				liftShape(targetId)
				IgnoredShapes.splice(IgnoredShapes.indexOf(targetId), 1)
				drawGridboards()
			}
		}
		if (IgnoredShapes.length > 2) {
			liftShape(IgnoredShapes.shift())
		}
		drawGridboards()
		localStorage.setItem('Selected shapes', JSON.stringify(shapesSelectorObject))
		localStorage.setItem('Shape grid', JSON.stringify(shapesGridObject))
		localStorage.setItem('Players shapes list', JSON.stringify(playerMadeShapes))
		localStorage.setItem('Faded shapes', JSON.stringify(IgnoredShapes))
	}

	function fadeShape(targetId) {
		shapesSelectorObject[targetId] = true
		element.setAttribute('transform', 'scale(0.8)')
		element.style.cssText = 'opacity:0.45;'
	}
	function liftShape(targetId) {
		shapesSelectorObject[targetId] = false
		document.getElementById(targetId).setAttribute('transform', 'translate(0,0) scale(1)')
		document.getElementById(targetId).style.cssText = 'opcity:1;'
	}

	const gameBox = document.getElementById("game-box")

	function playGame() {
		mainObj.location = gameBox
		gameBox.style.cssText = "opacity:1;z-index:2"
		createCanvas()
		startGame()

	}
});

