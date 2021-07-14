import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import * as shell from 'shelljs'

import { CliOptions } from '../models/cli-options'

function isNode(options: CliOptions) {
  return fs.existsSync(path.join(options.templatePath, 'package.json'))
}

function postProcessNode(options: CliOptions) {
  shell.cd(options.tartgetPath)

  let cmd = ''

  if (shell.which('yarn')) {
    cmd = 'yarn'
  } else if (shell.which('npm')) {
    cmd = 'npm install'
  }

  if (cmd) {
    const result = shell.exec(cmd)

    if (result.code !== 0) {
      return false
    }
  } else {
    console.log(chalk.red('No yarn or npm found. Cannot run installation.'))
  }

  return true
}

export function showMessage(options: CliOptions) {
  console.log('')
  console.log(chalk.green('Done.'))
  console.log(chalk.green(`Go into the project: cd ${options.projectName}`))

  const message = options.config.postMessage

  if (message) {
    console.log('')
    console.log(chalk.yellow(message))
    console.log('')
  }
}

export function postProcess(options: CliOptions) {
  if (isNode(options)) {
    return postProcessNode(options)
  }
  return true
}
