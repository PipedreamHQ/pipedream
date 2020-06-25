//const github = require("https://github.com/PipedreamHQ/pipedream/components/github/github.app.js");
const github = require("./github.app.js");

module.exports = {
  name: "New Team",
  description: "New repository created.",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    github,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
  },
  //dedupe: "last",
  async run(event) {
    const teams = await this.github.getTeams()
    console.log(teams)
  },
};