
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

socket.on('checkVictory', () => {
    
    if(confirm('Did you win the game? (OK for YES)')){
        socket.emit('confirmVictory')
    }else{

    }
})


socket.on('youWon', () => {
    window.location.href = window.location.origin + '/defeated'
})

socket.on('youLost', () => {
    window.location.href = window.location.origin + '/victory'
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

let numberToLetter = {
    0:'A',
    1:'B',
    2:'C',
    3:'D',
    4:'E',
    5:'F',
    6:'G',
    7:'H',
    8:'I',
    9:'J'
}

const leftBoard = document.getElementById('leftBoard')
const rightBoard = document.getElementById('rightBoard')

let currentTileLeft = document.getElementById('currentTileLeft')
let currentTileRight = document.getElementById('currentTileRight')

leftBoard.addEventListener('mouseover', (e) => {
    currentTileLeft.innerText = e.target.id[0] + numberToLetter[e.target.id[1]]
})

rightBoard.addEventListener('mouseover', (e) => {
    currentTileRight.innerText = e.target.id[0] + numberToLetter[e.target.id[1]]
})


// LEFT CLICK
leftBoard.addEventListener('click', (e) => {
    let target = document.getElementById(e.target.id)

    if(target.style.backgroundColor == 'orange'){
        target.style.backgroundColor = 'aqua'
    }else{
        target.style.backgroundColor = 'orange'
    }
})

// RIGHT CLICK
leftBoard.addEventListener('contextmenu', (e) =>{
    e.preventDefault()
    let target = document.getElementById(e.target.id)

    if(target.style.backgroundColor == 'purple'){
        target.style.backgroundColor = 'aqua'
    }else{
        target.style.backgroundColor = 'purple'
    }

})


// LEFT CLICK
rightBoard.addEventListener('click', (e) => {
    let target = document.getElementById(e.target.id)

    if(target.style.backgroundColor == 'red'){
        target.style.backgroundColor = 'aqua'
    }else{
        target.style.backgroundColor = 'red'
    }
})

// RIGHT CLICK
rightBoard.addEventListener('contextmenu', (e) =>{
    e.preventDefault()
    let target = document.getElementById(e.target.id)

    if(target.style.backgroundColor == 'white'){
        target.style.backgroundColor = 'aqua'
    }else{
        target.style.backgroundColor = 'white'
    }
})


function randomNumber(){
    socket.emit('randomNumber')
}

function opponentWon(){
    socket.emit('opponentWon')
}