import pinterest from "../../pinterest.app.mjs";
import common from "../common.mjs";

export default {
  key: "pinterest-new-board",
  name: "New Board Event",
  description: "Emit new events when new boards are created. [See the docs](https://developers.pinterest.com/docs/api/v5/#operation/boards/list)",
  version: "0.0.2",
  type: "source",
  ...common,
  props: {
    pinterest,
    ...common.props,
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.pinterest.getBoards;
    },
    getResourceFnArgs() {
      return {};
    },
    getSummary(item) {
      return `New board ${item.name} (ID:${item.id})`;
    },
    compareFn(item) {
      return this.getLastId() < item.id;
    },
  },
};
