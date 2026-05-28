import { chatbotkit } from "../../chatbotkit.app.mjs";

export default {
  key: "chatbotkit-list-dataset-id-options",
  name: "List Dataset ID Options",
  description: "Retrieves available options for the Dataset ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    chatbotkit,
  },
  async run({ $ }) {
    const options = await chatbotkit.propDefinitions.datasetId.options.call(this.chatbotkit, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
