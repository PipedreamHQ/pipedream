import quriiri from "../../quriiri.app.mjs";

export default {
  key: "quriiri-send-message",
  name: "Send Message",
  description: "Sends an SMS message using the Quriiri API. [See the documentation](https://docs.quriiri.fi/docs/quriiri/send-sms/operations/create-a)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    quriiri: {
      type: "app",
      app: "quriiri",
    },
    sender: {
      propDefinition: [
        quriiri,
        "sender",
      ],
    },
    destination: {
      propDefinition: [
        quriiri,
        "destination",
      ],
    },
    text: {
      propDefinition: [
        quriiri,
        "text",
      ],
    },
    senderType: {
      propDefinition: [
        quriiri,
        "senderType",
      ],
      optional: true,
    },
    data: {
      propDefinition: [
        quriiri,
        "data",
      ],
      optional: true,
    },
    udh: {
      propDefinition: [
        quriiri,
        "udh",
      ],
      optional: true,
    },
    batchId: {
      propDefinition: [
        quriiri,
        "batchId",
      ],
      optional: true,
    },
    billingRef: {
      propDefinition: [
        quriiri,
        "billingRef",
      ],
      optional: true,
    },
    drUrl: {
      propDefinition: [
        quriiri,
        "drUrl",
      ],
      optional: true,
    },
    drType: {
      propDefinition: [
        quriiri,
        "drType",
      ],
      optional: true,
    },
    flash: {
      propDefinition: [
        quriiri,
        "flash",
      ],
      optional: true,
    },
    validity: {
      propDefinition: [
        quriiri,
        "validity",
      ],
      optional: true,
    },
    scheduleTime: {
      propDefinition: [
        quriiri,
        "scheduleTime",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.quriiri.sendSms({
      sender: this.sender,
      destination: this.destination,
      text: this.text,
      senderType: this.senderType,
      data: this.data,
      udh: this.udh,
      batchId: this.batchId,
      billingRef: this.billingRef,
      drUrl: this.drUrl,
      drType: this.drType,
      flash: this.flash,
      validity: this.validity,
      scheduleTime: this.scheduleTime,
    });
    $.export("$summary", `Message sent successfully to ${this.destination}`);
    return response;
  },
};
