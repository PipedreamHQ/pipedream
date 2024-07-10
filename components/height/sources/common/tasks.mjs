import common from "./base.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    getSearchFilters(lastTs, tsField) {
      const filters = {};
      filters[tsField] = {
        values: [],
        gt: {
          date: lastTs,
        },
      };
      return filters;
    },
    generateMeta(task, tsField) {
      const ts = Date.parse(task[tsField]);
      return {
        id: `${task.id}${ts}`,
        summary: this.getSummary(task),
        ts,
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const tsField = this.getTsField();
      const filters = this.getSearchFilters(lastTs, tsField);
      const { list } = await this.height.searchTasks({
        params: {
          filters,
          limit: max,
        },
      });
      for (const task of list.reverse()) {
        this.$emit(task, this.generateMeta(task, tsField));
        maxTs = Date.parse(task[tsField]) > Date.parse(maxTs)
          ? task[tsField]
          : maxTs;
      }
      this._setLastTs(maxTs);
    },
  },
};
