import app from "../../mews.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Fetch Customers",
  description: "Retrieve customers using Mews Connector API. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/customers#get-all-customers)",
  key: "mews-fetch-customers",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    additionalFields: {
      propDefinition: [
        app,
        "additionalFields",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      additionalFields,
    } = this;

    const items = await app.paginate({
      requester: app.customersGetAll,
      requesterArgs: {
        $,
        data: utils.parseJson(additionalFields),
      },
      resultKey: "Customers",
    });
    $.export("summary", `Successfully fetched ${items.length} customers`);
    return items;
  },
};

