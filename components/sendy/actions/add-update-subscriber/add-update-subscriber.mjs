import sendy from "../../sendy.app.mjs";

export default {
  key: "sendy-add-update-subscriber",
  name: "Add or Update a Subscriber",
  description: "Adds a new subscriber or updates existing subscriber's details for a specific list. [See the documentation](https://sendy.co/api?app_path=https://sendy.email/dev2#subscribe)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendy,
    brandId: {
      propDefinition: [
        sendy,
        "brandId",
      ],
    },
    list: {
      propDefinition: [
        sendy,
        "listId",
        ({ brandId }) => ({
          brandId,
        }),
      ],
    },
    email: {
      propDefinition: [
        sendy,
        "email",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The user's name.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "user's [2 letter country code](https://datahub.io/core/country-list#resource-data).",
      optional: true,
    },
    ipaddress: {
      type: "string",
      label: "IP Address",
      description: "The user's IP address.",
      optional: true,
    },
    referrer: {
      type: "string",
      label: "Referrer",
      description: "The URL where the user signed up from.",
      optional: true,
    },
    gdpr: {
      type: "boolean",
      label: "GDPR",
      description: "If you're signing up EU users in a GDPR compliant manner, set this to true.",
      optional: true,
    },
    silent: {
      type: "boolean",
      label: "silent",
      description: "Set to True if your list is 'Double opt-in' but you want to bypass that and signup the user to the list as 'Single Opt-in instead'",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      sendy,
      ...data
    } = this;

    const response = await sendy.addOrUpdateSubscriber({
      $,
      data: {
        ...data,
        boolean: true,
      },
    });

    $.export("$summary", `Successfully ${response === 1
      ? "added"
      : "updated"} the subscriber with email: ${this.email}`);
    return response;
  },
};
