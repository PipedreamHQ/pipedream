import heyzine from "../../heyzine.app.mjs";

export default {
  key: "heyzine-create-flipbook",
  name: "Create Flipbook",
  description: "Generates a new flipbook from a PDF file. [See the documentation](https://heyzine.com/developers#rest-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    heyzine,
    pdf: {
      type: "string",
      label: "PDF",
      description: "Url pointing to the pdf to be converted. Must be a direct link to a PDF file.",
    },
  },
  async run({ $ }) {
    const response = await this.heyzine.makeRequest({
      $,
      params: {
        pdf: this.pdf,
      },
    });
    $.export("$summary", `Successfully created a new flipbook with ID: ${response.id}`);
    return response;
  },
};
