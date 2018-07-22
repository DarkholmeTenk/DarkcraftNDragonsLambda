const fetch = require('node-fetch')

var exports = module.exports = {}

const EXT = "http://dnd5eapi.co/api"

function fetchNames() {
    return fetch(EXT+'/monsters/')
        .then(r=>r.json())
}

function parseMonster(monster) {
    monster.parsed="123456"
    return monster;
}

function getMonster(id) {
    return fetch(EXT+'/monsters/'+id)
}

exports.register = function(API) {

    API.get('/monster/external/list', function(request) {
        return fetchNames()
    })

    API.get('/monster/external/query/{monsterName}', function(request) {
        let monsterName = decodeURIComponent(request.pathParams.monsterName)
        console.log("Searching for " + monsterName)
        return fetchNames()
            .then(monsters=>{
                let m = monsters.results.filter(monster=>monster.name.toLowerCase() == monsterName.toLowerCase())[0]
                if(!m)
                    throw "Monster " + monsterName + " not found"
                return m
            })
            .then(monsterData => fetch(monsterData.url))
            .then(r=>r.json())
            .then(parseMonster)
    })
}