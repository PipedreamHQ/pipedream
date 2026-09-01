// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import jiraServiceDesk from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-list-issue-attachments",
  name: "List Issue Attachments",
  description: "List metadata for every attachment on a Jira Service Desk request. `issueIdOrKey` accepts either a Jira issue key (e.g. `IT-42`) or a numeric Jira issue ID (e.g. `10001`). Results are paginated automatically up to `maxResults`. Returns `{ attachments, truncated }`, where each attachment includes `id`, `filename`, `size` (bytes), and `mimeType`, and `truncated` is `true` when more attachments remained unfetched. Use **Download Issue Attachment** with an attachment `id` and the same `issueIdOrKey` to fetch the binary content. Returns an empty array (no error) when the request exists but has no attachments. Example: issue `IT-42` with one attachment returns `{ \"attachments\": [{ \"id\": \"10042\", \"filename\": \"screenshot.png\", \"size\": 84213, \"mimeType\": \"image/png\" }], \"truncated\": false }`. [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-issueidorkey-attachment-get)",
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
    maxResults: {
      propDefinition: [
        jiraServiceDesk,
        "maxResults",
      ],
      label: "Max Attachments",
      description: "Maximum number of attachments to return across all pages (1-1000).",
    },
  },
  async run({ $ }) {
    if (!this.issueIdOrKey) {
      throw new ConfigurationError("Issue ID or Key is required.");
    }

    const {
      attachments, hasMore,
    } = await this.jiraServiceDesk.getIssueAttachments({
      $,
      cloudId: this.cloudId,
      issueIdOrKey: this.issueIdOrKey,
      maxResults: this.maxResults,
    });

    $.export("$summary", `Found ${attachments.length}${hasMore
      ? "+"
      : ""} attachment(s) on issue ${this.issueIdOrKey}`);
    return {
      attachments,
      truncated: hasMore,
    };
  },
};
