import krispcall from "../../krispcall.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "krispcall-new-mms",
  name: "Send New MMS",
  description: "Send a new MMS to a contact. [See the documentation](https://documenter.getpostman.com/view/32476792/2sa3dxfcal)",
  version: "0.0.{{ts}}",
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
    medias: {
      propDefinition: [
        krispcall,
        "medias",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.krispcall.sendMMS({
      fromNumber: this.fromNumber,
      toNumber: this.toNumber,
      content: this.content,
      medias: this.medias,
    });

    $.export("$summary", `MMS sent successfully to ${this.toNumber}`);
    return response;
  },
};
