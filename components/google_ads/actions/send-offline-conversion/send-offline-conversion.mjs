import { parseObject } from "../../common/utils.mjs";
import common from "../common/common.mjs";
import { getAdditionalFields } from "../common/props.mjs";
import { CONVERSION_TYPE_OPTIONS } from "./common-constants.mjs";

export default {
  ...common,
  key: "google_ads-send-offline-conversion",
  name: "Send Offline Conversion",
  description: "Send an event to Google Ads to track offline conversions. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/ConversionAction)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "[The type](https://developers.google.com/google-ads/api/reference/rpc/v21/ConversionActionTypeEnum.ConversionActionType) of the conversion action.",
      options: CONVERSION_TYPE_OPTIONS,
    },
    additionalFields: getAdditionalFields("https://developers.google.com/google-ads/api/reference/rpc/v21/ConversionAction"),
  },
  async run({ $ }) {
    const {
      googleAds, accountId, customerClientId, additionalFields, ...data
    } = this;
    const { results: { [0]: response } } = await googleAds.createConversionAction({
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

    const id = response.resourceName.split("/").pop();

    $.export("$summary", `Created conversion action with ID ${id}`);
    return {
      id,
      ...response,
    };
  },
};
