import yay_com from "../../yay_com.app.mjs";

export default {
  key: "yay_com-list-hunt-groups-options",
  name: "List Target Hunt Groups Options",
  description: "Retrieves available options for the Target Hunt Groups field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    yay_com,
  },
  async run({ $ }) {
    const options = await yay_com.propDefinitions.huntGroups.options.call(this.yay_com);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
