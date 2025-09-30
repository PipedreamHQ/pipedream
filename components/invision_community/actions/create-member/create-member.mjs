import invisionCommunity from "../../invision_community.app.mjs";

export default {
  key: "invision_community-create-member",
  name: "Create Member",
  description: "Creates a new member. [See the documentation](https://invisioncommunity.com/developers/rest-api?endpoint=core/members/postindex)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    invisionCommunity,
    name: {
      propDefinition: [
        invisionCommunity,
        "name",
      ],
    },
    email: {
      propDefinition: [
        invisionCommunity,
        "email",
      ],
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
    const response = await this.invisionCommunity.createMember({
      $,
      params: {
        name: this.name,
        email: this.email,
        password: this.password,
        group: this.groupId,
        registrationIpAddress: this.registrationIpAddress,
        validated: this.validated,
      },
    });

    $.export("$summary", `Successfully created member with ID ${response.id}`);
    return response;
  },
};
