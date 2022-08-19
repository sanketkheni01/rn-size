import buildBundle from './utils/buildbundle.js'
import getBundleSize from './utils/getBundleSize.js'

export default async function getAndroidSize(options: any) {
  const includeLogs = options.log || false
  try {
    await buildBundle(includeLogs)
    await getBundleSize()
  } catch (error) {
    includeLogs && console.log(error)
  }
}
