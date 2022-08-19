import { spawn } from 'child_process'
import ora from 'ora'

export default async function buildBundle(includeLogs: boolean) {
  const spinner = ora('Building bundle...').start()
  spinner.color = 'blue'
  const build = () =>
    new Promise<void>((resolve, reject) => {
      try {
        const child = spawn('gradlew.bat', ['bundleRelease'], {
          cwd: './android',
        })

        child.on('exit', function (code) {
          if (code == 0) {
            resolve()
          } else {
            reject()
          }
        })
        child.on('error', function (err) {
          reject(err)
        })
        child.stdout.on('data', function (data) {
          includeLogs && console.log(data.toString())
        })
      } catch (error) {
        reject(error)
      }
    })
  try {
    await build()
    spinner.succeed('Bundle built successfully!')
  } catch (error) {
    spinner.fail(
      'Unable to build bundle. Please make sure you are in root of your react-native project.'
    )
    throw error
  }
}
