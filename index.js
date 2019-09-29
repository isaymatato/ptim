#!/usr/bin/env node
const { pipe } = require('ramda')
const commands = require('./commands')
const program = require('commander')

module.exports = () => {
  commands.forEach(({ command, action, short, options=[] }) => {
    createCommand(program, command, action, options)
    if (short) {
      createCommand(program, short, action, options)
    }
  })

  program.parse(process.argv)
}
const createCommand = (p, command, action, options) => {
   p = p
    .command(command)
    .action(action)
  options.map(([option, desc]) =>
    p.option(option, desc)
  )
}
