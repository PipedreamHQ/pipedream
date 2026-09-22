import libraria from "../../libraria.app.mjs";

export default {
  key: "libraria-list-library-id-options",
  name: "List Library ID Options",
  description: "Retrieves available options for the Library ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    libraria,
  },
  async run({ $ }) {
    const options = await libraria.propDefinitions.libraryId.options.call(this.libraria);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
