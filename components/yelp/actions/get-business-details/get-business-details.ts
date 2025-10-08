import { defineAction } from "@pipedream/types";
import yelp from "../../app/yelp.app";
import {
  DEVICE_OPTIONS, DOCS,
} from "../../common/constants";
import {
  Business, GetBusinessDetailsParams,
} from "../../common/types";

export default defineAction({
  name: "Get Business Details",
  description: `Get details about a business [See docs here](${DOCS.getBusinessDetails})`,
  key: "yelp-get-business-details",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    yelp,
    businessIdOrAlias: {
      propDefinition: [
        yelp,
        "businessIdOrAlias",
      ],
    },
    devicePlatform: {
      label: "Device Platform",
      description: "Determines the platform for mobile_link",
      type: "string",
      options: DEVICE_OPTIONS,
      optional: true,
    },
    locale: {
      propDefinition: [
        yelp,
        "locale",
      ],
    },
  },
  async run({ $ }) {
    const {
      businessIdOrAlias, devicePlatform: device_platform, locale,
    } = this;

    const params: GetBusinessDetailsParams = {
      $,
      businessIdOrAlias,
      params: {
        device_platform,
        locale,
      },
    };

    const business: Business = await this.yelp.getBusinessDetails(params);

    $.export("$summary", `Obtained details for business "${business.name}"`);

    return business;
  },
});
