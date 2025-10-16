import invisionCommunity from "../../invision_community.app.mjs";

export default {
  key: "invision_community-update-member",
  name: "Update Member",
  description: "Updates an existing member's details. [See the documentation](https://invisioncommunity.com/developers/rest-api?endpoint=core/members/postitem)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    invisionCommunity,
    memberId: {
      propDefinition: [
        invisionCommunity,
        "memberId",
      ],
    },
    name: {
      propDefinition: [
        invisionCommunity,
        "name",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        invisionCommunity,
        "email",
      ],
      optional: true,
    },
    password: {
      propDefinition: [
        invisionCommunity,
        "password",
      ],
      optional: true,
    },
    groupId: {
      propDefinition: [
        invisionCommunity,
        "groupId",
      ],
      optional: true,
    },
    validated: {
      propDefinition: [
        invisionCommunity,
        "validated",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.invisionCommunity.updateMember({
      $,
      memberId: this.memberId,
      params: {
        name: this.name,
        email: this.email,
        password: this.password,
        group: this.groupId,
        registrationIpAddress: this.registrationIpAddress,
        validated: this.validated,
      },
    });
    $.export("$summary", `Successfully updated member with Id: ${this.memberId}`);
    return response;
  },
};
