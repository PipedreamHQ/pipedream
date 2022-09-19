import common from "./common.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    selectProjects: {
      propDefinition: [
        common.props.todoist,
        "selectProjects",
      ],
    },
  },
  methods: {
    ...common.methods,
    isElementRelevant() {
      return true;
    },
    async getSyncResult() {
      return this.todoist.syncItems(this.db);
    },
    filterResults(syncResult) {
      return Object.values(syncResult)
        .filter(Array.isArray)
        .flat()
        .filter(this.isElementRelevant)
        .filter((element) =>
          this.todoist.isProjectInList(element.project_id, this.selectProjects ?? []));
    },
    emitResults(results) {
      for (const element of results) {
        element.summary = `Task: ${element.id}`;
        const meta = this.generateMeta(element);
        this.$emit(element, meta);
      }
    },
  },
};
