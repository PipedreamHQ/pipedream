import chatbot from "../../chatbot.app.mjs";

export default {
  key: "chatbot-create-user",
  name: "Create User",
  description: "Creates new user. [See docs here](https://www.chatbot.com/docs/users/#list-users)",
  version: "0.0.1",
  type: "action",
  props: {
    chatbot,
    userId: {
      label: "User ID",
      description: "The user ID",
      type: "string",
    },
    email: {
      label: "Email",
      description: "The email of the user",
      type: "string",
      optional: true,
    },
    name: {
      label: "Name",
      description: "The name of the user",
      type: "string",
      optional: true,
    },
    username: {
      label: "Username",
      description: "The username of the user",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      userId,
      email,
      name,
      username,
    } = this;

    const response = await this.chatbot.createUser({
      data: {
        userId,
        attributes: {
          default_email: email,
          default_name: name,
          default_username: username,
        },
      },
      $,
    });

    if (response?.status?.code < 300) $.export("$summary", "Successfully created user");

    return response;
  },
};
