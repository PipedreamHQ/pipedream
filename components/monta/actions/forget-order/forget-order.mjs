import monta from "../../monta.app.mjs";

export default {
  key: "monta-forget-order",
  name: "Forget Order",
  description: "Anonymize an order for GDPR erasure. This permanently removes personal data and cannot be undone. [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order~1%7Bwebshoporderid%7D~1forget/post)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    monta,
    orderId: {
      propDefinition: [
        monta,
        "orderId",
      ],
    },
    invoice: {
      type: "boolean",
      label: "Anonymize Invoice",
      description: "Whether to also anonymize invoice data",
      optional: true,
    },
    shipping: {
      type: "boolean",
      label: "Anonymize Shipping",
      description: "Whether to also anonymize shipping data",
      optional: true,
    },
  },
  async run({ $ }) {
    await this.monta.forgetOrder({
      $,
      orderId: this.orderId,
      params: {
        invoice: this.invoice,
        shipping: this.shipping,
      },
    });

    $.export("$summary", `Successfully anonymized order \`${this.orderId}\``);

    return {
      success: true,
    };
  },
};
