import app from "../../mews.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Fetch Products",
  description: "Retrieve products using Mews Connector API. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/products#get-all-products)",
  key: "mews-fetch-products",
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
      requester: app.productsGetAll,
      requesterArgs: {
        $,
        data: utils.parseJson(additionalFields),
      },
      resultKey: "Products",
    });
    $.export("summary", `Successfully fetched ${items.length} products`);
    return items;
  },
};

