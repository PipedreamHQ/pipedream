import callerapi from "../../callerapi.app.mjs";

export default {
  key: "callerapi-get-phone-number-information",
  name: "Get Phone Number Information",
  description: "Retrieve detailed information about a specific phone number, including name, location, and carrier. [See the documentation](https://callerapi.com/documentation)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    callerapi,
    phoneNumber: {
      propDefinition: [
        callerapi,
        "phoneNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.callerapi.getPhoneInfo({
      $,
      phoneNumber: this.phoneNumber,
    });
    $.export("$summary", `Retrieved information for phone number ${this.phoneNumber}`);
    return response;
  },
};
