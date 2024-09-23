import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "openai-new-run-state-changed",
  name: "New Run State Changed",
  description: "Emit new event every time a run changes its status. [See the documentation](https://platform.openai.com/docs/api-reference/runs/listRuns)",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    threadId: {
      propDefinition: [
        common.props.openai,
        "threadId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getStatusItems() {
      return this.db.get("statusItems");
    },
    setStatusItems(value) {
      this.db.set("statusItems", value);
    },
    async getData() {
      const {
        openai,
        threadId,
      } = this;

      const { data } = await openai.listRuns({
        threadId,
      });

      return data;
    },
    getMeta(item) {
      const ts = Date.now();
      return {
        id: `${item.id}-${ts}`,
        summary: `Run State Changed: ${item.id}`,
        ts,
      };
    },
    statusByItemId(itemId, statusItems) {
      const { [itemId]: status } = statusItems || {};
      return status;
    },
    buildStatusItems(data) {
      return data?.reduce((acc, item) => ({
        ...acc,
        [item.id]: item.status,
      }), {});
    },
    async getAndProcessItems(maxEvents) {
      const {
        getData,
        getStatusItems,
        setStatusItems,
        statusByItemId,
        buildStatusItems,
        getMeta,
        $emit: emit,
      } = this;

      const data = await getData();
      const statusItems = getStatusItems();

      Array.from(data)
        .reverse()
        .forEach((item, index) => {
          const statusChanged = statusByItemId(item.id, statusItems) !== item.status;
          if ((!maxEvents || index < maxEvents) && statusChanged) {
            emit(item, getMeta(item));
          }
        });

      setStatusItems(buildStatusItems(data));
    },
  },
  sampleEmit,
};
