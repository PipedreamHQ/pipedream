import app from "../../ideal_postcodes.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ideal_postcodes-phone-number-validation",
  name: "Phone Number Validation",
  description: "Validates a phone number and returns information about it. [See the documentation](https://docs.ideal-postcodes.co.uk/docs/api/phone-number-validation).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    query: {
      type: "string",
      label: "Phone Number",
      description: "Specifies the phone number to validate. Phone number must include a country code in acceptable format. For instance, UK phone numbers should be suffixed `+44`, `44` or `0044`.",
    },
    currentCarrier: {
      type: "boolean",
      label: "Current Carrier",
      description: "When set to `true` the current network of the phone number will be retrieved and populated. Note that this operation is potentially slow depending on the network and local conditions.",
      optional: true,
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
  },
  methods: {
    validatePhoneNumber(args = {}) {
      return this.app._makeRequest({
        path: "/phone_numbers",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      validatePhoneNumber,
      query,
      currentCarrier,
      tags,
    } = this;

    const response = await validatePhoneNumber({
      $,
      params: {
        query,
        current_carrier: currentCarrier,
        tags: utils.encode(tags),
      },
    });

    $.export("$summary", `Successfully validated phone number with message \`${response.message}\``);

    return response;
  },
};
