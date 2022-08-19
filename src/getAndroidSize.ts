import buildBundle from './utils/buildbundle.js'
import getBundleSize from './utils/getBundleSize.js'

export default async function getAndroidSize() {
  try {
    await buildBundle()
    await getBundleSize()
  } catch (error) {}
}
