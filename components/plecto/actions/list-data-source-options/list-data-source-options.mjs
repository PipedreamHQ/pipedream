import plecto from "../../plecto.app.mjs";

export default {
  key: "plecto-list-data-source-options",
  name: "List Data Source Options",
  description: "Retrieves available options for the Data Source field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    plecto,
  },
  async run({ $ }) {
    const options = await plecto.propDefinitions.dataSource.options.call(this.plecto);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
