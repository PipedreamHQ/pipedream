import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "canny-post-status-changed",
  name: "Post Status Changed",
  description: "Emit new event when the status of a post is changed. [See the documentation](https://developers.canny.io/api-reference#list_status_changes)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    boardId: {
      propDefinition: [
        common.props.canny,
        "boardId",
      ],
      description: "The ID of the board to watch for status changes",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.canny.listStatusChanges;
    },
    getData() {
      return {
        boardID: this.boardId,
      };
    },
    getResourceKey() {
      return "statusChanges";
    },
    generateMeta(statusChange) {
      return {
        id: statusChange.id,
        summary: `Post Status Changed: ${statusChange.status}`,
        ts: Date.parse(statusChange[this.getTsField()]),
      };
    },
  },
};
