import workday from "../../workday.app.mjs";

export default {
  key: "workday-validate-phone-number",
  name: "Validate Phone Number",
  description: "Validate a phone number using Workday's REST API. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#person/v4/post-/phoneValidation)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    workday,
    completePhoneNumber: {
      type: "string",
      label: "Complete Phone Number",
      description: "The complete phone number including country code. Example: '+19259519000'",
    },
  },
  async run({ $ }) {
    const response = await this.workday.validatePhoneNumber({
      $,
      data: {
        completePhoneNumber: this.completePhoneNumber,
      },
    });
    $.export("$summary", "Phone number validation completed.");
    return response;
  },
};
