import microsoftEntraId from "../../microsoft_entra_id.app.mjs";

export default {
  key: "microsoft_entra_id-remove-member-from-group",
  name: "Remove Member From Group",
  description: "Removes a member from a group Microsoft Entra ID. [See the documentation](https://learn.microsoft.com/en-us/graph/api/group-delete-members?view=graph-rest-1.0&tabs=http)",
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
        (c) => ({
          groupId: c.groupId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.microsoftEntraId.removeMemberFromGroup({
      groupId: this.groupId,
      userId: this.userId,
    });

    $.export("$summary", `Successfully removed member ${this.userId} from group ${this.groupId}.`);

    return response;
  },
};
