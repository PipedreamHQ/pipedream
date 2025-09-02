import { ConfigurationError } from "@pipedream/platform";
import { COUNTRY_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import paazl from "../../paazl.app.mjs";

export default {
  key: "paazl-create-order",
  name: "Create Order",
  description: "Create a new order in Paazl. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Order/saveOrderUsingPOST)",
  version: "0.0.1",
  type: "action",
  props: {
    paazl,
    additionalInstruction: {
      type: "string",
      label: "Additional Instruction",
      description: "Additional instructions for the delivery of an order. E.g. `Call before delivery`.",
      optional: true,
    },
    consigneeCompanyName: {
      type: "string",
      label: "Consignee - Company Name",
      description: "The name of a company to which an order is shipped.",
      optional: true,
    },
    consigneeVatNumber: {
      type: "string",
      label: "Consignee - VAT Number",
      description: "The VAT number of the receiver. This is the tax identification number of the receiver, that can be used by B2B international shipments for customs, for some carriers.",
      optional: true,
    },
    consigneeEmail: {
      type: "string",
      label: "Consignee - Email",
      description: "The email address of the person to whom an order is shipped.",
      optional: true,
    },
    consigneeName: {
      type: "string",
      label: "Consignee - Name",
      description: "The name of the person to whom an order is shipped.",
      optional: true,
    },
    consigneeOther: {
      type: "object",
      label: "Consignee - Other",
      description: "Additional details used to identify the person to whom an order is shipped.",
      optional: true,
    },
    consigneePhone: {
      type: "string",
      label: "Consignee - Phone",
      description: "The phone number of the person to whom an order is shipped.",
      optional: true,
    },
    consigneeLocale: {
      type: "string",
      label: "Consignee - Locale",
      description: "Specifies the language of the email templates used for track & trace notifications. `locale` is specified using the format `{language}_{country}`, where `{language}` is an [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) language code and `{country}` is an [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) country code. Example: `fr_FR`",
      optional: true,
    },
    consigneeAddressCity: {
      type: "string",
      label: "Consignee - Address - City",
      description: "The city or town to which an order is shipped.",
    },
    consigneeAddressCountry: {
      type: "string",
      label: "Consignee - Address - Country",
      description: "The [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) code for the country to which an order is shipped.",
      options: COUNTRY_OPTIONS,
      optional: true,
    },
    consigneeAddressPostalCode: {
      type: "string",
      label: "Consignee - Address - Postal Code",
      description: "The postal code of the address to which an order is shipped. The code is used to get a more precise list of available shipping options.",
      optional: true,
    },
    consigneeAddressProvince: {
      type: "string",
      label: "Consignee - Address - Province",
      description: "The last 2 letters of the [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) code for the province or state to which an order is shipped.",
      optional: true,
    },
    consigneeAddressStreet: {
      type: "string",
      label: "Consignee - Address - Street",
      description: "The name of the street to which an order is shipped. See the note in the \"order\" endpoint description. Note If you provide \"street\" with a value, \"houseNumber\" is required.",
      optional: true,
    },
    consigneeAddressStreetLines: {
      type: "string[]",
      label: "Consignee - Address - Street Lines",
      description: "The street name and house number of the address to which an order is shipped, specified as one or more strings. See the note in the \"order\" endpoint description. Note! Paazl does not parse the string to perform validation with any values that may be provided for the other parameters of a consignee address.",
      optional: true,
    },
    consigneeAddressHouseNumber: {
      type: "string",
      label: "Consignee - Address - House Number",
      description: "The house number of the address to which an order is shipped. See the note in the order endpoint description.",
      optional: true,
    },
    consigneeAddressHouseNumberExtension: {
      type: "string",
      label: "Consignee - Address - House Number Extension",
      description: "The house number extension (such as the \"-A\" in \"12-A\") of the address to which an order is shipped.",
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Your own order reference for a purchase transaction. For security reasons, the following special characters are not allowed: \\ and /. Note! The order reference must be unique within the webshop.",
    },
    shippingOption: {
      type: "string",
      label: "Shipping - Option",
      description: "A shipping option's Paazl identifier. You will find a list of the identifiers of the shipping options available to your webshop in your webshop account under **Settings>Account>Overview of shipping options**. **Note!** If you have used [custom shipping option identifiers](https://support.paazl.com/hc/en-us/articles/360021787374-Customizing-shipping-option-identifiers%22), these will be returned instead of their Paazl equivalents.",
    },
    shippingPickupLocationCode: {
      type: "string",
      label: "Shipping - Pickup Location Code",
      description: "A carrier's unique code for a pickup location.",
    },
    shippingContract: {
      type: "string",
      label: "Shipping - Contract",
      description: "The identification code of your carrier contract for an outbound shipment. **Note!** If you don't have this code, contact [Paazl Customer Support](support@paazl.com).",
      optional: true,
    },
    shippingReturnContract: {
      type: "string",
      label: "Shipping - Return Contract",
      description: "The identification code of your carrier contract for a return shipment. **Note!** If you don't have this code, contact [Paazl Customer Support](support@paazl.com).",
      optional: true,
    },
    shippingPackageCount: {
      type: "integer",
      label: "Shipping - Package Count",
      description: "The number of packages in a shipment. **Note!** If `multiPackageShipment` is set to `true`, the default value of `packageCount` will be `2`.",
      optional: true,
    },
    shippingMultiPackageShipment: {
      type: "boolean",
      label: "Shipping - Multi Package Shipment",
      description: "If `true`, Paazl will treat the shipment as consolidated. This setting affects how the packages in the shipment are numbered on its labels. The number of packages in a shipment is indicated by `packageCount`. So, for example, if `multiPackageShipment` is `true` and `packageCount` is `3`, then the labels will be numbered 1/3, 2/3, 3/3. **Note!** If `packageCount` > `1`, then the default value of `multiPackageShipment` will be `true`. If you don't want Paazl to treat a multi-package shipment as consolidated, you have to set `multiPackageShipment` to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.consigneeAddressStreet && !this.consigneeAddressStreetLines) {
      throw new ConfigurationError("**Consignee Address Street** or **Consignee Address Street Lines** is required.");
    }

    const response = await this.paazl.createOrder({
      $,
      data: {
        additionalInstruction: this.additionalInstruction,
        consignee: {
          companyName: parseObject(this.consigneeCompanyName),
          vatNumber: this.consigneeVatNumber,
          email: this.consigneeEmail,
          name: this.consigneeName,
          other: parseObject(this.consigneeOther),
          phone: this.consigneePhone,
          locale: this.consigneeLocale,
          address: {
            city: this.consigneeAddressCity,
            country: this.consigneeAddressCountry,
            postalCode: this.consigneeAddressPostalCode,
            province: this.consigneeAddressProvince,
            street: this.consigneeAddressStreet,
            streetLines: parseObject(this.consigneeAddressStreetLines),
            houseNumber: this.consigneeAddressHouseNumber,
            houseNumberExtension: this.consigneeAddressHouseNumberExtension,
          },
        },
        reference: this.reference,
        shipping: {
          option: this.shippingOption,
          pickupLocation: {
            code: this.shippingPickupLocationCode,
          },
          contract: this.shippingContract,
          returnContract: this.shippingReturnContract,
          packageCount: this.shippingPackageCount,
          multiPackageShipment: this.shippingMultiPackageShipment,
        },
      },
    });
    return response;
  },
};
