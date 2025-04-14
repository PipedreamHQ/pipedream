import krispcall from "../../krispcall.app.mjs";

export default {
  key: "krispcall-new-mms",
  name: "Send New MMS",
  description: "Send a new MMS to a contact. [See the documentation](https://documenter.getpostman.com/view/32476792/2sA3dxFCaL)",
  version: "0.0.3",
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
