import { codereadr } from "../../codereadr.app.mjs";

export default {
  key: "codereadr-list-database-id-options",
  name: "List Database ID Options",
  description: "Retrieves available options for the Database ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    codereadr,
  },
  async run({ $ }) {
    const options = await codereadr.propDefinitions.databaseId.options.call(this.codereadr, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
