import memberstack from "../../memberstack.app.mjs";
import pickBy from "lodash.pickby";

export default {
  key: "memberstack-update-member",
  name: "Update Member",
  description: "Updates a member. [See the docs](https://memberstack.notion.site/Admin-API-5b9233507d734091bd6ed604fb893bb8)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    memberstack,
    memberId: {
      propDefinition: [
        memberstack,
        "memberId",
      ],
    },
    customFields: {
      propDefinition: [
        memberstack,
        "customFields",
      ],
    },
    metaData: {
      propDefinition: [
        memberstack,
        "metaData",
      ],
    },
  },
  async run({ $ }) {
    let response;
    try {
      const { data } = await this.memberstack.updateMember({
        id: this.memberId,
        data: pickBy({
          customFields: this.customFields,
          metaData: this.metaData,
        }),
      });
      response = data;
    } catch (e) {
      throw new Error(e.message);
    }

    if (response) {
      $.export("$summary", `Successfully updated member with ID ${response?.id}.`);
    }

    return response;
  },
};
