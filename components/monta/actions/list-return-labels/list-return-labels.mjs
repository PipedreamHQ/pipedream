import monta from "../../monta.app.mjs";

export default {
  key: "monta-list-return-labels",
  name: "List Return Labels",
  description: "List the return labels for an order (labels for inbound returns), as opposed to outbound shipping labels. Use this when handling a customer return that needs a prepaid inbound label; see **List Order Returns** for the associated return records. [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order~1%7Bwebshoporderid%7D~1returnlabels/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monta,
    orderId: {
      propDefinition: [
        monta,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const labels = await this.monta.listReturnLabels({
      $,
      orderId: this.orderId,
    });

    $.export("$summary", `Successfully retrieved ${labels.length} return label${labels.length === 1
      ? ""
      : "s"} for order \`${this.orderId}\``);

    return labels;
  },
};
