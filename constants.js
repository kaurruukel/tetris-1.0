var originalShapes = [
	[
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 1],
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 0],
	],
	[
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0],
	],
	[
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0],
	],
	[
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0],
	],
	[
		[1, 1],
		[1, 1],
	],
];


const scoringAmount = [
	40,
	100,
	300,
	1200
]

const allowedMovements = [
	[-1, 0],
	[-2, 0],
	[0, +1],
	[0, -1],
	[-1, +1],
	[-1, -1],
	[0, +2],
	[0, -2],
	[-1, +2],
	[-1, -2]
];

var colors = ['#76BA99', '#417261', '#9CAA89', '#3D3D37', '#8D9EFF', '#FB8B23', '#A9AF7E']

var coordinates = []
var shape = []
var shapeindex
var x = 0
var y = 0
var gameover = false
var first = true
var oneTime = false
var toggle = false

var listOfRandomPieces = []
var lastUpcomingPieces = []
var normalTime = 1000
var gameTimer = normalTime
var lastDrawnCoordinates
var lastDrawnGhost = []
var scoreAmount = 0
var onHoldShape

var highScore

const linesNeededForLevelUp = 15;
var level = 0
var completedRowsGlobal = 0
