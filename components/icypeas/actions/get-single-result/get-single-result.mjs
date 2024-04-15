import icypeas from "../../icypeas.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "icypeas-get-single-result",
  name: "Get Single Search Result",
  description: "Retrieves a result from a single search instance. [See the documentation](https://api-doc.icypeas.com/find-emails/search-item)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    icypeas,
    _id: {
      type: "string",
      label: "Search Instance ID",
      description: "The identifier of the specific search instance.",
    },
  },
  async run({ $ }) {
    const response = await this.icypeas.retrieveSingleSearchResult({
      searchInstanceId: this._id,
    });
    $.export("$summary", `Successfully retrieved the search result for instance ID ${this._id}`);
    return response;
  },
};
