import { parseObject } from "../../common/utils.mjs";
import taiga from "../../taiga.app.mjs";

export default {
  key: "taiga-create-issue",
  name: "Create Issue",
  description: "Create a new issue in a Taiga project. [See the documentation](https://docs.taiga.io/api.html#issues-create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    taiga,
    projectId: {
      propDefinition: [
        taiga,
        "projectId",
      ],
    },
    subject: {
      propDefinition: [
        taiga,
        "issueSubject",
      ],
    },
    description: {
      propDefinition: [
        taiga,
        "issueDescription",
      ],
      optional: true,
    },
    priority: {
      propDefinition: [
        taiga,
        "issuePriority",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
    severity: {
      propDefinition: [
        taiga,
        "issueSeverity",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        taiga,
        "issueStatus",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
    type: {
      propDefinition: [
        taiga,
        "issueType",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
    assignedTo: {
      propDefinition: [
        taiga,
        "userId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      label: "Assigned To",
      description: "User to assign the issue to",
      optional: true,
    },
    milestone: {
      propDefinition: [
        taiga,
        "milestone",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        taiga,
        "tags",
      ],
      optional: true,
    },
    blockedNote: {
      propDefinition: [
        taiga,
        "issueBlockedNote",
      ],
      optional: true,
    },
    isBlocked: {
      propDefinition: [
        taiga,
        "isBlocked",
      ],
      optional: true,
    },
    watchers: {
      propDefinition: [
        taiga,
        "userId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      type: "string[]",
      label: "Watchers",
      description: "Users to watch the issue",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.taiga.createIssue({
      $,
      data: {
        subject: this.subject,
        description: this.description,
        project: this.projectId,
        priority: this.priority,
        severity: this.severity,
        status: this.status,
        type: this.type,
        assigned_to: this.assignedTo,
        tags: parseObject(this.tags),
        blocked_note: this.blockedNote,
        is_blocked: this.isBlocked,
        milestone: this.milestone,
        watchers: parseObject(this.watchers),
      },
    });

    $.export("$summary", `Created issue: ${response.id}`);
    return response;
  },
};
