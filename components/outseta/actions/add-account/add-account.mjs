import app from "../../outseta.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "outseta-add-account",
  name: "Add Account",
  description: "Add account with existing person. [See the documentation](https://documenter.getpostman.com/view/3613332/outseta-rest-api-v1/7TNfr6k#cf32f02d-896c-1835-f4a1-a9c13b3fbd72)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the account to be created",
    },
    billingStage: {
      propDefinition: [
        app,
        "billingStage",
      ],
    },
    personAccount: {
      propDefinition: [
        app,
        "person",
      ],
    },
    mailingAddress: {
      type: "object",
      label: "Mailing Address",
      description: "The mailing address of the account",
      optional: true,
      default: constants.ADDRESS_DEFAULT_OBJ,
    },
    billingAddress: {
      type: "object",
      label: "Billing Address",
      description: "The billing address of the account",
      optional: true,
      default: constants.ADDRESS_DEFAULT_OBJ,
    },
  },
  async run({ $ }) {
    const data = {
      Name: this.name,
      AccountStage: this.accountStage,
      MailingAddress: this.mailingAddress,
      BillingAddress: this.billingAddress,
      PersonAccount: [
        {
          Person: {
            Uid: this.personAccount,
          },
          IsPrimary: true,
        },
      ],
    };

    const response = await this.app.addAccount({
      $,
      data,
    });

    $.export("$summary", `Successfully added an account with UID: ${response.Uid}`);
    return response;
  },
};
