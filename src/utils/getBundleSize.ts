import { exec } from 'child_process'
import fs from 'fs'
import ora from 'ora'
import { outDir } from '../constants.js'
import getBundleToolPath from './getBundleToolPath.js'

export default async function getBundleSize() {
  try {
    deleteIfExists()
    await convertToAPKs()
    await getSizeInBytes()
  } catch (error) {
    throw error
  }
}
const bundleToolPath = getBundleToolPath()

async function convertToAPKs() {
  const spinner = ora('Converting to .apks...').start()
  spinner.color = 'yellow'
  const convert = () =>
    new Promise<void>((resolve, reject) => {
      exec(
        `java -jar ${bundleToolPath} build-apks --bundle=${outDir}/app-release.aab --output=${outDir}/app.apks`,
        (error, _stdout, stderr) => {
          if (error) {
            reject(error)
            return
          }
          if (stderr) {
            reject(stderr)
            return
          }
          resolve()
        }
      )
    })

  try {
    await convert()
    spinner.succeed('Converted to .apks successfully!')
  } catch (error) {
    spinner.fail('Unable to convert .aab to .apks')
    throw error
  }
}

async function deleteIfExists() {
  const apksPath = `${outDir}/app.apks`
  if (fs.existsSync(apksPath)) {
    fs.unlinkSync(apksPath)
  }
}

async function getSizeInBytes() {
  const spinner = ora('Analyzing size...').start()
  spinner.color = 'green'
  const getSize = () =>
    new Promise<number[]>((resolve, reject) => {
      exec(
        `java -jar ${bundleToolPath} get-size total --apks=${outDir}/app.apks`,
        (error, stdout, stderr) => {
          if (error) {
            reject(error)
            return
          }
          if (stderr) {
            reject(stderr)
            return
          }
          const sizes = getSizeFromRawOutPut(stdout)
          resolve(sizes)
        }
      )
    })

  try {
    const size = await getSize()
    spinner.succeed(
      'Min size: ' +
        byteToMB(size[0]) +
        ' MB' +
        ' Max size: ' +
        byteToMB(size[1]) +
        ' MB'
    )
  } catch (error) {
    spinner.fail('Unable analyze size')
    throw error
  }
}

function getSizeFromRawOutPut(rawOutput: string) {
  let sizes = rawOutput.match(/\d+/gm)
  if (sizes) {
    return sizes.map(Number)
  } else {
    throw new Error('Unable to parse size')
  }
}

function byteToMB(size: number) {
  return (size / 1000000).toFixed(2)
}
