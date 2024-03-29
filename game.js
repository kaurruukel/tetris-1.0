var gameState = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

var colors = ['#76BA99', '#417261', '#9CAA89', '#3D3D37', '#8D9EFF', '#FB8B23', '#A9AF7E']

var firstRun = true
var falling = false
var firstshape = true
var refresh = false

function startGame() {
	shapes = loadPlayerShapes()
	setTimeout(function() {
		gameTimeout = gameClock() // starts everything
	}, 500)
	gameBox.addEventListener("click", handler)
};
function handler(event) {
	let target = event.target.id

	if (target === 'menuReturnStroke') {
		clearTimeout(gameTimeout)
		setTimeout(function() {
			clearGame()
		}, 600)
		gameBox.removeEventListener("click", handler)
	}
}


function gameClock() {
	gameTimeout = setTimeout(main, gameTimer)
	return gameTimeout
}

function main(once = false) {
	if (!falling) {
		x = 0
		y = 0
		if (checkGameEnd()) {
			clearInterval(gameTimeout)
			return
		}
		falling = true;
		shapeinfo = generatePieces()
		shape = shapeinfo[0]

		coordinates = getCoordinates(shape, 0, 0)
		drawShapeAndMapCoords(coordinates, false)
		createShapeGhost(coordinates)
		firstshape = true
	}
	if (!firstshape) {
		coordinates = moveDown(coordinates)
	}
	if (refresh) {
		refresh = false
		clearTimeout(gameTimeout)
		main()
		return
	}
	y += 1
	if (!once) {
		firstshape = false
		clearTimeout(gameTimeout)
		gameClock()
	}

}

function checkGameEnd() {
	if (gameState[0][5] != 0) {
		gameover = true
		gameEnd()
		return gameover
	}
}

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
boxSize = canvas.getBoundingClientRect().width / gameState[0].length

function createCanvas() {
	canvas.height = boxSize * gameState.length;
	canvas.width = boxSize * gameState[0].length;

	ctx.lineWidth = 1 / 12;
	ctx.scale(boxSize, boxSize);
	ctx.strokeStyle = '#FB9C80';

	for (let a = 0; a < gameState.length; a++) {
		for (let b = 0; b < gameState[a].length; b++) {
			if (gameState[a][b] == 0) {
				ctx.fillStyle = 'rgba(0,0,0,0)'
				ctx.rect(b, a, 1, 1)
				ctx.fillRect(b, a, 1, 1)

			} else if (gameState[a][b] != 0) {
				ctx.fillStyle = colors[gameState[a][b] - 1]
				ctx.rect(b, a, 1, 1)
				ctx.fillRect(b, a, 1, 1)
			}
		}
	};
}

function loadPlayerShapes() {
	var playerMadeShapesMapped = JSON.parse(localStorage.getItem("Players shapes mapped"))
	var IgnoredShapes = JSON.parse(localStorage.getItem("Faded shapes"))
	shapes = [...originalShapes]

	if (playerMadeShapesMapped === null || IgnoredShapes === null || playerMadeShapesMapped.length === 0 || IgnoredShapes.length === 0) {
		return shapes
	}

	// check playerMadeShapedMapped
	let tempShapesMapped = playerMadeShapesMapped

	for (let i = 0; i < playerMadeShapesMapped.length; i++) {
		shapesIsDrawn = false
		for (let j = 0; j < playerMadeShapesMapped[i].length; j++) {
			if (playerMadeShapesMapped[i][j].includes(1)) {
				shapesIsDrawn = true
			}
		}
		if (!shapesIsDrawn) {
			if (i == 0) {
				IgnoredShapes.shift()
				tempShapesMapped.shift()
			} else if (i == 1) {
				tempShapesMapped.pop()
				IgnoredShapes.pop()
			}
		}
	}
	playerMadeShapesMapped = tempShapesMapped
	if (playerMadeShapesMapped.length == 0) {
		return shapes
	}
	for (let i = 0; i < playerMadeShapesMapped.length; i++) {
		stopper = false
		while (!stopper) {
			playerMadeShapesMapped[i] = concentrateShape(playerMadeShapesMapped[i])
		}
	}
	if (IgnoredShapes.length == 0) {
		return shapes
	}
	else if (IgnoredShapes.length == 1) {
		shapes[IgnoredShapes[0].split("-")[1] - 1] = playerMadeShapesMapped[0]
	} else if (IgnoredShapes.length == 2) {
		for (let i = 0; i < playerMadeShapesMapped.length; i++) {
			shapes[IgnoredShapes[i].split("-")[1] - 1] = playerMadeShapesMapped[i]
		}
	}
	return shapes
}

