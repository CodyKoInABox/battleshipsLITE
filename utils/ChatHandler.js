class ChatHandler{
    constructor(){

    }


    createMessage(message){
        let chatDom = document.getElementById('chat')
        let div = document.createElement('div')
        div.classList.add('chatMessage')
        div.innerHTML = `
        <p class="chatMessageHeader">${message.username}<span class="chatMessageHeaderTime">${message.time}</span></p>
        <p class="chatMessageText">${message.text}</p>
        `;
        chatDom.appendChild(div)
    }
}


module.exports = ChatHandler