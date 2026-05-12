import microsoftEntraId from "../../microsoft_entra_id.app.mjs";

export default {
  key: "microsoft_entra_id-delete-group",
  name: "Delete Group",
  description: "Deletes a group in Microsoft Entra ID. [See the documentation](https://learn.microsoft.com/en-us/graph/api/group-delete?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    microsoftEntraId,
    groupId: {
      propDefinition: [
        microsoftEntraId,
        "groupId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.microsoftEntraId.deleteGroup({
      groupId: this.groupId,
    });
    $.export("$summary", `Successfully deleted group with ID ${this.groupId}.`);
    return response;
  },
};