function concentrateShape(shapeToCheck) {
	topRow = shapeToCheck[0]
	bottomRow = shapeToCheck[shapeToCheck.length - 1]
	let leftColumn = []
	let rightColumn = []
	for (let i = 0; i < shapeToCheck.length; i++) {
		leftColumn.push(shapeToCheck[i][0])
		rightColumn.push(shapeToCheck[i][shapeToCheck[i].length - 1])
	}
	if (!topRow.includes(1) && !leftColumn.includes(1)) {
		shapeToCheck.shift()
		for (let i = 0; i < shapeToCheck.length; i++) {
			shapeToCheck[i].shift()
		}
	} else if (!bottomRow.includes(1) && !leftColumn.includes(1)) {
		shapeToCheck.pop()
		for (let i = 0; i < shapeToCheck.length; i++) {
			shapeToCheck[i].shift()
		}
	} else if (!topRow.includes(1) && !rightColumn.includes(1)) {
		shapeToCheck.shift()
		for (let i = 0; i < shapeToCheck.length; i++) {
			shapeToCheck[i].pop()
		}
	} else if (!bottomRow.includes(1) && !rightColumn.includes(1)) {
		shapeToCheck.pop()
		for (let i = 0; i < shapeToCheck.length; i++) {
			shapeToCheck[i].pop()
		}
	} else {
		stopper = true
		return shapeToCheck
	}
	return shapeToCheck
}

upNextCanvases = document.querySelectorAll(".up-next-canvases")
function drawUpComingPieces(listOfShapes) {
	let currentShape = []
	let newshapes = []
	for (let i = 0; i < listOfShapes.length; i++) {
		currentShape = [...listOfShapes[i][0]]
		stop = false
		for (let j = 0; j < 4; j++) {
			currentShape = reduceHeightWidth(currentShape)
		}
		newshapes.push(currentShape)
		boxSizeUpNext = Math.floor(upNextCanvases[i].parentElement.clientWidth / 5)
		upNextCanvases[i].width = currentShape[0].length * boxSizeUpNext
		upNextCanvases[i].height = currentShape.length * boxSizeUpNext

		let ctx = upNextCanvases[i].getContext("2d")
		ctx.scale(boxSizeUpNext, boxSizeUpNext)

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let a = 0; a < currentShape.length; a++) {
			for (let b = 0; b < currentShape[a].length; b++) {
				if (currentShape[a][b] == 0) {
					ctx.fillStyle = 'rgba(0,0,0,0)'
					ctx.fillRect(b, a, 1, 1)
					ctx.rect(b, a, 1, 1)
				} else if (currentShape[a][b] != 0) {
					ctx.fillStyle = colors[listOfShapes[i][1]]
					ctx.strokeStyle = '#00000080'
					lineWidth = boxSizeUpNext / (boxSizeUpNext * 10)
					ctx.lineWidth = lineWidth
					ctx.beginPath()
					ctx.roundRect(b + lineWidth, a + lineWidth, 1 - lineWidth * 2, 1 - lineWidth * 2, [0.1])
					ctx.fill()
					ctx.stroke()
					ctx.closePath()
				}
			}
		}
	}
}

