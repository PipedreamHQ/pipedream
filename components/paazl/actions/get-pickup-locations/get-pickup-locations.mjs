import { COUNTRY_OPTIONS } from "../../common/constants.mjs";
import paazl from "../../paazl.app.mjs";

export default {
  key: "paazl-get-pickup-locations",
  name: "Get Pickup Locations",
  description: "Retrieve available pickup locations from Paazl. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Shipping%20options/getPickupLocationsUsingPOST)",
  version: "0.0.1",
  type: "action",
  props: {
    paazl,
    consigneeCountryCode: {
      type: "string",
      label: "Consignee Country Code",
      description: "The ISO 3166-2 code for the country to which an order is shipped.",
      options: COUNTRY_OPTIONS,
    },
    consigneePostalCode: {
      type: "string",
      label: "Consignee Postal Code",
      description: "The postal code of the address to which an order is shipped. The code is used to get a more precise list of available shipping options.",
    },
    consignorCountryCode: {
      type: "string",
      label: "Consignor Country Code",
      description: "The ISO 3166-2 code for the country the shipment is being sent from. If left empty, Paazl will use the default setting in your Paazl web app account.",
      optional: true,
      options: COUNTRY_OPTIONS,
    },
    consignorPostalCode: {
      type: "string",
      label: "Consignor Postal Code",
      description: "The postal code of the address from which an order is shipped. The code is used to get delivery dates from carriers if they offer this service. The default value is the value in your Paazl web app account.",
      optional: true,
    },
    deliveryDateNumberOfDays: {
      type: "integer",
      label: "Delivery Date - Number of Days",
      description: "The length of time in days after startDate for which shipping options are supplied. The default value is `7`.",
      optional: true,
    },
    deliveryDateStartDate: {
      type: "string",
      label: "Delivery Date - Start Date",
      description: "The starting point of a range of possible delivery dates. Format: \"YYYY-MM-DD\" The default value is today's date. Note! When calculating the start date for a delivery date range, Paazl adds the number of delivery days and processing days you have configured in your webshop's [delivery matrix](https://support.paazl.com/hc/en-us/articles/360007580074-Configuring-your-delivery-matrix-).",
      optional: true,
    },
    includeExternalDeliveryDates: {
      type: "boolean",
      label: "Include External Delivery Dates",
      description: "Gets delivery dates directly from the carrier if the carrier supplies them.",
      default: false,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of shipping options that Paazl must return.",
      min: 1,
      max: 99,
      optional: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Specifies the language in which the widget is displayed as well as the localized shipping option names you have configured in your web app account (under **Settings>Paazl Perfect>Shipping options**). locale is specified using the format `{language}_{country}`, where `{language}` is an [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) language code and `{country}` is an [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) country code. Example: `fr_FR`",
      optional: true,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "Specifies the time zone for which the delivery days should be calculated. If not specified, the default time zone Europe/Amsterdam is used. Example: timeZone:\"Europe/Amsterdam\", timeZone:\"UTC\", timeZone:\"GMT+3\", timeZone:\"UTC+01:30\"",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.paazl.getPickupLocations({
      $,
      data: {
        consigneeCountryCode: this.consigneeCountryCode,
        consigneePostalCode: this.consigneePostalCode,
        consignorCountryCode: this.consignorCountryCode,
        consignorPostalCode: this.consignorPostalCode,
        deliveryDateNumberOfDays: this.deliveryDateNumberOfDays,
        deliveryDateStartDate: this.deliveryDateStartDate,
        includeExternalDeliveryDates: this.includeExternalDeliveryDates,
        limit: this.limit,
        locale: this.locale,
        timeZone: this.timeZone,
      },
    });
    return response;
  },
};
