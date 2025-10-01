import helpdocs from "../../helpdocs.app.mjs";

export default {
  key: "helpdocs-generate-chatbot-source-page",
  name: "Generate Chatbot Source Page",
  description: "The chatbot source page feature allows you to generate a comprehensive list of all your Knowledge Base articles that can be fed directly to your chatbot. This makes it easy to leverage your existing documentation to power AI assistants and help your customers find answers quickly. [See the documentation](https://apidocs.helpdocs.io/article/4xha228dwf-generating-a-chatbot-source-page)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helpdocs,
  },
  async run({ $ }) {
    const response = await this.helpdocs.listArticles({
      $,
      params: {
        format: "list",
      },
    });

    $.export("$summary", "Generated chatbot source page");
    return response;
  },
};
