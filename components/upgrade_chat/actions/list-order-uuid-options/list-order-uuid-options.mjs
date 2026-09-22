import upgrade_chat from "../../upgrade_chat.app.mjs";

export default {
  key: "upgrade_chat-list-order-uuid-options",
  name: "List Order UUID Options",
  description: "Retrieves available options for the Order UUID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    upgrade_chat,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await upgrade_chat.propDefinitions.orderUuid.options.call(this.upgrade_chat, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
