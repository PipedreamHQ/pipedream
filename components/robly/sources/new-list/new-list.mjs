import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "robly-new-list",
  name: "New List",
  description: "Emit new event when a new list is created. [See the documentation](https://docs.robly.com/docs/api-v1/6a75f202e3938-get-lists)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();
      const lists = await this.robly.getLists();
      if (!Array.isArray(lists)) return;

      const filteredLists = lists
        .filter((list) => list.sub_list.id > lastId)
        .reverse();
      if (filteredLists.length) {
        if (maxResults && filteredLists.length > maxResults) {
          filteredLists.length = maxResults;
        }
        this._setLastId(filteredLists[0].sub_list.id);
      }

      for (const list of filteredLists.reverse()) {
        this.$emit(list.sub_list, {
          id: list.sub_list.id,
          summary: `New list: ${list.sub_list.name}`,
          ts: Date.parse(list.sub_list.created_at),
        });
      }
    },
  },
  sampleEmit,
};

