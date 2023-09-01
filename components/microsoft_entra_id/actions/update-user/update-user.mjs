import microsoftEntraId from "../../microsoft_entra_id.app.mjs";

export default {
  key: "microsoft_entra_id-update-user",
  name: "Create User",
  description: "Updates an existing user in Microsoft Entra ID. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-update?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  props: {
    microsoftEntraId,
  },
  async run() {

  },
};
