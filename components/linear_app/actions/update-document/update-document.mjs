import { ConfigurationError } from "@pipedream/platform";
import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-update-document",
  name: "Update Document",
  description:
    "Update an existing Linear document: rename it, rewrite its body, move it to another project, initiative, team or issue, change its owner, or change its icon or color."
    + " Only the fields you provide are changed; set at least one besides `documentId`."
    + " **`content` replaces the whole body.** To append to or edit part of a document, first read the current body with **Get Document**, then send the full combined markdown. Leave `content` unset for a rename so the body is kept."
    + " To move the document, set at most one of `projectId`, `initiativeId`, `teamId` or `issueId`."
    + " Use **Search Documents** to find the document ID. To create a new document, use **Create Document**."
    + " The response does not echo the body back; use **Get Document** to read it."
    + " Example (rename): `documentId: \"10b5bc2940c7\"`, `title: \"[DRAFT] Q3 Hiring Plan\"` → returns `{success: true, document: {id: \"29a25062-...\", title: \"[DRAFT] Q3 Hiring Plan\", slugId: \"10b5bc2940c7\", url: \"https://linear.app/...\"}}`."
    + " Example (replace body): `documentId: \"10b5bc2940c7\"`, `content: \"# Q3 Hiring Plan\\n\\nUpdated goals...\"`."
    + " [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=documentUpdate)",
  version: "0.0.3",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    linearApp,
    documentId: {
      propDefinition: [
        linearApp,
        "documentId",
      ],
    },
    title: {
      propDefinition: [
        linearApp,
        "documentTitle",
      ],
      description: "The new title of the document. Example: `Q3 Hiring Plan (final)`.",
      optional: true,
    },
    content: {
      propDefinition: [
        linearApp,
        "documentContent",
      ],
      description: "The new document body in markdown. **Replaces the existing body in full.** To keep existing text, read it first with **Get Document** and send the combined markdown. Example: `# Q3 Hiring Plan\\n\\nUpdated goals...`.",
    },
    projectId: {
      propDefinition: [
        linearApp,
        "projectId",
      ],
      description: "Move the document to this project (UUID or identifier, e.g. `a1b2c3d4-0000-0000-0000-000000000001` or `P-LIN-123`). Set at most one of `projectId`, `initiativeId`, `teamId` or `issueId`. Use **List Projects** to find valid project IDs.",
      optional: true,
    },
    initiativeId: {
      propDefinition: [
        linearApp,
        "initiativeId",
      ],
      description: "Move the document to this initiative (UUID or identifier, e.g. `b2c3d4e5-0000-0000-0000-000000000002` or `I-12`). Set at most one of `projectId`, `initiativeId`, `teamId` or `issueId`. Use **List Initiatives** to find valid initiative IDs.",
      optional: true,
    },
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
      ],
      description: "Move the document to this team (UUID, e.g. `9d1c3f7e-2b48-4c6a-9f1e-5a7b8c9d0e1f`). The short team key such as `ENG` is rejected. Set at most one of `projectId`, `initiativeId`, `teamId` or `issueId`. Use **Get Teams** to find valid team IDs.",
      optional: true,
    },
    issueId: {
      propDefinition: [
        linearApp,
        "issueId",
      ],
      description: "Move the document to this issue (UUID or identifier, e.g. `7df5e7f9-a357-4539-ae94-4a004fec635f` or `ENG-123`). Set at most one of `projectId`, `initiativeId`, `teamId` or `issueId`. Use **Search Issues** to find valid issues.",
      optional: true,
    },
    ownerId: {
      propDefinition: [
        linearApp,
        "assigneeId",
      ],
      label: "Owner",
      description: "The UUID of the user to make the document owner (e.g. `abc12345-0000-0000-0000-000000000001`). Use **List Users** to find valid user IDs.",
    },
    icon: {
      propDefinition: [
        linearApp,
        "documentIcon",
      ],
      description: "The new document icon, as an emoji shortcode. Raw emoji such as `📄` are rejected. Example: `:page_facing_up:`.",
    },
    color: {
      propDefinition: [
        linearApp,
        "documentColor",
      ],
      description: "The new icon color, as a hex code. Example: `#5e6ad2`.",
    },
  },
  async run({ $ }) {
    const parents = [
      this.projectId,
      this.initiativeId,
      this.teamId,
      this.issueId,
    ].filter(Boolean);
    if (parents.length > 1) {
      throw new ConfigurationError("Set at most one of `projectId`, `initiativeId`, `teamId` or `issueId` to move the document.");
    }

    const input = Object.fromEntries(Object.entries({
      title: this.title?.trim()
        ? this.title
        : undefined,
      content: this.content,
      projectId: this.projectId,
      initiativeId: this.initiativeId,
      teamId: this.teamId,
      issueId: this.issueId,
      ownerId: this.ownerId,
      icon: this.icon,
      color: this.color,
    }).filter(([
      key,
      value,
    ]) => value !== undefined && (value !== "" || key === "content")));

    if (Object.keys(input).length === 0) {
      throw new ConfigurationError("Set at least one field to update besides `documentId`.");
    }

    const response = await this.linearApp.updateDocument({
      $,
      documentId: this.documentId,
      input,
    });

    $.export("$summary", `Successfully updated document "${response.document.title}"`);

    return response;
  },
};
