import akeneo from "../../akeneo.app.mjs";

export default {
  key: "akeneo-list-locale-options",
  name: "List Locale Options",
  description: "Retrieves available options for the Locale field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    akeneo,
  },
  async run({ $ }) {
    const options = await akeneo.propDefinitions.locale.options.call(this.akeneo);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
