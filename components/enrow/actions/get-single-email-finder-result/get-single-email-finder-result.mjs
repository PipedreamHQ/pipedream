import enrow from "../../enrow.app.mjs";

export default {
  key: "enrow-get-single-email-finder-result",
  name: "Get Single Email Finder Result",
  description: "Retrieve a result from a single search executed via email finder function. [See the documentation](https://api.enrow.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    enrow,
    searchId: {
      propDefinition: [
        enrow,
        "searchId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.enrow.getResult(this.searchId);
    $.export("$summary", `Successfully fetched the result for search ID: ${this.searchId}`);
    return response;
  },
};
