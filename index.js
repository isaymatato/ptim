#!/usr/bin/env node
const commands = require('./commands')
const program = require('commander')

commands.forEach(({ command, action }) =>
  program
    .command(command)
    .action(action)
)

program.parse(process.argv)
