#!/usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import * as inquirer from 'inquirer'
import * as yargs from 'yargs'

import { createDirectoryContents, createProject } from './utils/createProject'
import { getTemplateConfig } from './utils/getTemplateConfig'
import { CliOptions } from './models/cli-options'
import { postProcess, showMessage } from './utils/postProcess'

const CURR_DIR = process.cwd()
const TEMPLATES_PATH = path.join(__dirname, '..', 'templates')
const CHOICES = fs.readdirSync(TEMPLATES_PATH)

const QUESTIONS = [
  {
    name: 'template',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: CHOICES,
    when: () => !(yargs.argv as any)['template'],
  },
  {
    name: 'name',
    type: 'input',
    message: 'Project name:',
    when: () => !(yargs.argv as any)['name'],
    validate: (input: string) => {
      if (/^([A-Za-z\-_\d])+$/.test(input)) return true
      return 'Project name may only include letters, numbers, underscores and hashes.'
    },
  },
]

inquirer.prompt(QUESTIONS).then((answers) => {
  const args = { ...answers, ...yargs.argv }
  const projectChoice = args.template
  const projectName = args.name
  const templatePath = path.join(TEMPLATES_PATH, projectChoice)
  const tartgetPath = path.join(CURR_DIR, projectName)
  const templateConfig = getTemplateConfig(templatePath)

  const options: CliOptions = {
    projectName,
    templateName: projectChoice,
    templatePath,
    tartgetPath,
    config: templateConfig,
  }

  if (!createProject(tartgetPath)) {
    return
  }

  createDirectoryContents(templatePath, projectName, templateConfig)

  if (!postProcess(options)) {
    return
  }

  showMessage(options)
})
