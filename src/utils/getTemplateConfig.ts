import path from 'path'
import fs from 'fs'

import { TemplateConfig } from '../models/template-config'

export function getTemplateConfig(templatePath: string): TemplateConfig {
  const configPath = path.join(templatePath, '.template.json')

  if (!fs.existsSync(configPath)) return {}

  const templateConfigContent = fs.readFileSync(configPath)

  if (templateConfigContent) {
    return JSON.parse(templateConfigContent.toString())
  }

  return {}
}
