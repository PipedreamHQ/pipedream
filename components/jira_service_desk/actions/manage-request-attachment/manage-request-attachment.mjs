// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import jiraServiceDesk from "../../jira_service_desk.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "jira_service_desk-manage-request-attachment",
  name: "Manage Request Attachment",
  description:
    "Adds, replaces, or deletes a single attachment on a customer request (ticket) that already exists."
    + " To attach file(s) while creating a brand-new request, use **Create Request**'s `attachments` prop instead — use this tool only for requests that already exist."
    + " Set `operation` to `add` to attach a new file, `update` to replace an existing attachment with a different file (there's no in-place replace in the API, so this uploads the new file and only deletes the old one once the new one is confirmed attached), or `delete` to remove an attachment."
    + " `add` and `update` require `serviceDeskId` (the temp-file upload step is scoped by service desk, not by issue) — use **List Service Desks** to find it, or read it off the response of the request that created the ticket."
    + " `update` and `delete` require `attachmentId`, the numeric ID of the attachment being replaced or removed; this is returned in the `attachments` array of a prior `add` or `update` call on the same request."
    + " Worked example: to replace an attachment `10050` on request `HD-12` with a new file, call with Operation `update`, Issue ID Or Key `HD-12`, Service Desk ID `1`, Attachment ID `10050`, and File `/tmp/revised-report.pdf`."
    + " For `update`, if the new file attaches successfully but removing the old attachment then fails, the response includes a `deleteError` string alongside the successful attachment data — the request ends up with both files rather than losing either one, and the error is never masked as a full failure."
    + " By default the attachment is visible to the customer who raised the request (`public: true`); set `public` to `false` to attach an internal-only file."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-issueidorkey-attachment-post)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jiraServiceDesk,
    cloudId: {
      propDefinition: [
        jiraServiceDesk,
        "cloudId",
      ],
    },
    operation: {
      type: "string",
      label: "Operation",
      description: "Whether to add a new attachment, replace (`update`) an existing one, or delete one.",
      options: [
        "add",
        "update",
        "delete",
      ],
    },
    issueIdOrKey: {
      propDefinition: [
        jiraServiceDesk,
        "issueIdOrKey",
      ],
    },
    serviceDeskId: {
      propDefinition: [
        jiraServiceDesk,
        "serviceDeskId",
      ],
      description: "Required for `add` and `update`. The service desk the request belongs to. Use **List Service Desks** to find valid IDs (e.g. `1`).",
      optional: true,
    },
    file: {
      type: "string",
      label: "File",
      description: "Required for `add` and `update`. The file to attach, as a file URL or a path to a file in the /tmp directory (e.g. `/tmp/myFile.pdf`).",
      format: "file-ref",
      optional: true,
    },
    attachmentId: {
      type: "string",
      label: "Attachment ID",
      description: "Required for `update` and `delete`. The numeric ID of the attachment being replaced or removed, e.g. `10050`. Returned in the `attachments` array of a prior `add` or `update` call, or use **List Issue Attachments** to find the ID of an attachment you didn't just add yourself.",
      optional: true,
    },
    public: {
      type: "boolean",
      label: "Public",
      description: "Whether the attached file is visible to the customer who raised the request. Defaults to `true`; set to `false` to attach an internal-only file. Only applies to `add` and `update`.",
      optional: true,
      default: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      jiraServiceDesk,
      cloudId,
      operation,
      issueIdOrKey,
      serviceDeskId,
      file,
      attachmentId,
      public: isPublic,
    } = this;

    const verifyAttachmentBelongsToRequest = async () => {
      const { attachments } = await jiraServiceDesk.getIssueAttachments({
        $,
        cloudId,
        issueIdOrKey,
        maxResults: constants.MAX_RESULTS_MAX,
      });
      if (!attachments.some(({ id }) => id === attachmentId)) {
        throw new ConfigurationError(`Attachment ID "${attachmentId}" was not found on request "${issueIdOrKey}". Run List Issue Attachments to confirm the ID and issue match.`);
      }
    };

    if (operation === "delete") {
      if (!attachmentId) {
        throw new ConfigurationError("Attachment ID is required to delete an attachment.");
      }
      await verifyAttachmentBelongsToRequest();
      await jiraServiceDesk.deleteAttachment({
        $,
        cloudId,
        attachmentId,
      });
      $.export("$summary", `Deleted attachment ${attachmentId} from request ${issueIdOrKey}`);
      return {
        deleted: true,
        attachmentId,
      };
    }

    if (!serviceDeskId) {
      throw new ConfigurationError("Service Desk ID is required to add or update an attachment.");
    }
    if (!file) {
      throw new ConfigurationError("File is required to add or update an attachment.");
    }
    if (operation === "update") {
      if (!attachmentId) {
        throw new ConfigurationError("Attachment ID is required to update (replace) an attachment.");
      }
      await verifyAttachmentBelongsToRequest();
    }

    const attachResponse = await jiraServiceDesk.attachFilesToRequestFromSource({
      $,
      cloudId,
      serviceDeskId,
      issueIdOrKey,
      files: [
        file,
      ],
      isPublic,
    });

    // The new attachment must succeed before the old one is removed — deleting first
    // would leave the request with no attachment at all if the upload then failed.
    if (operation === "update") {
      try {
        await jiraServiceDesk.deleteAttachment({
          $,
          cloudId,
          attachmentId,
        });
      } catch (error) {
        $.export("$summary", `Added the new attachment on request ${issueIdOrKey}, but the old attachment (${attachmentId}) could not be removed: ${error.message}`);
        return {
          ...attachResponse,
          deleteError: error.message,
        };
      }
    }

    $.export("$summary", `${operation === "update"
      ? "Replaced"
      : "Added"} attachment on request ${issueIdOrKey}`);
    return attachResponse;
  },
};
