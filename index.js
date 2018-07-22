const ApiBuilder = require('claudia-api-builder')
const API = new ApiBuilder();
const AWS = require("aws-sdk")
const docClient = new AWS.DynamoDB.DocumentClient()

const MonsterAPI = require('./monster/MonsterApi')

const TABLE = 'Test_Two'

module.exports = API;

API.get('/get', function(request) {
    let name = request.queryString.name || 'DEFAULT'
    return docClient.get({TableName:TABLE, Key:{name:name}}).promise()
})

API.post('/save', function(request) {
    let name = request.queryString.name || 'DEFAULT'
    return docClient.put({TableName:TABLE, Item:{name:name, body:request.body}}).promise()
        .then(d=>console.log(d))
        .then(()=>"Saved:" + name)
})

MonsterAPI.register(API)