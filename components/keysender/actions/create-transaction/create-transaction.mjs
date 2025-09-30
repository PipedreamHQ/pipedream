import keysender from "../../keysender.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "keysender-create-transaction",
  name: "Create Transaction",
  description: "Creates a new transaction within Keysender. [See the documentation](https://panel.keysender.co.uk/api#tag/Transaction/paths/~1transaction~1addcustom/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    keysender,
    payer: {
      type: "string",
      label: "Payer",
      description: "Email address of the payer",
    },
    databaseId: {
      propDefinition: [
        keysender,
        "databaseId",
      ],
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Amount of the transaction",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of goods",
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "How many codes will be sent",
      optional: true,
      default: 1,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency of the transaction",
      options: constants.CURRENCY,
      optional: true,
      default: "GBP",
    },
  },
  async run({ $ }) {
    if (isNaN(this.amount)) {
      throw new ConfigurationError("Amount must be a valid number.");
    }

    const response = await this.keysender.createTransaction({
      $,
      data: {
        payer: this.payer,
        database_id: this.databaseId,
        amount: this.amount,
        quantity: this.quantity,
        currency: this.currency,
        name: this.name,
      },
    });

    $.export("$summary", `Successfully created order with ID: ${response.id}`);
    return response;
  },
};
