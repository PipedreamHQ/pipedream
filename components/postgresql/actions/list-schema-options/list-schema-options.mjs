import postgresql from "../../postgresql.app.mjs";

export default {
  key: "postgresql-list-schema-options",
  name: "List Schema Options",
  description: "Retrieves available options for the Schema field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    postgresql,
  },
  async run({ $ }) {
    const options = await postgresql.propDefinitions.schema.options.call(this.postgresql);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
