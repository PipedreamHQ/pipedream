import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";
import utils from "../../common/utils.mjs";
import jira from "../../jira.app.mjs";

export default {
  key: "jira-add-attachment-to-issue",
  name: "Add Attachment To Issue",
  description: "Adds an attachment to an issue, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-attachments/#api-rest-api-3-issue-issueidorkey-attachments-post)",
  version: "0.2.11",
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
      label: "File name",
      description: "Path of the file in /tmp folder to add as an attachment. To upload a file to /tmp folder, please follow the [doc here](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
  },
  async run({ $ }) {
    const data = new FormData();
    const path = utils.checkTmp(this.filename);
    if (!fs.existsSync(path)) {
      throw new ConfigurationError("File does not exist!");
    }
    const file = fs.createReadStream(path);
    const stats = fs.statSync(path);
    data.append("file", file, {
      knownLength: stats.size,
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
