import rocket_chat from "../../rocket_chat.app.mjs";

export default {
  key: "rocket_chat-list-username-options",
  name: "List Recipient Username Options",
  description: "Retrieves available options for the Recipient Username field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rocket_chat,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await rocket_chat.propDefinitions.username.options.call(this.rocket_chat, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
