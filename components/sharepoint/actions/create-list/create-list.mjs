import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-create-list",
  name: "Create List",
  description: "Create a new list in Microsoft Sharepoint. [See the documentation](https://learn.microsoft.com/en-us/graph/api/list-create?view=graph-rest-1.0&tabs=http)",
  version: "0.0.11",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sharepoint,
    siteId: {
      propDefinition: [
        sharepoint,
        "siteId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the list",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the list",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sharepoint.createList({
      siteId: this.siteId,
      data: {
        displayName: this.name,
        description: this.description,
      },
    });

    if (response?.id) {
      $.export("$summary", `Successfully created list with ID ${response.id}.`);
    }

    return response;
  },
};
