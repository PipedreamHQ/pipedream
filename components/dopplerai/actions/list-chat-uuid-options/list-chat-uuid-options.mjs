import dopplerai from "../../dopplerai.app.mjs";

export default {
  key: "dopplerai-list-chat-uuid-options",
  name: "List Chat UUID Options",
  description: "Retrieves available options for the Chat UUID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dopplerai,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await dopplerai.propDefinitions.chatUuid.options.call(this.dopplerai, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
