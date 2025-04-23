import peerdom from "../../peerdom.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "peerdom-update-role",
  name: "Update Role",
  description: "Update an existing role's attributes such as name, description, or linked domains. [See the documentation](https://api.peerdom.org/v1/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    peerdom,
    roleId: {
      propDefinition: [
        peerdom,
        "roleId",
      ],
    },
    roleName: {
      propDefinition: [
        peerdom,
        "roleName",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        peerdom,
        "description",
      ],
      optional: true,
    },
    linkedDomains: {
      propDefinition: [
        peerdom,
        "linkedDomains",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      ...(this.roleName && {
        name: this.roleName,
      }),
      ...(this.description && {
        customFields: {
          Description: this.description,
        },
      }),
      ...(this.linkedDomains && {
        customFields: {
          LinkedDomains: this.linkedDomains,
        },
      }),
    };

    const response = await this.peerdom.updateRole({
      roleId: this.roleId,
      ...data,
    });

    $.export("$summary", `Successfully updated role with ID ${this.roleId}`);
    return response;
  },
};
