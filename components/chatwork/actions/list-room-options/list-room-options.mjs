import { chatwork } from "../../chatwork.app.mjs";

export default {
  key: "chatwork-list-room-options",
  name: "List Room Options",
  description: "Retrieves available options for the Room field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    chatwork,
  },
  async run({ $ }) {
    const options = await chatwork.propDefinitions.room.options.call(this.chatwork, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
