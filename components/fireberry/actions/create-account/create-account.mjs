import fireberry from "../../fireberry.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fireberry-create-account",
  name: "Create Account",
  description: "Creates a new account in Fireberry. [See the documentation](https://developers.fireberry.com/reference/create-an-account)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fireberry,
    accountName: {
      propDefinition: [
        fireberry,
        "accountName",
      ],
    },
    accountNumber: {
      propDefinition: [
        fireberry,
        "accountNumber",
        (c) => ({
          optional: true,
        }),
      ],
    },
    // Include other required and optional props for creating an account
  },
  async run({ $ }) {
    const response = await this.fireberry.createAccount({
      accountName: this.accountName,
      accountNumber: this.accountNumber,
      // Pass other props here
    });

    $.export("$summary", `Created account with name: ${this.accountName}`);
    return response;
  },
};
