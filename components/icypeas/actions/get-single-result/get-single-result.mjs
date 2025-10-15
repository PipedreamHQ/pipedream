import icypeas from "../../icypeas.app.mjs";

export default {
  key: "icypeas-get-single-result",
  name: "Get Single Search Result",
  description: "Retrieves a result from a single search instance. [See the documentation](https://api-doc.icypeas.com/find-emails/search-item)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    icypeas,
    _id: {
      propDefinition: [
        icypeas,
        "_id",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.icypeas.retrieveSingleSearchResult({
      $,
      data: {
        id: this._id,
      },
    });
    $.export("$summary", `Successfully retrieved the search result for instance ID ${this._id}`);
    return response;
  },
};
