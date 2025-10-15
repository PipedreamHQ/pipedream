import shopify from "../../shopify.app.mjs";
import common from "../common/metaobjects.mjs";
import { MAX_LIMIT } from "../../common/constants.mjs";

export default {
  ...common,
  key: "shopify-get-metaobjects",
  name: "Get Metaobjects",
  description: "Retrieves a list of metaobjects. [See the documentation](https://shopify.dev/docs/api/admin-graphql/unstable/queries/metaobjects)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shopify,
    type: {
      propDefinition: [
        shopify,
        "metaobjectType",
      ],
      withLabel: true,
    },
  },
  async run({ $ }) {
    const response = await this.shopify.listMetaobjects({
      type: this.type.label,
      first: MAX_LIMIT,
    });

    const numObjects = (response.metaobjects.nodes).length;
    $.export("$summary", `Successfully retrieved ${numObjects} metaobject${numObjects === 1
      ? ""
      : "s"}`);

    return response;
  },
};
