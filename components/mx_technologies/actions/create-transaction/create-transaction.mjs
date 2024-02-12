import mxTechnologies from "../../mx_technologies.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mx_technologies-create-transaction",
  name: "Create Transaction",
  description: "Creates a new transaction for a specific user's account. [See the documentation](https://docs.mx.com/api-reference/platform-api/reference/create-manual-transaction)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mxTechnologies,
    userId: {
      propDefinition: [
        mxTechnologies,
        "userId",
      ],
    },
    accountId: {
      propDefinition: [
        mxTechnologies,
        "accountId",
      ],
    },
    transactionCreate: {
      propDefinition: [
        mxTechnologies,
        "transactionCreate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mxTechnologies.createManualTransaction({
      userGuid: this.userId,
      accountGuid: this.accountId,
      transactionCreate: this.transactionCreate,
    });
    $.export("$summary", "Successfully created a new transaction");
    return response;
  },
};
