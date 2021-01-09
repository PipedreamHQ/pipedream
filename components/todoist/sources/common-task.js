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
    selectProjects: { propDefinition: [todoist, "selectProjects"] },
  },
  async run(event) {
    const syncResult = await this.todoist.syncItems(this.db);

    Object.values(syncResult)
      .filter(Array.isArray)
      .flat()
      .filter(this.isElementRelevant)
      .filter(element => this.todoist.isProjectInList(element.project_id, this.selectProjects))
      .forEach(element => {
        const meta = this.generateMeta(element);
        this.$emit(element, meta);
      });
  }
};