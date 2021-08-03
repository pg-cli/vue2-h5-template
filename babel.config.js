const IS_PROD = ['production', 'prod'].includes(process.env.VUE_APP_ENV)
const plugins = []
// 去除 console.log
if (IS_PROD) {
  plugins.push(['transform-remove-console', {'exclude': ['error', 'warn']}])
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins
}
