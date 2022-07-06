import app from "../../ghost_org_admin_api.app.mjs";

export default {
  key: "ghost_org_admin_api-create-member",
  name: "Create Member",
  description: "Create a new member in Ghost. [See the docs here](https://ghost.org/docs/admin-api/#members)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const res = await this.app.createMember({
      email: this.email,
    });
    $.export("$summary", "Successfully created member");
    return res.members[0];
  },
};
