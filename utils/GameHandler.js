class GameHandler{
    constructor(){
        this.gameState = 'waitingForPlayers'
    }

    gameState

    setGameState(newGameState){
        this.gameState = newGameState
    }
}


module.exports = GameHandler