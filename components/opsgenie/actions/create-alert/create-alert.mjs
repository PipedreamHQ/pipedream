import app from "../../opsgenie.app.mjs";

export default {
  key: "opsgenie-create-alert",
  name: "Create Alert",
  description: "Send a new Alert for processing. [See the documentation](https://www.postman.com/api-evangelist/opsgenie/request/zuj17nj/create-alert)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    user: {
      propDefinition: [
        app,
        "user",
      ],
    },
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
    note: {
      propDefinition: [
        app,
        "note",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
    priority: {
      propDefinition: [
        app,
        "priority",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createAlert({
      $,
      data: {
        message: this.message,
        user: this.user,
        note: this.note,
        description: this.description,
        tags: this.tags,
        priority: this.priority,
      },
    });

    $.export("$summary", `Successfully sent a new alert for processing. The alert ID can be used to check the request status: '${response.requestId}'`);

    return response;
  },
};
