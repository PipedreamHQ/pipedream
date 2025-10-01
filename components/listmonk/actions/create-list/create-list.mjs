import listmonk from "../../listmonk.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "listmonk-create-list",
  name: "Create List",
  description: "Creates a new list in Listmonk. [See the documentation](https://listmonk.app/docs/apis/lists/#post-apilists)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    listmonk,
    name: {
      type: "string",
      label: "List Name",
      description: "The name of the list to create.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the list to create.",
      options: constants.LIST_TYPE_OPTIONS,
    },
    optin: {
      type: "string",
      label: "Optin",
      description: "The type of optin for the list.",
      options: constants.OPTIN_OPTIONS,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags associated with the list.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.listmonk.createList({
      data: {
        name: this.name,
        type: this.type,
        optin: this.optin,
        tags: this.tags,
      },
      $,
    });

    if (data?.id) {
      $.export("$summary", `Successfully created list with ID ${data.id}.`);
    }

    return data;
  },
};
