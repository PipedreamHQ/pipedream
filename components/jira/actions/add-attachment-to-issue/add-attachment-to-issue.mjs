import fs from "fs";
import FormData from "form-data";
import jira from "../../jira.app.mjs";

export default {
  key: "jira-add-attachment-to-issue",
  name: "Add Attachment To Issue",
  description: "Adds an attachment to an issue, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-attachments/#api-rest-api-3-issue-issueidorkey-attachments-post)",
  version: "0.2.2",
  type: "action",
  props: {
    jira,
    issueIdOrKey: {
      propDefinition: [
        jira,
        "issueIdOrKey",
      ],
    },
    filename: {
      type: "string",
      label: "File name",
      description: "Name of the file to add as an attachment. Must exist in the related workflow's `/tmp` folder.",
    },
  },
  async run({ $ }) {
    const data = new FormData();
    const file = fs.createReadStream(`${this.filename}`);
    data.append("file", file);
    const headers = {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      "X-Atlassian-Token": "no-check",
    };
    const response = await this.jira.addAttachmentToIssue({
      $,
      issueIdOrKey: this.issueIdOrKey,
      headers,
      data,
    });
    $.export("$summary", `Attachment has been added to the issue with ID(or key): ${this.issueIdOrKey}`);
    return response;
  },
};
