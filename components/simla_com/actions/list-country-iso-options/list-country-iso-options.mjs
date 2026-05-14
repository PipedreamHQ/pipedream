import simla_com from "../../simla_com.app.mjs";

export default {
  key: "simla_com-list-country-iso-options",
  name: "List Country ISO Options",
  description: "Retrieves available options for the Country ISO field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    simla_com,
  },
  async run({ $ }) {
    const options = await simla_com.propDefinitions.countryIso.options.call(this.simla_com);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
