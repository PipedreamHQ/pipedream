import { parseObject } from "../../common/utils.mjs";
import common from "../common/common.mjs";
import { getAdditionalFields } from "../common/props.mjs";
import { CONVERSION_TYPE_OPTIONS } from "./constants.mjs";

export default {
  ...common,
  key: "google_ads-send-offline-conversion",
  name: "Send Offline Conversion",
  description: "Send an event from to Google Ads to track offline conversions. [See the documentation](https://developers.google.com/google-ads/api/rest/reference/rest/v16/ConversionAction)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ...common.props,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the conversion action.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the conversion action.",
      options: CONVERSION_TYPE_OPTIONS,
    },
    additionalFields: getAdditionalFields("https://developers.google.com/google-ads/api/rest/reference/rest/v16/ConversionAction"),
  },
  async run({ $ }) {
    const {
      googleAds, accountId, customerClientId, additionalFields, ...data
    } = this;
    const response = await googleAds.createConversionAction({
      $,
      accountId,
      customerClientId,
      data: {
        operations: [
          {
            create: {
              ...data,
              ...parseObject(additionalFields),
            },
          },
        ],
      },
    });

    $.export("$summary", `Created conversion action with ID ${response.id}`);
    return response;
  },
};
