import firecrawl from "../../firecrawl.app.mjs";

export default {
  key: "firecrawl-get-extract-status",
  name: "Get Extract Data",
  description: "Obtains the status and data from a previous extract operation. [See the documentation](https://docs.firecrawl.dev/api-reference/endpoint/extract-get)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    firecrawl,
    extractId: {
      type: "string",
      label: "Extract Job ID",
      description: "The ID of the extract job",
    },
  },
  async run({ $ }) {
    const response = await this.firecrawl.getExtractStatus({
      $,
      id: this.extractId,
    });

    $.export("$summary", `Successfully retrieved status for extract (ID: ${this.extractId})`);
    return response;
  },
};
