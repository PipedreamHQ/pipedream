import enrow from "../../enrow.app.mjs";

export default {
  key: "enrow-get-single-email-finder-result",
  name: "Get Single Email Finder Result",
  description: "Retrieve a result from a single search executed via email finder function. [See the documentation](https://enrow.readme.io/reference/get-single-email-finder-result)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    enrow,
    searchId: {
      type: "string",
      label: "Search ID",
      description: "The identifier for the specific search.",
    },
  },
  async run({ $ }) {
    const response = await this.enrow.getResult({
      $,
      params: {
        id: this.searchId,
      },
    });
    $.export("$summary", `Successfully fetched the result for search ID: ${this.searchId}`);
    return response;
  },
};
