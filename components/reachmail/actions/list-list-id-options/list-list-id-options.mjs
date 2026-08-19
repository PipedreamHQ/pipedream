import reachmail from "../../reachmail.app.mjs";

export default {
  key: "reachmail-list-list-id-options",
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
    reachmail,
  },
  async run({ $ }) {
    const options = await reachmail.propDefinitions.listId.options.call(this.reachmail, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
