const todoist = require("../todoist.app.js");
const common = require("./common.js");

module.exports = {
  ...common,
  props: {
    todoist,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
    db: "$.service.db",
  },
  async run(event) {
    const syncResult = await this.todoist.syncProjects(this.db);
    Object.values(syncResult)
      .filter(Array.isArray)
      .flat()
      .forEach((element) => {
        const meta = this.generateMeta(element);
        this.$emit(element, meta);
      });
  },
};