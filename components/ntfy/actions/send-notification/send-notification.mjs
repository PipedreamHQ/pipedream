import app from "../../ntfy.app.mjs";

export default {
  key: "ntfy-send-notification",
  name: "Send Notification",
  description: "Send a notification using Ntfy. [See the documentation](https://docs.ntfy.sh/publish/).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    topic: {
      type: "string",
      label: "Topic",
      description: "The topic to which the notification will be sent",
    },
    data: {
      type: "string",
      label: "Message",
      description: "The message content of the notification",
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "Optional headers to include in the request. [See the documentation](https://docs.ntfy.sh/publish/).",
      optional: true,
    },
  },
  methods: {
    sendNotification({
      topic, ...args
    } = {}) {
      return this.app.post({
        path: `/${topic}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      sendNotification,
      topic,
      data,
      headers,
    } = this;

    const response = await sendNotification({
      $,
      headers,
      topic,
      data,
    });

    $.export("$summary", `Successfully sent notification with ID \`${response.id}\`.`);
    return response;
  },
};
