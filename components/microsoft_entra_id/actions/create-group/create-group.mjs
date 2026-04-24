import microsoftEntraId from "../../microsoft_entra_id.app.mjs";

export default {
  key: "microsoft_entra_id-create-group",
  name: "Create Group",
  description: "Creates a new group in Microsoft Entra ID. [See the documentation](https://learn.microsoft.com/en-us/graph/api/group-post-groups?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    microsoftEntraId,
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The name to display in the address book for the group",
    },
    mailEnabled: {
      type: "boolean",
      label: "Mail Enabled",
      description: "Set to `true` for mail-enabled groups",
    },
    mailNickname: {
      type: "string",
      label: "Mail Nickname",
      description: "The mail alias for the group, unique for groups in the organization. Maximum length is 64 characters. This property can contain only characters in the ASCII character set 0 - 127 except the following characters: @ () \\ [] \" ; : <> , SPACE.",
    },
    securityEnabled: {
      type: "boolean",
      label: "Security Enabled",
      description: "Set to `true` for security-enabled groups",
    },
  },
  async run({ $ }) {
    const response = await this.microsoftEntraId.createGroup({
      data: {
        displayName: this.displayName,
        mailEnabled: this.mailEnabled,
        mailNickname: this.mailNickname,
        securityEnabled: this.securityEnabled,
      },
    });
    $.export("$summary", `Successfully created group with ID ${response.id}.`);

    return response;
  },
};
