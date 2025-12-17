import chatbot from "../../chatbot.app.mjs";

export default {
  key: "chatbot-get-users",
  name: "Get Users",
  description: "Get a list of users. [See docs here](https://www.chatbot.com/docs/users/#list-users)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    chatbot,
  },
  async run({ $ }) {
    const response = await this.chatbot.getUsers({
      $,
    });

    $.export("$summary", "Successfully retrieved users");

    return response;
  },
};
