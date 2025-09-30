import app from "../../epsy.app.mjs";

export default {
  key: "epsy-get-lookup-results",
  name: "Get Lookup Results",
  description: "Get the results of the lookup with the provided ID. [See the documentation](https://irbis.espysys.com/developer/)",
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
