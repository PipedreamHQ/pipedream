import { _4dem } from "../../_4dem.app.mjs";

export default {
  key: "_4dem-list-sender-id-options",
  name: "List Sender ID Options",
  description: "Retrieves available options for the Sender ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    _4dem,
  },
  async run({ $ }) {
    const options = await _4dem.propDefinitions.senderId.options.call(this._4dem, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
