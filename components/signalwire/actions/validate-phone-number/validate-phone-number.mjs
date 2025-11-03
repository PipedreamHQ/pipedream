import signalwire from "../../signalwire.app.mjs";

export default {
  key: "signalwire-validate-phone-number",
  name: "Validate Phone Number",
  description: "Validates a given phone number. Can optionally include carrier and caller ID information. [See the documentation](https://developer.signalwire.com/rest/phone-number-lookup)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    signalwire,
    e164Number: {
      propDefinition: [
        signalwire,
        "e164Number",
      ],
    },
    include: {
      propDefinition: [
        signalwire,
        "include",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.signalwire.validatePhoneNumber({
      e164Number: this.e164Number,
      params: {
        include: this.include
          ? this.include.join()
          : undefined,
      },
      $,
    });
    $.export("$summary", `Successfully validated phone number: ${this.e164Number}`);
    return response;
  },
};
