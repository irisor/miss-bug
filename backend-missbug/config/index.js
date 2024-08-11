import configProd from './prod.js'
import configDev from './dev.js'


export let config

if (process.env.NODE_ENV.includes('production')) {
  console.log('mongoDB mode production:', process.env.NODE_ENV)
  config = configProd
} else {
  console.log('mongoDB mode not production:', process.env.NODE_ENV)
  config = configDev
}
console.log('mongoDB url:', process.env.MONGO_URL)
// config.isGuestMode = true


