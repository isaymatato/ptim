#!/usr/bin/env node
const commands = require('./commands')
const program = require('commander')

module.exports = () => {
  commands.forEach(({ command, action, short }) => {
    program
      .command(command)
      .action(action)
    if (short) {
      program.command(short).action(action)
    }
  })

  program.parse(process.argv)
}
