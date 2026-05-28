import { rejoiner } from "../../rejoiner.app.mjs";

export default {
  key: "rejoiner-list-list-id-options",
  name: "List List ID Options",
  description: "Retrieves available options for the List ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rejoiner,
  },
  async run({ $ }) {
    const options = await rejoiner.propDefinitions.listId.options.call(this.rejoiner, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
