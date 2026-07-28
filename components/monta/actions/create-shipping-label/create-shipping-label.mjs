import monta from "../../monta.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "monta-create-shipping-label",
  name: "Create Shipping Label",
  description: "Generate a shipping label for an order in a supported output format (`pdf` or `zpl`). Use this when an order is ready to ship and needs a carrier label. [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order~1%7Bwebshoporderid%7D~1shippinglabels/post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
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
    labelFileType: {
      type: "string",
      label: "Label File Type",
      description: "The file type to generate the label in",
      options: constants.LABEL_FILE_TYPES,
    },
  },
  async run({ $ }) {
    const labels = await this.monta.createShippingLabel({
      $,
      orderId: this.orderId,
      params: {
        labelfiletype: this.labelFileType,
      },
    });

    $.export("$summary", `Successfully created shipping label${labels.length === 1
      ? ""
      : "s"} for order \`${this.orderId}\``);

    return labels;
  },
};
