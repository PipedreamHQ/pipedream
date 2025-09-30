import { LOCALE_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import printful from "../../printful.app.mjs";

export default {
  key: "printful-calculate-shipping-rates",
  name: "Calculate Shipping Rates",
  description: "Fetches available shipping rates for a given destination. [See the documentation](https://developers.printful.com/docs/#tag/Shipping-Rate-API/operation/calculateShippingRates)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    printful,
    storeId: {
      propDefinition: [
        printful,
        "storeId",
      ],
    },
    address1: {
      label: "Address 1",
      description: "The address 1",
      type: "string",
    },
    city: {
      label: "City",
      description: "The city",
      type: "string",
    },
    stateCode: {
      label: "State Code",
      description: "The state code. E.g. `SC`",
      type: "string",
    },
    countryCode: {
      label: "Country Code",
      description: "The country code. E.g. `BR`",
      type: "string",
    },
    zip: {
      label: "ZIP/Postal Code",
      description: "The ZIP/postal code. E.g. `89221525`",
      type: "string",
    },
    phone: {
      label: "Phone",
      description: "The phone number",
      type: "string",
      optional: true,
    },
    items: {
      type: "string[]",
      label: "Items",
      description: "A list of items in JSON format. **Example: [{\"variant_id\": \"123456\", \"external_variant_id\": \"123456\", \"quantity\": 123, \"value\": \"12345\" }]**",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "3 letter currency code (optional), required if the rates need to be converted to another currency instead of store default currency",
      optional: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Locale in which shipping rate names will be returned",
      options: LOCALE_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const shippingRates = await this.printful.fetchShippingRates({
      $,
      headers: {
        "X-PF-Store-Id": this.storeId,
      },
      data: {
        recipient: {
          address1: this.address1,
          city: this.city,
          state_code: this.stateCode,
          country_code: this.countryCode,
          zip: this.zip,
          phone: this.phone,
        },
        items: parseObject(this.items),
        currency: this.currency,
        locale: this.locale,
      },
    });
    $.export("$summary", "Fetched shipping rates successfully");
    return shippingRates;
  },
};
