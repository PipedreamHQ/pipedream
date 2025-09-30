import app from "../../omnivore.app.mjs";
import page from "../../common/queries/page.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "omnivore-search-for-pages",
  name: "Search For Pages",
  description: "Search for pages in Omnivore. [See the documentation](https://github.com/omnivore-app/omnivore/blob/main/packages/api/src/schema.ts#L2680)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for.",
    },
    format: {
      propDefinition: [
        app,
        "format",
      ],
    },
  },
  methods: {
    search(variables = {}) {
      return this.app.makeRequest({
        query: page.queries.search,
        variables,
      });
    },
  },
  async run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      search,
      ...variables
    } = this;

    const { search: response } = await search(variables);

    if (response.errorCodes?.length) {
      throw new Error(JSON.stringify(response, null, 2));
    }

    step.export("$summary", `Successfully retrieved ${utils.summaryEnd(response.edges.length, "page")}.`);

    return response.edges;
  },
};
