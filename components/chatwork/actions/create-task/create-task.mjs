import chatwork from "../../chatwork.app.mjs";

export default {
  key: "chatwork-create-task",
  name: "Create Task",
  description: "Create a new task in a specified room. [See the documentation](https://download.chatwork.com/ChatWork_API_Documentation.pdf)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chatwork,
    room: {
      propDefinition: [
        chatwork,
        "room",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "Task description",
    },
    member: {
      propDefinition: [
        chatwork,
        "member",
        (c) => ({
          roomId: c.room,
        }),
      ],
    },
    limit: {
      type: "string",
      label: "Limit",
      description: "When the task is due. Use Datetime in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). Example `2023-05-26T06:00:00Z`",
      optional: true,
    },
  },
  async run({ $ }) {
    const limit = (new Date(this.limit)).getTime() / 1000;
    const response = await this.chatwork.createTask({
      roomId: this.room,
      params: {
        body: this.body,
        to_ids: this.member,
        limit,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created task with ID ${response.task_ids[0]}`);
    }

    return response;
  },
};
