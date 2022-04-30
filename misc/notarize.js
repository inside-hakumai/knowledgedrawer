require('dotenv').config()
const { notarize } = require('electron-notarize')

const notarizeApp = async (context) => {
  const { electronPlatformName, appOutDir } = context

  if (electronPlatformName !== 'darwin') {
    return
  }

  const appName = context.packager.appInfo.productFilename

  return await notarize({
    appBundleId: 'dev.insidehakumai.knowledgebase',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_APP_PASSWORD,
    ascProvider: process.env.APPLE_DEVELOPER_TEAM_ID,
  })
}

exports.default = notarizeApp
