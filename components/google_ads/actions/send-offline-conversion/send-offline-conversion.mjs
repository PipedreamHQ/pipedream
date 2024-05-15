import {
  getAdditionalFieldsDescription, parseObject,
} from "../../common/utils.mjs";
import common from "../common/common.mjs";
const app = common.props.googleAds;

export default {
  ...common,
  key: "google_ads-send-offline-conversion",
  name: "Send Offline Conversion",
  description: "Send an event from to Google Ads to track offline conversions. [See the documentation](https://developers.google.com/google-ads/api/rest/reference/rest/v16/ConversionAction)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the conversion action.",
    },
    additionalFields: {
      propDefinition: [
        app,
        "additionalFields",
      ],
      description:
      getAdditionalFieldsDescription("https://developers.google.com/google-ads/api/rest/reference/rest/v16/ConversionAction"),
    },
  },
  async run({ $ }) {
    const response = await this.googleAds.createConversionAction({
      $,
      accountId: this.accountId,
      customerId: this.customerClientId,
      data: {
        operations: [
          {
            create: {
              name: this.name,
              ...parseObject(this.additionalFields),
            },
          },
        ],
      },
    });

    $.export("$summary", `Created conversion action with ID ${response.id}`);
    return response;
  },
};
