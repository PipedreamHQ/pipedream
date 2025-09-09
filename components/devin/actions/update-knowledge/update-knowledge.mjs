import devin from "../../devin.app.mjs";

export default {
  key: "devin-update-knowledge",
  name: "Update Knowledge",
  description: "Update an existing knowledge object. [See the documentation](https://docs.devin.ai/api-reference/knowledge/update-knowledge)",
  version: "0.0.1",
  type: "action",
  props: {
    devin,
    knowledgeId: {
      propDefinition: [
        devin,
        "knowledgeId",
      ],
    },
    body: {
      propDefinition: [
        devin,
        "body",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        devin,
        "name",
      ],
      optional: true,
    },
    triggerDescription: {
      propDefinition: [
        devin,
        "triggerDescription",
      ],
      optional: true,
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
    const { knowledge } = await this.devin.listKnowledge({
      $,
    });

    const current = knowledge.find(({ id }) => id === this.knowledgeId);

    const response = await this.devin.updateKnowledge({
      $,
      knowledgeId: this.knowledgeId,
      data: {
        body: this.body || current.body,
        name: this.name || current.name,
        trigger_description: this.triggerDescription || current.trigger_description,
        parent_folder_id: this.parentFolderId || current.parent_folder_id,
        pinned_repo: this.pinnedRepo || current.pinned_repo,
      },
    });

    $.export("$summary", `Successfully updated knowledge object: ${this.knowledgeId}`);
    return response;
  },
};
