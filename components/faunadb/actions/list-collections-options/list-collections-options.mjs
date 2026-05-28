import faunadb from "../../faunadb.app.mjs";

export default {
  key: "faunadb-list-collections-options",
  name: "List Collections Options",
  description: "Retrieves available options for the Collections field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    faunadb,
  },
  async run({ $ }) {
    const options = await faunadb.propDefinitions.collections.options.call(this.faunadb, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