function reduceHeightWidth(tempshape) {
	matrixInf = [tempshape.map(x => x[0]), tempshape.map(x => x[tempshape[0].length - 1]), tempshape[0], tempshape[tempshape.length - 1]]
	for (let i = 0; i < matrixInf.length; i++) {
		if (!matrixInf[i].includes(1)) {
			if (i === 0) {
				tempshape = tempshape.map(function(val) {
					return val.slice(1, tempshape[0].length)
				})
			} else if (i === 1) {
				tempshape = tempshape.map(function(val) {
					return val.slice(0, tempshape[0].length - 1)
				})
			} else if (i === 2) {
				tempshape.shift()
			} else if (i === 3) {
				tempshape.pop()
			} else {
			}
		}
	}
	return tempshape
}

function drawGameState(gameState) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let a = 0; a < gameState.length; a++) {
		for (let b = 0; b < gameState[a].length; b++) {
			if (gameState[a][b] == 0) {
				ctx.fillStyle = 'rgba(0,0,0,0)'
				ctx.fillRect(b, a, 1, 1)
				ctx.rect(b, a, 1, 1)
			} else if (gameState[a][b] != 0) {
				ctx.fillStyle = colors[gameState[a][b] - 1]
				ctx.strokeStyle = '#00000080'
				ctx.lineWidth = 1 / 15
				ctx.beginPath()
				ctx.roundRect(b + 1 / 15 + 1 / 60, a + 1 / 15 + 1 / 60, 1 - 2 / 15, 1 - 2 / 15, [0.1])
				ctx.fill()
				ctx.stroke()
				ctx.closePath()
			}
		}
	}
}

function generatePieces() {
	// if its the first time being called, creates a list of three random shapes
	// all the other times adds a random piece to the list and returns the last one
	// calls the funciton that draws the upcoming pieces on the canvas
	let piece = []
	if (firstRun) {
		listOfRandomPieces = []
		for (let i = 0; i < 3; i++) {
			listOfRandomPieces.push(newPiece());
		}
		firstPieces = false
		drawUpComingPieces(listOfRandomPieces)
		firstRun = false
		shapeindex = listOfRandomPieces[2][1]
		return listOfRandomPieces[2]
	}
	piece = newPiece(shapes)
	listOfRandomPieces.unshift(piece)
	drawUpComingPieces(listOfRandomPieces.slice(0, 3))
	shapeindex = listOfRandomPieces[listOfRandomPieces.length - 1][1]
	return listOfRandomPieces.pop()
}

function newPiece() {
	//returns a matrix of a random piece and its index in the shapes list
	let shapeindex
	shapeindex = Math.floor(Math.random() * shapes.length)
	let shape = shapes[shapeindex]
	lastDrawnGhost = []
	return [shape, shapeindex]
}

function getCoordinates(shape, x = 0, y = 0) {
	let coordinates = []
	// gets the starting coordinates of every pixel of a shape
	for (let i = 0; i < shape.length; i++) {
		for (let j = 0; j < shape[i].length; j++) {

			if (shape[i][j] === 1) {
				let temp = [i + y, j + x + 4]; //add 4 because we want the shape to spawn in the kind of middle
				coordinates.push(temp);
			};
		};
	};
	return coordinates
};

function checkCollision(coords) {
	let state = 'clear';
	coords.forEach(e => {
		if (e[0] > gameState.length - 1 || gameState[e[0]][e[1]] != 0) {
			state = 'collides'
		};
	});
	return state
}

function drawShapeAndMapCoords(coordinates, map = false) {
	// values given in the 'coordinates' are printed to canvas; if deletePrev is true, then the last drawn shape is deleted from canvas; if map is true, then the coords are mapped to the gameState
	drawGameState(gameState)
	createShapeGhost(coordinates)
	coordinates.forEach(e => {
		ctx.beginPath()
		ctx.fillStyle = colors[shapeindex];
		ctx.strokeStyle = '#00000080'
		ctx.roundRect(e[1] + 1 / 15 + 1 / 60, e[0] + 1 / 15 + 1 / 60, 1 - 2 / 15, 1 - 2 / 15, [0.1])
		ctx.fill()
		ctx.stroke()
		ctx.closePath()
		if (map) {
			gameState[e[0]][e[1]] = shapeindex + 1;
		};
	});
};

