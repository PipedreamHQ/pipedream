import chatwork from "../../chatwork.app.mjs";

export default {
  key: "chatwork-create-task",
  name: "Create Task",
  description: "Create a new task in a specified room. [See the documentation](https://download.chatwork.com/ChatWork_API_Documentation.pdf)",
  version: "0.0.1",
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
      description: "When the task is due. *Use Unix time as input. Example `1385996399`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.chatwork.createTask({
      roomId: this.room,
      params: {
        body: this.body,
        to_ids: this.member,
        limit: this.limit,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created task with ID ${response.task_ids[0]}`);
    }

    return response;
  },
};
