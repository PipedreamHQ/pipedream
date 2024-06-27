import invisionCommunity from "../../invision_community.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "invision_community-create-member",
  name: "Create Member",
  description: "Creates a new member. [See the documentation](https://invisioncommunity.com/developers/rest-api?endpoint=core/members/postindex)",
  version: "0.0.{{ts}}",
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
        {
          optional: true,
        },
      ],
    },
    groupId: {
      propDefinition: [
        invisionCommunity,
        "groupId",
        {
          optional: true,
        },
      ],
    },
    registrationIpAddress: {
      propDefinition: [
        invisionCommunity,
        "registrationIpAddress",
        {
          optional: true,
        },
      ],
    },
    secondaryGroups: {
      propDefinition: [
        invisionCommunity,
        "secondaryGroups",
        {
          optional: true,
        },
      ],
    },
    customFields: {
      propDefinition: [
        invisionCommunity,
        "customFields",
        {
          optional: true,
        },
      ],
    },
    validated: {
      propDefinition: [
        invisionCommunity,
        "validated",
        {
          optional: true,
        },
      ],
    },
    rawProperties: {
      propDefinition: [
        invisionCommunity,
        "rawProperties",
        {
          optional: true,
        },
      ],
    },
  },
  async run({ $ }) {
    const response = await this.invisionCommunity.createMember({
      name: this.name,
      email: this.email,
      password: this.password,
      group: this.groupId,
      registrationIpAddress: this.registrationIpAddress,
      secondaryGroups: this.secondaryGroups,
      customFields: this.customFields,
      validated: this.validated,
      rawProperties: this.rawProperties,
    });

    $.export("$summary", `Successfully created member with ID ${response.id}`);
    return response;
  },
};
