import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Task Created",
  version: "0.0.1",
  key: "totango-new-task-created",
  description: "Emit new event for each created task. [See the docs](https://support.totango.com/hc/en-us/articles/360048132792-Search-API-events-)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      if (data?.task_content?.action === "create") {
        this.$emit(data, {
          id: data.id,
          summary: `New task with id ${data.id}`,
          ts: data[this.getTimestampKey()],
        });
      }
    },
    getResourceMethod() {
      return this.totango.searchEvents;
    },
    getTerms(lastCreated = 0) {
      return `{ "type" :"event_property", "name":"event_type", "eq":"task" }, { "type":"date", "term" : "date", "gte" : ${lastCreated}}`;
    },
    getTimestampKey() {
      return "timestamp";
    },
  },
};
