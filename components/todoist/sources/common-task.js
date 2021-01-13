const todoist = require("../todoist.app.js");
const common = require("./common.js");

module.exports = {
  ...common,
  props: {
    ...common.props,
    selectProjects: { propDefinition: [todoist, "selectProjects"] },
  },
  methods: {
    ...common.methods,
    isElementRelevant() {
      return true;
    },
  },
  async run(event) {
    const syncResult = await this.todoist.syncItems(this.db);

    Object.values(syncResult)
      .filter(Array.isArray)
      .flat()
      .filter(this.isElementRelevant)
      .filter((element) =>
        this.todoist.isProjectInList(element.project_id, this.selectProjects)
      )
      .forEach((element) => {
        element.summary = `Task: ${element.id}`;
        const meta = this.generateMeta(element);
        this.$emit(element, meta);
      });
  },
};