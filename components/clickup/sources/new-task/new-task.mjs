import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "clickup-new-task",
  name: "New Task (Instant)",
  description: "Emit new event when a new task is created",
  version: "0.1.8",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    spaceId: {
      propDefinition: [
        common.props.app,
        "spaces",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    folderId: {
      propDefinition: [
        common.props.app,
        "folderId",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        common.props.app,
        "listId",
        (c) => ({
          folderId: c.folderId,
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    _getMeta({ task_id: taskId }) {
      return {
        id: taskId,
        summary: String(taskId),
        ts: Date.now(),
      };
    },
    _getEventsList() {
      return [
        "taskCreated",
      ];
    },
  },
  async run(httpRequest) {
    console.log("Event received");
    this.checkSignature(httpRequest);

    const { body } = httpRequest;
    const { listId } = this;
    if (listId) {
      const { task_id: taskId } = body;
      const { list: { id } } = await this.app.getTask({
        taskId,
      });

      if (id !== listId) return;
    }

    this.$emit(body, this._getMeta(body));
  },
  sampleEmit,
};
