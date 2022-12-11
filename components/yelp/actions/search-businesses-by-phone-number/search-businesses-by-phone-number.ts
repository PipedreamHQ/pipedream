import { defineAction } from "@pipedream/types";
import yelp from "../../app/yelp.app";
import { DOCS } from "../../common/constants";
import { SearchBusinessesByPhoneResponse } from "../../common/types";

export default defineAction({
  name: "Search Businesses By Phone Number",
  description: `Search businesses by phone number [See docs here](${DOCS.searchByPhone})`,
  key: "yelp-search-businesses-by-phone-number",
  version: "0.0.1",
  type: "action",
  props: {
    yelp,
    phone: {
      label: "Phone Number",
      description:
        "Phone number of the business you want to search for. It must start with `+` and include the country code, like `+14159083801`.",
      type: "string",
    },
    locale: {
      propDefinition: [yelp, "locale"],
    },
  },
  async run({ $ }) {
    const { locale, phone } = this;

    const params = {
      $,
      params: {
        locale,
        phone,
      },
    };

    const { businesses }: SearchBusinessesByPhoneResponse =
      await this.yelp.searchBusinessesByPhoneNumber(params);
    const { length } = businesses;

    let summary: string;
    switch (length) {
      case 0:
        summary = "No businesses found with the given phone number";
        break;
      case 1:
        summary = `Found business "${businesses[0].name}"`;
        break;
      default:
        summary = `Found ${length} businesses`;
    }

    $.export("$summary", summary);

    return businesses;
  },
});
