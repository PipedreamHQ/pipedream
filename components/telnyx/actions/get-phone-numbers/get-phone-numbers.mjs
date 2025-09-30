import telnyxApp from "../../telnyx.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "telnyx-get-phone-numbers",
  name: "Get Phone Numbers",
  description: "Get a list of phone numbers. [See the documentation](https://developers.telnyx.com/api/numbers/list-phone-numbers)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    telnyxApp,
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The size of the page.",
      optional: true,
      min: 1,
      max: 250,
      default: 20,
    },
    pageNumber: {
      type: "integer",
      label: "Page Number",
      description: "The page number to load.",
      optional: true,
      min: 1,
      default: 1,
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "Filter by tag.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Filter by phone number. Requires at least three digits. Non-numerical characters will result in no values being returned.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter by phone number status.",
      options: Object.values(constants.phoneNumberStatus),
      optional: true,
    },
    connectionId: {
      type: "string",
      label: "Connection Id",
      description: "Filter by connection Id.",
      optional: true,
    },
    contains: {
      type: "string",
      label: "Contains",
      description: "Filter contains connection name. Requires at least three characters.",
      optional: true,
    },
    startsWith: {
      type: "string",
      label: "Starts With",
      description: "Filter starts with connection name. Requires at least three characters.",
      optional: true,
    },
    endsWith: {
      type: "string",
      label: "Ends With",
      description: "Filter ends with connection name. Requires at least three characters.",
      optional: true,
    },
    equals: {
      type: "string",
      label: "Equals",
      description: "Filter by connection name.",
      optional: true,
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "Filter by usage payment method.",
      options: Object.values(constants.paymentMethods),
      optional: true,
    },
    billingGroupId: {
      type: "string",
      label: "Billing Group Id",
      description: "Filter by the billing group Id associated with phone numbers. To filter to only phone numbers that have no billing group associated them, set the value of this filter to the string 'null'.",
      optional: true,
    },
    emergencyAddressId: {
      type: "string",
      label: "Emergency Address Id",
      description: "Filter by the emergency_address_id associated with phone numbers. To filter only phone numbers that have no emergency address associated with them, set the value of this filter to the string 'null'.",
      optional: true,
    },
    customerReference: {
      type: "string",
      label: "Customer Reference",
      description: "Filter numbers via the customer reference set.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Specifies the sort order for results. If not given, results are sorted by created_at in descending order.",
      options: Object.values(constants.sortPhoneNumbers),
      optional: true,
    },
  },
  async run({ $ }) {
    const phoneNumbers = await this.telnyxApp.getPhoneNumbers({
      $,
      params: {
        "page[size]": this.pageSize || 20,
        "page[number]": this.pageNumber || 1,
        "filter[tag]": this.tag,
        "filter[phone_number]": this.phoneNumber,
        "filter[status]": this.status,
        "filter[connection_id]": this.connectionId,
        "filter[voice.connection_name][contains]": this.contains,
        "filter[voice.connection_name][starts_with]": this.startsWith,
        "filter[voice.connection_name][ends_with]": this.endsWith,
        "filter[voice.connection_name][eq]": this.equals,
        "filter[voice.usage_payment_method]": this.paymentMethod,
        "filter[billing_group_id]": this.billingGroupId,
        "filter[emergency_address_id]": this.emergencyAddressId,
        "filter[customer_reference]": this.customerReference,
        "sort": this.sort,
      },
    });
    $.export("$summary", `Successfully retrieved ${phoneNumbers.data.length} phone number${phoneNumbers.data.length === 1
      ? ""
      : "s"}.`);
    return phoneNumbers;
  },
};
