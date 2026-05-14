import sitespeakai from "../../sitespeakai.app.mjs";

export default {
  key: "sitespeakai-list-chatbot-id-options",
  name: "List Chatbot Options",
  description: "Retrieves available options for the Chatbot field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sitespeakai,
  },
  async run({ $ }) {
    const options = await sitespeakai.propDefinitions.chatbotId.options.call(this.sitespeakai);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
