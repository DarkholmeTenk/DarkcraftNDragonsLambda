const fetch = require('node-fetch')
const SpellcastingParser = require('../util/SpellcastingParser')

var exports = module.exports = {}

const EXT = "http://dnd5eapi.co/api"

function fetchNames() {
    return fetch(EXT+'/monsters/')
        .then(r=>r.json())
}

function getAbilityBlock(object, suffix)
{
    const rObj = {}
    rObj.str = object['intelligence'+suffix]
    rObj.dex = object['dexterity'+suffix]
    rObj.con = object['constitution'+suffix]
    rObj.int = object['intelligence'+suffix]
    rObj.wis = object['wisdom'+suffix]
    rObj.chr = object['charisma'+suffix]
    return rObj
}

function split(text)
{
    if(!text)
        return [];
    return text.split(',')
        .map(s=>s.trim())
        .filter(s=>s != "")
}

function getPP(senses)
{
    return senses.map(s=>s.toLowerCase().match("passive perception (\\d+)"))
        .filter(s=>s)
        .map(s=>s[1])[0] || 0;
}

function getSpellcasting(features)
{
    return features.map(f=>{
            try {
                return SpellcastingParser.parse(f)
            } catch (error) {}
        })
        .find(f=>f)
}

function parseMonster(monster) {
    monster.parsed="123456"
    return {
        name: monster.name,
        size: monster.size.toUpperCase(),
        type: monster.type.toUpperCase(),
        abilities: getAbilityBlock(monster, ''),
        savingThrows: getAbilityBlock(monster, '_save'),
        ac: monster.armor_class,
        cr: monster.challenge_rating,
        maxHP: monster.hit_points,
        hitDice: monster.hit_dice,
        languages: split(monster.languages),
        senses: split(monster.senses),
        vulnerabilities: split(monster.damage_vulnerabilities),
        resistances: split(monster.damage_resistances),
        damageImmunities: split(monster.damage_immunities),
        conditionImmunities: split(monster.conditionImmunities),
        actions: monster.actions,
        specialAbilities: monster.special_abilities,
        legendaryActions: monster.legendary_actions,
        pp: getPP(split(monster.senses))
    }
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