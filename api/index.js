const { call } = require('./client')
module.exports = (apiToken) => ({
  notifications: call(apiToken, 'get', '/services/v5/my/notifications?envelope=true') 
})
