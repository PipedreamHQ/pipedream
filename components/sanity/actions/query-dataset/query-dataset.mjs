import sanity from "../../sanity.app.mjs";

export default {
  key: "sanity-query-dataset",
  name: "Query Dataset",
  description: "Query a dataset in Sanity. [See the documentation](https://www.sanity.io/docs/http-reference/query)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sanity,
    dataset: {
      propDefinition: [
        sanity,
        "dataset",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "The GROQ query to run. Example: `*[_type == 'movie']`",
      default: "*",
    },
  },
  async run({ $ }) {
    const response = await this.sanity.queryDataset({
      $,
      dataset: this.dataset,
      params: {
        query: this.query,
      },
    });

    $.export("$summary", "Successfully queried dataset");
    return response;
  },
};
