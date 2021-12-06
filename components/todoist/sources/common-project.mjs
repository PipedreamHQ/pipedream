import common from "./common.js";

export default {
  ...common,
  async run(event) {
    const syncResult = await this.todoist.syncProjects(this.db);
    Object.values(syncResult)
      .filter(Array.isArray)
      .flat()
      .forEach((element) => {
        element.summary = `Project: ${element.id}`;
        const meta = this.generateMeta(element);
        this.$emit(element, meta);
      });
  },
};