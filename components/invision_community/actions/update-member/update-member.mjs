import invisionCommunity from "../../invision_community.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "invision_community-update-member",
  name: "Update Member",
  description: "Updates an existing member's details. [See the documentation](https://invisioncommunity.com/developers/rest-api?endpoint=core/members/postitem)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    invisionCommunity,
    memberId: {
      propDefinition: [
        invisionCommunity,
        "memberId",
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
    registrationIpAddress: {
      propDefinition: [
        invisionCommunity,
        "registrationIpAddress",
      ],
      optional: true,
    },
    secondaryGroups: {
      propDefinition: [
        invisionCommunity,
        "secondaryGroups",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        invisionCommunity,
        "customFields",
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
    rawProperties: {
      propDefinition: [
        invisionCommunity,
        "rawProperties",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      ...(this.password && {
        password: this.password,
      }),
      ...(this.groupId && {
        group: this.groupId,
      }),
      ...(this.registrationIpAddress && {
        registrationIpAddress: this.registrationIpAddress,
      }),
      ...(this.secondaryGroups && {
        secondaryGroups: this.secondaryGroups,
      }),
      ...(this.customFields && {
        customFields: this.customFields,
      }),
      ...(this.validated && {
        validated: this.validated,
      }),
      ...(this.rawProperties && {
        rawProperties: this.rawProperties,
      }),
    };

    const response = await this.invisionCommunity.updateMember(this.memberId, data);
    $.export("$summary", `Successfully updated member with ID ${this.memberId}`);
    return response;
  },
};
