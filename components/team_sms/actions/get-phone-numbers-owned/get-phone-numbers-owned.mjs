import app from "../../team_sms.app.mjs";

export default {
  key: "team_sms-get-phone-numbers-owned",
  name: "Get Phone Numbers Owned",
  description: "Retrieve all phone numbers owned by the user. [See the documentation](https://teamsms.io/api-doc)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  methods: {
    getPhoneNumbersOwned(args = {}) {
      return this.app._makeRequest({
        path: "/phone-numbers-owned",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.getPhoneNumbersOwned();
    $.export("$summary", `Successfully retrieved \`${response.length}\` phone numbers`);
    return response;
  },
};
