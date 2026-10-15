import monta from "../../monta.app.mjs";

export default {
  key: "monta-create-rma-link",
  name: "Create RMA Link",
  description: "Create an RMA (return merchandise authorization) link for an order, so a customer can start a return. Review existing returns for the order with **List Order Returns**. [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order~1%7Bwebshoporderid%7D~1rmalinks/post)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the RMA link (e.g. `https://returns.example.com/rma/abc`)",
      optional: true,
    },
    validUntil: {
      type: "string",
      label: "Valid Until",
      description: "The expiry date and time of the RMA link in ISO 8601 format (e.g. `2026-07-31T23:59:59Z`)",
      optional: true,
    },
    isWarranty: {
      type: "boolean",
      label: "Is Warranty",
      description: "Whether the RMA link is for a warranty claim",
      optional: true,
    },
    isFree: {
      type: "boolean",
      label: "Is Free",
      description: "Whether the return is free of charge",
      optional: true,
    },
    guid: {
      type: "string",
      label: "GUID",
      description: "A unique identifier for the RMA link. Leave blank to let Monta generate one, or supply your own UUID (e.g. `123e4567-e89b-12d3-a456-426614174000`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.monta.createRmaLink({
      $,
      orderId: this.orderId,
      data: {
        Url: this.url,
        ValidUntil: this.validUntil,
        IsWarranty: this.isWarranty,
        IsFree: this.isFree,
        Guid: this.guid,
      },
    });

    $.export("$summary", `Successfully created RMA link for order \`${this.orderId}\``);

    return response;
  },
};
