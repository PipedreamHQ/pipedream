import messagebird from "../../messagebird.app.mjs";

export default {
  key: "messagebird-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See the documentation](https://docs.bird.com/api/contacts-api/api-reference/manage-workspace-contacts/create-a-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    messagebird,
    workspaceId: {
      propDefinition: [
        messagebird,
        "workspaceId",
      ],
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The display name for the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
      optional: true,
    },
    listIds: {
      propDefinition: [
        messagebird,
        "listIds",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.messagebird.createContact({
      $,
      workspaceId: this.workspaceId,
      data: {
        displayName: this.displayName,
        identifiers: this.email && [
          {
            key: "emailaddress",
            value: this.email,
          },
        ],
        listIds: this.listIds,
      },
    });
    $.export("$summary", `Successfully created contact with ID: ${response.id}`);
    return response;
  },
};
