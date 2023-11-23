import common from "../common.mjs";

export default {
  ...common,
  key: "openai-new-run-state-changed",
  name: "New Run State Changed",
  description: "Emit new event every time a run changes its status. [See the documentation](https://platform.openai.com/docs/api-reference/runs/listRuns)",
  version: "0.0.1",
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
    getItemStatus(id) {
      return this.db.get(id);
    },
    setItemStatus(id, value) {
      this.db.set(id, value);
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
    async getAndProcessItems(maxEvents) {
      const {
        getData,
        getItemStatus,
        setItemStatus,
        getMeta,
        $emit: emit,
      } = this;

      const data = await getData();

      Array.from(data)
        .reverse()
        .forEach((item, index) => {
          if (!maxEvents || index < maxEvents) {

            if (getItemStatus(item.id) !== item.status) {
              setItemStatus(item.id, item.status);
              emit(item, getMeta(item));
            }
          }
        });
    },
  },
};
