import app from "../../espy.app.mjs";

export default {
  key: "espy-get-lookup-results",
  name: "Get Lookup Results",
  description: "Get the results of the lookup with the provided ID. [See the documentation](https://api-docs.espysys.com/e-mail-lookup/get-get-lookup-data-for-a-request-by-e-mail-lookup)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    value: {
      propDefinition: [
        app,
        "value",
      ],
    },
    searchId: {
      propDefinition: [
        app,
        "searchId",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.getLookupResults({
      $,
      searchId: this.searchId,
      data: {
        value: this.value,
      },
      params: {
        key: `${this.app.$auth.api_key}`,
      },
    });
    $.export("$summary", `Successfully retrieved the details of the request with ID: '${this.searchId}'`);
    return response;
  },
};
