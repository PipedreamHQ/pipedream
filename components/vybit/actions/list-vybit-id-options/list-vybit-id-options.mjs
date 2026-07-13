import vybit from "../../vybit.app.mjs";

export default {
  key: "vybit-list-vybit-id-options",
  name: "List Vybit ID Options",
  description: "Retrieves available options for the Vybit ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    vybit,
  },
  async run({ $ }) {
    const options = await vybit.propDefinitions.vybitId.options.call(this.vybit, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
