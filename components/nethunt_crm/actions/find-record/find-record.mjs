import nethuntCrm from "../../nethunt_crm.app.mjs";

export default {
  key: "nethunt_crm-find-record",
  name: "Find Record",
  description: "Search for a record using a text query. [See docs here](https://nethunt.com/integration-api#find-record)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nethuntCrm,
    folderId: {
      propDefinition: [
        nethuntCrm,
        "folderId",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "The search query, e.g. `stage:(Negotiating OR New OR Presentation)`. [More information here](https://help.nethunt.com/en/articles/2534596-how-to-use-advanced-search?_ga=2.192832618.1188205028.1678361570-2033894495.1678361570&_gl=1*c9vzhf*_ga*MjAzMzg5NDQ5NS4xNjc4MzYxNTcw*_ga_1F3EQ4F96H*MTY3ODM4MjE1Ny4yLjEuMTY3ODM4NzAxOC42MC4wLjA.#advanced-search).",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of records to return. Defaults to `1`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.nethuntCrm.findRecords({
      folderId: this.folderId,
      query: this.query,
      limit: this.limit,
    });
    const suffix = response.length === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully found ${response.length} record${suffix}`);
    return response;
  },
};
