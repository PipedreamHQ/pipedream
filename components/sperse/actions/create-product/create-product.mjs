import app from "../../sperse.app.mjs";
import { parseArray } from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "sperse-create-product",
  name: "Create Product",
  description: "Creates a new product. [See the documentation](https://app.sperse.com/app/api/swagger)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "At least one **Price Option** should be specified for the product",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the product",
    },
    code: {
      type: "string",
      label: "Product Code",
      description: "The product code",
    },
    productType: {
      type: "string",
      label: "Product Type",
      description: "The type of the product",
      options: constants.PRODUCT_TYPES,
    },
    currencyId: {
      propDefinition: [
        app,
        "currencyId",
      ],
    },
    priceOptions: {
      type: "string[]",
      label: "Price Options",
      description: `An array of price option objects. [See the documentation](https://app.sperse.com/app/api/swagger)

**Example:**
\`\`\`json
[
  {
    "type": "Subscription",
    "frequency": "OneTime",
    "fee": 0,
    "customerChoosesPrice": false,
    "credits": 100,
    "trialDayCount": 0,
    "customPeriodCount": 14,
    "customPeriodType": "Days"
  }
]
\`\`\``,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the product",
      optional: true,
    },
    descriptionHtml: {
      type: "string",
      label: "Description HTML",
      description: "The HTML description of the product",
      optional: true,
    },
    barCode: {
      type: "string",
      label: "Bar Code",
      description: "The product barcode",
      optional: true,
    },
    isPublished: {
      type: "boolean",
      label: "Is Published",
      description: "Whether the product is published",
      optional: true,
    },
    publishDate: {
      type: "string",
      label: "Publish Date",
      description: "The publish date is required if the product is published. Example: `2026-02-16`",
      optional: true,
    },
    groupName: {
      type: "string",
      label: "Group Name",
      description: "The product group name",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      name,
      code,
      productType,
      currencyId,
      description,
      descriptionHtml,
      priceOptions,
      groupName,
      barCode,
      isPublished,
      publishDate,
    } = this;

    const response = await app.createProduct({
      $,
      data: {
        name,
        code,
        type: productType,
        currencyId,
        description,
        descriptionHtml,
        barCode,
        isPublished,
        priceOptions: parseArray(priceOptions),
        groupName,
        publishDate,
      },
    });

    $.export("$summary", `Successfully created product with ID \`${response.result.productId}\`.`);

    return response;
  },
};
