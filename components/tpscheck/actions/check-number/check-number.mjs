import tpscheck from "../../tpscheck.app.mjs";

export default {
  key: "tpscheck-check-number",
  name: "Check Number Against TPS/CTPS",
  description: "Validates a provided number against the TPS/CTPS register. [See the documentation]()",
  version: "0.0.1",
  type: "action",
  props: {
    tpscheck,
    phonenumber: {
      propDefinition: [
        tpscheck,
        "phonenumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tpscheck.validateNumber({
      $,
      data: {
        phone: this.phonenumber,
      },
    });
    $.export("$summary", `Successfully validated phone number ${this.phonenumber}`);

    return response;
  },
};
