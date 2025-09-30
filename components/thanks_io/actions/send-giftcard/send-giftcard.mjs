import common from "../common/send-recipients.mjs";

export default {
  ...common,
  key: "thanks_io-send-giftcard",
  name: "Send Giftcard",
  description: "Sends a giftcard to a recipient. [See the docs here](https://api-docs.thanks.io/#45925795-d3c8-4532-ad6e-07aa9f4d19f8)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    brand: {
      propDefinition: [
        common.props.thanksIo,
        "giftCardBrand",
      ],
      reloadProps: true,
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
          })) || [];
        },
      },
    };
    return props;
  },
  async run({ $ }) {
    const recipients = await this.getRecipients(this.recipients, $);
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
