const npm = {
  type: "app",
  app: "npm",
}

const axios = require('axios')
module.exports = {
  name: "npm download counts",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 60 * 24,
      },
    },
    period: {
      type: "string", 
      label: "Period",
      description: "Select last-day, last-week or last-month.",
      optional: false,
      default: "last-day", 
      options: ["last-day", "last-week", "last-month"],
    },
    package: {
      type: "string", 
      label: "Package",
      description: "Enter an npm package name. Leave blank for all",
      optional: true,
      default: '@pipedreamhq/platform',
    },
    npm,
  },
  async run(event) {
    const npm_event = (await axios({
      method: "get",
      url: `https://api.npmjs.org/downloads/point/${encodeURIComponent(this.period)}/${encodeURIComponent(this.package)}`,
    })).data
    this.$emit(npm_event, {
     summary: ""+npm_event.downloads,
    })    
  },
}