function createShapeGhost(coords) {
	if (!mainObj.ghostToggle) {
		return
	}
	if (!coords) {
		coords = coordinates.slice()
	}
	ctx.fillStyle = '#BCCEF8';
	lastDrawnGhost.forEach(e => {
		ctx.clearRect(e[1], e[0], 1, 1);
	});
	lastDrawnGhost = []
	let ghostCoordinates = coords.slice()
	while (checkCollision(ghostCoordinates) == 'clear') {
		ghostCoordinates = ghostHelper(ghostCoordinates)
	}
	ctx.lineWidth = 1 / 12
	ctx.strokeStyle = colors[shapeindex] + '80'
	ghostCoordinates.forEach(e => {
		ctx.beginPath()
		ctx.roundRect(e[1] + 1 / 12, e[0] - 1 + 1 / 12, 1 - 1 / 6, 1 - 1 / 6, [0.15])
		// ctx.strokeRect(e[1]+1/12,e[0] - 1 + 1/12 ,1 - 1/6,1 - 1/6)
		ctx.stroke()
		temp = [e[0] - 1, e[1]]
		lastDrawnGhost.push(temp)
	})
}

function ghostHelper(coords) {
	let newGhostCoordinates = []
	coords.forEach(e => {
		temp = [e[0] + 1, e[1]];
		newGhostCoordinates.push(temp)
	});
	return newGhostCoordinates
}

function checkCompletedRows() {
	let completedRows = 0
	for (let i = 0; i < gameState.length; i++) {

		rowComplete = true
		gameState[i].forEach(a => {
			if (a == 0) {
				rowComplete = false
			}
		});
		if (rowComplete) {
			completedRows += 1;
			for (let f = i; f > 0; f--) {
				for (let a = 0; a < gameState[f].length; a++) {
					if (f != 0) {
						gameState[f][a] = gameState[f - 1][a]
					} else {
						gameState[f][a] = 0;
					}
				}
			}
		}
	};
	if (completedRows != 0) {
		completedRowsGlobal = completedRowsGlobal + completedRows
		if (completedRowsGlobal >= linesNeededForLevelUp) {
			levelup()
			completedRowsGlobal = completedRowsGlobal - linesNeededForLevelUp
		}
		updateScore(completedRows)
	};
}

function levelup() {
	level += 1
	normalTime = 200 + 800 / (level)
	gameTimer = normalTime
}

function updateScore(completedRows) {
	scoreToAdd = scoringAmount[completedRows - 1] * (level + 1);
	scoreAmount += scoreToAdd
	score.innerHTML = scoreAmount
	document.getElementById("level").innerHTML = level
}

function moveDown(coordinates) {
	let newCoordinates = []
	let temp = []
	coordinates.forEach(e => {
		temp = [e[0] + 1, e[1]]
		newCoordinates.push(temp)
	});
	if (checkCollision(newCoordinates) == 'clear') {
		drawShapeAndMapCoords(newCoordinates, false)
		return newCoordinates
	} else if (checkCollision(newCoordinates) == 'collides') {
		drawShapeAndMapCoords(coordinates, true)
		checkCompletedRows()
		drawGameState(gameState)
		falling = false
		refresh = true
		return
	}
}

function moveRight() {
	//covers movements to both sides; if right is true then moves right, when false moves left
	let newcoordinates = []
	coordinates.forEach(e => {
		if (right) {
			temp = [e[0], e[1] + 1]; //adds 1 to all the x value of the coordinates
		} else if (!right) {
			temp = [e[0], e[1] - 1];
		}
		newcoordinates.push(temp);
	});
	if (checkCollision(newcoordinates) == 'clear') {
		if (right) {
			x += 1;
		} else if (!right) {
			x -= 1;
		}
		createShapeGhost(newcoordinates)
		drawShapeAndMapCoords(newcoordinates, false, true);
		coordinates = newcoordinates;
	}
	return coordinates
};


