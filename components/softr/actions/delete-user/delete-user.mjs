import softr from "../../softr.app.mjs";

export default {
  key: "softr-delete-user",
  name: "Delete User",
  description: "Removes an existing user from your Softr app. Be aware, this action is irreversible. [See the documentation](https://docs.softr.io/softr-api/tTFQ5vSAUozj5MsKixMH8C/api-setup-and-endpoints/j1PrTZxt7pv3iZCnZ5Fp19#delete-user)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    softr,
    email: {
      propDefinition: [
        softr,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.softr.deleteUser({
      $,
      email: this.email,
    });
    $.export("$summary", `Successfully deleted user with email: ${this.email}`);
    return response;
  },
};
