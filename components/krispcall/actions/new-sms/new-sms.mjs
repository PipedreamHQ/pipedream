import krispcall from "../../krispcall.app.mjs";

export default {
  key: "krispcall-new-sms",
  name: "Send New SMS",
  description: "Send a new SMS to a number. [See the documentation](https://documenter.getpostman.com/view/38507826/2sB2xEA8V5#be2f5790-43b5-482e-9f4e-c9e8cb9fd633)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    krispcall,
    fromNumber: {
      propDefinition: [
        krispcall,
        "fromNumber",
      ],
    },
    toNumber: {
      propDefinition: [
        krispcall,
        "toNumber",
      ],
    },
    content: {
      propDefinition: [
        krispcall,
        "content",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.krispcall.sendSMS({
      $,
      data: {
        from_number: this.fromNumber,
        to_number: this.toNumber,
        content: this.content,
      },
    });
    $.export("$summary", `Successfully sent SMS to ${this.toNumber}`);
    return response;
  },
};
