var exports = module.exports = {}

exports.parse = function(feature) {
    return {
        level: feature.match(/(\d+)\S\S[-\s]level spellcaster/i)[1],
    }
}