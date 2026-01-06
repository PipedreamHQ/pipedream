import belco from "../../belco.app.mjs";

export default {
  key: "belco-list-users",
  name: "List Users",
  description: "List all users in the Belco account. [See the documentation](https://developers.belco.io/reference/get_users)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    belco,
  },
  async runL({ $ }) {
    const response = await this.belco.listUsers({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response?.length} user${response?.length === 1
      ? ""
      : "s"}`);
    return response.users;
  },
};
