import pinterest from "../../pinterest.app.mjs";
import common from "../common.mjs";

export default {
  key: "pinterest-new-pin",
  name: "New Pin Event",
  description: "Emit new events when new pins are created on a board or board section. [See the docs here](https://developers.pinterest.com/docs/api/v5/#operation/boards/list_pins) and [here](https://developers.pinterest.com/docs/api/v5/#operation/board_sections/list_pins)",
  version: "0.0.2",
  type: "source",
  ...common,
  props: {
    pinterest,
    ...common.props,
    boardId: {
      propDefinition: [
        pinterest,
        "boardId",
      ],
    },
    boardSectionId: {
      propDefinition: [
        pinterest,
        "boardSectionId",
        (configuredProps) => ({
          boardId: configuredProps.boardId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.pinterest.getPins;
    },
    getResourceFnArgs() {
      return {
        boardId: this.boardId,
        boardSectionId: this.boardSectionId,
      };
    },
    getSummary(item) {
      return `New pin ${item.title} (ID:${item.id})`;
    },
    compareFn(item) {
      return new Date(item.created_at).getTime() > this.getLastFetchTime();
    },
  },
};
