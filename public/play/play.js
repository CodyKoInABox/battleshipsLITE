const socket = io()

const room = Qs.parse(window.location.search, {ignoreQueryPrefix: true}).room
const username = Qs.parse(window.location.search, {ignoreQueryPrefix: true}).username


socket.emit('joinRoom', {username, room})

socket.on('dev', (data) => {
    console.log(data)
})

socket.on('userCount', (data) => {
    console.log('User count: ' + data)
})

socket.on('individualUserCount', (data) => {
    console.log('Individual user count: ' + data)
    if(data > 2){
        // room is full, go back to main menu
        window.location.href = window.location.origin
    }
})

socket.on('message', (message) => {
    createChatMessage(message)

    let chatDom = document.getElementById('chat')
    chatDom.scrollTop = chatDom.scrollHeight
})


const chatForm = document.getElementById('chatForm')

chatForm.addEventListener('submit', (e) => {

    e.preventDefault()

    let message = e.target.elements.message.value

    e.target.elements.message.value = ''
    // sends message to server
    socket.emit('message', message)
})


function createChatMessage(message){
    let chatDom = document.getElementById('chat')
    let div = document.createElement('div')
    div.classList.add('chatMessage')
    div.innerHTML = `
    <p class="chatMessageHeader">${message.username}<span class="chatMessageHeaderTime">${message.time}</span></p>
    <p class="chatMessageText">${message.text}</p>
    `;
    chatDom.appendChild(div)
}

// GAME

let gameState = 'waiting'

const leftBoard = document.getElementById('leftBoard')
const rightBoard = document.getElementById('rightBoard')

const statusLeft = document.getElementById('statusLeft')
const statusRight = document.getElementById('statusRight')

leftBoard.style.pointerEvents = 'none'
rightBoard.style.pointerEvents = 'none'

statusLeft.innerText = 'Waiting for second player'
statusRight.innerText = 'Share the room name with a friend!'

function startGame(){
    leftBoard.style.pointerEvents = 'all'
    rightBoard.style.pointerEvents = 'all'

    statusRight.innerText = 'Other player is positioning ships'

    gameState = 'positioning'
}

let shipsToPosition = ['carrier', 'battleship', 'destroyer', 'submarine', 'patrol']
let shipSizes = {
    carrier: 5,
    battleship: 4,
    destroyer: 3,
    submarine: 3,
    patrol: 2
}

let isPlacementVertical = true

// this is toggle isPlacementVertical when the key "R" is pressed on the keyboard
document.addEventListener('keypress', event => {
    if (event.key == 'r' || event.key == 'R') {
      
        if(isPlacementVertical === true){
            isPlacementVertical = false
        }else{
            isPlacementVertical = true
        }
    }
  })


function positionShips(){


    let currentShipSize = shipSizes[shipsToPosition[0]]

    let tiles = getNeighbors(currentLeftBoardHover, currentShipSize, isPlacementVertical)



    shipsToPosition.shift()

}

function showBoatOnBoard(boatColor, positions){
    
    clearBoard([])

    for(let i = 0; i < positions.length; i++){
        document.getElementById(positions[i]).style.backgroundColor = boatColor
    }
}

function clearBoard(tilesNotToClean){

    for(let i=0; i<=9; i++){
        for(let j=0; j<=9; j++){

            let currentTile = document.getElementById(i.toString() + j.toString())


            if(!tilesNotToClean.includes(currentTile.id)){
                currentTile.style.backgroundColor = 'aqua'
            }
        }
    }
    
}

let currentLeftBoardHover = ''

leftBoard.addEventListener('mouseover', (e) => {
    currentLeftBoardHover = e.target.id

    let neighbors = getNeighbors(currentLeftBoardHover, 5, false)

    if(gameState == 'positioning' && checkIfAllNeighborsExist(neighbors)){
        showBoatOnBoard('red', neighbors)
    }
})

function getNeighbors(startCoord, amount, isVertical){

    let startCoordVertical = startCoord[0]
    let startCoordHorizontal = startCoord[1]

    let neighbors = []


    if(isVertical){
        // get vertical neighbors
    
        for(let i = 1; i <= amount; i++){

            let currentNeighbor = ''

            let temp = parseInt(startCoordVertical) + i

            currentNeighbor = currentNeighbor + temp.toString() + startCoordHorizontal

            neighbors.push(currentNeighbor)
        }



    }else{
        // get horizontal neighbors

        for(let i = 1; i <= amount; i++){

            let currentNeighbor = ''

            let temp = parseInt(startCoordHorizontal) + i

            currentNeighbor = currentNeighbor + startCoordVertical + temp.toString()

            neighbors.push(currentNeighbor)
        }


    }
    return neighbors
}


function checkIfAllNeighborsExist(neighbors){

    for(let i = 0; i < neighbors.length; i++){
        if( neighbors[i].length < 3 && neighbors[i][0] >= 0 && neighbors[i][1] >= 0){
            // do nothing
        }else{
            return false
        }
    }

    return true
}