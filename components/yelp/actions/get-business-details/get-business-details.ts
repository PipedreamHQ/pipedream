import { defineAction } from "@pipedream/types";
import yelp from "../../app/yelp.app";
import { DEVICE_OPTIONS, DOCS } from "../../common/constants";
import { Business } from "../../common/types";

export default defineAction({
  name: "Get Business Details",
  description: `Get details about a business [See docs here](${DOCS.getBusinessDetails})`,
  key: "yelp-get-business-details",
  version: "0.0.1",
  type: "action",
  props: {
    yelp,
    businessIdOrAlias: {
      label: "Business ID or Alias",
      description:
        "A unique identifier for a Yelp Business. Can be either a 22-character Yelp Business ID, or a Yelp Business Alias.",
      type: "string",
    },
    devicePlatform: {
      label: "Device Platform",
      description: "Determines the platform for mobile_link",
      type: "string",
      options: DEVICE_OPTIONS,
      optional: true,
    },
    locale: {
      propDefinition: [yelp, "locale"],
    },
  },
  async run({ $ }) {
    const { businessIdOrAlias, devicePlatform, locale } = this;

    const params = {
      $,
      businessIdOrAlias,
      params: {
        devicePlatform,
        locale,
      },
    };

    const business: Business = await this.yelp.getBusinessDetails(params);

    $.export("$summary", `Obtained details for business "${business.name}"`);

    return business;
  },
});
