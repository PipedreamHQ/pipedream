// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import jiraServiceDesk from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-list-issue-attachments",
  name: "List Issue Attachments",
  description: "List metadata for every attachment on a Jira Service Desk issue. `issueIdOrKey` accepts either a Jira issue key (e.g. `IT-42`) or a numeric Jira issue ID (e.g. `10001`). Returns an array of attachment objects, each including `id`, `filename`, `size` (bytes), `mimeType`, and `content` (the download URL). Use **Download Issue Attachment** with an attachment `id` from this list to fetch the binary content. Returns an empty array (no error) when the issue exists but has no attachments. Example: issue `IT-42` with one attachment returns `[{ \"id\": \"10042\", \"filename\": \"screenshot.png\", \"size\": 84213, \"mimeType\": \"image/png\", \"content\": \"https://api.atlassian.com/ex/jira/{cloudId}/rest/api/3/attachment/content/10042\" }]`. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    jiraServiceDesk,
    cloudId: {
      propDefinition: [
        jiraServiceDesk,
        "cloudId",
      ],
    },
    issueIdOrKey: {
      propDefinition: [
        jiraServiceDesk,
        "issueIdOrKey",
      ],
    },
  },
  async run({ $ }) {
    if (!this.issueIdOrKey) {
      throw new ConfigurationError("Issue ID or Key is required.");
    }

    const rawAttachments = await this.jiraServiceDesk.getIssueAttachments({
      $,
      cloudId: this.cloudId,
      issueIdOrKey: this.issueIdOrKey,
    });

    const attachments = rawAttachments.map(({
      id, filename, size, mimeType, content,
    }) => ({
      id,
      filename,
      size,
      mimeType,
      content,
    }));

    $.export("$summary", `Found ${attachments.length} attachment(s) on issue ${this.issueIdOrKey}`);
    return attachments;
  },
};
