const path = require('path')
// const appHeading = require('./appHeading')

module.exports = (context, options) => ({
  name: 'smooth-scroll',
  enhanceAppFiles: path.resolve(__dirname, 'enhanceApp.js')
  /**
   * https://github.com/vuejs/vuepress/pull/2669
   *
  chainMarkdown (config) {
    config.plugins.delete('anchor')
    config.plugin('app-heading')
      .use(appHeading, [])
  }
  */
})
