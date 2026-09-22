import dbt from "../../dbt.app.mjs";

export default {
  key: "dbt-list-account-id-options",
  name: "List Account Options",
  description: "Retrieves available options for the Account field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dbt,
  },
  async run({ $ }) {
    const options = await dbt.propDefinitions.accountId.options.call(this.dbt);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
