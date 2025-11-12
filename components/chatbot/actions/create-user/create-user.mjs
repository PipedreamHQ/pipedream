import chatbot from "../../chatbot.app.mjs";

export default {
  key: "chatbot-create-user",
  name: "Create User",
  description: "Creates new user. [See docs here](https://www.chatbot.com/docs/users/#create-user)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chatbot,
    email: {
      label: "Email",
      description: "The email of the user",
      type: "string",
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
      email,
      name,
      username,
    } = this;

    const response = await this.chatbot.createUser({
      data: {
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
