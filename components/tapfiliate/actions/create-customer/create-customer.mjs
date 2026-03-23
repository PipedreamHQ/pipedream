import { ConfigurationError } from "@pipedream/platform";
import { STATUS_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import tapfiliate from "../../tapfiliate.app.mjs";

export default {
  key: "tapfiliate-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Tapfiliate. [See the documentation](https://tapfiliate.com/docs/rest/#customers-customers-collection-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    tapfiliate,
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The id for this customer in your system. The customer id should be unique for each customer",
    },
    affiliateId: {
      propDefinition: [
        tapfiliate,
        "affiliateId",
      ],
      optional: true,
    },
    referralCode: {
      propDefinition: [
        tapfiliate,
        "referralCode",
        ({ affiliateId }) => ({
          affiliateId,
        }),
      ],
      optional: true,
    },
    trackingId: {
      type: "string",
      label: "Tracking ID",
      description: "XXX-XXXX-XXXX-XXXXX - The tracking id, to be retrieved from Tapfiliate javascript library. Please refer to Tapfiliate [REST API integration guide](https://tapfiliate.com/docs/integrations/rest-api/) for more info",
      optional: true,
    },
    clickId: {
      type: "string",
      label: "Click ID",
      description: "Used to add additional reporting information",
      optional: true,
    },
    coupon: {
      type: "string",
      label: "Coupon",
      description: "A coupon code to track the conversion by",
      optional: true,
    },
    assetId: {
      type: "string",
      label: "Asset ID",
      description: "The asset id (use with Source ID)",
      optional: true,
    },
    sourceId: {
      type: "string",
      label: "Source ID",
      description: "The source id (use with Asset ID)",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Determines the intial status for the customer. You can read more about statuses [here](https://support.tapfiliate.com/en/articles/3092024-what-are-customers#customer-status). Defaults to \"new\" if none is passed",
      optional: true,
      options: STATUS_OPTIONS,
    },
    metaData: {
      type: "object",
      label: "Meta Data",
      description: "Meta data for this resource",
      optional: true,
    },
    userAgent: {
      type: "string",
      label: "User Agent",
      description: "The client's user agent string. Used for statistics and fraud detection",
      optional: true,
    },
    ip: {
      type: "string",
      label: "IP Address",
      description: "The client's ip. Used for fraud detection",
      optional: true,
    },
    overrideMaxCookieTime: {
      type: "boolean",
      label: "Override Max Cookie Time",
      description: "Override the maximum cookie time",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const {
      customerId,
      referralCode,
      trackingId,
      clickId,
      coupon,
      assetId,
      sourceId,
      status,
      metaData,
      userAgent,
      ip,
      overrideMaxCookieTime,
    } = this;

    const hasTracking = referralCode || trackingId || clickId || coupon || (assetId && sourceId);
    if (!hasTracking) {
      throw new ConfigurationError(
        "At least one of Referral Code, Tracking ID, Click ID, Coupon, or Asset ID + Source ID is required to attribute the customer to an affiliate",
      );
    }

    const data = {
      customer_id: customerId,
    };

    if (referralCode) data.referral_code = referralCode;
    if (trackingId) data.tracking_id = trackingId;
    if (clickId) data.click_id = clickId;
    if (coupon) data.coupon = coupon;
    if (assetId && sourceId) {
      data.asset_id = assetId;
      data.source_id = sourceId;
    }
    if (status) data.status = status;
    if (metaData) data.meta_data = parseObject(metaData);
    if (userAgent) data.user_agent = userAgent;
    if (ip) data.ip = ip;

    const params = {};
    if (overrideMaxCookieTime) params.override_max_cookie_time = true;

    const response = await this.tapfiliate.createCustomer({
      $,
      data,
      params,
    });

    $.export("$summary", `Successfully created customer with id: ${response.id}`);
    return response;
  },
};
