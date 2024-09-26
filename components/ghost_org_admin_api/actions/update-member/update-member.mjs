import app from "../../ghost_org_admin_api.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "ghost_org_admin_api-update-member",
  name: "Update Member",
  description: "Update a member in Ghost. [See the documentation](https://ghost.org/docs/admin-api/#updating-a-member)",
  version: "0.0.4",
  type: "action",
  props: {
    app,
    member: {
      propDefinition: [
        app,
        "member",
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
    if (!this.name && !this.note && !this.labels) {
      throw new ConfigurationError("Must provide at least one of `name`, `note`, or `labels`");
    }
    const res = await this.app.updateMember({
      $,
      memberId: this.member,
      data: {
        members: [
          {
            name: this.name,
            note: this.note,
            labels: this.labels,
          },
        ],
      },
    });
    $.export("$summary", "Successfully updated member");
    return res.members[0];
  },
};
