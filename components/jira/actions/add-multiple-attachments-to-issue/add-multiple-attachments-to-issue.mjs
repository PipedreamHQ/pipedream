import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import jira from "../../jira.app.mjs";

export default {
  key: "jira-add-multiple-attachments-to-issue",
  name: "Add Multiple Attachments To Issue",
  description: "Adds multiple attachments to an issue, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-attachments/#api-rest-api-3-issue-issueidorkey-attachments-post)",
  version: "1.0.4",
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
    files: {
      type: "string[]",
      label: "File Paths or URLs",
      description: "Provide either an array of file URLs or paths to files in the /tmp directory (for example, /tmp/myFile.pdf).",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const responses = [];

    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      const data = new FormData();
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(file);

      data.append("file", stream, {
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

      responses.push(response);
    }

    $.export("$summary", `Attachment/s were added to the issue with ID (or key): ${this.issueIdOrKey}`);
    return responses;
  },
};
