import weaviate from "../../weaviate.app.mjs";

export default {
  key: "weaviate-list-class-id-options",
  name: "List Class ID Options",
  description: "Retrieves available options for the Class ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    weaviate,
  },
  async run({ $ }) {
    const options = await weaviate.propDefinitions.classId.options.call(this.weaviate, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
