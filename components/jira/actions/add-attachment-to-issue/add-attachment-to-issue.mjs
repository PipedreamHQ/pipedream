import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import jira from "../../jira.app.mjs";

export default {
  key: "jira-add-attachment-to-issue",
  name: "Add Attachment To Issue",
  description: "Adds an attachment to an issue, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-attachments/#api-rest-api-3-issue-issueidorkey-attachments-post)",
  version: "0.2.12",
  type: "action",
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
    issueIdOrKey: {
      propDefinition: [
        jira,
        "issueIdOrKey",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    filename: {
      type: "string",
      label: "File",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFlie.pdf).",
    },
  },
  async run({ $ }) {
    const data = new FormData();
    const file = this.filename;

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(file);

    data .append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const headers = {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      "X-Atlassian-Token": "no-check",
    };
    const response = await this.jira.addAttachmentToIssue({
      $,
      cloudId: this.cloudId,
      issueIdOrKey: this.issueIdOrKey,
      headers,
      data,
    });
    $.export("$summary", `Attachment has been added to the issue with ID(or key): ${this.issueIdOrKey}`);
    return response;
  },
};
