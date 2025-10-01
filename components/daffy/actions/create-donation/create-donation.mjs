import { ConfigurationError } from "@pipedream/platform";
import daffy from "../../daffy.app.mjs";

export default {
  key: "daffy-create-donation",
  name: "Create Donation",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new donation. [See the documentation](https://docs.daffy.org/ref/donations#create-donation)",
  type: "action",
  props: {
    daffy,
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount of the donation in dollars.",
    },
    causeId: {
      propDefinition: [
        daffy,
        "causeId",
      ],
    },
    ein: {
      propDefinition: [
        daffy,
        "ein",
        ({ causeId }) => ({
          causeId,
        }),
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "The public note attached to the donation.",
      optional: true,
    },
    privateMemo: {
      type: "string",
      label: "Private Memo",
      description: "A private memo attached to the donation, not displayed publicly.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      daffy,
      privateMemo,
      amount,
      ...data
    } = this;

    if (parseFloat(amount) < 18) {
      throw new ConfigurationError("The minimum amount must be 18.00");
    }

    const response = await daffy.createDonation({
      $,
      data: {
        ...data,
        amount,
        private_memo: privateMemo,
      },
    });

    $.export("$summary", `A new donation with Id: ${response.id} was successfully created!`);
    return response;
  },
};
