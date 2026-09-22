import _2chat from "../../_2chat.app.mjs";

export default {
  key: "_2chat-list-from-number-options",
  name: "List From Phone Number Options",
  description: "Retrieves available options for the From Phone Number field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    _2chat,
  },
  async run({ $ }) {
    const options = await _2chat.propDefinitions.fromNumber.options.call(this._2chat);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
