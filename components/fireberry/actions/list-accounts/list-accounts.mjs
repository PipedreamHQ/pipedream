import fireberry from "../../fireberry.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fireberry-list-accounts",
  name: "List Accounts",
  description: "List all accounts in Fireberry. [See the documentation](https://developers.fireberry.com/reference/get-all-accounts)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fireberry,
    pageSize: {
      propDefinition: [
        fireberry,
        "pageSize",
      ],
    },
    pageNumber: {
      propDefinition: [
        fireberry,
        "pageNumber",
      ],
    },
  },
  async run({ $ }) {
    const {
      pageSize, pageNumber,
    } = this;
    const response = await this.fireberry.getAllAccounts({
      pageSize,
      pageNumber,
    });

    $.export("$summary", `Successfully listed ${response.length} accounts`);
    return response;
  },
};
