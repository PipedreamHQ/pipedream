import app from "../../ghost_org_admin_api.app.mjs";

export default {
  key: "ghost_org_admin_api-create-member",
  name: "Create Member",
  description: "Create a new member in Ghost. [See the documentation](https://ghost.org/docs/admin-api/#creating-a-member)",
  version: "0.0.4",
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    note: {
      propDefinition: [
        app,
        "note",
      ],
    },
    labels: {
      propDefinition: [
        app,
        "labels",
      ],
    },
  },
  async run({ $ }) {
    const res = await this.app.createMember({
      $,
      data: {
        members: [
          {
            email: this.email,
            name: this.name,
            note: this.note,
            labels: this.labels,
          },
        ],
      },
    });
    $.export("$summary", "Successfully created member");
    return res.members[0];
  },
};
