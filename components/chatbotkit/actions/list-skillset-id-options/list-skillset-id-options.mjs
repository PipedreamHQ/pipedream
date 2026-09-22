import chatbotkit from "../../chatbotkit.app.mjs";

export default {
  key: "chatbotkit-list-skillset-id-options",
  name: "List Skillset ID Options",
  description: "Retrieves available options for the Skillset ID field.",
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
    const options = await chatbotkit.propDefinitions.skillsetId.options.call(this.chatbotkit);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
