const External = require('./ExternalMonsterApi')

var exports = module.exports = {}

exports.register = function(API) {
    External.register(API)
}

