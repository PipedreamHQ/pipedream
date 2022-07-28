import thanksIo from "../../thanks_io.app.mjs";

export default {
  key: "thanks_io-send-letter",
  name: "Send Letter",
  description: "Sends a letter to a recipient. [See the docs here](https://api-docs.thanks.io/#45925795-d3c8-4532-ad6e-07aa9f4d19f8)",
  version: "0.0.1",
  type: "action",
  props: {
    thanksIo,
    subAccount: {
      propDefinition: [
        thanksIo,
        "subAccount",
      ],
    },
    mailingList: {
      propDefinition: [
        thanksIo,
        "mailingList",
        (c) => ({
          subAccount: c.subAccount,
        }),
      ],
      description: "Mailing List from which to select recipients",
    },
    recipients: {
      propDefinition: [
        thanksIo,
        "recipients",
        (c) => ({
          mailingListId: c.mailingList,
        }),
      ],
    },
    message: {
      propDefinition: [
        thanksIo,
        "message",
      ],
    },
    frontImageUrl: {
      propDefinition: [
        thanksIo,
        "frontImageUrl",
      ],
    },
    handwritingStyle: {
      propDefinition: [
        thanksIo,
        "handwritingStyle",
      ],
    },
    returnName: {
      propDefinition: [
        thanksIo,
        "returnName",
      ],
    },
    returnAddress: {
      propDefinition: [
        thanksIo,
        "returnAddress",
      ],
    },
    returnAddress2: {
      propDefinition: [
        thanksIo,
        "returnAddress2",
      ],
    },
    returnCity: {
      propDefinition: [
        thanksIo,
        "returnCity",
      ],
    },
    returnState: {
      propDefinition: [
        thanksIo,
        "returnState",
      ],
    },
    returnPostalCode: {
      propDefinition: [
        thanksIo,
        "returnPostalCode",
      ],
    },
  },
  async run({ $ }) {
    const recipients = [];
    for (const recipient of this.recipients) {
      const info = await this.thanksIo.getRecipient(recipient, {
        $,
      });
      recipients.push({
        name: info.name,
        address: info.address,
        address2: info?.address2,
        city: info.city,
        province: info.province,
        postal_code: info.postal_code,
        country: info.country,
      });
    }
    const resp = await this.thanksIo.sendLetter({
      $,
      data: {
        front_image_url: this.frontImageUrl,
        handwriting_style: this.handwritingStyle,
        message: this.message,
        recipients,
        return_name: this.returnName,
        return_address: this.returnAddress,
        return_address2: this.returnAddress2,
        return_city: this.returnCity,
        return_state: this.returnState,
        return_postal_code: this.returnPostalCode,
      },
    });
    if (resp?.errors) {
      throw new Error(resp.errors);
    }
    $.export("$summary", "Successfully created letter order");
    return resp;
  },
};