function rotate(shape, clockWise) {
	let newshape = []
	let newcoordinates = []
	if (clockWise) {
		newshape = shape.map((val, index) => shape.map(row => row[index]).reverse())
	}
	if (!clockWise) {
		newshape = shape[0].map((val, index) => shape.map(row => row[row.length - 1 - index]));
	}
	newcoordinates = getCoordinates(newshape, x, y);
	if (checkCollision(newcoordinates) == 'clear') {
		createShapeGhost(newcoordinates)
		drawShapeAndMapCoords(newcoordinates, false, true)
		shape = newshape;
		coordinates = newcoordinates
	} else {
		coordinates, shape = checkIfMovingHelps(newshape)
	}
	return coordinates, shape
}

function checkIfMovingHelps(newshape) {
	let localCoordinates = []
	for (let i = 0; i < allowedMovements.length; i++) {
		pendingMovement = allowedMovements[i]
		localCoordinates = getCoordinates(newshape, x + pendingMovement[1], y + pendingMovement[0])
		if (checkCollision(localCoordinates) == 'clear') {
			coordinates = localCoordinates
			shape = newshape
			createShapeGhost(coordinates)
			drawShapeAndMapCoords(coordinates, false, true)
			x = x + pendingMovement[1]
			y = y + pendingMovement[0]
			return coordinates, shape
		}
	}
};

const gameBox = document.getElementById("game-box")
const gameOverDiv = document.getElementById("game-over-div")
const gameOverSvg = document.getElementById("game-over-svg")
const gameOverScoreDiv = document.getElementById("game-over-score-div")
const gameOverButtonsDiv = document.getElementById("game-end-buttons-div")
const gameOverButtons = document.querySelectorAll('.game-over-buttons-choices')
toReset = []

function gameEnd() {
	gameOverDiv.style.cssText = 'opacity:1; z-index:3;filter:blur(0);'
	toReset.push(gameOverDiv)
	document.getElementById("score-board").style.cssText = 'z-index:-1;'

	var children = gameBox.children
	for (let i = 0; i < children.length; i++) {
		if (children[i].id != 'game-over-div') {
			children[i].style.cssText = 'filter:blur(20px);'
			toReset.push(children[i])
		}
	}
	gameOverSvg.style.cssText = 'stroke-dashoffset:0;'
	toReset.push(gameOverSvg)
	scoreNumbers = scoreAmount.toString().split('')
	let nrs = []
	for (let i = 0; i < scoreNumbers.length; i++) {
		tempId = "number-" + scoreNumbers[i];
		var newNumber = document.getElementById(tempId).cloneNode(true)
		gameOverScoreDiv.appendChild(newNumber)
		nrs.push(newNumber)
	}
	setTimeout(() => {
		for (let j = 0; j < nrs.length; j++) {
			nrs[j].style.cssText = 'opacity:1; stroke-dashoffset:0; transition-duration:300ms;transition-delay: ' + 100 * j + 'ms;'
			toReset.push(nrs[j])
			setTimeout(() => {
				nrs[j].style.cssText = 'opacity:1; stroke-dashoffset:0; transition-duration:100ms;transition-delay: ' + 100 * j + 'ms; scale:100%;'
				nrs[j].children[0].style.cssText = ' fill: ' + colors[j % 6] + ';'
				toReset.push(nrs[j].children[0])
				if (nrs[j].children.length > 1) {
					nrs[j].children[1].style.cssText = 'fill:#FFFFFF40;'
					toReset.push(nrs[j].children[1])
				}
			}, 1000);
		}
	}, 500);
	var buttonsColors = [
		'fill: url(#my-gradient-0)',
		'fill: url(#my-gradient-1)'
	]
	setTimeout(() => {
		gameOverButtonsDiv.style.cssText = 'opacity:1;z-index:3;'
		toReset.push(gameOverButtonsDiv)
		for (let i = 0; i < gameOverButtons.length; i++) {
			gameOverButtons[i].style.cssText = buttonsColors[i]
			toReset.push(gameOverButtons[i])
		}
	}, 2000);
	gameOverDiv.addEventListener("click", eventHandler)
	function eventHandler(event) {
		let target = event.target.id
		if (target === 'game-over-restart') {
			gameOverDiv.removeEventListener("click", eventHandler)
			clearGame()
			startGame()
		} else if (target === 'game-over-return-menu') {
			gameOverDiv.removeEventListener("click", eventHandler)
			clearGame()
		}
	}
}

