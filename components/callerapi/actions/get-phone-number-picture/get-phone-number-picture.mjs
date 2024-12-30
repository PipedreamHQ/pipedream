import callerapi from "../../callerapi.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "callerapi-get-phone-number-picture",
  name: "Get Phone Number Picture",
  description: "Retrieve the profile picture associated with a phone number. [See the documentation]()",
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
      description: "The phone number to retrieve the profile picture for, in E.164 format (e.g., +18006927753)",
    },
  },
  async run({ $ }) {
    const response = await this.callerapi.getPhonePicture(this.phoneNumber);
    $.export("$summary", `Retrieved profile picture for ${this.phoneNumber}`);
    return response;
  },
};
