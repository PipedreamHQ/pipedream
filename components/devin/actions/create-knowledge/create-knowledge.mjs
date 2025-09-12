import devin from "../../devin.app.mjs";

export default {
  key: "devin-create-knowledge",
  name: "Create Knowledge",
  description: "Create a new knowledge object to share information with Devin. [See the documentation](https://docs.devin.ai/api-reference/knowledge/create-knowledge)",
  version: "0.0.1",
  type: "action",
  props: {
    devin,
    body: {
      propDefinition: [
        devin,
        "body",
      ],
    },
    name: {
      propDefinition: [
        devin,
        "name",
      ],
    },
    triggerDescription: {
      propDefinition: [
        devin,
        "triggerDescription",
      ],
    },
    parentFolderId: {
      propDefinition: [
        devin,
        "folderId",
      ],
      label: "Parent Folder ID",
      description: "The ID of the folder to create the knowledge in",
      optional: true,
    },
    pinnedRepo: {
      propDefinition: [
        devin,
        "pinnedRepo",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.devin.createKnowledge({
      $,
      data: {
        body: this.body,
        name: this.name,
        parent_folder_id: this.parentFolderId,
        trigger_description: this.triggerDescription,
        pinned_repo: this.pinnedRepo,
      },
    });

    $.export("$summary", `Successfully created knowledge object: ${this.name}`);
    return response;
  },
};
