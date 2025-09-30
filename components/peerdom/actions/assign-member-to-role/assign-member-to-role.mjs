import peerdom from "../../peerdom.app.mjs";

export default {
  key: "peerdom-assign-member-to-role",
  name: "Assign Member to Role",
  description: "Assigns a member to a role within a circle using the Peerdom API. [See the documentation](https://api.peerdom.org/v1/docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    peerdom,
    roleId: {
      propDefinition: [
        peerdom,
        "roleId",
      ],
    },
    memberId: {
      propDefinition: [
        peerdom,
        "memberId",
      ],
    },
    percentage: {
      type: "integer",
      label: "Percentage",
      description: "The percentage of the role assigned to the member",
      optional: true,
      min: 0,
      max: 100,
    },
    focus: {
      type: "string",
      label: "Focus",
      description: "The focus of the role assigned to the member",
      optional: true,
    },
    electedUntil: {
      type: "string",
      label: "Elected Until",
      description: "The date until which the member is elected to the role (YYYY-MM-DD)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.peerdom.assignMemberToRole({
      $,
      roleId: this.roleId,
      data: {
        peerId: this.memberId,
        percentage: this.percentage,
        focus: this.focus,
        electedUntil: this.electedUntil,
      },
    });

    $.export("$summary", `Successfully assigned member with ID ${this.memberId} to role with ID ${this.roleId}`);
    return response;
  },
};
