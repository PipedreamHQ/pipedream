import { ConfigurationError } from "@pipedream/platform";
import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-create-document",
  name: "Create Document",
  description:
    "Create a new Linear document (a spec, brief, runbook or meeting notes) and attach it to exactly one project, initiative or team so teammates can find it."
    + " Set exactly one of `projectId`, `initiativeId` or `teamId`. If the user did not say where the document belongs and the choice is ambiguous, ask them before calling this tool rather than guessing."
    + " Use **List Projects**, **List Initiatives** or **Get Teams** to look up the ID."
    + " To change an existing document, use **Update Document** instead; to check whether a document already exists, use **Search Documents**."
    + " `content` is markdown. The response does not echo the body back; use **Get Document** to read it."
    + " Example: `title: \"Dust Storm Shelter Spec\"`, `content: \"# Overview\\n\\nShelter requirements...\"`, `projectId: \"a1b2c3d4-0000-0000-0000-000000000001\"` → returns `{success: true, document: {id: \"29a25062-...\", title: \"Dust Storm Shelter Spec\", slugId: \"10b5bc2940c7\", url: \"https://linear.app/.../document/dust-storm-shelter-spec-10b5bc2940c7\", project: {id: \"a1b2c3d4-...\", name: \"Mars Colony\"}}}`."
    + " [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=documentCreate)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    linearApp,
    title: {
      propDefinition: [
        linearApp,
        "documentTitle",
      ],
    },
    content: {
      propDefinition: [
        linearApp,
        "documentContent",
      ],
    },
    projectId: {
      propDefinition: [
        linearApp,
        "projectId",
      ],
      description: "The UUID or identifier of the project to attach the document to (e.g. `a1b2c3d4-0000-0000-0000-000000000001` or `P-LIN-123`). Set exactly one of `projectId`, `initiativeId` or `teamId`. Use **List Projects** to find valid project IDs.",
      optional: true,
    },
    initiativeId: {
      propDefinition: [
        linearApp,
        "initiativeId",
      ],
      description: "The UUID or identifier of the initiative to attach the document to (e.g. `b2c3d4e5-0000-0000-0000-000000000002` or `I-12`). Set exactly one of `projectId`, `initiativeId` or `teamId`. Use **List Initiatives** to find valid initiative IDs.",
      optional: true,
    },
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
      ],
      description: "The UUID of the team to attach the document to (e.g. `9d1c3f7e-2b48-4c6a-9f1e-5a7b8c9d0e1f`). The short team key such as `ENG` is rejected. Set exactly one of `projectId`, `initiativeId` or `teamId`. Use **Get Teams** to find valid team IDs.",
      optional: true,
    },
    icon: {
      propDefinition: [
        linearApp,
        "documentIcon",
      ],
    },
    color: {
      propDefinition: [
        linearApp,
        "documentColor",
      ],
    },
  },
  async run({ $ }) {
    if (!this.title?.trim()) {
      throw new ConfigurationError("`title` must not be empty.");
    }

    const parents = [
      this.projectId,
      this.initiativeId,
      this.teamId,
    ].filter(Boolean);
    if (parents.length !== 1) {
      throw new ConfigurationError("Set exactly one of `projectId`, `initiativeId` or `teamId` to choose where the document is attached.");
    }

    const input = Object.fromEntries(Object.entries({
      title: this.title,
      content: this.content,
      projectId: this.projectId,
      initiativeId: this.initiativeId,
      teamId: this.teamId,
      icon: this.icon,
      color: this.color,
    }).filter(([
      , value,
    ]) => value !== undefined && value !== ""));

    const response = await this.linearApp.createDocument({
      $,
      input,
    });

    $.export("$summary", `Successfully created document "${response.document.title}"`);

    return response;
  },
};
