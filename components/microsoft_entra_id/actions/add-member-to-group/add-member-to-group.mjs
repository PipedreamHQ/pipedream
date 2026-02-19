import microsoftEntraId from "../../microsoft_entra_id.app.mjs";

export default {
  key: "microsoft_entra_id-add-member-to-group",
  name: "Add Member To Group",
  description: "Adds a member to a group Microsoft Entra ID. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-update?view=graph-rest-1.0&tabs=http)",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoftEntraId,
    groupId: {
      propDefinition: [
        microsoftEntraId,
        "groupId",
      ],
    },
    userId: {
      propDefinition: [
        microsoftEntraId,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.microsoftEntraId.addMemberToGroup({
      groupId: this.groupId,
      data: {
        "@odata.id": `https://graph.microsoft.com/v1.0/users/${this.userId}`,
      },
    });

    $.export("$summary", `Successfully added member ${this.userId} to group ${this.groupId}.`);

    return response;
  },
};
