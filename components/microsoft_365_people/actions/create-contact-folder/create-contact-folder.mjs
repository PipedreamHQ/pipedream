import microsoftPeople from "../../microsoft_365_people.app.mjs";

export default {
  key: "microsoft_365_people-create-contact-folder",
  name: "Create Contact Folder",
  description: "Create a new contact folder in Microsoft 365 People. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-post-contactfolders?view=graph-rest-1.0&tabs=http)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoftPeople,
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The display name of the new contact folder",
    },
  },
  async run({ $ }) {
    const response = await this.microsoftPeople.createFolder({
      data: {
        displayName: this.displayName,
      },
      $,
    });

    if (response.id) {
      $.export("$summary", `Successfully created folder with ID ${response.id}.`);
    }

    return response;
  },
};
