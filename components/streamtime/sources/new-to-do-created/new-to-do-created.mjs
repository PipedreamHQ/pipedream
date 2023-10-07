import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "streamtime-new-to-do-created",
  name: "New To Do Created",
  description: "Emit new event when a new To Do is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(toDo) {
      return {
        id: toDo.id,
        summary: `New To Do ${toDo.id}`,
        ts: Date.now(),
      };
    },
    filterSearchResults(searchResults) {
      const filtered = [];
      for (const [
        // eslint-disable-next-line no-unused-vars
        key,
        value,
      ] of Object.entries(searchResults)) {
        filtered.push(value);
      }
      return filtered;
    },
  },
  async run() {
    const results = await this.getPaginatedResults(this.streamtime.listToDos, {
      data: constants.TODO_SEARCH_BASE_PARAMS,
    });
    results.forEach((item) => this.emitEvent(item));
  },
};
