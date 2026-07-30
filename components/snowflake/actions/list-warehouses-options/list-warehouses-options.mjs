import snowflake from "../../snowflake.app.mjs";

export default {
  key: "snowflake-list-warehouses-options",
  name: "List Warehouse Name Options",
  description: "Retrieves available options for the Warehouse Name field.",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    snowflake,
    session: {
      propDefinition: [
        snowflake,
        "session",
      ],
    },
  },
  async run({ $ }) {
    if (this.session) {
      this.snowflake.restoreSession(this.session);
    }

    const options = await snowflake.propDefinitions.warehouses.options.call(this.snowflake);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
