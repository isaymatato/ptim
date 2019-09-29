const path = require('path')
const appDir = path.dirname(require.main.filename)
const { pick } = require('ramda')
const jsonfile = require('jsonfile')
const configFile = appDir + '/.ptim.conf'
const propertyKeys = [
  'apiToken',
  'projectId'
]

module.exports = class Config {
  constructor () {
    this.properties = {}
  }

  async init () {
    return initJson()
      .catch(() => {})
  }

  async set (property, value) {
    throwIfPropertyInvalid(property)
    await this.read()
    this.properties[property] = value
    return this.write()
  }

  async get (property) {
    throwIfPropertyInvalid(property)
    await this.read()
    return this.getCached(property)
  }

  async getCached (property) {
    throwIfPropertyInvalid(property)
    return this.properties[property]
  }

  async read () {
    const json = await readJson()
    this.properties = serializeProperties(json)
  }

  async write () {
    const json = serializeProperties(this.properties)
    console.dir(json)
    return writeJson(json)
  }
}
const serializeProperties = pick(propertyKeys)

const readJson = async () =>
  jsonfile.readFile(configFile)
    .catch(err => {
      if (err.code === 'ENOENT') { 
        return {}
      } else { 
        throw err
      }
    })

const initJson = async () =>
  jsonfile.writeFile(configFile, {}, { flag: 'wx' })

const writeJson = async (json) =>
  jsonfile.writeFile(configFile, json)

const throwIfPropertyInvalid = (property) => {
  if (!propertyKeys.includes(property)) {
   throw new Error(`Invalid config property: ${property}`)
  }
}
