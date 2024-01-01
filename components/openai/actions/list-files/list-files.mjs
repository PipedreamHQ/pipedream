import openai from "../../openai.app.mjs";

export default {
  key: "openai-list-files",
  name: "List Files",
  description: "Returns a list of files that belong to the user's organization. [See the documentation](https://platform.openai.com/docs/api-reference/files/list)",
  version: "0.0.6",
  type: "action",
  props: {
    openai,
    purpose: {
      propDefinition: [
        openai,
        "purpose",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.openai.listFiles({
      purpose: this.purpose,
    });
    const summary = `Successfully listed ${response.length} files`;
    $.export("$summary", summary);
    return response;
  },
};
