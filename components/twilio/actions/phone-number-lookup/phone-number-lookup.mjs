import app from "../../twilio.app.mjs";

export default {
  key: "twilio-phone-number-lookup",
  name: "Phone Number Lookup",
  description: "Lookup information about a phone number. [See the documentation](https://www.twilio.com/docs/lookup/v2-api/line-type-intelligence) for more information",
  type: "action",
  version: "0.0.3",
  props: {
    app,
    sid: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to lookup",
    },
  },
  methods: {
    lineTypeLookup(sid) {
      const client = this.app.getClient();
      return client.lookups.v2.phoneNumbers(sid).fetch({
        fields: "line_type_intelligence",
      });
    },
  },
  async run({ $ }) {
    const {
      lineTypeLookup,
      sid,
    } = this;

    const response = await lineTypeLookup(sid);

    if (response.validationErrors?.length) {
      $.export("$summary", `Failed to fetch phone number lookup: \`${JSON.stringify(response.validationErrors, null, 2)}\`.`);
    } else {
      $.export("$summary", `Successfully fetched phone number lookup of \`${sid}\``);
    }

    return response;
  },
};
