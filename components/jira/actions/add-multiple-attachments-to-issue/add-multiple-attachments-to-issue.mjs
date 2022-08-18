import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";
import utils from "../../common/utils.mjs";
import jira from "../../jira.app.mjs";

export default {
  key: "jira-add-multiple-attachments-to-issue",
  name: "Add Multiple Attachments To Issue",
  description: "Adds multiple attachments to an issue, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-attachments/#api-rest-api-3-issue-issueidorkey-attachments-post)",
  version: "0.0.1",
  type: "action",
  props: {
    jira,
    issueIdOrKey: {
      propDefinition: [
        jira,
        "issueIdOrKey",
      ],
    },
    filenames: {
      type: "string[]",
      label: "File names",
      description: "Array of file paths in `/tmp` folder to add as attachments. To upload a file to `/tmp` folder, please follow the [doc here](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
  },
  async run({ $ }) {
    const responses = [];

    for (let i = 0; i < this.filenames.length; i++) {
      const filename = this.filenames[i];
      const data = new FormData();
      const path = utils.checkTmp(filename);
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