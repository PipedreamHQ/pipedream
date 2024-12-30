import callerapi from "../../callerapi.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "callerapi-get-phone-number-information",
  name: "Get Phone Number Information",
  description: "Retrieve detailed information about a specific phone number, including name, location, and carrier. [See the documentation](https://github.com/dimondevceo/caller-id-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    callerapi: {
      type: "app",
      app: "callerapi",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to retrieve information for (E.164 format, e.g., +18006927753)",
    },
  },
  async run({ $ }) {
    const response = await this.callerapi.getPhoneInfo(this.phoneNumber);
    $.export("$summary", `Retrieved information for phone number ${this.phoneNumber}`);
    return response;
  },
};
