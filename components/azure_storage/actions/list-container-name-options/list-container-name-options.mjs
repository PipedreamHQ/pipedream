import azure_storage from "../../azure_storage.app.mjs";

export default {
  key: "azure_storage-list-container-name-options",
  name: "List Container Name Options",
  description: "Retrieves available options for the Container Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    azure_storage,
  },
  async run({ $ }) {
    const options = await azure_storage.propDefinitions.containerName.options
      .call(this.azure_storage);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
