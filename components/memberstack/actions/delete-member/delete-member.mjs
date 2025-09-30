import memberstack from "../../memberstack.app.mjs";

export default {
  key: "memberstack-delete-member",
  name: "Delete Member",
  description: "Deletes a member by ID. [See the docs](https://memberstack.notion.site/Admin-API-5b9233507d734091bd6ed604fb893bb8)",
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
  },
  async run({ $ }) {
    const { data } = await this.memberstack.deleteMember({
      id: this.memberId,
    });

    if (data) {
      $.export("$summary", `Successfully deleted member with ID ${data.id}.`);
    }

    return data;
  },
};
