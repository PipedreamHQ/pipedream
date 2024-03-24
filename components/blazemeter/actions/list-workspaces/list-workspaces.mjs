import blazemeter from "../../blazemeter.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "blazemeter-list-workspaces",
  name: "List Workspaces",
  description: "List all workspaces associated with the specified account. [See the documentation](https://api.blazemeter.com/functional/#workspaces-list)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    blazemeter,
    accountId: {
      propDefinition: [
        blazemeter,
        "accountId",
      ],
    },
  },
  async run({ $ }) {
    const workspaces = await this.blazemeter.listWorkspaces({
      accountId: this.accountId,
    });
    $.export("$summary", `Successfully listed ${workspaces.length} workspaces`);
    return workspaces;
  },
};
