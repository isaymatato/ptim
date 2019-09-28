const Config = require('./config/index')

module.exports = {
  command:'config <property> [value]',
  action: async (property, value) => {
    const config = new Config()
    await config.init()

    try {
      if (typeof value === 'undefined') {
        const value = await config.get(property)
        console.log(`The value of ${property} is ${value}`)
      } else {
        return config.set(property, value)
      }
    } catch(err) {
      console.error(err)
    }
  }
}
