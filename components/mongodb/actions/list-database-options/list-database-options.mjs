import mongodb from "../../mongodb.app.mjs";

export default {
  key: "mongodb-list-database-options",
  name: "List Database Options",
  description: "Retrieves available options for the Database field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mongodb,
  },
  async run({ $ }) {
    const options = await mongodb.propDefinitions.database.options.call(this.mongodb);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
