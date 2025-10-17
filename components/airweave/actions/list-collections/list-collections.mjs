import airweave from "../../airweave.app.mjs";

export default {
  key: "airweave-list-collections",
  name: "List Collections",
  description: "List all collections in your organization. Collections are logical groups of data sources that provide unified search capabilities. [See the documentation](https://docs.airweave.ai/api-reference/collections/list)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    airweave,
    skip: {
      type: "integer",
      label: "Skip",
      description: "Number of collections to skip for pagination",
      optional: true,
      default: 0,
      min: 0,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of collections to return",
      optional: true,
      default: 50,
      min: 1,
      max: 100,
    },
  },
  async run({ $ }) {
    const response = await this.airweave.listCollections({
      skip: this.skip,
      limit: this.limit,
    });

    const count = response.length;
    $.export("$summary", `Successfully retrieved ${count} collection(s)`);

    return response;
  },
};

