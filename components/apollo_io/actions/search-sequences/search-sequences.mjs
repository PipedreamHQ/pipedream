import app from "../../apollo_io.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "apollo_io-search-sequences",
  name: "Search For Sequences",
  description: "Search for sequences in Apollo.io. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#search-for-sequences)",
  type: "action",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    search: {
      type: "string",
      label: "Search",
      description: "The sequence's name",
    },
  },
  async run({ $ }) {
    const resourcesStream = this.app.getIterations({
      resourceFn: this.app.listSequences,
      resourceFnArgs: {
        params: {
          q_name: this.search,
        },
      },
      resourceName: "emailer_campaigns",
    });

    const sequences = await utils.iterate(resourcesStream);

    $.export("$summary", `Successfully fetched ${sequences.length} sequences.`);

    return sequences;

  },
};
