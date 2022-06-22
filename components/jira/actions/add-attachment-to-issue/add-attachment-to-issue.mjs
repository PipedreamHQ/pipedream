import base from "../common/base.mjs";
import fs from "fs";
import FormData from "form-data";

const { jira } = base.props;

export default {
  ...base,
  key: "jira-add-attachment-to-issue",
  name: "Add Attachment To Issue",
  description: "Adds an attachment to an issue. [See docs here](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-attachments/#api-rest-api-3-issue-issueidorkey-attachments-post)",
  version: "0.3.0",
  type: "action",
  props: {
    ...base.props,
    issueId: {
      propDefinition: [
        jira,
        "issueId",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    filename: {
      label: "Filename",
      description: "Name of the file to add as an attachment. Must exist in the related workflow's `/tmp` folder.",
      type: "string",
    },
  },
  async run({ $ }) {
    const data = new FormData();
    const file = fs.createReadStream(`/tmp/${this.filename}`);
    data.append("file", file);

    const response = await this.jira.createIssueAttachment({
      $,
      cloudId: this.cloudId,
      issueId: this.issueId,
      data,
    });

    $.export("$summary", "Successfully added attachment to issue");

    return response;
  },
};
