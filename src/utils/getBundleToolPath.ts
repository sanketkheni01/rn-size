import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { relativeBundleToolPath } from '../constants.js'

export default function getBundleToolPath() {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const jarpath = path.join(__dirname, relativeBundleToolPath)
  return jarpath
}
