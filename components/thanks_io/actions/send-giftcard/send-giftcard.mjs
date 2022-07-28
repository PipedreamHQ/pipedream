import thanksIo from "../../thanks_io.app.mjs";

export default {
  key: "thanks_io-send-giftcard",
  name: "Send Giftcard",
  description: "Sends a giftcard to a recipient. [See the docs here](https://api-docs.thanks.io/#45925795-d3c8-4532-ad6e-07aa9f4d19f8)",
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
    brand: {
      propDefinition: [
        thanksIo,
        "giftCardBrand",
      ],
      reloadProps: true,
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
  },
  async additionalProps() {
    const props = {
      amount: {
        type: "integer",
        label: "Amount",
        description: "Gift Card amount in cents",
        options: async () => {
          const brands = await this.thanksIo.listGiftCardBrands();
          const selectedBrand = brands.find((brand) => brand.brand_code == this.brand);
          return selectedBrand.available_amounts.map((amount) => ({
            label: amount,
            value: amount,
          }));
        },
      },
    };
    return props;
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
    const resp = await this.thanksIo.sendGiftCard({
      $,
      data: {
        front_image_url: this.frontImageUrl,
        handwriting_style: this.handwritingStyle,
        message: this.message,
        recipients,
        giftcard_brand: this.brand,
        giftcard_amount_in_cents: this.amount,
      },
    });
    if (resp?.errors) {
      throw new Error(resp.errors);
    }
    $.export("$summary", "Successfully created giftcard order");
    return resp;
  },
};
