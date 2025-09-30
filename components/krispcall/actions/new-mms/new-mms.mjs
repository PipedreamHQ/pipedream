import krispcall from "../../krispcall.app.mjs";

export default {
  key: "krispcall-new-mms",
  name: "Send New MMS",
  description: "Send a new MMS to a contact. [See the documentation](https://documenter.getpostman.com/view/38507826/2sB2xEA8V5#a5e31a96-ff7a-48cf-9f12-e1215e90970a)",
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
      optional: true,
    },
    medias: {
      propDefinition: [
        krispcall,
        "medias",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.krispcall.sendMMS({
      $,
      data: {
        from_number: this.fromNumber,
        to_number: this.toNumber,
        content: this.content,
        medias: this.medias,
      },
    });
    $.export("$summary", `Successfully sent MMS from ${this.fromNumber} to ${this.toNumber}`);
    return response;
  },
};
