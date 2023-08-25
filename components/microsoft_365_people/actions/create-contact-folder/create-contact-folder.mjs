import microsoftPeople from "../../microsoft_365_people.app.mjs";

export default {
  key: "microsoft_365_people-create-contact-folder",
  name: "Create Contact Folder",
  description: "Create a new contact folder in Microsoft 365 People. Note: Only folders containing at least one contact are displayed in the Microsoft 365 People UI. Use `update-contact` or `create-contact` to add contacts to list. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-post-contactfolders?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  props: {
    microsoftPeople,
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The display name of the new contact folder",
    },
    parentFolderId: {
      propDefinition: [
        microsoftPeople,
        "folderId",
      ],
      label: "Parent Folder",
      description: "Identifier of the new folder's parent folder",
    },
  },
  async run({ $ }) {
    const response = await this.microsoftPeople.createFolder({
      data: {
        displayName: this.displayName,
        parentFolderId: this.parentFolderId,
      },
      $,
    });

    if (response.id) {
      $.export("$summary", `Successfully created folder with ID ${response.id}.`);
    }

    return response;
  },
};
