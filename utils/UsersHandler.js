class UsersHandler{
    constructor(){}

    users = []

    userJoin(id, username, room){
        let user = {id, username, room}
        this.users.push(user)
        return user
    }

    getCurrentUser(id){
        return this.users.find(user => user.id == id)
    }

    userLeave(id){
        const index = this.users.findIndex(user => user.id == id)

        if(index !== -1){
            return this.users.splice(index, 1)[0]
        }
    }

    getRoomUsers(room){
        return this.users.filter(user => user.room == room)
    }

    getUsers(){
        return this.users
    }
}

module.exports = UsersHandler