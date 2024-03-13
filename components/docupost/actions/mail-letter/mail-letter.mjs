import docupost from "../../docupost.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "docupost-mail-letter",
  name: "Mail Letter",
  description: "Sends a physical letter via USPS first class mail. [See the documentation](https://help.docupost.com/help/send-letter-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    docupost,
    apiToken: {
      propDefinition: [
        docupost,
        "apiToken",
      ],
    },
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
    letterPdfUrl: {
      propDefinition: [
        docupost,
        "letterPdfUrl",
      ],
    },
    color: {
      propDefinition: [
        docupost,
        "color",
      ],
    },
    doubleSided: {
      propDefinition: [
        docupost,
        "doubleSided",
      ],
    },
    mailClass: {
      propDefinition: [
        docupost,
        "mailClass",
      ],
    },
    serviceLevel: {
      propDefinition: [
        docupost,
        "serviceLevel",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.docupost.sendLetter({
      apiToken: this.apiToken,
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
      letterPdfUrl: this.letterPdfUrl,
      color: this.color,
      doubleSided: this.doubleSided,
      mailClass: this.mailClass,
      serviceLevel: this.serviceLevel,
    });

    $.export("$summary", `Sent letter to ${this.toName} successfully`);
    return response;
  },
};
