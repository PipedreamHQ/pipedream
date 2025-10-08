import {
  cleanObj, parseObject,
} from "../../common/utils.mjs";
import taiga from "../../taiga.app.mjs";

export default {
  key: "taiga-update-issue",
  name: "Update Issue",
  description: "Update an existing issue in a Taiga project. [See the documentation](https://docs.taiga.io/api.html#issues-edit)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    issueId: {
      propDefinition: [
        taiga,
        "issueId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    subject: {
      propDefinition: [
        taiga,
        "issueSubject",
      ],
      optional: true,
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
    const issue = await this.taiga.getIssue({
      issueId: this.issueId,
    });
    const response = await this.taiga.updateIssue({
      $,
      issueId: this.issueId,
      data: cleanObj({
        version: issue.version,
        subject: this.subject,
        description: this.description,
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
        project: this.projectId,
      }),
    });

    $.export("$summary", `Updated issue: ${response.id}`);
    return response;
  },
};
