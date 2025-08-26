import dhl from "../../dhl.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "dhl-create-subscription",
  name: "Create Subscription",
  description: "Create a new subscription. [See the documentation](https://developer.dhl.com/api-reference/dgf-push-api#operations-Timestamp_Push_API_v2-timestampNotificationSubscriptionv2_POST)",
  version: "0.0.1",
  type: "action",
  props: {
    dhl,
    status: {
      propDefinition: [
        dhl,
        "status",
      ],
    },
    onlyNotifyAPIBookings: {
      type: "string",
      label: "Only Notify API Bookings",
      description: "Enable to receive timestamp or tracking notifications exclusively for shipments booked through the API",
      options: [
        "true",
        "false",
      ],
      optional: true,
    },
    subscriptionType: {
      type: "string",
      label: "Subscription Type",
      description: "Specify the type of subscription",
      options: constants.SUBSCRIPTION_TYPES,
      optional: true,
    },
    numberOfFilters: {
      type: "integer",
      label: "Number of Filters",
      description: "Specify the number of filters to apply to the subscription",
      min: 1,
      reloadProps: true,
    },
    callbackUrl: {
      propDefinition: [
        dhl,
        "callbackUrl",
      ],
    },
  },
  additionalProps() {
    const props = {};
    if (!(this.numberOfFilters > 0)) {
      return props;
    }
    for (let i = 1; i <= this.numberOfFilters; i++) {
      props[`modeOfTransport${i}`] = {
        type: "string",
        label: `Mode of Transport ${i}`,
        description: "Specify the mode of transport for the filter",
        options: constants.MODE_OF_TRANSPORT,
      };
      props[`origin${i}`] = {
        type: "string",
        label: `Origin ${i}`,
        description: "Origin country code (2 character) or UNLOCODE (5 character)",
      };
      props[`destination${i}`] = {
        type: "string",
        label: `Destination ${i}`,
        description: "Destination country code (2 character) or UNLOCODE (5 character)",
      };
      props[`events${i}`] = {
        type: "string[]",
        label: `Events ${i}`,
        description: "Event codes. Please refer to [GET Started Page](https://developer.dhl.com/api-reference/dgf-push-api#get-started-section/timestamp-push-api-v2-_28in-testing_29) for the event codes. Example:`A30`",
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const filters = [];
    for (let i = 1; i <= this.numberOfFilters; i++) {
      filters.push({
        modeOfTransport: this[`modeOfTransport${i}`],
        origin: this[`origin${i}`],
        destination: this[`destination${i}`],
        Events: this[`events${i}`],
      });
    }

    const response = await this.dhl.createSubscription({
      $,
      data: {
        "status": this.status,
        "onlyNotifyAPIBookings": this.onlyNotifyAPIBookings,
        "subscription-type": this.subscriptionType,
        filters,
        "callback-details": {
          "callback-url": this.callbackUrl,
        },
      },
    });

    $.export("$summary", `Successfully created subscription ${response.subscriptionID}`);
    return response;
  },
};
