import { parseObject } from "../../common/utils.mjs";
import shopware from "../../shopware.app.mjs";

export default {
  key: "shopware-update-order",
  name: "Update Order",
  description: "Partially update information about a Order resource. [See the documentation](https://shopware.stoplight.io/docs/admin-api/3cc867261ff28-partially-update-information-about-a-order-resource)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    shopware,
    orderId: {
      propDefinition: [
        shopware,
        "orderId",
      ],
    },
    tagIds: {
      propDefinition: [
        shopware,
        "tagIds",
      ],
      withLabel: true,
      optional: true,
    },
    ruleIds: {
      propDefinition: [
        shopware,
        "ruleIds",
      ],
      optional: true,
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "Unique number associated with every order",
      optional: true,
    },
    affiliateCode: {
      type: "string",
      label: "Affiliate Code",
      description: "An affiliate code is an identification option with which website operators can mark outgoing links",
      optional: true,
    },
    campaignCode: {
      type: "string",
      label: "Campaign Code",
      description: "A campaign code is the globally unique identifier for a campaign",
      optional: true,
    },
    customerComment: {
      type: "string",
      label: "Customer Comment",
      description: "Comments given by comments",
      optional: true,
    },
    internalComment: {
      type: "string",
      label: "Internal Comment",
      description: "Comments given by the internal user",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = await this.shopware.updateOrder({
      $,
      orderId: this.orderId,
      params: {
        _response: "json",
      },
      data: {
        tags: parseObject(this.tagIds)?.map(({
          value, label,
        }) => ({
          id: value,
          name: label,
        })),
        rules: parseObject(this.ruleIds),
        orderNumber: this.orderNumber,
        affiliateCode: this.affiliateCode,
        campaignCode: this.campaignCode,
        customerComment: this.customerComment,
        internalComment: this.internalComment,
      },
    });

    $.export("$summary", `Successfully retrieved order with ID: ${this.orderId}`);
    return data;
  },
};
