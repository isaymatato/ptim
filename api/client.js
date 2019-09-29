const request = require('request-promise-native')

const base_uri = 'https://www.pivotaltracker.com'

module.exports.call = (apiToken, verb, path) => () =>
  request[verb]({
    url: base_uri + path,
    headers: {
      'X-TrackerToken': apiToken
    }
  })
  .then(JSON.parse)
