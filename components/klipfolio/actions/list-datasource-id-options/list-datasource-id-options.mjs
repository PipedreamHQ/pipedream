import { klipfolio } from "../../klipfolio.app.mjs";

export default {
  key: "klipfolio-list-datasource-id-options",
  name: "List Datasource ID Options",
  description: "Retrieves available options for the Datasource ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    klipfolio,
  },
  async run({ $ }) {
    const options = await klipfolio.propDefinitions.datasourceId.options.call(this.klipfolio, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
