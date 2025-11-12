import common from "../common/common.mjs";
import constants from "../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "clickup-updated-task",
  name: "New Updated Task (Instant)",
  description: "Emit new event when a new task is updated",
  version: "0.0.14",
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
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Select a field to filter",
      options: constants.TASK_FIELDS,
      optional: true,
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
    customFieldIds: {
      propDefinition: [
        common.props.app,
        "customFieldId",
        (c) => ({
          listId: c.listId,
        }),
      ],
      label: "Custom Fields",
      type: "string[]",
      description: "Select a custom field to filter",
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

    let isValidated = !this.customFieldIds && !this.fields;

    for (const item of body.history_items) {
      if (this.fields?.length && this.fields.includes(item.field)) {
        isValidated = true;
        break;
      }

      if (this.customFieldIds?.length && item.custom_field &&
        this.customFieldIds.includes(item.custom_field.id)) {
        isValidated = true;
        break;
      }
    }

    if (isValidated) {
      this.$emit(body, this._getMeta(body.history_items));
    }
  },
  sampleEmit,
};
