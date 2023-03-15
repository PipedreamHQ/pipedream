import common from "../common/common.mjs";
import app from "../../clickup.app.mjs";

export default {
  ...common,
  key: "clickup-updated-task",
  name: "New Updated Task (Instant)",
  description: "Emit new event when a new task is updated",
  version: "0.0.5",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        app,
        "lists",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
      description: "If a list is selected, only tasks updated in this list will emit an event",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    _getMeta(historyItems) {
      return {
        id: historyItems[0].id,
        summary: String(historyItems[0].id),
        ts: Date.now(),
      };
    },
    _getEventsList() {
      return [
        "taskUpdated",
      ];
    },
  },
  async run(httpRequest) {
    console.log("Event received");
    this.checkSignature(httpRequest);

    const { body } = httpRequest;

    if (this.listId) {
      const { task_id: taskId } = body;
      const { list: { id } } = await this.app.getTask({
        taskId,
      });

      if (id !== this.listId) return;
    }

    this.$emit(httpRequest.body, this._getMeta(httpRequest.body.history_items));
  },
};
