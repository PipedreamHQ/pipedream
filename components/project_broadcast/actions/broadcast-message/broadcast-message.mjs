import app from "../../project_broadcast.app.mjs";

export default {
  key: "project_broadcast-broadcast-message",
  name: "Broadcast Message",
  description: "Sends a broadcast message to a list of contacts. [See the documentation](https://www.projectbroadcast.com/apidoc/#api-Broadcast_Messages-CreateBroadcastMessage)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    scheduledAt: {
      type: "string",
      label: "Scheduled At",
      description: "Date/Time to send message in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp format. Example: `2023-01-01T00:00:00.000Z`. Not providing a runAt will schedule the message for immediate delivery.",
      optional: true,
    },
    text: {
      type: "string",
      label: "Message Text",
      description: "The text of the message to send.",
    },
    contacts: {
      type: "string[]",
      label: "Contacts",
      description: "Array of contact ids to send message to.",
      propDefinition: [
        app,
        "contactId",
      ],
    },
  },
  methods: {
    broadcastMessage(args = {}) {
      return this.app.post({
        path: "/broadcasts",
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      broadcastMessage,
      ...data
    } = this;

    return broadcastMessage({
      step,
      data,
      summary: (response) => `Successfully broadcast message with ID \`${response._id}\`.`,
    });
  },
};
