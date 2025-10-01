import devin from "../../devin.app.mjs";

export default {
  key: "devin-create-session",
  name: "Create Session",
  description: "Create a new session with Devin. [See the documentation](https://docs.devin.ai/api-reference/sessions/create-a-new-devin-session)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    devin,
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The task description for Devin",
    },
    snapshotId: {
      type: "string",
      label: "Snapshot ID",
      description: "ID of a machine snapshot to use",
      optional: true,
    },
    unlisted: {
      type: "boolean",
      label: "Unlisted",
      description: "Whether the session should be unlisted",
      optional: true,
    },
    idempotent: {
      type: "boolean",
      label: "Idempotent",
      description: "Enable idempotent session creation",
      optional: true,
    },
    maxAcuLimit: {
      type: "integer",
      label: "Max ACU Limit",
      description: "Maximum ACU limit for the session",
      optional: true,
    },
    secretIds: {
      propDefinition: [
        devin,
        "secretIds",
      ],
      optional: true,
    },
    knowledgeIds: {
      propDefinition: [
        devin,
        "knowledgeId",
      ],
      type: "string[]",
      label: "Knowledge IDs",
      description: "The IDs of the knowledge objects to use",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "List of tags to add to the session",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Custom title for the session. If None, a title will be generated automatically",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.devin.createSession({
      $,
      data: {
        prompt: this.prompt,
        snapshot_id: this.snapshotId,
        unlisted: this.unlisted,
        idempotent: this.idempotent,
        max_acu_limit: this.maxAcuLimit,
        secret_ids: this.secretIds,
        knowledge_ids: this.knowledgeIds,
        tags: this.tags,
        title: this.title,
      },
    });

    $.export("$summary", `Successfully created session with ID: ${response.session_id}`);
    return response;
  },
};
