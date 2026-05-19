import acumbamail from "../../acumbamail.app.mjs";

export default {
  key: "acumbamail-list-list-id-options",
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
    acumbamail,
  },
  async run({ $ }) {
    const options = await acumbamail.propDefinitions.listId.options.call(this.acumbamail);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
