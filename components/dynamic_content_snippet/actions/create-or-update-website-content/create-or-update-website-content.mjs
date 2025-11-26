import dynamicContentSnippet from "../../dynamic_content_snippet.app.mjs";

export default {
  key: "dynamic_content_snippet-create-or-update-website-content",
  name: "Create or Update Website Content",
  description: "Create or update website content. [See the documentation](https://contentsnip.com/documentation.htm)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    dynamicContentSnippet,
    url: {
      type: "string",
      label: "URL",
      description: "URL of the webpage where content will appear",
    },
    htmlContent: {
      type: "string",
      label: "HTML Content",
      description: "HTML content to display at the target URL",
    },
  },
  async run({ $ }) {
    const response = await this.dynamicContentSnippet.createOrUpdateWebsiteContent({
      $,
      data: {
        url: this.url,
        htmlContent: this.htmlContent,
      },
    });
    $.export("$summary", `Successfully created or updated website content for \`${this.url}.\``);
    return response;
  },
};
