// Example component that runs a console.log() statement once a minute
// Run `pd logs <component>` to see these logs in the CLI
module.exports = {
  name: "cronjob",
  version: "0.0.1",
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        cron: "0 0 * * *",
      },
    },
  },
  async run() {
    console.log("Run any Node.js code here");
  },
};
