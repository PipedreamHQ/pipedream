import microsoftEntraId from "../../microsoft_entra_id.app.mjs";

export default {
  key: "microsoft_entra_id-update-group",
  name: "Update Group",
  description: "Updates an existing group in Microsoft Entra ID. [See the documentation](https://learn.microsoft.com/en-us/graph/api/group-update?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
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
    allowExternalSenders: {
      type: "boolean",
      label: "Allow External Senders",
      description: "Indicates whether people external to the organization can send messages to the group",
      optional: true,
    },
    autoSubscribeNewMembers: {
      type: "boolean",
      label: "Auto Subscribe New Members",
      description: "Indicates whether new members added to the group will be auto-subscribed to receive email notifications",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "An optional description for the group",
      optional: true,
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The name to display in the address book for the group",
      optional: true,
    },
    mailNickname: {
      type: "string",
      label: "Mail Nickname",
      description: "The mail alias for the group, unique for groups in the organization. Maximum length is 64 characters. This property can contain only characters in the ASCII character set 0 - 127 except the following characters: @ () \\ [] \" ; : <> , SPACE.",
      optional: true,
    },
    securityEnabled: {
      type: "boolean",
      label: "Security Enabled",
      description: "Set to `true` for security-enabled groups",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Specifies the visibility of the group",
      options: [
        "Public",
        "Private",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.microsoftEntraId.updateGroup({
      groupId: this.groupId,
      data: {
        allowExternalSenders: this.allowExternalSenders,
        autoSubscribeNewMembers: this.autoSubscribeNewMembers,
        description: this.description,
        displayName: this.displayName,
        mailNickname: this.mailNickname,
        securityEnabled: this.securityEnabled,
        visibility: this.visibility,
      },
    });
    $.export("$summary", `Successfully updated group with ID ${this.groupId}.`);
    return response;
  },
};
