import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-all-users",
  name: "List All Users",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve a list of all users in the account. [See the documentation](https://developer.sendoso.com/rest-api/reference/users/get-users)",
  type: "action",
  props: {
    sendoso,
    page: {
      propDefinition: [
        sendoso,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        sendoso,
        "perPage",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendoso.listUsers({
      $,
      params: {
        page: this.page,
        per_page: this.perPage,
      },
    });

    const count = Array.isArray(response.users) ?
      response.users.length :
      (response.users?.length || 0);
    $.export("$summary", `Successfully retrieved ${count} user${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};

