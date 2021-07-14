import fs from 'fs'
import chalk from 'chalk'
import path from 'path'

import { TemplateConfig } from '../models/template-config'
import * as template from './template'

const SKIP_FILES = ['node_modules', '.template.json']
const CURR_DIR = process.cwd()

export function createProject(projectPath: string) {
  if (fs.existsSync(projectPath)) {
    console.log(
      chalk.red(`Folder ${projectPath} exists. Delete or use another name.`)
    )
    return false
  }
  fs.mkdirSync(projectPath)

  return true
}

export function createDirectoryContents(
  templatePath: string,
  projectName: string,
  config: TemplateConfig
) {
  const filesToCreate = fs.readdirSync(templatePath)

  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templatePath, file)
    const stats = fs.statSync(origFilePath)

    if (SKIP_FILES.indexOf(file) > -1) return

    if (stats.isFile()) {
      let contents = fs.readFileSync(origFilePath, 'utf8')

      contents = template.render(contents, { projectName })

      const writePath = path.join(CURR_DIR, projectName, file)
      fs.writeFileSync(writePath, contents, 'utf8')
    } else if (stats.isDirectory()) {
      fs.mkdirSync(path.join(CURR_DIR, projectName, file))
      createDirectoryContents(
        path.join(templatePath, file),
        path.join(projectName, file),
        config
      )
    }
  })
}
