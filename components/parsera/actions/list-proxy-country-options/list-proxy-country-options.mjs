import parsera from "../../parsera.app.mjs";

export default {
  key: "parsera-list-proxy-country-options",
  name: "List Proxy Country Options",
  description: "Retrieves available options for the Proxy Country field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    parsera,
  },
  async run({ $ }) {
    const options = await parsera.propDefinitions.proxyCountry.options.call(this.parsera);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
