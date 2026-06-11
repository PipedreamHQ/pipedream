import splynx from "../../splynx.app.mjs";

export default {
  key: "splynx-list-tariff-id-options",
  name: "List Tariff ID Options",
  description: "Retrieves available options for the Tariff ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    splynx,
  },
  async run({ $ }) {
    const options = await splynx.propDefinitions.tariffId.options.call(this.splynx);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