function clearGame() {
	for (let i = 0; i < toReset.length; i++) {
		toReset[i].style.cssText = ''
	}
	gameOverScoreDiv.innerHTML = ''
	for (let i = 0; i < gameState.length; i++) {
		for (let j = 0; j < gameState[i].length; j++) {
			gameState[i][j] = 0
		}
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	upNextCanvases = document.querySelectorAll(".up-next-canvases")
	for (let i = 0; i < upNextCanvases.length; i++) {
		let ctx = upNextCanvases[i].getContext("2d")
		ctx.clearRect(0, 0, upNextCanvases[i].width, upNextCanvases[i].height)
	}
	falling = false
	firstRun = true
	firstshape = true
	listOfRandomPieces = []
	scoreAmount = 0
	level = 0
	completedRows = 0
}

function dropShape(coordinates) {
	while (falling == true) {
		coordinates = moveDown(coordinates)
	}
	main(true)
	// call a refresh for the main func
}

function movingRight() {
	movingRightTimeout = setTimeout(movingRightFunction, 100)
	return movingRightTimeout
}
function movingRightFunction() {
	if (falling) {
		coordinates = moveRight();
		if (!oneTime) {
			movingRight()
			oneTime = false
		}
	}
}

document.addEventListener("keydown", (e) => {
	if (falling) {
		if (e.code == 'ArrowDown') {
			gameTimer = 100;
			if (!toggle) {
				clearTimeout(gameTimeout)
				gameClock()
				toggle = true;
			};

		}

		else if (e.code == 'ArrowRight') {
			if (first) {
				oneTime = true
				right = true
				movingRightFunction()
				oneTime = false
				movingRight()
				first = false
			}
		}
		else if (e.code == 'ArrowLeft') {
			if (first) {
				oneTime = true
				right = false
				movingRightFunction()
				oneTime = false
				movingRight()
				first = false
			}
		}
		else if (e.code == 'Space') {
			dropShape(coordinates);
		}
		else if (e.code == 'ArrowUp' || e.code == 'KeyX') {
			coordinates, shape = rotate(shape, true)
		}
		else if (e.code == 'KeyZ') {
			coordinates, shape = rotate(shape, false)
		}
	}
});

document.addEventListener("keyup", (e) => {
	// keysPressed[e.code] = false
	if (e.code == 'ArrowDown') {
		gameTimer = normalTime;
		toggle = false
	}
	if (e.code == 'ArrowRight') {
		if (movingRightTimeout) {
			clearTimeout(movingRightTimeout)
		}
		first = true
	}
	if (e.code == 'ArrowLeft') {
		if (movingRightTimeout) {
			clearTimeout(movingRightTimeout)
		}
		first = true
	}
})

document.getElementById("move-left").addEventListener("click", function() {
	right = false
	oneTime = true
	movingRightFunction()
})
document.getElementById("move-right").addEventListener("click", function() {
	right = true
	oneTime = true
	movingRightFunction()
})

document.getElementById("rotate").addEventListener("click", function() {
	coordinates, shape = rotate(shape, true)
})

document.getElementById("drop").addEventListener("mousedown", function() {
	gameTimer = 100;
	if (!toggle) {
		clearTimeout(gameTimeout)
		gameClock()
		toggle = true;
	};
})

document.getElementById("drop").addEventListener("mouseup", function() {
	gameTimer = normalTime;
	toggle = false
})

document.getElementById("drop").addEventListener("touchstart", function() {
	gameTimer = 100;
	if (!toggle) {
		clearTimeout(gameTimeout)
		gameClock()
		toggle = true;
	};
})

document.getElementById("drop").addEventListener("touchend", function() {
	gameTimer = normalTime;
	toggle = false
})

