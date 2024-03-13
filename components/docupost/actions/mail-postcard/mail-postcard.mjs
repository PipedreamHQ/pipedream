import docupost from "../../docupost.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "docupost-mail-postcard",
  name: "Mail Postcard",
  description: "Dispatches a glossy, color 4x6 postcard via the US Postal Service. [See the documentation](https://help.docupost.com/help/send-postcard-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    docupost,
    toName: {
      propDefinition: [
        docupost,
        "toName",
      ],
    },
    toAddress1: {
      propDefinition: [
        docupost,
        "toAddress1",
      ],
    },
    toAddress2: {
      propDefinition: [
        docupost,
        "toAddress2",
      ],
    },
    toCity: {
      propDefinition: [
        docupost,
        "toCity",
      ],
    },
    toState: {
      propDefinition: [
        docupost,
        "toState",
      ],
    },
    toZip: {
      propDefinition: [
        docupost,
        "toZip",
      ],
    },
    fromName: {
      propDefinition: [
        docupost,
        "fromName",
      ],
    },
    fromAddress1: {
      propDefinition: [
        docupost,
        "fromAddress1",
      ],
    },
    fromAddress2: {
      propDefinition: [
        docupost,
        "fromAddress2",
      ],
    },
    fromCity: {
      propDefinition: [
        docupost,
        "fromCity",
      ],
    },
    fromState: {
      propDefinition: [
        docupost,
        "fromState",
      ],
    },
    fromZip: {
      propDefinition: [
        docupost,
        "fromZip",
      ],
    },
    postcardFrontImageUrl: {
      propDefinition: [
        docupost,
        "postcardFrontImageUrl",
      ],
    },
    postcardBackText: {
      propDefinition: [
        docupost,
        "postcardBackText",
      ],
    },
    color: {
      propDefinition: [
        docupost,
        "color",
      ],
      default: "true",
    },
  },
  async run({ $ }) {
    const response = await this.docupost.sendPostcard({
      apiToken: this.docupost.$auth.apiToken,
      toName: this.toName,
      toAddress1: this.toAddress1,
      toAddress2: this.toAddress2,
      toCity: this.toCity,
      toState: this.toState,
      toZip: this.toZip,
      fromName: this.fromName,
      fromAddress1: this.fromAddress1,
      fromAddress2: this.fromAddress2,
      fromCity: this.fromCity,
      fromState: this.fromState,
      fromZip: this.fromZip,
      postcardFrontImageUrl: this.postcardFrontImageUrl,
      postcardBackText: this.postcardBackText,
      color: this.color,
    });

    $.export("$summary", "Postcard dispatched successfully");
    return response;
  },
};
