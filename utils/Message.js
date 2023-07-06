const moment = require('moment')

class Message{
    constructor(username, text){
        this.username = username,
        this.time = moment().format('HH:mm')
        this.text = text
    }
}

module.exports = Message